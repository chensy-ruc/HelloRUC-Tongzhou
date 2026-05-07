const data = window.SITE_DATA || {};
const initialMapBuilding = (data.buildings || []).find((item) => item.mapEnabled && Array.isArray(item.position));

const state = {
  language: "cn",
  activeBuildingId: initialMapBuilding?.id || data.buildings?.[0]?.id || "",
  placeKind: "restaurants",
  buildingQuery: "",
  buildingType: "all",
  assistantQuestion: "",
  assistantAnswer: "",
  assistantLoading: false,
  museumBackgroundIndex: 0,
  mapZoom: 1,
  isMapDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragScrollLeft: 0,
  dragScrollTop: 0
};

const languages = [
  ["cn", "中文"],
  ["en", "English"],
  ["ja", "日本語"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["ru", "Русский"]
];

const ui = {
  cn: {
    noInfo: "",
    noImage: "暂无图片",
    searchEmpty: "没有找到匹配地点。",
    availablePlaces: "地图地点",
    futurePlaces: "敬请期待",
    guideServices: "导览服务",
    futureNote: "暂不在大地图上索引",
    assistantIndexTitle: "智能问答助手",
    assistantIndexText: "路线、报到、餐饮、酒店、博物馆和校园服务都可以在这里咨询。",
    serviceMapTitle: "校园地图",
    serviceMapCaption: "建筑定位、实景图片、手绘地图",
    serviceVisitTitle: "参访路线",
    serviceVisitCaption: "首次到访、学习生活、文化参观",
    serviceMuseumTitle: "校史与 VR",
    serviceMuseumCaption: "校史展、多语种介绍、线上体验",
    serviceServicesTitle: "餐饮酒店",
    serviceServicesCaption: "周边餐厅、酒店、联系方式",
    serviceAssistantTitle: "智能问答",
    serviceAssistantCaption: "路线、报到、餐饮与校园服务",
    serviceVolunteersTitle: "志愿者",
    serviceVolunteersCaption: "志愿者介绍与群聊二维码",
    serviceBuildingsTitle: "地点索引",
    serviceBuildingsCaption: "搜索筛选校园建筑与服务点",
    details: "查看详情",
    website: "打开链接",
    allTypes: "全部类型",
    address: "地址",
    phone: "电话",
    rating: "评分",
    price: "人均",
    category: "类别",
    hours: "营业时间",
    level: "酒店等级",
    email: "邮箱",
    remark: "备注",
    routeStops: "路线节点",
    buildingStats: "校园地点",
    restaurantStats: "餐饮选择",
    hotelStats: "周边酒店",
    volunteerStats: "志愿者",
    museumStats: "博物馆板块",
    askPlaceholder: "输入问题，例如：新生报到先去哪里？",
    askButton: "提问",
    asking: "正在整理回答...",
    navMap: "地图",
    navVisit: "参访",
    navMuseum: "历史",
    navServices: "餐饮酒店",
    navAssistant: "问答",
    navVolunteers: "志愿者",
    brandSmall: "通州校区导览",
    heroEyebrow: "Renmin University of China · Tongzhou Campus",
    heroTitle: "一张地图，打开人大通州校区",
    heroText: "为参访者、新生和国际友人准备的校园导览：看手绘地图，查建筑位置，了解校史展、VR体验、周边餐饮酒店，并联系志愿者。",
    heroPrimary: "进入校园地图",
    heroSecondary: "寻求帮助",
    campusEyebrow: "Campus Map",
    campusTitle: "按地图标记查看建筑位置与实景",
    campusText: "地图标记对应已有实景资料的建筑，可与下方地点索引和参访路线联动。",
    currentPlace: "当前地点",
    visitEyebrow: "Visit & Tours",
    visitTitle: "选择适合你的参访路线",
    visitText: "路线会联动现有建筑数据，点击路线中的地点可以直接回到地图焦点。",
    buildingsEyebrow: "Buildings",
    buildingsTitle: "校园地点索引",
    buildingSearch: "搜索建筑、食堂、服务中心",
    museumEyebrow: "RUC Museum",
    museumTitle: "校史展与线上 VR 体验",
    museumText: "了解通州校区博物馆、校史展信息，并通过二维码进入线上 VR 展览。",
    servicesEyebrow: "Visitor Services",
    servicesTitle: "周边餐饮与酒店",
    restaurantTab: "餐饮",
    hotelTab: "酒店",
    assistantEyebrow: "Smart Assistant",
    assistantTitle: "智能问答助手",
    assistantText: "可咨询路线、报到、餐饮、酒店、博物馆和校园服务，回答会结合当前页面资料供你参考。",
    volunteerEyebrow: "HelloRUC Volunteers",
    volunteerTitle: "联系 HelloRUC 志愿者",
    volunteerText: "如需路线、报到、食宿或校园服务帮助，可查看志愿者信息并加入群聊咨询。",
    qrTitle: "HelloRUC 志愿者群聊",
    qrText: "扫码加入后可咨询路线、报到、食宿和校园服务。",
    footerTitle: "中国人民大学通州校区导览",
    backTop: "回到顶部",
    vrQr: "扫码进入 VR 展览"
  },
  en: {
    noInfo: "",
    noImage: "No image yet",
    searchEmpty: "No matching places found.",
    availablePlaces: "Map places",
    futurePlaces: "Coming soon",
    guideServices: "Guide service",
    futureNote: "Not indexed on the main map yet",
    assistantIndexTitle: "Smart Q&A Assistant",
    assistantIndexText: "Ask about routes, check-in, dining, hotels, museum visits and campus services.",
    serviceMapTitle: "Campus Map",
    serviceMapCaption: "Building locations, photos and hand-drawn map",
    serviceVisitTitle: "Visit Routes",
    serviceVisitCaption: "First visit, study life and culture tour",
    serviceMuseumTitle: "History & VR",
    serviceMuseumCaption: "History exhibition, multilingual info and online tour",
    serviceServicesTitle: "Dining & Hotels",
    serviceServicesCaption: "Nearby restaurants, hotels and contacts",
    serviceAssistantTitle: "Smart Q&A",
    serviceAssistantCaption: "Routes, check-in, dining and campus services",
    serviceVolunteersTitle: "Volunteers",
    serviceVolunteersCaption: "Volunteer profiles and chat QR code",
    serviceBuildingsTitle: "Place Index",
    serviceBuildingsCaption: "Search campus buildings and service points",
    details: "Details",
    website: "Open link",
    allTypes: "All types",
    address: "Address",
    phone: "Phone",
    rating: "Rating",
    price: "Avg. spend",
    category: "Category",
    hours: "Hours",
    level: "Hotel level",
    email: "Email",
    remark: "Note",
    routeStops: "Stops",
    buildingStats: "Campus places",
    restaurantStats: "Dining picks",
    hotelStats: "Nearby hotels",
    volunteerStats: "Volunteers",
    museumStats: "Museum sections",
    askPlaceholder: "Ask about check-in, routes, dining, hotels or services",
    askButton: "Ask",
    asking: "Preparing an answer...",
    navMap: "Map",
    navVisit: "Visit",
    navMuseum: "History",
    navServices: "Dining & Hotels",
    navAssistant: "Q&A",
    navVolunteers: "Volunteers",
    brandSmall: "Tongzhou Campus Guide",
    heroEyebrow: "Renmin University of China · Tongzhou Campus",
    heroTitle: "Open RUC Tongzhou with one map",
    heroText: "A campus guide for visitors, new students and international guests: read the hand-drawn map, locate buildings, explore the history exhibition, VR experience, nearby dining and hotels, and contact volunteers.",
    heroPrimary: "Open Campus Map",
    heroSecondary: "Get Help",
    campusEyebrow: "Campus Map",
    campusTitle: "Use map markers to view places and photos",
    campusText: "Markers are limited to places with real campus photos and connect with the place index and visit routes.",
    currentPlace: "Current place",
    visitEyebrow: "Visit & Tours",
    visitTitle: "Choose a route for your visit",
    visitText: "Route stops connect to existing campus data. Click a stop to return to the map focus.",
    buildingsEyebrow: "Buildings",
    buildingsTitle: "Campus Place Index",
    buildingSearch: "Search buildings, canteens and services",
    museumEyebrow: "RUC Museum",
    museumTitle: "History Exhibition and Online VR",
    museumText: "Learn about the Tongzhou Campus museum, the university history exhibition, and enter the online VR exhibition by QR code.",
    servicesEyebrow: "Visitor Services",
    servicesTitle: "Nearby Dining and Hotels",
    restaurantTab: "Dining",
    hotelTab: "Hotels",
    assistantEyebrow: "Smart Assistant",
    assistantTitle: "Smart Q&A Assistant",
    assistantText: "Ask about routes, check-in, dining, hotels, museum visits and campus services. Answers use the current page content as reference.",
    volunteerEyebrow: "HelloRUC Volunteers",
    volunteerTitle: "Contact HelloRUC Volunteers",
    volunteerText: "For route, check-in, food, lodging or campus service help, view volunteer profiles and join the chat group.",
    qrTitle: "HelloRUC Volunteer Chat",
    qrText: "Scan to ask about routes, check-in, dining, lodging and campus services.",
    footerTitle: "Renmin University of China Tongzhou Campus Guide",
    backTop: "Back to top",
    vrQr: "Scan for the VR exhibition"
  },
  ja: {},
  es: {},
  fr: {},
  de: {},
  ru: {}
};

const localizedOverrides = {
  ja: {
    noImage: "画像はまだありません",
    searchEmpty: "一致する場所は見つかりません。",
    availablePlaces: "地図掲載スポット",
    futurePlaces: "近日公開",
    guideServices: "案内サービス",
    futureNote: "メイン地図にはまだ掲載していません",
    allTypes: "すべての種類",
    address: "住所",
    phone: "電話",
    rating: "評価",
    price: "平均予算",
    category: "カテゴリー",
    hours: "営業時間",
    level: "ホテルランク",
    email: "メール",
    remark: "備考",
    routeStops: "ルート地点",
    buildingStats: "キャンパス地点",
    restaurantStats: "飲食店",
    hotelStats: "周辺ホテル",
    volunteerStats: "ボランティア",
    museumStats: "博物館セクション",
    askPlaceholder: "受付、ルート、食事、ホテル、サービスについて質問",
    askButton: "質問",
    asking: "回答を準備しています...",
    navMap: "地図",
    navVisit: "見学",
    navMuseum: "歴史",
    navServices: "食事・ホテル",
    navAssistant: "Q&A",
    navVolunteers: "ボランティア",
    brandSmall: "通州キャンパス案内",
    heroEyebrow: "中国人民大学 · 通州キャンパス",
    heroTitle: "一枚の地図で人大通州キャンパスへ",
    heroText: "来訪者、新入生、海外ゲスト向けのキャンパスガイドです。手描き地図、建物位置、校史展、VR体験、周辺の食事・ホテル、ボランティア連絡先を確認できます。",
    heroPrimary: "キャンパス地図へ",
    heroSecondary: "サポートを受ける",
    campusTitle: "地図マーカーで場所と写真を見る",
    campusText: "マーカーは実景写真がある場所に限定され、地点索引や見学ルートと連動します。",
    currentPlace: "現在の場所",
    visitTitle: "見学ルートを選ぶ",
    visitText: "ルート地点は既存のキャンパスデータと連動します。地点をクリックすると地図に戻ります。",
    buildingsTitle: "キャンパス地点索引",
    buildingSearch: "建物、食堂、サービスを検索",
    museumTitle: "校史展とオンラインVR",
    museumText: "通州キャンパス博物館、校史展、オンラインVR展示を確認できます。",
    servicesTitle: "周辺の食事とホテル",
    restaurantTab: "飲食",
    hotelTab: "ホテル",
    assistantTitle: "スマートQ&Aアシスタント",
    assistantText: "ルート、受付、食事、ホテル、博物館、キャンパスサービスについて質問できます。",
    volunteerTitle: "HelloRUCボランティアに連絡",
    volunteerText: "ルート、受付、食事、宿泊、サービスの相談はボランティア情報とチャットグループをご利用ください。",
    qrTitle: "HelloRUCボランティアチャット",
    qrText: "スキャンしてルート、受付、食事、宿泊、サービスを相談できます。",
    footerTitle: "中国人民大学通州キャンパス案内",
    backTop: "トップへ戻る",
    vrQr: "VR展示を開く"
  },
  es: {
    noImage: "Sin imagen",
    searchEmpty: "No se encontraron lugares.",
    availablePlaces: "Lugares en el mapa",
    futurePlaces: "Próximamente",
    guideServices: "Servicio de guía",
    futureNote: "Aún no aparece en el mapa principal",
    allTypes: "Todos los tipos",
    address: "Dirección",
    phone: "Teléfono",
    rating: "Calificación",
    price: "Gasto medio",
    category: "Categoría",
    hours: "Horario",
    level: "Nivel del hotel",
    email: "Correo",
    remark: "Nota",
    routeStops: "Paradas",
    buildingStats: "Lugares del campus",
    restaurantStats: "Restaurantes",
    hotelStats: "Hoteles cercanos",
    volunteerStats: "Voluntarios",
    museumStats: "Secciones del museo",
    askPlaceholder: "Pregunta sobre registro, rutas, comida, hoteles o servicios",
    askButton: "Preguntar",
    asking: "Preparando respuesta...",
    navMap: "Mapa",
    navVisit: "Visita",
    navMuseum: "Historia",
    navServices: "Comida y hoteles",
    navAssistant: "Preguntas",
    navVolunteers: "Voluntarios",
    brandSmall: "Guía del campus Tongzhou",
    heroEyebrow: "Universidad Renmin de China · Campus Tongzhou",
    heroTitle: "Abre RUC Tongzhou con un mapa",
    heroText: "Guía del campus para visitantes, nuevos estudiantes e invitados internacionales: mapa dibujado, edificios, exposición histórica, VR, restaurantes y hoteles cercanos, y contacto con voluntarios.",
    heroPrimary: "Abrir mapa",
    heroSecondary: "Pedir ayuda",
    campusTitle: "Consulta lugares y fotos con marcadores",
    campusText: "Los marcadores corresponden a lugares con fotos reales y se conectan con el índice y las rutas.",
    currentPlace: "Lugar actual",
    visitTitle: "Elige una ruta de visita",
    visitText: "Las paradas enlazan con los datos del campus. Haz clic para volver al mapa.",
    buildingsTitle: "Índice de lugares del campus",
    buildingSearch: "Buscar edificios, comedores y servicios",
    museumTitle: "Exposición histórica y VR online",
    museumText: "Conoce el museo del campus Tongzhou, la exposición histórica y entra a la VR por código QR.",
    servicesTitle: "Restaurantes y hoteles cercanos",
    restaurantTab: "Comida",
    hotelTab: "Hoteles",
    assistantTitle: "Asistente inteligente",
    assistantText: "Pregunta por rutas, registro, comida, hoteles, museo y servicios del campus.",
    volunteerTitle: "Contactar voluntarios HelloRUC",
    volunteerText: "Para ayuda con rutas, registro, comida, alojamiento o servicios, consulta los perfiles y el grupo.",
    qrTitle: "Chat de voluntarios HelloRUC",
    qrText: "Escanea para consultar rutas, registro, comida, alojamiento y servicios.",
    footerTitle: "Guía del campus Tongzhou de la Universidad Renmin de China",
    backTop: "Volver arriba",
    vrQr: "Escanear para la VR"
  },
  fr: {
    noImage: "Aucune image",
    searchEmpty: "Aucun lieu correspondant.",
    availablePlaces: "Lieux sur la carte",
    futurePlaces: "À venir",
    guideServices: "Service de guide",
    futureNote: "Pas encore indexé sur la carte principale",
    allTypes: "Tous les types",
    address: "Adresse",
    phone: "Téléphone",
    rating: "Note",
    price: "Budget moyen",
    category: "Catégorie",
    hours: "Horaires",
    level: "Classement hôtel",
    email: "E-mail",
    remark: "Note",
    routeStops: "Étapes",
    buildingStats: "Lieux du campus",
    restaurantStats: "Restaurants",
    hotelStats: "Hôtels proches",
    volunteerStats: "Bénévoles",
    museumStats: "Sections du musée",
    askPlaceholder: "Question sur l’accueil, les routes, la restauration, les hôtels ou services",
    askButton: "Demander",
    asking: "Préparation de la réponse...",
    navMap: "Carte",
    navVisit: "Visite",
    navMuseum: "Histoire",
    navServices: "Restauration & hôtels",
    navAssistant: "Questions",
    navVolunteers: "Bénévoles",
    brandSmall: "Guide du campus de Tongzhou",
    heroEyebrow: "Université Renmin de Chine · Campus de Tongzhou",
    heroTitle: "Découvrir RUC Tongzhou avec une carte",
    heroText: "Guide du campus pour visiteurs, nouveaux étudiants et invités internationaux : carte illustrée, bâtiments, exposition historique, VR, restaurants et hôtels proches, contact des bénévoles.",
    heroPrimary: "Ouvrir la carte",
    heroSecondary: "Obtenir de l’aide",
    campusTitle: "Voir les lieux et photos avec les marqueurs",
    campusText: "Les marqueurs concernent les lieux avec photos réelles et sont reliés à l’index et aux itinéraires.",
    currentPlace: "Lieu actuel",
    visitTitle: "Choisir un itinéraire de visite",
    visitText: "Les étapes utilisent les données du campus. Cliquez pour revenir au point sur la carte.",
    buildingsTitle: "Index des lieux du campus",
    buildingSearch: "Rechercher bâtiments, cantines et services",
    museumTitle: "Exposition historique et VR en ligne",
    museumText: "Découvrez le musée du campus de Tongzhou, l’exposition historique et l’expérience VR par QR code.",
    servicesTitle: "Restaurants et hôtels proches",
    restaurantTab: "Restaurants",
    hotelTab: "Hôtels",
    assistantTitle: "Assistant intelligent",
    assistantText: "Posez des questions sur les routes, l’accueil, les repas, hôtels, musées et services du campus.",
    volunteerTitle: "Contacter les bénévoles HelloRUC",
    volunteerText: "Pour les routes, l’accueil, les repas, l’hébergement ou les services, consultez les profils et le groupe.",
    qrTitle: "Groupe des bénévoles HelloRUC",
    qrText: "Scannez pour demander de l’aide sur les routes, l’accueil, les repas, l’hébergement et les services.",
    footerTitle: "Guide du campus de Tongzhou de l’Université Renmin de Chine",
    backTop: "Retour en haut",
    vrQr: "Scanner pour la VR"
  },
  de: {
    noImage: "Kein Bild",
    searchEmpty: "Keine passenden Orte gefunden.",
    availablePlaces: "Kartenorte",
    futurePlaces: "Demnächst",
    guideServices: "Guide-Service",
    futureNote: "Noch nicht auf der Hauptkarte indexiert",
    allTypes: "Alle Typen",
    address: "Adresse",
    phone: "Telefon",
    rating: "Bewertung",
    price: "Durchschnitt",
    category: "Kategorie",
    hours: "Öffnungszeiten",
    level: "Hotelklasse",
    email: "E-Mail",
    remark: "Hinweis",
    routeStops: "Stationen",
    buildingStats: "Campusorte",
    restaurantStats: "Restaurants",
    hotelStats: "Hotels in der Nähe",
    volunteerStats: "Freiwillige",
    museumStats: "Museumsbereiche",
    askPlaceholder: "Fragen zu Ankunft, Routen, Essen, Hotels oder Services",
    askButton: "Fragen",
    asking: "Antwort wird vorbereitet...",
    navMap: "Karte",
    navVisit: "Besuch",
    navMuseum: "Geschichte",
    navServices: "Essen & Hotels",
    navAssistant: "Fragen",
    navVolunteers: "Freiwillige",
    brandSmall: "Guide für den Campus Tongzhou",
    heroEyebrow: "Renmin-Universität China · Campus Tongzhou",
    heroTitle: "RUC Tongzhou mit einer Karte öffnen",
    heroText: "Campusguide für Besucher, neue Studierende und internationale Gäste: Karte, Gebäude, Geschichtsausstellung, VR, Restaurants und Hotels in der Nähe sowie Freiwilligenkontakt.",
    heroPrimary: "Campuskarte öffnen",
    heroSecondary: "Hilfe erhalten",
    campusTitle: "Orte und Fotos über Kartenmarker ansehen",
    campusText: "Marker zeigen Orte mit realen Fotos und sind mit Index und Besuchsrouten verbunden.",
    currentPlace: "Aktueller Ort",
    visitTitle: "Besuchsroute wählen",
    visitText: "Routenstationen nutzen vorhandene Campusdaten. Klicken Sie, um zur Karte zurückzukehren.",
    buildingsTitle: "Index der Campusorte",
    buildingSearch: "Gebäude, Mensen und Services suchen",
    museumTitle: "Geschichtsausstellung und Online-VR",
    museumText: "Informationen zum Museum des Campus Tongzhou, zur Geschichtsausstellung und zur VR-Erfahrung per QR-Code.",
    servicesTitle: "Restaurants und Hotels in der Nähe",
    restaurantTab: "Essen",
    hotelTab: "Hotels",
    assistantTitle: "Intelligenter Assistent",
    assistantText: "Fragen zu Routen, Ankunft, Essen, Hotels, Museum und Campusservices.",
    volunteerTitle: "HelloRUC-Freiwillige kontaktieren",
    volunteerText: "Für Hilfe zu Routen, Ankunft, Essen, Unterkunft oder Services nutzen Sie Profile und Chatgruppe.",
    qrTitle: "HelloRUC-Freiwilligenchat",
    qrText: "Scannen, um zu Routen, Ankunft, Essen, Unterkunft und Services zu fragen.",
    footerTitle: "Guide für den Tongzhou-Campus der Renmin-Universität China",
    backTop: "Nach oben",
    vrQr: "Für VR scannen"
  },
  ru: {
    noImage: "Нет изображения",
    searchEmpty: "Подходящие места не найдены.",
    availablePlaces: "Места на карте",
    futurePlaces: "Скоро",
    guideServices: "Сервис гида",
    futureNote: "Пока не отмечено на основной карте",
    allTypes: "Все типы",
    address: "Адрес",
    phone: "Телефон",
    rating: "Рейтинг",
    price: "Средний чек",
    category: "Категория",
    hours: "Часы работы",
    level: "Класс отеля",
    email: "Эл. почта",
    remark: "Примечание",
    routeStops: "Остановки",
    buildingStats: "Места кампуса",
    restaurantStats: "Рестораны",
    hotelStats: "Отели рядом",
    volunteerStats: "Волонтеры",
    museumStats: "Разделы музея",
    askPlaceholder: "Спросите о регистрации, маршрутах, питании, отелях или сервисах",
    askButton: "Спросить",
    asking: "Готовлю ответ...",
    navMap: "Карта",
    navVisit: "Визит",
    navMuseum: "История",
    navServices: "Еда и отели",
    navAssistant: "Вопросы",
    navVolunteers: "Волонтеры",
    brandSmall: "Гид по кампусу Тунчжоу",
    heroEyebrow: "Народный университет Китая · кампус Тунчжоу",
    heroTitle: "Откройте RUC Tongzhou по одной карте",
    heroText: "Гид по кампусу для посетителей, новых студентов и иностранных гостей: карта, здания, историческая выставка, VR, рестораны и отели рядом, связь с волонтерами.",
    heroPrimary: "Открыть карту",
    heroSecondary: "Получить помощь",
    campusTitle: "Смотрите места и фото по маркерам",
    campusText: "Маркеры показывают места с реальными фотографиями и связаны с индексом и маршрутами.",
    currentPlace: "Текущее место",
    visitTitle: "Выберите маршрут визита",
    visitText: "Остановки маршрута связаны с данными кампуса. Нажмите, чтобы вернуться к карте.",
    buildingsTitle: "Индекс мест кампуса",
    buildingSearch: "Искать здания, столовые и сервисы",
    museumTitle: "Историческая выставка и онлайн VR",
    museumText: "Узнайте о музее кампуса Тунчжоу, исторической выставке и VR по QR-коду.",
    servicesTitle: "Рестораны и отели рядом",
    restaurantTab: "Еда",
    hotelTab: "Отели",
    assistantTitle: "Умный помощник",
    assistantText: "Задавайте вопросы о маршрутах, регистрации, питании, отелях, музее и сервисах кампуса.",
    volunteerTitle: "Связаться с волонтерами HelloRUC",
    volunteerText: "Для помощи с маршрутами, регистрацией, питанием, проживанием или сервисами смотрите профили и группу.",
    qrTitle: "Чат волонтеров HelloRUC",
    qrText: "Сканируйте, чтобы спросить о маршрутах, регистрации, питании, проживании и сервисах.",
    footerTitle: "Гид по кампусу Тунчжоу Народного университета Китая",
    backTop: "Наверх",
    vrQr: "Сканировать для VR"
  }
};

Object.keys(localizedOverrides).forEach((code) => {
  ui[code] = { ...ui.en, ...localizedOverrides[code] };
});

const elements = {
  languageBar: document.querySelector("#language-bar"),
  heroServices: document.querySelector("#hero-services"),
  statsStrip: document.querySelector("#stats-strip"),
  activeBuildingName: document.querySelector("#active-building-name"),
  activeBuildingType: document.querySelector("#active-building-type"),
  activeBuildingDescription: document.querySelector("#active-building-description"),
  activeBuildingGallery: document.querySelector("#active-building-gallery"),
  mapScroll: document.querySelector("#map-scroll"),
  mapCanvas: document.querySelector("#map-canvas"),
  mapControls: document.querySelector(".map-controls"),
  mapMarkers: document.querySelector("#map-markers"),
  routeGrid: document.querySelector("#route-grid"),
  buildingGrid: document.querySelector("#building-grid"),
  buildingSearch: document.querySelector("#building-search"),
  buildingFilter: document.querySelector("#building-filter"),
  museumGrid: document.querySelector("#museum-grid"),
  placeTabs: document.querySelector("#place-tabs"),
  placeGrid: document.querySelector("#place-grid"),
  assistantAnswer: document.querySelector("#assistant-answer"),
  assistantForm: document.querySelector("#assistant-form"),
  assistantInput: document.querySelector("#assistant-input"),
  assistantPrompts: document.querySelector("#assistant-prompts"),
  volunteerGrid: document.querySelector("#volunteer-grid")
};

const serviceLinks = [
  { href: "#campus", titleKey: "serviceMapTitle", captionKey: "serviceMapCaption" },
  { href: "#visit", titleKey: "serviceVisitTitle", captionKey: "serviceVisitCaption" },
  { href: "#museum", titleKey: "serviceMuseumTitle", captionKey: "serviceMuseumCaption" },
  { href: "#services", titleKey: "serviceServicesTitle", captionKey: "serviceServicesCaption" },
  { href: "#assistant", titleKey: "serviceAssistantTitle", captionKey: "serviceAssistantCaption" },
  { href: "#volunteers", titleKey: "serviceVolunteersTitle", captionKey: "serviceVolunteersCaption" },
  { href: "#buildings", titleKey: "serviceBuildingsTitle", captionKey: "serviceBuildingsCaption" }
];

const localizedRoutes = {
  en: {
    "first-visit": ["First Visit Route", "Enter from the northwest gate, view the living area and learning center first, then continue east to the academic buildings and service center."],
    "learning-life": ["Study and Daily Life Route", "Covers library access, academic buildings, dining and student services, suitable for new students and exchange students."],
    "culture-tour": ["Culture Tour Route", "Connects theatre, music hall, art building and museum resources for visitors with limited time."]
  },
  ja: {
    "first-visit": ["初回見学ルート", "北西門から入り、生活エリアと学習センターを見てから東側の学部棟とサービスセンターへ進みます。"],
    "learning-life": ["学習生活ルート", "図書利用、学部棟、食堂、学生サービスを回り、新入生や交換留学生の日常動線の把握に向いています。"],
    "culture-tour": ["文化見学ルート", "劇場、音楽ホール、芸術棟、博物館資源を結ぶ短時間見学向けのルートです。"]
  },
  es: {
    "first-visit": ["Ruta de primera visita", "Entra por la puerta noroeste, recorre primero la zona de vida y el centro de aprendizaje, y continúa hacia los edificios académicos y servicios."],
    "learning-life": ["Ruta de estudio y vida", "Incluye biblioteca, edificios académicos, comedores y servicios estudiantiles para nuevos estudiantes e intercambio."],
    "culture-tour": ["Ruta cultural", "Conecta teatro, sala de música, edificio de arte y recursos del museo para visitas breves."]
  },
  fr: {
    "first-visit": ["Itinéraire de première visite", "Entrez par la porte nord-ouest, découvrez d’abord les espaces de vie et d’étude, puis avancez vers les bâtiments académiques et services."],
    "learning-life": ["Itinéraire études et vie", "Couvre bibliothèque, bâtiments académiques, restauration et services étudiants, adapté aux nouveaux étudiants et échanges."],
    "culture-tour": ["Itinéraire culturel", "Relie théâtre, salle de musique, bâtiment des arts et ressources du musée pour une visite courte."]
  },
  de: {
    "first-visit": ["Route für den ersten Besuch", "Vom Nordwesttor aus zuerst Wohnbereich und Lernzentrum ansehen, dann weiter zu akademischen Gebäuden und Servicezentrum."],
    "learning-life": ["Route für Studium und Alltag", "Umfasst Bibliothek, akademische Gebäude, Mensen und Studierendenservices, geeignet für neue und Austauschstudierende."],
    "culture-tour": ["Kulturroute", "Verbindet Theater, Musikhalle, Kunstgebäude und Museumsangebote für kurze Besuche."]
  },
  ru: {
    "first-visit": ["Маршрут первого визита", "Войдите через северо-западные ворота, сначала осмотрите жилую зону и учебный центр, затем идите к учебным корпусам и сервисному центру."],
    "learning-life": ["Маршрут учебы и быта", "Охватывает библиотеку, учебные корпуса, столовые и студенческие сервисы для новых и обменных студентов."],
    "culture-tour": ["Культурный маршрут", "Соединяет театр, музыкальный зал, корпус искусств и музейные ресурсы для короткого визита."]
  }
};

const placeNameTranslations = {
  en: {
    "西运动场": "West Sports Field",
    "北一公寓": "North 1 Apartment",
    "北二公寓及生活服务区": "North 2 Apartment and Service Area",
    "北区学部楼（公学三楼）": "North Academic Building (Gongxue Building 3)",
    "学生事务中心": "Student Affairs Center",
    "吴玉章图书馆": "Wu Yuzhang Library",
    "京东群学楼": "JD Qunxue Building",
    "西南学部楼": "Southwest Academic Building",
    "中心食堂": "Central Canteen",
    "校园运行中心": "Campus Operations Center",
    "先锋剧场": "Pioneer Theater",
    "郭影秋音乐厅": "Guo Yingqiu Music Hall",
    "艺术楼": "Art Building",
    "线上VR体验": "Online VR Experience",
    "校史展": "University History Exhibition",
    "医务中心": "Medical Center",
    "公学一楼": "Gongxue Building 1",
    "公学二楼": "Gongxue Building 2",
    "管理学部楼（公学四楼）": "School of Management Building (Gongxue Building 4)",
    "北区食堂": "North Canteen",
    "叶澄海楼": "Ye Chenghai Building",
    "未来传播中心": "Future Communication Center",
    "博物馆概述": "Museum Overview"
  }
};

["ja", "es", "fr", "de", "ru"].forEach((code) => {
  placeNameTranslations[code] = placeNameTranslations.en;
});

const typeTranslations = {
  en: {
    "餐饮配套": "Dining",
    "住宿生活": "Residence and Life",
    "运动健康": "Sports and Health",
    "校园服务": "Campus Service",
    "艺术文化": "Arts and Culture",
    "教学科研": "Teaching and Research",
    "校园建筑": "Campus Building"
  }
};

["ja", "es", "fr", "de", "ru"].forEach((code) => {
  typeTranslations[code] = typeTranslations.en;
});

const localizedAssistant = {
  en: {
    welcome: "Ask me about visit routes, check-in, dining, hotels, the museum, VR experience or volunteer help.",
    fallback: "I do not have a confirmed answer in the page data yet. Please check the map, place index and volunteer section, and confirm time-sensitive details with school notices or volunteers.",
    prompts: [
      "What route is best for a first visit?",
      "Where should new students go first?",
      "Where can I eat on campus?",
      "How should I choose nearby hotels?",
      "How can I visit the history exhibition and VR?",
      "How do I contact volunteers?"
    ],
    answers: {
      route: "For a first visit, use the First Visit Route: West Sports Field -> North 1 Apartment -> North 2 Apartment and Service Area -> North Academic Building -> Student Affairs Center. Route stops can return the map to the right focus.",
      checkin: "New students should first pay attention to the Student Affairs Center. It is the entry point for integrated services such as academic development, career planning and counseling. Also confirm same-day arrangements with HelloRUC volunteers.",
      dining: "For on-campus dining, check the Central Canteen and North Canteen. Nearby restaurants are listed in Dining & Hotels with photos and basic information.",
      hotels: "Switch Dining & Hotels to Hotels. The cards include photos, addresses, phone numbers, notes and external links where available.",
      museum: "The history exhibition is on the garden floor of North 2 Apartment and usually takes about 30-45 minutes. The VR section provides screenshots and a QR code. Confirm opening or booking changes on site or with volunteers.",
      volunteer: "Use the HelloRUC Volunteers section for human help. It includes volunteer profiles and the chat QR code for routes, check-in, dining, lodging and campus services.",
      map: "Map markers only cover places with real campus photos. Click a numbered marker to view the place type, description and photos; zoom and drag the map for local detail."
    }
  }
};

localizedAssistant.ja = {
  welcome: "見学ルート、受付、食事、ホテル、博物館、VR、ボランティア支援について質問できます。",
  fallback: "ページ資料では確定できる回答がまだありません。地図、地点索引、ボランティア欄を確認し、時刻や予約などは学校通知またはボランティアに確認してください。",
  prompts: ["初回見学に適したルートは？", "新入生はまずどこへ行くべき？", "キャンパス内で食事できる場所は？", "周辺ホテルはどう選ぶ？", "校史展とVRはどう見学する？", "ボランティアに連絡するには？"],
  answers: {
    route: "初回見学は「初回見学ルート」がおすすめです。西運動場、北一アパート、北二アパートと生活サービスエリア、北区学部棟、学生事務センターを順に確認できます。",
    checkin: "新入生は学生事務センターを優先して確認してください。到着日の一時的な手配は HelloRUC ボランティアにも確認すると確実です。",
    dining: "校内は中心食堂と北区食堂を確認できます。周辺の飲食店は「食事・ホテル」欄に写真と基本情報をまとめています。",
    hotels: "「食事・ホテル」をホテルに切り替えてください。写真、住所、電話、備考、外部リンクがある場合はカードに表示されます。",
    museum: "校史展は北二アパートのガーデン階にあり、見学目安は約30-45分です。VR欄にはスクリーンショットとQRコードがあります。",
    volunteer: "人工サポートが必要な場合は HelloRUC ボランティア欄を確認してください。プロフィールとチャットQRコードがあります。",
    map: "地図マーカーは実景写真がある地点のみです。番号をクリックすると種類、紹介、写真を確認できます。"
  }
};

localizedAssistant.es = {
  welcome: "Puedes preguntar sobre rutas, registro, comida, hoteles, museo, VR o ayuda de voluntarios.",
  fallback: "La página aún no contiene una respuesta confirmada. Revisa el mapa, el índice y voluntarios; confirma horarios o reservas con avisos oficiales o voluntarios.",
  prompts: ["¿Qué ruta conviene para una primera visita?", "¿Adónde deben ir primero los nuevos estudiantes?", "¿Dónde se puede comer en el campus?", "¿Cómo elegir hoteles cercanos?", "¿Cómo visitar la exposición histórica y VR?", "¿Cómo contactar voluntarios?"],
  answers: {
    route: "Para una primera visita, usa la Ruta de primera visita: campo deportivo oeste, Apartamento Norte 1, Apartamento Norte 2 y servicios, edificio académico norte y Centro de Asuntos Estudiantiles.",
    checkin: "Los nuevos estudiantes deben fijarse primero en el Centro de Asuntos Estudiantiles y confirmar los arreglos del día con voluntarios HelloRUC.",
    dining: "En el campus revisa el Comedor Central y el Comedor Norte. Los restaurantes cercanos están en Comida y hoteles.",
    hotels: "Cambia Comida y hoteles a Hoteles. Las tarjetas muestran fotos, dirección, teléfono, notas y enlaces cuando existen.",
    museum: "La exposición histórica está en la planta jardín del Apartamento Norte 2 y suele tomar 30-45 minutos. La sección VR ofrece capturas y QR.",
    volunteer: "Para ayuda humana, usa la sección Voluntarios HelloRUC con perfiles y QR del chat.",
    map: "Los marcadores solo cubren lugares con fotos reales. Haz clic en un número para ver tipo, descripción y fotos."
  }
};

localizedAssistant.fr = {
  welcome: "Vous pouvez poser des questions sur les itinéraires, l’accueil, les repas, hôtels, musée, VR ou bénévoles.",
  fallback: "Les données de la page ne donnent pas encore de réponse confirmée. Consultez la carte, l’index et les bénévoles; vérifiez les horaires ou réservations via les avis officiels ou les bénévoles.",
  prompts: ["Quel itinéraire pour une première visite ?", "Où aller en premier pour les nouveaux étudiants ?", "Où manger sur le campus ?", "Comment choisir un hôtel proche ?", "Comment visiter l’exposition historique et la VR ?", "Comment contacter les bénévoles ?"],
  answers: {
    route: "Pour une première visite, suivez l’itinéraire de première visite : terrain ouest, Appartement Nord 1, Appartement Nord 2 et services, bâtiment académique nord, puis Centre des affaires étudiantes.",
    checkin: "Les nouveaux étudiants doivent d’abord repérer le Centre des affaires étudiantes et confirmer les dispositions du jour avec les bénévoles HelloRUC.",
    dining: "Sur le campus, consultez la cantine centrale et la cantine nord. Les restaurants proches sont dans Restauration & hôtels.",
    hotels: "Passez Restauration & hôtels sur Hôtels. Les cartes affichent photos, adresse, téléphone, notes et liens disponibles.",
    museum: "L’exposition historique se trouve au niveau jardin de l’Appartement Nord 2 et prend environ 30-45 minutes. La section VR fournit captures et QR code.",
    volunteer: "Pour une aide humaine, consultez la section Bénévoles HelloRUC avec profils et QR code du groupe.",
    map: "Les marqueurs couvrent seulement les lieux avec photos réelles. Cliquez sur un numéro pour voir type, description et photos."
  }
};

localizedAssistant.de = {
  welcome: "Fragen zu Routen, Ankunft, Essen, Hotels, Museum, VR oder Freiwilligenhilfe sind möglich.",
  fallback: "Die Seitendaten enthalten noch keine bestätigte Antwort. Prüfen Sie Karte, Index und Freiwillige; zeitkritische Details bitte mit offiziellen Hinweisen oder Freiwilligen bestätigen.",
  prompts: ["Welche Route passt zum ersten Besuch?", "Wohin sollten neue Studierende zuerst gehen?", "Wo kann man auf dem Campus essen?", "Wie wählt man nahe Hotels?", "Wie besucht man Geschichtsausstellung und VR?", "Wie kontaktiert man Freiwillige?"],
  answers: {
    route: "Für den ersten Besuch nutzen Sie die Route für den ersten Besuch: Westsportplatz, Nordapartment 1, Nordapartment 2 mit Servicebereich, nördliches akademisches Gebäude und Studierendenservice.",
    checkin: "Neue Studierende sollten zuerst das Studierendenservicezentrum beachten und Tagesregelungen mit HelloRUC-Freiwilligen bestätigen.",
    dining: "Auf dem Campus sind Zentralkantine und Nordkantine relevant. Restaurants in der Nähe stehen unter Essen & Hotels.",
    hotels: "Schalten Sie Essen & Hotels auf Hotels. Karten zeigen Fotos, Adresse, Telefon, Hinweise und verfügbare Links.",
    museum: "Die Geschichtsausstellung liegt auf der Gartenebene von Nordapartment 2 und dauert etwa 30-45 Minuten. Der VR-Bereich enthält Screenshots und QR-Code.",
    volunteer: "Für persönliche Hilfe nutzen Sie den Bereich HelloRUC-Freiwillige mit Profilen und Chat-QR-Code.",
    map: "Kartenmarker zeigen nur Orte mit realen Fotos. Klicken Sie eine Nummer für Typ, Beschreibung und Fotos."
  }
};

localizedAssistant.ru = {
  welcome: "Можно спросить о маршрутах, регистрации, питании, отелях, музее, VR или помощи волонтеров.",
  fallback: "В данных страницы пока нет подтвержденного ответа. Проверьте карту, индекс и раздел волонтеров; время и бронирование уточняйте по официальным уведомлениям или у волонтеров.",
  prompts: ["Какой маршрут выбрать для первого визита?", "Куда сначала идти новым студентам?", "Где поесть в кампусе?", "Как выбрать отель рядом?", "Как посетить историческую выставку и VR?", "Как связаться с волонтерами?"],
  answers: {
    route: "Для первого визита используйте маршрут первого визита: западное спортивное поле, Северное общежитие 1, Северное общежитие 2 и сервисная зона, северный учебный корпус и Центр студенческих дел.",
    checkin: "Новым студентам стоит сначала обратить внимание на Центр студенческих дел и уточнить расписание дня у волонтеров HelloRUC.",
    dining: "В кампусе проверьте Центральную и Северную столовые. Рестораны рядом указаны в разделе Еда и отели.",
    hotels: "Переключите Еда и отели на Отели. Карточки показывают фото, адрес, телефон, заметки и доступные ссылки.",
    museum: "Историческая выставка находится на садовом этаже Северного общежития 2 и обычно занимает 30-45 минут. В VR-разделе есть скриншоты и QR-код.",
    volunteer: "Для помощи человека откройте раздел волонтеров HelloRUC с профилями и QR-кодом чата.",
    map: "Маркеры показывают только места с реальными фото. Нажмите номер, чтобы увидеть тип, описание и фотографии."
  }
};

function t(key) {
  return (ui[state.language] || ui.cn)[key] || ui.cn[key] || key;
}

function displayName(name) {
  return placeNameTranslations[state.language]?.[name] || name;
}

function displayType(type) {
  return typeTranslations[state.language]?.[type] || type;
}

function displayPlaceName(place) {
  return localText(place?.nameTranslations) || place?.name || "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localText(record) {
  if (!record) return "";
  if (typeof record === "string") return record;
  return record[state.language] || record.cn || record.en || Object.values(record).find(Boolean) || "";
}

function summarize(text, max = 116) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max)}...`;
}

function imageOrFallback(images) {
  return images?.find(Boolean) || "";
}

function hasRealImages(building) {
  return Array.isArray(building?.images) && building.images.some(Boolean);
}

function campusPlaces() {
  return (data.buildings || []).filter(hasRealImages);
}

function openBuildings() {
  return campusPlaces().filter((building) => building.status !== "future");
}

function futureBuildings() {
  return campusPlaces().filter((building) => building.status === "future");
}

function mapBuildings() {
  return openBuildings().filter((building) => building.mapEnabled && Array.isArray(building.position));
}

function imageHtml(src, alt, className = "") {
  if (!src) {
    return `<div class="empty-state ${className}">${t("noImage")}</div>`;
  }
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'empty-state',textContent:'${t("noImage")}'}))">`;
}

function activeBuilding() {
  return data.buildings?.find((item) => item.id === state.activeBuildingId) || mapBuildings()[0] || openBuildings()[0];
}

function findBuildingByName(name) {
  return data.buildings?.find((item) => item.name === name || item.name.includes(name) || name.includes(item.name));
}

function findMapBuildingByName(name) {
  return mapBuildings().find((item) => item.name === name || item.name.includes(name) || name.includes(item.name));
}

function setActiveBuilding(id, shouldScroll = false) {
  const target = data.buildings?.find((item) => item.id === id);
  if (!target) return;
  state.activeBuildingId = id;
  renderActiveBuilding();
  renderMapMarkers();
  renderBuildings();
  if (shouldScroll) {
    document.querySelector("#campus")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderLanguages() {
  elements.languageBar.innerHTML = languages
    .map(([code, label]) => `
      <button type="button" class="${code === state.language ? "is-active" : ""}" data-lang="${code}">
        ${escapeHtml(label)}
      </button>
    `)
    .join("");
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function renderStaticText() {
  const navItems = [
    ["#campus", "navMap"],
    ["#visit", "navVisit"],
    ["#museum", "navMuseum"],
    ["#services", "navServices"],
    ["#assistant", "navAssistant"],
    ["#volunteers", "navVolunteers"]
  ];
  navItems.forEach(([href, key]) => setText(`.top-nav a[href="${href}"]`, t(key)));

  setText(".brand small", t("brandSmall"));
  setText(".hero .eyebrow", t("heroEyebrow"));
  setText(".hero h1", t("heroTitle"));
  setText(".hero-text", t("heroText"));
  setText(".primary-action", t("heroPrimary"));
  setText(".secondary-action", t("heroSecondary"));

  [
    ["#campus", "campusEyebrow", "campusTitle", "campusText"],
    ["#visit", "visitEyebrow", "visitTitle", "visitText"],
    ["#museum", "museumEyebrow", "museumTitle", "museumText"],
    ["#volunteers", "volunteerEyebrow", "volunteerTitle", "volunteerText"]
  ].forEach(([section, eyebrow, title, text]) => {
    setText(`${section} .section-head .eyebrow`, t(eyebrow));
    setText(`${section} .section-head h2`, t(title));
    setText(`${section} .section-head p:not(.eyebrow)`, t(text));
  });

  setText("#buildings .section-head .eyebrow", t("buildingsEyebrow"));
  setText("#buildings .section-head h2", t("buildingsTitle"));
  elements.buildingSearch.placeholder = t("buildingSearch");
  setText("#services .section-head .eyebrow", t("servicesEyebrow"));
  setText("#services .section-head h2", t("servicesTitle"));
  setText('#place-tabs button[data-kind="restaurants"]', t("restaurantTab"));
  setText('#place-tabs button[data-kind="hotels"]', t("hotelTab"));
  setText("#assistant .section-head .eyebrow", t("assistantEyebrow"));
  setText("#assistant .section-head h2", t("assistantTitle"));
  setText("#assistant .section-head p", t("assistantText"));
  setText(".panel-header span", t("currentPlace"));
  setText(".qr-panel strong", t("qrTitle"));
  setText(".qr-panel span", t("qrText"));
  setText(".site-footer span", t("footerTitle"));
  setText(".site-footer a", t("backTop"));
}

function renderHeroServices() {
  elements.heroServices.innerHTML = serviceLinks
    .map((item) => `
      <a class="service-link" href="${item.href}">
        <strong>${escapeHtml(t(item.titleKey))}</strong>
        <span>${escapeHtml(t(item.captionKey))}</span>
      </a>
    `)
    .join("");
}

function renderStats() {
  const stats = [
    [data.stats?.buildingCount || 0, t("buildingStats")],
    [data.stats?.restaurantCount || 0, t("restaurantStats")],
    [data.stats?.hotelCount || 0, t("hotelStats")],
    [data.stats?.volunteerCount || 0, t("volunteerStats")],
    [data.stats?.museumSectionCount || 0, t("museumStats")]
  ];
  elements.statsStrip.innerHTML = stats
    .map(([value, label]) => `
      <div class="stat-item">
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(label)}</span>
      </div>
    `)
    .join("");
}

function renderActiveBuilding() {
  const building = activeBuilding();
  if (!building) return;
  const description = localText(building.description) || t("noInfo");
  elements.activeBuildingName.textContent = displayName(building.name);
  elements.activeBuildingType.textContent = displayType(building.type);
  elements.activeBuildingDescription.textContent = description;
  const images = building.images?.length ? building.images : [building.icon].filter(Boolean);
  elements.activeBuildingGallery.innerHTML = images.length
    ? images.map((src) => imageHtml(src, building.name)).join("")
    : `<div class="empty-state">${t("noImage")}</div>`;
}

function renderMapMarkers() {
  elements.mapMarkers.innerHTML = mapBuildings()
    .map((building, index) => {
      const [x, y] = building.position;
      const active = building.id === state.activeBuildingId;
      const preview = building.icon || imageOrFallback(building.images);
      const label = displayName(building.name);
      return `
        <button
          class="marker-button ${active ? "is-active" : ""}"
          type="button"
          title="${escapeHtml(label)}"
          data-building="${escapeHtml(building.id)}"
          style="left:${x}%;top:${y}%"
        >
          <span class="marker-index">${index + 1}</span>
          <span class="marker-preview">
            ${preview ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(label)}">` : ""}
            <span>${escapeHtml(label)}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function setMapZoom(nextZoom, preserveCenter = true) {
  if (!elements.mapCanvas || !elements.mapScroll) return;
  const previousWidth = elements.mapCanvas.offsetWidth || 1;
  const previousHeight = elements.mapCanvas.offsetHeight || 1;
  const centerX = (elements.mapScroll.scrollLeft + elements.mapScroll.clientWidth / 2) / previousWidth;
  const centerY = (elements.mapScroll.scrollTop + elements.mapScroll.clientHeight / 2) / previousHeight;

  state.mapZoom = Math.min(2.6, Math.max(1, Number(nextZoom.toFixed(2))));
  elements.mapCanvas.style.width = `${state.mapZoom * 100}%`;

  window.requestAnimationFrame(() => {
    if (!preserveCenter) {
      elements.mapScroll.scrollTo({ left: 0, top: 0, behavior: "smooth" });
      return;
    }
    elements.mapScroll.scrollLeft = elements.mapCanvas.offsetWidth * centerX - elements.mapScroll.clientWidth / 2;
    elements.mapScroll.scrollTop = elements.mapCanvas.offsetHeight * centerY - elements.mapScroll.clientHeight / 2;
  });

  elements.mapControls?.querySelector('[data-map-action="zoom-out"]')?.toggleAttribute("disabled", state.mapZoom <= 1);
  elements.mapControls?.querySelector('[data-map-action="zoom-in"]')?.toggleAttribute("disabled", state.mapZoom >= 2.6);
}

function renderRoutes() {
  elements.routeGrid.innerHTML = (data.routes || [])
    .map((route) => {
      const [title, summary] = localizedRoutes[state.language]?.[route.id] || [route.title, route.summary];
      return `
        <article class="route-card">
          <span class="tag">${escapeHtml(t("routeStops"))}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(summary)}</p>
          <div class="route-stops">
            ${(route.stops || []).map((stop) => {
              const building = findMapBuildingByName(stop);
              const label = displayName(stop);
              return building
                ? `<button class="route-stop" type="button" data-building="${escapeHtml(building.id)}">${escapeHtml(label)}</button>`
                : `<span class="route-stop">${escapeHtml(label)}</span>`;
            }).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function answerQuestion(question) {
  const query = String(question || "").trim().toLowerCase();
  if (state.language !== "cn" && localizedAssistant[state.language]) {
    const assistant = localizedAssistant[state.language];
    if (!query) return assistant.welcome;
    if (["first", "visit", "route", "tour", "map"].some((keyword) => query.includes(keyword))) return assistant.answers.route;
    if (["new", "check", "student", "registration"].some((keyword) => query.includes(keyword))) return assistant.answers.checkin;
    if (["eat", "dining", "food", "restaurant", "canteen"].some((keyword) => query.includes(keyword))) return assistant.answers.dining;
    if (["hotel", "stay", "lodging"].some((keyword) => query.includes(keyword))) return assistant.answers.hotels;
    if (["museum", "history", "vr", "exhibition"].some((keyword) => query.includes(keyword))) return assistant.answers.museum;
    if (["volunteer", "help", "contact", "chat"].some((keyword) => query.includes(keyword))) return assistant.answers.volunteer;
    return assistant.fallback;
  }
  const items = data.aiAssistant?.answers || [];
  if (!query) return data.aiAssistant?.welcome || items[0]?.answer || t("noInfo");
  const matched = items.find((item) => (item.keywords || []).some((keyword) => query.includes(String(keyword).toLowerCase())));
  return matched?.answer || data.aiAssistant?.fallback || t("noInfo");
}

function assistantContext() {
  return {
    language: state.language,
    stats: data.stats,
    activeBuilding: activeBuilding()?.name || "",
    buildings: campusPlaces().map((item) => ({
      name: displayName(item.name),
      type: displayType(item.type),
      status: item.status || "open",
      description: summarize(localText(item.description), 160)
    })),
    routes: data.routes || [],
    museum: (data.museum || []).map((item) => ({
      title: item.title,
      info: summarize(localText(item.info), 220)
    }))
  };
}

function assistantMessages(question) {
  return [
    {
      role: "system",
      content: [
        "你是 HelloRUC Tongzhou 的校园导览问答助手。",
        "请面向参访者、新生和国际友人回答，语言自然、简洁、可靠。",
        "只根据用户问题、页面上下文和可确认的信息回答；涉及实时政策、开放时间、预约、报到安排时提醒用户以学校通知、现场信息或志愿者确认为准。",
        "不要暴露开发实现、API、后端、知识库等技术细节。"
      ].join("\n")
    },
    {
      role: "user",
      content: `页面上下文：\n${JSON.stringify(assistantContext()).slice(0, 12000)}\n\n用户问题：${String(question || "").trim()}`
    }
  ];
}

async function requestDirectModelAnswer(question, signal) {
  const config = window.HELLO_RUC_ASSISTANT || {};
  const apiKey = String(config.apiKey || "").trim();
  if (!apiKey || apiKey === "你的_DeepSeek_API_Key") return "";

  const baseUrl = String(config.baseUrl || "https://api.deepseek.com").replace(/\/$/, "");
  const model = String(config.model || "deepseek-v4-flash").trim();
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: assistantMessages(question)
    }),
    signal
  });
  if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
  const payload = await response.json();
  return String(payload.choices?.[0]?.message?.content || "").trim();
}

async function requestOnlineAnswer(question) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  try {
    try {
      const directAnswer = await requestDirectModelAnswer(question, controller.signal);
      if (directAnswer) return directAnswer;
    } catch (error) {
      console.warn("Direct model request unavailable", error);
    }

    const response = await fetch(window.HELLO_RUC_ASSISTANT_ENDPOINT || "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        context: assistantContext()
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Assistant request failed: ${response.status}`);
    const payload = await response.json();
    return String(payload.answer || "").trim();
  } catch (error) {
    console.warn("Online assistant unavailable", error);
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function askAssistant(question) {
  state.assistantQuestion = String(question || "").trim();
  state.assistantAnswer = "";
  if (!state.assistantQuestion) {
    renderAssistant();
    return;
  }
  state.assistantLoading = true;
  renderAssistant();
  const localAnswer = answerQuestion(state.assistantQuestion);
  try {
    const onlineAnswer = await requestOnlineAnswer(state.assistantQuestion);
    state.assistantAnswer = onlineAnswer || localAnswer;
  } catch {
    state.assistantAnswer = localAnswer;
  } finally {
    state.assistantLoading = false;
    renderAssistant();
  }
}

function renderAssistant() {
  if (!elements.assistantAnswer) return;
  elements.assistantInput.placeholder = t("askPlaceholder");
  elements.assistantForm.querySelector("button").textContent = t("askButton");
  const answer = state.assistantLoading
    ? t("asking")
    : state.assistantAnswer || answerQuestion(state.assistantQuestion);
  elements.assistantAnswer.innerHTML = `<p>${escapeHtml(answer)}</p>`;
  const prompts = localizedAssistant[state.language]?.prompts || data.aiAssistant?.prompts || [];
  elements.assistantPrompts.innerHTML = prompts
    .map((prompt) => `<button class="assistant-prompt" type="button" data-question="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`)
    .join("");
}

function renderBuildingFilter() {
  const types = Array.from(new Set(campusPlaces().map((item) => item.type))).sort();
  elements.buildingFilter.innerHTML = [
    `<option value="all">${t("allTypes")}</option>`,
    ...types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(displayType(type))}</option>`)
  ].join("");
}

function buildingMatches(building) {
  const query = state.buildingQuery.trim().toLowerCase();
  const description = localText(building.description);
  const haystack = `${building.name} ${displayName(building.name)} ${building.type} ${displayType(building.type)} ${description}`.toLowerCase();
  const typeOk = state.buildingType === "all" || building.type === state.buildingType;
  return typeOk && (!query || haystack.includes(query));
}

function buildingCard(building, options = {}) {
  const src = imageOrFallback(building.images) || building.icon;
  const description = localText(building.description);
  const body = `
    ${imageHtml(src, building.name)}
    <span class="card-body">
      <span class="tag">${escapeHtml(options.tag || displayType(building.type))}</span>
      <h3>${escapeHtml(displayName(building.name))}</h3>
      ${description ? `<p>${escapeHtml(summarize(description, 86))}</p>` : ""}
    </span>
  `;
  if (options.static) {
    return `<article class="building-card building-card-static">${body}</article>`;
  }
  return `
    <button class="building-card ${building.id === state.activeBuildingId ? "is-active" : ""}" type="button" data-building="${escapeHtml(building.id)}">
      ${body}
    </button>
  `;
}

function renderBuildings() {
  const openList = openBuildings().filter(buildingMatches);
  const futureList = futureBuildings().filter(buildingMatches);
  const blocks = [];

  if (openList.length) {
    blocks.push(`<h3 class="building-group-title">${escapeHtml(t("availablePlaces"))}</h3>`);
    blocks.push(...openList.map((building) => buildingCard(building)));
  }

  if (futureList.length) {
    blocks.push(`<h3 class="building-group-title">${escapeHtml(t("futurePlaces"))}</h3>`);
    blocks.push(...futureList.map((building) => buildingCard(building, { static: true, tag: t("futureNote") })));
  }

  elements.buildingGrid.innerHTML = blocks.length
    ? blocks.join("")
    : `<div class="empty-state">${escapeHtml(t("searchEmpty"))}</div>`;
}

function renderMuseum() {
  const historySection = (data.museum || []).find((item) => item.id === "校史展");
  const historyImages = historySection?.images || [];
  const historyBackground = historyImages.length
    ? historyImages[state.museumBackgroundIndex % historyImages.length]
    : "";
  elements.museumGrid.innerHTML = (data.museum || [])
    .map((item) => {
      const info = localText(item.info) || t("noInfo");
      const title = displayName(item.title);
      if (item.id === "线上VR体验") {
        const qr = (item.images || []).find((src) => src.includes("二维码"));
        const screenshots = (item.images || []).filter((src) => src !== qr);
        return `
          <article class="museum-card museum-vr-card">
            <span class="tag">${escapeHtml(title)}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(info)}</p>
            <div class="museum-vr-layout">
              <div class="museum-screenshots">
                ${screenshots.map((src) => imageHtml(src, title)).join("") || `<div class="empty-state">${t("noImage")}</div>`}
              </div>
              <aside class="museum-qr">
                ${imageHtml(qr, `${title}二维码`)}
                <strong>${escapeHtml(t("vrQr"))}</strong>
              </aside>
            </div>
          </article>
        `;
      }
      if (item.id === "校史展") {
        const gallery = (item.images || []).filter((src) => src !== historyBackground);
        return `
          <article class="museum-card museum-history-card" style="--museum-bg: url('${escapeHtml(historyBackground || "")}')">
            <div>
              <span class="tag">${escapeHtml(title)}</span>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(info)}</p>
            </div>
            <div class="museum-gallery">
              ${(gallery.length ? gallery : item.images || []).map((src) => imageHtml(src, title)).join("") || `<div class="empty-state">${t("noImage")}</div>`}
            </div>
          </article>
        `;
      }
      if (item.id === "概述") {
        const background = (item.images || []).find((src) => /bg\.(png|jpe?g|webp)$/i.test(src)) || imageOrFallback(item.images);
        const logo = (item.images || []).find((src) => /logo\.(png|jpe?g|webp)$/i.test(src)) || "";
        return `
          <article class="museum-card museum-overview-card" style="--overview-bg: url('${escapeHtml(background || "")}'); --overview-logo: url('${escapeHtml(logo || "")}')">
            <span class="tag">${escapeHtml(title)}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(info)}</p>
          </article>
        `;
      }
      return `
        <article class="museum-card museum-overview-card">
          <span class="tag">${escapeHtml(title)}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(info)}</p>
          <div class="museum-gallery">
            ${(item.images || []).map((src) => imageHtml(src, title)).join("") || `<div class="empty-state">${t("noImage")}</div>`}
          </div>
        </article>
      `;
    })
    .join("");
}

function fieldLabel(field) {
  const map = {
    地址: t("address"),
    电话: t("phone"),
    评分: t("rating"),
    人均: t("price"),
    类别: t("category"),
    营业时间: t("hours"),
    酒店等级: t("level"),
    邮箱: t("email"),
    备注: t("remark")
  };
  return map[field] || field;
}

function placeMeta(place) {
  const preferred = place.kind === "酒店"
    ? ["酒店等级", "地址", "电话", "邮箱", "备注"]
    : ["类别", "评分", "人均", "营业时间", "地址", "电话", "备注"];
  const rows = preferred
    .filter((field) => place.fields?.[field])
    .map((field) => {
      const value = localText(place.fieldTranslations?.[field]) || place.fields[field];
      return `<span><strong>${escapeHtml(fieldLabel(field))}:</strong> ${escapeHtml(value)}</span>`;
    });
  return rows.join("");
}

function renderPlaces() {
  const list = state.placeKind === "hotels" ? data.hotels || [] : data.restaurants || [];
  elements.placeGrid.innerHTML = list
    .map((place) => {
      const image = imageOrFallback(place.images);
      const link = place.fields?.["链接"];
      const name = displayPlaceName(place);
      return `
        <article class="place-card">
          ${imageHtml(image, name)}
          <div>
            <span class="tag">${escapeHtml(place.kind === "酒店" ? t("hotelTab") : t("restaurantTab"))}</span>
            <h3>${escapeHtml(name)}</h3>
          </div>
          <div class="place-meta">${placeMeta(place)}</div>
          ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${t("website")}</a>` : ""}
        </article>
      `;
    })
    .join("");
}

function renderVolunteers() {
  elements.volunteerGrid.innerHTML = (data.volunteers || [])
    .map((person) => `
      <article class="volunteer-card">
        ${imageHtml(person.photo, person.name)}
        <h3>${escapeHtml(person.name)}</h3>
        <p>${escapeHtml(person.intro || t("noInfo"))}</p>
      </article>
    `)
    .join("");
}

function bindEvents() {
  elements.languageBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]");
    if (!button) return;
    state.language = button.dataset.lang;
    document.documentElement.lang = state.language === "cn" ? "zh-CN" : state.language;
    renderAll();
  });

  elements.mapMarkers.addEventListener("click", (event) => {
    const button = event.target.closest("[data-building]");
    if (button) setActiveBuilding(button.dataset.building);
  });

  elements.routeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-building]");
    if (button) setActiveBuilding(button.dataset.building, true);
  });

  elements.buildingGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-building]");
    if (button) setActiveBuilding(button.dataset.building, true);
  });

  elements.buildingSearch.addEventListener("input", (event) => {
    state.buildingQuery = event.target.value;
    renderBuildings();
  });

  elements.buildingFilter.addEventListener("change", (event) => {
    state.buildingType = event.target.value;
    renderBuildings();
  });

  elements.placeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind]");
    if (!button) return;
    state.placeKind = button.dataset.kind;
    elements.placeTabs.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderPlaces();
  });

  elements.assistantForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    askAssistant(elements.assistantInput.value);
  });

  elements.assistantPrompts?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-question]");
    if (!button) return;
    elements.assistantInput.value = button.dataset.question;
    askAssistant(button.dataset.question);
  });

  elements.mapControls?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-map-action]");
    if (!button) return;
    const action = button.dataset.mapAction;
    if (action === "zoom-in") setMapZoom(state.mapZoom + 0.25);
    if (action === "zoom-out") setMapZoom(state.mapZoom - 0.25);
    if (action === "reset") setMapZoom(1, false);
  });

  elements.mapScroll?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a, input, select")) return;
    state.isMapDragging = true;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragScrollLeft = elements.mapScroll.scrollLeft;
    state.dragScrollTop = elements.mapScroll.scrollTop;
    elements.mapScroll.classList.add("is-dragging");
    elements.mapScroll.setPointerCapture(event.pointerId);
  });

  elements.mapScroll?.addEventListener("pointermove", (event) => {
    if (!state.isMapDragging) return;
    event.preventDefault();
    elements.mapScroll.scrollLeft = state.dragScrollLeft - (event.clientX - state.dragStartX);
    elements.mapScroll.scrollTop = state.dragScrollTop - (event.clientY - state.dragStartY);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    elements.mapScroll?.addEventListener(eventName, () => {
      state.isMapDragging = false;
      elements.mapScroll.classList.remove("is-dragging");
    });
  });
}

function renderAll() {
  renderStaticText();
  renderHeroServices();
  renderLanguages();
  renderStats();
  renderActiveBuilding();
  renderMapMarkers();
  renderRoutes();
  renderBuildingFilter();
  elements.buildingFilter.value = state.buildingType;
  renderBuildings();
  renderMuseum();
  renderPlaces();
  renderAssistant();
  renderVolunteers();
}

renderAll();
bindEvents();
setMapZoom(1, false);

if ((data.museum || []).some((item) => item.id === "校史展" && item.images?.length > 1)) {
  window.setInterval(() => {
    const history = (data.museum || []).find((item) => item.id === "校史展");
    const count = history?.images?.length || 0;
    if (!count) return;
    state.museumBackgroundIndex = (state.museumBackgroundIndex + 1) % count;
    renderMuseum();
  }, 5000);
}
