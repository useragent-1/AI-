/* NEUX 试验场 — OpenAI 兼容 API，密钥仅存浏览器本地 */
(() => {
  const LAB_STORAGE_KEY = "neux-lab-v6";
  const CHAT_MODEL_SEP = "::";
  const LAB_PROVIDERS_URL = "data/lab-providers.json?v=9";
  const LAB_LOGO_MANIFEST_URL = "assets/logos/lab-providers-manifest.json?v=2";
  const LAB_TOOL_MAP_URL = "data/lab-tool-map.json?v=1";
  const LAB_SESSIONS_KEY = "neux-lab-sessions-v1";
  const SESSION_MODE_NORMAL = "normal";
  const SESSION_MODE_BATTLE = "battle";
  const SESSION_MODE_AGENT = "agent";

  const defaultLabState = () => ({
    providerId: "openai",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    enabledModels: [],
    selectedModel: "",
    fetchedModels: [],
    chatProviderId: "",
    chatModelId: "",
    battleChatProviderId: "",
    battleChatModelId: "",
    profiles: {},
    customProviders: [],
    systemPrompt: "You are a helpful assistant.",
    temperature: 0.7,
    maxTokens: 2048,
    stream: true,
    modelFilter: "all",
    providerListFilter: "all",
    collapsedGroups: {},
    autoFetchOnTest: true,
    moreSettingsCollapsed: false,
    sessionsSidebarCollapsed: false,
    studioPanelCollapsed: false,
    sessionsPanelCollapsed: false,
    sessionsPanelMode: "chat",
    chatMode: "normal",
    renderMode: "markdown",
    voiceMode: false,
    voiceTtsProviderId: "",
    voiceTtsModelId: "",
    voiceTtsVoice: "",
    voiceTtsVoicesByAdapter: {},
    voiceTtsStylePreset: "natural",
    voiceTtsStyleCustom: "",
    voiceTtsAdapter: ""
  });

  function defaultProfile(provider) {
    return {
      enabled: false,
      apiKey: "",
      baseUrl: provider?.baseUrl || "",
      fetchedModels: [],
      enabledModels: [],
      pinnedModels: [],
      selectedModel: "",
      userConfigured: false
    };
  }

  function markProfileUserConfigured(providerId = labState.providerId) {
    if (!providerId) return;
    const provider = labProviders.find((p) => p.id === providerId);
    const profile = ensureProfile(providerId, provider);
    profile.userConfigured = true;
  }

  function cloneModelList(list) {
    return (list || []).map((item) =>
      item && typeof item === "object" ? { ...item } : item
    );
  }

  function cloneStringList(list) {
    return [...(list || [])];
  }

  function detachProfileArrays(state = labState) {
    Object.values(state.profiles || {}).forEach((profile) => {
      if (!profile || typeof profile !== "object") return;
      profile.fetchedModels = cloneModelList(profile.fetchedModels);
      profile.enabledModels = cloneStringList(profile.enabledModels);
      profile.pinnedModels = cloneStringList(profile.pinnedModels);
    });
  }

  function getProviderDefaultBaseUrl(provider) {
    return normalizeBaseUrl(provider?.baseUrl || "");
  }

  function foreignDefaultBaseUrls(excludeId) {
    const urls = new Set();
    labProviders.forEach((p) => {
      if (p.id === excludeId || isUserCustomProvider(p)) return;
      const url = getProviderDefaultBaseUrl(p);
      if (url) urls.add(url);
    });
    return urls;
  }

  function looksLikeAggregatorModel(modelId) {
    const id = String(modelId || "");
    return id.includes("/") || id.startsWith("~");
  }

  function profileHasAggregatorModels(profile) {
    if (!profile) return false;
    const ids = [
      ...(profile.fetchedModels || []).map((m) => m.id || m),
      ...(profile.enabledModels || [])
    ];
    return ids.some(looksLikeAggregatorModel);
  }

  function isAggregatorProvider(provider) {
    if (!provider) return false;
    if (provider.id === "openrouter" || provider.id === "together") return true;
    return (provider.tags || []).includes("聚合");
  }

  /** 清除非聚合平台误存的 OpenRouter 等聚合模型 */
  function sanitizeForeignModels() {
    let changed = false;
    labProviders.forEach((provider) => {
      if (isUserCustomProvider(provider) || isAggregatorProvider(provider)) return;
      const profile = labState.profiles[provider.id];
      if (!profile || !profileHasAggregatorModels(profile)) return;
      profile.fetchedModels = [];
      profile.enabledModels = [];
      profile.selectedModel = "";
      profile.apiKey = "";
      profile.userConfigured = false;
      changed = true;
    });
    return changed;
  }

  /** 同一密钥出现在多个平台时，只保留用户真正配置过的那一项 */
  function dedupeSharedApiKeys() {
    const byKey = new Map();
    labProviders.forEach((provider) => {
      const profile = labState.profiles[provider.id];
      const key = profile?.apiKey?.trim();
      if (!key) return;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(provider);
    });

    let changed = false;
    byKey.forEach((providers) => {
      if (providers.length <= 1) return;
      const owner = chooseApiKeyOwner(providers);
      providers.forEach((provider) => {
        if (provider.id === owner.id) return;
        const profile = labState.profiles[provider.id];
        profile.apiKey = "";
        profile.userConfigured = false;
        changed = true;
      });
    });
    return changed;
  }

  function chooseApiKeyOwner(providers) {
    let best = providers[0];
    let bestScore = -1;
    providers.forEach((provider) => {
      const profile = labState.profiles[provider.id] || {};
      let score = 0;
      if (profile.userConfigured) score += 200;
      if (provider.id === labState.providerId) score += 20;
      if (isAggregatorProvider(provider)) score += 15;
      score += (profile.enabledModels?.length || 0) * 8;
      score += (profile.fetchedModels?.length || 0) * 4;
      if (score > bestScore) {
        bestScore = score;
        best = provider;
      }
    });
    return best;
  }

  /** 未标记 userConfigured 的平台一律不保留密钥（防止刷新/串台自动填入） */
  function clearUnconfiguredApiKeys() {
    let changed = false;
    labProviders.forEach((provider) => {
      const profile = labState.profiles[provider.id];
      if (!profile?.apiKey?.trim()) return;
      if (profile.userConfigured) return;
      profile.apiKey = "";
      changed = true;
    });
    return changed;
  }

  function stampConfiguredProfilesFromEvidence() {
    let changed = false;
    Object.entries(labState.profiles || {}).forEach(([, profile]) => {
      if (!profile || profile.userConfigured) return;
      const hasEvidence =
        Boolean(profile.apiKey?.trim()) &&
        ((profile.fetchedModels?.length || 0) > 0 || (profile.enabledModels?.length || 0) > 0);
      if (hasEvidence) {
        profile.userConfigured = true;
        changed = true;
      }
    });
    return changed;
  }

  function normalizeAllProvidersDisabledByDefault() {
    let changed = false;
    Object.values(labState.profiles || {}).forEach((profile) => {
      if (!profile) return;
      if (profile.enabled === false || profile.enabled === true) return;
      profile.enabled = false;
      changed = true;
    });
    if (!labState.defaultsAllProvidersOffV8) {
      Object.values(labState.profiles || {}).forEach((profile) => {
        if (!profile) return;
        if (profile.enabled === false) return;
        if ((profile.enabledModels?.length || 0) > 0 && profile.userConfigured) {
          profile.enabled = true;
          return;
        }
        profile.enabled = false;
        changed = true;
      });
      labState.defaultsAllProvidersOffV8 = true;
    }
    return changed;
  }

  function runProfileStorageSanitize() {
    let changed = false;
    changed = normalizeAllProvidersDisabledByDefault() || changed;
    if (!labState.storageSanitizedV7) {
      changed = stampConfiguredProfilesFromEvidence() || changed;
      changed = clearUnconfiguredApiKeys() || changed;
      labState.storageSanitizedV7 = true;
    }
    changed = sanitizeForeignModels() || changed;
    changed = clearUnconfiguredApiKeys() || changed;
    changed = dedupeSharedApiKeys() || changed;
    changed = reconcilePlatformsWithEnabledModels() || changed;
    return changed;
  }

  /** 内置平台误用了其他平台官方 API 地址时，恢复为本平台默认并清空模型缓存 */
  function repairProfileOnSwitch(provider) {
    if (!provider || isUserCustomProvider(provider)) return false;
    const profile = ensureProfile(provider.id, provider);
    const current = normalizeBaseUrl(profile.baseUrl || "");
    if (!current) return false;
    const foreign = foreignDefaultBaseUrls(provider.id);
    if (!foreign.has(current)) return false;
    profile.baseUrl = getProviderDefaultBaseUrl(provider);
    profile.fetchedModels = [];
    profile.enabledModels = [];
    profile.selectedModel = "";
    return true;
  }

  function migrateLabState(raw) {
    const state = { ...defaultLabState(), ...raw };
    if (raw.version >= 5 || state.legacyGlobalsMigrated) {
      state.legacyGlobalsMigrated = true;
    }
    if (!state.profiles || typeof state.profiles !== "object") state.profiles = {};
    state.customProviders = (state.customProviders || []).map((p) => ({
      ...p,
      group: "custom",
      isCustom: true
    }));

    const legacyBuiltin = state.profiles?.custom;
    const hasLegacyBuiltin =
      state.providerId === "custom" ||
      legacyBuiltin?.apiKey ||
      legacyBuiltin?.baseUrl ||
      legacyBuiltin?.fetchedModels?.length;
    if (hasLegacyBuiltin && !state.customProviders.length) {
      const migrated = {
        id: `custom-${Date.now()}`,
        name: "自定义",
        baseUrl: legacyBuiltin?.baseUrl || "",
        group: "custom",
        isCustom: true,
        brandColor: "#64748b",
        note: "OpenAI 兼容接口"
      };
      state.customProviders.push(migrated);
      state.profiles[migrated.id] = { ...defaultProfile(migrated), ...legacyBuiltin };
      delete state.profiles.custom;
      state.providerId = migrated.id;
    } else if (state.providerId === "custom") {
      state.providerId = state.customProviders[0]?.id || "openai";
      delete state.profiles.custom;
    }

    state.legacyGlobalsMigrated = true;

    if (!state.chatProviderId && state.chatModelId && state.providerId && state.selectedModel) {
      state.chatProviderId = state.providerId;
      state.chatModelId = state.selectedModel;
    }

    delete state.apiKey;
    delete state.baseUrl;
    delete state.fetchedModels;
    delete state.enabledModels;
    delete state.selectedModel;

    detachProfileArrays(state);
    if (raw.battleMode === true && state.chatMode !== "battle") {
      state.chatMode = "battle";
    }
    state.chatMode = state.chatMode === "battle" ? "battle" : "normal";
    delete state.battleMode;
    state.renderMode = "markdown";
    state.sessionsPanelMode = state.sessionsPanelMode === "agent" ? "agent" : "chat";
    state.sessionsPanelCollapsed = state.sessionsPanelCollapsed === true;
    state.voiceMode = state.voiceMode === true;
    state.voiceTtsProviderId = String(state.voiceTtsProviderId || "");
    state.voiceTtsModelId = String(state.voiceTtsModelId || "");
    state.voiceTtsVoice = String(state.voiceTtsVoice || "");
    state.voiceTtsVoicesByAdapter =
      state.voiceTtsVoicesByAdapter && typeof state.voiceTtsVoicesByAdapter === "object"
        ? state.voiceTtsVoicesByAdapter
        : {};
    state.voiceTtsStylePreset = String(state.voiceTtsStylePreset || "natural");
    state.voiceTtsStyleCustom = String(state.voiceTtsStyleCustom || "");
    state.voiceTtsAdapter = String(state.voiceTtsAdapter || "");
    return state;
  }

  function encodeChatModelValue(providerId, modelId) {
    return `${providerId}${CHAT_MODEL_SEP}${modelId}`;
  }

  function parseChatModelValue(value) {
    if (!value || !value.includes(CHAT_MODEL_SEP)) return null;
    const idx = value.indexOf(CHAT_MODEL_SEP);
    const providerId = value.slice(0, idx);
    const modelId = value.slice(idx + CHAT_MODEL_SEP.length);
    if (!providerId || !modelId) return null;
    if (!labProviders.some((p) => p.id === providerId)) return null;
    const profile = labState.profiles[providerId];
    if (!profile?.enabledModels?.includes(modelId)) return null;
    return { providerId, modelId };
  }

  function collectChatModelOptions({ ttsOnly = false, textOnly = false } = {}) {
    const options = [];
    labProviders.forEach((provider) => {
      const profile = labState.profiles[provider.id];
      if (!profile || !profileHasChatPickerModels(profile)) return;
      if (!profileHasChatCredentials(provider, profile)) return;
      const models = profile.enabledModels || [];
      if (!models.length) return;
      const platformName = displayProviderName(provider);
      models.forEach((modelId) => {
        if (ttsOnly && !isLikelyTtsModel(modelId)) return;
        if (textOnly && isLikelyTtsModel(modelId)) return;
        options.push({
          providerId: provider.id,
          modelId,
          platformName,
          label: `${platformName} · ${modelId}`,
          value: encodeChatModelValue(provider.id, modelId)
        });
      });
    });
    return options;
  }

  const CHAT_MODEL_SLOTS = ["primary", "battle"];

  function getChatModelStateKeys(slot) {
    return slot === "battle"
      ? { providerKey: "battleChatProviderId", modelKey: "battleChatModelId" }
      : { providerKey: "chatProviderId", modelKey: "chatModelId" };
  }

  function getChatModelPickerEls(slot) {
    if (slot === "battle") {
      return {
        wrap: labEls.labChatBattleModelPick,
        menu: labEls.labChatBattleModelMenu,
        trigger: labEls.labChatBattleModelTrigger,
        triggerText: labEls.labChatBattleModelTriggerText,
        platform: labEls.labChatBattleModelPlatform,
        panel: labEls.labChatBattleModelPanel,
        list: labEls.labChatBattleModelList,
        select: labEls.labChatBattleModel
      };
    }
    return {
      wrap: labEls.labChatModelPick,
      menu: labEls.labChatModelMenu,
      trigger: labEls.labChatModelTrigger,
      triggerText: labEls.labChatModelTriggerText,
      platform: labEls.labChatModelPlatform,
      panel: labEls.labChatModelPanel,
      list: labEls.labChatModelList,
      select: labEls.labChatModel
    };
  }

  function chatModelOptionsForSlot(slot) {
    const inVoice = normalizeChatMode(labState.chatMode) === "voice";
    if (slot === "primary" && inVoice) {
      return collectChatModelOptions({ textOnly: true });
    }
    return collectChatModelOptions();
  }

  function ensureChatModelSelectionForSlot(slot) {
    const options = chatModelOptionsForSlot(slot);
    const { providerKey, modelKey } = getChatModelStateKeys(slot);
    if (!options.length) {
      labState[providerKey] = "";
      labState[modelKey] = "";
      return null;
    }
    const valid = options.some(
      (o) => o.providerId === labState[providerKey] && o.modelId === labState[modelKey]
    );
    if (!valid) {
      if (slot === "battle") {
        const alt =
          options.find(
            (o) =>
              !(o.providerId === labState.chatProviderId && o.modelId === labState.chatModelId)
          ) || options[0];
        labState.battleChatProviderId = alt.providerId;
        labState.battleChatModelId = alt.modelId;
      } else {
        labState.chatProviderId = options[0].providerId;
        labState.chatModelId = options[0].modelId;
      }
    }
    return { providerId: labState[providerKey], modelId: labState[modelKey] };
  }

  function ensureChatModelSelection() {
    return ensureChatModelSelectionForSlot("primary");
  }

  function getBattleChatModelTarget() {
    const { select } = getChatModelPickerEls("battle");
    const fromSelect = parseChatModelValue(select?.value || "");
    if (fromSelect) return fromSelect;
    if (labState.battleChatProviderId && labState.battleChatModelId) {
      const profile = labState.profiles[labState.battleChatProviderId];
      if (profile?.enabledModels?.includes(labState.battleChatModelId)) {
        return {
          providerId: labState.battleChatProviderId,
          modelId: labState.battleChatModelId
        };
      }
    }
    return ensureChatModelSelectionForSlot("battle");
  }

  function getChatModelTarget() {
    const fromSelect = parseChatModelValue(labEls.labChatModel?.value || "");
    if (fromSelect) return fromSelect;
    if (labState.chatProviderId && labState.chatModelId) {
      const profile = labState.profiles[labState.chatProviderId];
      if (profile?.enabledModels?.includes(labState.chatModelId)) {
        return { providerId: labState.chatProviderId, modelId: labState.chatModelId };
      }
    }
    return ensureChatModelSelection();
  }

  function getProviderCredentials(providerId) {
    const provider = labProviders.find((p) => p.id === providerId);
    if (!provider) return null;
    const profile = ensureProfile(providerId, provider);
    return {
      provider,
      profile,
      baseUrl: normalizeBaseUrl(profile.baseUrl || provider.baseUrl || ""),
      apiKey: (profile.apiKey || "").trim(),
      enabled: isProfileEnabled(profile)
    };
  }

  function hasAnyChatModel() {
    return collectChatModelOptions().length > 0;
  }

  function hasAnyPlatformApiKey() {
    return labProviders.some((p) => Boolean(labState.profiles[p.id]?.apiKey?.trim()));
  }

  function ensureProfile(providerId, provider) {
    if (!labState.profiles[providerId]) {
      labState.profiles[providerId] = defaultProfile(provider);
    }
    const profile = labState.profiles[providerId];
    if (!profile.baseUrl && provider?.baseUrl) profile.baseUrl = provider.baseUrl;
    return profile;
  }

  function flushActiveProfile() {
    const provider = getProvider();
    const id = labState.providerId;
    if (!id) return;
    const profile = ensureProfile(id, provider);
    profile.enabled = labEls.labProviderEnabled?.checked === true;
    const keyFromForm = (labEls.labApiKey?.value || "").trim();
    if (keyFromForm) {
      profile.userConfigured = true;
      profile.apiKey = keyFromForm;
    } else if (profile.userConfigured || isUserCustomProvider(provider)) {
      profile.apiKey = "";
    }
    profile.baseUrl = normalizeBaseUrl(labEls.labBaseUrl?.value) || profile.baseUrl;
    profile.fetchedModels = cloneModelList(labState.fetchedModels);
    profile.enabledModels = cloneStringList(labState.enabledModels);
    profile.pinnedModels = cloneStringList(getPinnedModels());
    profile.selectedModel = labState.selectedModel || "";
  }

  function pullActiveProfile() {
    const provider = getProvider();
    const id = labState.providerId;
    if (!id) return;
    const profile = ensureProfile(id, provider);
    labState.apiKey = profile.userConfigured ? profile.apiKey || "" : "";
    labState.baseUrl = normalizeBaseUrl(profile.baseUrl || provider?.baseUrl || "");
    labState.fetchedModels = cloneModelList(profile.fetchedModels);
    labState.enabledModels = cloneStringList(profile.enabledModels);
    if (!profile.pinnedModels) profile.pinnedModels = [];
    else profile.pinnedModels = cloneStringList(profile.pinnedModels);
    labState.selectedModel = profile.selectedModel || "";
  }

  /** 新建自定义平台时使用，避免把上一平台的表单内容写入新 profile */
  function resetProviderProfile(providerId, provider) {
    const profile = defaultProfile(provider);
    profile.apiKey = "";
    profile.baseUrl = provider?.baseUrl ?? "";
    profile.fetchedModels = [];
    profile.enabledModels = [];
    profile.pinnedModels = [];
    profile.selectedModel = "";
    profile.userConfigured = false;
    profile.enabled = false;
    labState.profiles[providerId] = profile;
    return profile;
  }

  function isProfileEnabled(profile) {
    return profile?.enabled === true;
  }

  function profileHasChatPickerModels(profile) {
    return Boolean(profile?.enabledModels?.length);
  }

  function profileHasChatCredentials(provider, profile) {
    if (!profile) return false;
    if (profile.apiKey?.trim()) return true;
    return Boolean(isUserCustomProvider(provider) && normalizeBaseUrl(profile.baseUrl || provider?.baseUrl));
  }

  /** 已有勾选模型 + 密钥的平台，恢复为开启（避免迁移后全部被关掉） */
  function reconcilePlatformsWithEnabledModels() {
    let changed = false;
    labProviders.forEach((provider) => {
      const profile = labState.profiles[provider.id];
      if (!profile || profile.enabled === true) return;
      if (!profileHasChatPickerModels(profile) || !profileHasChatCredentials(provider, profile)) return;
      profile.enabled = true;
      changed = true;
    });
    return changed;
  }

  function getChatModelEmptyLabel() {
    const hasAnyEnabledModels = labProviders.some((p) =>
      profileHasChatPickerModels(labState.profiles[p.id])
    );
    const hasAnyKey = labProviders.some((p) => profileHasChatCredentials(p, labState.profiles[p.id]));
    if (!hasAnyKey) return "请先在左侧平台填写 API 密钥并拉取模型";
    if (!hasAnyEnabledModels) return "请在模型列表中勾选要使用的模型";
    const needsSwitch = labProviders.some(
      (p) =>
        profileHasChatPickerModels(labState.profiles[p.id]) &&
        profileHasChatCredentials(p, labState.profiles[p.id]) &&
        !isProfileEnabled(labState.profiles[p.id])
    );
    if (needsSwitch) return "请打开对应平台右上角开关";
    return "请先在各平台启用模型";
  }

  function isProviderOn(providerId) {
    const profile = labState.profiles[providerId];
    if (!profile) return false;
    return isProfileEnabled(profile) && Boolean(profile.apiKey?.trim());
  }

  function primaryApiKey() {
    return (labState.apiKey || "").split(",")[0].trim();
  }

  let labProviders = [];
  let labProviderLogoManifest = null;
  let labProviderGroups = [];
  let labProviderSearchQuery = "";
  let labState = loadLabState();
  let labEls = {};
  let labBound = false;
  let chatModelPickerBound = false;
  let labSessionsState = loadLabSessionsState();
  migrateSessionsStateV3(labSessionsState);
  let labChatMessages = getActiveSessionId() ? getActiveSessionMessages() : [];
  let labAbortController = null;
  let labModelSearchQuery = "";
  let labSessionSearchQuery = "";
  let labToolMap = { byToolId: {}, byDomain: {} };
  let labStatusExpanded = false;
  let labSessionNoticeTimer = null;
  let labNameFieldProviderId = "";
  

  function displayProviderName(provider) {
    const name = (provider?.name ?? "").trim();
    return name || "未命名平台";
  }

  function updateCustomProviderLabels() {
    const provider = getProvider();
    if (!provider || !isUserCustomProvider(provider)) return;
    const label = displayProviderName(provider);
    const strong = labEls.labStudioHead?.querySelector(".lab-studio-head-text strong");
    if (strong) strong.textContent = label;
    const item = labEls.labProviderList?.querySelector(
      `button[data-provider-id="${provider.id}"] .lab-studio-item-name`
    );
    if (item) item.textContent = label;
  }

  function saveCustomProvider() {
    if (!isUserCustomProvider(getProvider())) return;
    persistCustomProviderMeta();
    persistFormConfig();
    saveLabState();
    renderStudioList();
    setLabStatus("配置已保存到本机", "ok");
  }

  function loadLabState() {
    try {
      const saved =
        JSON.parse(localStorage.getItem(LAB_STORAGE_KEY) || "null") ||
        JSON.parse(localStorage.getItem("neux-lab-v5") || "null") ||
        JSON.parse(localStorage.getItem("neux-lab-v4") || "null") ||
        {};
      const hasModernStore =
        saved.version >= 5 ||
        (saved.profiles && Object.keys(saved.profiles).length > 0);

      if (hasModernStore) {
        return migrateLabState(saved);
      }

      const legacyV3 = JSON.parse(localStorage.getItem("neux-lab-v3") || "{}");
      const legacyV2 = JSON.parse(localStorage.getItem("neux-lab-v2") || "{}");
      const legacyV1 = JSON.parse(localStorage.getItem("neux-lab-v1") || "{}");
      const merged = migrateLabState({ ...legacyV1, ...legacyV2, ...legacyV3, ...saved });
      merged.legacyGlobalsMigrated = true;
      return merged;
    } catch {
      return defaultLabState();
    }
  }

  function saveLabState() {
    flushActiveProfile();
    const {
      providerId,
      profiles,
      customProviders,
      chatProviderId,
      chatModelId,
      battleChatProviderId,
      battleChatModelId,
      chatMode,
      renderMode,
      systemPrompt,
      temperature,
      maxTokens,
      stream,
      modelFilter,
      providerListFilter,
      collapsedGroups,
      autoFetchOnTest,
      moreSettingsCollapsed,
      sessionsSidebarCollapsed,
      studioPanelCollapsed,
      sessionsPanelCollapsed,
      sessionsPanelMode,
      voiceMode,
      voiceTtsProviderId,
      voiceTtsModelId,
      voiceTtsVoice,
      voiceTtsVoicesByAdapter,
      voiceTtsStylePreset,
      voiceTtsStyleCustom
    } = labState;
    localStorage.setItem(
      LAB_STORAGE_KEY,
      JSON.stringify({
        version: 7,
        providerId,
        profiles,
        customProviders,
        legacyGlobalsMigrated: true,
        storageSanitizedV7: labState.storageSanitizedV7 === true,
        defaultsAllProvidersOffV8: labState.defaultsAllProvidersOffV8 === true,
        chatProviderId,
        chatModelId,
        battleChatProviderId,
        battleChatModelId,
        chatMode: chatMode === "battle" ? "battle" : "normal",
        renderMode: "markdown",
        systemPrompt,
        temperature,
        maxTokens,
        stream,
        modelFilter,
        providerListFilter,
        collapsedGroups,
        autoFetchOnTest,
        moreSettingsCollapsed: moreSettingsCollapsed === true,
        sessionsSidebarCollapsed: sessionsSidebarCollapsed === true,
        studioPanelCollapsed: studioPanelCollapsed === true,
        sessionsPanelCollapsed: sessionsPanelCollapsed === true,
        sessionsPanelMode: sessionsPanelMode === "agent" ? "agent" : "chat",
        voiceMode: voiceMode === true,
        voiceTtsProviderId: String(voiceTtsProviderId || ""),
        voiceTtsModelId: String(voiceTtsModelId || ""),
        voiceTtsVoice: String(voiceTtsVoice || ""),
        voiceTtsVoicesByAdapter:
          voiceTtsVoicesByAdapter && typeof voiceTtsVoicesByAdapter === "object"
            ? voiceTtsVoicesByAdapter
            : {},
        voiceTtsStylePreset: String(voiceTtsStylePreset || "natural"),
        voiceTtsStyleCustom: String(voiceTtsStyleCustom || "")
      })
    );
  }

  function syncSessionsSidebarCollapse() {
    const collapsed = labState.sessionsSidebarCollapsed === true;
    labEls.labChatLayout?.classList.toggle("is-sessions-collapsed", collapsed);
    if (labEls.labSessionsCollapse) {
      labEls.labSessionsCollapse.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
    if (labEls.labSessionsExpand) {
      labEls.labSessionsExpand.hidden = !collapsed;
    }
  }

  let studioMainAnimTimer = 0;

  function animateStudioMainContent({ mode = "switch" } = {}) {
    const main = labEls.labStudioMain;
    if (!main) return;
    const target = mode === "enter" ? main : main.querySelector(".lab-studio-body");
    if (!target) return;
    const className = mode === "enter" ? "is-panel-entering" : "is-content-switching";
    target.classList.remove("is-panel-entering", "is-content-switching");
    void target.offsetWidth;
    target.classList.add(className);
    window.clearTimeout(studioMainAnimTimer);
    studioMainAnimTimer = window.setTimeout(() => {
      target.classList.remove("is-panel-entering", "is-content-switching");
    }, mode === "enter" ? 460 : 380);
  }

  function revealStudioMainPanel({ animate = true } = {}) {
    if (labState.studioPanelCollapsed !== true) return false;
    labState.studioPanelCollapsed = false;
    syncStudioPanelCollapse();
    saveLabState();
    if (animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => animateStudioMainContent({ mode: "enter" }));
      });
    }
    return true;
  }

  function focusStudioProviderItem(providerId) {
    const btn = labEls.labProviderList?.querySelector(
      `button[data-provider-id="${CSS.escape(String(providerId || ""))}"]`
    );
    btn?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function syncStudioPanelCollapse() {
    const collapsed = labState.studioPanelCollapsed === true;
    labEls.labWorkspace?.classList.toggle("is-studio-main-collapsed", collapsed);
    labEls.labStudioPanel?.classList.toggle("is-studio-main-collapsed", collapsed);
    if (labEls.labStudioPanelCollapse) {
      labEls.labStudioPanelCollapse.setAttribute("aria-expanded", collapsed ? "false" : "true");
      const label = labEls.labStudioPanelCollapse.querySelector(".lab-studio-panel-collapse-text");
      if (label) label.textContent = collapsed ? "展开" : "收起";
      labEls.labStudioPanelCollapse.title = collapsed
        ? "展开平台配置"
        : "收起平台配置，对话区占满剩余空间";
    }
    if (labEls.labStudioMainReveal) {
      labEls.labStudioMainReveal.hidden = !collapsed;
    }
  }

  function toggleStudioPanelCollapse(collapsed) {
    const next = typeof collapsed === "boolean" ? collapsed : !labState.studioPanelCollapsed;
    labState.studioPanelCollapsed = next;
    syncStudioPanelCollapse();
    saveLabState();
  }

  function toggleSessionsSidebarCollapse(collapsed) {
    const next = typeof collapsed === "boolean" ? collapsed : !labState.sessionsSidebarCollapsed;
    if (next && isSessionSearchOpen()) toggleSessionSearch(false);
    closeAllSessionMenus();
    labState.sessionsSidebarCollapsed = next;
    syncSessionsSidebarCollapse();
    saveLabState();
  }

  function syncMoreSettingsCollapse() {
    const root = labEls.labStudioMore;
    if (!root) return;
    const collapsed = labState.moreSettingsCollapsed === true;
    root.classList.toggle("is-collapsed", collapsed);
    const expanded = !collapsed;
    labEls.labStudioMoreExpand?.setAttribute("aria-expanded", String(expanded));
    labEls.labStudioMorePanel?.setAttribute("aria-hidden", collapsed ? "true" : "false");
    if (labEls.labStudioMoreExpand) {
      labEls.labStudioMoreExpand.title = collapsed
        ? "点击展开更多设置"
        : "点击收起更多设置";
    }
  }

  function toggleMoreSettingsCollapse(collapsed) {
    const next = typeof collapsed === "boolean" ? collapsed : !labState.moreSettingsCollapsed;
    labState.moreSettingsCollapsed = next;
    syncMoreSettingsCollapse();
    saveLabState();
  }

  function sessionCreatedAt(chat, id) {
    if (typeof chat?.createdAt === "number") return chat.createdAt;
    const m = /^s-(\d+)$/.exec(String(id || ""));
    if (m) return Number(m[1]);
    return chat?.updatedAt || 0;
  }

  function sortSessionEntries(entries) {
    return entries.sort((a, b) => sessionCreatedAt(a[1], a[0]) - sessionCreatedAt(b[1], b[0]));
  }

  function migrateSessionTimestamps(state) {
    let changed = false;
    Object.entries(state.chats || {}).forEach(([id, chat]) => {
      const created = sessionCreatedAt(chat, id);
      if (chat.createdAt !== created) {
        chat.createdAt = created;
        changed = true;
      }
      if (!chat.updatedAt) {
        chat.updatedAt = created;
        changed = true;
      }
      if (chat.workspace) {
        delete chat.workspace;
        changed = true;
      }
    });
    return changed;
  }

  function normalizeSessionMode(mode) {
    if (mode === SESSION_MODE_AGENT) return SESSION_MODE_AGENT;
    return mode === SESSION_MODE_BATTLE ? SESSION_MODE_BATTLE : SESSION_MODE_NORMAL;
  }

  function getCurrentSessionModeKey() {
    return normalizeSessionMode(labState.chatMode);
  }

  function getStorageSessionModeKey() {
    if (labState.sessionsPanelMode === "agent") return SESSION_MODE_AGENT;
    return getCurrentSessionModeKey();
  }

  function sessionsForMode(mode) {
    const key = normalizeSessionMode(mode);
    return Object.entries(labSessionsState.chats || {}).filter(
      ([, chat]) => normalizeSessionMode(chat?.mode || SESSION_MODE_NORMAL) === key
    );
  }

  function ensureSessionsStateShape() {
    if (!labSessionsState.chats) labSessionsState.chats = {};
    if (!labSessionsState.activeIds) {
      const now = Date.now();
      const normalId = `s-${now}`;
      labSessionsState.activeIds = { normal: normalId, battle: null, agent: null };
      labSessionsState.chats[normalId] = {
        title: "",
        messages: [],
        createdAt: now,
        updatedAt: now,
        mode: SESSION_MODE_NORMAL
      };
    }
    labSessionsState.version = 3;
    migrateSessionsStateV3(labSessionsState);
  }

  function migrateSessionsStateV3(state) {
    if (!state.activeIds) state.activeIds = {};
    if (!state.activeIds.agent || !state.chats[state.activeIds.agent]) {
      const now = Date.now();
      const agentId = `s-agent-${now}`;
      state.chats[agentId] = {
        title: "",
        messages: [],
        createdAt: now,
        updatedAt: now,
        mode: SESSION_MODE_AGENT
      };
      state.activeIds.agent = agentId;
    } else {
      state.chats[state.activeIds.agent].mode = SESSION_MODE_AGENT;
    }
    state.version = 3;
    return state;
  }

  function ensureActiveSessionForMode(mode) {
    ensureSessionsStateShape();
    const key = normalizeSessionMode(mode);
    const activeId = labSessionsState.activeIds[key];
    const activeChat = activeId ? labSessionsState.chats[activeId] : null;
    if (activeChat && normalizeSessionMode(activeChat.mode || key) === key) {
      return activeId;
    }

    const existing = sessionsForMode(key);
    if (existing.length) {
      labSessionsState.activeIds[key] = existing[0][0];
      return existing[0][0];
    }

    const now = Date.now();
    const id =
      key === SESSION_MODE_BATTLE
        ? `s-battle-${now}`
        : key === SESSION_MODE_AGENT
          ? `s-agent-${now}`
          : `s-${now}`;
    labSessionsState.chats[id] = {
      title: "",
      messages: [],
      createdAt: now,
      updatedAt: now,
      mode: key
    };
    labSessionsState.activeIds[key] = id;
    saveLabSessionsState();
    return id;
  }

  function getActiveSessionId() {
    ensureSessionsStateShape();
    const key = getStorageSessionModeKey();
    const activeId = labSessionsState.activeIds[key];
    if (!activeId) return null;
    const chat = labSessionsState.chats[activeId];
    if (!chat) return null;
    if (normalizeSessionMode(chat.mode || key) !== key) return null;
    return activeId;
  }

  function setActiveSessionId(sessionId) {
    ensureSessionsStateShape();
    labSessionsState.activeIds[getStorageSessionModeKey()] = sessionId;
  }

  function migrateSessionsState(raw) {
    if (raw?.version >= 2 && raw.activeIds && raw.chats) {
      migrateSessionTimestamps(raw);
      return migrateSessionsStateV3(raw);
    }

    const now = Date.now();
    const legacyChats = raw?.chats || {};
    const legacyActive = raw?.activeId;
    const normalId =
      legacyActive && legacyChats[legacyActive] ? legacyActive : Object.keys(legacyChats)[0] || `s-${now}`;
    const battleId = `s-battle-${now + 1}`;

    const chats = {};
    Object.entries(legacyChats).forEach(([id, chat]) => {
      chats[id] = {
        ...chat,
        mode: normalizeSessionMode(chat?.mode || SESSION_MODE_NORMAL)
      };
    });

    if (!chats[normalId]) {
      chats[normalId] = {
        title: "",
        messages: [],
        createdAt: now,
        updatedAt: now,
        mode: SESSION_MODE_NORMAL
      };
    } else {
      chats[normalId].mode = SESSION_MODE_NORMAL;
    }

    const existingBattle = Object.entries(chats).find(
      ([, chat]) => normalizeSessionMode(chat.mode) === SESSION_MODE_BATTLE
    );
    const resolvedBattleId = existingBattle ? existingBattle[0] : battleId;
    if (!existingBattle) {
      chats[battleId] = {
        title: "",
        messages: [],
        createdAt: now + 1,
        updatedAt: now + 1,
        mode: SESSION_MODE_BATTLE
      };
    }

    migrateSessionTimestamps(state);
    return migrateSessionsStateV3(state);
  }

  function defaultSessionsState() {
    const now = Date.now();
    const normalId = `s-${now}`;
    const battleId = `s-battle-${now + 1}`;
    const agentId = `s-agent-${now + 2}`;
    return migrateSessionsStateV3({
      version: 3,
      activeIds: {
        normal: normalId,
        battle: battleId,
        agent: agentId
      },
      chats: {
        [normalId]: {
          title: "",
          messages: [],
          createdAt: now,
          updatedAt: now,
          mode: SESSION_MODE_NORMAL
        },
        [battleId]: {
          title: "",
          messages: [],
          createdAt: now + 1,
          updatedAt: now + 1,
          mode: SESSION_MODE_BATTLE
        },
        [agentId]: {
          title: "",
          messages: [],
          createdAt: now + 2,
          updatedAt: now + 2,
          mode: SESSION_MODE_AGENT
        }
      }
    });
  }

  function loadLabSessionsState() {
    try {
      const raw = JSON.parse(localStorage.getItem(LAB_SESSIONS_KEY) || "null");
      if (raw?.chats) {
        const state = migrateSessionsState(raw);
        if (JSON.stringify(state) !== JSON.stringify(raw)) {
          localStorage.setItem(LAB_SESSIONS_KEY, JSON.stringify(state));
        }
        return state;
      }
    } catch {
      /* ignore */
    }
    try {
      const legacy = JSON.parse(sessionStorage.getItem("neux-lab-session") || "[]");
      const state = defaultSessionsState();
      if (legacy.length) state.chats[state.activeIds.normal].messages = legacy;
      return state;
    } catch {
      return defaultSessionsState();
    }
  }

  function saveLabSessionsState() {
    ensureSessionsStateShape();
    localStorage.setItem(LAB_SESSIONS_KEY, JSON.stringify(labSessionsState));
  }

  function getActiveSession({ create = false } = {}) {
    let id = getActiveSessionId();
    if (!id && create) {
      id = ensureActiveSessionForMode(getStorageSessionModeKey());
    }
    if (!id) return null;
    if (!labSessionsState.chats[id]) {
      const now = Date.now();
      labSessionsState.chats[id] = {
        title: "",
        messages: [],
        createdAt: now,
        updatedAt: now,
        mode: getStorageSessionModeKey()
      };
    }
    return labSessionsState.chats[id];
  }

  function getActiveSessionMessages() {
    return getActiveSession()?.messages || [];
  }

  function syncMessagesToSession() {
    const session = getActiveSession({ create: false });
    if (!session) return;
    const changed = JSON.stringify(session.messages) !== JSON.stringify(labChatMessages);
    session.messages = labChatMessages;
    if (changed) {
      session.updatedAt = Date.now();
      syncSessionTitleFromMessages(session);
    }
    saveLabSessionsState();
  }

  function saveLabSession() {
    syncMessagesToSession();
    renderSessionList();
  }

  function normalizeBaseUrl(url) {
    return (url || "").trim().replace(/\/+$/, "");
  }

  function isFreeModel(id) {
    return /:free\b/i.test(id) || /\/free\b/i.test(id);
  }

  function getProvider() {
    return labProviders.find((item) => item.id === labState.providerId);
  }

  function apiHeaders({ apiKey: apiKeyOverride, providerId } = {}) {
    const headers = { "Content-Type": "application/json" };
    const pid = providerId || labState.providerId;
    const provider = labProviders.find((p) => p.id === pid) || getProvider();
    const profile = pid ? ensureProfile(pid, provider) : null;
    const key = (apiKeyOverride || profile?.apiKey || labState.apiKey || "").split(",")[0].trim();
    if (key) headers.Authorization = `Bearer ${key}`;
    if (provider?.extraHeaders) {
      Object.entries(provider.extraHeaders).forEach(([hKey, value]) => {
        headers[hKey] = String(value).replace("{origin}", window.location.origin);
      });
    }
    if (pid === "openrouter") {
      headers["HTTP-Referer"] = window.location.origin;
      headers["X-Title"] = "NEUX Lab";
    }
    return headers;
  }

  function persistFormConfig() {
    labState.baseUrl = normalizeBaseUrl(labEls.labBaseUrl?.value);
    labState.apiKey = (labEls.labApiKey?.value || "").trim();
    labState.systemPrompt = labEls.labSystemPrompt?.value?.trim() || "";
    labState.temperature = Number(labEls.labTemperature?.value) || 0.7;
    labState.maxTokens = Number(labEls.labMaxTokens?.value) || 2048;
    labState.stream = Boolean(labEls.labStream?.checked);
    persistCustomProviderMeta();
    flushActiveProfile();
    saveLabState();
  }

  function updateApiPreview() {
    if (!labEls.labApiPreview) return;
    const base = normalizeBaseUrl(labEls.labBaseUrl?.value || labState.baseUrl);
    labEls.labApiPreview.textContent = base ? `预览: ${base}/chat/completions` : "预览: —";
  }

  function setLabUsage(text) {
    if (labEls.labUsage) labEls.labUsage.textContent = text || "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function corsHint(error) {
    if (error?.message?.includes("Failed to fetch") || error?.name === "TypeError") {
      return "（可能是 CORS：展开下方「连接失败？CORS 与代理说明」）";
    }
    return "";
  }

  function formatApiError(error, status) {
    const msg = error?.message || String(error);
    if (status === 401 || /unauthorized|invalid.*key|api.?key/i.test(msg)) {
      return { text: `认证失败：请检查 API 密钥是否正确。${msg}`, kind: "auth" };
    }
    if (status === 429 || /rate limit|too many/i.test(msg)) {
      return { text: `请求过于频繁：请稍后重试或更换密钥。${msg}`, kind: "rate" };
    }
    if (status === 404 || /not found|model.*not/i.test(msg)) {
      return { text: `资源不存在：请确认模型 ID 与 API 地址。${msg}`, kind: "notfound" };
    }
    if (msg.includes("Failed to fetch") || error?.name === "TypeError") {
      return { text: `网络或 CORS 错误：浏览器无法直连该地址。${corsHint(error)}`, kind: "cors" };
    }
    return { text: msg, kind: "error" };
  }

  function setLabStatus(message, type = "", { expanded = false, kind = "" } = {}) {
    if (!labEls.labStatus) return;
    const full = String(message || "");
    labEls.labStatus.hidden = !full;
    labEls.labStatus.dataset.type = type;
    labEls.labStatus.dataset.errorKind = type === "error" ? kind : "";
    if (expanded) labStatusExpanded = true;
    const canExpand = full.length > 72;
    labEls.labStatus.classList.toggle("is-expandable", canExpand);
    labEls.labStatus.classList.toggle("is-expanded", labStatusExpanded && canExpand);
    labEls.labStatus.dataset.fullText = full;
    labEls.labStatus.title = canExpand && !labStatusExpanded ? "点击展开完整信息" : "";
    labEls.labStatus.textContent =
      labStatusExpanded || !canExpand ? full : `${full.slice(0, 70)}…`;
  }

  function setSessionNotice(message, type = "ok", { autoHideMs = 3200 } = {}) {
    if (!labEls.labSessionNotice) return;
    if (labSessionNoticeTimer) {
      clearTimeout(labSessionNoticeTimer);
      labSessionNoticeTimer = null;
    }
    const full = String(message || "").trim();
    labEls.labSessionNotice.hidden = !full;
    labEls.labSessionNotice.dataset.type = type;
    labEls.labSessionNotice.textContent = full;
    if (full && autoHideMs > 0) {
      labSessionNoticeTimer = setTimeout(() => setSessionNotice(""), autoHideMs);
    }
  }

  async function loadLabToolMap() {
    try {
      const res = await fetch(LAB_TOOL_MAP_URL);
      if (res.ok) labToolMap = await res.json();
    } catch {
      labToolMap = { byToolId: {}, byDomain: {} };
    }
  }

  function resolveProviderIdForTool(toolId, domain) {
    if (labToolMap.byToolId?.[toolId]) return labToolMap.byToolId[toolId];
    if (domain && labToolMap.byDomain?.[domain]) return labToolMap.byDomain[domain];
    return "";
  }

  function updateLabUrl(providerId) {
    const url = new URL(location.href);
    url.hash = "lab";
    if (providerId) url.searchParams.set("provider", providerId);
    else url.searchParams.delete("provider");
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function applyUrlParams() {
    const params = new URLSearchParams(location.search);
    const providerId = params.get("provider");
    if (providerId && labProviders.some((p) => p.id === providerId)) {
      flushActiveProfile();
      labState.providerId = providerId;
      const provider = labProviders.find((p) => p.id === providerId);
      repairProfileOnSwitch(provider);
      pullActiveProfile();
      syncLabFormFromState();
    }
  }

  function getPinnedModels() {
    return ensureProfile(labState.providerId, getProvider()).pinnedModels || [];
  }

  function sortModelsByPin(list) {
    const pinned = getPinnedModels();
    return [...list].sort((a, b) => {
      const aid = a.id || a;
      const bid = b.id || b;
      const ap = pinned.includes(aid) ? 0 : 1;
      const bp = pinned.includes(bid) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return aid.localeCompare(bid);
    });
  }

  function isGenericSessionTitle(title) {
    return !String(title || "").trim() || /^对话\s*\d*$/.test(String(title).trim());
  }

  function sessionTitle(chat) {
    const messages = chat.messages || [];
    for (let i = 0; i < messages.length; i += 1) {
      const msg = messages[i];
      if (msg.role === "user" || msg.role === "assistant") {
        const text = String(msg.content || "").replace(/\s+/g, " ").trim();
        if (text) return text.length > 48 ? `${text.slice(0, 48)}…` : text;
      }
    }
    return normalizeSessionMode(chat.mode) === SESSION_MODE_AGENT ? "新 Agent 任务" : "新对话";
  }

  function syncSessionTitleFromMessages(chat) {
    chat.title = sessionTitle(chat);
  }

  function refreshAllSessionTitles() {
    Object.values(labSessionsState.chats).forEach(syncSessionTitleFromMessages);
  }

  function sessionPreview(chat) {
    const messages = chat.messages || [];
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg.role === "user" || msg.role === "assistant") {
        const text = String(msg.content || "").replace(/\s+/g, " ").trim();
        if (text) return text.length > 32 ? `${text.slice(0, 32)}…` : text;
      }
    }
    return "暂无消息";
  }

  function closeAllSessionMenus() {
    document.querySelectorAll(".lab-chat-session-menu-pop").forEach((pop) => {
      pop.hidden = true;
    });
    document.querySelectorAll(".lab-chat-session-item-more").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function isSessionSearchOpen() {
    return Boolean(labEls.labSessionSearchField && !labEls.labSessionSearchField.hidden);
  }

  function toggleSessionSearch(force) {
    const field = labEls.labSessionSearchField;
    const btn = labEls.labSessionSearchToggle;
    if (!field || !btn) return;
    const show = typeof force === "boolean" ? force : field.hidden;
    field.hidden = !show;
    btn.hidden = show;
    btn.classList.toggle("is-active", show);
    btn.setAttribute("aria-expanded", show ? "true" : "false");
    if (show) {
      labEls.labSessionSearch?.focus();
    } else if (labEls.labSessionSearch) {
      labEls.labSessionSearch.value = "";
      labSessionSearchQuery = "";
      renderSessionList();
    }
  }

  function isVoiceChatMode() {
    return normalizeChatMode(labState.chatMode) === "voice";
  }

  function isVoiceMode() {
    return (
      isVoiceChatMode() &&
      labState.chatProviderId &&
      labState.chatModelId &&
      !isLikelyTtsModel(labState.chatModelId) &&
      labState.voiceTtsProviderId &&
      labState.voiceTtsModelId &&
      isLikelyTtsModel(labState.voiceTtsModelId)
    );
  }

  function ensureVoiceTtsSelection() {
    const options = collectChatModelOptions({ ttsOnly: true });
    if (!options.length) {
      labState.voiceTtsProviderId = "";
      labState.voiceTtsModelId = "";
      return null;
    }
    const valid = options.some(
      (o) => o.providerId === labState.voiceTtsProviderId && o.modelId === labState.voiceTtsModelId
    );
    if (!valid) {
      labState.voiceTtsProviderId = options[0].providerId;
      labState.voiceTtsModelId = options[0].modelId;
    }
    return { providerId: labState.voiceTtsProviderId, modelId: labState.voiceTtsModelId };
  }

  function applyVoiceTtsSelection(parsed) {
    if (!parsed) return;
    labState.voiceTtsProviderId = parsed.providerId;
    labState.voiceTtsModelId = parsed.modelId;
    labState.voiceTtsVoice = "";
    labState.voiceTtsAdapter = "";
    saveLabState();
    closeAllVoicePickers();
    renderVoiceModePanel();
  }

  function isLikelyTtsModel(modelId) {
    const id = String(modelId || "").toLowerCase();
    if (!id) return false;
    if (/tts|speech|sambert|cosyvoice|text2audio|t2a|audio\.speech/i.test(id)) return true;
    if (id.includes("audio") && id.includes("tts")) return true;
    return false;
  }

  let labVoiceAudio = null;
  let labVoiceAudioUrl = null;
  let labVoiceSpeaking = false;
  let labVoiceSynthesizing = false;
  let labVoiceTtsAbort = null;
  let labVoiceNoticeTimer = null;

  function getSpeakText(msg) {
    const text = String(msg?.content || "").trim();
    return text;
  }

  function getVoiceTtsCredentials() {
    const providerId = labState.voiceTtsProviderId;
    if (!providerId) return null;
    const provider = labProviders.find((p) => p.id === providerId);
    if (!provider) return null;
    const profile = ensureProfile(providerId, provider);
    const baseUrl = normalizeBaseUrl(profile.baseUrl || provider.baseUrl || "");
    const apiKey = (profile.apiKey || "").split(",")[0].trim();
    if (!baseUrl || !apiKey) return null;
    if (!profile.enabledModels?.includes(labState.voiceTtsModelId)) return null;
    return { provider, profile, baseUrl, apiKey, providerId };
  }

  function resolveCurrentTtsAdapter() {
    const creds = getVoiceTtsCredentials();
    if (!creds || !window.NeuxLabTts) return "browser";
    return window.NeuxLabTts.resolveAdapter({
      provider: creds.provider,
      modelId: labState.voiceTtsModelId,
      baseUrl: creds.baseUrl
    });
  }

  function ensureVoiceTtsVoiceForAdapter(adapter, voices) {
    if (!adapter || !window.NeuxLabTts) return labState.voiceTtsVoice || "";
    if (!labState.voiceTtsVoicesByAdapter || typeof labState.voiceTtsVoicesByAdapter !== "object") {
      labState.voiceTtsVoicesByAdapter = {};
    }
    const list = Array.isArray(voices) ? voices : [];
    const ids = list.map((v) => v.id);
    if (!ids.length) return "";

    const remembered = labState.voiceTtsVoicesByAdapter[adapter];
    if (remembered && ids.includes(remembered)) {
      labState.voiceTtsVoice = remembered;
      return remembered;
    }
    if (labState.voiceTtsVoice && ids.includes(labState.voiceTtsVoice)) {
      labState.voiceTtsVoicesByAdapter[adapter] = labState.voiceTtsVoice;
      return labState.voiceTtsVoice;
    }
    const fallback = window.NeuxLabTts.defaultVoice(adapter, labState.voiceTtsModelId);
    labState.voiceTtsVoice = fallback;
    labState.voiceTtsVoicesByAdapter[adapter] = fallback;
    return fallback;
  }

  function rememberVoiceTtsVoice(adapter, voiceId) {
    if (!adapter || !voiceId) return;
    if (!labState.voiceTtsVoicesByAdapter || typeof labState.voiceTtsVoicesByAdapter !== "object") {
      labState.voiceTtsVoicesByAdapter = {};
    }
    labState.voiceTtsVoicesByAdapter[adapter] = voiceId;
    labState.voiceTtsVoice = voiceId;
  }

  function canUseProviderTtsApi() {
    const adapter = resolveCurrentTtsAdapter();
    return window.NeuxLabTts?.supportsApiAdapter(adapter) && Boolean(getVoiceTtsCredentials());
  }

  function isVoicePlaying() {
    if (labVoiceSynthesizing) return true;
    if (labVoiceSpeaking) return true;
    try {
      if (window.speechSynthesis?.speaking || window.speechSynthesis?.pending) return true;
    } catch {
      /* ignore */
    }
    if (labVoiceAudio && !labVoiceAudio.paused && !labVoiceAudio.ended) return true;
    return false;
  }

  function setVoiceNotice(message, type = "ok", { autoHideMs = 2800 } = {}) {
    const el = labEls.labVoiceModeNotice;
    if (!el) {
      if (message) setSessionNotice(message, type, { autoHideMs });
      return;
    }
    if (labVoiceNoticeTimer) {
      clearTimeout(labVoiceNoticeTimer);
      labVoiceNoticeTimer = null;
    }
    const full = String(message || "").trim();
    el.hidden = !full;
    el.dataset.type = type;
    el.textContent = full;
    if (full && autoHideMs > 0) {
      labVoiceNoticeTimer = setTimeout(() => setVoiceNotice(""), autoHideMs);
    }
  }

  function syncVoiceStopButtonUi() {
    const btn = labEls.labVoiceModeStop;
    if (!btn) return;
    const active = isVoicePlaying();
    btn.classList.toggle("is-speaking", active);
    btn.setAttribute("aria-pressed", String(active));
    btn.disabled = false;
    btn.title = active ? "点击停止当前语音" : "当前没有语音在播放";
  }

  function stopVoice({ silent = false, fromUser = false } = {}) {
    const wasActive = isVoicePlaying();
    labVoiceSpeaking = false;
    labVoiceSynthesizing = false;
    if (labVoiceTtsAbort) {
      try {
        labVoiceTtsAbort.abort();
      } catch {
        /* ignore */
      }
      labVoiceTtsAbort = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
    if (labVoiceAudio) {
      try {
        labVoiceAudio.pause();
        labVoiceAudio.currentTime = 0;
        labVoiceAudio.removeAttribute("src");
        labVoiceAudio.load();
      } catch {
        /* ignore */
      }
      labVoiceAudio = null;
    }
    if (labVoiceAudioUrl) {
      try {
        URL.revokeObjectURL(labVoiceAudioUrl);
      } catch {
        /* ignore */
      }
      labVoiceAudioUrl = null;
    }
    syncVoiceStopButtonUi();
    if (silent) return wasActive;
    if (fromUser) {
      if (wasActive) {
        setVoiceNotice("已停止语音播放", "ok");
        setSessionNotice("已停止语音播放", "ok", { autoHideMs: 2200 });
      } else {
        setVoiceNotice("当前没有正在播放的语音", "info", { autoHideMs: 2200 });
      }
    }
    return wasActive;
  }

  function speakViaBrowser(text) {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance === "undefined") {
      setSessionNotice("当前浏览器不支持语音朗读（TTS）", "error");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "zh-CN";
    labVoiceSpeaking = true;
    utter.onend = () => {
      labVoiceSpeaking = false;
      syncVoiceStopButtonUi();
    };
    utter.onerror = () => {
      labVoiceSpeaking = false;
      syncVoiceStopButtonUi();
    };
    window.speechSynthesis.speak(utter);
    syncVoiceStopButtonUi();
    setVoiceNotice("正在播放…", "info", { autoHideMs: 1600 });
  }

  async function playAudioBlob(blob) {
    labVoiceAudioUrl = URL.createObjectURL(blob);
    labVoiceAudio = new Audio(labVoiceAudioUrl);
    labVoiceSpeaking = true;
    labVoiceAudio.onended = () => {
      labVoiceSpeaking = false;
      syncVoiceStopButtonUi();
      setVoiceNotice("播放结束", "info", { autoHideMs: 1800 });
    };
    labVoiceAudio.onerror = () => {
      labVoiceSpeaking = false;
      syncVoiceStopButtonUi();
      setVoiceNotice("音频播放失败", "error");
      setSessionNotice("音频播放失败", "error");
    };
    syncVoiceStopButtonUi();
    setVoiceNotice("正在播放…", "info", { autoHideMs: 1600 });
    await labVoiceAudio.play();
  }

  async function speakText(text) {
    const t = String(text || "").trim();
    if (!t) return;
    stopVoice({ silent: true });
    const creds = getVoiceTtsCredentials();
    const adapter = resolveCurrentTtsAdapter();
    labState.voiceTtsAdapter = adapter;
    if (creds && window.NeuxLabTts?.supportsApiAdapter(adapter)) {
      labVoiceTtsAbort = new AbortController();
      labVoiceSynthesizing = true;
      syncVoiceStopButtonUi();
      setVoiceNotice("正在合成语音…", "info", { autoHideMs: 0 });
      try {
        let voices = window.NeuxLabTts.resolveVoices(adapter, labState.voiceTtsModelId);
        try {
          voices = await window.NeuxLabTts.fetchVoices(adapter, creds, labState.voiceTtsModelId);
        } catch {
          /* use static list */
        }
        if (!voices.length) voices = window.NeuxLabTts.resolveVoices(adapter, labState.voiceTtsModelId);
        const voiceId = ensureVoiceTtsVoiceForAdapter(adapter, voices);
        const blob = await window.NeuxLabTts.synthesizeBlob({
          adapter,
          creds,
          modelId: labState.voiceTtsModelId,
          text: t,
          voice: voiceId,
          stylePreset: labState.voiceTtsStylePreset,
          styleCustom: labState.voiceTtsStyleCustom,
          buildHeaders: () => apiHeaders({ apiKey: creds.apiKey, providerId: creds.providerId }),
          signal: labVoiceTtsAbort.signal
        });
        labVoiceSynthesizing = false;
        labVoiceTtsAbort = null;
        if (!blob) return;
        await playAudioBlob(blob);
        return;
      } catch (err) {
        labVoiceSynthesizing = false;
        labVoiceTtsAbort = null;
        syncVoiceStopButtonUi();
        if (err?.name === "AbortError" || /abort/i.test(String(err?.message || ""))) {
          setVoiceNotice("已取消语音合成", "info");
          return;
        }
        const label = window.NeuxLabTts?.getAdapterLabel(adapter) || adapter;
        setVoiceNotice(`${label} 合成失败，改用浏览器朗读`, "error");
        setSessionNotice(`${label} 合成失败：${err.message}，已改用浏览器朗读`, "error");
      }
    }
    speakViaBrowser(t);
  }

  function maybeSpeakAssistant(msg) {
    if (!isVoiceChatMode()) return;
    if (!labState.chatProviderId || !labState.chatModelId || isLikelyTtsModel(labState.chatModelId)) return;
    if (!msg || msg.role !== "assistant") return;
    if (msg.streaming) return;
    if (msg.lane) return; // 对战双栏先不朗读
    const text = getSpeakText(msg);
    if (!text) return;
    speakText(text);
  }

  const VOICE_PICKER_SLOTS = ["model", "voice", "style"];
  let voicePickerBound = false;

  function getVoicePickerEls(slot) {
    if (slot === "voice") {
      return {
        menu: labEls.labVoiceTtsVoiceMenu,
        trigger: labEls.labVoiceTtsVoiceTrigger,
        triggerText: labEls.labVoiceTtsVoiceTriggerText,
        panel: labEls.labVoiceTtsVoicePanel,
        list: labEls.labVoiceTtsVoiceList,
        select: labEls.labVoiceTtsVoice
      };
    }
    if (slot === "style") {
      return {
        menu: labEls.labVoiceTtsStyleMenu,
        trigger: labEls.labVoiceTtsStyleTrigger,
        triggerText: labEls.labVoiceTtsStyleTriggerText,
        panel: labEls.labVoiceTtsStylePanel,
        list: labEls.labVoiceTtsStyleList,
        select: labEls.labVoiceTtsStylePreset
      };
    }
    return {
      menu: labEls.labVoiceModelMenu,
      trigger: labEls.labVoiceModelTrigger,
      triggerText: labEls.labVoiceModelTriggerText,
      panel: labEls.labVoiceModelPanel,
      list: labEls.labVoiceModelList,
      select: labEls.labVoiceModeModel
    };
  }

  function closeVoicePicker(slot) {
    const { menu, panel, trigger } = getVoicePickerEls(slot);
    if (!panel) return;
    panel.hidden = true;
    menu?.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  function closeAllVoicePickers() {
    VOICE_PICKER_SLOTS.forEach((slot) => closeVoicePicker(slot));
  }

  function openVoicePicker(slot) {
    VOICE_PICKER_SLOTS.forEach((s) => {
      if (s !== slot) closeVoicePicker(s);
    });
    const { menu, panel, trigger } = getVoicePickerEls(slot);
    if (!panel || trigger?.disabled) return;
    panel.hidden = false;
    menu?.classList.add("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }

  function toggleVoicePicker(slot) {
    const { panel, trigger } = getVoicePickerEls(slot);
    if (!panel || trigger?.disabled) return;
    if (panel.hidden) openVoicePicker(slot);
    else closeVoicePicker(slot);
  }

  function renderVoicePickerFlat(slot, items, selectedId, { emptyLabel = "—" } = {}) {
    const { list, select, trigger, triggerText, panel } = getVoicePickerEls(slot);
    if (!list || !trigger || !triggerText) return;

    if (!items.length) {
      trigger.disabled = true;
      triggerText.textContent = emptyLabel;
      list.innerHTML = "";
      if (select) {
        select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>`;
        select.value = "";
      }
      closeVoicePicker(slot);
      return;
    }

    trigger.disabled = false;
    const selected = items.find((item) => item.id === selectedId) || items[0];
    triggerText.textContent = selected.label;
    if (select) {
      select.innerHTML = items
        .map(
          (item) =>
            `<option value="${escapeHtml(item.id)}"${item.id === selected.id ? " selected" : ""}>${escapeHtml(item.label)}</option>`
        )
        .join("");
      select.value = selected.id;
    }
    list.innerHTML = items
      .map(
        (item) => `
        <button
          type="button"
          class="lab-chat-model-option${item.id === selected.id ? " is-selected" : ""}"
          role="option"
          aria-selected="${item.id === selected.id}"
          data-voice-picker-value="${escapeHtml(item.id)}"
        >
          <span class="lab-chat-model-option-id">${escapeHtml(item.label)}</span>
        </button>
      `
      )
      .join("");
    if (panel && !panel.hidden) {
      /* keep open */
    }
  }

  function syncVoiceTtsStyleUi() {
    const styleInput = labEls.labVoiceTtsStyle;
    const isCustom = labState.voiceTtsStylePreset === "custom";
    if (styleInput) {
      styleInput.hidden = !isCustom;
      if (isCustom) styleInput.value = labState.voiceTtsStyleCustom || "";
    }
  }

  function populateTtsStylePresetSelect(adapterId) {
    if (!window.NeuxLabTts) return;
    const mode = window.NeuxLabTts.getStyleMode(adapterId);
    const presets = window.NeuxLabTts.getStylePresets();
    if (mode === "none") {
      renderVoicePickerFlat("style", [], "", { emptyLabel: "（不支持风格）" });
      return;
    }
    if (!presets.some((p) => p.id === labState.voiceTtsStylePreset)) {
      labState.voiceTtsStylePreset = "natural";
    }
    renderVoicePickerFlat(
      "style",
      presets.map((p) => ({ id: p.id, label: p.label })),
      labState.voiceTtsStylePreset
    );
    syncVoiceTtsStyleUi();
  }

  async function renderTtsVoiceControls() {
    const optsRow = labEls.labVoiceTtsOpts;
    if (!optsRow) return;
    const creds = getVoiceTtsCredentials();
    if (!creds || !window.NeuxLabTts) {
      optsRow.hidden = true;
      return;
    }
    const adapter = window.NeuxLabTts.resolveAdapter({
      provider: creds.provider,
      modelId: labState.voiceTtsModelId,
      baseUrl: creds.baseUrl
    });
    labState.voiceTtsAdapter = adapter;
    if (!window.NeuxLabTts.supportsApiAdapter(adapter)) {
      optsRow.hidden = true;
      return;
    }
    optsRow.hidden = false;
    let voices = await window.NeuxLabTts.fetchVoices(adapter, creds, labState.voiceTtsModelId);
    if (!voices.length) voices = window.NeuxLabTts.resolveVoices(adapter, labState.voiceTtsModelId);
    ensureVoiceTtsVoiceForAdapter(adapter, voices);
    renderVoicePickerFlat(
      "voice",
      voices.map((v) => ({ id: v.id, label: v.label })),
      labState.voiceTtsVoice
    );
    populateTtsStylePresetSelect(adapter);
    syncVoiceTtsStyleUi();
  }

  function renderVoiceModePanel() {
    const panel = labEls.labVoiceModePanel;
    const hint = labEls.labVoiceModeHint;
    if (!panel) return;
    const show = isVoiceChatMode();
    panel.hidden = !show;
    if (!show) {
      stopVoice({ silent: true });
      return;
    }
    syncVoiceStopButtonUi();
    ensureVoiceTtsSelection();
    const options = collectChatModelOptions({ ttsOnly: true });
    const selectedValue = encodeChatModelValue(labState.voiceTtsProviderId, labState.voiceTtsModelId);
    if (!options.length) {
      renderVoicePickerFlat("model", [], "", { emptyLabel: "请先启用 TTS 模型" });
      if (labEls.labVoiceTtsOpts) labEls.labVoiceTtsOpts.hidden = true;
      if (hint) hint.textContent = "没有可用 TTS 模型。请在左侧平台中启用名称包含 tts/speech 的模型。";
      return;
    }
    renderVoicePickerFlat(
      "model",
      options.map((opt) => ({ id: opt.value, label: opt.label })),
      selectedValue,
      { emptyLabel: "请先启用 TTS 模型" }
    );
    void renderTtsVoiceControls();
    if (hint) {
      const textLabel = labState.chatProviderId
        ? `${displayProviderName(labProviders.find((p) => p.id === labState.chatProviderId))} · ${labState.chatModelId}`
        : "未选择";
      const adapter = resolveCurrentTtsAdapter();
      const adapterLabel = window.NeuxLabTts?.getAdapterLabel(adapter) || adapter;
      if (canUseProviderTtsApi()) {
        hint.textContent = `文本模型：${textLabel}。TTS 协议：${adapterLabel}，已适配音色与风格，将调用平台 API 合成。`;
      } else {
        hint.textContent = `文本模型：${textLabel}。未识别 TTS 协议或缺少 Key，将使用浏览器朗读。`;
      }
    }
  }

  function onVoicePickerMenuClick(event) {
    const menu = event.target.closest("[data-voice-picker]");
    if (!menu) return;
    const slot = menu.dataset.voicePicker;
    const trigger = event.target.closest(".lab-voice-picker-trigger, .lab-chat-model-trigger");
    if (trigger && !trigger.disabled) {
      event.preventDefault();
      event.stopPropagation();
      toggleVoicePicker(slot);
      return;
    }
    const option = event.target.closest("[data-voice-picker-value]");
    if (!option) return;
    event.preventDefault();
    event.stopPropagation();
    const value = option.dataset.voicePickerValue;
    if (slot === "model") {
      const parsed = parseChatModelValue(value);
      if (parsed) applyVoiceTtsSelection(parsed);
      closeVoicePicker(slot);
      return;
    }
    if (slot === "voice") {
      rememberVoiceTtsVoice(labState.voiceTtsAdapter || resolveCurrentTtsAdapter(), value);
      saveLabState();
      renderTtsVoiceControls();
      closeVoicePicker(slot);
      return;
    }
    if (slot === "style") {
      labState.voiceTtsStylePreset = value || "natural";
      saveLabState();
      syncVoiceTtsStyleUi();
      renderVoicePickerFlat(
        "style",
        (window.NeuxLabTts?.getStylePresets() || []).map((p) => ({ id: p.id, label: p.label })),
        labState.voiceTtsStylePreset
      );
      closeVoicePicker(slot);
    }
  }

  function onVoicePickerDocumentClick(event) {
    if (!labEls.labPage || labEls.labPage.hidden) return;
    VOICE_PICKER_SLOTS.forEach((slot) => {
      const { panel, menu } = getVoicePickerEls(slot);
      if (!panel || panel.hidden) return;
      if (menu?.contains(event.target)) return;
      closeVoicePicker(slot);
    });
  }

  function bindVoicePickerEvents() {
    refreshLabEls();
    VOICE_PICKER_SLOTS.forEach((slot) => {
      const { menu } = getVoicePickerEls(slot);
      if (menu && !menu.dataset.neuxVoicePickerBound) {
        menu.dataset.neuxVoicePickerBound = "1";
        menu.addEventListener("click", onVoicePickerMenuClick);
      }
    });
    if (!voicePickerBound) {
      document.addEventListener("click", onVoicePickerDocumentClick);
      voicePickerBound = true;
    }
  }

  function persistVoiceTtsOptions() {
    if (labEls.labVoiceTtsVoice) labState.voiceTtsVoice = labEls.labVoiceTtsVoice.value || "";
    if (labEls.labVoiceTtsStylePreset) {
      labState.voiceTtsStylePreset = labEls.labVoiceTtsStylePreset.value || "natural";
    }
    if (labEls.labVoiceTtsStyle) {
      labState.voiceTtsStyleCustom = labEls.labVoiceTtsStyle.value.trim();
    }
    saveLabState();
    syncVoiceTtsStyleUi();
  }

  function syncSessionsPanelModeUi() {
    const mode = labState.sessionsPanelMode === "agent" ? "agent" : "chat";
    labState.sessionsPanelMode = mode;
    const isAgent = mode === "agent";
    const collapsed = !isAgent && labState.sessionsPanelCollapsed === true;
    const listHidden = collapsed && !isAgent;
    if (labEls.labSidebarModeChat) {
      labEls.labSidebarModeChat.classList.toggle("is-active", !isAgent);
      labEls.labSidebarModeChat.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
    if (labEls.labSidebarModeAgent) {
      labEls.labSidebarModeAgent.classList.toggle("is-active", isAgent);
      labEls.labSidebarModeAgent.setAttribute("aria-expanded", isAgent ? "true" : "false");
    }
    if (labEls.labSidebarChatMenu) labEls.labSidebarChatMenu.hidden = isAgent || collapsed;
    if (labEls.labSidebarChatListMenu) labEls.labSidebarChatListMenu.hidden = listHidden;
    if (labEls.labSidebarAgentMenu) labEls.labSidebarAgentMenu.hidden = !isAgent;
    if (labEls.labSessionsFoot) labEls.labSessionsFoot.hidden = listHidden;
    labEls.labChatSessions?.classList.toggle("is-panel-collapsed", listHidden);
    labEls.labChatLayout?.classList.toggle("is-agent-mode", isAgent);
    if (labEls.labAgentMySite) labEls.labAgentMySite.hidden = !isAgent;
    if (isAgent) {
      void refreshAgentSiteTree({ silent: true });
      startAgentSiteWatch();
    } else {
      stopAgentSiteWatch();
      labAgentState.sitePreviewOpen = false;
      if (labEls.labAgentSiteTree) labEls.labAgentSiteTree.innerHTML = "";
    }
    if (labEls.labChatToolbar) labEls.labChatToolbar.hidden = false;
    if (labEls.labChatModeSwitch) labEls.labChatModeSwitch.hidden = isAgent;
    if (labEls.labVoiceModePanel) labEls.labVoiceModePanel.hidden = isAgent || normalizeChatMode(labState.chatMode) !== "voice";
    if (isAgent && normalizeChatMode(labState.chatMode) !== "normal") {
      labState.chatMode = "normal";
      labState.voiceMode = false;
      if (!isVoiceMode()) stopVoice();
    }
    if (labEls.labChatInput) {
      labEls.labChatInput.placeholder = isAgent ? "输入项目需求，Agent 会创建文件并打开预览…" : "输入消息…";
    }
    if (!isAgent) agentPreviewBootstrapped = false;
    else if (!agentPreviewBootstrapped) {
      agentPreviewBootstrapped = true;
      void loadLatestAgentProject({ silent: true });
    }
    syncAgentPreviewUi();
    syncChatModeUi();
    renderSessionList();
    renderChatMessages();
  }

  function setSessionsPanelMode(mode, { silent = false } = {}) {
    const next = mode === "agent" ? "agent" : "chat";
    const prev = labState.sessionsPanelMode === "agent" ? "agent" : "chat";
    if (next !== prev) syncMessagesToSession();
    if (next === "agent") {
      if (isSessionSearchOpen()) toggleSessionSearch(false);
      closeAllSessionMenus();
      labState.sessionsPanelCollapsed = false;
    }
    labState.sessionsPanelMode = next;
    saveLabState();
    if (next !== prev) {
      labChatMessages = getActiveSessionMessages();
      setLabUsage("");
    }
    syncSessionsPanelModeUi();
    if (!silent) {
      setSessionNotice(next === "agent" ? "已切换到 Agent Mode（独立会话）" : "已切换到对话模式（独立会话）", "ok");
    }
  }

  function toggleSessionsPanelCollapse(collapsed) {
    const next = typeof collapsed === "boolean" ? collapsed : labState.sessionsPanelCollapsed !== true;
    if (next && isSessionSearchOpen()) toggleSessionSearch(false);
    if (next) closeAllSessionMenus();
    labState.sessionsPanelCollapsed = next;
    syncSessionsPanelModeUi();
    saveLabState();
  }

  function dispatchVoiceModeEvent() {
    try {
      document.querySelector("#lab")?.dispatchEvent(
        new CustomEvent("neux-lab-voice-change", { detail: { enabled: labState.voiceMode === true } })
      );
    } catch {
      /* ignore */
    }
  }

  function setVoiceMode(enabled, { silent = false } = {}) {
    const next = enabled === true;
    if (next) {
      setChatMode("voice", { silent });
      return;
    }
    if (normalizeChatMode(labState.chatMode) === "voice") {
      setChatMode("normal", { silent });
      return;
    }
    if (!silent) dispatchVoiceModeEvent();
  }

  function renderSessionList() {
    if (!labEls.labSessionList) return;
    closeAllSessionMenus();
    const mode = getStorageSessionModeKey();
    labEls.labSessionList.setAttribute(
      "aria-label",
      mode === SESSION_MODE_BATTLE ? "对战对话" : mode === SESSION_MODE_AGENT ? "Agent 任务" : "全部对话"
    );
    const entries = sortSessionEntries(sessionsForMode(mode));
    const q = labSessionSearchQuery.trim().toLowerCase();
    const filtered = q
      ? entries.filter(([id, chat]) => {
          const title = sessionTitle(chat).toLowerCase();
          const preview = sessionPreview(chat).toLowerCase();
          return title.includes(q) || preview.includes(q) || id.toLowerCase().includes(q);
        })
      : entries;
    if (!filtered.length) {
      labEls.labSessionList.innerHTML = `<li class="lab-chat-session-empty">${mode === SESSION_MODE_AGENT ? "无 Agent 任务，点击「新 Agent 任务」创建" : "无对话，点击「新聊天」创建"}</li>`;
      return;
    }
    const deleteLabel = mode === SESSION_MODE_AGENT ? "删除任务" : "删除对话";
    labEls.labSessionList.innerHTML = filtered
      .map(([id, chat]) => {
        const active = id === getActiveSessionId();
        const title = isGenericSessionTitle(chat.title) ? sessionTitle(chat) : chat.title;
        return `
          <li class="lab-chat-session-row" role="presentation">
            <div class="lab-chat-session-card${active ? " is-active" : ""}">
              <button
                type="button"
                class="lab-chat-session-item"
                data-session-id="${escapeHtml(id)}"
                role="option"
                aria-selected="${active}"
                title="${escapeHtml(title)}"
              >
                <span class="lab-chat-session-item-title">${escapeHtml(title)}</span>
              </button>
              <div class="lab-chat-session-menu">
                <button
                  type="button"
                  class="lab-chat-session-item-more"
                  data-session-menu="${escapeHtml(id)}"
                  aria-label="${escapeHtml(title)} 的更多操作"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  title="更多"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
                </button>
                <div class="lab-chat-session-menu-pop" role="menu" hidden>
                  <button type="button" role="menuitem" class="lab-chat-session-menu-danger" data-delete-session="${escapeHtml(id)}">${deleteLabel}</button>
                </div>
              </div>
            </div>
          </li>
        `;
      })
      .join("");
  }

  function renderSessionSelect() {
    renderSessionList();
  }

  function createNewSession() {
    closeAllSessionMenus();
    const mode = getStorageSessionModeKey();
    const id =
      mode === SESSION_MODE_BATTLE
        ? `s-battle-${Date.now()}`
        : mode === SESSION_MODE_AGENT
          ? `s-agent-${Date.now()}`
          : `s-${Date.now()}`;
    syncMessagesToSession();
    const now = Date.now();
    labSessionsState.chats[id] = {
      title: "",
      messages: [],
      createdAt: now,
      updatedAt: now,
      mode
    };
    setActiveSessionId(id);
    labChatMessages = [];
    saveLabSessionsState();
    renderSessionList();
    renderChatMessages();
    setSessionNotice(
      mode === SESSION_MODE_BATTLE
        ? "已新建对战"
        : mode === SESSION_MODE_AGENT
          ? "已新建 Agent 任务"
          : "已新建对话"
    );
  }

  function switchSession(sessionId) {
    const chat = labSessionsState.chats[sessionId];
    if (!chat || sessionId === getActiveSessionId()) return;
    if (normalizeSessionMode(chat.mode || SESSION_MODE_NORMAL) !== getStorageSessionModeKey()) return;
    closeAllSessionMenus();
    syncMessagesToSession();
    setActiveSessionId(sessionId);
    labChatMessages = getActiveSessionMessages();
    saveLabSessionsState();
    renderSessionList();
    renderChatMessages();
    setLabUsage("");
  }

  function deleteSession(sessionId) {
    const chat = labSessionsState.chats[sessionId];
    if (!chat) return;
    const title = sessionTitle(chat);
    const mode = getStorageSessionModeKey();
    if (normalizeSessionMode(chat.mode || SESSION_MODE_NORMAL) !== mode) return;

    closeAllSessionMenus();

    const modeSessionIds = Object.keys(labSessionsState.chats).filter(
      (id) => normalizeSessionMode(labSessionsState.chats[id]?.mode || SESSION_MODE_NORMAL) === mode
    );
    const wasActive = getActiveSessionId() === sessionId;
    if (wasActive) syncMessagesToSession();

    const orderedBefore = sortSessionEntries(
      modeSessionIds.map((id) => [id, labSessionsState.chats[id]])
    );
    const removedIdx = orderedBefore.findIndex(([id]) => id === sessionId);

    delete labSessionsState.chats[sessionId];
    const remainingIds = modeSessionIds.filter((id) => id !== sessionId);

    if (!remainingIds.length) {
      labSessionsState.activeIds[mode] = null;
      labChatMessages = [];
    } else if (wasActive) {
      const remaining = sortSessionEntries(
        remainingIds.map((id) => [id, labSessionsState.chats[id]])
      );
      const pickIdx = Math.min(Math.max(removedIdx, 0), remaining.length - 1);
      setActiveSessionId(remaining[pickIdx][0]);
      labChatMessages = getActiveSessionMessages();
    }

    saveLabSessionsState();
    renderSessionList();
    if (wasActive || !remainingIds.length) {
      renderChatMessages();
      setLabUsage("");
    }
    setSessionNotice(`已删除「${title}」`);
  }

  function deleteActiveSession() {
    deleteSession(getActiveSessionId());
  }

  function exportLabConfig(includeKeys = false) {
    flushActiveProfile();
    const payload = {
      version: 5,
      exportedAt: new Date().toISOString(),
      state: { ...labState }
    };
    if (!includeKeys) {
      Object.values(payload.state.profiles || {}).forEach((p) => {
        if (p.apiKey) p.apiKey = "";
      });
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `neux-lab-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setLabStatus(includeKeys ? "已导出（含密钥，请妥善保管）" : "已导出（不含密钥）", "ok");
  }

  function importLabConfig(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const imported = data.state || data;
        labState = migrateLabState({ ...labState, ...imported });
        mergeCustomProviders();
        detachProfileArrays(labState);
        labProviders.forEach((p) => repairProfileOnSwitch(p));
        runProfileStorageSanitize();
        pullActiveProfile();
        syncLabFormFromState();
        saveLabState();
        setLabStatus("配置已导入", "ok");
      } catch {
        setLabStatus("导入失败：文件格式无效", "error");
      }
    };
    reader.readAsText(file);
  }

  function clearAllLabData() {
    if (!window.confirm("将清除本机全部试验场配置、会话与密钥，且不可恢复。确定继续？")) return;
    localStorage.removeItem(LAB_STORAGE_KEY);
    localStorage.removeItem(LAB_SESSIONS_KEY);
    localStorage.removeItem("neux-lab-v3");
    localStorage.removeItem("neux-lab-v2");
    sessionStorage.removeItem("neux-lab-session");
    labState = defaultLabState();
    labSessionsState = defaultSessionsState();
    ensureActiveSessionForMode(getStorageSessionModeKey());
    labChatMessages = getActiveSessionMessages();
    saveLabState();
    saveLabSessionsState();
    location.reload();
  }

  function exportChatMarkdown() {
    if (!labChatMessages.length) {
      setSessionNotice("当前对话无消息可导出", "error");
      return;
    }
    const lines = [`# NEUX 试验场对话\n`, `> ${new Date().toLocaleString()}\n\n`];
    labChatMessages.forEach((msg) => {
      const who =
        msg.role === "user"
          ? "你"
          : msg.lane === "battle"
            ? `模型 B（${msg.meta || "对战"}）`
            : msg.lane === "primary"
              ? `模型 A（${msg.meta || "对战"}）`
              : "AI";
      lines.push(`## ${who}\n\n${msg.content || ""}\n\n`);
    });
    const blob = new Blob([lines.join("")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `neux-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
    setSessionNotice("对话已导出为 Markdown");
  }

  function renderMessageBody(msg) {
    const raw = msg.content || "";
    if (msg.role === "assistant" && msg.streaming) {
      if (!raw.trim()) return "";
      return escapeHtml(raw);
    }
    if (msg.role === "assistant" && !msg.streaming && window.NeuxLabMarkdown) {
      return window.NeuxLabMarkdown.render(raw);
    }
    return escapeHtml(raw);
  }

  const LAB_THINK_STEPS = [
    "正在理解你的问题…",
    "分析问题要点…",
    "检索相关知识…",
    "组织回答结构…",
    "生成回复中…"
  ];

  let labThinkStepTimer = null;
  let labThinkStepIndex = 0;
  let labAgentState = {
    previewUrl: "",
    title: "",
    path: "",
    workspaceId: "",
    workspaceFiles: [],
    files: [],
    logs: [],
    modelLabel: "",
    activeFile: "",
    activeFileContent: "",
    running: false,
    turn: 0,
    maxTurns: 24,
    currentTool: "",
    sitePreviewOpen: false
  };
  let agentPreviewBootstrapped = false;
  let arenaRenderTimer = null;
  let agentSiteProjects = [];
  let agentSiteExpanded = new Set();
  let agentSiteRefreshTimer = null;
  let agentSiteWatchSource = null;

  function isAgentPanelMode() {
    return labState.sessionsPanelMode === "agent";
  }

  const AGENT_ARENA_MAX_TURNS = 24;
  const AGENT_ARENA_TURN_RETRIES = 3;

  const AGENT_TOOL_LABELS = {
    model_codegen: "模型生成代码",
    create_folder: "创建文件夹",
    write_file: "写入文件",
    append_file: "追加写入",
    edit_file: "编辑文件",
    read_file: "读取文件",
    list_files: "列出文件",
    delete_file: "删除文件",
    open_preview: "打开预览",
    parse: "格式解析",
    think: "思考中"
  };

  const AGENT_ARENA_SYSTEM = `You are an autonomous coding agent (Arena / Cursor style).
Each turn: ONE tool call OR finish. Build incrementally across many turns.

## Response format (IMPORTANT — works with DeepSeek and similar models)

For list_files / read_file / finish — return compact JSON only:
{"thought":"why","title":"Project title","done":false,"tool":"list_files","path":""}

For write_file / append_file — NEVER put file body inside JSON strings.
Return JSON header + markdown code block:

{"thought":"create html skeleton","title":"My Shop","done":false,"tool":"write_file","path":"index.html"}

\`\`\`html
<!DOCTYPE html>
...full file content...
\`\`\`

For edit_file — JSON header + patch block:

{"thought":"fix button","done":false,"tool":"edit_file","path":"script.js"}

\`\`\`patch
---OLD---
exact old snippet
---NEW---
exact new snippet
\`\`\`

Rules:
- Implement EXACTLY what the user asked.
- Vanilla HTML/CSS/JS; must run from index.html.
- One tool per turn. Prefer write_file skeleton first, then styles.css / script.js, then edit_file fixes.
- For large files use append_file to add chunks instead of one giant write.
- delete_file removes a file when needed.
- For games / interactive demos: NEVER auto-start on page load. Must include visible UI:
  1) Start screen with a 「开始游戏」 button
  2) Pause + Stop (or 暂停/停止) buttons during play; pause freezes gameplay, stop returns to start screen
  3) Game over screen with score + 「重新开始」 button
  Use a gameState variable (idle | playing | paused | over).
- When finished: {"thought":"done","done":true,"tool":null}`;

  function inferAgentFileLang(filePath) {
    const ext = String(filePath || "").split(".").pop()?.toLowerCase() || "";
    const map = { html: "html", htm: "html", css: "css", js: "javascript", json: "json", md: "markdown" };
    return map[ext] || "text";
  }

  function scheduleArenaRender() {
    if (arenaRenderTimer) return;
    arenaRenderTimer = window.setTimeout(() => {
      arenaRenderTimer = null;
      renderChatMessages();
      syncAgentPreviewUi();
    }, 120);
  }

  function buildLineDiffHtml(oldText, newText) {
    const oldLines = String(oldText || "").split("\n");
    const newLines = String(newText || "").split("\n");
    const rows = [];
    const max = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < max; i += 1) {
      const o = oldLines[i];
      const n = newLines[i];
      if (o === n) {
        if (o != null) rows.push(`<div class="lab-agent-diff-line lab-agent-diff-line--same"><span>${escapeHtml(o)}</span></div>`);
      } else {
        if (o != null) rows.push(`<div class="lab-agent-diff-line lab-agent-diff-line--del"><span>- ${escapeHtml(o)}</span></div>`);
        if (n != null) rows.push(`<div class="lab-agent-diff-line lab-agent-diff-line--add"><span>+ ${escapeHtml(n)}</span></div>`);
      }
    }
    return rows.join("") || '<div class="lab-agent-diff-empty">无 diff</div>';
  }

  function buildArenaTraceStep(payload, toolMessage, { state = "done", streamPreview = "" } = {}) {
    const tool = payload.tool || null;
    const step = {
      id: "",
      kind: "tool",
      tool: tool || "think",
      title: tool ? agentToolLabel(tool) : "思考",
      thought: payload.thought || "",
      path: payload.path || "",
      detail: tool
        ? `${truncateAgentText(payload.thought, 80)}${payload.path ? ` → ${payload.path}` : ""}: ${truncateAgentText(toolMessage, 120)}`
        : truncateAgentText(payload.thought || streamPreview, 160),
      state,
      open: state === "running" || tool === "write_file" || tool === "append_file" || tool === "edit_file",
      streamPreview
    };
    if (tool === "write_file" || tool === "append_file") {
      step.codeBody = payload.content || "";
      step.codeLang = inferAgentFileLang(payload.path);
    }
    if (tool === "edit_file") {
      step.diffHtml = buildLineDiffHtml(payload.oldText, payload.newText);
      step.codeBody = payload.newText || "";
      step.codeLang = inferAgentFileLang(payload.path);
    }
    if (tool === "read_file" || tool === "list_files") {
      step.readOutput = toolMessage;
    }
    return step;
  }

  const ARENA_PARSE_RETRY_HINT =
    "Your last reply could not be parsed. For write_file/append_file use: small JSON header (no content field) + markdown code fence with file body. For edit_file use JSON + ```patch block with ---OLD--- / ---NEW---. Return ONLY the header and fence, no extra text.";

  function agentToolLabel(tool) {
    return AGENT_TOOL_LABELS[tool] || tool || "工具调用";
  }

  function truncateAgentText(text, max = 160) {
    const value = String(text || "").trim();
    if (value.length <= max) return value;
    return `${value.slice(0, max)}…`;
  }

  function isAgentAssistantMessage(msg) {
    return Boolean(msg?.agentTrace || String(msg?.meta || "").includes("Agent Mode"));
  }

  function initAgentTrace(prompt) {
    return {
      mode: "arena",
      status: "running",
      prompt: truncateAgentText(prompt, 240),
      plan: "",
      planNote: "",
      path: "",
      files: [],
      logs: [],
      title: "",
      workspaceFiles: [],
      steps: [
        {
          id: "receive",
          kind: "phase",
          title: "接收项目需求",
          detail: truncateAgentText(prompt, 120) || "已收到需求",
          state: "done"
        },
        {
          id: "plan",
          kind: "phase",
          title: "模型规划",
          detail: "正在调用模型分析需求并生成实现方案…",
          state: "running"
        }
      ]
    };
  }

  function updateAgentTraceStep(trace, id, patch) {
    if (!trace?.steps) return;
    const step = trace.steps.find((item) => item.id === id);
    if (step) Object.assign(step, patch);
    else trace.steps.push({ id, kind: "phase", title: id, detail: "", state: "pending", ...patch });
  }

  function pushAgentTraceStep(trace, step) {
    if (!trace?.steps) trace.steps = [];
    const existing = trace.steps.findIndex((item) => item.id === step.id);
    if (existing >= 0) trace.steps[existing] = { ...trace.steps[existing], ...step };
    else trace.steps.push(step);
  }

  function buildAgentTraceStepsFromResult(result, { plan = "", planNote = "" } = {}) {
    const steps = [
      {
        id: "receive",
        kind: "phase",
        title: "接收项目需求",
        detail: truncateAgentText(result.prompt || planNote || "项目需求", 120),
        state: "done"
      },
      {
        id: "plan",
        kind: "phase",
        title: "模型规划",
        detail: planNote || "规划完成",
        state: "done",
        planText: plan || result.plan || ""
      }
    ];
    if (result.path) {
      steps.push({
        id: "workspace",
        kind: "phase",
        title: "创建工作区",
        detail: result.path,
        state: "done"
      });
    }
    (result.logs || []).forEach((log, index) => {
      steps.push({
        id: `tool-${log.tool}-${index}`,
        kind: "tool",
        tool: log.tool,
        title: agentToolLabel(log.tool),
        detail: log.message || "",
        state: log.type === "ok" ? "done" : "error"
      });
    });
    const fileItems = (result.files || [])
      .filter((file) => file.type === "file")
      .map((file) => file.path || file.name || "")
      .filter(Boolean);
    if (fileItems.length) {
      steps.push({
        id: "files",
        kind: "files",
        title: "工作区文件",
        detail: `共 ${fileItems.length} 个文件`,
        state: "done",
        items: fileItems
      });
    }
    if (result.previewUrl) {
      steps.push({
        id: "preview",
        kind: "phase",
        title: "生成预览",
        detail: result.previewUrl,
        state: "done"
      });
    }
    return steps;
  }

  function buildAgentTraceFromResult(result, existing = null) {
    const plan = result.plan || existing?.plan || "";
    const planNote = existing?.planNote || (plan ? "模型规划完成" : "使用本地 Agent 规则执行");
    return {
      status: existing?.status === "error" ? "error" : "done",
      prompt: existing?.prompt || truncateAgentText(result.prompt, 240),
      plan,
      planNote,
      path: result.path || "",
      files: result.files || [],
      logs: result.logs || [],
      title: result.title || result.name || "",
      steps: buildAgentTraceStepsFromResult(result, { plan, planNote })
    };
  }

  function finalizeAgentTraceFromResult(trace, result, { plan = "", planNote = "" } = {}) {
    if (!trace) return;
    if (trace.mode === "arena") {
      trace.status = "done";
      trace.plan = plan || result.plan || trace.plan || "";
      trace.planNote = planNote || trace.planNote || "";
      trace.path = result.path || trace.path || "";
      trace.files = result.files || [];
      trace.logs = result.logs || trace.logs || [];
      trace.title = result.title || result.name || trace.title || "";
      updateAgentTraceStep(trace, "arena-loop", {
        state: "done",
        detail: `共 ${trace.logs.length} 次工具调用`
      });
      if (!trace.steps.some((s) => s.id === "preview")) {
        pushAgentTraceStep(trace, {
          id: "preview",
          kind: "phase",
          title: "生成预览",
          detail: result.previewUrl || "",
          state: "done"
        });
      }
      const fileItems = (trace.workspaceFiles || []).filter(Boolean);
      if (fileItems.length && !trace.steps.some((s) => s.id === "files")) {
        pushAgentTraceStep(trace, {
          id: "files",
          kind: "files",
          title: "工作区文件",
          detail: `共 ${fileItems.length} 个文件`,
          state: "done",
          items: fileItems
        });
      }
      return;
    }
    trace.status = "done";
    trace.plan = plan || result.plan || trace.plan || "";
    trace.planNote = planNote || trace.planNote || "";
    trace.path = result.path || "";
    trace.files = result.files || [];
    trace.logs = result.logs || [];
    trace.title = result.title || result.name || trace.title || "";
    trace.steps = buildAgentTraceStepsFromResult(
      { ...result, prompt: trace.prompt },
      { plan: trace.plan, planNote: trace.planNote }
    );
  }

  function normalizeArenaTool(tool) {
    const key = String(tool || "")
      .trim()
      .toLowerCase()
      .replace(/-/g, "_");
    const aliases = {
      writefile: "write_file",
      appendfile: "append_file",
      editfile: "edit_file",
      readfile: "read_file",
      listfiles: "list_files"
    };
    return aliases[key] || key;
  }

  function extractBalancedJson(text) {
    const start = text.indexOf("{");
    if (start < 0) return null;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = start; i < text.length; i += 1) {
      const ch = text[i];
      if (inString) {
        if (escape) escape = false;
        else if (ch === "\\") escape = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === "{") depth += 1;
      if (ch === "}") {
        depth -= 1;
        if (depth === 0) return text.slice(start, i + 1);
      }
    }
    return null;
  }

  function parseEditPatchBody(body) {
    const text = String(body || "").trim();
    if (!text) return { oldText: "", newText: "" };
    const patterns = [
      /---\s*OLD\s*---\r?\n([\s\S]*?)\r?\n---\s*NEW\s*---\r?\n([\s\S]*)/i,
      /<<<<<<<\s*OLD\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)(?:\r?\n>>>>>>>\s*NEW)?/i,
      /<<<<<<<\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)(?:\r?\n>>>>>>>)?/i,
      /\[\[OLD\]\]\r?\n([\s\S]*?)\r?\n\[\[NEW\]\]\r?\n([\s\S]*)/i
    ];
    for (const re of patterns) {
      const match = text.match(re);
      if (match) return { oldText: match[1], newText: match[2] };
    }
    return { oldText: "", newText: text };
  }

  function extractPatchBodyFromRaw(raw) {
    const idx = String(raw || "").search(/---\s*OLD\s*---|<<<<<<<|\[\[OLD\]\]/i);
    if (idx < 0) return null;
    return String(raw).slice(idx).trim();
  }

  function extractFenceBody(text, fromIndex = 0) {
    const slice = text.slice(fromIndex);
    const closed = slice.match(/```[\w.-]*\r?\n([\s\S]*?)```/);
    if (closed) return closed[1];
    const open = slice.match(/```[\w.-]*\r?\n([\s\S]+)$/);
    return open ? open[1] : null;
  }

  function extractRawFileBodyAfterJson(raw, jsonStr) {
    const jsonEnd = raw.indexOf(jsonStr) + jsonStr.length;
    const rest = raw.slice(jsonEnd).trim();
    if (!rest) return null;
    const fenced = extractFenceBody(rest, 0);
    if (fenced != null && fenced.trim()) return fenced;
    if (/^<!DOCTYPE/i.test(rest) || /^<html[\s>]/i.test(rest) || /^<canvas[\s>]/i.test(rest)) {
      return rest;
    }
    if (/^(\/\*|@|:root|body\s*\{|html\s*\{|\.\w|#\w)/m.test(rest)) return rest;
    if (/^(import |export |const |let |var |function |class |\/\/)/m.test(rest)) return rest;
    if (/---\s*OLD\s*---|<<<<<<<|\[\[OLD\]\]/i.test(rest)) return rest;
    return null;
  }

  function pickArenaMetaText(meta, keys) {
    for (const key of keys) {
      const value = meta?.[key];
      if (value != null && String(value).trim()) return String(value);
    }
    return "";
  }

  function buildArenaPayload(meta, body, raw = "") {
    const rawTool = meta?.tool;
    const tool =
      rawTool != null && String(rawTool).trim() && String(rawTool).toLowerCase() !== "null"
        ? normalizeArenaTool(rawTool)
        : null;
    let content = pickArenaMetaText(meta, ["content", "body", "file", "text"]);
    let oldText = pickArenaMetaText(meta, ["old_text", "oldText", "search", "find", "from"]);
    let newText = pickArenaMetaText(meta, ["new_text", "newText", "replace", "replacement", "to"]);

    if (body != null && body !== "") {
      if (tool === "write_file" || tool === "append_file") {
        content = body;
      } else if (tool === "edit_file") {
        const patch = parseEditPatchBody(body);
        oldText = patch.oldText || oldText;
        newText = patch.newText || newText;
      }
    } else if (tool === "edit_file") {
      const patchSource = extractPatchBodyFromRaw(raw) || extractFenceBody(raw, 0) || content;
      if (patchSource) {
        const patch = parseEditPatchBody(patchSource);
        oldText = patch.oldText || oldText;
        newText = patch.newText || newText;
      }
    } else if ((tool === "write_file" || tool === "append_file") && content.trim()) {
      // JSON header may include short content field; keep as fallback
    } else if ((tool === "write_file" || tool === "append_file") && raw) {
      const fenced = extractFenceBody(raw, 0);
      if (fenced != null && fenced.trim()) content = fenced;
    }

    if ((tool === "write_file" || tool === "append_file") && !content.trim() && raw) {
      const fenced = extractFenceBody(raw, 0);
      if (fenced != null && fenced.trim()) content = fenced;
    }

    return {
      thought: String(meta?.thought || "").trim(),
      title: String(meta?.title || "").trim(),
      done: Boolean(meta?.done),
      tool,
      path: String(meta?.path || "").trim().replace(/^\/+/, ""),
      content,
      oldText,
      newText
    };
  }

  function splitArenaHeaderAndBody(raw) {
    const jsonStr = extractBalancedJson(raw);
    if (!jsonStr) return null;
    let meta;
    try {
      meta = JSON.parse(jsonStr);
    } catch {
      return null;
    }
    const jsonEnd = raw.indexOf(jsonStr) + jsonStr.length;
    const rest = raw.slice(jsonEnd).trim();
    if (!rest) return { meta, body: null };
    const body = extractRawFileBodyAfterJson(raw, jsonStr);
    if (body == null) return { meta, body: null };
    return { meta, body };
  }

  function parseBrokenArenaJsonWithFence(raw) {
    const toolMatch = raw.match(/"tool"\s*:\s*"([^"]+)"/i);
    const pathMatch = raw.match(/"path"\s*:\s*"([^"]*)"/i);
    const thoughtMatch = raw.match(/"thought"\s*:\s*"((?:\\.|[^"\\])*)"/i);
    const titleMatch = raw.match(/"title"\s*:\s*"((?:\\.|[^"\\])*)"/i);
    const doneMatch = raw.match(/"done"\s*:\s*(true|false)/i);
    const fenceBody = extractFenceBody(raw, 0);
    if (!toolMatch && !doneMatch) return null;

    let thought = "";
    let title = "";
    try {
      if (thoughtMatch) thought = JSON.parse(`"${thoughtMatch[1]}"`);
      if (titleMatch) title = JSON.parse(`"${titleMatch[1]}"`);
    } catch {
      thought = thoughtMatch?.[1] || "";
      title = titleMatch?.[1] || "";
    }

    return buildArenaPayload(
      {
        thought,
        title,
        done: doneMatch ? doneMatch[1] === "true" : false,
        tool: toolMatch?.[1] || null,
        path: pathMatch?.[1] || ""
      },
      fenceBody,
      raw
    );
  }

  function parseArenaTurnResponse(text) {
    const raw = String(text || "").trim();
    if (!raw) throw new Error("模型未返回本步操作");

    const split = splitArenaHeaderAndBody(raw);
    if (split) {
      let body = split.body;
      const tool = normalizeArenaTool(split.meta?.tool);
      if (body == null && tool === "edit_file") {
        body = extractPatchBodyFromRaw(raw) || extractFenceBody(raw, 0);
      }
      if (body == null && (tool === "write_file" || tool === "append_file")) {
        body = extractFenceBody(raw, 0);
      }
      return buildArenaPayload(split.meta, body, raw);
    }

    const loose = parseBrokenArenaJsonWithFence(raw);
    if (loose) return loose;

    try {
      const data = parseJsonFromModel(raw);
      return buildArenaPayload(data, extractFenceBody(raw, 0), raw);
    } catch (err) {
      throw new Error(err.message || "无法解析模型返回");
    }
  }

  function parseJsonFromModel(text) {
    const raw = String(text || "").trim();
    try {
      return JSON.parse(raw);
    } catch {
      const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (fenced) return JSON.parse(fenced[1].trim());
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start < 0 || end <= start) throw new Error("模型返回不是有效 JSON");
      return JSON.parse(raw.slice(start, end + 1));
    }
  }

  function parseArenaTurnPayload(text) {
    return parseArenaTurnResponse(text);
  }

  async function fetchArenaTurnContent(messages, validated, signal) {
    const { baseUrl, apiKey, model, target } = validated;
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: apiHeaders({ apiKey, providerId: target.providerId }),
      signal,
      body: JSON.stringify({
        model,
        messages,
        temperature: Math.min(0.4, Number(labState.temperature ?? 0.4)),
        max_tokens: Math.min(8192, Math.max(4096, Number(labState.maxTokens || 8192))),
        stream: false
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    const content = data.choices?.[0]?.message?.content || "";
    if (!content.trim()) throw new Error("模型未返回本步操作");
    return content;
  }

  async function fetchArenaTurnStream(messages, validated, signal, onPartial) {
    const { baseUrl, apiKey, model, target } = validated;
    const useStream = labState.stream !== false;
    if (!useStream) {
      const content = await fetchArenaTurnContent(messages, validated, signal);
      onPartial?.(content);
      return content;
    }

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: apiHeaders({ apiKey, providerId: target.providerId }),
      signal,
      body: JSON.stringify({
        model,
        messages,
        temperature: Math.min(0.4, Number(labState.temperature ?? 0.4)),
        max_tokens: Math.min(8192, Math.max(4096, Number(labState.maxTokens || 8192))),
        stream: true
      })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    }
    const reader = res.body?.getReader();
    if (!reader) return fetchArenaTurnContent(messages, validated, signal);

    const decoder = new TextDecoder();
    let buffer = "";
    let content = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      buffer = parseSseChunk(buffer, (part) => {
        if (part.type === "content" && part.text) {
          content += part.text;
          onPartial?.(content);
        }
      });
    }
    if (!content.trim()) throw new Error("模型未返回本步操作");
    return content;
  }

  async function requestArenaAgentTurn(messages, validated, signal, trace, turnIndex) {
    const turnMessages = [...messages];
    let lastError = null;

    setRunningArenaStep(trace, turnIndex);
    syncAgentWorkbenchFromTrace(trace, { running: true, turn: turnIndex + 1 });
    scheduleArenaRender();

    for (let attempt = 0; attempt < AGENT_ARENA_TURN_RETRIES; attempt += 1) {
      if (attempt > 0) {
        turnMessages.push({ role: "user", content: ARENA_PARSE_RETRY_HINT });
      }
      let content = "";
      try {
        content = await fetchArenaTurnStream(turnMessages, validated, signal, (partial) => {
          updateAgentTraceStep(trace, `turn-${turnIndex}`, {
            state: "running",
            detail: truncateAgentText(partial, 220),
            streamPreview: partial
          });
          scheduleArenaRender();
        });
        return parseArenaTurnResponse(content);
      } catch (err) {
        lastError = err;
        if (content) turnMessages.push({ role: "assistant", content });
      }
    }

    throw new Error(lastError?.message || "模型返回格式无效");
  }

  function setRunningArenaStep(trace, turnIndex) {
    pushAgentTraceStep(trace, {
      ...buildArenaTraceStep({ tool: "think", thought: "", path: "" }, "模型正在思考并选择工具…", {
        state: "running"
      }),
      id: `turn-${turnIndex}`,
      title: `第 ${turnIndex + 1} 步`,
      detail: "模型正在思考并选择工具…"
    });
    updateAgentTraceStep(trace, "arena-loop", {
      state: "running",
      detail: `第 ${turnIndex + 1}/${AGENT_ARENA_MAX_TURNS} 步执行中…`
    });
  }

  function appendArenaTraceTurn(trace, turnIndex, payload, toolMessage) {
    pushAgentTraceStep(trace, {
      ...buildArenaTraceStep(payload, toolMessage, { state: "done" }),
      id: `turn-${turnIndex}`
    });
  }

  function syncAgentSandboxLayout() {
    if (labEls.labChatLayout) labEls.labChatLayout.classList.remove("has-agent-sandbox");
    if (labEls.labAgentWorkbench) {
      labEls.labAgentWorkbench.hidden = true;
      labEls.labAgentWorkbench.setAttribute("aria-hidden", "true");
    }
  }

  async function fetchAgentWorkspaceFile(workspaceId, filePath) {
    const res = await fetch(
      `/api/agent/session/file?workspaceId=${encodeURIComponent(workspaceId)}&path=${encodeURIComponent(filePath)}`
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data.file;
  }

  async function validateWorkspaceIndexHtml(workspaceId) {
    try {
      const file = await fetchAgentWorkspaceFile(workspaceId, "index.html");
      const text = String(file?.content || "");
      if (text.trim().length < 80) return { ok: false, reason: "文件过短或为空" };
      if (!/<\/html>/i.test(text)) return { ok: false, reason: "缺少 </html> 结束标签" };
      if (/<script\b/i.test(text) && !/<\/script>/i.test(text)) {
        return { ok: false, reason: "缺少 </script> 结束标签" };
      }
      return { ok: true };
    } catch {
      return { ok: false, reason: "无法读取 index.html" };
    }
  }

  const AGENT_HTML_REPAIR_HINT =
    "index.html 尚未写完（缺少 </html> 或 </script>）。请用 append_file 或 write_file 补全剩余代码，确保页面可独立运行。不要标记 done，直到文件完整。";

  async function agentDoneBlockedByIncompleteHtml(workspaceId) {
    const check = await validateWorkspaceIndexHtml(workspaceId);
    return check.ok ? null : check.reason || "页面未完成";
  }

  async function selectAgentWorkspaceFile(workspaceId, filePath, cachedContent = "") {
    if (!filePath) return;
    labAgentState.activeFile = filePath;
    try {
      if (cachedContent) labAgentState.activeFileContent = cachedContent;
      else {
        const file = await fetchAgentWorkspaceFile(workspaceId, filePath);
        labAgentState.activeFileContent = file.content;
      }
    } catch {
      labAgentState.activeFileContent = cachedContent || "(无法读取文件)";
    }
    syncAgentCodeView();
  }

  function syncAgentCodeView() {
    if (labEls.labAgentCodePath) {
      labEls.labAgentCodePath.textContent = labAgentState.activeFile || "选择文件查看";
    }
    if (labEls.labAgentCodeView) {
      labEls.labAgentCodeView.innerHTML = `<code>${escapeHtml(
        labAgentState.activeFileContent || "// 点击左侧文件查看内容"
      )}</code>`;
    }
  }

  function syncAgentWorkbenchFromTrace(trace, { running, turn, previewUrl, title, currentTool } = {}) {
    if (!trace) return;
    labAgentState.running = running ?? labAgentState.running;
    labAgentState.turn = turn ?? labAgentState.turn;
    labAgentState.maxTurns = AGENT_ARENA_MAX_TURNS;
    labAgentState.workspaceId = trace.workspaceId || labAgentState.workspaceId;
    labAgentState.path = trace.path || labAgentState.path;
    labAgentState.workspaceFiles = trace.workspaceFiles || labAgentState.workspaceFiles;
    labAgentState.logs = trace.logs || labAgentState.logs;
    labAgentState.title = title || trace.title || labAgentState.title;
    labAgentState.currentTool = currentTool ?? labAgentState.currentTool;
    if (trace.workspaceId) ensureAgentSiteExpanded(trace.workspaceId);
    if (previewUrl) {
      labAgentState.previewUrl = previewUrl.startsWith("http")
        ? previewUrl
        : new URL(previewUrl.startsWith("/") ? previewUrl : `/${previewUrl}`, location.origin).href;
    }
    labAgentState.files = (labAgentState.workspaceFiles || []).map((file) => ({
      type: "file",
      path: file,
      name: file
    }));
    syncAgentPreviewUi();
  }

  function refreshArenaLivePreview(assistantMsg, previewPath, title) {
    if (!previewPath) return;
    assistantMsg.previewTitle = title || assistantMsg.previewTitle || "生成中…";
    scheduleArenaRender();
  }

  async function runArenaAgentLoop(prompt, plan, validated, signal, assistantMsg) {
    const trace = assistantMsg.agentTrace;
    const sessionRes = await agentToolRequest("/api/agent/session/start", {
      prompt,
      plan,
      providerName: displayProviderName(validated.creds.provider),
      model: validated.model
    });
    const session = sessionRes.session;
    trace.path = session.path;
    trace.workspaceId = session.workspaceId;
    trace.workspaceFiles = session.files || [];
    trace.logs = [...(session.logs || [])];
    trace.title = session.title || trace.title;
    labAgentState.running = true;
    labAgentState.maxTurns = AGENT_ARENA_MAX_TURNS;
    syncAgentWorkbenchFromTrace(trace, {
      running: true,
      turn: 0,
      title: trace.title
    });

    pushAgentTraceStep(trace, {
      id: "workspace",
      kind: "phase",
      title: "创建工作区",
      detail: session.path,
      state: "done"
    });
    refreshArenaLivePreview(assistantMsg, null, trace.title);
    pushAgentTraceStep(trace, {
      id: "arena-loop",
      kind: "phase",
      title: "多轮执行",
      detail: "模型逐步调用工具编写与修改文件…",
      state: "running"
    });
    renderChatMessages();

    const messages = [
      { role: "system", content: AGENT_ARENA_SYSTEM },
      {
        role: "user",
        content: `User request:\n${prompt}\n\nImplementation plan:\n${plan || "(no plan)"}\n\nStart by listing files, then build incrementally.`
      }
    ];

    let projectTitle = session.title || "Agent 项目";
    let turnHintIndex = -1;

    for (let turn = 0; turn < AGENT_ARENA_MAX_TURNS; turn += 1) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");

      const fileList = trace.workspaceFiles.length ? trace.workspaceFiles.join(", ") : "(empty)";
      const turnHint = {
        role: "user",
        content:
          `Workspace files: ${fileList}\n` +
          `Turn ${turn + 1}/${AGENT_ARENA_MAX_TURNS}.\n` +
          `For write_file/append_file: JSON header without content + markdown code fence.\n` +
          `For edit_file: JSON header + \`\`\`patch block with ---OLD--- / ---NEW---.`
      };
      if (turnHintIndex >= 0) messages[turnHintIndex] = turnHint;
      else {
        messages.push(turnHint);
        turnHintIndex = messages.length - 1;
      }

      let payload;
      try {
        payload = await requestArenaAgentTurn(messages, validated, signal, trace, turn);
      } catch (parseErr) {
        appendArenaTraceStep(
          trace,
          turn,
          { tool: "parse", thought: "格式解析", path: "" },
          `解析失败（已跳过本步）：${parseErr.message}`
        );
        messages.push({
          role: "user",
          content: `Parse error: ${parseErr.message}. Resend using JSON header + markdown fence format.`
        });
        renderChatMessages();
        continue;
      }
      if (payload.title) projectTitle = payload.title;

      messages.push({
        role: "assistant",
        content: payload.content
          ? `[${payload.tool || "done"} ${payload.path || ""}]\n${truncateAgentText(payload.thought, 120)}`
          : JSON.stringify({
              thought: payload.thought,
              title: payload.title,
              done: payload.done,
              tool: payload.tool,
              path: payload.path
            })
      });

      let toolMessage = "";
      if (payload.done && !payload.tool) {
        const blockReason = await agentDoneBlockedByIncompleteHtml(session.workspaceId);
        if (blockReason) {
          toolMessage = `页面未完成（${blockReason}），继续生成…`;
          appendArenaTraceTurn(trace, turn, payload, toolMessage);
          messages.push({ role: "user", content: `${AGENT_HTML_REPAIR_HINT}\n\nProblem: ${blockReason}` });
          renderChatMessages();
          continue;
        }
        appendArenaTraceTurn(trace, turn, payload, "任务完成");
        renderChatMessages();
        break;
      }

      if (!payload.tool) {
        toolMessage = "本步无工具调用";
        appendArenaTraceTurn(trace, turn, payload, toolMessage);
        renderChatMessages();
        if (payload.done) break;
        continue;
      }

      if (
        (payload.tool === "write_file" || payload.tool === "append_file") &&
        !String(payload.content || "").trim()
      ) {
        toolMessage =
          "失败：文件内容为空。请按格式返回 JSON 头 + markdown 代码块（```html / ```css / ```javascript）包含完整文件正文。";
        trace.logs.push({ type: "error", tool: payload.tool, message: toolMessage });
        appendArenaTraceTurn(trace, turn, payload, toolMessage);
        messages.push({
          role: "user",
          content: `Tool result (${payload.tool}):\n${toolMessage}`
        });
        renderChatMessages();
        continue;
      }

      if (payload.tool === "edit_file" && !String(payload.oldText || "").trim()) {
        toolMessage =
          "失败：edit_file 缺少 ---OLD--- 片段。请用 JSON 头 + ```patch 代码块，内含 ---OLD--- 与 ---NEW--- 标记的旧/新文本。";
        trace.logs.push({ type: "error", tool: payload.tool, message: toolMessage });
        appendArenaTraceTurn(trace, turn, payload, toolMessage);
        messages.push({
          role: "user",
          content: `Tool result (${payload.tool}):\n${toolMessage}`
        });
        renderChatMessages();
        continue;
      }

      try {
        const toolRes = await agentToolRequest("/api/agent/session/tool", {
          workspaceId: session.workspaceId,
          tool: payload.tool,
          path: payload.path,
          content: payload.content,
          oldText: payload.oldText,
          newText: payload.newText
        });
        toolMessage = toolRes.message || "完成";
        trace.logs.push(toolRes.log);
        trace.workspaceFiles = toolRes.files || trace.workspaceFiles;
      } catch (toolError) {
        toolMessage = `失败：${toolError.message}`;
        trace.logs.push({ type: "error", tool: payload.tool, message: toolMessage });
      }
      appendArenaTraceTurn(trace, turn, payload, toolMessage);
      syncAgentWorkbenchFromTrace(trace, {
        running: true,
        turn: turn + 1,
        title: projectTitle,
        currentTool: payload.tool || ""
      });

      messages.push({
        role: "user",
        content: `Tool result (${payload.tool}):\n${toolMessage}`
      });

      renderChatMessages();
      setLabStatus(`Agent 第 ${turn + 1}/${AGENT_ARENA_MAX_TURNS} 步：${agentToolLabel(payload.tool)}`, "ok");

      if (payload.done) {
        const blockReason = await agentDoneBlockedByIncompleteHtml(session.workspaceId);
        if (blockReason) {
          messages.push({ role: "user", content: `${AGENT_HTML_REPAIR_HINT}\n\nProblem: ${blockReason}` });
          continue;
        }
        break;
      }
    }

    if (!trace.workspaceFiles.includes("index.html")) {
      throw new Error("多轮执行结束但缺少 index.html，请重试或增加步数");
    }

    const finalHtmlCheck = await validateWorkspaceIndexHtml(session.workspaceId);
    if (!finalHtmlCheck.ok) {
      throw new Error(`index.html 未完整生成（${finalHtmlCheck.reason}）。请重试或换更大上下文的模型。`);
    }

    updateAgentTraceStep(trace, "arena-loop", {
      state: "done",
      detail: `共 ${trace.logs.length} 次工具调用`
    });
    labAgentState.running = false;
    syncAgentWorkbenchFromTrace(trace, { running: false, title: projectTitle, previewUrl: session.previewUrl });

    const resultRes = await agentToolRequest("/api/agent/session/finish", {
      workspaceId: session.workspaceId,
      title: projectTitle,
      prompt,
      plan,
      logs: trace.logs,
      providerName: displayProviderName(validated.creds.provider),
      model: validated.model
    });

    return resultRes.result;
  }

  function renderAgentTraceStepIcon(step) {
    if (step.state === "running") {
      return `<span class="lab-agent-trace-step-icon lab-agent-trace-step-icon--spin" aria-hidden="true"></span>`;
    }
    if (step.state === "error") {
      return `<span class="lab-agent-trace-step-icon lab-agent-trace-step-icon--error" aria-hidden="true">×</span>`;
    }
    if (step.state === "done") {
      return `<span class="lab-agent-trace-step-icon lab-agent-trace-step-icon--done" aria-hidden="true">✓</span>`;
    }
    return `<span class="lab-agent-trace-step-icon" aria-hidden="true">○</span>`;
  }

  function renderAgentTraceStepBody(step) {
    const thoughtBlock = step.thought
      ? `<details class="lab-agent-trace-thought"${step.open ? " open" : ""}>
          <summary>思考</summary>
          <p>${escapeHtml(step.thought)}</p>
        </details>`
      : "";
    const streamBlock =
      step.state === "running" && step.streamPreview
        ? `<pre class="lab-agent-trace-stream">${escapeHtml(truncateAgentText(step.streamPreview, 1200))}</pre>`
        : "";
    const codeBlock =
      step.codeBody && step.tool !== "edit_file"
        ? `<details class="lab-agent-trace-code"${step.open ? " open" : ""}>
            <summary>${escapeHtml(step.path || "文件内容")}</summary>
            <pre><code>${escapeHtml(truncateAgentText(step.codeBody, 8000))}</code></pre>
          </details>`
        : "";
    const diffBlock = step.diffHtml
      ? `<details class="lab-agent-trace-diff"${step.open ? " open" : ""}>
          <summary>Diff · ${escapeHtml(step.path || "")}</summary>
          <div class="lab-agent-diff">${step.diffHtml}</div>
        </details>`
      : "";
    const readBlock = step.readOutput
      ? `<details class="lab-agent-trace-read"${step.open ? " open" : ""}>
          <summary>读取结果</summary>
          <pre><code>${escapeHtml(truncateAgentText(step.readOutput, 6000))}</code></pre>
        </details>`
      : "";
    return `${thoughtBlock}${streamBlock}${codeBlock}${diffBlock}${readBlock}`;
  }

  function renderAgentTracePanel(msg) {
    const trace = msg.agentTrace;
    if (!trace) return "";
    const statusLabel =
      trace.status === "running" ? "执行中" : trace.status === "error" ? "失败" : "已完成";
    const turnSteps = (trace.steps || []).filter((s) => String(s.id || "").startsWith("turn-"));
    const turnLabel =
      trace.status === "running"
        ? `<span class="lab-agent-trace-turns">${turnSteps.length} / ${AGENT_ARENA_MAX_TURNS}</span>`
        : "";
    const stepsHtml = (trace.steps || [])
      .map((step) => {
        const planBlock =
          step.planText && step.id === "plan"
            ? `<details class="lab-agent-trace-plan" open>
                <summary>查看规划全文</summary>
                <pre>${escapeHtml(step.planText)}</pre>
              </details>`
            : "";
        const filesBlock =
          step.kind === "files" && step.items?.length
            ? `<ul class="lab-agent-trace-files">${step.items
                .map(
                  (item) =>
                    `<li><span class="lab-agent-trace-file-icon" aria-hidden="true">◆</span><code>${escapeHtml(item)}</code></li>`
                )
                .join("")}</ul>`
            : "";
        const pathTag = step.path
          ? `<code class="lab-agent-trace-path-tag">${escapeHtml(step.path)}</code>`
          : "";
        return `
          <li class="lab-agent-trace-step lab-agent-trace-step--${escapeHtml(step.state || "pending")}" data-step-kind="${escapeHtml(step.kind || "phase")}" data-step-id="${escapeHtml(step.id || "")}">
            ${renderAgentTraceStepIcon(step)}
            <div class="lab-agent-trace-step-copy">
              <div class="lab-agent-trace-step-head">
                <strong>${escapeHtml(step.title || "")}</strong>
                ${step.tool ? `<span class="lab-agent-trace-tool-tag">${escapeHtml(agentToolLabel(step.tool))}</span>` : ""}
                ${pathTag}
              </div>
              ${step.detail ? `<p class="lab-agent-trace-step-detail">${escapeHtml(step.detail)}</p>` : ""}
              ${renderAgentTraceStepBody(step)}
              ${planBlock}
              ${filesBlock}
            </div>
          </li>
        `;
      })
      .join("");

    const workspaceMeta = trace.path
      ? `<p class="lab-agent-trace-meta"><span>工作区</span><code>${escapeHtml(trace.path)}</code></p>`
      : "";

    return `
      <section class="lab-agent-trace${msg.streaming ? " is-streaming" : ""}" aria-label="Arena Agent 执行过程" data-agent-trace>
        <header class="lab-agent-trace-head">
          <div>
            <strong>Arena Agent</strong>
            <span class="lab-agent-trace-status lab-agent-trace-status--${escapeHtml(trace.status || "done")}">${statusLabel}</span>
            ${turnLabel}
          </div>
          ${trace.title ? `<span class="lab-agent-trace-project">${escapeHtml(trace.title)}</span>` : ""}
        </header>
        ${workspaceMeta}
        <ol class="lab-agent-trace-steps">${stepsHtml || '<li class="lab-agent-trace-empty">等待执行…</li>'}</ol>
      </section>
    `;
  }

  function renderAgentToolLog(logs = []) {
    if (!logs.length) {
      return '<p class="lab-agent-empty">等待工具调用</p>';
    }
    return logs
      .map(
        (item, index) => `
          <p class="lab-agent-tool-line" data-type="${escapeHtml(item.type || "info")}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(item.tool || "tool")}</strong>
            <em>${escapeHtml(item.message || "")}</em>
          </p>
        `
      )
      .join("");
  }

  function renderAgentFileTree(files = [], activeFile = "") {
    if (!files.length) return '<p class="lab-agent-empty">暂无工作区文件</p>';
    return files
      .map((file) => {
        const name = file.name || String(file.path || "").split("/").pop() || "";
        const active = name === activeFile ? " is-active" : "";
        return `
          <button type="button" class="lab-agent-file-row${active}" data-agent-file="${escapeHtml(name)}" data-type="file">
            <span aria-hidden="true">◆</span>
            <strong>${escapeHtml(name)}</strong>
          </button>
        `;
      })
      .join("");
  }

  const AGENT_SITE_SKIP_FILES = new Set(["agent-manifest.json"]);

  function agentSiteFileIcon(name) {
    const ext = String(name || "").split(".").pop()?.toLowerCase() || "";
    if (ext === "html" || ext === "htm") {
      return `<span class="lab-agent-mysite-icon lab-agent-mysite-icon--html" aria-hidden="true">5</span>`;
    }
    if (ext === "css") {
      return `<span class="lab-agent-mysite-icon lab-agent-mysite-icon--css" aria-hidden="true">#</span>`;
    }
    if (ext === "js" || ext === "mjs") {
      return `<span class="lab-agent-mysite-icon lab-agent-mysite-icon--js" aria-hidden="true">JS</span>`;
    }
    return `<span class="lab-agent-mysite-icon" aria-hidden="true">◇</span>`;
  }

  function projectDisplayTitle(project) {
    if (!project) return "项目预览";
    const raw = String(project.title || project.name || "").trim();
    if (raw && raw !== project.name) return raw;
    return String(project.name || "project")
      .replace(/^(agent-|ui-|mini-game-|snake-game-|dino-run-)/i, "")
      .replace(/-mpx[a-z0-9]+$/i, "")
      .replace(/-/g, " ")
      .slice(0, 48);
  }

  function projectFilesForSiteTree(project) {
    const wsId = project.name;
    let paths = [];
    if (Array.isArray(project.workspaceFiles) && project.workspaceFiles.length) {
      paths = project.workspaceFiles.slice();
    } else if (Array.isArray(project.files)) {
      paths = project.files
        .filter((item) => item && item.type === "file")
        .map((item) => {
          const full = String(item.path || "");
          if (full.startsWith(`${wsId}/`)) return full.slice(wsId.length + 1);
          return full.split("/").pop() || full;
        });
    }
    return paths
      .map((p) => String(p || "").trim())
      .filter((p) => p && !AGENT_SITE_SKIP_FILES.has(p));
  }

  function ensureAgentSiteExpanded(workspaceId) {
    if (!workspaceId) return;
    agentSiteExpanded.add(workspaceId);
    if (labAgentState.workspaceId) agentSiteExpanded.add(labAgentState.workspaceId);
  }

  function renderAgentSiteTreeHtml(projects = agentSiteProjects) {
    if (!projects.length) {
      return '<p class="lab-agent-mysite-empty">暂无项目，发送需求后 Agent 会在此列出文件</p>';
    }
    return projects
      .map((project) => {
        const wsId = project.name;
        const files = projectFilesForSiteTree(project);
        const expanded = agentSiteExpanded.has(wsId);
        const isActiveWs = labAgentState.workspaceId === wsId;
        const folderActive = isActiveWs ? " is-active" : "";
        const filesHtml = files.length
          ? files
              .map((relPath) => {
                const name = relPath.split("/").pop() || relPath;
                const fileActive =
                  isActiveWs && labAgentState.activeFile === relPath ? " is-active" : "";
                return `
                  <button
                    type="button"
                    class="lab-agent-mysite-file${fileActive}"
                    role="treeitem"
                    data-agent-site-file="${escapeHtml(relPath)}"
                    data-agent-site-workspace="${escapeHtml(wsId)}"
                  >
                    ${agentSiteFileIcon(name)}
                    <span>${escapeHtml(name)}</span>
                  </button>
                `;
              })
              .join("")
          : '<p class="lab-agent-mysite-empty lab-agent-mysite-empty--nested">生成中…</p>';
        const previewAttr = project.previewUrl
          ? ` data-agent-site-preview="${escapeHtml(project.previewUrl)}"`
          : "";
        const previewActive =
          isActiveWs && labAgentState.sitePreviewOpen ? " is-active" : "";
        const actionBtns = `
          <div class="lab-agent-mysite-actions" role="group" aria-label="${escapeHtml(projectDisplayTitle(project))} 操作">
            <button type="button" class="lab-agent-mysite-action${previewActive}" data-agent-site-action="preview" data-agent-site-workspace="${escapeHtml(wsId)}" title="预览" aria-label="预览">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>
            </button>
            <button type="button" class="lab-agent-mysite-action" data-agent-site-action="code" data-agent-site-workspace="${escapeHtml(wsId)}" title="浏览代码" aria-label="浏览代码">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L14 6l6 6-6 6-1.4-1.4z"/></svg>
            </button>
            <button type="button" class="lab-agent-mysite-action" data-agent-site-action="download" data-agent-site-workspace="${escapeHtml(wsId)}" title="下载项目" aria-label="下载项目">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            </button>
            <button type="button" class="lab-agent-mysite-action lab-agent-mysite-action--danger" data-agent-site-action="delete" data-agent-site-workspace="${escapeHtml(wsId)}" title="删除项目" aria-label="删除项目">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        `;
        return `
          <div class="lab-agent-mysite-project${expanded ? " is-expanded" : ""}" role="none">
            <div class="lab-agent-mysite-folder-row">
              <button
                type="button"
                class="lab-agent-mysite-folder${folderActive}"
                role="treeitem"
                aria-expanded="${expanded ? "true" : "false"}"
                data-agent-site-workspace="${escapeHtml(wsId)}"
                data-agent-site-title="${escapeHtml(projectDisplayTitle(project))}"
                ${previewAttr}
              >
                <svg class="lab-agent-mysite-chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8.12 9.29 12 13.17l3.88-3.88a1 1 0 1 1 1.42 1.42l-4.59 4.59a1 1 0 0 1-1.42 0L6.7 10.71a1 1 0 0 1 1.42-1.42z"/></svg>
                <span class="lab-agent-mysite-folder-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M4 6.75A1.75 1.75 0 0 1 5.75 5h4.6l1.4 1.4h9.5A1.75 1.75 0 0 1 21.5 8.15V17.5A1.75 1.75 0 0 1 19.75 19.25H5.75A1.75 1.75 0 0 1 4 17.5V6.75Z"/></svg></span>
                <span class="lab-agent-mysite-folder-label">${escapeHtml(projectDisplayTitle(project))}</span>
              </button>
              ${actionBtns}
            </div>
            <div class="lab-agent-mysite-files" role="group">${filesHtml}</div>
          </div>
        `;
      })
      .join("");
  }

  function paintAgentSiteTree() {
    if (!labEls.labAgentSiteTree) return;
    labEls.labAgentSiteTree.innerHTML = renderAgentSiteTreeHtml();
  }

  function applyAgentSiteProjects(projects) {
    agentSiteProjects = projects || [];
    if (!agentSiteExpanded.size && agentSiteProjects[0]?.name) {
      agentSiteExpanded.add(agentSiteProjects[0].name);
    }
    const wsId = labAgentState.workspaceId;
    if (wsId) {
      const project = agentSiteProjects.find((p) => p.name === wsId);
      if (project) {
        labAgentState.workspaceFiles = projectFilesForSiteTree(project);
        labAgentState.files = labAgentState.workspaceFiles.map((rel) => ({
          type: "file",
          path: rel,
          name: rel.split("/").pop() || rel
        }));
      }
    }
    paintAgentSiteTree();
  }

  function syncAgentSiteCodeFromWorkspaceFiles(workspaceId, files, changedPath = "") {
    if (agentSiteCodeState.workspaceId !== workspaceId || !labEls.labAgentSiteCodeDialog?.open) return;
    const prevActive = agentSiteCodeState.activeFile;
    for (const key of Object.keys(agentSiteCodeState.files)) {
      if (!files.includes(key)) delete agentSiteCodeState.files[key];
    }
    for (const rel of files) {
      if (!(rel in agentSiteCodeState.files)) agentSiteCodeState.files[rel] = "";
    }
    paintAgentSiteCodeFiles();
    const toRefresh =
      changedPath && files.includes(changedPath)
        ? changedPath
        : prevActive && files.includes(prevActive)
          ? prevActive
          : "";
    if (!toRefresh) return;
    void fetchAgentWorkspaceFile(workspaceId, toRefresh)
      .then((file) => {
        agentSiteCodeState.files[toRefresh] = file.content;
        showAgentSiteCodeFile(toRefresh);
      })
      .catch(() => {});
  }

  function mergeAgentSiteWorkspaceUpdate(workspaceId, files, changedPath = "") {
    let project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (!project) {
      void refreshAgentSiteTree({ silent: true });
      return;
    }
    project.workspaceFiles = files.slice();
    const agentRunning = labAgentState.running;
    if (labAgentState.workspaceId === workspaceId) {
      labAgentState.workspaceFiles = files.slice();
      labAgentState.files = files.map((rel) => ({
        type: "file",
        path: rel,
        name: rel.split("/").pop() || rel
      }));
      if (
        (labAgentState.sitePreviewOpen || !agentRunning) &&
        (!changedPath || changedPath === "index.html" || /\.html?$/i.test(changedPath)) &&
        files.some((file) => /\.html?$/i.test(file))
      ) {
        const htmlFile =
          changedPath && /\.html?$/i.test(changedPath)
            ? changedPath
            : files.includes("index.html")
              ? "index.html"
              : files.find((file) => /\.html?$/i.test(file)) || "";
        const nextPreview = agentProjectPreviewUrl(project, htmlFile);
        if (nextPreview) {
          labAgentState.previewUrl = nextPreview;
          labAgentState.previewRevision = Date.now();
          syncEmbedBrowserUi({ forceShow: true });
        }
      }
    }
    paintAgentSiteTree();
    if (
      !agentRunning &&
      changedPath &&
      labAgentState.workspaceId === workspaceId &&
      labAgentState.activeFile === changedPath
    ) {
      void selectAgentSiteFile(workspaceId, changedPath);
    }
    if (!agentRunning) syncAgentSiteCodeFromWorkspaceFiles(workspaceId, files, changedPath);
  }

  function handleAgentSiteWatchMessage(event) {
    if (!isAgentPanelMode()) return;
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === "projects") {
        applyAgentSiteProjects(payload.projects);
      } else if (payload.type === "workspace" && payload.workspaceId) {
        mergeAgentSiteWorkspaceUpdate(payload.workspaceId, payload.files || [], payload.changedPath || "");
      }
    } catch {
      // ignore malformed SSE payloads
    }
  }

  function stopAgentSiteWatch() {
    if (!agentSiteWatchSource) return;
    agentSiteWatchSource.close();
    agentSiteWatchSource = null;
  }

  function startAgentSiteWatch() {
    if (!isAgentPanelMode() || typeof EventSource === "undefined") return;
    stopAgentSiteWatch();
    const source = new EventSource("/api/agent/projects/watch");
    agentSiteWatchSource = source;
    source.onmessage = handleAgentSiteWatchMessage;
    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) agentSiteWatchSource = null;
    };
  }

  async function refreshAgentSiteTree({ silent = false } = {}) {
    if (!isAgentPanelMode()) return agentSiteProjects;
    try {
      const payload = await agentToolRequest("/api/agent/projects");
      agentSiteProjects = payload.projects || [];
      if (!agentSiteExpanded.size && agentSiteProjects[0]?.name) {
        agentSiteExpanded.add(agentSiteProjects[0].name);
      }
      paintAgentSiteTree();
      return agentSiteProjects;
    } catch (error) {
      if (!silent && labEls.labAgentSiteTree) {
        labEls.labAgentSiteTree.innerHTML = `<p class="lab-agent-mysite-empty">加载失败：${escapeHtml(error.message)}</p>`;
      }
      return [];
    }
  }

  function scheduleAgentSiteRefresh() {
    if (agentSiteWatchSource && agentSiteWatchSource.readyState === EventSource.OPEN) return;
    clearTimeout(agentSiteRefreshTimer);
    agentSiteRefreshTimer = setTimeout(() => {
      void refreshAgentSiteTree({ silent: true });
    }, 400);
  }

  function openAgentSiteProject(project, { focusPreview = true, expandFolder = false } = {}) {
    if (!project?.name) return;
    labAgentState.workspaceId = project.name;
    labAgentState.path = project.path || `agent-workspaces/${project.name}`;
    labAgentState.title = project.title || projectDisplayTitle(project);
    labAgentState.workspaceFiles = projectFilesForSiteTree(project);
    labAgentState.files = labAgentState.workspaceFiles.map((rel) => ({
      type: "file",
      path: rel,
      name: rel.split("/").pop() || rel
    }));
    if (expandFolder) agentSiteExpanded.add(project.name);
    const previewUrl = agentProjectPreviewUrl(project);
    if (previewUrl) {
      labAgentState.previewUrl = previewUrl;
      labAgentState.previewRevision = Date.now();
    }
    paintAgentSiteTree();
    if (focusPreview) {
      openAgentSitePreview(project);
    } else if (labAgentState.sitePreviewOpen) {
      syncEmbedBrowserUi({ forceShow: true });
    }
  }

  async function selectAgentSiteFile(workspaceId, filePath) {
    if (!workspaceId || !filePath) return;
    const project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (project) {
      agentSiteExpanded.add(workspaceId);
      openAgentSiteProject(project, { focusPreview: false });
    }
    labAgentState.activeFile = filePath;
    const baseName = filePath.split("/").pop() || filePath;
    if (/\.html?$/i.test(baseName) && project) {
      openAgentSitePreview(project, { preferredFile: filePath, scrollIntoView: false });
      return;
    }
    try {
      const file = await fetchAgentWorkspaceFile(workspaceId, filePath);
      labAgentState.activeFileContent = file.content;
      if (labEls.labAgentSitePeek) {
        const preview = file.content.length > 420 ? `${file.content.slice(0, 420)}…` : file.content;
        labEls.labAgentSitePeek.hidden = false;
        labEls.labAgentSitePeek.textContent = preview;
      }
      paintAgentSiteTree();
      setLabStatus(`已加载 ${baseName}`, "ok");
    } catch (error) {
      setLabStatus(`读取文件失败：${error.message}`, "error");
    }
  }

  let agentSiteCodeState = { workspaceId: "", title: "", files: {}, activeFile: "" };

  function agentProjectPreviewUrl(project, preferredFile = "") {
    if (!project?.name) return "";
    const files = projectFilesForSiteTree(project);
    const pickFile = (name) => {
      if (!name || !files.includes(name)) return "";
      const segments = name.split("/").filter(Boolean).map((part) => encodeURIComponent(part));
      return new URL(
        `/agent-workspaces/${encodeURIComponent(project.name)}/${segments.join("/")}`,
        location.origin
      ).href;
    };
    if (preferredFile) {
      const picked = pickFile(preferredFile);
      if (picked) return picked;
    }
    if (files.includes("index.html")) {
      if (project.previewUrl) {
        const raw = String(project.previewUrl);
        return new URL(raw.startsWith("/") ? raw : `/${raw}`, location.origin).href;
      }
      return pickFile("index.html");
    }
    const htmlFile = files.find((file) => /\.html?$/i.test(file));
    return htmlFile ? pickFile(htmlFile) : "";
  }

  function agentSitePreviewPlaceholderText(project) {
    const files = project ? projectFilesForSiteTree(project) : [];
    if (!project?.name) return "发送项目需求，生成的网站将在此处全屏预览";
    if (labAgentState.running) return "Agent 正在生成，完成后将自动在此处预览…";
    if (!files.length) return "项目尚无文件，发送需求后开始生成…";
    if (!files.some((file) => /\.html?$/i.test(file))) return "尚未生成 HTML 页面，请等待 Agent 写入 index.html…";
    return "页面已就绪，正在加载预览…";
  }

  function resolveAgentPreviewUrl() {
    const project = agentSiteProjects.find((p) => p.name === labAgentState.workspaceId);
    const preferredFile =
      labAgentState.activeFile && /\.html?$/i.test(labAgentState.activeFile)
        ? labAgentState.activeFile
        : "";
    return labAgentState.previewUrl || (project ? agentProjectPreviewUrl(project, preferredFile) : "");
  }

  function syncEmbedBrowserUi({ forceShow = false } = {}) {
    const agent = isAgentPanelMode();
    const project = agentSiteProjects.find((p) => p.name === labAgentState.workspaceId);
    const previewUrl = resolveAgentPreviewUrl();
    if (forceShow && previewUrl) labAgentState.sitePreviewOpen = true;
    const show = agent && (forceShow || labAgentState.sitePreviewOpen);
    const fullscreenPreview = show && Boolean(previewUrl);

    labEls.labChatLayout?.classList.toggle("has-agent-preview", fullscreenPreview);

    if (!show) {
      if (labEls.labEmbedBrowser) labEls.labEmbedBrowser.hidden = true;
      if (labEls.labEmbedBrowserPlaceholder) labEls.labEmbedBrowserPlaceholder.hidden = false;
      if (labEls.labEmbedBrowserFrame) {
        labEls.labEmbedBrowserFrame.hidden = true;
        labEls.labEmbedBrowserFrame.removeAttribute("src");
      }
      if (labEls.labEmbedBrowserRefresh) labEls.labEmbedBrowserRefresh.disabled = true;
      if (labEls.labEmbedBrowserExternal) labEls.labEmbedBrowserExternal.hidden = true;
      labEls.labEmbedBrowser?.classList.remove("has-preview");
      return;
    }

    if (previewUrl) labAgentState.previewUrl = previewUrl;
    if (labEls.labEmbedBrowser) labEls.labEmbedBrowser.hidden = false;
    if (labEls.labEmbedBrowserTitle) {
      labEls.labEmbedBrowserTitle.textContent =
        labAgentState.title || (project ? projectDisplayTitle(project) : "") || "Agent 项目预览";
    }

    if (!previewUrl) {
      labEls.labEmbedBrowser?.classList.remove("has-preview");
      if (labEls.labEmbedBrowserPlaceholder) {
        labEls.labEmbedBrowserPlaceholder.hidden = false;
        const hint = labEls.labEmbedBrowserPlaceholder.querySelector("p");
        if (hint) hint.textContent = agentSitePreviewPlaceholderText(project);
      }
      if (labEls.labEmbedBrowserFrame) {
        labEls.labEmbedBrowserFrame.hidden = true;
        labEls.labEmbedBrowserFrame.removeAttribute("src");
      }
      if (labEls.labEmbedBrowserRefresh) labEls.labEmbedBrowserRefresh.disabled = true;
      if (labEls.labEmbedBrowserExternal) labEls.labEmbedBrowserExternal.hidden = true;
      if (labEls.labEmbedBrowserUrl) labEls.labEmbedBrowserUrl.textContent = "等待生成 HTML 页面…";
      return;
    }

    labEls.labEmbedBrowser?.classList.add("has-preview");
    if (labEls.labEmbedBrowserUrl) labEls.labEmbedBrowserUrl.textContent = previewUrl;
    if (labEls.labEmbedBrowserExternal) {
      labEls.labEmbedBrowserExternal.href = previewUrl;
      labEls.labEmbedBrowserExternal.hidden = false;
    }
    if (labEls.labEmbedBrowserRefresh) labEls.labEmbedBrowserRefresh.disabled = false;
    syncEmbedBrowserFrame(labEls.labEmbedBrowserFrame, previewUrl);
    if (labEls.labEmbedBrowserPlaceholder) labEls.labEmbedBrowserPlaceholder.hidden = true;
  }

  function openAgentSitePreview(project, { preferredFile = "", scrollIntoView = false } = {}) {
    if (!project?.name) return false;
    labAgentState.sitePreviewOpen = true;
    labAgentState.workspaceId = project.name;
    labAgentState.title = project.title || projectDisplayTitle(project);
    const previewUrl = agentProjectPreviewUrl(project, preferredFile);
    if (previewUrl) {
      labAgentState.previewUrl = previewUrl;
      labAgentState.previewRevision = Date.now();
    }
    syncEmbedBrowserUi({ forceShow: true });
    paintAgentSiteTree();
    if (previewUrl) {
      setLabStatus(`已打开预览：${projectDisplayTitle(project)}`, "ok");
      return true;
    }
    setLabStatus(agentSitePreviewPlaceholderText(project), "pending");
    return false;
  }

  function closeAgentSitePreview() {
    labAgentState.sitePreviewOpen = false;
    syncEmbedBrowserUi();
    paintAgentSiteTree();
  }

  async function fetchAgentProjectFileContent(workspaceId, relPath) {
    try {
      const file = await fetchAgentWorkspaceFile(workspaceId, relPath);
      return file.content;
    } catch {
      const segments = String(relPath || "")
        .split("/")
        .filter(Boolean)
        .map((part) => encodeURIComponent(part));
      const url = `/agent-workspaces/${encodeURIComponent(workspaceId)}/${segments.join("/")}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`无法读取 ${relPath}`);
      return await res.text();
    }
  }

  async function loadAgentProjectBundle(workspaceId) {
    try {
      const res = await fetch(
        `/api/agent/project/bundle?workspaceId=${encodeURIComponent(workspaceId)}`
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.bundle) return data.bundle;
      if (res.status !== 404 && data.error !== "Unknown Agent API") {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
    } catch (error) {
      if (error.message && !/Unknown Agent API|HTTP 404/i.test(error.message)) throw error;
    }
    const project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (!project) throw new Error("找不到项目");
    const paths = projectFilesForSiteTree(project);
    if (!paths.length) throw new Error("项目没有可下载的文件");
    const files = {};
    for (const rel of paths) {
      files[rel] = await fetchAgentProjectFileContent(workspaceId, rel);
    }
    return {
      workspaceId,
      title: projectDisplayTitle(project),
      files
    };
  }

  async function importJsZip() {
    const sources = [
      "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm",
      "https://esm.sh/jszip@3.10.1"
    ];
    let lastError;
    for (const src of sources) {
      try {
        const mod = await import(src);
        return mod.default || mod.JSZip || mod;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("无法加载 ZIP 打包库");
  }

  function paintAgentSiteCodeFiles() {
    if (!labEls.labAgentSiteCodeFiles) return;
    const paths = Object.keys(agentSiteCodeState.files).sort();
    if (!paths.length) {
      labEls.labAgentSiteCodeFiles.innerHTML = '<p class="lab-agent-mysite-empty">暂无文件</p>';
      return;
    }
    labEls.labAgentSiteCodeFiles.innerHTML = paths
      .map((relPath) => {
        const name = relPath.split("/").pop() || relPath;
        const active = relPath === agentSiteCodeState.activeFile ? " is-active" : "";
        return `
          <button type="button" class="lab-agent-mysite-code-file${active}" data-agent-code-file="${escapeHtml(relPath)}">
            ${agentSiteFileIcon(name)}
            <span>${escapeHtml(name)}</span>
          </button>
        `;
      })
      .join("");
  }

  function showAgentSiteCodeFile(relPath) {
    if (!relPath || !agentSiteCodeState.files[relPath]) return;
    agentSiteCodeState.activeFile = relPath;
    if (labEls.labAgentSiteCodePath) labEls.labAgentSiteCodePath.textContent = relPath;
    if (labEls.labAgentSiteCodeView) {
      labEls.labAgentSiteCodeView.innerHTML = `<code>${escapeHtml(agentSiteCodeState.files[relPath])}</code>`;
    }
    paintAgentSiteCodeFiles();
  }

  async function openAgentSiteCodeBrowser(workspaceId) {
    const project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (!project || !labEls.labAgentSiteCodeDialog) return;
    try {
      setLabStatus("正在加载项目代码…", "pending");
      const bundle = await loadAgentProjectBundle(workspaceId);
      agentSiteCodeState = {
        workspaceId,
        title: bundle.title || projectDisplayTitle(project),
        files: bundle.files || {},
        activeFile: ""
      };
      if (labEls.labAgentSiteCodeTitle) {
        labEls.labAgentSiteCodeTitle.textContent = agentSiteCodeState.title;
      }
      const paths = Object.keys(agentSiteCodeState.files);
      const preferred =
        paths.find((p) => p === "index.html") ||
        paths.find((p) => p.endsWith(".html")) ||
        paths[0] ||
        "";
      paintAgentSiteCodeFiles();
      if (preferred) showAgentSiteCodeFile(preferred);
      else if (labEls.labAgentSiteCodeView) {
        labEls.labAgentSiteCodeView.innerHTML = "<code>// 暂无文件</code>";
      }
      labEls.labAgentSiteCodeDialog.showModal();
      setLabStatus("已打开代码浏览器", "ok");
    } catch (error) {
      setLabStatus(`加载代码失败：${error.message}`, "error");
    }
  }

  function closeAgentSiteCodeBrowser() {
    labEls.labAgentSiteCodeDialog?.close();
  }

  async function downloadAgentSiteProject(workspaceId) {
    const project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (!project) return;
    try {
      setLabStatus("正在打包下载…", "pending");
      const bundle = await loadAgentProjectBundle(workspaceId);
      const files = bundle.files || {};
      const paths = Object.keys(files);
      if (!paths.length) throw new Error("项目没有可下载的文件");

      if (paths.length === 1) {
        const only = paths[0];
        const blob = new Blob([files[only]], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = only.split("/").pop() || only;
        a.click();
        URL.revokeObjectURL(a.href);
        setLabStatus("下载已开始", "ok");
        return;
      }

      const JSZip = await importJsZip();
      const zip = new JSZip();
      for (const [rel, content] of Object.entries(files)) {
        zip.file(rel, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const safeName = (bundle.title || workspaceId).replace(/[<>:"/\\|?*]+/g, "-").slice(0, 48);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${safeName || workspaceId}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      setLabStatus("ZIP 下载已开始", "ok");
    } catch (error) {
      setLabStatus(`下载失败：${error.message}`, "error");
    }
  }

  async function deleteAgentSiteProject(workspaceId) {
    const project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (!project) return;
    const label = projectDisplayTitle(project);
    if (!window.confirm(`确定删除项目「${label}」？此操作不可恢复。`)) return;
    try {
      setLabStatus("正在删除项目…", "pending");
      const query = `workspaceId=${encodeURIComponent(workspaceId)}`;
      let res = await fetch(`/api/agent/project?${query}`, { method: "DELETE" });
      let data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const staleApi = res.status === 404 || data.error === "Unknown Agent API";
        if (staleApi) {
          res = await fetch("/api/agent/project/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workspaceId })
          });
          data = await res.json().catch(() => ({}));
        }
        if (!res.ok || !data.ok) {
          if (staleApi && (res.status === 404 || data.error === "Unknown Agent API")) {
            throw new Error("删除需要重启本地服务：停止当前 node 进程后重新运行 npm start");
          }
          throw new Error(data.error || `HTTP ${res.status}`);
        }
      }
      agentSiteExpanded.delete(workspaceId);
      if (labAgentState.workspaceId === workspaceId) {
        labAgentState.workspaceId = "";
        labAgentState.previewUrl = "";
        labAgentState.activeFile = "";
        labAgentState.sitePreviewOpen = false;
        syncAgentPreviewUi();
      }
      await refreshAgentSiteTree();
      setLabStatus(`已删除 ${label}`, "ok");
    } catch (error) {
      setLabStatus(`删除失败：${error.message}`, "error");
    }
  }

  function handleAgentSiteAction(action, workspaceId) {
    const project = agentSiteProjects.find((p) => p.name === workspaceId);
    if (!project) return;
    if (action === "preview") {
      agentSiteExpanded.add(workspaceId);
      openAgentSiteProject(project, { focusPreview: false, expandFolder: true });
      if (labAgentState.sitePreviewOpen && labAgentState.workspaceId === workspaceId) {
        closeAgentSitePreview();
        return;
      }
      openAgentSitePreview(project);
      return;
    }
    if (action === "code") {
      void openAgentSiteCodeBrowser(workspaceId);
      return;
    }
    if (action === "download") {
      void downloadAgentSiteProject(workspaceId);
      return;
    }
    if (action === "delete") {
      void deleteAgentSiteProject(workspaceId);
    }
  }

  function onAgentSiteTreeClick(event) {
    const actionBtn = event.target.closest("[data-agent-site-action]");
    if (actionBtn) {
      event.preventDefault();
      event.stopPropagation();
      handleAgentSiteAction(actionBtn.dataset.agentSiteAction, actionBtn.dataset.agentSiteWorkspace);
      return;
    }
    const codeFileBtn = event.target.closest("[data-agent-code-file]");
    if (codeFileBtn) {
      event.preventDefault();
      showAgentSiteCodeFile(codeFileBtn.dataset.agentCodeFile);
      return;
    }
    const fileBtn = event.target.closest("[data-agent-site-file]");
    if (fileBtn) {
      event.preventDefault();
      void selectAgentSiteFile(fileBtn.dataset.agentSiteWorkspace, fileBtn.dataset.agentSiteFile);
      return;
    }
    const folderBtn = event.target.closest(".lab-agent-mysite-folder");
    if (!folderBtn) return;
    event.preventDefault();
    const wsId = folderBtn.dataset.agentSiteWorkspace;
    const project = agentSiteProjects.find((p) => p.name === wsId);
    if (!project) return;
    const wasExpanded = agentSiteExpanded.has(wsId);
    if (wasExpanded) {
      agentSiteExpanded.delete(wsId);
      paintAgentSiteTree();
      return;
    }
    agentSiteExpanded.add(wsId);
    openAgentSiteProject(project, { focusPreview: true });
  }

  function setAgentStateFromResult(result = {}, metaLabel = "", { attachMessage = true } = {}) {
    const workspaceFiles = (result.files || [])
      .filter((file) => file.type === "file")
      .map((file) => String(file.path || "").split("/").pop())
      .filter(Boolean);
    labAgentState = {
      ...labAgentState,
      previewUrl: result.previewUrl ? new URL(result.previewUrl, location.origin).href : labAgentState.previewUrl,
      title: result.title || result.name || labAgentState.title || "Agent 项目预览",
      path: result.path || labAgentState.path,
      workspaceId: result.name || labAgentState.workspaceId,
      workspaceFiles: workspaceFiles.length ? workspaceFiles : labAgentState.workspaceFiles,
      files: workspaceFiles.length
        ? workspaceFiles.map((name) => ({ type: "file", path: name, name }))
        : labAgentState.files,
      logs: result.logs || labAgentState.logs,
      modelLabel: metaLabel || labAgentState.modelLabel || "",
      running: false,
      sitePreviewOpen: Boolean(result.previewUrl) || labAgentState.sitePreviewOpen
    };
    if (result.name) ensureAgentSiteExpanded(result.name);
    if (attachMessage) attachAgentDataToLatestAgentMessage(result);
    syncAgentPreviewUi();
    if (attachMessage && isAgentPanelMode()) renderChatMessages();
  }

  function syncEmbedBrowserFrame(frame, previewUrl = labAgentState.previewUrl) {
    if (!frame) return;
    const url = previewUrl
      ? withPreviewCacheBust(previewUrl, { previewRevision: labAgentState.previewRevision || Date.now() })
      : "";
    if (url) {
      frame.hidden = false;
      const prev = frame.dataset.previewSrc || "";
      if (prev !== url) {
        frame.dataset.previewSrc = url;
        frame.src = url;
      }
      frame.removeAttribute("srcdoc");
    } else {
      frame.hidden = true;
      frame.removeAttribute("src");
      frame.srcdoc =
        '<!doctype html><html><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:transparent;color:#71695f;font:14px system-ui">预览将显示在这里</body></html>';
    }
  }

  function refreshMessagePreview(index) {
    const msg = labChatMessages[index];
    const previewUrl = resolveMessagePreviewUrl(msg);
    if (!previewUrl) return;
    const frame = labEls.labChatMessages?.querySelector(`iframe[data-preview-frame="${index}"]`);
    if (!frame) return;
    msg.previewRevision = Date.now();
    frame.src = withPreviewCacheBust(previewUrl, msg);
  }

  function attachAgentDataToLatestAgentMessage(result = labAgentState) {
    if (!result.previewUrl && !(result.logs || []).length && !result.path) return;
    for (let i = labChatMessages.length - 1; i >= 0; i -= 1) {
      const msg = labChatMessages[i];
      if (msg.role !== "assistant" || msg.lane) continue;
      if (result.previewUrl) {
        msg.previewUrl = new URL(result.previewUrl, location.origin).href;
        msg.previewTitle = result.title || result.name || msg.previewTitle || "项目预览";
        msg.previewRevision = Date.now();
      }
      if ((result.logs || []).length || result.path) {
        if (msg.agentTrace?.mode === "arena") {
          Object.assign(msg.agentTrace, {
            path: result.path || msg.agentTrace.path,
            files: result.files || msg.agentTrace.files,
            logs: result.logs || msg.agentTrace.logs,
            title: result.title || result.name || msg.agentTrace.title
          });
        } else {
          msg.agentTrace = buildAgentTraceFromResult(result, msg.agentTrace);
        }
      }
      break;
    }
  }

  function focusLatestMessagePreview() {
    const previews = labEls.labChatMessages?.querySelectorAll(".lab-msg-preview");
    const preview = previews?.length ? previews[previews.length - 1] : null;
    if (preview) preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function syncAgentPreviewUi() {
    syncAgentSandboxLayout();
    syncEmbedBrowserUi();
    if (isAgentPanelMode()) scheduleAgentSiteRefresh();
  }

  function thinkingDurationSec(msg) {
    if (!msg?.thinkingStartedAt) return 0;
    const end = msg.thinkingEndedAt || Date.now();
    return Math.max(1, Math.round((end - msg.thinkingStartedAt) / 1000));
  }

  function isThinkPending(msg) {
    return Boolean(
      msg?.streaming && !(msg.reasoning || "").trim() && !(msg.content || "").trim()
    );
  }

  function isThinkReasoning(msg) {
    return Boolean(msg?.streaming && (msg.reasoning || "").trim() && !(msg.content || "").trim());
  }

  function thinkTriggerLabel(msg) {
    if (isThinkPending(msg)) return LAB_THINK_STEPS[labThinkStepIndex % LAB_THINK_STEPS.length];
    if (msg.streaming && (msg.reasoning || "").trim()) return "深度思考中";
    if ((msg.reasoning || "").trim()) return `已思考 ${thinkingDurationSec(msg)} 秒`;
    if (msg.hadThinking) return `已思考 ${thinkingDurationSec(msg)} 秒`;
    return "思考过程";
  }

  function renderThinkingPanel(msg) {
    if (msg.role !== "assistant") return "";
    const pending = isThinkPending(msg);
    const hasReasoning = Boolean((msg.reasoning || "").trim());
    if (!msg.streaming && !hasReasoning && !msg.hadThinking) return "";

    const open = pending || isThinkReasoning(msg) || (msg.streaming && hasReasoning && !(msg.content || "").trim());
    const reasoningHtml = hasReasoning
      ? escapeHtml(msg.reasoning)
      : pending
        ? '<span class="lab-think-placeholder-line"></span><span class="lab-think-placeholder-line"></span><span class="lab-think-placeholder-line lab-think-placeholder-line--short"></span>'
        : "";

    return `
      <div class="lab-think${pending ? " is-pending" : ""}${isThinkReasoning(msg) ? " is-reasoning" : ""}${open ? " is-open" : " is-collapsed"}${msg.streaming ? " is-streaming" : ""}" data-lab-think>
        <button type="button" class="lab-think-trigger" aria-expanded="${open ? "true" : "false"}">
          <span class="lab-think-trigger-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.74V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.26A7 7 0 0 0 12 2Zm0 2a5 5 0 0 1 3.54 8.54l-.29.29-.25.25V18h-4v-4.92l-.25-.25-.29-.29A5 5 0 0 1 12 4Zm-1 6h2v2h-2v-2Z"/></svg>
          </span>
          <span class="lab-think-trigger-label lab-think-status">${escapeHtml(thinkTriggerLabel(msg))}</span>
          <span class="lab-think-dots" aria-hidden="true"><span></span><span></span><span></span></span>
          <svg class="lab-think-chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8.12 9.29 12 13.17l3.88-3.88a1 1 0 1 1 1.42 1.42l-4.59 4.59a1 1 0 0 1-1.42 0L6.7 10.71a1 1 0 0 1 1.42-1.42z"/></svg>
        </button>
        <div class="lab-think-panel"${open ? "" : " hidden"}>
          <div class="lab-think-panel-inner">
            <div class="lab-think-body${pending ? " is-shimmer" : ""}">${reasoningHtml}</div>
          </div>
        </div>
      </div>
    `;
  }

  function shouldShowMessagePreview(msg) {
    if (!resolveMessagePreviewUrl(msg)) return false;
    if (isAgentAssistantMessage(msg)) {
      return !msg.streaming && msg.agentTrace?.status === "done";
    }
    return !msg.streaming;
  }

  function renderAgentPreviewPending() {
    return `
      <section class="lab-msg-preview lab-msg-preview--pending" aria-label="预览等待">
        <p class="lab-msg-preview-pending">代码生成完成后将在此显示预览…</p>
      </section>
    `;
  }

  function remountPreviewFrames() {
    labEls.labChatMessages?.querySelectorAll(".lab-msg-preview-frame").forEach((frame) => {
      const base = frame.dataset.previewBase;
      if (!base) return;
      const index = Number(frame.dataset.previewFrame);
      const msg = labChatMessages[index];
      const nextSrc = withPreviewCacheBust(base, msg || { previewRevision: Date.now() });
      if (frame.src !== nextSrc) frame.src = nextSrc;
      else frame.src = "";
      frame.src = nextSrc;
    });
  }

  function resolveMessagePreviewUrl(msg) {
    const raw = msg?.previewUrl || "";
    if (!raw) return "";
    try {
      return new URL(raw, location.origin).href;
    } catch {
      return raw;
    }
  }

  function withPreviewCacheBust(url, msg) {
    if (!url) return "";
    const revision = msg?.previewRevision || msg?.thinkingEndedAt || Date.now();
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}v=${encodeURIComponent(String(revision))}`;
  }

  function renderMessagePreviewEmbed(msg, index) {
    const previewUrl = resolveMessagePreviewUrl(msg);
    if (isAgentAssistantMessage(msg) && (msg.streaming || msg.agentTrace?.status === "running")) {
      return renderAgentPreviewPending();
    }
    if (!shouldShowMessagePreview(msg)) return "";
    const iframeSrc = withPreviewCacheBust(previewUrl, msg);
    const title = escapeHtml(msg.previewTitle || "项目预览");
    const safeUrl = escapeHtml(previewUrl);
    const safeIframeSrc = escapeHtml(iframeSrc);
    return `
      <section class="lab-msg-preview" aria-label="项目内嵌预览">
        <header class="lab-msg-preview-head">
          <div class="lab-msg-preview-brand">
            <strong>内嵌预览</strong>
            <span>${title}</span>
          </div>
          <div class="lab-msg-preview-actions">
            <button
              type="button"
              class="lab-msg-preview-btn"
              data-preview-refresh="${index}"
              title="刷新预览"
              aria-label="刷新预览"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08a5.99 5.99 0 0 1-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            </button>
            <a class="lab-msg-preview-btn lab-msg-preview-btn--link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">新窗口</a>
          </div>
        </header>
        <p class="lab-msg-preview-url">${safeUrl}</p>
        <div class="lab-msg-preview-frame-wrap">
          <iframe
            class="lab-msg-preview-frame"
            data-preview-frame="${index}"
            data-preview-base="${safeUrl}"
            src="${safeIframeSrc}"
            title="${title}"
            loading="eager"
            referrerpolicy="no-referrer"
          ></iframe>
          <p class="lab-msg-preview-hint">点击预览区后可使用键盘或鼠标操作（部分游戏需先点击获取焦点）</p>
        </div>
      </section>
    `;
  }

  function renderAssistantBodyBlock(msg, index, bodyHtml) {
    const agentMsg = isAgentAssistantMessage(msg);
    const think = agentMsg ? "" : renderThinkingPanel(msg);
    const agentTrace = agentMsg ? renderAgentTracePanel(msg) : "";
    const hasAnswer = Boolean((msg.content || "").trim()) || (!msg.streaming && (think || agentTrace));
    const answerHidden = msg.streaming && !(msg.content || "").trim();
    const preview = renderMessagePreviewEmbed(msg, index);
    return `
      <div class="lab-msg-body-wrap">
        ${think}
        ${agentTrace}
        <div class="lab-msg-body lab-msg-answer${msg.role === "assistant" && !msg.streaming ? " lab-msg-body--md" : ""}${answerHidden ? " is-empty" : ""}"${answerHidden ? ' hidden aria-hidden="true"' : ""}>${bodyHtml}</div>
        ${preview}
        ${renderAssistantMsgActions(index, msg)}
      </div>
    `;
  }

  function updateCustomProviderActions() {
    const provider = getProvider();
    const isCustom = isUserCustomProvider(provider);
    if (labEls.labSaveProvider) labEls.labSaveProvider.hidden = !isCustom;
    if (labEls.labEditProvider) labEls.labEditProvider.hidden = !isCustom;
    if (labEls.labDeleteProvider) labEls.labDeleteProvider.hidden = !isCustom;
    syncCustomProviderUi();
  }

  function syncCustomProviderUi() {
    const provider = getProvider();
    const isCustom = isUserCustomProvider(provider);
    if (labEls.labCustomNameField) {
      labEls.labCustomNameField.hidden = !isCustom;
      labEls.labCustomNameField.classList.toggle("is-visible", isCustom);
    }
    if (labEls.labStudioApiGrid) {
      labEls.labStudioApiGrid.classList.toggle("has-custom-name", isCustom);
    }
    if (labEls.labCustomProviderName) {
      labEls.labCustomProviderName.disabled = !isCustom;
      labEls.labCustomProviderName.tabIndex = isCustom ? 0 : -1;
    }
    if (isCustom && labEls.labCustomProviderName && provider) {
      if (labNameFieldProviderId !== provider.id) {
        labEls.labCustomProviderName.value = provider.name ?? "";
        labNameFieldProviderId = provider.id;
      }
    } else if (!isCustom) {
      labNameFieldProviderId = "";
      if (labEls.labCustomProviderName) labEls.labCustomProviderName.value = "";
    }
  }

  function persistCustomProviderMeta() {
    const provider = getProvider();
    if (!isUserCustomProvider(provider)) return;
    provider.name = labEls.labCustomProviderName?.value ?? "";
    const baseUrl = normalizeBaseUrl(labEls.labBaseUrl?.value);
    if (baseUrl) {
      provider.baseUrl = baseUrl;
      labState.baseUrl = baseUrl;
    }
    labState.customProviders = (labState.customProviders || []).map((p) =>
      p.id === provider.id ? { ...p, name: provider.name, baseUrl: provider.baseUrl } : p
    );
  }

  function editCustomProvider() {
    if (!isUserCustomProvider(getProvider())) return;
    syncCustomProviderUi();
    labEls.labCustomProviderName?.focus();
    labEls.labCustomProviderName?.select();
  }

  function deleteCustomProvider(providerId) {
    const id = providerId || labState.providerId;
    const provider = labProviders.find((p) => p.id === id);
    if (!provider || !isUserCustomProvider(provider)) return;
    const name = provider.name;
    labProviders = labProviders.filter((p) => p.id !== id);
    labState.customProviders = (labState.customProviders || []).filter((p) => p.id !== id);
    delete labState.profiles[id];
    if (labState.providerId === id) {
      labState.providerId = labProviders[0]?.id || "openai";
      labNameFieldProviderId = "";
      pullActiveProfile();
      syncLabFormFromState();
    }
    saveLabState();
    setLabStatus(`已删除「${name}」`, "ok");
  }

  function focusConfigPanel() {
    labEls.labApiKey?.focus();
    labEls.labApiKey?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function loadLabLogoManifest() {
    try {
      const res = await fetch(LAB_LOGO_MANIFEST_URL);
      if (!res.ok) throw new Error(String(res.status));
      labProviderLogoManifest = await res.json();
    } catch {
      labProviderLogoManifest = null;
    }
  }

  async function loadLabProviders() {
    try {
      const res = await fetch(LAB_PROVIDERS_URL);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      labProviderGroups = data.groups || [];
      labProviders = data.providers || [];
      mergeCustomProviders();
      labProviders.forEach((provider) => ensureProfile(provider.id, provider));
    } catch (error) {
      console.error(error);
      labProviderGroups = [{ id: "intl", label: "平台" }];
      labProviders = [
        {
          id: "openai",
          name: "OpenAI",
          group: "intl",
          baseUrl: "https://api.openai.com/v1",
          logo: "assets/logos/api-openai-platform.png",
          brandColor: "#10a37f",
          note: "官方接口"
        }
      ];
      mergeCustomProviders();
    }
  }

  function mergeCustomProviders() {
    labProviders = labProviders.filter((p) => p.id !== "custom");
    (labState.customProviders || []).forEach((custom) => {
      const entry = {
        ...custom,
        group: "custom",
        isCustom: true
      };
      const idx = labProviders.findIndex((item) => item.id === entry.id);
      if (idx >= 0) labProviders[idx] = { ...labProviders[idx], ...entry };
      else labProviders.push(entry);
    });
  }

  function isUserCustomProvider(provider) {
    return provider?.isCustom === true;
  }

  function customProviderIconMarkup() {
    return `<span class="lab-studio-custom-icon" aria-hidden="true">自定义</span>`;
  }

  function renderProviderIconWrap(provider, className) {
    const isCustom = isUserCustomProvider(provider);
    const iconUrl = isCustom ? "" : getProviderIcon(provider);
    return `
      <span class="${className}${isCustom ? " lab-studio-item-icon--custom" : ""}" style="--brand: ${provider.brandColor || "#64748b"}">
        ${isCustom ? customProviderIconMarkup() : iconUrl ? `<img src="${escapeHtml(iconUrl)}" alt="" loading="lazy" data-provider-icon="${escapeHtml(provider.id)}" data-icon-domain="${escapeHtml(provider.iconDomain || "")}">` : ""}
        <span class="lab-studio-item-fallback" aria-hidden="true">${escapeHtml(provider.name.slice(0, 1))}</span>
      </span>
    `;
  }

  function customProviderNote(provider) {
    return isUserCustomProvider(provider) ? "自定义" : provider.note || "OpenAI 兼容接口";
  }

  function remoteProviderIconUrl(domain) {
    if (!domain) return "";
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }

  function manifestLogoPath(providerId) {
    const file = labProviderLogoManifest?.[providerId];
    return file ? `assets/logos/${file}` : "";
  }

  /** Single resolver for studio rail, chat avatars, and studio head. */
  function resolveProviderIconUrl(provider) {
    if (!provider || isUserCustomProvider(provider)) return "";
    const explicit = provider.logo?.trim();
    if (explicit) return explicit;
    const fromManifest = manifestLogoPath(provider.id);
    if (fromManifest) return fromManifest;
    if (provider.iconDomain) return remoteProviderIconUrl(provider.iconDomain);
    return "";
  }

  function getProviderIcon(provider) {
    return resolveProviderIconUrl(provider);
  }

  function inferProviderIdFromMeta(meta) {
    if (!meta || typeof meta !== "string") return "";
    const sep = meta.indexOf(" · ");
    const head = (sep >= 0 ? meta.slice(0, sep) : meta).trim();
    if (!head) return "";
    const found = labProviders.find((p) => displayProviderName(p) === head || p.name === head);
    return found?.id || "";
  }

  function resolveMessageProvider(msg, index) {
    if (msg?.providerId && labProviders.some((p) => p.id === msg.providerId)) {
      return labProviders.find((p) => p.id === msg.providerId);
    }
    if (msg?.role === "assistant" || msg?.role === "system") {
      const fromMeta = inferProviderIdFromMeta(msg.meta);
      if (fromMeta) return labProviders.find((p) => p.id === fromMeta);
      for (let i = index - 1; i >= 0; i--) {
        const prev = labChatMessages[i];
        if (prev?.providerId) {
          const p = labProviders.find((x) => x.id === prev.providerId);
          if (p) return p;
        }
        if (prev?.role === "user") break;
      }
      if (labState.chatProviderId) {
        return labProviders.find((p) => p.id === labState.chatProviderId);
      }
    }
    return null;
  }

  function renderChatMessageAvatar(msg, role, index) {
    if (role === "user") {
      return `<div class="lab-msg-avatar lab-msg-avatar--text" aria-hidden="true">你</div>`;
    }
    const provider = resolveMessageProvider(msg, index);
    if (!provider) {
      return `<div class="lab-msg-avatar lab-msg-avatar--text" aria-hidden="true">AI</div>`;
    }
    return `<div class="lab-msg-avatar lab-msg-avatar--brand" aria-hidden="true">${renderProviderIconWrap(provider, "lab-msg-avatar-icon")}</div>`;
  }

  function getVisibleProviders() {
    const q = labProviderSearchQuery.trim().toLowerCase();
    return labProviders.filter((provider) => {
      if (provider.id === "custom" && !provider.isCustom) return false;
      if (!q) return true;
      const haystack = [provider.name, provider.id, provider.note, ...(provider.tags || [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderStudioListItem(provider) {
    const active = labState.providerId === provider.id;
    const on = isProviderOn(provider.id);
    const isCustom = isUserCustomProvider(provider);
    return `
      <div class="lab-studio-item-wrap${active ? " is-active" : ""}">
        <button
          type="button"
          class="lab-studio-item"
          data-provider-id="${escapeHtml(provider.id)}"
          role="option"
          aria-selected="${active}"
          title="${escapeHtml(customProviderNote(provider))}"
        >
          ${renderProviderIconWrap(provider, "lab-studio-item-icon")}
          <span class="lab-studio-item-name">${escapeHtml(displayProviderName(provider))}</span>
          ${on ? '<span class="lab-studio-badge">ON</span>' : ""}
        </button>
        ${
          isCustom
            ? `<button type="button" class="lab-studio-item-delete" data-delete-custom-provider="${escapeHtml(provider.id)}" aria-label="删除 ${escapeHtml(provider.name)}">×</button>`
            : ""
        }
      </div>
    `;
  }

  function bindProviderIconFallbacks(root) {
    root?.querySelectorAll("[data-provider-icon]").forEach((img) => {
      const onError = () => {
        const domain = img.dataset.iconDomain;
        if (!img.dataset.retriedRemote && domain) {
          img.dataset.retriedRemote = "1";
          img.src = remoteProviderIconUrl(domain);
          return;
        }
        if (!img.dataset.retriedDdg && domain) {
          img.dataset.retriedDdg = "1";
          img.src = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
          return;
        }
        img.style.display = "none";
        img.parentElement?.classList.add("is-fallback");
      };
      img.addEventListener("error", onError);
      if (img.complete && img.naturalWidth === 0) onError();
    });
  }

  function renderStudioHead() {
    if (!labEls.labStudioHead) return;
    const provider = getProvider();
    if (!provider) {
      labEls.labStudioHead.innerHTML = "";
      return;
    }
    const headNote = customProviderNote(provider);
    const showHeadNote = headNote && (!isUserCustomProvider(provider) || headNote !== "自定义");
    labEls.labStudioHead.innerHTML = `
      ${renderProviderIconWrap(provider, "lab-studio-head-icon")}
      <span class="lab-studio-head-text">
        <strong>${escapeHtml(displayProviderName(provider))}</strong>
        ${showHeadNote ? `<small>${escapeHtml(headNote)}</small>` : ""}
      </span>
    `;
    bindProviderIconFallbacks(labEls.labStudioHead);
    const profile = ensureProfile(provider.id, provider);
    if (labEls.labProviderEnabled) labEls.labProviderEnabled.checked = isProfileEnabled(profile);
    syncCustomProviderUi();
  }

  function renderStudioList() {
    if (!labEls.labProviderList) return;
    const visible = getVisibleProviders();
    const q = labProviderSearchQuery.trim();

    let html = "";
    if (!visible.length) {
      html = '<p class="lab-studio-empty">无匹配平台</p>';
    } else if (q) {
      html = visible.map((provider) => renderStudioListItem(provider)).join("");
    } else {
      const groups = labProviderGroups.filter((g) => g.id !== "custom");
      html = groups
        .map((group) => {
          const items = visible.filter((p) => (p.group || "other") === group.id && !isUserCustomProvider(p));
          if (!items.length) return "";
          const collapsed = labState.collapsedGroups?.[group.id];
          return `
            <details class="lab-studio-group" data-group-id="${escapeHtml(group.id)}"${collapsed ? "" : " open"}>
              <summary><span>${escapeHtml(group.label)}</span></summary>
              <div class="lab-studio-group-items">${items.map((p) => renderStudioListItem(p)).join("")}</div>
            </details>
          `;
        })
        .filter(Boolean)
        .join("");

      const customItems = visible.filter((p) => isUserCustomProvider(p));
      const customCollapsed = labState.collapsedGroups?.custom;
      html += `
        <details class="lab-studio-group lab-studio-group--custom" data-group-id="custom"${customCollapsed ? "" : " open"}>
          <summary><span>自定义</span></summary>
          <div class="lab-studio-group-items">
            ${
              customItems.length
                ? customItems.map((p) => renderStudioListItem(p)).join("")
                : '<p class="lab-studio-custom-hint">点击下方「+ 自定义」添加 OpenAI 兼容平台</p>'
            }
          </div>
        </details>
      `;

      if (!html) html = visible.map((provider) => renderStudioListItem(provider)).join("");
    }

    labEls.labProviderList.innerHTML = html;
    bindProviderIconFallbacks(labEls.labProviderList);
    renderStudioHead();
    updateCustomProviderActions();
  }

  function selectProvider(providerId, { updateUrl = true, revealPanel = true } = {}) {
    const provider = labProviders.find((item) => item.id === providerId);
    if (!provider) return;

    const shouldReveal = revealPanel && labState.studioPanelCollapsed === true;

    if (providerId === labState.providerId) {
      repairProfileOnSwitch(provider);
      runProfileStorageSanitize();
      pullActiveProfile();
      syncLabFormFromState();
      if (updateUrl) updateLabUrl(providerId);
      renderStudioHead();
      updateCustomProviderActions();
      renderStudioList();
      if (shouldReveal) revealStudioMainPanel();
      focusStudioProviderItem(providerId);
      return;
    }

    flushActiveProfile();
    labState.providerId = provider.id;
    labNameFieldProviderId = "";
    const repaired = repairProfileOnSwitch(provider);
    const sanitized = runProfileStorageSanitize();
    pullActiveProfile();
    syncLabFormFromState();
    saveLabState();
    if (updateUrl) updateLabUrl(providerId);
    renderStudioHead();
    updateCustomProviderActions();
    renderStudioList();
    if (shouldReveal) revealStudioMainPanel();
    else animateStudioMainContent({ mode: "switch" });
    focusStudioProviderItem(providerId);
    setLabStatus(
      repaired
        ? `已切换至 ${provider.name}，并恢复该平台默认 API（此前误用了其他平台地址）`
        : sanitized
          ? `已切换至 ${provider.name}（已清除误同步的密钥/模型）`
          : `已切换至 ${provider.name}`
    );
  }

  function navigateToProvider(providerId) {
    if (!labProviders.some((p) => p.id === providerId)) return false;
    selectProvider(providerId);
    return true;
  }

  function addCustomProvider() {
    flushActiveProfile();
    const id = `custom-${Date.now()}`;
    const provider = {
      id,
      name: "",
      baseUrl: "",
      group: "custom",
      isCustom: true,
      brandColor: "#64748b",
      note: "自定义"
    };
    labProviders.push(provider);
    labState.customProviders = labState.customProviders || [];
    labState.customProviders.push(provider);
    resetProviderProfile(id, provider);
    labState.providerId = id;
    pullActiveProfile();
    labNameFieldProviderId = "";
    syncLabFormFromState();
    syncCustomProviderUi();
    saveLabState();
    labEls.labCustomProviderName?.focus();
    labEls.labCustomProviderName?.select();
    setLabStatus("请在中间面板填写平台名称、API 地址，并拉取模型", "ok");
  }

  function getFilteredFetchedModels() {
    const fetched = sortModelsByPin(labState.fetchedModels || []);
    const q = labModelSearchQuery.trim().toLowerCase();
    return fetched.filter((model) => {
      const id = model.id || model;
      if (labState.modelFilter === "free" && !isFreeModel(id)) return false;
      if (labState.modelFilter === "enabled" && !labState.enabledModels.includes(id)) return false;
      if (q && !id.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderModelFilterChips() {
    if (!labEls.labModelFilters) return;
    labEls.labModelFilters.querySelectorAll("[data-model-filter]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.modelFilter === labState.modelFilter);
    });
  }

  function renderModelLists() {
    if (!labEls.labFetchedModels || !labEls.labEnabledModels) return;

    const filtered = getFilteredFetchedModels();

    const isCustom = isUserCustomProvider(getProvider());

    labEls.labFetchedModels.innerHTML = filtered.length
      ? filtered
          .map((model, rowIdx) => {
            const id = model.id || model;
            const inputId = `lab-mdl-${rowIdx}`;
            const checked = labState.enabledModels.includes(id);
            const free = isFreeModel(id);
            const pinned = getPinnedModels().includes(id);
            return `
              <div class="lab-studio-model-row${free ? " is-free" : ""}${pinned ? " is-pinned" : ""}">
                <input type="checkbox" id="${inputId}" data-model-id="${escapeHtml(id)}"${checked ? " checked" : ""}>
                <label class="lab-studio-model-id" for="${inputId}">${escapeHtml(id)}</label>
                ${free ? '<span class="lab-studio-model-free">免费</span>' : ""}
                <button type="button" class="lab-studio-pin" data-pin-model="${escapeHtml(id)}" title="${pinned ? "取消置顶" : "置顶"}">${pinned ? "★" : "☆"}</button>
                ${
                  isCustom
                    ? `<button type="button" class="lab-studio-model-delete" data-delete-fetched-model="${escapeHtml(id)}" aria-label="删除模型">×</button>`
                    : ""
                }
              </div>
            `;
          })
          .join("")
      : "";

    const enabled = labState.enabledModels || [];
    if (labEls.labEnabledWrap) labEls.labEnabledWrap.hidden = enabled.length === 0;
    labEls.labEnabledModels.innerHTML = enabled.length
      ? enabled
          .map(
            (id) => `
            <span class="lab-studio-tag${isFreeModel(id) ? " is-free" : ""}">
              ${escapeHtml(id)}
              <button type="button" data-remove-model="${escapeHtml(id)}" aria-label="移除">×</button>
            </span>
          `
          )
          .join("")
      : "";

    renderModelFilterChips();
  }

  function closeChatModelPanel(slot) {
    const slots = slot ? [slot] : CHAT_MODEL_SLOTS;
    slots.forEach((s) => {
      const { panel, trigger, menu } = getChatModelPickerEls(s);
      if (panel && !panel.hidden) panel.hidden = true;
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
        menu?.classList.remove("is-open");
      }
    });
  }

  function openChatModelPanel(slot) {
    closeChatModelPanel();
    const { panel, trigger, menu } = getChatModelPickerEls(slot);
    if (!panel || trigger?.disabled) return;
    panel.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    menu?.classList.add("is-open");
  }

  function toggleChatModelPanel(slot = "primary", force) {
    const { panel, trigger } = getChatModelPickerEls(slot);
    if (!panel || trigger?.disabled) return;
    const shouldOpen = typeof force === "boolean" ? force : Boolean(panel.hidden);
    if (shouldOpen) openChatModelPanel(slot);
    else closeChatModelPanel(slot);
  }

  function onChatModelMenuClick(event) {
    const menu = event.target.closest(".lab-chat-model-menu");
    if (!menu) return;
    const slot = menu.dataset.chatModelSlot || "primary";
    const trigger = event.target.closest(".lab-chat-model-trigger");
    if (trigger && !trigger.disabled) {
      event.preventDefault();
      event.stopPropagation();
      toggleChatModelPanel(slot);
      return;
    }
    const option = event.target.closest("[data-chat-model-value]");
    if (!option) return;
    event.preventDefault();
    event.stopPropagation();
    const parsed = parseChatModelValue(option.dataset.chatModelValue);
    if (parsed) applyChatModelSelection(parsed, slot);
  }

  function onChatModelDocumentClick(event) {
    if (!labEls.labPage || labEls.labPage.hidden) return;
    CHAT_MODEL_SLOTS.forEach((slot) => {
      const { panel, menu } = getChatModelPickerEls(slot);
      if (!panel || panel.hidden) return;
      if (menu?.contains(event.target)) return;
      closeChatModelPanel(slot);
    });
  }

  function bindChatModelPickerEvents() {
    refreshLabEls();
    CHAT_MODEL_SLOTS.forEach((slot) => {
      const { menu } = getChatModelPickerEls(slot);
      if (menu && !menu.dataset.neuxChatModelBound) {
        menu.dataset.neuxChatModelBound = "1";
        menu.addEventListener("click", onChatModelMenuClick);
      }
    });
    if (!chatModelPickerBound) {
      document.addEventListener("click", onChatModelDocumentClick);
      chatModelPickerBound = true;
    }
  }

  function applyChatModelSelection(parsed, slot = "primary", { closePanel = true } = {}) {
    if (!parsed) return;
    const { providerKey, modelKey } = getChatModelStateKeys(slot);
    labState[providerKey] = parsed.providerId;
    labState[modelKey] = parsed.modelId;
    if (slot === "primary") {
      const provider = labProviders.find((p) => p.id === parsed.providerId);
      const profile = ensureProfile(parsed.providerId, provider);
      profile.selectedModel = parsed.modelId;
    }
    const { select } = getChatModelPickerEls(slot);
    if (select) {
      select.value = encodeChatModelValue(parsed.providerId, parsed.modelId);
    }
    saveLabState();
    renderChatModelSelect();
    if (closePanel) closeChatModelPanel(slot);
  }

  function syncChatModelTriggerForSlot(slot, options, selectedValue) {
    const { trigger, platform: platformEl, triggerText: modelEl } = getChatModelPickerEls(slot);
    if (!trigger || !modelEl) return;

    if (!options.length) {
      trigger.disabled = true;
      if (platformEl) platformEl.hidden = true;
      modelEl.textContent = getChatModelEmptyLabel();
      return;
    }

    trigger.disabled = false;
    const selected = options.find((o) => o.value === selectedValue) || options[0];
    if (platformEl) platformEl.hidden = true;
    modelEl.textContent = `${selected.platformName} · ${selected.modelId}`;
  }

  function syncChatModelPickVisibility() {
    const showBattle = normalizeChatMode(labState.chatMode) === "battle";
    const { wrap } = getChatModelPickerEls("battle");
    if (wrap) wrap.hidden = !showBattle;
    if (labEls.labChatBattleModelVs) labEls.labChatBattleModelVs.hidden = !showBattle;
  }

  function renderChatModelPicker(slot) {
    const { select, list } = getChatModelPickerEls(slot);
    if (!select) return;
    ensureChatModelSelectionForSlot(slot);
    const { providerKey, modelKey } = getChatModelStateKeys(slot);
    const options = chatModelOptionsForSlot(slot);
    const selectedValue = encodeChatModelValue(labState[providerKey], labState[modelKey]);

    syncChatModelTriggerForSlot(slot, options, selectedValue);

    if (!options.length) {
      select.innerHTML = `<option value="">${escapeHtml(getChatModelEmptyLabel())}</option>`;
      if (list) list.innerHTML = "";
      closeChatModelPanel(slot);
      return;
    }

    select.disabled = false;
    select.value = selectedValue;

    const byProvider = new Map();
    options.forEach((opt) => {
      if (!byProvider.has(opt.providerId)) {
        byProvider.set(opt.providerId, { name: opt.platformName, models: [] });
      }
      byProvider.get(opt.providerId).models.push(opt);
    });

    let selectHtml = "";
    let panelHtml = "";
    byProvider.forEach(({ name, models }) => {
      selectHtml += `<optgroup label="${escapeHtml(name)}">`;
      panelHtml += `<div class="lab-chat-model-group" role="presentation">`;
      panelHtml += `<div class="lab-chat-model-group-label">${escapeHtml(name)}</div>`;
      models.forEach((opt) => {
        const active = opt.value === selectedValue;
        selectHtml += `<option value="${escapeHtml(opt.value)}"${active ? " selected" : ""}>${escapeHtml(opt.modelId)}</option>`;
        panelHtml += `
          <button
            type="button"
            class="lab-chat-model-option${active ? " is-selected" : ""}"
            role="option"
            aria-selected="${active}"
            data-chat-model-value="${escapeHtml(opt.value)}"
          >
            <span class="lab-chat-model-option-id">${escapeHtml(opt.modelId)}</span>
          </button>
        `;
      });
      panelHtml += `</div>`;
      selectHtml += `</optgroup>`;
    });

    select.innerHTML = selectHtml;
    if (list) list.innerHTML = panelHtml;
  }

  function renderChatModelSelect() {
    renderChatModelPicker("primary");
    if (normalizeChatMode(labState.chatMode) === "battle") {
      renderChatModelPicker("battle");
    }
    syncChatModelPickVisibility();
    renderVoiceModePanel();
  }

  function isBattleChatMode() {
    return normalizeChatMode(labState.chatMode) === "battle";
  }

  function buildApiMessages(lane) {
    const messages = [];
    let system = labState.systemPrompt?.trim();
    if (system) messages.push({ role: "system", content: system });
    labChatMessages.forEach((msg) => {
      if (msg.role === "user") {
        messages.push({ role: "user", content: msg.content });
        return;
      }
      if (msg.role !== "assistant") return;
      if (!lane) {
        messages.push({ role: "assistant", content: msg.content });
        return;
      }
      if (msg.lane === lane) {
        messages.push({ role: "assistant", content: msg.content });
      }
    });
    return messages;
  }

  function updateStreamingBubble(content, lane, msg) {
    const root = labEls.labChatMessages;
    if (!root) return;
    const laneAttr = lane ? `[data-streaming-lane="${lane}"]` : '[data-streaming="1"]';
    const article = root.querySelector(`.lab-msg${laneAttr}`);
    if (!article) return;

    const answerEl = article.querySelector(".lab-msg-answer");
    const hasContent = Boolean((content || "").trim());
    if (answerEl) {
      if (hasContent) {
        answerEl.hidden = false;
        answerEl.removeAttribute("aria-hidden");
        answerEl.classList.remove("is-empty");
        answerEl.textContent = content;
      } else {
        answerEl.hidden = true;
        answerEl.setAttribute("aria-hidden", "true");
        answerEl.classList.add("is-empty");
        answerEl.textContent = "";
      }
    }

    if (msg) syncStreamingThinkDom(article, msg);
    root.scrollTop = root.scrollHeight;
  }

  function syncStreamingThinkDom(article, msg) {
    if (!article || !msg) return;
    const think = article.querySelector("[data-lab-think]");
    if (!think) return;

    const pending = isThinkPending(msg);
    const reasoning = isThinkReasoning(msg);
    const hasReasoning = Boolean((msg.reasoning || "").trim());

    think.classList.toggle("is-pending", pending);
    think.classList.toggle("is-reasoning", reasoning);
    think.classList.toggle("is-streaming", Boolean(msg.streaming));
    think.classList.toggle("is-open", pending || reasoning || (msg.streaming && hasReasoning && !(msg.content || "").trim()));
    think.classList.toggle("is-collapsed", !pending && !reasoning && !((msg.streaming && hasReasoning && !(msg.content || "").trim())));

    const label = think.querySelector(".lab-think-status");
    if (label) label.textContent = thinkTriggerLabel(msg);

    const panel = think.querySelector(".lab-think-panel");
    const trigger = think.querySelector(".lab-think-trigger");
    const open = pending || reasoning || (msg.streaming && hasReasoning && !(msg.content || "").trim());
    if (panel) panel.hidden = !open;
    if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");

    const body = think.querySelector(".lab-think-body");
    if (body) {
      body.classList.toggle("is-shimmer", pending);
      if (hasReasoning) {
        body.textContent = msg.reasoning;
      } else if (pending && !body.querySelector(".lab-think-placeholder-line")) {
        body.innerHTML =
          '<span class="lab-think-placeholder-line"></span><span class="lab-think-placeholder-line"></span><span class="lab-think-placeholder-line lab-think-placeholder-line--short"></span>';
      }
    }

    article.classList.toggle("is-think-pending", pending);
  }

  function updateStreamingReasoning(reasoning, lane, msg) {
    const root = labEls.labChatMessages;
    if (!root) return;
    const laneAttr = lane ? `[data-streaming-lane="${lane}"]` : '[data-streaming="1"]';
    const article = root.querySelector(`.lab-msg${laneAttr}`);
    if (!article) return;
    const body = article.querySelector(".lab-think-body");
    if (body) {
      body.classList.remove("is-shimmer");
      body.textContent = reasoning;
    }
    if (msg) syncStreamingThinkDom(article, msg);
    root.scrollTop = root.scrollHeight;
  }

  function stopThinkingStatusTicker() {
    if (labThinkStepTimer) {
      clearInterval(labThinkStepTimer);
      labThinkStepTimer = null;
    }
  }

  function startThinkingStatusTicker() {
    stopThinkingStatusTicker();
    const tick = () => {
      const pending = labChatMessages.some(isThinkPending);
      if (!pending) {
        stopThinkingStatusTicker();
        return;
      }
      labThinkStepIndex += 1;
      const label = LAB_THINK_STEPS[labThinkStepIndex % LAB_THINK_STEPS.length];
      labEls.labChatMessages?.querySelectorAll(".lab-think.is-pending .lab-think-status").forEach((el) => {
        el.textContent = label;
      });
      labEls.labChatMessages?.querySelectorAll(".lab-battle-think.is-pending .lab-think-status").forEach((el) => {
        el.textContent = label;
      });
    };
    tick();
    labThinkStepTimer = setInterval(tick, 2200);
  }

  function bindThinkingPanelToggles(root) {
    if (!root || root.dataset.neuxThinkBound) return;
    root.dataset.neuxThinkBound = "1";
    root.addEventListener("click", (event) => {
      const trigger = event.target.closest(".lab-think-trigger");
      if (!trigger) return;
      const think = trigger.closest("[data-lab-think]");
      if (!think || think.classList.contains("is-pending")) return;
      event.preventDefault();
      const open = think.classList.toggle("is-open");
      think.classList.toggle("is-collapsed", !open);
      const panel = think.querySelector(".lab-think-panel");
      if (panel) panel.hidden = !open;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function ensureThinkingPanelBindings() {
    if (labEls.labChatMessages) bindThinkingPanelToggles(labEls.labChatMessages);
  }

  function finishChatMessagesRender() {
    const root = labEls.labChatMessages;
    if (!root) return;
    bindProviderIconFallbacks(root);
    root.querySelectorAll(".lab-md-pre").forEach((pre) => {
      const code = pre.querySelector("code");
      if (!code) return;
      const wrap = document.createElement("div");
      wrap.className = "lab-md-pre-wrap";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lab-md-copy-code";
      btn.textContent = "复制代码";
      btn.addEventListener("click", () => copyToClipboard(code.textContent, { anchor: btn }));
      pre.parentNode.insertBefore(wrap, pre);
      wrap.append(btn, pre);
    });
    root.scrollTop = root.scrollHeight;
    if (labChatMessages.some(isThinkPending)) startThinkingStatusTicker();
    else stopThinkingStatusTicker();
  }

  const LAB_CHAT_STARTERS = [
    {
      id: "debug",
      title: "代码调试",
      desc: "帮我定位并修复代码问题",
      prompt: "请帮我分析并修复以下代码问题：",
      tone: "orange",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 6.5 6.5 8 9 10.5 6.5 13 8 14.5 10.5 12 13 14.5 14.5 13 12 10.5 14.5 8 13 6.5 10.5 8ZM16 17.5 14.5 16l1.5-1.5 1.5 1.5-1.5 1.5Z"/></svg>`
    },
    {
      id: "copy",
      title: "文案生成",
      desc: "撰写营销文案或邮件内容",
      prompt: "请帮我撰写一段营销文案或邮件内容，主题是：",
      tone: "purple",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 18.5V5.75A1.75 1.75 0 0 1 5.75 4h8.5A1.75 1.75 0 0 1 16 5.75V8h2.25A1.75 1.75 0 0 1 20 9.75v8.5A1.75 1.75 0 0 1 18.25 20H7.75A1.75 1.75 0 0 1 6 18.25V18H5.75A1.75 1.75 0 0 1 4 16.25v-2.25H4Zm2 .75h8v1.5H6v-1.5Zm0-3h8V14H6v-2.25Zm10.5 0H18v-1.5h-1.5V14Z"/></svg>`
    },
    {
      id: "analyze",
      title: "问题分析",
      desc: "分析问题并提供解决思路",
      prompt: "请帮我分析以下问题，并给出可执行的解决思路：",
      tone: "blue",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 9h10v1.5H7V9Zm0 3.5h7V14H7v-1.5ZM5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v9A2.5 2.5 0 0 1 16.5 17H11l-4 3.5V17H7.5A2.5 2.5 0 0 1 5 14.5v-9Z"/></svg>`
    },
    {
      id: "study",
      title: "学习计划",
      desc: "定制个性化学习方案",
      prompt: "请根据我的目标，帮我制定一份个性化学习计划：",
      tone: "green",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 3 7.5v2.25L12 14l9-4.25V7.5L12 3Zm0 9.75L5.18 9.5 12 6.5l6.82 3-6.82 3.25ZM4.5 13.9v2.85L12 21l7.5-4.25v-2.85L12 17.75 4.5 13.9Z"/></svg>`
    }
  ];

  const LAB_AGENT_STARTERS = [
    {
      id: "ui",
      title: "UI 界面",
      desc: "生成交互网页与组件界面",
      prompt: "请用 HTML、CSS、JavaScript 为我生成一个现代化、可交互的 UI 界面，需求如下：",
      tone: "orange",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v8.5A1.75 1.75 0 0 1 18.25 16H14l-3 2.25V16H5.75A1.75 1.75 0 0 1 4 14.25V5.75Zm2 2h12v6.5H6V7.75Z"/></svg>`
    },
    {
      id: "game",
      title: "小游戏",
      desc: "生成可玩的 HTML5 小游戏",
      prompt: "请为我生成一个可单机游玩的小游戏（尽量用单个 HTML 文件），玩法与风格：",
      tone: "purple",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm8 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 5.75A1.75 1.75 0 0 1 7.75 4h8.5A1.75 1.75 0 0 1 18 5.75v12.5A1.75 1.75 0 0 1 16.25 19H7.75A1.75 1.75 0 0 1 6 17.25V5.75Zm2.25 3.5v1h3v-1h-3Zm6 5.25v1h3v-1h-3Z"/></svg>`
    },
    {
      id: "landing",
      title: "落地页",
      desc: "生成产品或活动宣传页",
      prompt: "请生成一个完整的产品/活动落地页（含 hero、特性与 CTA），主题是：",
      tone: "blue",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 4.5V18h12V8.5H6Z"/></svg>`
    },
    {
      id: "tool",
      title: "小工具",
      desc: "生成计算器、转换器等实用页",
      prompt: "请生成一个可直接在浏览器使用的小工具页面，功能是：",
      tone: "green",
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.5 3a1.5 1.5 0 0 0-1.5 1.5V5H6.75A1.75 1.75 0 0 0 5 6.75v10.5A1.75 1.75 0 0 0 6.75 19h10.5A1.75 1.75 0 0 0 19 17.25V6.75A1.75 1.75 0 0 0 17.25 5H15V4.5A1.5 1.5 0 0 0 13.5 3h-3Zm-1.5 3h6v1.25H9V6ZM8 9.5h8v7H8v-7Z"/></svg>`
    }
  ];

  function renderChatStarterCards() {
    const starters = isAgentPanelMode() ? LAB_AGENT_STARTERS : LAB_CHAT_STARTERS;
    return starters.map(
      (item) => `
        <button
          type="button"
          class="lab-chat-starter lab-chat-starter--${item.tone}"
          data-lab-starter-prompt="${escapeHtml(item.prompt)}"
        >
          <span class="lab-chat-starter-icon">${item.icon}</span>
          <span class="lab-chat-starter-copy">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.desc)}</span>
          </span>
          <span class="lab-chat-starter-arrow" aria-hidden="true">→</span>
        </button>
      `
    ).join("");
  }

  function applyStarterPrompt(prompt) {
    const needsKey = !hasAnyPlatformApiKey();
    const needsModel = !hasAnyChatModel();
    if (needsKey) {
      focusConfigPanel();
      setLabStatus("请先在任一平台填写 API 密钥与地址", "error");
      return;
    }
    if (needsModel) {
      document.querySelector("#labFetchModels")?.focus();
      setLabStatus("请先在平台配置中拉取并启用模型", "error");
      return;
    }
    if (labEls.labChatInput) {
      labEls.labChatInput.value = prompt;
      labEls.labChatInput.focus();
    }
  }

  const LAB_MSG_ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/></svg>`;
  const LAB_MSG_ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" aria-hidden="true"><path d="M12 4v9"/><path d="m8.5 8.5 3.5-3.5 3.5 3.5"/><path d="M6 14v5h12v-5"/></svg>`;
  const LAB_MSG_ICON_REGEN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4v5.5H14.5"/></svg>`;
  const LAB_MSG_ICON_VOICE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" aria-hidden="true"><path d="M12 4v8"/><path d="M8.5 8.5 12 12l3.5-3.5"/><path d="M5 14a7 7 0 0 0 14 0"/><path d="M12 18v2"/></svg>`;

  function renderAssistantMsgActions(index, msg) {
    if (msg.role !== "assistant" || msg.streaming) return "";
    const voiceBtn =
      isVoiceChatMode() && !msg.lane && String(msg.content || "").trim()
        ? `
        <button type="button" class="lab-msg-act-btn" data-voice-play-index="${index}" title="播放语音" aria-label="播放语音">
          ${LAB_MSG_ICON_VOICE}
        </button>
      `
        : "";
    return `
      <div class="lab-msg-actions" role="toolbar" aria-label="消息操作">
        ${voiceBtn}
        <button type="button" class="lab-msg-act-btn" data-copy-index="${index}" title="复制" aria-label="复制">
          ${LAB_MSG_ICON_COPY}
        </button>
        <button type="button" class="lab-msg-act-btn" data-share-index="${index}" title="分享" aria-label="分享">
          ${LAB_MSG_ICON_SHARE}
        </button>
        <button type="button" class="lab-msg-act-btn" data-regenerate-index="${index}" title="重新生成" aria-label="重新生成">
          ${LAB_MSG_ICON_REGEN}
        </button>
      </div>
    `;
  }

  function getChatEmptyHtml() {
    const needsKey = !hasAnyPlatformApiKey();
    const needsModel = !hasAnyChatModel();
    const battle = isBattleChatMode();
    const agent = isAgentPanelMode();
    const subtitle = needsKey
      ? "请先在左侧任一平台填写 API 密钥与地址，或直接选择下方快捷话题开始。"
      : needsModel
        ? "请在平台配置中拉取并勾选启用模型，顶部下拉将按平台分组显示。"
        : battle
          ? "对战模式：同一问题将并排对比两个模型的回复，请在顶部选择两个模型。"
          : agent
            ? "Arena Agent：执行过程、文件步骤与预览都在本条模型回复里，生成完成后向上滚动查看即可。"
            : "在顶部选择「平台 · 模型」开始对话，各平台 API 互不影响。";
    const title = battle ? "开始对战" : agent ? "开始生成" : "开始对话";
    return `
      <div class="lab-chat-empty">
        <div class="lab-chat-empty-hero">
          <div class="lab-chat-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M7 9h10M7 13h6M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v9A2.5 2.5 0 0 1 16.5 17H11l-4 3.5V17H7.5A2.5 2.5 0 0 1 5 14.5v-9z" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <div class="lab-chat-starters" role="list">${renderChatStarterCards()}</div>
      </div>
    `;
  }

  function renderMessageArticle(msg, index, { inBattleCol = false } = {}) {
    const role = msg.role === "user" || msg.role === "assistant" ? msg.role : "assistant";
    const provider = role !== "user" ? resolveMessageProvider(msg, index) : null;
    const label =
      msg.role === "user" ? "你" : msg.role === "system" ? "系统" : provider ? displayProviderName(provider) : "AI";
    const avatar = renderChatMessageAvatar(msg, role, index);
    const meta = msg.meta ? `<span class="lab-msg-meta">${escapeHtml(msg.meta)}</span>` : "";
    const streamingAttr = msg.streaming
      ? msg.lane
        ? ` data-streaming="1" data-streaming-lane="${escapeHtml(msg.lane)}"`
        : ' data-streaming="1"'
      : "";
    const bodyHtml = renderMessageBody(msg);
    const bodyBlock =
      role === "assistant"
        ? renderAssistantBodyBlock(msg, index, bodyHtml)
        : `<div class="lab-msg-body">${bodyHtml}</div>`;
    const colClass = inBattleCol ? " lab-msg--battle-col" : "";
    const thinkPending = role === "assistant" && isThinkPending(msg);
    return `
      <article class="lab-msg lab-msg--${role}${colClass}${thinkPending ? " is-think-pending" : ""}" data-msg-index="${index}"${streamingAttr}>
        ${avatar}
        <div class="lab-msg-content">
          <header class="lab-msg-head">
            <span class="lab-msg-name">${label}</span>
            ${meta}
          </header>
          ${bodyBlock}
        </div>
      </article>
    `;
  }

  function renderBattleColWaiting(_lane, streaming) {
    if (!streaming) {
      return `<div class="lab-battle-col-wait">等待回复…</div>`;
    }
    const pseudo = { role: "assistant", streaming: true, reasoning: "", content: "", hadThinking: true };
    return `<div class="lab-battle-col-wait is-streaming"><div class="lab-battle-think-wrap">${renderThinkingPanel(pseudo)}</div></div>`;
  }

  function renderBattleReplyRow(primaryIdx, battleIdx) {
    const primaryMsg = primaryIdx >= 0 ? labChatMessages[primaryIdx] : null;
    const battleMsg = battleIdx >= 0 ? labChatMessages[battleIdx] : null;
    const primaryStreaming = Boolean(primaryMsg?.streaming);
    const battleStreaming = Boolean(battleMsg?.streaming);
    return `
      <div class="lab-battle-row">
        <div class="lab-battle-col lab-battle-col--primary">
          ${
            primaryMsg
              ? renderMessageArticle(primaryMsg, primaryIdx, { inBattleCol: true })
              : renderBattleColWaiting("primary", primaryStreaming || battleStreaming)
          }
        </div>
        <div class="lab-battle-col lab-battle-col--battle">
          ${
            battleMsg
              ? renderMessageArticle(battleMsg, battleIdx, { inBattleCol: true })
              : renderBattleColWaiting("battle", primaryStreaming || battleStreaming)
          }
        </div>
      </div>
    `;
  }

  function renderBattleChatMessagesHtml() {
    let turnsHtml = "";
    let i = 0;
    while (i < labChatMessages.length) {
      const msg = labChatMessages[i];
      if (msg.role === "user") {
        turnsHtml += `<div class="lab-battle-turn">${renderMessageArticle(msg, i)}`;
        i += 1;
        let primaryIdx = -1;
        let battleIdx = -1;
        while (i < labChatMessages.length) {
          const next = labChatMessages[i];
          if (next.role === "user") break;
          if (next.role === "assistant" && !next.lane) {
            turnsHtml += renderMessageArticle(next, i);
            i += 1;
            continue;
          }
          if (next.role === "assistant" && next.lane === "primary" && primaryIdx < 0) {
            primaryIdx = i;
            i += 1;
            continue;
          }
          if (next.role === "assistant" && next.lane === "battle" && battleIdx < 0) {
            battleIdx = i;
            i += 1;
            continue;
          }
          break;
        }
        if (primaryIdx >= 0 || battleIdx >= 0) {
          turnsHtml += renderBattleReplyRow(primaryIdx, battleIdx);
        }
        turnsHtml += `</div>`;
        continue;
      }
      turnsHtml += renderMessageArticle(msg, i);
      i += 1;
    }
    return `
      <div class="lab-battle-board">
        <div class="lab-battle-turns">${turnsHtml}</div>
      </div>
    `;
  }

  function renderNormalChatMessagesHtml() {
    return labChatMessages.map((msg, index) => renderMessageArticle(msg, index)).join("");
  }

  function renderChatMessages() {
    if (!labEls.labChatMessages) return;
    const battleMode = isBattleChatMode();
    const battleLayout = battleMode && labChatMessages.length > 0;
    labEls.labChatMessages.classList.toggle("is-battle-layout", battleLayout);
    labEls.labChatStage?.classList.toggle("is-battle-mode", battleMode);
    if (!labChatMessages.length) {
      labEls.labChatMessages.innerHTML = getChatEmptyHtml();
      syncAgentPreviewUi();
      return;
    }
    labEls.labChatMessages.innerHTML = battleLayout
      ? renderBattleChatMessagesHtml()
      : renderNormalChatMessagesHtml();
    finishChatMessagesRender();
    syncAgentPreviewUi();
    remountPreviewFrames();
  }

  function setLabBusy(busy) {
    labEls.labSend?.toggleAttribute("disabled", busy);
    if (labEls.labStop) {
      labEls.labStop.hidden = !busy;
      labEls.labStop.disabled = !busy;
    }
  }

  async function testConnection() {
    persistFormConfig();
    const baseUrl = labState.baseUrl;
    const apiKey = labState.apiKey;
    if (!baseUrl || !apiKey) {
      setLabStatus("请先填写 API 密钥与地址", "error");
      return;
    }
    labStatusExpanded = false;
    setLabStatus("正在测试连接…");
    labEls.labTestConnection?.setAttribute("disabled", "true");
    try {
      const res = await fetch(`${baseUrl}/models`, { headers: apiHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const err = new Error(data.error?.message || `HTTP ${res.status}`);
        const formatted = formatApiError(err, res.status);
        setLabStatus(formatted.text, "error", { expanded: true, kind: formatted.kind });
        return;
      }
      setLabStatus("连接成功", "ok");
      markProfileUserConfigured();
      if (labState.autoFetchOnTest !== false) {
        await fetchModelList({ silent: true });
      }
    } catch (error) {
      const formatted = formatApiError(error);
      setLabStatus(formatted.text, "error", { expanded: true, kind: formatted.kind });
    } finally {
      labEls.labTestConnection?.removeAttribute("disabled");
    }
  }

  async function fetchModelList({ silent = false } = {}) {
    persistFormConfig();
    if (!labState.baseUrl) {
      setLabStatus("请填写 Base URL", "error");
      return;
    }
    if (!labState.apiKey) {
      setLabStatus("请填写 API Key", "error");
      return;
    }

    if (!silent) {
      labStatusExpanded = false;
      setLabStatus("正在获取模型列表…");
    }
    labEls.labFetchModels?.setAttribute("disabled", "true");

    try {
      const res = await fetch(`${labState.baseUrl}/models`, { headers: apiHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error?.message || data.message || `HTTP ${res.status}`);
        const formatted = formatApiError(err, res.status);
        if (!silent) setLabStatus(formatted.text, "error", { expanded: true, kind: formatted.kind });
        return;
      }
      const list = (data.data || [])
        .map((item) => ({ id: item.id, created: item.created }))
        .filter((item) => item.id)
        .sort((a, b) => a.id.localeCompare(b.id));
      labState.fetchedModels = list;
      markProfileUserConfigured();
      saveLabState();
      renderModelLists();
      if (!silent) setLabStatus(`已获取 ${list.length} 个模型`, "ok");
    } catch (error) {
      const formatted = formatApiError(error);
      if (!silent) setLabStatus(formatted.text, "error", { expanded: true, kind: formatted.kind });
    } finally {
      labEls.labFetchModels?.removeAttribute("disabled");
    }
  }

  function addFreeModels() {
    const freeIds = (labState.fetchedModels || [])
      .map((m) => m.id)
      .filter((id) => isFreeModel(id));
    freeIds.forEach((id) => {
      if (!labState.enabledModels.includes(id)) labState.enabledModels.push(id);
    });
    saveLabState();
    renderModelLists();
    renderChatModelSelect();
    setLabStatus(`已加入 ${freeIds.length} 个免费模型`, "ok");
  }

  function clearProviderModelCache(providerId = labState.providerId) {
    if (!providerId) return false;
    const provider = labProviders.find((p) => p.id === providerId);
    flushActiveProfile();
    const profile = ensureProfile(providerId, provider);
    profile.fetchedModels = [];
    profile.enabledModels = [];
    profile.pinnedModels = [];
    profile.selectedModel = "";
    if (labState.providerId === providerId) {
      labState.fetchedModels = [];
      labState.enabledModels = [];
      labState.selectedModel = "";
      labModelSearchQuery = "";
      if (labEls.labModelSearch) labEls.labModelSearch.value = "";
    }
    saveLabState();
    if (labState.providerId === providerId) {
      renderModelLists();
      renderChatModelSelect();
    }
    renderStudioList();
    const name = provider?.name || providerId;
    setLabStatus(`已清空 ${name} 的模型缓存`, "ok");
    return true;
  }

  function clearEnabledModels() {
    labState.enabledModels = [];
    saveLabState();
    renderModelLists();
    renderChatModelSelect();
    setLabStatus("已清空试验场模型");
  }

  function parseSseChunk(buffer, onPart) {
    const lines = buffer.split("\n");
    const rest = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        const delta = json.choices?.[0]?.delta;
        if (!delta) continue;
        const reasoning = delta.reasoning_content ?? delta.reasoning;
        if (reasoning) onPart({ type: "reasoning", text: reasoning });
        if (delta.content) onPart({ type: "content", text: delta.content });
      } catch {
        /* ignore partial json */
      }
    }
    return rest;
  }

  function markThinkingAnswerStart(msg) {
    if (!msg.thinkingEndedAt) msg.thinkingEndedAt = Date.now();
    msg.hadThinking = true;
  }

  function createStreamingAssistantMsg({ metaLabel, providerId, model, lane } = {}) {
    return {
      role: "assistant",
      content: "",
      reasoning: "",
      streaming: true,
      hadThinking: false,
      thinkingStartedAt: Date.now(),
      thinkingEndedAt: null,
      meta: metaLabel || model,
      providerId: providerId || "",
      modelId: model || "",
      lane: lane || ""
    };
  }

  async function sendChatStream(baseUrl, model, messages, { apiKey, providerId, metaLabel, lane, assistantMsg, signal } = {}) {
    const msg = assistantMsg || createStreamingAssistantMsg({ metaLabel, providerId, model, lane });
    if (!assistantMsg) {
      if (lane) msg.lane = lane;
      labChatMessages.push(msg);
      renderChatMessages();
      startThinkingStatusTicker();
    }

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: apiHeaders({ apiKey, providerId }),
      signal: signal || labAbortController?.signal,
      body: JSON.stringify({
        model,
        messages,
        temperature: labState.temperature,
        max_tokens: labState.maxTokens,
        stream: true
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || `HTTP ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("浏览器不支持流式读取");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      buffer = parseSseChunk(buffer, (part) => {
        if (part.type === "reasoning") {
          if (!msg.reasoning) msg.hadThinking = true;
          msg.reasoning = (msg.reasoning || "") + part.text;
          updateStreamingReasoning(msg.reasoning, msg.lane || null, msg);
          return;
        }
        if (part.type === "content" && part.text) {
          if (!msg.content) markThinkingAnswerStart(msg);
          msg.content += part.text;
          updateStreamingBubble(msg.content, msg.lane || null, msg);
        }
      });
    }

    if (!msg.thinkingEndedAt) msg.thinkingEndedAt = Date.now();
    if (isThinkPending(msg) || (msg.reasoning || "").trim()) msg.hadThinking = true;
    delete msg.streaming;
    saveLabSession();
    renderChatMessages();
    maybeSpeakAssistant(msg);
  }

  async function sendChatOnce(baseUrl, model, messages, { apiKey, providerId, metaLabel, lane, assistantMsg, signal } = {}) {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: apiHeaders({ apiKey, providerId }),
      signal: signal || labAbortController?.signal,
      body: JSON.stringify({
        model,
        messages,
        temperature: labState.temperature,
        max_tokens: labState.maxTokens,
        stream: false
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    const reply = data.choices?.[0]?.message?.content || "(空回复)";
    const reasoning =
      data.choices?.[0]?.message?.reasoning_content ??
      data.choices?.[0]?.message?.reasoning ??
      "";
    const usage = data.usage;
    if (assistantMsg) {
      assistantMsg.content = reply;
      if (reasoning) assistantMsg.reasoning = reasoning;
      assistantMsg.meta = metaLabel || model;
      assistantMsg.providerId = providerId || assistantMsg.providerId;
      assistantMsg.modelId = model || assistantMsg.modelId;
      if (!assistantMsg.thinkingEndedAt) assistantMsg.thinkingEndedAt = Date.now();
      if ((assistantMsg.reasoning || "").trim() || assistantMsg.hadThinking) assistantMsg.hadThinking = true;
      delete assistantMsg.streaming;
    } else {
      labChatMessages.push({
        role: "assistant",
        content: reply,
        meta: metaLabel || model,
        providerId: providerId || "",
        modelId: model || "",
        lane: lane || ""
      });
    }
    saveLabSession();
    renderChatMessages();
    if (assistantMsg) maybeSpeakAssistant(assistantMsg);
    else maybeSpeakAssistant(labChatMessages[labChatMessages.length - 1]);
    if (usage && !lane) {
      setLabUsage(
        `tokens: ${usage.prompt_tokens ?? "—"} + ${usage.completion_tokens ?? "—"} = ${usage.total_tokens ?? "—"}`
      );
    }
    return data;
  }

  function finalizeStreamingMessages({ aborted = false, errorText = "" } = {}) {
    labChatMessages.forEach((msg) => {
      if (!msg.streaming) return;
      if (!msg.thinkingEndedAt) msg.thinkingEndedAt = Date.now();
      if (isThinkPending(msg) || (msg.reasoning || "").trim()) msg.hadThinking = true;
      delete msg.streaming;
      if (!msg.content) {
        msg.content = aborted ? "(已停止)" : errorText || "(生成失败)";
      }
    });
    saveLabSession();
    renderChatMessages();
  }

  function isChatBusy() {
    return Boolean(labAbortController) || Boolean(labEls.labSend?.disabled);
  }

  function formatShareText(msg, index) {
    const provider = resolveMessageProvider(msg, index);
    const title = provider ? `${displayProviderName(provider)} 回复` : "AI 回复";
    const meta = msg.meta ? `\n> ${msg.meta}\n` : "\n";
    return `# ${title}${meta}\n${(msg.content || "").trim()}\n`;
  }

  async function shareAssistantMessage(index, anchor) {
    const msg = labChatMessages[index];
    if (!msg || msg.role !== "assistant" || msg.streaming) return;
    const text = (msg.content || "").trim();
    if (!text) {
      showCopyToast(anchor, "暂无内容可分享", "error");
      return;
    }
    const provider = resolveMessageProvider(msg, index);
    const title = provider ? `${displayProviderName(provider)} 回复` : "AI 回复";
    const shareText = formatShareText(msg, index);

    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        showCopyToast(anchor, "已分享", "ok");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      const blob = new Blob([shareText], { type: "text/markdown;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `neux-reply-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(a.href);
      showCopyToast(anchor, "已下载分享文件", "ok");
    } catch {
      await copyToClipboard(text, { anchor });
    }
  }

  async function regenerateAssistantMessage(assistantIndex, anchor) {
    if (isChatBusy()) {
      showCopyToast(anchor, "请等待当前生成结束", "error");
      return;
    }
    const assistantMsg = labChatMessages[assistantIndex];
    if (!assistantMsg || assistantMsg.role !== "assistant" || assistantMsg.streaming) return;

    let userIndex = -1;
    for (let i = assistantIndex - 1; i >= 0; i--) {
      if (labChatMessages[i].role === "user") {
        userIndex = i;
        break;
      }
    }
    if (userIndex < 0) {
      showCopyToast(anchor, "找不到对应的提问", "error");
      return;
    }

    const userMsg = labChatMessages[userIndex];
    const providerId = assistantMsg.providerId || userMsg.providerId || labState.chatProviderId;
    const modelId = assistantMsg.modelId || userMsg.modelId || labState.chatModelId;
    const lane = assistantMsg.lane || "";
    if (!providerId || !modelId) {
      showCopyToast(anchor, "请先选择对话模型", "error");
      return;
    }

    labChatMessages.splice(assistantIndex);
    saveLabSession();
    renderChatMessages();

    if (lane === "primary" || lane === "battle") {
      if (lane === "primary") {
        labState.chatProviderId = providerId;
        labState.chatModelId = modelId;
      } else {
        labState.battleChatProviderId = providerId;
        labState.battleChatModelId = modelId;
      }
      saveLabState();
      renderChatModelSelect();
      showCopyToast(anchor, "正在重新生成…", "ok");
      await requestAssistantReply({ providerId, modelId, lane });
      return;
    }

    labState.chatProviderId = providerId;
    labState.chatModelId = modelId;
    saveLabState();
    renderChatModelSelect();

    showCopyToast(anchor, "正在重新生成…", "ok");
    await requestAssistantReply({ providerId, modelId });
  }

  function validateChatTarget(target) {
    if (!target) {
      setLabStatus("请先在任一平台拉取并启用模型，再在顶部选择对话模型", "error");
      return null;
    }
    const creds = getProviderCredentials(target.providerId);
    if (!creds) {
      setLabStatus("所选平台不存在", "error");
      return null;
    }
    if (!creds.enabled) {
      setLabStatus(`${displayProviderName(creds.provider)} 已关闭，请打开右上角开关`, "error");
      return null;
    }
    const baseUrl = creds.baseUrl;
    const apiKey = creds.apiKey;
    if (!baseUrl || !apiKey) {
      setLabStatus(`请先在「${displayProviderName(creds.provider)}」填写 API 密钥与地址`, "error");
      return null;
    }
    return { target, creds, baseUrl, apiKey, model: target.modelId };
  }

  async function requestAssistantReply(targetOverride) {
    flushActiveProfile();
    const target =
      targetOverride?.providerId && targetOverride?.modelId
        ? { providerId: targetOverride.providerId, modelId: targetOverride.modelId }
        : getChatModelTarget();
    const lane = targetOverride?.lane || "";
    const validated = validateChatTarget(target);
    if (!validated) return false;
    const { creds, baseUrl, apiKey, model } = validated;
    const metaLabel = `${displayProviderName(creds.provider)} · ${model}`;

    if (!lane) {
      labState.chatProviderId = target.providerId;
      labState.chatModelId = target.modelId;
      creds.profile.selectedModel = model;
      saveLabState();
    }

    labAbortController = new AbortController();
    const signal = labAbortController.signal;
    const chatOpts = { apiKey, providerId: target.providerId, metaLabel, lane, signal };
    let assistantMsg = null;

    if (lane) {
      assistantMsg = createStreamingAssistantMsg({
        metaLabel,
        providerId: target.providerId,
        model,
        lane
      });
      labChatMessages.push(assistantMsg);
      chatOpts.assistantMsg = assistantMsg;
      renderChatMessages();
      startThinkingStatusTicker();
    }

    setLabBusy(true);
    setLabStatus(labState.stream ? "流式生成中…" : "正在请求模型…");
    setLabUsage("");

    try {
      const messages = buildApiMessages(lane || null);
      if (!labState.stream && !lane) {
        assistantMsg = createStreamingAssistantMsg({
          metaLabel,
          providerId: target.providerId,
          model,
          lane: ""
        });
        labChatMessages.push(assistantMsg);
        chatOpts.assistantMsg = assistantMsg;
        renderChatMessages();
        startThinkingStatusTicker();
      }
      if (labState.stream) {
        await sendChatStream(baseUrl, model, messages, chatOpts);
        if (!lane) setLabStatus("流式完成", "ok");
      } else {
        await sendChatOnce(baseUrl, model, messages, chatOpts);
        if (!lane) setLabStatus("完成", "ok");
      }
      return true;
    } catch (error) {
      if (error.name === "AbortError") {
        finalizeStreamingMessages({ aborted: true });
        setLabStatus("已停止生成");
        return false;
      }
      if (assistantMsg) {
        labChatMessages.splice(labChatMessages.indexOf(assistantMsg), 1);
      } else if (labChatMessages[labChatMessages.length - 1]?.streaming) {
        labChatMessages.pop();
      }
      saveLabSession();
      renderChatMessages();
      const formatted = formatApiError(error);
      setLabStatus(`对话失败：${formatted.text}`, "error", { expanded: true, kind: formatted.kind });
      return false;
    } finally {
      labAbortController = null;
      setLabBusy(false);
    }
  }

  async function requestBattleReplies() {
    flushActiveProfile();
    const primaryTarget = getChatModelTarget();
    const battleTarget = getBattleChatModelTarget();
    const primaryValidated = validateChatTarget(primaryTarget);
    const battleValidated = validateChatTarget(battleTarget);
    if (!primaryValidated || !battleValidated) return false;

    if (
      primaryTarget.providerId === battleTarget.providerId &&
      primaryTarget.modelId === battleTarget.modelId
    ) {
      setLabStatus("对战模式请选择两个不同的模型", "error");
      return false;
    }

    labState.chatProviderId = primaryTarget.providerId;
    labState.chatModelId = primaryTarget.modelId;
    labState.battleChatProviderId = battleTarget.providerId;
    labState.battleChatModelId = battleTarget.modelId;
    primaryValidated.creds.profile.selectedModel = primaryTarget.modelId;
    battleValidated.creds.profile.selectedModel = battleTarget.modelId;
    saveLabState();

    const primaryMeta = `${displayProviderName(primaryValidated.creds.provider)} · ${primaryTarget.modelId}`;
    const battleMeta = `${displayProviderName(battleValidated.creds.provider)} · ${battleTarget.modelId}`;

    const primaryMsg = createStreamingAssistantMsg({
      metaLabel: primaryMeta,
      providerId: primaryTarget.providerId,
      model: primaryTarget.modelId,
      lane: "primary"
    });
    const battleMsg = createStreamingAssistantMsg({
      metaLabel: battleMeta,
      providerId: battleTarget.providerId,
      model: battleTarget.modelId,
      lane: "battle"
    });
    labChatMessages.push(primaryMsg, battleMsg);
    renderChatMessages();
    startThinkingStatusTicker();

    labAbortController = new AbortController();
    const signal = labAbortController.signal;

    setLabBusy(true);
    setLabStatus(labState.stream ? "双模型流式生成中…" : "正在请求两个模型…");
    setLabUsage("");

    const runLane = async (validated, target, msg, lane, metaLabel) => {
      const messages = buildApiMessages(lane);
      const chatOpts = {
        apiKey: validated.apiKey,
        providerId: target.providerId,
        metaLabel,
        lane,
        assistantMsg: msg,
        signal
      };
      if (labState.stream) {
        await sendChatStream(validated.baseUrl, target.modelId, messages, chatOpts);
      } else {
        await sendChatOnce(validated.baseUrl, target.modelId, messages, chatOpts);
      }
    };

    try {
      const results = await Promise.allSettled([
        runLane(primaryValidated, primaryTarget, primaryMsg, "primary", primaryMeta),
        runLane(battleValidated, battleTarget, battleMsg, "battle", battleMeta)
      ]);
      let aborted = false;
      let failed = 0;
      results.forEach((result, idx) => {
        const msg = idx === 0 ? primaryMsg : battleMsg;
        if (result.status === "fulfilled") return;
        if (result.reason?.name === "AbortError") {
          aborted = true;
          delete msg.streaming;
          if (!msg.content) msg.content = "(已停止)";
          return;
        }
        failed += 1;
        delete msg.streaming;
        const formatted = formatApiError(result.reason);
        msg.content = msg.content || `生成失败：${formatted.text}`;
      });
      saveLabSession();
      renderChatMessages();
      if (aborted) {
        setLabStatus("已停止生成");
        return false;
      }
      if (failed === 2) {
        setLabStatus("两个模型均请求失败", "error");
        return false;
      }
      if (failed === 1) {
        setLabStatus("一个模型已完成，另一个失败", "error");
        return true;
      }
      setLabStatus(labState.stream ? "对战流式完成" : "对战完成", "ok");
      return true;
    } catch (error) {
      finalizeStreamingMessages({
        aborted: error.name === "AbortError",
        errorText: error.name === "AbortError" ? "" : `生成失败：${formatApiError(error).text}`
      });
      const formatted = formatApiError(error);
      setLabStatus(`对战失败：${formatted.text}`, "error", { expanded: true, kind: formatted.kind });
      return false;
    } finally {
      labAbortController = null;
      setLabBusy(false);
    }
  }

  function parseAgentCodegenPayload(text) {
    const raw = String(text || "").trim();
    let data;
    const tryParse = (source) => JSON.parse(source);
    try {
      data = tryParse(raw);
    } catch {
      const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (fenced) {
        data = tryParse(fenced[1].trim());
      } else {
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start < 0 || end <= start) throw new Error("模型返回不是有效 JSON");
        data = tryParse(raw.slice(start, end + 1));
      }
    }
    if (!data?.files || typeof data.files !== "object" || !data.files["index.html"]) {
      throw new Error("模型 JSON 缺少 files.index.html");
    }
    return {
      title: String(data.title || "模型生成项目").trim(),
      files: data.files
    };
  }

  async function requestAgentCodegen(prompt, plan, validated, signal, { retryHint = "" } = {}) {
    const { baseUrl, apiKey, model, target } = validated;
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: apiHeaders({ apiKey, providerId: target.providerId }),
      signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: AGENT_CODEGEN_SYSTEM },
          {
            role: "user",
            content: `User request:\n${prompt}\n\nImplementation plan:\n${plan || "(no plan)"}${retryHint ? `\n\nCorrection:\n${retryHint}` : ""}`
          }
        ],
        temperature: Math.min(0.55, Number(labState.temperature ?? 0.55)),
        max_tokens: Math.min(12000, Math.max(4096, Number(labState.maxTokens || 8192)))
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    const content = data.choices?.[0]?.message?.content || "";
    if (!content.trim()) throw new Error("模型未返回代码内容");
    return parseAgentCodegenPayload(content);
  }

  async function requestAgentCodegenWithRetry(prompt, plan, validated, signal) {
    try {
      return await requestAgentCodegen(prompt, plan, validated, signal);
    } catch (firstError) {
      return await requestAgentCodegen(prompt, plan, validated, signal, {
        retryHint: `Previous response was invalid: ${firstError.message}. Return valid JSON only. Match the user request exactly.`
      });
    }
  }

  async function requestAgentPlan(prompt, validated, signal) {
    const { baseUrl, apiKey, model, target, creds } = validated;
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: apiHeaders({ apiKey, providerId: target.providerId }),
      signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an autonomous product engineer (Arena-style). Write a concise plan for a static web project that implements EXACTLY what the user asked — do not swap in a different app or game. Include features, UI, interactions, and files (HTML/CSS/JS). For games: require start screen (开始游戏), pause/stop controls (暂停/停止), and game-over restart — do NOT auto-start on load. Under 200 words."
          },
          { role: "user", content: prompt }
        ],
        temperature: Math.min(1, Number(labState.temperature ?? 0.7)),
        max_tokens: Math.min(900, Number(labState.maxTokens || 2048)),
        stream: false
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error?.message || data.message || `HTTP ${res.status}`);
    return {
      text: data.choices?.[0]?.message?.content || "",
      providerName: displayProviderName(creds.provider)
    };
  }

  async function agentToolRequest(path, body) {
    const res = await fetch(path, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || !payload.ok) throw new Error(payload.error || `HTTP ${res.status}`);
    return payload;
  }

  async function loadLatestAgentProject({ silent = false } = {}) {
    try {
      const payload = await agentToolRequest("/api/agent/projects");
      const latest = payload.projects?.[0];
      if (!latest) {
        if (!silent) setSessionNotice("还没有 Agent 项目，请先发送项目需求", "error");
        return null;
      }
      setAgentStateFromResult(latest, labAgentState.modelLabel, { attachMessage: false });
      await refreshAgentSiteTree({ silent: true });
      return latest;
    } catch (error) {
      if (!silent) setSessionNotice(`读取 Agent 工作区失败：${error.message}`, "error");
      return null;
    }
  }

  async function requestAgentReply(prompt, target) {
    flushActiveProfile();
    const validated = validateChatTarget(target);
    if (!validated) return false;
    const { creds, model } = validated;
    const metaLabel = `${displayProviderName(creds.provider)} · ${model} · Agent Mode`;

    labState.chatProviderId = target.providerId;
    labState.chatModelId = target.modelId;
    creds.profile.selectedModel = model;
    saveLabState();
    renderChatModelSelect();
    labAgentState.modelLabel = metaLabel;
    syncAgentPreviewUi();

    labAbortController = new AbortController();
    const signal = labAbortController.signal;
    const assistantMsg = {
      role: "assistant",
      content: "",
      providerId: target.providerId,
      modelId: target.modelId,
      meta: metaLabel,
      streaming: true,
      thinkingStartedAt: Date.now(),
      hadThinking: true,
      previewUrl: "",
      agentTrace: initAgentTrace(prompt)
    };
    labChatMessages.push(assistantMsg);
    renderChatMessages();
    setLabBusy(true);
    setLabStatus("Arena Agent：规划后多轮改文件…");

    let plan = "";
    let planNote = "";
    try {
      const planned = await requestAgentPlan(prompt, validated, signal);
      plan = planned.text;
      planNote = "模型规划完成";
      assistantMsg.agentTrace.plan = plan;
      assistantMsg.agentTrace.planNote = planNote;
      updateAgentTraceStep(assistantMsg.agentTrace, "plan", {
        state: "done",
        detail: planNote,
        planText: plan
      });
      renderChatMessages();
    } catch (error) {
      planNote = `模型规划未完成，继续生成代码：${error.message}`;
      assistantMsg.agentTrace.planNote = planNote;
      updateAgentTraceStep(assistantMsg.agentTrace, "plan", {
        state: "done",
        detail: planNote,
        planText: ""
      });
      renderChatMessages();
    }

    try {
      const result = await runArenaAgentLoop(prompt, plan, validated, signal, assistantMsg);
      setAgentStateFromResult(result, metaLabel, { attachMessage: false });
      delete assistantMsg.streaming;
      assistantMsg.thinkingEndedAt = Date.now();
      finalizeAgentTraceFromResult(assistantMsg.agentTrace, result, { plan, planNote });
      const htmlCheck = await validateWorkspaceIndexHtml(
        result.name || assistantMsg.agentTrace?.workspaceId || ""
      );
      if (htmlCheck.ok && result.previewUrl) {
        assistantMsg.previewUrl = new URL(result.previewUrl, location.origin).href;
        assistantMsg.previewTitle = result.title || result.name || "Agent 项目预览";
        assistantMsg.previewRevision = Date.now();
      } else {
        assistantMsg.previewUrl = "";
        assistantMsg.content =
          `Arena Agent 已结束，但页面未完整生成（${htmlCheck.reason || "校验失败"}）。\n\n` +
          `请重新发送需求，或说明「继续补全 index.html」。\n\n` +
          `- 工作区：${result.path}`;
        saveLabSession();
        renderChatMessages();
        setLabStatus("页面未写完，请重试", "error");
        return false;
      }
      const turnCount = (assistantMsg.agentTrace.logs || []).length;
      assistantMsg.content =
        `Arena Agent 已完成。\n\n` +
        `- 模型：${metaLabel}\n` +
        `- 工具步数：约 ${turnCount} 次\n` +
        `- 工作区：${result.path}\n\n` +
        `执行时间线、文件列表与内嵌预览都在本条回复上方，可展开查看每步思考、代码与 Diff。`;
      saveLabSession();
      renderChatMessages();
      focusLatestMessagePreview();
      setLabStatus("Arena Agent 已完成", "ok");
      return true;
    } catch (error) {
      labAgentState.running = false;
      delete assistantMsg.streaming;
      assistantMsg.thinkingEndedAt = Date.now();
      if (assistantMsg.agentTrace) {
        assistantMsg.agentTrace.status = "error";
        updateAgentTraceStep(assistantMsg.agentTrace, "arena-loop", {
          state: "error",
          detail: error.message
        });
      }
      assistantMsg.content =
        `Arena Agent 失败：${error.message}\n\n` +
        `请重试、把需求写得更具体，或换上下文更大的模型。本模式不会使用预设游戏模板。`;
      saveLabSession();
      renderChatMessages();
      setLabStatus(`Arena Agent 失败：${error.message}`, "error", { expanded: true });
      return false;
    } finally {
      labAgentState.running = false;
      syncAgentPreviewUi();
      stopThinkingStatusTicker();
      labAbortController = null;
      setLabBusy(false);
    }
  }

  async function sendChatMessage() {
    const prompt = labEls.labChatInput?.value?.trim();
    if (!prompt || isChatBusy()) return;

    ensureActiveSessionForMode(getStorageSessionModeKey());

    if (isAgentPanelMode()) {
      const target = getChatModelTarget();
      if (!target) {
        setLabStatus("请先在平台配置中拉取并启用模型，再在顶部选择 Agent 模型", "error");
        return;
      }
      labChatMessages.push({
        role: "user",
        content: prompt,
        providerId: target.providerId,
        modelId: target.modelId
      });
      labEls.labChatInput.value = "";
      renderChatMessages();
      const ok = await requestAgentReply(prompt, target);
      if (!ok && labChatMessages[labChatMessages.length - 1]?.role === "user") {
        labChatMessages.pop();
        saveLabSession();
        renderChatMessages();
      }
      return;
    }

    if (isBattleChatMode()) {
      const primaryTarget = getChatModelTarget();
      const battleTarget = getBattleChatModelTarget();
      if (!validateChatTarget(primaryTarget) || !validateChatTarget(battleTarget)) return;
      if (
        primaryTarget.providerId === battleTarget.providerId &&
        primaryTarget.modelId === battleTarget.modelId
      ) {
        setLabStatus("对战模式请选择两个不同的模型", "error");
        return;
      }
      labChatMessages.push({ role: "user", content: prompt });
      labEls.labChatInput.value = "";
      renderChatMessages();
      const ok = await requestBattleReplies();
      if (!ok && labChatMessages[labChatMessages.length - 1]?.role === "user") {
        labChatMessages.pop();
        saveLabSession();
        renderChatMessages();
      }
      return;
    }

    const target = getChatModelTarget();
    if (!target) {
      setLabStatus("请先在任一平台拉取并启用模型，再在顶部选择对话模型", "error");
      return;
    }

    labChatMessages.push({
      role: "user",
      content: prompt,
      providerId: target.providerId,
      modelId: target.modelId
    });
    labEls.labChatInput.value = "";
    renderChatMessages();

    const ok = await requestAssistantReply({ providerId: target.providerId, modelId: target.modelId });
    if (!ok && labChatMessages[labChatMessages.length - 1]?.role === "user") {
      labChatMessages.pop();
      saveLabSession();
      renderChatMessages();
    }
  }

  function stopGeneration() {
    labAbortController?.abort();
    stopThinkingStatusTicker();
    if (labChatMessages.some((m) => m.streaming)) {
      finalizeStreamingMessages({ aborted: true });
    }
  }

  function syncApiKeyVisibilityUi() {
    const input = labEls.labApiKey;
    const btn = labEls.labToggleKey;
    if (!input || !btn) return;
    const revealed = input.type === "text";
    btn.classList.toggle("is-revealed", revealed);
    btn.setAttribute("aria-pressed", revealed ? "true" : "false");
    btn.title = revealed ? "隐藏密钥" : "显示密钥";
    btn.setAttribute("aria-label", revealed ? "隐藏密钥" : "显示密钥");
  }

  function toggleApiKeyVisibility() {
    if (!labEls.labApiKey) return;
    labEls.labApiKey.type = labEls.labApiKey.type === "password" ? "text" : "password";
    syncApiKeyVisibilityUi();
  }

  function syncLabFormFromState() {
    pullActiveProfile();
    if (labEls.labBaseUrl) labEls.labBaseUrl.value = labState.baseUrl || "";
    if (labEls.labApiKey) {
      labEls.labApiKey.type = "password";
      labEls.labApiKey.value = labState.apiKey || "";
    }
    syncApiKeyVisibilityUi();
    if (labEls.labSystemPrompt) labEls.labSystemPrompt.value = labState.systemPrompt || "";
    if (labEls.labTemperature) labEls.labTemperature.value = String(labState.temperature ?? 0.7);
    if (labEls.labTempValue) labEls.labTempValue.textContent = Number(labState.temperature ?? 0.7).toFixed(1);
    if (labEls.labMaxTokens) labEls.labMaxTokens.value = String(labState.maxTokens ?? 2048);
    if (labEls.labStream) labEls.labStream.checked = labState.stream !== false;
    if (labEls.labModelSearch) labEls.labModelSearch.value = labModelSearchQuery;
    if (labEls.labProviderSearch) labEls.labProviderSearch.value = labProviderSearchQuery;
    updateApiPreview();
    renderStudioList();
    renderModelLists();
    renderChatModelSelect();
    renderChatMessages();
    renderSessionSelect();
    updateCustomProviderActions();
    syncMoreSettingsCollapse();
    syncSessionsPanelModeUi();
    syncChatModeUi();
    if (!isVoiceMode()) stopVoice();
    dispatchVoiceModeEvent();
    renderVoiceModePanel();
  }

  function normalizeChatMode(mode) {
    if (mode === "battle") return "battle";
    if (mode === "voice") return "voice";
    return "normal";
  }

  function syncChatModeUi() {
    const agent = isAgentPanelMode();
    const mode = agent ? "normal" : normalizeChatMode(labState.chatMode);
    if (agent) {
      labState.chatMode = "normal";
      labState.voiceMode = false;
    } else {
      labState.chatMode = mode;
      labState.voiceMode = mode === "voice";
    }
    if (labEls.labChatModeSwitch) labEls.labChatModeSwitch.hidden = agent;
    if (labEls.labVoiceModePanel) labEls.labVoiceModePanel.hidden = agent || mode !== "voice";
    labEls.labChatToolbar?.classList.toggle("is-battle-mode", !agent && mode === "battle");
    labEls.labChatToolbar?.classList.toggle("is-normal-mode", agent || mode === "normal");
    labEls.labChatToolbar?.classList.toggle("is-voice-mode", !agent && mode === "voice");
    [labEls.labNormalMode, labEls.labBattleMode, labEls.labVoiceMode].forEach((btn) => {
      if (!btn) return;
      const active = btn.dataset.chatMode === mode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    if (mode === "battle") ensureChatModelSelectionForSlot("battle");
    if (mode === "voice") {
      if (isLikelyTtsModel(labState.chatModelId)) {
        if (!labState.voiceTtsModelId) {
          labState.voiceTtsProviderId = labState.chatProviderId;
          labState.voiceTtsModelId = labState.chatModelId;
        }
        const textOptions = collectChatModelOptions({ textOnly: true });
        if (textOptions.length) {
          labState.chatProviderId = textOptions[0].providerId;
          labState.chatModelId = textOptions[0].modelId;
        }
      }
      ensureChatModelSelectionForSlot("primary");
      ensureVoiceTtsSelection();
    }
    syncChatModelPickVisibility();
    if (labEls.labChatModelTrigger) {
      labEls.labChatModelTrigger.setAttribute(
        "aria-label",
        mode === "voice" ? "选择文本对话模型" : "选择对话模型"
      );
    }
    renderVoiceModePanel();
    renderChatMessages();
  }

  function setChatMode(mode, { silent = false } = {}) {
    if (isAgentPanelMode()) return;
    const next = normalizeChatMode(mode);
    if (normalizeChatMode(labState.chatMode) === next) {
      syncChatModeUi();
      return;
    }
    if (next === "voice") {
      const textOptions = collectChatModelOptions({ textOnly: true });
      const ttsOptions = collectChatModelOptions({ ttsOnly: true });
      if (!textOptions.length) {
        if (!silent) setSessionNotice("未找到可用文本模型，请先启用非 TTS 的对话模型", "error");
        return;
      }
      if (!ttsOptions.length) {
        if (!silent) setSessionNotice("未找到可用 TTS 模型，请先启用含 tts/speech 的模型", "error");
        return;
      }
    }

    syncMessagesToSession();
    labState.chatMode = next;
    labState.voiceMode = next === "voice";
    if (next === "voice") {
      if (isLikelyTtsModel(labState.chatModelId)) {
        labState.voiceTtsProviderId = labState.chatProviderId;
        labState.voiceTtsModelId = labState.chatModelId;
        const textOptions = collectChatModelOptions({ textOnly: true });
        if (textOptions.length) {
          labState.chatProviderId = textOptions[0].providerId;
          labState.chatModelId = textOptions[0].modelId;
        }
      }
      ensureVoiceTtsSelection();
    }
    if (next === "battle") {
      ensureChatModelSelection();
      ensureChatModelSelectionForSlot("battle");
      renderChatModelSelect();
    } else {
      closeChatModelPanel("battle");
    }
    saveLabState();
    ensureActiveSessionForMode(next);
    labChatMessages = getActiveSessionMessages();
    syncChatModeUi();
    renderSessionList();
    renderChatMessages();
    setLabUsage("");
    if (!silent) {
      setSessionNotice(
        next === "battle" ? "已切换到对战会话" : next === "voice" ? "已切换到语音模式" : "已切换到普通会话",
        "ok"
      );
    }
  }

  let copyToastTimer = null;

  function showCopyToast(anchor, message = "已复制到剪贴板", type = "ok") {
    if (!anchor) {
      setLabStatus(message, type);
      return;
    }
    let toast = document.getElementById("labCopyToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "labCopyToast";
      toast.className = "lab-copy-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    if (copyToastTimer) {
      clearTimeout(copyToastTimer);
      copyToastTimer = null;
    }

    toast.textContent = message;
    toast.dataset.type = type;
    toast.hidden = false;
    toast.classList.remove("is-visible");
    toast.style.visibility = "hidden";
    toast.style.left = "-9999px";
    toast.style.top = "0";
    toast.style.transform = "none";

    const { width: toastW, height: toastH } = toast.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();
    const gap = 8;
    let left = Math.round(rect.left - toastW - gap);
    let top = Math.round(rect.top + (rect.height - toastH) / 2);

    if (left < 8) {
      left = Math.round(rect.right + gap);
    }
    top = Math.max(8, Math.min(top, window.innerHeight - toastH - 8));

    toast.style.left = `${left}px`;
    toast.style.top = `${top}px`;
    toast.style.transform = "none";
    toast.style.visibility = "";

    requestAnimationFrame(() => toast.classList.add("is-visible"));

    copyToastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 1800);
  }

  async function copyToClipboard(text, { anchor } = {}) {
    try {
      await navigator.clipboard.writeText(text);
      if (anchor) showCopyToast(anchor, "已复制到剪贴板", "ok");
      else setLabStatus("已复制到剪贴板", "ok");
    } catch {
      if (anchor) showCopyToast(anchor, "复制失败", "error");
      else setLabStatus("复制失败", "error");
    }
  }

  function refreshLabEls() {
    const root = document.querySelector("#lab");
    if (!root) return;
    labEls.labPage = labEls.labPage || document.querySelector("#lab");
    labEls.labProviderList = root.querySelector("#labProviderList");
    labEls.labProviderSearch = root.querySelector("#labProviderSearch");
    labEls.labStudioHead = root.querySelector("#labStudioHead");
    labEls.labProviderEnabled = root.querySelector("#labProviderEnabled");
    labEls.labApiPreview = root.querySelector("#labApiPreview");
    labEls.labAddProvider = root.querySelector("#labAddProvider");
    labEls.labCustomNameField = root.querySelector("#labCustomNameField");
    labEls.labCustomProviderName = root.querySelector("#labCustomProviderName");
    labEls.labStudioApiGrid = root.querySelector("#labStudioApiGrid");
    labEls.labBaseUrl = root.querySelector("#labBaseUrl");
    labEls.labApiKey = root.querySelector("#labApiKey");
    labEls.labToggleKey = root.querySelector("#labToggleKey");
    labEls.labTestConnection = root.querySelector("#labTestConnection");
    labEls.labFetchModels = root.querySelector("#labFetchModels");
    labEls.labClearModelCache = root.querySelector("#labClearModelCache");
    labEls.labSelectFree = root.querySelector("#labSelectFree");
    labEls.labClearEnabled = root.querySelector("#labClearEnabled");
    labEls.labModelSearch = root.querySelector("#labModelSearch");
    labEls.labModelFilters = root.querySelector("#labModelFilters");
    labEls.labFetchedModels = root.querySelector("#labFetchedModels");
    labEls.labEnabledModels = root.querySelector("#labEnabledModels");
    labEls.labEnabledWrap = root.querySelector("#labEnabledWrap");
    labEls.labSystemPrompt = root.querySelector("#labSystemPrompt");
    labEls.labTemperature = root.querySelector("#labTemperature");
    labEls.labTempValue = root.querySelector("#labTempValue");
    labEls.labMaxTokens = root.querySelector("#labMaxTokens");
    labEls.labStream = root.querySelector("#labStream");
    labEls.labChatModel = root.querySelector("#labChatModel");
    labEls.labChatModelPick = root.querySelector("#labChatModelPick");
    labEls.labChatModelMenu = root.querySelector("#labChatModelMenu");
    labEls.labChatModelTrigger = root.querySelector("#labChatModelTrigger");
    labEls.labChatModelTriggerText = root.querySelector("#labChatModelTriggerText");
    labEls.labChatModelPlatform = root.querySelector("#labChatModelPlatform");
    labEls.labChatModelPanel = root.querySelector("#labChatModelPanel");
    labEls.labChatModelList = root.querySelector("#labChatModelList");
    labEls.labChatBattleModelPick = root.querySelector("#labChatBattleModelPick");
    labEls.labChatBattleModelVs = root.querySelector("#labChatBattleModelVs");
    labEls.labChatBattleModel = root.querySelector("#labChatBattleModel");
    labEls.labChatBattleModelMenu = root.querySelector("#labChatBattleModelMenu");
    labEls.labChatBattleModelTrigger = root.querySelector("#labChatBattleModelTrigger");
    labEls.labChatBattleModelTriggerText = root.querySelector("#labChatBattleModelTriggerText");
    labEls.labChatBattleModelPlatform = root.querySelector("#labChatBattleModelPlatform");
    labEls.labChatBattleModelPanel = root.querySelector("#labChatBattleModelPanel");
    labEls.labChatBattleModelList = root.querySelector("#labChatBattleModelList");
    labEls.labChatMessages = root.querySelector("#labChatMessages");
    labEls.labChatInput = root.querySelector("#labChatInput");
    labEls.labChatForm = root.querySelector("#labChatForm");
    labEls.labSend = root.querySelector("#labSend");
    labEls.labStop = root.querySelector("#labStop");
    labEls.labClearChat = root.querySelector("#labClearChat");
    labEls.labUsage = root.querySelector("#labUsage");
    labEls.labStatus = root.querySelector("#labStatus");
    labEls.labExportConfig = root.querySelector("#labExportConfig");
    labEls.labImportConfig = root.querySelector("#labImportConfig");
    labEls.labImportFile = root.querySelector("#labImportFile");
    labEls.labClearAllData = root.querySelector("#labClearAllData");
    labEls.labEditProvider = root.querySelector("#labEditProvider");
    labEls.labSaveProvider = root.querySelector("#labSaveProvider");
    labEls.labDeleteProvider = root.querySelector("#labDeleteProvider");
    labEls.labChatLayout = root.querySelector("#labChatLayout");
    labEls.labChatSessions = root.querySelector("#labChatSessions");
    labEls.labSessionsCollapse = root.querySelector("#labSessionsCollapse");
    labEls.labSessionsExpand = root.querySelector("#labSessionsExpand");
    labEls.labSessionsFoot = root.querySelector(".lab-chat-sessions-foot");
    labEls.labSessionList = root.querySelector("#labSessionList");
    labEls.labNewSession = root.querySelector("#labNewSession");
    labEls.labSessionSearchToggle = root.querySelector("#labSessionSearchToggle");
    labEls.labSessionSearchField = root.querySelector("#labSessionSearchField");
    labEls.labSessionSearchClose = root.querySelector("#labSessionSearchClose");
    labEls.labSessionSearch = root.querySelector("#labSessionSearch");
    labEls.labSidebarModeChat = root.querySelector("#labSidebarModeChat");
    labEls.labSidebarModeAgent = root.querySelector("#labSidebarModeAgent");
    labEls.labSidebarChatMenu = root.querySelector("#labSidebarChatMenu");
    labEls.labSidebarChatListMenu = root.querySelector("#labSidebarChatListMenu");
    labEls.labSidebarAgentMenu = root.querySelector("#labSidebarAgentMenu");
    labEls.labAgentMySite = root.querySelector("#labAgentMySite");
    labEls.labAgentSiteTree = root.querySelector("#labAgentSiteTree");
    labEls.labAgentSiteRefresh = root.querySelector("#labAgentSiteRefresh");
    labEls.labAgentSitePeek = root.querySelector("#labAgentSitePeek");
    labEls.labAgentSiteCodeDialog = root.querySelector("#labAgentSiteCodeDialog");
    labEls.labAgentSiteCodeTitle = root.querySelector("#labAgentSiteCodeTitle");
    labEls.labAgentSiteCodeClose = root.querySelector("#labAgentSiteCodeClose");
    labEls.labAgentSiteCodeFiles = root.querySelector("#labAgentSiteCodeFiles");
    labEls.labAgentSiteCodePath = root.querySelector("#labAgentSiteCodePath");
    labEls.labAgentSiteCodeView = root.querySelector("#labAgentSiteCodeView");
    labEls.labEmbedBrowser = root.querySelector("#labEmbedBrowser");
    labEls.labEmbedBrowserTitle = root.querySelector("#labEmbedBrowserTitle");
    labEls.labEmbedBrowserUrl = root.querySelector("#labEmbedBrowserUrl");
    labEls.labEmbedBrowserFrame = root.querySelector("#labEmbedBrowserFrame");
    labEls.labEmbedBrowserPlaceholder = root.querySelector("#labEmbedBrowserPlaceholder");
    labEls.labEmbedBrowserRefresh = root.querySelector("#labEmbedBrowserRefresh");
    labEls.labEmbedBrowserExternal = root.querySelector("#labEmbedBrowserExternal");
    labEls.labEmbedBrowserClose = root.querySelector("#labEmbedBrowserClose");
    labEls.labEmbedBrowserChat = root.querySelector("#labEmbedBrowserChat");
    labEls.labAgentWorkbench = root.querySelector("#labAgentWorkbench");
    labEls.labAgentWorkbenchTitle = root.querySelector("#labAgentWorkbenchTitle");
    labEls.labAgentModelPill = root.querySelector("#labAgentModelPill");
    labEls.labAgentTurnBadge = root.querySelector("#labAgentTurnBadge");
    labEls.labAgentRunStatus = root.querySelector("#labAgentRunStatus");
    labEls.labAgentToolCount = root.querySelector("#labAgentToolCount");
    labEls.labAgentPreviewFrame = root.querySelector("#labAgentPreviewFrame");
    labEls.labAgentPreviewOpen = root.querySelector("#labAgentPreviewOpen");
    labEls.labAgentWorkspacePath = root.querySelector("#labAgentWorkspacePath");
    labEls.labAgentFileTree = root.querySelector("#labAgentFileTree");
    labEls.labAgentCodePath = root.querySelector("#labAgentCodePath");
    labEls.labAgentCodeView = root.querySelector("#labAgentCodeView");
    labEls.labChatLayout = root.querySelector("#labChatLayout");
    labEls.labSessionNotice = root.querySelector("#labSessionNotice");
    labEls.labExportChat = root.querySelector("#labExportChat");
    labEls.labVoiceModePanel = root.querySelector("#labVoiceModePanel");
    labEls.labVoiceModeModel = root.querySelector("#labVoiceModeModel");
    labEls.labVoiceModeHint = root.querySelector("#labVoiceModeHint");
    labEls.labVoiceModeStop = root.querySelector("#labVoiceModeStop");
    labEls.labVoiceModeNotice = root.querySelector("#labVoiceModeNotice");
    labEls.labVoiceTtsOpts = root.querySelector("#labVoiceTtsOpts");
    labEls.labVoiceModelMenu = root.querySelector("#labVoiceModelMenu");
    labEls.labVoiceModelTrigger = root.querySelector("#labVoiceModelTrigger");
    labEls.labVoiceModelTriggerText = root.querySelector("#labVoiceModelTriggerText");
    labEls.labVoiceModelPanel = root.querySelector("#labVoiceModelPanel");
    labEls.labVoiceModelList = root.querySelector("#labVoiceModelList");
    labEls.labVoiceTtsVoiceMenu = root.querySelector("#labVoiceTtsVoiceMenu");
    labEls.labVoiceTtsVoiceTrigger = root.querySelector("#labVoiceTtsVoiceTrigger");
    labEls.labVoiceTtsVoiceTriggerText = root.querySelector("#labVoiceTtsVoiceTriggerText");
    labEls.labVoiceTtsVoicePanel = root.querySelector("#labVoiceTtsVoicePanel");
    labEls.labVoiceTtsVoiceList = root.querySelector("#labVoiceTtsVoiceList");
    labEls.labVoiceTtsVoice = root.querySelector("#labVoiceTtsVoice");
    labEls.labVoiceTtsStyleMenu = root.querySelector("#labVoiceTtsStyleMenu");
    labEls.labVoiceTtsStyleTrigger = root.querySelector("#labVoiceTtsStyleTrigger");
    labEls.labVoiceTtsStyleTriggerText = root.querySelector("#labVoiceTtsStyleTriggerText");
    labEls.labVoiceTtsStylePanel = root.querySelector("#labVoiceTtsStylePanel");
    labEls.labVoiceTtsStyleList = root.querySelector("#labVoiceTtsStyleList");
    labEls.labVoiceTtsStylePreset = root.querySelector("#labVoiceTtsStylePreset");
    labEls.labVoiceTtsStyle = root.querySelector("#labVoiceTtsStyle");
    labEls.labChatToolbar = root.querySelector("#labChatToolbar");
    labEls.labChatModeSwitch = root.querySelector(".lab-chat-mode-switch");
    labEls.labChatStage = root.querySelector("#labChatStage");
    labEls.labNormalMode = root.querySelector("#labNormalMode");
    labEls.labBattleMode = root.querySelector("#labBattleMode");
    labEls.labVoiceMode = root.querySelector("#labVoiceMode");
    labEls.labWorkspace = root.querySelector("#labWorkspace");
    labEls.labStudioPanelCollapse = root.querySelector("#labStudioPanelCollapse");
    labEls.labStudioMain = root.querySelector("#labStudioMain");
    labEls.labStudioMainReveal = root.querySelector("#labStudioMainReveal");
    labEls.labStudioMore = root.querySelector("#labStudioMore");
    labEls.labStudioMorePanel = root.querySelector("#labStudioMorePanel");
    labEls.labStudioMoreExpand = root.querySelector("#labStudioMoreExpand");
  }

  function onLabClick(event) {
    const root = event.currentTarget;
    if (!root.contains(event.target)) return;

    const actionBtn = event.target.closest("button[id^='lab']");
    if (actionBtn?.id) {
      switch (actionBtn.id) {
        case "labAddProvider":
          addCustomProvider();
          return;
        case "labToggleKey":
          toggleApiKeyVisibility();
          return;
        case "labTestConnection":
          testConnection();
          return;
        case "labFetchModels":
          fetchModelList();
          return;
        case "labClearModelCache":
          clearProviderModelCache();
          return;
        case "labStudioPanelCollapse":
          toggleStudioPanelCollapse();
          return;
        case "labStudioMainReveal":
          revealStudioMainPanel();
          return;
        case "labStop":
          stopGeneration();
          return;
        case "labClearChat":
          labChatMessages = [];
          saveLabSession();
          renderChatMessages();
          setLabUsage("");
          setSessionNotice(
            isAgentPanelMode() ? "已清空当前 Agent 任务" : "已清空当前对话"
          );
          return;
        case "labExportConfig": {
          const include = window.confirm(
            "是否在导出文件中包含 API 密钥？\n选「确定」包含，选「取消」则脱敏导出。"
          );
          exportLabConfig(include);
          return;
        }
        case "labImportConfig":
          root.querySelector("#labImportFile")?.click();
          return;
        case "labClearAllData":
          clearAllLabData();
          return;
        case "labSaveProvider":
          saveCustomProvider();
          return;
        case "labEditProvider":
          editCustomProvider();
          return;
        case "labDeleteProvider":
          deleteCustomProvider();
          return;
        case "labNewSession":
          createNewSession();
          return;
        case "labNewAgentSession":
          createNewSession();
          return;
        case "labSessionSearchToggle":
          toggleSessionSearch();
          return;
        case "labSessionSearchClose":
          toggleSessionSearch(false);
          return;
        case "labStudioMoreExpand":
          toggleMoreSettingsCollapse();
          return;
        case "labSidebarModeChat":
          if (labState.sessionsPanelMode === "agent") {
            setSessionsPanelMode("chat");
          } else {
            toggleSessionsPanelCollapse();
          }
          return;
        case "labSidebarModeAgent":
          setSessionsPanelMode("agent");
          return;
        case "labAgentSiteRefresh":
          void refreshAgentSiteTree();
          return;
        case "labAgentSiteCodeClose":
          closeAgentSiteCodeBrowser();
          return;
        case "labEmbedBrowserRefresh":
          if (labAgentState.previewUrl) {
            labAgentState.previewRevision = Date.now();
            syncEmbedBrowserUi({ forceShow: true });
          }
          return;
        case "labEmbedBrowserChat":
          closeAgentSitePreview();
          labEls.labChatMessages?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        case "labEmbedBrowserClose":
          closeAgentSitePreview();
          return;
        case "labSessionsCollapse":
          toggleSessionsSidebarCollapse(true);
          return;
        case "labSessionsExpand":
          toggleSessionsSidebarCollapse(false);
          return;
        case "labExportChat":
          exportChatMarkdown();
          return;
        case "labChatModelTrigger":
        case "labChatBattleModelTrigger":
          if (!actionBtn.disabled) {
            event.preventDefault();
            event.stopPropagation();
            const slot = actionBtn.id === "labChatBattleModelTrigger" ? "battle" : "primary";
            toggleChatModelPanel(slot);
          }
          return;
        case "labStatus":
          if (!labEls.labStatus?.classList.contains("is-expandable")) return;
          labStatusExpanded = !labStatusExpanded;
          setLabStatus(labEls.labStatus.dataset.fullText || "", labEls.labStatus.dataset.type, {
            expanded: labStatusExpanded,
            kind: labEls.labStatus.dataset.errorKind
          });
          return;
        default:
          break;
      }
    }

    if (event.target.closest("#labProviderList summary")) return;

    const deleteSessionBtn = event.target.closest("[data-delete-session]");
    if (deleteSessionBtn) {
      event.preventDefault();
      event.stopPropagation();
      closeAllSessionMenus();
      deleteSession(deleteSessionBtn.dataset.deleteSession);
      return;
    }

    const sessionMenuBtn = event.target.closest("[data-session-menu]");
    if (sessionMenuBtn) {
      event.preventDefault();
      event.stopPropagation();
      const card = sessionMenuBtn.closest(".lab-chat-session-card");
      const pop = card?.querySelector(".lab-chat-session-menu-pop");
      const willOpen = Boolean(pop?.hidden);
      closeAllSessionMenus();
      if (pop && willOpen) {
        pop.hidden = false;
        sessionMenuBtn.setAttribute("aria-expanded", "true");
      }
      return;
    }

    const sessionRow = event.target.closest(".lab-chat-session-row");
    if (sessionRow && !event.target.closest(".lab-chat-session-menu")) {
      const id = sessionRow.querySelector("[data-session-id]")?.dataset?.sessionId;
      if (id) {
        event.preventDefault();
        switchSession(id);
        return;
      }
    }

    const deleteProviderBtn = event.target.closest("[data-delete-custom-provider]");
    if (deleteProviderBtn) {
      event.preventDefault();
      event.stopPropagation();
      deleteCustomProvider(deleteProviderBtn.dataset.deleteCustomProvider);
      return;
    }

    const providerBtn = event.target.closest("#labProviderList button[data-provider-id]");
    if (providerBtn) {
      event.preventDefault();
      selectProvider(providerBtn.dataset.providerId);
      return;
    }

    const pinBtn = event.target.closest("[data-pin-model]");
    if (pinBtn) {
      event.preventDefault();
      const id = pinBtn.dataset.pinModel;
      const profile = ensureProfile(labState.providerId, getProvider());
      const pins = profile.pinnedModels || [];
      profile.pinnedModels = pins.includes(id) ? pins.filter((x) => x !== id) : [...pins, id];
      saveLabState();
      renderModelLists();
      return;
    }

    const modelLabel = event.target.closest(".lab-studio-model-id");
    if (modelLabel) {
      const row = modelLabel.closest(".lab-studio-model-row");
      const input = row?.querySelector("[data-model-id]");
      if (input) {
        input.checked = !input.checked;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    const removeBtn = event.target.closest("[data-remove-model]");
    if (removeBtn) {
      const id = removeBtn.dataset.removeModel;
      labState.enabledModels = labState.enabledModels.filter((item) => item !== id);
      if (isUserCustomProvider(getProvider())) {
        labState.fetchedModels = (labState.fetchedModels || []).filter((m) => (m.id || m) !== id);
        if (labState.selectedModel === id) {
          labState.selectedModel = labState.enabledModels[0] || "";
        }
      }
      saveLabState();
      renderModelLists();
      renderChatModelSelect();
      return;
    }

    const deleteFetchedBtn = event.target.closest("[data-delete-fetched-model]");
    if (deleteFetchedBtn) {
      const id = deleteFetchedBtn.dataset.deleteFetchedModel;
      labState.fetchedModels = (labState.fetchedModels || []).filter((m) => (m.id || m) !== id);
      labState.enabledModels = labState.enabledModels.filter((item) => item !== id);
      if (labState.selectedModel === id) {
        labState.selectedModel = labState.enabledModels[0] || "";
      }
      saveLabState();
      renderModelLists();
      renderChatModelSelect();
      setLabStatus(`已删除模型 ${id}`, "ok");
      return;
    }

    if (event.target.closest("[data-lab-focus-config]")) {
      focusConfigPanel();
      return;
    }
    if (event.target.closest("[data-lab-focus-models]")) {
      root.querySelector("#labFetchModels")?.focus();
      return;
    }
    const previewRefreshBtn = event.target.closest("[data-preview-refresh]");
    if (previewRefreshBtn) {
      event.preventDefault();
      refreshMessagePreview(Number(previewRefreshBtn.dataset.previewRefresh));
      return;
    }

    const starterBtn = event.target.closest("[data-lab-starter-prompt]");
    if (starterBtn) {
      applyStarterPrompt(starterBtn.dataset.labStarterPrompt || "");
      return;
    }
    const copyBtn = event.target.closest("[data-copy-index]");
    if (copyBtn) {
      const msg = labChatMessages[Number(copyBtn.dataset.copyIndex)];
      if (msg) copyToClipboard(msg.content, { anchor: copyBtn });
      return;
    }
    const voicePlayBtn = event.target.closest("[data-voice-play-index]");
    if (voicePlayBtn) {
      const msg = labChatMessages[Number(voicePlayBtn.dataset.voicePlayIndex)];
      if (msg) speakText(getSpeakText(msg));
      return;
    }
    const shareBtn = event.target.closest("[data-share-index]");
    if (shareBtn) {
      shareAssistantMessage(Number(shareBtn.dataset.shareIndex), shareBtn);
      return;
    }
    const regenBtn = event.target.closest("[data-regenerate-index]");
    if (regenBtn) {
      regenerateAssistantMessage(Number(regenBtn.dataset.regenerateIndex), regenBtn);
      return;
    }
    const modeBtn = event.target.closest("[data-chat-mode]");
    if (modeBtn) {
      setChatMode(modeBtn.dataset.chatMode);
      return;
    }
    if (event.target.closest("#labVoiceModeStop")) {
      const btn = labEls.labVoiceModeStop;
      btn?.classList.add("is-pressed");
      setTimeout(() => btn?.classList.remove("is-pressed"), 180);
      stopVoice({ fromUser: true });
      return;
    }

    
    

  }

  function onLabChange(event) {
    const root = event.currentTarget;
    if (!root.contains(event.target)) return;

    if (event.target.id === "labProviderEnabled") {
      persistFormConfig();
      renderStudioList();
      renderChatModelSelect();
      setLabStatus(event.target.checked ? "平台已启用" : "平台已关闭");
      return;
    }

    if (event.target.id === "labImportFile") {
      const file = event.target.files?.[0];
      if (file) importLabConfig(file);
      event.target.value = "";
      return;
    }

    const modelInput = event.target.closest("[data-model-id]");
    if (modelInput?.type === "checkbox") {
      const id = modelInput.dataset.modelId;
      const provider = getProvider();
      const profile = ensureProfile(labState.providerId, provider);
      if (modelInput.checked) {
        if (!labState.enabledModels.includes(id)) labState.enabledModels.push(id);
        if (!profile.enabled) {
          profile.enabled = true;
          if (labEls.labProviderEnabled) labEls.labProviderEnabled.checked = true;
        }
      } else {
        labState.enabledModels = labState.enabledModels.filter((item) => item !== id);
      }
      saveLabState();
      renderStudioList();
      renderModelLists();
      renderChatModelSelect();
    }
  }

  function onLabInput(event) {
    const root = event.currentTarget;
    if (!root.contains(event.target)) return;

    if (event.target.id === "labProviderSearch") {
      labProviderSearchQuery = event.target.value;
      renderStudioList();
      return;
    }
    if (event.target.id === "labSessionSearch") {
      labSessionSearchQuery = event.target.value;
      renderSessionList();
      return;
    }
    if (event.target.id === "labModelSearch") {
      labModelSearchQuery = event.target.value;
      renderModelLists();
      return;
    }
    if (event.target.id === "labBaseUrl") {
      updateApiPreview();
      persistFormConfig();
      if (isUserCustomProvider(getProvider())) updateCustomProviderLabels();
      return;
    }
    if (event.target.id === "labCustomProviderName") {
      const provider = getProvider();
      if (!provider || !isUserCustomProvider(provider)) return;
      provider.name = event.target.value;
      persistCustomProviderMeta();
      updateCustomProviderLabels();
      return;
    }
    if (event.target.id === "labApiKey") {
      const keyVal = event.target.value.trim();
      if (keyVal) {
        markProfileUserConfigured();
      } else {
        const profile = ensureProfile(labState.providerId, getProvider());
        profile.userConfigured = false;
        profile.apiKey = "";
      }
      persistFormConfig();
      renderStudioList();
      return;
    }
    if (event.target.id === "labSystemPrompt") {
      persistFormConfig();
      return;
    }
    if (event.target.id === "labTemperature") {
      labState.temperature = Number(event.target.value);
      if (labEls.labTempValue) labEls.labTempValue.textContent = labState.temperature.toFixed(1);
      saveLabState();
      return;
    }
    if (event.target.id === "labMaxTokens" || event.target.id === "labStream") {
      persistFormConfig();
    }
    if (event.target.id === "labVoiceTtsStyle") {
      persistVoiceTtsOptions();
    }
  }

  function onLabSubmit(event) {
    if (event.target.id === "labChatForm") {
      event.preventDefault();
      sendChatMessage();
    }
  }

  function onLabToggle(event) {
    const group = event.target;
    if (!group?.classList?.contains("lab-studio-group")) return;
    const id = group.dataset.groupId;
    if (!id) return;
    if (!labState.collapsedGroups) labState.collapsedGroups = {};
    labState.collapsedGroups[id] = !group.open;
    saveLabState();
  }

  function bindLabEvents() {
    if (labBound) return;
    const root = document.querySelector("#lab");
    if (!root) return;

    refreshLabEls();
    bindChatModelPickerEvents();
    bindVoicePickerEvents();
    root.addEventListener("click", onLabClick);
    labEls.labAgentSiteTree?.addEventListener("click", onAgentSiteTreeClick);
    labEls.labAgentSiteCodeDialog?.addEventListener("click", (event) => {
      const codeFileBtn = event.target.closest("[data-agent-code-file]");
      if (!codeFileBtn) return;
      event.preventDefault();
      showAgentSiteCodeFile(codeFileBtn.dataset.agentCodeFile);
    });
    root.addEventListener("change", onLabChange);
    root.addEventListener("input", onLabInput);
    root.addEventListener("submit", onLabSubmit);
    root.addEventListener("toggle", onLabToggle);

    root.querySelector("#labChatInput")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        root.querySelector("#labChatForm")?.requestSubmit();
      }
    });

    labEls.labCustomProviderName?.addEventListener("blur", () => {
      if (!isUserCustomProvider(getProvider())) return;
      persistCustomProviderMeta();
      saveLabState();
      renderStudioList();
    });

    labEls.labSessionList?.addEventListener(
      "scroll",
      () => closeAllSessionMenus(),
      { passive: true }
    );

    labEls.labSessionSearch?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        toggleSessionSearch(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!labEls.labPage || labEls.labPage.hidden) return;
      if (labEls.labSessionSearchField && !labEls.labSessionSearchField.hidden) {
        toggleSessionSearch(false);
        return;
      }
      if (labEls.labChatModelPanel && !labEls.labChatModelPanel.hidden) {
        closeChatModelPanel();
        return;
      }
      if (VOICE_PICKER_SLOTS.some((slot) => !getVoicePickerEls(slot).panel?.hidden)) {
        closeAllVoicePickers();
        return;
      }
      if (labAbortController) stopGeneration();
      closeAllSessionMenus();
    });

    document.addEventListener(
      "click",
      (event) => {
        if (!labEls.labPage || labEls.labPage.hidden) return;
        if (isSessionSearchOpen() && !event.target.closest(".lab-chat-sessions-search-slot")) {
          toggleSessionSearch(false);
        }
        if (event.target.closest(".lab-chat-session-menu")) return;
        closeAllSessionMenus();
      },
      true
    );

    labBound = true;
  }

  async function initLab(rootEls) {
    labEls = { labPage: rootEls.labPage };
    refreshLabEls();

    await Promise.all([
      loadLabProviders(),
      loadLabToolMap(),
      loadLabLogoManifest(),
      window.NeuxLabTts?.loadRegistry().catch(() => null)
    ]);
    detachProfileArrays(labState);
    labProviders.forEach((p) => repairProfileOnSwitch(p));
    const sanitized = runProfileStorageSanitize();
    applyUrlParams();
    refreshAllSessionTitles();
    pullActiveProfile();
    syncLabFormFromState();
    if (sanitized) saveLabState();
    bindLabEvents();
    syncMoreSettingsCollapse();
    syncSessionsSidebarCollapse();
    syncStudioPanelCollapse();
    syncApiKeyVisibilityUi();
    ensureThinkingPanelBindings();
    setLabBusy(false);
    setLabStatus("配置仅保存在本机浏览器，不会上传至 NEUX");
  }

  function onLabShow() {
    refreshLabEls();
    void window.NeuxLabTts?.loadRegistry().catch(() => null);
    ensureThinkingPanelBindings();
    bindChatModelPickerEvents();
    bindVoicePickerEvents();
    detachProfileArrays(labState);
    runProfileStorageSanitize();
    applyUrlParams();
    refreshAllSessionTitles();
    pullActiveProfile();
    syncLabFormFromState();
    syncMoreSettingsCollapse();
    syncSessionsSidebarCollapse();
    syncStudioPanelCollapse();
    syncChatModeUi();
  }

  window.NeuxLab = {
    init: initLab,
    onShow: onLabShow,
    navigateToProvider,
    resolveProviderIdForTool,
    clearProviderModelCache,
    setVoiceMode,
    speakText,
    stopVoice,
    isVoiceMode
  };
})();
