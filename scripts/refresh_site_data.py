#!/usr/bin/env python3

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "site-data.js"
REAL_BUILDING_DIR = ROOT / "通州校区建筑" / "已有建筑实景"


def load_site_data():
    source = DATA_FILE.read_text(encoding="utf-8")
    match = re.search(r"window\.SITE_DATA\s*=\s*(\{[\s\S]*\});\s*$", source)
    if not match:
        raise ValueError("site-data.js does not contain a window.SITE_DATA object")
    return json.loads(match.group(1))


def has_real_image(building):
    return any(building.get("images") or [])


def main():
    data = load_site_data()
    buildings = data.get("buildings", [])
    real_names = sorted((item.name for item in REAL_BUILDING_DIR.iterdir() if item.is_dir()))
    mapped_buildings = [
        item
        for item in buildings
        if isinstance(item.get("position"), list) and has_real_image(item)
    ]
    missing_from_data = [name for name in real_names if not any(item.get("name") == name for item in buildings)]
    icon_only_mapped = [
        item.get("name", "")
        for item in buildings
        if isinstance(item.get("position"), list) and not has_real_image(item)
    ]

    next_stats = {
        "buildingCount": len(mapped_buildings),
        "restaurantCount": len(data.get("restaurants", [])),
        "hotelCount": len(data.get("hotels", [])),
        "volunteerCount": len(data.get("volunteers", [])),
        "museumSectionCount": len(data.get("museum", [])),
    }

    print("site-data refresh check")
    print(f"- existing building folders: {len(real_names)}")
    print(f"- map-ready buildings with real images: {len(mapped_buildings)}")
    print(f"- restaurants: {next_stats['restaurantCount']}")
    print(f"- hotels: {next_stats['hotelCount']}")
    print(f"- volunteers: {next_stats['volunteerCount']}")
    print(f"- museum sections: {next_stats['museumSectionCount']}")

    if missing_from_data:
        print(f"- building folders missing from data: {', '.join(missing_from_data)}")
    if icon_only_mapped:
        print(f"- icon-only places kept out of map markers: {', '.join(icon_only_mapped)}")

    if data.get("stats") == next_stats:
        print("- stats already match generated counts")
        return

    source = DATA_FILE.read_text(encoding="utf-8")
    replacement = '"stats": ' + json.dumps(next_stats, ensure_ascii=False, indent=4).replace("\n", "\n  ")
    updated = re.sub(r'"stats": \{[\s\S]*?\n  \}', replacement, source)
    DATA_FILE.write_text(updated, encoding="utf-8")
    print("- updated stats in site-data.js")


if __name__ == "__main__":
    main()
