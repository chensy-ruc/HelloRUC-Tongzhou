#!/usr/bin/env python3

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "site-data.js"
BUILDING_DIR = ROOT / "通州校区建筑"
REAL_BUILDING_DIR = BUILDING_DIR / "已有建筑实景"
FUTURE_BUILDING_DIR = BUILDING_DIR / "未有建筑设计图"
ICON_DIR = BUILDING_DIR / "地图建筑小图"
MUSEUM_DIR = ROOT / "通州校区博物馆"
PLACES_DIR = ROOT / "通州校区附近餐饮及酒店"
VOLUNTEER_DIR = ROOT / "通州校区志愿者"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".JPG", ".JPEG", ".PNG"}
LANG_FILE_MAP = {
    "cn": "cn",
    "en": "en",
    "es": "es",
    "fr": "fr",
    "ge": "de",
    "de": "de",
    "ja": "ja",
    "ru": "ru",
}

BUILDING_TYPES = {
    "中心食堂": "餐饮配套",
    "北区食堂": "餐饮配套",
    "北一公寓": "住宿生活",
    "北二公寓及生活服务区": "住宿生活",
    "西运动场": "运动健康",
    "健康中心": "校园服务",
    "医务中心": "校园服务",
    "学生事务中心": "校园服务",
    "校园运行中心": "校园服务",
    "先锋剧场": "艺术文化",
    "艺术楼": "艺术文化",
    "公学一楼": "教学科研",
    "公学二楼": "教学科研",
    "京东群学楼": "教学科研",
    "叶澄海楼": "教学科研",
    "未来传播中心": "教学科研",
    "北区学部楼（公学三楼）": "教学科研",
    "管理学部楼（公学四楼）": "教学科研",
    "西南学部楼": "教学科研",
}

# Percent coordinates on the full 10131 x 5600 hand-drawn map image.
# Markers are placed next to the map's own named labels or their red dashed callouts.
POSITION_OVERRIDES = {
    "北一公寓": [44.6, 44.6],
    "北二公寓及生活服务区": [54.8, 25.4],
    "北区食堂": [51.0, 32.0],
    "北区学部楼（公学三楼）": [63.8, 23.5],
    "京东群学楼": [23.2, 68.5],
    "医务中心": [65.2, 52.6],
    "公学一楼": [84.5, 86.0],
    "公学二楼": [62.2, 32.6],
    "学生事务中心": [76.0, 57.8],
    "校园运行中心": [85.4, 75.8],
    "管理学部楼（公学四楼）": [74.8, 23.7],
    "艺术楼": [34.8, 66.6],
    "西南学部楼": [34.6, 72.8],
    "叶澄海楼": [30.0, 54.4],
    "西运动场": [32.2, 43.3],
}


def rel(path):
    return path.relative_to(ROOT).as_posix()


def read_text(path):
    text = path.read_text(encoding="utf-8").strip()
    return text


def load_site_data():
    source = DATA_FILE.read_text(encoding="utf-8")
    match = re.search(r"window\.SITE_DATA\s*=\s*(\{[\s\S]*\});\s*$", source)
    if not match:
        raise ValueError("site-data.js does not contain a window.SITE_DATA object")
    return json.loads(match.group(1))


def image_files(path):
    if not path.exists():
        return []
    return [
        rel(item)
        for item in sorted(path.iterdir(), key=lambda p: p.name)
        if item.is_file() and item.suffix in IMAGE_EXTS
    ]


def read_multilang(path, pattern="*.txt"):
    result = {}
    if not path.exists():
        return result
    for file_path in sorted(path.glob(pattern), key=lambda p: p.name):
        stem = file_path.stem
        code = stem.split("_")[-1] if "_" in stem else stem
        code = LANG_FILE_MAP.get(code)
        if code:
            text = read_text(file_path)
            if text:
                result[code] = text
    return result


def first_existing_icon(name):
    candidates = [
        ICON_DIR / f"{name}.png",
        ICON_DIR / f"{name.replace('（公学三楼）', '')}.png",
        ICON_DIR / f"{name.replace('（公学四楼）', '')}.png",
        ICON_DIR / f"{name.replace('及生活服务区', '')}.png",
    ]
    for path in candidates:
        if path.exists():
            return rel(path)
    return ""


def building_record(folder, prior, index, status):
    name = folder.name
    is_open = status == "open"
    return {
        "id": prior.get("id") or f"{'b' if is_open else 'f'}{index:02d}",
        "name": name,
        "type": BUILDING_TYPES.get(name, prior.get("type", "校园建筑")),
        "status": status,
        "mapEnabled": is_open and name in POSITION_OVERRIDES,
        "position": POSITION_OVERRIDES.get(name) if is_open else None,
        "images": image_files(folder),
        "icon": first_existing_icon(name) or prior.get("icon", ""),
        "description": read_multilang(folder / "简介", "*.txt") or prior.get("description", {}),
    }


def scan_buildings(previous):
    previous_by_name = {item.get("name"): item for item in previous.get("buildings", [])}
    buildings = []
    for index, folder in enumerate(sorted(REAL_BUILDING_DIR.iterdir(), key=lambda p: p.name), start=1):
        if not folder.is_dir():
            continue
        buildings.append(building_record(folder, previous_by_name.get(folder.name, {}), index, "open"))
    if FUTURE_BUILDING_DIR.exists():
        for index, folder in enumerate(sorted(FUTURE_BUILDING_DIR.iterdir(), key=lambda p: p.name), start=1):
            if not folder.is_dir():
                continue
            buildings.append(building_record(folder, previous_by_name.get(folder.name, {}), index, "future"))
    return buildings


def scan_museum(previous):
    previous_by_id = {item.get("id"): item for item in previous.get("museum", [])}
    sections = []
    for folder in sorted(MUSEUM_DIR.iterdir(), key=lambda p: p.name):
        if not folder.is_dir():
            continue
        prior = previous_by_id.get(folder.name, {})
        sections.append({
            "id": folder.name,
            "title": prior.get("title") or folder.name,
            "info": read_multilang(folder, "基础信息_*.txt") or prior.get("info", {}),
            "images": image_files(folder / "图片素材"),
        })
    order = {"概述": 0, "校史展": 1, "线上VR体验": 2}
    return sorted(sections, key=lambda item: order.get(item["id"], 99))


def scan_places(kind):
    base = PLACES_DIR / kind
    if not base.exists():
        return []
    places = []
    for folder in sorted(base.iterdir(), key=lambda p: p.name.lower()):
        if not folder.is_dir():
            continue
        fields = {}
        for file_path in sorted(folder.glob("*.txt"), key=lambda p: p.name):
            value = read_text(file_path)
            if value:
                fields[file_path.stem] = value
        places.append({
            "id": folder.name,
            "name": folder.name,
            "kind": kind,
            "fields": fields,
            "images": image_files(folder),
        })
    return places


def scan_volunteers(previous):
    previous_by_name = {item.get("name"): item for item in previous.get("volunteers", [])}
    volunteers = []
    for index, folder in enumerate(sorted(VOLUNTEER_DIR.iterdir(), key=lambda p: p.name), start=1):
        if not folder.is_dir():
            continue
        intro_path = next((path for path in [folder / "简介.txt", folder / "介绍.txt"] if path.exists()), None)
        photo_path = next((path for path in sorted(folder.iterdir(), key=lambda p: p.name) if path.suffix in IMAGE_EXTS), None)
        prior = previous_by_name.get(folder.name, {})
        volunteers.append({
            "id": prior.get("id") or f"v{index}",
            "name": folder.name,
            "intro": read_text(intro_path) if intro_path else prior.get("intro", ""),
            "photo": rel(photo_path) if photo_path else prior.get("photo", ""),
        })
    return volunteers


def main():
    previous = load_site_data()
    next_data = {
        "brand": previous.get("brand", {}),
        "buildings": scan_buildings(previous),
        "museum": scan_museum(previous),
        "restaurants": scan_places("餐饮"),
        "hotels": scan_places("酒店"),
        "volunteers": scan_volunteers(previous),
        "aiAssistant": previous.get("aiAssistant", {}),
        "routes": previous.get("routes", []),
    }
    next_data["stats"] = {
        "buildingCount": len(next_data["buildings"]),
        "mapBuildingCount": len([item for item in next_data["buildings"] if item.get("mapEnabled")]),
        "futureBuildingCount": len([item for item in next_data["buildings"] if item.get("status") == "future"]),
        "restaurantCount": len(next_data["restaurants"]),
        "hotelCount": len(next_data["hotels"]),
        "volunteerCount": len(next_data["volunteers"]),
        "museumSectionCount": len(next_data["museum"]),
    }

    DATA_FILE.write_text(
        "window.SITE_DATA = "
        + json.dumps(next_data, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )

    print("site-data generated")
    print(f"- campus places: {next_data['stats']['buildingCount']}")
    print(f"- map-indexed buildings: {next_data['stats']['mapBuildingCount']}")
    print(f"- future buildings: {next_data['stats']['futureBuildingCount']}")
    print(f"- restaurants: {next_data['stats']['restaurantCount']}")
    print(f"- hotels: {next_data['stats']['hotelCount']}")
    print(f"- volunteers: {next_data['stats']['volunteerCount']}")
    print(f"- museum sections: {next_data['stats']['museumSectionCount']}")


if __name__ == "__main__":
    main()
