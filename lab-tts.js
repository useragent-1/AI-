/**
 * NEUX Lab — 多平台 TTS 适配层（音色 / 风格 / 合成）
 */
(() => {
  "use strict";

  const STYLE_TEXT = {
    natural: {
      mimo: "用自然、清晰的中文朗读，语速适中。",
      openai: "Speak naturally and clearly at a moderate pace.",
      dashscope: "自然、清晰、语速适中",
      minimax: "",
      elevenlabs: "",
      generic: "自然、清晰、语速适中"
    },
    cheerful: {
      mimo: "开心、活泼、语速稍快，语气轻快上扬。",
      openai: "Cheerful, upbeat, slightly faster pace with bright energy.",
      dashscope: "开心活泼，语速稍快",
      minimax: "",
      elevenlabs: "",
      generic: "开心活泼"
    },
    gentle: {
      mimo: "温柔、沉稳、语速略慢，语气柔和。",
      openai: "Gentle, warm, slightly slower and soft-spoken.",
      dashscope: "温柔沉稳，语速略慢",
      minimax: "",
      elevenlabs: "",
      generic: "温柔沉稳"
    },
    serious: {
      mimo: "严肃、正式、语速平稳，语气稳重。",
      openai: "Serious, formal, steady pace, professional tone.",
      dashscope: "严肃正式",
      minimax: "",
      elevenlabs: "",
      generic: "严肃正式"
    },
    northeast: {
      mimo: "用东北话表达，语气接地气、略带幽默。",
      openai: "Speak in Northeastern Mandarin dialect, colloquial and humorous.",
      dashscope: "东北话",
      minimax: "",
      elevenlabs: "",
      generic: "东北话"
    },
    cantonese: {
      mimo: "用粤语表达，语气自然亲切。",
      openai: "Speak in Cantonese, natural and friendly.",
      dashscope: "粤语",
      minimax: "",
      elevenlabs: "",
      generic: "粤语"
    },
    singing: {
      mimo: "唱歌",
      openai: "Sing the following lyrics expressively.",
      dashscope: "唱歌",
      minimax: "",
      elevenlabs: "",
      generic: "唱歌"
    },
    custom: { mimo: "", openai: "", dashscope: "", minimax: "", elevenlabs: "", generic: "" }
  };

  let registry = null;
  const voiceListCache = new Map();

  async function loadRegistry() {
    if (registry) return registry;
    const res = await fetch("data/lab-tts-registry.json?v=1");
    if (!res.ok) throw new Error("无法加载 TTS 配置");
    registry = await res.json();
    return registry;
  }

  function getRegistry() {
    return registry;
  }

  function adapterDef(id) {
    return registry?.adapters?.[id] || registry?.adapters?.browser;
  }

  function resolveVoices(adapterId, modelId) {
    const def = adapterDef(adapterId);
    if (!def) return [];
    if (def.inheritsVoices) {
      return resolveVoices(def.inheritsVoices, modelId);
    }
    const mid = String(modelId || "").toLowerCase();
    if (adapterId === "dashscope-tts" && mid.includes("sambert") && def.sambertVoices?.length) {
      return def.sambertVoices.map((v) => ({ id: v.id, label: v.label, model: v.model }));
    }
    return (def.voices || []).map((v) => ({ id: v.id, label: v.label }));
  }

  function resolveAdapter({ provider, modelId, baseUrl }) {
    if (!registry) return "browser";
    const pid = String(provider?.id || provider || "");
    const mid = String(modelId || "").toLowerCase();
    const url = String(baseUrl || provider?.baseUrl || "").toLowerCase();

    if (provider?.ttsAdapter && registry.adapters[provider.ttsAdapter]) {
      return provider.ttsAdapter;
    }
    if (registry.providerAdapters?.[pid]) {
      return registry.providerAdapters[pid];
    }
    for (const hint of registry.urlAdapters || []) {
      if (hint.includes && url.includes(hint.includes.toLowerCase())) {
        return hint.adapter;
      }
    }
    for (const rule of registry.modelAdapters || []) {
      const match = rule.match && mid.includes(String(rule.match).toLowerCase());
      const also = !rule.also || mid.includes(String(rule.also).toLowerCase());
      const unless = rule.unless && new RegExp(rule.unless, "i").test(mid);
      if (match && also && !unless) return rule.adapter;
    }
    if (/tts|speech|sambert|cosyvoice|text2audio|t2a|audio\.speech/i.test(mid)) {
      if (mid.includes("mimo") && !/voicedesign|voiceclone/.test(mid)) return "mimo-chat";
      if (/sambert|cosyvoice/.test(mid)) return "dashscope-tts";
      if (/speech-0|t2a|minimax/.test(mid)) return "minimax-tts";
      if (/eleven/.test(mid)) return "elevenlabs";
      return "openai-speech";
    }
    return "browser";
  }

  function supportsApiAdapter(adapterId) {
    return Boolean(adapterId && adapterId !== "browser" && adapterDef(adapterId));
  }

  function getStyleMode(adapterId) {
    return adapterDef(adapterId)?.styleMode || "none";
  }

  function getStylePresets() {
    return registry?.stylePresets || [];
  }

  function buildStyleInstruction(adapterId, preset, custom) {
    const mode = getStyleMode(adapterId);
    if (mode === "none") return "";
    if (preset === "custom") return String(custom || "").trim();
    const pack = STYLE_TEXT[preset] || STYLE_TEXT.natural;
    if (mode === "mimo") return pack.mimo || pack.generic;
    if (mode === "openai-instructions") return pack.openai || pack.generic;
    if (mode === "dashscope") return pack.dashscope || pack.generic;
    if (mode === "minimax") return pack.minimax || pack.generic;
    if (mode === "elevenlabs") return pack.elevenlabs || pack.generic;
    return pack.generic;
  }

  function defaultVoice(adapterId, modelId) {
    const def = adapterDef(adapterId);
    if (!def) return "";
    const voices = resolveVoices(adapterId, modelId);
    if (voices.length) return voices[0].id;
    return def.defaultVoice || "";
  }

  function normalizeVoice(adapterId, voice, modelId) {
    const voices = resolveVoices(adapterId, modelId);
    const ids = voices.map((v) => v.id);
    if (voice && ids.includes(voice)) return voice;
    return defaultVoice(adapterId, modelId);
  }

  function cacheKey(creds, adapterId) {
    return `${adapterId}:${creds?.providerId || ""}:${creds?.baseUrl || ""}`;
  }

  async function fetchVoices(adapterId, creds, modelId) {
    const staticVoices = resolveVoices(adapterId, modelId);
    const def = adapterDef(adapterId);
    if (!def?.fetchVoices || adapterId !== "elevenlabs") {
      return staticVoices;
    }
    const key = cacheKey(creds, adapterId);
    if (voiceListCache.has(key)) return voiceListCache.get(key);

    const apiKey = creds?.apiKey || "";
    const base = (creds?.baseUrl || "https://api.elevenlabs.io/v1").replace(/\/$/, "");
    const root = base.includes("elevenlabs") ? base : "https://api.elevenlabs.io/v1";
    try {
      const res = await fetch(`${root}/voices`, {
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail?.message || `HTTP ${res.status}`);
      const list = (data.voices || [])
        .slice(0, 40)
        .map((v) => ({ id: v.voice_id, label: v.name || v.voice_id }));
      if (list.length) {
        voiceListCache.set(key, list);
        return list;
      }
    } catch {
      /* fallback */
    }
    voiceListCache.set(key, staticVoices);
    return staticVoices;
  }

  function audioSpeechUrl(baseUrl) {
    const base = String(baseUrl || "").replace(/\/$/, "");
    if (/\/audio\/speech$/i.test(base)) return base;
    if (/\/chat\/completions$/i.test(base)) return base.replace(/\/chat\/completions$/i, "/audio/speech");
    if (/\/deployments\/[^/]+$/i.test(base)) return `${base}/audio/speech`;
    return `${base}/audio/speech`;
  }

  function dashscopeTtsRoot(baseUrl) {
    if (String(baseUrl || "").includes("dashscope.aliyuncs.com")) {
      return "https://dashscope.aliyuncs.com/api/v1";
    }
    return "https://dashscope.aliyuncs.com/api/v1";
  }

  function isMimoBuiltinModel(modelId) {
    const id = String(modelId || "").toLowerCase();
    return id.includes("mimo") && id.includes("tts") && !/voicedesign|voiceclone/.test(id);
  }

  function buildMimoMessages(text, style, preset) {
    const userContent = style || STYLE_TEXT.natural.mimo;
    let assistantContent = text;
    const wantsSinging = preset === "singing" || /^(唱歌|sing|singing)$/i.test(style);
    if (wantsSinging && !/^\s*[(（\[]\s*(唱歌|sing|singing)/i.test(text)) {
      assistantContent = `(唱歌)${text}`;
    }
    return [
      { role: "user", content: userContent },
      { role: "assistant", content: assistantContent }
    ];
  }

  async function readError(res) {
    const data = await res.json().catch(() => ({}));
    return data.error?.message || data.message || data.detail?.message || data.msg || `HTTP ${res.status}`;
  }

  async function synthesizeBlob(ctx) {
    const {
      adapter,
      creds,
      modelId,
      text,
      voice,
      stylePreset,
      styleCustom,
      buildHeaders,
      signal
    } = ctx;
    const fetchInit = (init) => (signal ? { ...init, signal } : init);
    const t = String(text || "").trim();
    if (!t) throw new Error("文本为空");

    const style = buildStyleInstruction(adapter, stylePreset, styleCustom);
    const headersFn = buildHeaders || (() => ({}));
    const baseUrl = String(creds.baseUrl || "").replace(/\/$/, "");
    const apiKey = creds.apiKey || "";
    const model = modelId || "tts-1";
    const resolvedVoice = normalizeVoice(adapter, voice, model);

    if (adapter === "mimo-chat") {
      const h = { ...headersFn(), "Content-Type": "application/json" };
      if (creds.providerId === "mimo" && apiKey) h["api-key"] = apiKey;
      const res = await fetch(
        `${baseUrl}/chat/completions`,
        fetchInit({
          method: "POST",
          headers: h,
          body: JSON.stringify({
            model,
            messages: buildMimoMessages(t, style, stylePreset),
            stream: false,
            audio: { format: "wav", voice: resolvedVoice || "mimo_default" }
          })
        })
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(await readError(res));
      const b64 = data.choices?.[0]?.message?.audio?.data;
      if (!b64) throw new Error("未返回音频");
      return base64ToBlob(b64, "audio/wav");
    }

    if (adapter === "openai-speech" || adapter === "azure-speech") {
      const url = audioSpeechUrl(baseUrl);
      const body = {
        model: model.includes("tts") || model.includes("speech") ? model : model || "tts-1",
        input: t,
        voice: resolvedVoice || "alloy",
        response_format: "mp3"
      };
      if (style && /gpt-4o.*tts|tts.*gpt/i.test(model)) {
        body.instructions = style;
      }
      const res = await fetch(
        url,
        fetchInit({
          method: "POST",
          headers: headersFn(),
          body: JSON.stringify(body)
        })
      );
      if (!res.ok) throw new Error(await readError(res));
      return await res.blob();
    }

    if (adapter === "elevenlabs") {
      const root = baseUrl.includes("elevenlabs") ? baseUrl : "https://api.elevenlabs.io/v1";
      const voiceId = resolvedVoice || "EXAVITQu4vr4xnSDxMaL";
      const res = await fetch(
        `${root.replace(/\/$/, "")}/text-to-speech/${encodeURIComponent(voiceId)}`,
        fetchInit({
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            Accept: "audio/mpeg"
          },
          body: JSON.stringify({
            text: t,
            model_id: model && model !== "tts-1" ? model : "eleven_multilingual_v2",
            voice_settings: style ? { style: 0.5, use_speaker_boost: true } : undefined
          })
        })
      );
      if (!res.ok) throw new Error(await readError(res));
      return await res.blob();
    }

    if (adapter === "dashscope-tts") {
      const mid = model.toLowerCase();
      const h = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      };
      if (mid.includes("sambert")) {
        const voiceEntry = resolveVoices(adapter, model).find((v) => v.id === resolvedVoice);
        const sambertModel = voiceEntry?.model || model || `sambert-${resolvedVoice || "zhichu"}-v1`;
        const res = await fetch(
          `${dashscopeTtsRoot(baseUrl)}/services/audio/tts`,
          fetchInit({
            method: "POST",
            headers: h,
            body: JSON.stringify({
              model: sambertModel,
              input: { text: t },
              parameters: { format: "wav", sample_rate: 48000 }
            })
          })
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.code || await readError(res));
        const b64 = data.output?.audio || data.output?.audio_url;
        if (data.output?.audio) return base64ToBlob(data.output.audio, "audio/wav");
        if (typeof b64 === "string" && b64.startsWith("http")) {
          const ar = await fetch(b64);
          return await ar.blob();
        }
        throw new Error("DashScope 未返回音频");
      }

      const cosyModel = mid.includes("cosy") ? model : "cosyvoice-v1";
      const res = await fetch(
        `${dashscopeTtsRoot(baseUrl)}/services/aigc/text2speech/synthesis`,
        fetchInit({
          method: "POST",
          headers: h,
          body: JSON.stringify({
            model: cosyModel,
            input: { text: style ? `(${style})${t}` : t },
            parameters: {
              voice: resolvedVoice || "longxiaochun",
              format: "wav",
              sample_rate: 48000
            }
          })
        })
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const compatUrl = audioSpeechUrl(baseUrl.replace(/\/compatible-mode\/v1$/i, "/compatible-mode/v1"));
        const res2 = await fetch(
          compatUrl,
          fetchInit({
            method: "POST",
            headers: headersFn(),
            body: JSON.stringify({
              model: model || "cosyvoice-v1",
              input: t,
              voice: resolvedVoice || "longxiaochun",
              response_format: "mp3"
            })
          })
        );
        if (res2.ok) return await res2.blob();
        throw new Error(data.message || data.code || await readError(res));
      }
      if (data.output?.audio) return base64ToBlob(data.output.audio, "audio/wav");
      const audioUrl = data.output?.audio_url;
      if (audioUrl) {
        const ar = await fetch(audioUrl);
        return await ar.blob();
      }
      throw new Error("DashScope 未返回音频");
    }

    if (adapter === "minimax-tts") {
      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/t2a_v2`,
        fetchInit({
          method: "POST",
          headers: headersFn(),
          body: JSON.stringify({
            model: model || "speech-02-turbo",
            text: style ? `[${style}]${t}` : t,
            voice_setting: {
              voice_id: resolvedVoice || "male-qn-qingse",
              speed: 1,
              vol: 1,
              pitch: 0
            },
            audio_setting: { format: "mp3", sample_rate: 32000 }
          })
        })
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.base_resp?.status_msg || await readError(res));
      const audioHex = data.data?.audio;
      if (!audioHex) throw new Error("MiniMax 未返回音频");
      if (/^[A-Za-z0-9+/=]+$/.test(audioHex) && audioHex.length > 64) {
        return base64ToBlob(audioHex, "audio/mp3");
      }
      return hexToBlob(audioHex, "audio/mp3");
    }

    throw new Error(`未知 TTS 适配：${adapter}`);
  }

  function base64ToBlob(b64, mime) {
    const binary = atob(String(b64).replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime || "audio/wav" });
  }

  function hexToBlob(hex, mime) {
    const clean = String(hex).replace(/^0x/i, "").replace(/\s/g, "");
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
    return new Blob([bytes], { type: mime || "audio/mp3" });
  }

  function getAdapterLabel(adapterId) {
    return adapterDef(adapterId)?.label || adapterId;
  }

  window.NeuxLabTts = {
    loadRegistry,
    getRegistry,
    resolveAdapter,
    supportsApiAdapter,
    getStylePresets,
    getStyleMode,
    buildStyleInstruction,
    resolveVoices,
    fetchVoices,
    defaultVoice,
    normalizeVoice,
    synthesizeBlob,
    getAdapterLabel,
    isMimoBuiltinModel
  };
})();
