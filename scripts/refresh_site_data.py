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
    "医务中心": [61.7, 42.2],
    "公学一楼": [44.6, 54.7],
    "公学二楼": [62.2, 32.6],
    "学生事务中心": [63.6, 42.2],
    "校园运行中心": [85.4, 75.8],
    "管理学部楼（公学四楼）": [74.8, 23.7],
    "艺术楼": [32.2, 54.8],
    "西南学部楼": [34.6, 72.8],
    "叶澄海楼": [30.0, 54.4],
    "西运动场": [32.2, 43.3],
}

PLACE_NAME_TRANSLATIONS = {
    "baker&spice(北京首开通州万象汇店）": {
        "en": "baker&spice (Beijing Shoukai Tongzhou MixC)",
        "es": "baker&spice (MixC Tongzhou de Beijing Shoukai)",
        "fr": "baker&spice (MixC de Tongzhou, Beijing Shoukai)",
        "de": "baker&spice (Beijing Shoukai Tongzhou MixC)",
        "ja": "baker&spice（北京首開通州万象匯店）",
        "ru": "baker&spice (Beijing Shoukai Tongzhou MixC)",
    },
    "PHOTHEONE福万越南餐厅（通州万象汇店）": {
        "en": "PHOTHEONE Pho Wan Vietnamese Restaurant (Tongzhou MixC)",
        "es": "PHOTHEONE Pho Wan, restaurante vietnamita (Tongzhou MixC)",
        "fr": "PHOTHEONE Pho Wan, restaurant vietnamien (Tongzhou MixC)",
        "de": "PHOTHEONE Pho Wan Vietnamesisches Restaurant (Tongzhou MixC)",
        "ja": "PHOTHEONE福万ベトナム料理（通州万象匯店）",
        "ru": "PHOTHEONE Pho Wan, вьетнамский ресторан (Tongzhou MixC)",
    },
    "东兴班·新火锅（漕运码头店）": {
        "en": "Dongxingban New Hotpot (Caoyun Wharf)",
        "es": "Dongxingban New Hotpot (Muelle Caoyun)",
        "fr": "Dongxingban New Hotpot (quai Caoyun)",
        "de": "Dongxingban New Hotpot (Caoyun Wharf)",
        "ja": "東興班・新火鍋（漕運碼頭店）",
        "ru": "Dongxingban New Hotpot (Caoyun Wharf)",
    },
    "东方饺子王（通州畅和东路店）": {
        "en": "Oriental Dumpling King (Tongzhou Changhe East Road)",
        "es": "Oriental Dumpling King (Changhe East Road, Tongzhou)",
        "fr": "Oriental Dumpling King (route Changhe Est, Tongzhou)",
        "de": "Oriental Dumpling King (Tongzhou Changhe East Road)",
        "ja": "東方餃子王（通州暢和東路店）",
        "ru": "Oriental Dumpling King (Tongzhou Changhe East Road)",
    },
    "云荷里·傣家菜（通州万象汇店）": {
        "en": "Yunheli Dai Cuisine (Tongzhou MixC)",
        "es": "Yunheli, cocina Dai (Tongzhou MixC)",
        "fr": "Yunheli, cuisine Dai (Tongzhou MixC)",
        "de": "Yunheli Dai-Kueche (Tongzhou MixC)",
        "ja": "雲荷里・タイ族料理（通州万象匯店）",
        "ru": "Yunheli, дайская кухня (Tongzhou MixC)",
    },
    "俄士厨房（通州万象汇店）": {
        "en": "Russian Kitchen (Tongzhou MixC)",
        "es": "Russian Kitchen (Tongzhou MixC)",
        "fr": "Russian Kitchen (Tongzhou MixC)",
        "de": "Russische Kueche (Tongzhou MixC)",
        "ja": "ロシアンキッチン（通州万象匯店）",
        "ru": "Русская кухня (Tongzhou MixC)",
    },
    "吉野家（云帆路店）": {
        "en": "Yoshinoya (Yunfan Road)",
        "es": "Yoshinoya (Yunfan Road)",
        "fr": "Yoshinoya (route Yunfan)",
        "de": "Yoshinoya (Yunfan Road)",
        "ja": "吉野家（雲帆路店）",
        "ru": "Yoshinoya (Yunfan Road)",
    },
    "天和晟烤鸭店（通州朗清园店）": {
        "en": "Tianhesheng Roast Duck (Tongzhou Langqingyuan)",
        "es": "Tianhesheng Pato Asado (Tongzhou Langqingyuan)",
        "fr": "Tianhesheng canard laque (Tongzhou Langqingyuan)",
        "de": "Tianhesheng Roast Duck (Tongzhou Langqingyuan)",
        "ja": "天和晟北京ダック（通州朗清園店）",
        "ru": "Tianhesheng, утка по-пекински (Tongzhou Langqingyuan)",
    },
    "廿四湘汉寿甲鱼宴（漕运码头店）": {
        "en": "24 Xiang Hanshou Soft-Shell Turtle Banquet (Caoyun Wharf)",
        "es": "24 Xiang Hanshou, banquete de tortuga de caparazon blando (Muelle Caoyun)",
        "fr": "24 Xiang Hanshou, specialites de tortue a carapace molle (quai Caoyun)",
        "de": "24 Xiang Hanshou Weichschildkroeten-Bankett (Caoyun Wharf)",
        "ja": "廿四湘漢寿スッポン料理（漕運碼頭店）",
        "ru": "24 Xiang Hanshou, блюда из мягкопанцирной черепахи (Caoyun Wharf)",
    },
    "木桐莊西餐厅（北投店）": {
        "en": "Mutongzhuang Western Restaurant (Beitou)",
        "es": "Mutongzhuang, restaurante occidental (Beitou)",
        "fr": "Mutongzhuang, restaurant occidental (Beitou)",
        "de": "Mutongzhuang Western Restaurant (Beitou)",
        "ja": "木桐莊西洋料理（北投店）",
        "ru": "Mutongzhuang, западный ресторан (Beitou)",
    },
    "海底捞火锅（通州万象汇店）": {
        "en": "Haidilao Hot Pot (Tongzhou MixC)",
        "es": "Haidilao Hot Pot (Tongzhou MixC)",
        "fr": "Haidilao Hot Pot (Tongzhou MixC)",
        "de": "Haidilao Hot Pot (Tongzhou MixC)",
        "ja": "海底撈火鍋（通州万象匯店）",
        "ru": "Haidilao Hot Pot (Tongzhou MixC)",
    },
    "绿茶餐厅（北京首开万象汇店）": {
        "en": "Green Tea Restaurant (Beijing Shoukai MixC)",
        "es": "Green Tea Restaurant (Beijing Shoukai MixC)",
        "fr": "Green Tea Restaurant (Beijing Shoukai MixC)",
        "de": "Green Tea Restaurant (Beijing Shoukai MixC)",
        "ja": "緑茶餐庁（北京首開万象匯店）",
        "ru": "Green Tea Restaurant (Beijing Shoukai MixC)",
    },
    "鲜牛记潮汕牛肉火锅（通州万象汇店）": {
        "en": "Xianniuji Chaoshan Beef Hot Pot (Tongzhou MixC)",
        "es": "Xianniuji Hot Pot de ternera Chaoshan (Tongzhou MixC)",
        "fr": "Xianniuji hot pot de boeuf Chaoshan (Tongzhou MixC)",
        "de": "Xianniuji Chaoshan Beef Hot Pot (Tongzhou MixC)",
        "ja": "鮮牛記潮汕牛肉火鍋（通州万象匯店）",
        "ru": "Xianniuji Chaoshan Beef Hot Pot (Tongzhou MixC)",
    },
    "麦当劳（首开通州万象汇店）": {
        "en": "McDonald's (Shoukai Tongzhou MixC)",
        "es": "McDonald's (Shoukai Tongzhou MixC)",
        "fr": "McDonald's (Shoukai Tongzhou MixC)",
        "de": "McDonald's (Shoukai Tongzhou MixC)",
        "ja": "マクドナルド（首開通州万象匯店）",
        "ru": "McDonald's (Shoukai Tongzhou MixC)",
    },
    "全季酒店（北京通州宋庄安贞医院店）": {
        "en": "JI Hotel (Beijing Tongzhou Songzhuang Anzhen Hospital)",
        "es": "JI Hotel (Hospital Anzhen de Songzhuang, Tongzhou, Beijing)",
        "fr": "JI Hotel (hopital Anzhen de Songzhuang, Tongzhou, Beijing)",
        "de": "JI Hotel (Beijing Tongzhou Songzhuang Anzhen Hospital)",
        "ja": "全季ホテル（北京通州宋荘安貞医院店）",
        "ru": "JI Hotel (Beijing Tongzhou Songzhuang Anzhen Hospital)",
    },
    "北投绿心网球酒店（北京环球度假区绿心公园店）": {
        "en": "Beitou Green Heart Tennis Hotel (Beijing Universal Resort Green Heart Park)",
        "es": "Beitou Green Heart Tennis Hotel (Parque Green Heart, Beijing Universal Resort)",
        "fr": "Beitou Green Heart Tennis Hotel (parc Green Heart, Beijing Universal Resort)",
        "de": "Beitou Green Heart Tennis Hotel (Beijing Universal Resort Green Heart Park)",
        "ja": "北投グリーンハート・テニスホテル（北京ユニバーサルリゾート緑心公園店）",
        "ru": "Beitou Green Heart Tennis Hotel (Beijing Universal Resort Green Heart Park)",
    },
    "北投运动家酒店（城市绿心森林公园店）": {
        "en": "Beitou Sports Hotel (City Green Heart Forest Park)",
        "es": "Beitou Sports Hotel (Parque Forestal City Green Heart)",
        "fr": "Beitou Sports Hotel (parc forestier City Green Heart)",
        "de": "Beitou Sports Hotel (City Green Heart Forest Park)",
        "ja": "北投スポーツホテル（都市緑心森林公園店）",
        "ru": "Beitou Sports Hotel (City Green Heart Forest Park)",
    },
    "如家精选酒店（北京通州宋庄安贞医院店）": {
        "en": "Home Inn Plus (Beijing Tongzhou Songzhuang Anzhen Hospital)",
        "es": "Home Inn Plus (Hospital Anzhen de Songzhuang, Tongzhou, Beijing)",
        "fr": "Home Inn Plus (hopital Anzhen de Songzhuang, Tongzhou, Beijing)",
        "de": "Home Inn Plus (Beijing Tongzhou Songzhuang Anzhen Hospital)",
        "ja": "ホームイン・プラス（北京通州宋荘安貞医院店）",
        "ru": "Home Inn Plus (Beijing Tongzhou Songzhuang Anzhen Hospital)",
    },
    "柏曼酒店（北京通州运河商务区店）": {
        "en": "Borrman Hotel (Beijing Tongzhou Canal Business District)",
        "es": "Borrman Hotel (Distrito comercial del Canal, Tongzhou, Beijing)",
        "fr": "Borrman Hotel (quartier d'affaires du canal, Tongzhou, Beijing)",
        "de": "Borrman Hotel (Beijing Tongzhou Canal Business District)",
        "ja": "ボーマンホテル（北京通州運河ビジネス区店）",
        "ru": "Borrman Hotel (Beijing Tongzhou Canal Business District)",
    },
    "桔子酒店（北京通州安贞医院店）": {
        "en": "Orange Hotel (Beijing Tongzhou Anzhen Hospital)",
        "es": "Orange Hotel (Hospital Anzhen, Tongzhou, Beijing)",
        "fr": "Orange Hotel (hopital Anzhen, Tongzhou, Beijing)",
        "de": "Orange Hotel (Beijing Tongzhou Anzhen Hospital)",
        "ja": "オレンジホテル（北京通州安貞医院店）",
        "ru": "Orange Hotel (Beijing Tongzhou Anzhen Hospital)",
    },
    "桔子酒店（北京通州环球北运河店）": {
        "en": "Orange Hotel (Beijing Tongzhou Universal North Canal)",
        "es": "Orange Hotel (Canal Norte Universal, Tongzhou, Beijing)",
        "fr": "Orange Hotel (canal nord Universal, Tongzhou, Beijing)",
        "de": "Orange Hotel (Beijing Tongzhou Universal North Canal)",
        "ja": "オレンジホテル（北京通州ユニバーサル北運河店）",
        "ru": "Orange Hotel (Beijing Tongzhou Universal North Canal)",
    },
    "院子酒店": {
        "en": "The Yard Hotel",
        "es": "The Yard Hotel",
        "fr": "The Yard Hotel",
        "de": "The Yard Hotel",
        "ja": "院子ホテル",
        "ru": "The Yard Hotel",
    },
}

FIELD_VALUE_TRANSLATIONS = {
    "舒适型酒店": {
        "en": "Comfort hotel",
        "es": "Hotel de confort",
        "fr": "Hotel confort",
        "de": "Komfort-Hotel",
        "ja": "コンフォートホテル",
        "ru": "Комфортный отель",
    },
    "高档型酒店": {
        "en": "Upscale hotel",
        "es": "Hotel de gama alta",
        "fr": "Hotel haut de gamme",
        "de": "Gehobenes Hotel",
        "ja": "高級ホテル",
        "ru": "Отель повышенного класса",
    },
    "通州区徐宋路小堡村南三号院三号楼1楼": {
        "en": "1F, Building 3, South No. 3 Courtyard, Xiaobao Village, Xusong Road, Tongzhou District",
        "es": "1F, Edificio 3, Patio Sur No. 3, aldea Xiaobao, Xusong Road, distrito de Tongzhou",
        "fr": "1er etage, batiment 3, cour sud no 3, village de Xiaobao, route Xusong, district de Tongzhou",
        "de": "1. Etage, Gebaeude 3, Suedhof Nr. 3, Xiaobao Village, Xusong Road, Bezirk Tongzhou",
        "ja": "通州区徐宋路小堡村南三号院三号楼1階",
        "ru": "1 этаж, здание 3, южный двор No. 3, деревня Xiaobao, Xusong Road, район Тунчжоу",
    },
    "通州区宋庄镇168号": {
        "en": "No. 168, Songzhuang Town, Tongzhou District",
        "es": "No. 168, pueblo de Songzhuang, distrito de Tongzhou",
        "fr": "No 168, bourg de Songzhuang, district de Tongzhou",
        "de": "Nr. 168, Songzhuang Town, Bezirk Tongzhou",
        "ja": "通州区宋荘鎮168号",
        "ru": "No. 168, поселок Songzhuang, район Тунчжоу",
    },
    "通州区潞通大街191号": {
        "en": "No. 191, Lutong Street, Tongzhou District",
        "es": "No. 191, calle Lutong, distrito de Tongzhou",
        "fr": "No 191, rue Lutong, district de Tongzhou",
        "de": "Nr. 191, Lutong Street, Bezirk Tongzhou",
        "ja": "通州区潞通大街191号",
        "ru": "No. 191, улица Lutong, район Тунчжоу",
    },
    "通州区潞城镇普欣南里233号": {
        "en": "No. 233, Puxin Nanli, Lucheng Town, Tongzhou District",
        "es": "No. 233, Puxin Nanli, Lucheng, distrito de Tongzhou",
        "fr": "No 233, Puxin Nanli, bourg de Lucheng, district de Tongzhou",
        "de": "Nr. 233, Puxin Nanli, Lucheng Town, Bezirk Tongzhou",
        "ja": "通州区潞城鎮普欣南里233号",
        "ru": "No. 233, Puxin Nanli, поселок Lucheng, район Тунчжоу",
    },
    "距中国人民大学（通州校区）直线4.5公里，免费停车，可使用银联、Mastercard、visa、微信、支付宝支付": {
        "en": "About 4.5 km in a straight line from RUC Tongzhou Campus; free parking; accepts UnionPay, Mastercard, Visa, WeChat Pay and Alipay.",
        "es": "A unos 4,5 km en linea recta del campus Tongzhou de RUC; aparcamiento gratuito; acepta UnionPay, Mastercard, Visa, WeChat Pay y Alipay.",
        "fr": "A environ 4,5 km a vol d'oiseau du campus de Tongzhou de RUC; parking gratuit; accepte UnionPay, Mastercard, Visa, WeChat Pay et Alipay.",
        "de": "Etwa 4,5 km Luftlinie vom RUC-Campus Tongzhou entfernt; kostenloses Parken; akzeptiert UnionPay, Mastercard, Visa, WeChat Pay und Alipay.",
        "ja": "中国人民大学（通州キャンパス）から直線距離約4.5km。無料駐車場あり。銀聯、Mastercard、Visa、WeChat Pay、Alipay利用可。",
        "ru": "Около 4,5 км по прямой от кампуса RUC Tongzhou; бесплатная парковка; принимаются UnionPay, Mastercard, Visa, WeChat Pay и Alipay.",
    },
    "距中国人民大学（通州校区）直线4.4公里，免费停车，可使用微信、支付宝支付": {
        "en": "About 4.4 km in a straight line from RUC Tongzhou Campus; free parking; accepts WeChat Pay and Alipay.",
        "es": "A unos 4,4 km en linea recta del campus Tongzhou de RUC; aparcamiento gratuito; acepta WeChat Pay y Alipay.",
        "fr": "A environ 4,4 km a vol d'oiseau du campus de Tongzhou de RUC; parking gratuit; accepte WeChat Pay et Alipay.",
        "de": "Etwa 4,4 km Luftlinie vom RUC-Campus Tongzhou entfernt; kostenloses Parken; akzeptiert WeChat Pay und Alipay.",
        "ja": "中国人民大学（通州キャンパス）から直線距離約4.4km。無料駐車場あり。WeChat Pay、Alipay利用可。",
        "ru": "Около 4,4 км по прямой от кампуса RUC Tongzhou; бесплатная парковка; принимаются WeChat Pay и Alipay.",
    },
    "距中国人民大学（通州校区）直线4.1公里，免费停车，可使用微信、支付宝支付": {
        "en": "About 4.1 km in a straight line from RUC Tongzhou Campus; free parking; accepts WeChat Pay and Alipay.",
        "es": "A unos 4,1 km en linea recta del campus Tongzhou de RUC; aparcamiento gratuito; acepta WeChat Pay y Alipay.",
        "fr": "A environ 4,1 km a vol d'oiseau du campus de Tongzhou de RUC; parking gratuit; accepte WeChat Pay et Alipay.",
        "de": "Etwa 4,1 km Luftlinie vom RUC-Campus Tongzhou entfernt; kostenloses Parken; akzeptiert WeChat Pay und Alipay.",
        "ja": "中国人民大学（通州キャンパス）から直線距離約4.1km。無料駐車場あり。WeChat Pay、Alipay利用可。",
        "ru": "Около 4,1 км по прямой от кампуса RUC Tongzhou; бесплатная парковка; принимаются WeChat Pay и Alipay.",
    },
    "距中国人民大学（通州校区）驾车2.3公里，免费停车，可使用银联支付": {
        "en": "About 2.3 km by car from RUC Tongzhou Campus; free parking; accepts UnionPay.",
        "es": "A unos 2,3 km en coche del campus Tongzhou de RUC; aparcamiento gratuito; acepta UnionPay.",
        "fr": "A environ 2,3 km en voiture du campus de Tongzhou de RUC; parking gratuit; accepte UnionPay.",
        "de": "Etwa 2,3 km mit dem Auto vom RUC-Campus Tongzhou entfernt; kostenloses Parken; akzeptiert UnionPay.",
        "ja": "中国人民大学（通州キャンパス）から車で約2.3km。無料駐車場あり。銀聯利用可。",
        "ru": "Около 2,3 км на автомобиле от кампуса RUC Tongzhou; бесплатная парковка; принимается UnionPay.",
    },
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


def localized_record(cn_value, translations=None):
    record = {"cn": cn_value}
    record.update(translations or {})
    return record


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
            "nameTranslations": localized_record(folder.name, PLACE_NAME_TRANSLATIONS.get(folder.name)),
            "kind": kind,
            "fields": fields,
            "fieldTranslations": {
                field: localized_record(value, FIELD_VALUE_TRANSLATIONS.get(value))
                for field, value in fields.items()
            },
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
