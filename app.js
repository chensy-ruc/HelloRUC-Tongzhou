const data = window.SITE_DATA || {};

const state = {
  language: "cn",
  activeBuildingId: data.buildings?.[0]?.id || "",
  placeKind: "restaurants",
  buildingQuery: "",
  buildingType: "all",
  assistantQuestion: ""
};

const languages = [
  ["cn", "中文"],
  ["en", "EN"],
  ["ja", "日本語"],
  ["es", "ES"],
  ["fr", "FR"],
  ["de", "DE"],
  ["ru", "RU"]
];

const ui = {
  cn: {
    noInfo: "资料待补充",
    noImage: "暂无图片",
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
    askButton: "提问"
  },
  en: {
    noInfo: "More information will be added",
    noImage: "No image yet",
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
    askButton: "Ask"
  }
};

const elements = {
  languageBar: document.querySelector("#language-bar"),
  heroServices: document.querySelector("#hero-services"),
  statsStrip: document.querySelector("#stats-strip"),
  activeBuildingName: document.querySelector("#active-building-name"),
  activeBuildingType: document.querySelector("#active-building-type"),
  activeBuildingDescription: document.querySelector("#active-building-description"),
  activeBuildingGallery: document.querySelector("#active-building-gallery"),
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
  { href: "#campus", title: "校园地图", caption: "建筑定位、实景图片、手绘地图" },
  { href: "#visit", title: "参访路线", caption: "首次到访、学习生活、文化参观" },
  { href: "#museum", title: "校史与VR", caption: "校史展、多语种介绍、线上体验" },
  { href: "#services", title: "餐饮酒店", caption: "周边餐厅、酒店、联系方式" },
  { href: "#assistant", title: "AI问答", caption: "路线、报到、餐饮与校园服务" },
  { href: "#volunteers", title: "志愿者", caption: "志愿者介绍与群聊二维码" },
  { href: "#buildings", title: "地点索引", caption: "搜索筛选校园建筑与服务点" }
];

function t(key) {
  return (ui[state.language] || ui.cn)[key] || ui.cn[key] || key;
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

function mapBuildings() {
  return (data.buildings || []).filter((building) => Array.isArray(building.position) && hasRealImages(building));
}

function imageHtml(src, alt, className = "") {
  if (!src) {
    return `<div class="empty-state ${className}">${t("noImage")}</div>`;
  }
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'empty-state',textContent:'${t("noImage")}'}))">`;
}

function activeBuilding() {
  return data.buildings?.find((item) => item.id === state.activeBuildingId) || data.buildings?.[0];
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

function renderHeroServices() {
  elements.heroServices.innerHTML = serviceLinks
    .map((item) => `
      <a class="service-link" href="${item.href}">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.caption)}</span>
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
  elements.activeBuildingName.textContent = building.name;
  elements.activeBuildingType.textContent = building.type;
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
      return `
        <button
          class="marker-button ${active ? "is-active" : ""}"
          type="button"
          title="${escapeHtml(building.name)}"
          data-building="${escapeHtml(building.id)}"
          style="left:${x}%;top:${y}%"
        >
          <span class="marker-index">${index + 1}</span>
          <span class="marker-preview">
            ${preview ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(building.name)}">` : ""}
            <span>${escapeHtml(building.name)}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderRoutes() {
  elements.routeGrid.innerHTML = (data.routes || [])
    .map((route) => `
      <article class="route-card">
        <span class="tag">${escapeHtml(t("routeStops"))}</span>
        <h3>${escapeHtml(route.title)}</h3>
        <p>${escapeHtml(route.summary)}</p>
        <div class="route-stops">
          ${(route.stops || []).map((stop) => {
            const building = findMapBuildingByName(stop);
            return building
              ? `<button class="route-stop" type="button" data-building="${escapeHtml(building.id)}">${escapeHtml(stop)}</button>`
              : `<span class="route-stop">${escapeHtml(stop)}</span>`;
          }).join("")}
        </div>
      </article>
    `)
    .join("");
}

function answerQuestion(question) {
  const query = String(question || "").trim().toLowerCase();
  const items = data.aiAssistant?.answers || [];
  if (!query) return data.aiAssistant?.welcome || items[0]?.answer || t("noInfo");
  const matched = items.find((item) => (item.keywords || []).some((keyword) => query.includes(String(keyword).toLowerCase())));
  return matched?.answer || data.aiAssistant?.fallback || t("noInfo");
}

function renderAssistant() {
  if (!elements.assistantAnswer) return;
  elements.assistantInput.placeholder = t("askPlaceholder");
  elements.assistantForm.querySelector("button").textContent = t("askButton");
  elements.assistantAnswer.innerHTML = `<p>${escapeHtml(answerQuestion(state.assistantQuestion))}</p>`;
  elements.assistantPrompts.innerHTML = (data.aiAssistant?.prompts || [])
    .map((prompt) => `<button class="assistant-prompt" type="button" data-question="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`)
    .join("");
}

function renderBuildingFilter() {
  const types = Array.from(new Set((data.buildings || []).map((item) => item.type))).sort();
  elements.buildingFilter.innerHTML = [
    `<option value="all">${t("allTypes")}</option>`,
    ...types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
  ].join("");
}

function buildingMatches(building) {
  const query = state.buildingQuery.trim().toLowerCase();
  const description = localText(building.description);
  const haystack = `${building.name} ${building.type} ${description}`.toLowerCase();
  const typeOk = state.buildingType === "all" || building.type === state.buildingType;
  return typeOk && (!query || haystack.includes(query));
}

function renderBuildings() {
  const list = (data.buildings || []).filter(buildingMatches);
  elements.buildingGrid.innerHTML = list.length
    ? list.map((building) => {
      const src = imageOrFallback(building.images) || building.icon;
      const description = localText(building.description) || t("noInfo");
      return `
        <button class="building-card ${building.id === state.activeBuildingId ? "is-active" : ""}" type="button" data-building="${escapeHtml(building.id)}">
          ${imageHtml(src, building.name)}
          <span class="card-body">
            <span class="tag">${escapeHtml(building.type)}</span>
            <h3>${escapeHtml(building.name)}</h3>
            <p>${escapeHtml(summarize(description, 86))}</p>
          </span>
        </button>
      `;
    }).join("")
    : `<div class="empty-state">没有找到匹配地点。</div>`;
}

function renderMuseum() {
  elements.museumGrid.innerHTML = (data.museum || [])
    .map((item) => {
      const info = localText(item.info) || t("noInfo");
      return `
        <article class="museum-card">
          <span class="tag">${escapeHtml(item.title)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(info)}</p>
          <div class="museum-gallery">
            ${(item.images || []).map((src) => imageHtml(src, item.title)).join("") || `<div class="empty-state">${t("noImage")}</div>`}
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
    .map((field) => `<span><strong>${escapeHtml(fieldLabel(field))}:</strong> ${escapeHtml(place.fields[field])}</span>`);
  return rows.length ? rows.join("") : `<span>${t("noInfo")}</span>`;
}

function renderPlaces() {
  const list = state.placeKind === "hotels" ? data.hotels || [] : data.restaurants || [];
  elements.placeGrid.innerHTML = list
    .map((place) => {
      const image = imageOrFallback(place.images);
      const link = place.fields?.["链接"];
      return `
        <article class="place-card">
          ${imageHtml(image, place.name)}
          <div>
            <span class="tag">${escapeHtml(place.kind)}</span>
            <h3>${escapeHtml(place.name)}</h3>
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
    state.assistantQuestion = elements.assistantInput.value;
    renderAssistant();
  });

  elements.assistantPrompts?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-question]");
    if (!button) return;
    state.assistantQuestion = button.dataset.question;
    elements.assistantInput.value = state.assistantQuestion;
    renderAssistant();
  });
}

function renderAll() {
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

renderHeroServices();
renderAll();
bindEvents();
