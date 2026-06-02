/* App logic — catalog in data/catalog.json (scripts/extract-catalog.mjs) */
let categorySeeds = [];

const NEW_CATEGORY_IDS = new Set(["social", "support", "3d", "nocode", "analytics-growth", "creative-video"]);

const CATEGORY_DISPLAY_ORDER = [
  "chat", "research", "writing", "image", "3d", "video", "creative-video", "audio",
  "dev", "agents", "nocode", "design", "marketing", "social", "seo", "analytics-growth",
  "productivity", "meeting", "support", "data", "education", "translation",
  "ecommerce", "hr", "legal-finance", "health", "models", "api", "safety"
];

const CATEGORY_EMOJI = {
  chat: "💬",
  research: "🔍",
  writing: "✍️",
  image: "🎨",
  "3d": "🧊",
  video: "🎬",
  "creative-video": "✂️",
  audio: "🎧",
  dev: "💻",
  agents: "🤖",
  nocode: "🧩",
  design: "🎯",
  marketing: "📣",
  social: "📱",
  seo: "📈",
  "analytics-growth": "📊",
  productivity: "⚡",
  meeting: "🗓️",
  support: "🛟",
  data: "📉",
  education: "🎓",
  translation: "🌐",
  ecommerce: "🛒",
  hr: "👥",
  "legal-finance": "⚖️",
  health: "🩺",
  models: "🧠",
  api: "🔌",
  safety: "🛡️"
};

let categoryStripExpanded = false;
let categoryCarouselReady = false;
let categoryRailSearch = "";
let categoryListBound = false;

const CATEGORY_GROUPS = [
  { id: "content", label: "对话与内容", ids: ["chat", "research", "writing"] },
  { id: "creative", label: "创作与媒体", ids: ["image", "video", "creative-video", "audio", "3d", "design"] },
  { id: "dev", label: "开发与自动化", ids: ["dev", "agents", "nocode", "api", "models"] },
  { id: "growth", label: "营销与增长", ids: ["marketing", "social", "seo", "analytics-growth", "ecommerce"] },
  { id: "work", label: "办公与协作", ids: ["productivity", "meeting", "support", "data", "education", "translation"] },
  { id: "pro", label: "专业领域", ids: ["hr", "legal-finance", "health", "safety"] }
];

function getOrderedCategorySeeds() {
  const byId = Object.fromEntries(categorySeeds.map((category) => [category.id, category]));
  const ordered = CATEGORY_DISPLAY_ORDER.map((id) => byId[id]).filter(Boolean);
  const rest = categorySeeds.filter((category) => !CATEGORY_DISPLAY_ORDER.includes(category.id));
  return [...ordered, ...rest];
}

const ORIGINAL_CATEGORY_COUNTS = {
  chat: 16,
  research: 12,
  writing: 13,
  image: 14,
  video: 15,
  audio: 14,
  dev: 15,
  agents: 15,
  design: 15,
  marketing: 14,
  seo: 12,
  productivity: 14,
  data: 14,
  education: 12,
  translation: 12,
  ecommerce: 14,
  hr: 13,
  "legal-finance": 12,
  health: 12,
  models: 12,
  api: 12,
  meeting: 12,
  safety: 12
};

function isNewTool(category, toolIndex) {
  if (NEW_CATEGORY_IDS.has(category.id)) return true;
  const baseline = ORIGINAL_CATEGORY_COUNTS[category.id];
  return baseline !== undefined && toolIndex >= baseline;
}

const priceLabels = {
  free: "免费/开源",
  freemium: "免费增值",
  paid: "付费"
};

const priceColors = {
  free: "#2fbf71",
  freemium: "#f7b731",
  paid: "#f45d48"
};

const logoManifest = window.LOGO_MANIFEST || {};

let searchDebounceTimer = 0;

const TOOLS_PER_PAGE = 36;
const INSIGHT_LIST_SIZE = 5;
const TOP_TAG_LIMIT = 10;
const HERO_TASK_TAGS = ["视频生成", "代码", "SEO", "写作", "PPT"];
const HERO_PLACEHOLDERS = [
  "想找视频剪辑、写代码、SEO 的 AI…",
  "例如：文生图、配音、自动化、论文…",
  "搜索工具名、任务或标签…"
];
const RECENT_SEARCH_KEY = "ai-nav-recent-searches";
const RECENT_SEARCH_LIMIT = 3;
const TRENDING_FALLBACK_NAMES = ["ChatGPT", "Midjourney", "Runway", "Cursor", "Perplexity"];
let spotlightTimer = 0;
let insightRailBound = false;
let placeholderTimer = 0;
let placeholderIndex = 0;

const MAX_COMPARE = 3;
const CATALOG_URL = "data/catalog.json?v=1";
const GLOBAL_RANKINGS_URL = "data/global-rankings.json?v=1";
const SITE_REPO_URL = "https://github.com/useragent-1/AI-";

const RANKING_TOOL_ALIASES = {
  "DeepSeek Chat": "DeepSeek",
  "Chat.OpenAI": "ChatGPT",
  "Qwen Chat": "通义千问",
  "Chat Mistral": "Le Chat",
  "文心一言 / 百度": "文心一言",
  "Microsoft Copilot": "Microsoft Copilot",
  "Mistral AI": "Mistral AI",
  "Factory AI": "Factory",
  "Harvey AI": "Harvey",
  "Google DeepMind": "DeepMind",
  "Meta AI": "Meta AI",
  "GetLiner": "Liner"
};

let globalRankings = null;

const state = {
  category: "all",
  query: "",
  price: "all",
  sort: "featured",
  favoritesOnly: false,
  newOnly: false,
  listPage: 1,
  viewMode: "grid",
  favorites: new Set(JSON.parse(localStorage.getItem("ai-nav-favorites") || "[]")),
  compare: new Set()
};

let lastFilterKey = "";
let categories = [];
let tools = [];
let pendingToolId = "";
let urlSyncReady = false;
let labToolMapCache = null;
let urlSyncTimer = 0;
let catalogGeneratedAt = "";

function buildCatalogIndex() {
  categories = [
  {
    id: "all",
    name: "全部工具",
    short: "All",
    color: "#14213d",
    description: "完整 AI 导航"
  },
    ...categorySeeds.map(({ tools: _tools, ...category }) => category)
];

  tools = categorySeeds.flatMap((category, categoryIndex) =>
  category.tools.map((tool, toolIndex) => {
    const [name, url, description, tags, price, featured] = tool;
    return {
      id: slugify(`${category.id}-${name}`),
      name,
      url,
      description,
      tags,
      price,
      featured,
      categoryId: category.id,
      categoryName: category.name,
      color: category.color,
        rank: categoryIndex * 100 + toolIndex,
        isNew: isNewTool(category, toolIndex)
    };
  })
);
}

const els = {
  searchInput: document.querySelector("#searchInput"),
  toolGrid: document.querySelector("#toolGrid"),
  categoryList: document.querySelector("#categoryList"),
  categorySearch: document.querySelector("#categorySearch"),
  quickGrid: document.querySelector("#quickGrid"),
  categoryCarousel: document.querySelector("#categoryCarousel"),
  categoryCarouselViewport: document.querySelector("#categoryCarouselViewport"),
  categoryScrollPrev: document.querySelector("#categoryScrollPrev"),
  categoryScrollNext: document.querySelector("#categoryScrollNext"),
  categoryDots: document.querySelector("#categoryDots"),
  categoryExpandToggle: document.querySelector("#categoryExpandToggle"),
  categoriesSection: document.querySelector("#categories"),
  trendingList: document.querySelector("#trendingList"),
  newList: document.querySelector("#newList"),
  tagCloud: document.querySelector("#tagCloud"),
  promptRow: document.querySelector("#promptRow"),
  hero: document.querySelector("#hero"),
  heroLead: document.querySelector("#heroLead"),
  heroSearchHint: document.querySelector("#heroSearchHint"),
  searchClear: document.querySelector("#searchClear"),
  heroRecent: document.querySelector("#heroRecent"),
  heroRecentList: document.querySelector("#heroRecentList"),
  toolsView: document.querySelector("#toolsView"),
  rankingsPage: document.querySelector("#rankings"),
  rankingsTableBody: document.querySelector("#rankingsTableBody"),
  rankingsTitle: document.querySelector("#rankingsTitle"),
  rankingsLead: document.querySelector("#rankingsLead"),
  rankingsEyebrow: document.querySelector("#rankingsEyebrow"),
  labPage: document.querySelector("#lab"),
  insightRail: document.querySelector("#insightRail"),
  resultTitle: document.querySelector("#resultTitle"),
  resultMeta: document.querySelector("#resultMeta"),
  activeTags: document.querySelector("#activeTags"),
  emptyState: document.querySelector("#emptyState"),
  emptyTitle: document.querySelector("#emptyTitle"),
  emptyHint: document.querySelector("#emptyHint"),
  emptyExpandSearch: document.querySelector("#emptyExpandSearch"),
  emptyClearQuery: document.querySelector("#emptyClearQuery"),
  emptyResetAll: document.querySelector("#emptyResetAll"),
  emptySuggestions: document.querySelector("#emptySuggestions"),
  emptySuggestionList: document.querySelector("#emptySuggestionList"),
  resultsPanel: document.querySelector(".results-panel"),
  toolListFooter: document.querySelector("#toolListFooter"),
  toolListMeta: document.querySelector("#toolListMeta"),
  toolLoadMore: document.querySelector("#toolLoadMore"),
  backToTop: document.querySelector("#backToTop"),
  newOnlyToggle: document.querySelector("#newOnlyToggle"),
  sortSelect: document.querySelector("#sortSelect"),
  clearFilters: document.querySelector("#clearFilters"),
  favoriteToggle: document.querySelector("#favoriteToggle"),
  toolTotal: document.querySelector("#toolTotal"),
  categoryTotal: document.querySelector("#categoryTotal"),
  freeTotal: document.querySelector("#freeTotal"),
  appLoading: document.querySelector("#appLoading"),
  viewToggle: document.querySelector("#viewToggle"),
  compareBar: document.querySelector("#compareBar"),
  compareMeta: document.querySelector("#compareMeta"),
  compareOpen: document.querySelector("#compareOpen"),
  compareClear: document.querySelector("#compareClear"),
  compareDialog: document.querySelector("#compareDialog"),
  comparePanel: document.querySelector("#comparePanel"),
  compareClose: document.querySelector("#compareClose"),
  catalogUpdated: document.querySelector("#catalogUpdated"),
  topNav: document.querySelector(".top-nav")
};

document.addEventListener("DOMContentLoaded", () => {
  bootstrap().catch((error) => {
    console.error(error);
    if (els.heroLead) els.heroLead.textContent = "工具库加载失败，请刷新页面重试。";
    if (els.appLoading) els.appLoading.textContent = "加载失败";
  });
});

async function bootstrap() {
  const payload = await loadCatalog();
  catalogGeneratedAt = payload.generatedAt || "";
  buildCatalogIndex();
  await Promise.all([loadGlobalRankings(), loadLabToolMapForDirectory()]);
  readStateFromURL();
  applyStateToControls();

  hydrateStats();
  renderSideRails();
  renderPromptChips();
  renderQuickLinks();
  initCategoryCarousel();
  renderCategories();
  bindCategoryListEvents();
  bindInsightRailEvents();
  bindComparePanelEvents();
  bindEvents();
  initHeroPlaceholder();
  renderRecentSearches();
  renderGlobalRankings();
  initAppNav();
  const initialView = getViewFromHash();
  if (initialView === "lab") {
    document.body.classList.add("view-lab");
    els.toolsView?.classList.add("is-hidden");
    if (els.labPage) {
      els.labPage.hidden = false;
      els.labPage.classList.add("is-active");
    }
  }
  if (window.NeuxLab) await window.NeuxLab.init(els);

  urlSyncReady = true;
  setAppView(initialView, { scroll: false });
  render();
  els.appLoading?.remove();

  if (pendingToolId) {
    const toolId = pendingToolId;
    pendingToolId = "";
    window.requestAnimationFrame(() => focusToolInList(toolId));
  }
}

async function loadCatalog() {
  const response = await fetch(CATALOG_URL);
  if (!response.ok) throw new Error(`Failed to load catalog: ${response.status}`);
  const payload = await response.json();
  categorySeeds = payload.categories || [];
  return payload;
}

async function loadLabToolMapForDirectory() {
  if (labToolMapCache) return labToolMapCache;
  try {
    const res = await fetch("data/lab-tool-map.json?v=1");
    if (res.ok) labToolMapCache = await res.json();
    else labToolMapCache = { byToolId: {}, byDomain: {} };
  } catch {
    labToolMapCache = { byToolId: {}, byDomain: {} };
  }
  return labToolMapCache;
}

function getLabProviderForTool(tool) {
  if (!labToolMapCache || !tool) return "";
  const domain = getDomain(tool.url);
  return labToolMapCache.byToolId?.[tool.id] || (domain && labToolMapCache.byDomain?.[domain]) || "";
}

async function loadGlobalRankings() {
  try {
    const response = await fetch(GLOBAL_RANKINGS_URL);
    if (!response.ok) throw new Error(String(response.status));
    globalRankings = await response.json();
  } catch (error) {
    console.error(error);
    globalRankings = { items: [] };
  }
}

function findToolForRanking(item) {
  const alias = RANKING_TOOL_ALIASES[item.name];
  const needles = [alias, item.name].filter(Boolean).map((value) => value.toLowerCase());
  for (const needle of needles) {
    const exact = tools.find((tool) => tool.name.toLowerCase() === needle);
    if (exact) return exact;
    const partial = tools.find(
      (tool) => tool.name.toLowerCase().includes(needle) || needle.includes(tool.name.toLowerCase())
    );
    if (partial) return partial;
  }
  return null;
}

function rankingToolStub(item) {
  return {
    id: `ranking-${item.rank}`,
    name: item.name,
    url: item.url,
    color: "#3167ff"
  };
}

function getRankingChangeClass(change) {
  if (!change || change === "—" || change === "-") return "rank-change--flat";
  if (change.includes("↓")) return "rank-change--down";
  if (change.includes("↑")) return "rank-change--up";
  return "rank-change--flat";
}

function renderGlobalRankings() {
  if (!els.rankingsTableBody || !globalRankings?.items?.length) {
    if (els.rankingsTableBody) {
      els.rankingsTableBody.innerHTML = '<tr><td colspan="5">榜单数据加载失败</td></tr>';
    }
    return;
  }

  if (els.rankingsTitle) els.rankingsTitle.textContent = globalRankings.title || "全球 AI 工具访问排行榜 Top 50";
  if (els.rankingsLead) {
    els.rankingsLead.textContent = `口径：${globalRankings.source || "Similarweb"} ${globalRankings.category || ""}`.trim();
  }
  if (els.rankingsEyebrow && globalRankings.period) {
    els.rankingsEyebrow.textContent = `${globalRankings.source || "Similarweb"} · ${globalRankings.period}`;
  }

  els.rankingsTableBody.innerHTML = globalRankings.items
    .map((item) => {
      const catalogTool = findToolForRanking(item);
      const displayTool = catalogTool || rankingToolStub(item);
      const href = item.url || displayTool.url;
      const top3 = item.rank <= 3 ? " is-top3" : "";
      const changeClass = getRankingChangeClass(item.change);
      const inCatalog = catalogTool
        ? `<small>本站已收录 · ${escapeHtml(catalogTool.categoryName)}</small>`
        : `<small>访问官网</small>`;

      return `
        <tr class="rankings-row${top3}">
          <td class="rank-col-rank"><span class="rank-medal">${item.rank}</span></td>
          <td class="rank-col-tool">
            <div class="rank-tool-cell">
              ${renderLogoMarkup(displayTool, "rank-tool-logo")}
              <a class="rank-tool-name" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(item.name)}
                ${inCatalog}
              </a>
            </div>
          </td>
          <td class="rank-col-purpose">${escapeHtml(item.purpose)}</td>
          <td class="rank-col-change"><span class="rank-change ${changeClass}">${escapeHtml(item.change || "—")}</span></td>
          <td class="rank-col-duration">${escapeHtml(item.duration)}</td>
        </tr>
      `;
    })
    .join("");

  bindLogoFallbacks(els.rankingsTableBody);
}

function getViewFromHash() {
  const hash = location.hash.replace("#", "").split("?")[0];
  if (hash === "rankings") return "rankings";
  if (hash === "lab") return "lab";
  return "tools";
}

function setAppView(view, { scroll = true } = {}) {
  const isTools = view === "tools";
  const isRankings = view === "rankings";
  const isLab = view === "lab";

  els.toolsView?.classList.toggle("is-hidden", !isTools);
  if (els.rankingsPage) {
    els.rankingsPage.hidden = !isRankings;
    els.rankingsPage.classList.toggle("is-active", isRankings);
  }
  if (els.labPage) {
    els.labPage.hidden = !isLab;
    els.labPage.classList.toggle("is-active", isLab);
  }

  document.body.classList.toggle("view-rankings", isRankings);
  document.body.classList.toggle("view-lab", isLab);
  document.body.classList.toggle("view-tools", isTools);

  const navKey = isLab ? "lab" : isRankings ? "rankings" : "directory";
  updateTopNav(navKey);

  if (!isTools) {
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    if (isLab) {
      window.NeuxLab?.onShow?.();
    }
  } else {
    syncClearFiltersButton();
  }
}

function updateTopNav(activeNav) {
  els.topNav?.querySelectorAll(".top-nav-link").forEach((link) => {
    const isActive = link.dataset.nav === activeNav;
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function initAppNav() {
  els.topNav?.querySelectorAll(".top-nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const nav = link.dataset.nav;
      if (nav === "rankings") {
        event.preventDefault();
        setAppView("rankings");
        history.replaceState(null, "", "#rankings");
        return;
      }
      if (nav === "lab") {
        event.preventDefault();
        setAppView("lab");
        const provider = new URLSearchParams(location.search).get("provider");
        history.replaceState(
          null,
          "",
          provider ? `?provider=${encodeURIComponent(provider)}#lab` : "#lab"
        );
        window.NeuxLab?.onShow?.();
        return;
      }
      if (nav === "directory") {
        event.preventDefault();
        setAppView("tools");
        history.replaceState(null, "", "#directory");
        document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  window.addEventListener("hashchange", () => {
    setAppView(getViewFromHash(), { scroll: false });
  });
}

function bindEvents() {
  document.querySelector(".search-panel").addEventListener("submit", (event) => {
    event.preventDefault();
    setAppView("tools");
    history.replaceState(null, "", "#directory");
    state.query = els.searchInput.value.trim();
    if (state.query) rememberRecentSearch(state.query);
    render();
    document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.searchInput.addEventListener("input", (event) => {
    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(() => {
    state.query = event.target.value.trim();
      if (state.query) rememberRecentSearch(state.query);
    render();
    }, 220);
  });

  els.searchClear?.addEventListener("click", () => {
    clearSearchQuery();
    els.searchInput.focus();
  });


  document.querySelectorAll("[data-stat-action]").forEach((button) => {
    button.addEventListener("click", () => applyStatAction(button.dataset.statAction));
  });

  document.addEventListener("click", (event) => {
    const resetChip = event.target.closest("[data-hero-reset]");
    if (resetChip) {
      event.preventDefault();
      resetAllFilters();
      document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const recentButton = event.target.closest("[data-recent-query]");
    if (recentButton) {
      event.preventDefault();
      state.query = recentButton.dataset.recentQuery;
      els.searchInput.value = state.query;
      rememberRecentSearch(state.query);
      render();
      document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const queryButton = event.target.closest("[data-query]");
    if (!queryButton) return;
    event.preventDefault();
    toggleSearchQuery(queryButton.dataset.query);
    if (state.query) rememberRecentSearch(state.query);
    if (!queryButton.closest(".insight-rail")) {
      document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable) return;
    event.preventDefault();
    els.searchInput?.focus();
    els.searchInput?.select();
  });

  document.querySelectorAll("[data-price]").forEach((button) => {
    button.addEventListener("click", () => {
      state.price = button.dataset.price;
      document.querySelectorAll("[data-price]").forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });

  els.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  els.clearFilters.addEventListener("click", resetAllFilters);

  els.categorySearch?.addEventListener("input", (event) => {
    categoryRailSearch = event.target.value.trim();
    renderCategories();
  });

  els.emptyClearQuery?.addEventListener("click", clearSearchQuery);
  els.emptyExpandSearch?.addEventListener("click", expandSearchToAll);
  els.emptyResetAll?.addEventListener("click", resetAllFilters);

  els.favoriteToggle.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    els.favoriteToggle.classList.toggle("active", state.favoritesOnly);
    els.favoriteToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
    render();
  });

  els.newOnlyToggle?.addEventListener("click", () => {
    state.newOnly = !state.newOnly;
    els.newOnlyToggle.classList.toggle("active", state.newOnly);
    els.newOnlyToggle.setAttribute("aria-pressed", String(state.newOnly));
    render();
  });

  els.viewToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    state.viewMode = button.dataset.view;
    render();
  });

  els.compareOpen?.addEventListener("click", openCompareDialog);
  els.compareClear?.addEventListener("click", () => {
    state.compare.clear();
    syncCompareBar();
    render();
  });
  els.compareClose?.addEventListener("click", () => els.compareDialog?.close());

  els.toolGrid.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-tool]");
    if (copyButton) {
      event.preventDefault();
      event.stopPropagation();
      copyToolLink(copyButton.dataset.copyTool);
      return;
    }

    const compareButton = event.target.closest("[data-compare-tool]");
    if (compareButton) {
      event.preventDefault();
      event.stopPropagation();
      toggleCompare(compareButton.dataset.compareTool);
      return;
    }

    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
      event.preventDefault();
      event.stopPropagation();
    const id = favoriteButton.dataset.favorite;
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    localStorage.setItem("ai-nav-favorites", JSON.stringify([...state.favorites]));
    render();
      return;
    }

    const categoryChip = event.target.closest("[data-filter-category]");
    if (categoryChip) {
      event.preventDefault();
      event.stopPropagation();
      state.category = categoryChip.dataset.filterCategory;
      renderCategories();
      render();
      return;
    }

    const tagButton = event.target.closest("[data-tag-query]");
    if (tagButton) {
      event.preventDefault();
      event.stopPropagation();
      state.query = tagButton.dataset.tagQuery;
      els.searchInput.value = state.query;
      render();
      return;
    }

    const labOpen = event.target.closest("[data-lab-provider]");
    if (labOpen) {
      event.preventDefault();
      event.stopPropagation();
      const providerId = labOpen.dataset.labProvider;
      setAppView("lab");
      history.replaceState(null, "", `?provider=${encodeURIComponent(providerId)}#lab`);
      window.NeuxLab?.navigateToProvider?.(providerId);
      return;
    }

    if (event.target.closest(".tool-link, .tool-name, .tool-lab-open")) return;

    const card = event.target.closest(".tool-card[data-tool-url]");
    if (card) {
      window.open(card.dataset.toolUrl, "_blank", "noopener,noreferrer");
    }
  });

  els.toolLoadMore?.addEventListener("click", () => {
    state.listPage += 1;
    render();
    els.toolLoadMore?.blur();
  });

  els.backToTop?.addEventListener("click", () => {
    document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener(
    "scroll",
    () => {
      if (els.backToTop) els.backToTop.hidden = window.scrollY < 480;
    },
    { passive: true }
  );
}

function hydrateStats() {
  const freeCount = tools.filter((tool) => tool.price === "free").length;
  els.toolTotal.textContent = tools.length;
  els.categoryTotal.textContent = categorySeeds.length;
  els.freeTotal.textContent = freeCount;
  if (els.heroLead) {
    els.heroLead.textContent = `搜索 ${tools.length} 个 AI 产品，按任务、分类、价格和热度快速筛选。`;
  }
  if (els.catalogUpdated && catalogGeneratedAt) {
    els.catalogUpdated.textContent = `数据更新：${catalogGeneratedAt}`;
  }
}

function readStateFromURL() {
  const params = new URLSearchParams(location.search);
  if (params.has("q")) state.query = params.get("q") || "";
  if (params.has("cat")) state.category = params.get("cat") || "all";
  if (params.has("price")) state.price = params.get("price") || "all";
  if (params.has("sort")) state.sort = params.get("sort") || "featured";
  if (params.get("fav") === "1") state.favoritesOnly = true;
  if (params.get("new") === "1") state.newOnly = true;
  if (params.get("view") === "compact") state.viewMode = "compact";
  pendingToolId = params.get("tool") || "";
}

function writeStateToURL() {
  if (!urlSyncReady) return;
  window.clearTimeout(urlSyncTimer);
  urlSyncTimer = window.setTimeout(() => {
    const params = new URLSearchParams();
    if (state.query) params.set("q", state.query);
    if (state.category !== "all") params.set("cat", state.category);
    if (state.price !== "all") params.set("price", state.price);
    if (state.sort !== "featured") params.set("sort", state.sort);
    if (state.favoritesOnly) params.set("fav", "1");
    if (state.newOnly) params.set("new", "1");
    if (state.viewMode === "compact") params.set("view", "compact");
    const qs = params.toString();
    const next = qs ? `?${qs}` : `${location.pathname}${location.hash}`;
    if (`${location.pathname}${location.search}` !== next) {
      history.replaceState(null, "", next);
    }
  }, 140);
}

function applyStateToControls() {
  if (els.searchInput) els.searchInput.value = state.query;
  if (els.sortSelect) els.sortSelect.value = state.sort;
  document.querySelectorAll("[data-price]").forEach((button) => {
    button.classList.toggle("active", button.dataset.price === state.price);
  });
  els.favoriteToggle?.classList.toggle("active", state.favoritesOnly);
  els.favoriteToggle?.setAttribute("aria-pressed", String(state.favoritesOnly));
  els.newOnlyToggle?.classList.toggle("active", state.newOnly);
  els.newOnlyToggle?.setAttribute("aria-pressed", String(state.newOnly));
}

function getToolShareUrl(toolId) {
  const params = new URLSearchParams(location.search);
  params.set("tool", toolId);
  return `${location.origin}${location.pathname}?${params.toString()}`;
}

async function copyToolLink(toolId) {
  const url = getToolShareUrl(toolId);
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    window.prompt("复制此链接：", url);
  }
}

function toggleCompare(toolId) {
  if (state.compare.has(toolId)) {
    state.compare.delete(toolId);
  } else if (state.compare.size >= MAX_COMPARE) {
    return;
  } else {
    state.compare.add(toolId);
  }
  syncCompareBar();
  render();
}

function syncCompareBar() {
  const count = state.compare.size;
  if (els.compareMeta) els.compareMeta.textContent = `已选 ${count} / ${MAX_COMPARE}`;
  if (els.compareOpen) els.compareOpen.disabled = count < 2;
  if (els.compareClear) els.compareClear.disabled = count === 0;
}

function syncViewToggle() {
  els.viewToggle?.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.viewMode);
    button.setAttribute("aria-pressed", String(button.dataset.view === state.viewMode));
  });
}

const COMPARE_FIELDS = [
  { label: "价格", format: (tool) => priceLabels[tool.price] },
  { label: "分类", format: (tool) => tool.categoryName },
  { label: "精选", format: (tool) => (tool.featured ? "是" : "—") },
  { label: "新增收录", format: (tool) => (tool.isNew ? "是" : "—") },
  { label: "简介", format: (tool) => tool.description },
  { label: "标签", format: (tool) => (tool.tags.length ? tool.tags.join("、") : "—") }
];

let comparePanelBound = false;

function renderComparePanel() {
  if (!els.comparePanel) return;
  const items = [...state.compare].map((id) => tools.find((tool) => tool.id === id)).filter(Boolean);
  if (items.length < 2) {
    els.comparePanel.innerHTML = '<p class="compare-empty">请至少选择 2 个工具再对比。</p>';
    return;
  }

  const headerCells = items.map((tool) => `
    <th class="compare-tool-col" scope="col">
      <div class="compare-tool-head">
        <div class="compare-tool-head-top">
          ${renderLogoMarkup(tool, "compare-logo")}
          <div class="compare-tool-meta">
            <strong>${escapeHtml(tool.name)}</strong>
            <span>${escapeHtml(getDomain(tool.url))}</span>
          </div>
        </div>
        <div class="compare-tool-actions">
          <button type="button" class="compare-remove" data-compare-remove="${escapeHtml(tool.id)}">移除</button>
          <a href="${tool.url}" target="_blank" rel="noopener noreferrer">访问</a>
        </div>
      </div>
    </th>
  `).join("");

  const bodyRows = COMPARE_FIELDS.map((field) => `
    <tr>
      <th scope="row" class="compare-row-label">${escapeHtml(field.label)}</th>
      ${items.map((tool) => `<td>${escapeHtml(field.format(tool))}</td>`).join("")}
    </tr>
  `).join("");

  const linkRow = `
    <tr>
      <th scope="row" class="compare-row-label">官网</th>
      ${items.map((tool) => `
        <td><a class="compare-link" href="${tool.url}" target="_blank" rel="noopener noreferrer">打开 ↗</a></td>
      `).join("")}
    </tr>
  `;

  els.comparePanel.innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="compare-corner" scope="col">对比项</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
          ${linkRow}
        </tbody>
      </table>
    </div>
    <p class="compare-hint">横向滑动可查看全部列 · 最多 ${MAX_COMPARE} 个工具</p>
  `;
  bindLogoFallbacks(els.comparePanel);
}

function bindComparePanelEvents() {
  if (comparePanelBound || !els.comparePanel) return;
  comparePanelBound = true;
  els.comparePanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-compare-remove]");
    if (!button) return;
    event.preventDefault();
    state.compare.delete(button.dataset.compareRemove);
    syncCompareBar();
    render();
    if (state.compare.size < 2) {
      els.compareDialog?.close();
      return;
    }
    renderComparePanel();
  });
}

function openCompareDialog() {
  if (state.compare.size < 2) return;
  renderComparePanel();
  els.compareDialog?.showModal();
}


function hasActiveFilters() {
  return Boolean(
    state.query
    || state.category !== "all"
    || state.price !== "all"
    || state.favoritesOnly
    || state.newOnly
  );
}

function syncClearFiltersButton() {
  if (els.clearFilters) els.clearFilters.hidden = !hasActiveFilters();
}

function syncSearchClear() {
  if (!els.searchClear) return;
  const hasValue = els.searchInput.value.trim().length > 0;
  els.searchClear.hidden = !hasValue;
}

function syncHeroSearchHint(matchCount) {
  if (!els.heroSearchHint) return;
  const query = state.query.trim();
  if (!query) {
    els.heroSearchHint.textContent = "";
    return;
  }
  if (matchCount === 0) {
    els.heroSearchHint.textContent = `未找到「${query}」— 试试更短关键词，或点击「全部」重置`;
    return;
  }
  els.heroSearchHint.textContent = `约 ${matchCount} 个匹配「${query}」`;
}

function syncPromptChips() {
  els.promptRow?.querySelectorAll("[data-query]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.query === state.query && state.query.length > 0);
  });
  const resetChip = els.promptRow?.querySelector("[data-hero-reset]");
  resetChip?.classList.toggle("is-active", !hasActiveFilters());
}

function syncHeroUI(matchCount = getFilteredTools().length) {
  syncSearchClear();
  syncHeroSearchHint(matchCount);
  syncPromptChips();
  syncTagCloudUI();
  syncClearFiltersButton();
}

function rememberRecentSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const recent = getRecentSearches().filter((item) => item !== trimmed);
  recent.unshift(trimmed);
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(recent.slice(0, RECENT_SEARCH_LIMIT)));
  renderRecentSearches();
}

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || "[]");
  } catch {
    return [];
  }
}

function renderRecentSearches() {
  if (!els.heroRecent || !els.heroRecentList) return;
  const recent = getRecentSearches();
  els.heroRecent.hidden = recent.length === 0;
  els.heroRecentList.innerHTML = recent.map((query) => `
    <button class="hero-recent-chip" type="button" data-recent-query="${escapeHtml(query)}">${escapeHtml(query)}</button>
  `).join("");
}

function applyStatAction(action) {
  if (action === "directory") {
    setAppView("tools");
    history.replaceState(null, "", "#directory");
    resetAllFilters();
    document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (action === "categories") {
    document.querySelector("#categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (action === "free") {
    state.price = "free";
    document.querySelectorAll("[data-price]").forEach((button) => {
      button.classList.toggle("active", button.dataset.price === "free");
    });
    render();
    document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initHeroPlaceholder() {
  if (!els.searchInput || HERO_PLACEHOLDERS.length < 2) return;
  const rotate = () => {
    if (document.activeElement === els.searchInput || els.searchInput.value.trim()) return;
    placeholderIndex = (placeholderIndex + 1) % HERO_PLACEHOLDERS.length;
    els.searchInput.placeholder = HERO_PLACEHOLDERS[placeholderIndex];
  };
  placeholderTimer = window.setInterval(rotate, 4500);
  els.searchInput.addEventListener("focus", () => {
    if (!els.searchInput.value.trim()) {
      els.searchInput.placeholder = HERO_PLACEHOLDERS[0];
    }
  });
}

function getCategoryToolCount(categoryId) {
  if (categoryId === "all") return tools.length;
  return tools.filter((tool) => tool.categoryId === categoryId).length;
}

function getCategoryStats(categoryId) {
  const list = categoryId === "all" ? tools : tools.filter((tool) => tool.categoryId === categoryId);
  return {
    total: list.length,
    free: list.filter((tool) => tool.price === "free").length,
    isNew: list.filter((tool) => tool.isNew).length
  };
}

function getCategoryEmoji(category) {
  return CATEGORY_EMOJI[category.id] || "✦";
}

function getTopRankedCategoryIds(limit = 3) {
  return getOrderedCategorySeeds()
    .map((category) => ({ id: category.id, count: getCategoryToolCount(category.id) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => item.id);
}

function getQuickCardBasis(category) {
  const lengthFactor = Math.min(48, category.name.length * 6);
  return `${196 + lengthFactor}px`;
}

function categoryMatchesQuery(category, query) {
  if (!query) return false;
  const normalizedQuery = normalize(query);
  const haystack = normalize(`${category.name} ${category.description} ${category.id} ${category.short}`);
  if (haystack.includes(normalizedQuery)) return true;
  return tools.some((tool) => tool.categoryId === category.id && toolMatchesQuery(tool, normalizedQuery));
}

function renderAllToolsQuickCard() {
  const stats = getCategoryStats("all");
  const active = state.category === "all" ? "is-active" : "";
    return `
    <button class="quick-card quick-card--all ${active}" type="button" data-quick-category="all" style="--tone:${hexToRgba("#ff7a1a", 0.14)};--tone-ink:#ff7a1a;--tone-top:${hexToRgba("#ff7a1a", 0.16)};--card-basis:196px">
      <span class="quick-icon" aria-hidden="true">✦</span>
      <strong class="quick-name">全部工具</strong>
      <span class="quick-stats">${stats.total} 个工具 · 免费 ${stats.free}</span>
      <span class="quick-meta">浏览完整 AI 导航目录</span>
      </button>
    `;
}

function renderQuickCategoryCard(category, options = {}) {
  const { rank = 0, featured = false } = options;
  const stats = getCategoryStats(category.id);
  const active = state.category === category.id ? "is-active" : "";
  const match = categoryMatchesQuery(category, state.query.trim()) ? "is-match" : "";
  const featuredClass = featured ? "quick-card--featured" : "";
  const rankMarkup = rank ? `<span class="quick-rank quick-rank--${rank}">#${rank}</span>` : "";
  const newMarkup = stats.isNew > 0 ? `<span class="quick-new-badge">+${stats.isNew} 新增</span>` : "";

  return `
    <button
      class="quick-card ${featuredClass} ${active} ${match}"
      type="button"
      data-quick-category="${category.id}"
      style="--tone:${hexToRgba(category.color, 0.14)};--tone-ink:${category.color};--tone-top:${hexToRgba(category.color, 0.2)};--card-basis:${getQuickCardBasis(category)}"
      aria-pressed="${state.category === category.id}"
    >
      ${rankMarkup}
      ${newMarkup}
      <span class="quick-icon" aria-hidden="true">${getCategoryEmoji(category)}</span>
      <strong class="quick-name">${escapeHtml(category.name)}</strong>
      <span class="quick-stats">${stats.total} 个工具 · 免费 ${stats.free}</span>
      <span class="quick-meta">${escapeHtml(category.description)}</span>
    </button>
  `;
}

function selectQuickCategory(categoryId) {
  state.category = categoryId;
  renderCategories();
  render();
  document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindQuickCategoryButtons(root) {
  root.querySelectorAll("[data-quick-category]").forEach((button) => {
    button.addEventListener("click", () => selectQuickCategory(button.dataset.quickCategory));
  });
}

function syncQuickCategoryUI() {
  if (!els.quickGrid) return;
  const query = state.query.trim();
  els.quickGrid.querySelectorAll("[data-quick-category]").forEach((button) => {
    const categoryId = button.dataset.quickCategory;
    const category = categories.find((item) => item.id === categoryId);
    const isActive = categoryId === state.category;
    const isMatch = categoryId === "all"
      ? Boolean(query) && tools.some((tool) => toolMatchesQuery(tool, query))
      : category
        ? categoryMatchesQuery(category, query)
        : false;
    button.classList.toggle("is-active", isActive);
    button.classList.toggle("is-match", Boolean(query) && isMatch);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderQuickLinks() {
  const topIds = getTopRankedCategoryIds(3);
  const cards = [
    renderAllToolsQuickCard(),
    ...getOrderedCategorySeeds().map((category, index) => {
      const rank = topIds.indexOf(category.id);
      return renderQuickCategoryCard(category, {
        rank: rank >= 0 ? rank + 1 : 0,
        featured: rank === 0
      });
    })
  ];
  els.quickGrid.innerHTML = cards.join("");
  bindQuickCategoryButtons(els.quickGrid);
  syncQuickCategoryUI();
  requestAnimationFrame(() => updateCategoryCarouselNav());
}

function updateCategoryCarouselNav() {
  if (!els.categoryCarouselViewport || categoryStripExpanded) return;
  const grid = els.quickGrid;
  const overflow = grid.scrollWidth > els.categoryCarouselViewport.clientWidth + 8;
  els.categoryScrollPrev?.toggleAttribute("hidden", !overflow);
  els.categoryScrollNext?.toggleAttribute("hidden", !overflow);
  updateCategoryDots();
}

function updateCategoryDots() {
  if (!els.categoryDots || !els.quickGrid || categoryStripExpanded) {
    if (els.categoryDots) els.categoryDots.innerHTML = "";
    return;
  }
  const cards = [...els.quickGrid.querySelectorAll(".quick-card")];
  if (!cards.length) return;
  const viewportWidth = els.categoryCarouselViewport.clientWidth || 1;
  const pageCount = Math.max(1, Math.ceil(els.quickGrid.scrollWidth / viewportWidth));
  const activeIndex = Math.min(
    pageCount - 1,
    Math.round(els.quickGrid.scrollLeft / viewportWidth)
  );

  if (els.categoryDots.childElementCount !== pageCount) {
    els.categoryDots.innerHTML = Array.from({ length: pageCount }, (_, index) => `
      <button class="category-dot${index === activeIndex ? " is-active" : ""}" type="button" data-page="${index}" aria-label="第 ${index + 1} 页"></button>
    `).join("");
    els.categoryDots.querySelectorAll(".category-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        els.quickGrid.scrollTo({
          left: Number(dot.dataset.page) * viewportWidth,
          behavior: "smooth"
        });
      });
    });
  } else {
    els.categoryDots.querySelectorAll(".category-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }
}

function scrollCategoryCarousel(direction) {
  if (!els.quickGrid) return;
  const amount = Math.max(240, els.categoryCarouselViewport?.clientWidth * 0.72 || 280);
  els.quickGrid.scrollBy({ left: direction * amount, behavior: "smooth" });
}

function initCategoryCarousel() {
  if (categoryCarouselReady || !els.quickGrid) return;
  categoryCarouselReady = true;

  els.categoryScrollPrev?.addEventListener("click", () => scrollCategoryCarousel(-1));
  els.categoryScrollNext?.addEventListener("click", () => scrollCategoryCarousel(1));
  els.quickGrid.addEventListener("scroll", () => updateCategoryDots(), { passive: true });
  window.addEventListener("resize", () => updateCategoryCarouselNav());

  els.categoryExpandToggle?.addEventListener("click", () => {
    categoryStripExpanded = !categoryStripExpanded;
    els.categoriesSection?.classList.toggle("is-expanded", categoryStripExpanded);
    els.categoryExpandToggle?.setAttribute("aria-expanded", String(categoryStripExpanded));
    els.categoryExpandToggle.textContent = categoryStripExpanded ? "收起分类" : "展开全部分类";
    updateCategoryCarouselNav();
  });

  const viewport = els.categoryCarouselViewport;
  let dragActive = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;

  viewport?.addEventListener("mousedown", (event) => {
    if (categoryStripExpanded || event.button !== 0) return;
    dragActive = true;
    dragStartX = event.pageX;
    dragScrollLeft = els.quickGrid.scrollLeft;
    viewport.classList.add("is-dragging");
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragActive) return;
    event.preventDefault();
    const walk = event.pageX - dragStartX;
    els.quickGrid.scrollLeft = dragScrollLeft - walk;
  });

  window.addEventListener("mouseup", () => {
    if (!dragActive) return;
    dragActive = false;
    viewport?.classList.remove("is-dragging");
  });

  els.categoryCarousel?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const buttons = [...els.quickGrid.querySelectorAll("[data-quick-category]")];
    const currentIndex = buttons.findIndex((button) => button.classList.contains("is-active"));
    if (currentIndex < 0) return;
    event.preventDefault();
    const nextIndex = event.key === "ArrowRight"
      ? Math.min(buttons.length - 1, currentIndex + 1)
      : Math.max(0, currentIndex - 1);
    buttons[nextIndex]?.focus();
    if (event.shiftKey) {
      selectQuickCategory(buttons[nextIndex].dataset.quickCategory);
    } else {
      buttons[nextIndex]?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
  });
}

function getTopTags(limit = TOP_TAG_LIMIT) {
  const counts = new Map();
  tools.forEach((tool) => {
    tool.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, limit);
}

function getTrendingTools(limit = INSIGHT_LIST_SIZE) {
  const pool = tools
    .filter((tool) => tool.featured)
    .sort((a, b) => a.rank - b.rank);
  const seen = new Set(pool.map((tool) => tool.id));
  if (pool.length < limit) {
    TRENDING_FALLBACK_NAMES.forEach((name) => {
      if (pool.length >= limit) return;
      const tool = tools.find((item) => item.name === name);
      if (tool && !seen.has(tool.id)) {
        pool.push(tool);
        seen.add(tool.id);
      }
    });
  }
  return pool.slice(0, limit);
}

function getRecentNewTools(limit = INSIGHT_LIST_SIZE) {
  const buckets = new Map();
  tools
    .filter((tool) => tool.isNew)
    .sort((a, b) => b.rank - a.rank)
    .forEach((tool) => {
      if (!buckets.has(tool.categoryId)) buckets.set(tool.categoryId, []);
      buckets.get(tool.categoryId).push(tool);
    });

  const picked = [];
  const seen = new Set();
  let round = 0;
  const bucketList = [...buckets.values()];
  while (picked.length < limit && bucketList.length) {
    let added = false;
    bucketList.forEach((bucket) => {
      if (picked.length >= limit) return;
      const tool = bucket[round];
      if (tool && !seen.has(tool.id)) {
        picked.push(tool);
        seen.add(tool.id);
        added = true;
      }
    });
    round += 1;
    if (!added) break;
  }
  return picked;
}

function toggleSearchQuery(query) {
  const next = state.query === query ? "" : query;
  state.query = next;
  els.searchInput.value = next;
  render();
}

function syncTagCloudUI() {
  els.tagCloud?.querySelectorAll("[data-query]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.query === state.query && state.query.length > 0);
  });
  const tagsAction = els.insightRail?.querySelector('[data-insight-action="tags"]');
  if (tagsAction) {
    tagsAction.textContent = state.query ? "清除标签" : "浏览全部";
  }
}

function syncInsightMiniFavorites() {
  [els.trendingList, els.newList].forEach((root) => {
    root?.querySelectorAll("[data-favorite]").forEach((button) => {
      const active = state.favorites.has(button.dataset.favorite);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  });
}

function applyInsightAction(action) {
  if (action === "featured") {
    state.category = "all";
    state.query = "";
    state.price = "all";
    state.sort = "featured";
    state.favoritesOnly = false;
    state.newOnly = false;
    els.searchInput.value = "";
    els.sortSelect.value = "featured";
    document.querySelectorAll("[data-price]").forEach((button) => button.classList.toggle("active", button.dataset.price === "all"));
    els.favoriteToggle.classList.remove("active");
    els.newOnlyToggle?.classList.remove("active");
    els.newOnlyToggle?.setAttribute("aria-pressed", "false");
      renderCategories();
      render();
    document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (action === "new") {
    state.category = "all";
    state.query = "";
    state.newOnly = true;
    state.favoritesOnly = false;
    els.searchInput.value = "";
    els.newOnlyToggle?.classList.add("active");
    els.newOnlyToggle?.setAttribute("aria-pressed", "true");
    els.favoriteToggle.classList.remove("active");
    renderCategories();
    render();
    document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (action === "tags") {
    if (state.query) {
      toggleSearchQuery(state.query);
    } else {
      document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function focusToolInList(toolId) {
  const tool = tools.find((item) => item.id === toolId);
  if (!tool) return;

  state.category = "all";
  state.query = "";
  state.price = "all";
  state.favoritesOnly = false;
  state.newOnly = false;
  state.sort = "featured";
  els.searchInput.value = "";
  els.sortSelect.value = "featured";
  document.querySelectorAll("[data-price]").forEach((button) => button.classList.toggle("active", button.dataset.price === "all"));
  els.favoriteToggle.classList.remove("active");
  els.newOnlyToggle?.classList.remove("active");
  els.newOnlyToggle?.setAttribute("aria-pressed", "false");
  renderCategories();

  const filtered = sortTools(applyCommonFilters(tools));
  const index = filtered.findIndex((item) => item.id === toolId);
  if (index < 0) {
    window.open(tool.url, "_blank", "noopener,noreferrer");
    return;
  }

  state.listPage = Math.ceil((index + 1) / TOOLS_PER_PAGE);
  lastFilterKey = getFilterKey();
  render();
  document.querySelector("#directory")?.scrollIntoView({ behavior: "smooth", block: "start" });

  window.requestAnimationFrame(() => {
    const card = els.toolGrid.querySelector(`[data-tool-id="${CSS.escape(toolId)}"]`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("is-spotlight");
    window.clearTimeout(spotlightTimer);
    spotlightTimer = window.setTimeout(() => card.classList.remove("is-spotlight"), 2600);
  });
}

function bindInsightRailEvents() {
  if (insightRailBound || !els.insightRail) return;
  insightRailBound = true;

  els.insightRail.addEventListener("click", (event) => {
    const viewAll = event.target.closest("[data-insight-action]");
    if (viewAll) {
      event.preventDefault();
      applyInsightAction(viewAll.dataset.insightAction);
      return;
    }

    const favoriteButton = event.target.closest(".mini-favorite");
    if (favoriteButton) {
      event.preventDefault();
      event.stopPropagation();
      const id = favoriteButton.dataset.favorite;
      if (state.favorites.has(id)) state.favorites.delete(id);
      else state.favorites.add(id);
      localStorage.setItem("ai-nav-favorites", JSON.stringify([...state.favorites]));
      syncInsightMiniFavorites();
      render();
      return;
    }

    if (event.target.closest("[data-mini-external]")) return;

    const row = event.target.closest("[data-tool-focus]");
    if (row) {
      event.preventDefault();
      focusToolInList(row.dataset.toolFocus);
    }
  });

  els.insightRail.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    const row = event.target.closest("[data-tool-focus]");
    if (!row) return;
    event.preventDefault();
    focusToolInList(row.dataset.toolFocus);
  });
}

function renderPromptChips() {
  if (!els.promptRow) return;
  const taskChips = HERO_TASK_TAGS.map((tag) => `
    <button class="prompt-chip" type="button" data-query="${escapeHtml(tag)}">${escapeHtml(tag)}</button>
  `).join("");
  els.promptRow.innerHTML = `
    <button class="prompt-chip prompt-chip--reset" type="button" data-hero-reset>全部</button>
    ${taskChips}
  `;
  syncPromptChips();
}

function renderSideRails() {
  const trending = getTrendingTools();
  const recent = getRecentNewTools();
  els.trendingList.innerHTML = renderMiniList(trending, { showRank: true });
  els.newList.innerHTML = renderMiniList(recent, { showNewBadge: true });
  bindLogoFallbacks(els.trendingList);
  bindLogoFallbacks(els.newList);

  const tags = getTopTags(TOP_TAG_LIMIT);
  const maxCount = tags[0]?.[1] || 1;
  els.tagCloud.innerHTML = tags.map(([tag, count]) => {
    const ratio = count / maxCount;
    const tier = ratio > 0.66 ? "hot" : ratio > 0.33 ? "warm" : "cool";
    return `
      <button type="button" data-query="${escapeHtml(tag)}" data-tier="${tier}">
        <span>${escapeHtml(tag)}</span>
      </button>
    `;
  }).join("");
  syncTagCloudUI();
}

function renderMiniList(items, options = {}) {
  const { showRank = false, showNewBadge = false } = options;
  if (!items.length) {
    return '<p class="mini-empty">暂无数据</p>';
  }

  return items.map((tool, index) => {
    const favorite = state.favorites.has(tool.id);
    const subtitle = tool.tags[0] ? `${tool.categoryName} · ${tool.tags[0]}` : tool.categoryName;
    const rankMarkup = showRank ? `<span class="mini-rank" aria-hidden="true">${index + 1}</span>` : "";
    const newMarkup = showNewBadge && tool.isNew ? '<span class="mini-new-badge">新</span>' : "";

    return `
      <div
        class="mini-item"
        data-tool-focus="${escapeHtml(tool.id)}"
        role="button"
        tabindex="0"
        aria-label="在列表中定位 ${escapeHtml(tool.name)}"
      >
        ${rankMarkup}
        ${renderLogoMarkup(tool, "spotlight-logo")}
        <div class="mini-item-copy">
          <strong>${escapeHtml(tool.name)}${newMarkup}</strong>
          <span title="${escapeHtml(subtitle)}">${escapeHtml(subtitle)}</span>
      </div>
        <div class="mini-item-actions">
          <button
            class="mini-favorite ${favorite ? "active" : ""}"
            type="button"
            data-favorite="${escapeHtml(tool.id)}"
            aria-pressed="${favorite}"
            aria-label="${favorite ? "取消收藏" : "收藏"} ${escapeHtml(tool.name)}"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 17.3-5.3 3 1.4-5.9-4.6-4 6-.5L12 4.4l2.4 5.5 6 .5-4.6 4 1.4 5.9z"/></svg>
          </button>
          <a
            class="mini-external"
            href="${tool.url}"
            target="_blank"
            rel="noopener noreferrer"
            data-mini-external
            aria-label="访问 ${escapeHtml(tool.name)}"
          >↗</a>
    </div>
      </div>
    `;
  }).join("");
}

function categoryPassesRailFilters(category) {
  if (!category || category.id === "all") return true;
  const query = normalize(categoryRailSearch);
  if (!query) return true;
  const haystack = normalize(`${category.name} ${category.description} ${category.id} ${category.short}`);
  return haystack.includes(query);
}

function renderCategoryRailButton(category) {
  const count = getCategoryToolCount(category.id);
  const stats = getCategoryStats(category.id);
    const active = state.category === category.id ? "active" : "";
  const emptyClass = count === 0 ? "is-empty" : "";
  const matchClass = categoryMatchesQuery(category, state.query.trim()) ? "is-match" : "";
  const newMarkup = stats.isNew > 0 ? `<span class="category-new-pill">+${stats.isNew}</span>` : "";

    return `
    <div class="category-item-wrap${active ? " is-active" : ""}">
      <button
        class="category-button ${emptyClass} ${matchClass}"
        type="button"
        data-category="${category.id}"
        style="--brand:${category.color};--tone:${hexToRgba(category.color, 0.12)}"
        aria-pressed="${state.category === category.id}"
      >
        <span class="category-item-icon" aria-hidden="true">${category.id === "all" ? "✦" : getCategoryEmoji(category)}</span>
        <span class="category-item-name">${escapeHtml(category.name)}${newMarkup}</span>
      </button>
    </div>
    `;
}

function renderCategoryGroup(group, categoriesInGroup) {
  if (!categoriesInGroup.length) return "";
  const openAttr = " open";
  return `
    <details class="category-group category-group--studio"${openAttr}>
      <summary><span>${escapeHtml(group.label)}</span></summary>
      <div class="category-group-items">
        ${categoriesInGroup.map(renderCategoryRailButton).join("")}
      </div>
    </details>
  `;
}

function scrollActiveCategoryIntoView() {
  const active = els.categoryList?.querySelector(".category-button.active");
  active?.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
}

function bindCategoryListEvents() {
  if (categoryListBound || !els.categoryList) return;
  categoryListBound = true;
  els.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
      state.category = button.dataset.category;
      renderCategories();
      render();
    });
}

function renderCategories() {
  const byId = Object.fromEntries(categories.map((category) => [category.id, category]));
  const seeds = getOrderedCategorySeeds().filter(categoryPassesRailFilters);
  const groupedIds = new Set(CATEGORY_GROUPS.flatMap((group) => group.ids));
  const allButton = byId.all && categoryPassesRailFilters(byId.all)
    ? renderCategoryRailButton(byId.all)
    : "";

  const groupsHtml = CATEGORY_GROUPS.map((group) => {
    const items = group.ids
      .map((id) => byId[id])
      .filter((category) => category && seeds.some((seed) => seed.id === category.id));
    return renderCategoryGroup(group, items);
  }).join("");

  const otherItems = seeds.filter((category) => !groupedIds.has(category.id));
  const otherHtml = otherItems.length
    ? renderCategoryGroup({ id: "other", label: "更多分类" }, otherItems)
    : "";

  const emptyHtml = !allButton && !groupsHtml && !otherHtml
    ? `<p class="category-list-empty">没有匹配的分类</p>`
    : "";

  els.categoryList.innerHTML = `${allButton}${groupsHtml}${otherHtml}${emptyHtml}`;
  requestAnimationFrame(() => scrollActiveCategoryIntoView());
}

function syncCategoryRailUI() {
  if (!els.categoryList) return;
  const query = state.query.trim();
  els.categoryList.querySelectorAll("[data-category]").forEach((button) => {
    const categoryId = button.dataset.category;
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    const isActive = categoryId === state.category;
    const isMatch = categoryId === "all"
      ? Boolean(query) && tools.some((tool) => toolMatchesQuery(tool, query))
      : categoryMatchesQuery(category, query);
    button.classList.toggle("active", isActive);
    button.classList.toggle("is-match", Boolean(query) && isMatch);
    button.setAttribute("aria-pressed", String(isActive));
    button.closest(".category-item-wrap")?.classList.toggle("is-active", isActive);
  });
}

function getFilterKey() {
  return [
    state.category,
    state.query.trim(),
    state.price,
    state.sort,
    state.favoritesOnly,
    state.newOnly
  ].join("|");
}

function resetListPageIfNeeded() {
  const key = getFilterKey();
  if (key !== lastFilterKey) {
    state.listPage = 1;
    lastFilterKey = key;
  }
}

function render() {
  const filtered = getFilteredTools();
  resetListPageIfNeeded();

  const total = filtered.length;
  const visibleCount = Math.min(total, state.listPage * TOOLS_PER_PAGE);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < total;

  renderResultHeader(filtered, { total, visibleCount });
  renderActiveTags();
  syncQuickCategoryUI();
  syncCategoryRailUI();
  renderTools(visible);
  renderToolListFooter({ total, visibleCount, hasMore });
  renderEmptyState(filtered);
  syncInsightMiniFavorites();
  syncHeroUI(filtered.length);
  syncCompareBar();
  syncViewToggle();
  els.toolGrid?.classList.toggle("is-compact", state.viewMode === "compact");
  writeStateToURL();
}

function renderResultHeader(filtered, paging = {}) {
  const { total = filtered.length, visibleCount = filtered.length } = paging;
  const currentCategory = categories.find((category) => category.id === state.category);
  const titlePrefix = state.favoritesOnly ? "收藏的" : state.newOnly ? "新增" : "";
  const query = state.query.trim();

  if (state.newOnly && state.category === "all") {
    els.resultTitle.textContent = `${titlePrefix}收录的 AI 工具`;
  } else if (query) {
    if (state.category !== "all") {
      els.resultTitle.textContent = `${titlePrefix}${currentCategory?.name || "分类"} · 「${query}」`;
    } else {
      els.resultTitle.textContent = `${titlePrefix}「${query}」的搜索结果`;
    }
  } else {
  els.resultTitle.textContent = `${titlePrefix}${currentCategory?.name || "全部工具"}`;
  }

  const metaParts = [`${total} 个结果`];
  if (total > 0 && visibleCount < total) {
    metaParts.push(`已显示 ${visibleCount} 个`);
  }
  if (query && state.category !== "all") {
    metaParts.push(`已在「${currentCategory?.name}」内筛选`);
  } else if (query) {
    metaParts.push("全站搜索");
  } else if (state.favoritesOnly) {
    metaParts.push("仅显示收藏");
  } else if (state.newOnly) {
    metaParts.push("本次扩容新增收录");
  } else {
    metaParts.push(currentCategory?.description || "完整 AI 导航");
  }
  els.resultMeta.textContent = metaParts.join(" · ");
}

function renderToolListFooter({ total, visibleCount, hasMore }) {
  if (!els.toolListFooter) return;
  const show = total > 0;
  els.toolListFooter.hidden = !show;
  if (!show) return;

  if (els.toolListMeta) {
    els.toolListMeta.textContent = hasMore
      ? `已加载 ${visibleCount} / ${total} 个工具`
      : `共 ${total} 个工具`;
  }
  if (els.toolLoadMore) {
    els.toolLoadMore.hidden = !hasMore;
    els.toolLoadMore.textContent = `加载更多（还剩 ${total - visibleCount} 个）`;
  }
}

function toolMatchesQuery(tool, query) {
      if (!query) return true;
      const haystack = normalize(`${tool.name} ${tool.description} ${tool.categoryName} ${tool.tags.join(" ")}`);
      return haystack.includes(query);
}

function applyCommonFilters(list, options = {}) {
  const { category = state.category, query = normalize(state.query) } = options;
  return list
    .filter((tool) => category === "all" || tool.categoryId === category)
    .filter((tool) => state.price === "all" || tool.price === state.price)
    .filter((tool) => !state.favoritesOnly || state.favorites.has(tool.id))
    .filter((tool) => !state.newOnly || tool.isNew)
    .filter((tool) => toolMatchesQuery(tool, query));
}

function sortTools(list) {
  return [...list].sort((a, b) => {
    if (state.sort === "name") return a.name.localeCompare(b.name, "zh-CN");
    if (state.sort === "category") return a.categoryName.localeCompare(b.categoryName, "zh-CN") || a.rank - b.rank;
    if (state.sort === "newest") return b.rank - a.rank;
      return Number(b.featured) - Number(a.featured) || a.rank - b.rank;
    });
}

function getFilteredTools() {
  return sortTools(applyCommonFilters(tools));
}

function getGlobalMatchesForQuery() {
  const query = normalize(state.query);
  if (!query) return [];
  return sortTools(applyCommonFilters(tools, { category: "all", query }));
}

function renderActiveTags() {
  const tags = [];
  if (state.category !== "all") {
    const category = categories.find((item) => item.id === state.category);
    tags.push(["category", category?.name || state.category]);
  }
  if (state.query) tags.push(["query", `搜索：${state.query}`]);
  if (state.price !== "all") tags.push(["price", priceLabels[state.price]]);
  if (state.favoritesOnly) tags.push(["favorite", "收藏"]);
  if (state.newOnly) tags.push(["new", "新增收录"]);

  els.activeTags.innerHTML = tags.map(([type, label]) => `
    <button type="button" data-clear-tag="${type}">${escapeHtml(label)} ×</button>
  `).join("");

  els.activeTags.querySelectorAll("[data-clear-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.clearTag;
      if (type === "category") {
        state.category = "all";
        renderCategories();
      }
      if (type === "query") {
        state.query = "";
        els.searchInput.value = "";
      }
      if (type === "price") {
        state.price = "all";
        document.querySelectorAll("[data-price]").forEach((item) => item.classList.toggle("active", item.dataset.price === "all"));
      }
      if (type === "favorite") {
        state.favoritesOnly = false;
        els.favoriteToggle.classList.remove("active");
      }
      if (type === "new") {
        state.newOnly = false;
        els.newOnlyToggle?.classList.remove("active");
        els.newOnlyToggle?.setAttribute("aria-pressed", "false");
      }
      render();
    });
  });
}

function clearSearchQuery() {
  state.query = "";
  els.searchInput.value = "";
  render();
  els.searchInput?.focus();
}

function expandSearchToAll() {
  state.category = "all";
  renderCategories();
  render();
}

function resetAllFilters() {
  state.category = "all";
  state.query = "";
  state.price = "all";
  state.sort = "featured";
  state.favoritesOnly = false;
  state.newOnly = false;
  state.viewMode = "grid";
  state.listPage = 1;
  lastFilterKey = "";
  categoryRailSearch = "";
  if (els.categorySearch) els.categorySearch.value = "";
  els.searchInput.value = "";
  els.sortSelect.value = "featured";
  document.querySelectorAll("[data-price]").forEach((button) => button.classList.toggle("active", button.dataset.price === "all"));
  els.favoriteToggle.classList.remove("active");
  els.newOnlyToggle?.classList.remove("active");
  els.newOnlyToggle?.setAttribute("aria-pressed", "false");
  renderCategories();
  render();
}

function renderEmptyState(filtered) {
  const isEmpty = filtered.length === 0;
  els.resultsPanel?.classList.toggle("is-empty", isEmpty);
  els.toolGrid.classList.toggle("is-hidden", isEmpty);

  if (!isEmpty) {
    els.emptyState.hidden = true;
    els.emptySuggestions.hidden = true;
    return;
  }

  const query = state.query.trim();
  const currentCategory = categories.find((category) => category.id === state.category);
  const globalMatches = getGlobalMatchesForQuery();

  els.emptyState.hidden = false;

  if (state.favoritesOnly) {
    els.emptyTitle.textContent = "收藏列表为空";
    els.emptyHint.textContent = "还没有收藏任何工具，浏览时点击星标即可加入收藏。";
    els.emptyExpandSearch.hidden = true;
  } else if (query && state.category !== "all") {
    els.emptyTitle.textContent = `「${currentCategory?.name}」下暂无「${query}」`;
    const globalCount = globalMatches.length;
    els.emptyHint.textContent = globalCount
      ? `当前分类没有匹配项，但全站有 ${globalCount} 个相关工具，可点击下方在全站查看。`
      : "试试更短的关键词，或放宽价格、分类等筛选条件。";
    els.emptyExpandSearch.hidden = false;
    els.emptyExpandSearch.textContent = `在全站搜索「${query}」`;
  } else if (query) {
    els.emptyTitle.textContent = `没有找到「${query}」`;
    els.emptyHint.textContent = "检查拼写，或试试「视频」「代码」「写作」等常见任务词。";
    els.emptyExpandSearch.hidden = true;
  } else if (state.category !== "all") {
    els.emptyTitle.textContent = `「${currentCategory?.name}」下暂无工具`;
    els.emptyHint.textContent = "可以切换其他分类，或重置筛选查看全部工具。";
    els.emptyExpandSearch.hidden = true;
  } else {
    els.emptyTitle.textContent = "没有匹配结果";
    els.emptyHint.textContent = "调整筛选条件，或重置后重新浏览。";
    els.emptyExpandSearch.hidden = true;
  }

  const suggestions = query
    ? (state.category !== "all" ? globalMatches.slice(0, 6) : [])
    : [];

  if (suggestions.length) {
    els.emptySuggestions.hidden = false;
    els.emptySuggestionList.innerHTML = suggestions.map((tool) => `
      <button class="suggestion-chip" type="button" data-open-tool="${escapeHtml(tool.id)}">
        ${renderLogoMarkup(tool, "suggestion-logo")}
        <span>
          <strong>${escapeHtml(tool.name)}</strong>
          <small>${escapeHtml(tool.categoryName)}</small>
        </span>
      </button>
    `).join("");
    bindLogoFallbacks(els.emptySuggestionList);
    els.emptySuggestionList.querySelectorAll("[data-open-tool]").forEach((button) => {
      button.addEventListener("click", () => {
        const tool = tools.find((item) => item.id === button.dataset.openTool);
        if (!tool) return;
        window.open(tool.url, "_blank", "noopener,noreferrer");
      });
    });
  } else {
    els.emptySuggestions.hidden = true;
    els.emptySuggestionList.innerHTML = "";
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text, query) {
  const safeText = escapeHtml(text);
  const trimmed = query.trim();
  if (!trimmed) return safeText;
  const pattern = new RegExp(`(${escapeRegex(trimmed)})`, "gi");
  return safeText.replace(pattern, '<mark class="search-hit">$1</mark>');
}

function renderTools(items) {
  const query = state.query.trim();
  els.toolGrid.classList.add("is-updating");
  els.toolGrid.innerHTML = items.map((tool) => {
    const favorite = state.favorites.has(tool.id);
    const compared = state.compare.has(tool.id);
    const domain = getDomain(tool.url);
    const labProviderId = getLabProviderForTool(tool);
    const badges = [
      tool.isNew ? '<span class="tool-badge tool-badge--new">新增</span>' : "",
      tool.featured ? '<span class="tool-badge tool-badge--featured">精选</span>' : ""
    ].filter(Boolean).join("");

    return `
      <article
        class="tool-card${favorite ? " is-favorited" : ""}${tool.featured ? " is-featured" : ""}${compared ? " is-compared" : ""}"
        style="--logo-bg:${tool.color}"
        data-tool-id="${escapeHtml(tool.id)}"
        data-tool-url="${escapeHtml(tool.url)}"
        title="${escapeHtml(tool.description)}"
      >
        <div class="tool-head">
          ${renderLogoMarkup(tool, "tool-logo")}
          <div class="tool-title-block">
            <div class="tool-title-row">
              <a class="tool-name" href="${tool.url}" target="_blank" rel="noopener noreferrer">${highlightMatch(tool.name, query)}</a>
              ${badges ? `<span class="tool-badges">${badges}</span>` : ""}
            </div>
            <div class="tool-subline">
              <button class="tool-category-chip" type="button" data-filter-category="${tool.categoryId}">${escapeHtml(tool.categoryName)}</button>
              ${domain ? `<span class="tool-domain">${escapeHtml(domain)}</span>` : ""}
            </div>
          </div>
          <button class="favorite-button ${favorite ? "active" : ""}" type="button" data-favorite="${tool.id}" aria-label="${favorite ? "取消收藏" : "收藏"} ${escapeHtml(tool.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 17.3-5.3 3 1.4-5.9-4.6-4 6-.5L12 4.4l2.4 5.5 6 .5-4.6 4 1.4 5.9z"/></svg>
          </button>
        </div>
        <p class="tool-description">${highlightMatch(tool.description, query)}</p>
        <div class="tool-card-bottom">
          <div class="tag-row">${tool.tags.map((tag) => `
            <button class="tag" type="button" data-tag-query="${escapeHtml(tag)}">${escapeHtml(tag)}</button>
          `).join("")}</div>
          <span class="price" style="--price-color:${priceColors[tool.price]}">${priceLabels[tool.price]}</span>
          <div class="tool-foot-actions">
            <button
              class="tool-compare-toggle ${compared ? "active" : ""}"
              type="button"
              data-compare-tool="${escapeHtml(tool.id)}"
              aria-pressed="${compared}"
              aria-label="${compared ? "移出对比" : "加入对比"} ${escapeHtml(tool.name)}"
            >对比</button>
            <button class="tool-copy-link" type="button" data-copy-tool="${escapeHtml(tool.id)}" aria-label="复制 ${escapeHtml(tool.name)} 链接">链接</button>
            ${labProviderId ? `<button class="tool-lab-open" type="button" data-lab-provider="${escapeHtml(labProviderId)}" aria-label="在试验场打开 ${escapeHtml(tool.name)}">试验场</button>` : ""}
          <a class="tool-link" href="${tool.url}" target="_blank" rel="noopener noreferrer">访问 ↗</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
  bindLogoFallbacks(els.toolGrid);
  requestAnimationFrame(() => {
    els.toolGrid.classList.remove("is-updating");
  });
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function remoteLogoUrl(domain) {
  if (!domain) return "";
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
}

function getToolLogoUrl(tool) {
  const file = logoManifest[tool.id];
  if (file) return `assets/logos/${encodeURI(file)}`;
  return remoteLogoUrl(getDomain(tool.url));
}

function renderLogoMarkup(tool, className) {
  const initials = getInitials(tool.name);
  const domain = getDomain(tool.url);
  const logoUrl = getToolLogoUrl(tool);
  const remoteAttr =
    logoManifest[tool.id] && domain ? ` data-remote="${remoteLogoUrl(domain)}"` : "";
  return `
    <span class="${className} has-image" style="--logo-bg:${tool.color}">
      <img src="${logoUrl}" alt="" loading="lazy" decoding="async" data-domain="${escapeHtml(domain)}"${remoteAttr}>
      <span class="logo-fallback" aria-hidden="true">${escapeHtml(initials)}</span>
    </span>
  `;
}

function bindLogoFallbacks(root) {
  root.querySelectorAll(".has-image img").forEach((img) => {
    if (img.dataset.logoBound) return;
    img.dataset.logoBound = "1";
    img.addEventListener("error", () => {
      const domain = img.dataset.domain;
      if (!img.dataset.retriedLocal && img.dataset.remote) {
        img.dataset.retriedLocal = "1";
        img.src = img.dataset.remote;
        return;
      }
      if (!img.dataset.retried && domain) {
        img.dataset.retried = "1";
        img.src = remoteLogoUrl(domain);
        return;
      }
      img.closest(".has-image")?.classList.add("is-fallback");
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });
}

function normalize(value) {
  return value.toLowerCase().trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
}

function getCategoryBadge(category) {
  const chinese = category.name.match(/[\u4e00-\u9fa5]/g);
  if (chinese && chinese.length >= 2) return chinese.slice(0, 2).join("");
  return category.short.slice(0, 2).toUpperCase();
}

function getInitials(name) {
  const clean = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5 ]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (!parts.length) return "AI";
  if (/[\u4e00-\u9fa5]/.test(parts[0])) return parts[0].slice(0, 2);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const numeric = parseInt(value, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
