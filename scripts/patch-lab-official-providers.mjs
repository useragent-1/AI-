import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const providersPath = path.join(root, "data", "lab-providers.json");

const data = JSON.parse(fs.readFileSync(providersPath, "utf8"));

const chinaGroup = data.groups.find((g) => g.id === "china");
if (chinaGroup) chinaGroup.label = "国内模型官网";

const renameMap = {
  deepseek: { name: "DeepSeek 官网", group: "china", tags: ["官方", "国内", "热门"] },
  qwen: { name: "通义千问 · 百炼", tags: ["官方", "国内"] },
  zhipu: { name: "智谱 GLM 官网", tags: ["官方", "国内"] },
  moonshot: { name: "Kimi · 月之暗面", tags: ["官方", "国内", "长文本"] },
  baichuan: { name: "百川智能 官网", tags: ["官方", "国内"] },
  minimax: {
    name: "MiniMax 官网",
    baseUrl: "https://api.minimaxi.com/v1",
    tags: ["官方", "国内"]
  },
  stepfun: { name: "阶跃星辰 官网", tags: ["官方", "国内"] },
  volcengine: { name: "火山方舟 · 豆包", tags: ["官方", "国内"] },
  baidu: { name: "文心一言 · 千帆", tags: ["官方", "国内"] },
  tencent: { name: "腾讯混元 官网", tags: ["官方", "国内"] },
  lingyi: { name: "零一万物 Yi 官网", tags: ["官方", "国内"] },
  iflytek: { name: "讯飞星火 官网", tags: ["官方", "国内"] },
  mimo: { name: "小米 MiMo 官网", tags: ["官方", "国内", "编程"] },
  doubao: { name: "豆包 官网", tags: ["官方", "国内"] },
  openai: { tags: ["官方"] },
  anthropic: { tags: ["官方"] },
  "google-gemini": { name: "Google Gemini 官网", tags: ["官方", "多模态"] },
  mistral: { name: "Mistral 官网", tags: ["官方", "欧洲"] }
};

for (const provider of data.providers) {
  const patch = renameMap[provider.id];
  if (!patch) continue;
  Object.assign(provider, patch);
  if (patch.tags) provider.tags = [...new Set(patch.tags)];
}

const logoHints = {
  deepseek: "assets/logos/chat-deepseek.png",
  qwen: "assets/logos/chat-通义千问.png",
  zhipu: "assets/logos/chat-z-ai.png",
  moonshot: "assets/logos/chat-kimi.ico",
  baichuan: "assets/logos/chat-百川大模型.png",
  baidu: "assets/logos/chat-文心一言.ico",
  tencent: "assets/logos/chat-腾讯元宝.png",
  lingyi: "assets/logos/chat-yi-large-chat.png",
  iflytek: "assets/logos/chat-讯飞星火.ico",
  doubao: "assets/logos/chat-豆包.png",
  minimax: "assets/logos/lab-minimax.png",
  dashscope: "assets/logos/chat-通义千问.png",
  sensenova: "assets/logos/lab-sensenova.png",
  ai360: "assets/logos/lab-ai360.png",
  skywork: "assets/logos/lab-skywork.png",
  "gitee-ai": "assets/logos/lab-gitee-ai.png",
  "huawei-pangu": "assets/logos/lab-huawei-pangu.png",
  "meta-llama": "assets/logos/models-llama.ico",
  modelbest: "assets/logos/lab-modelbest.png",
  metaso: "assets/logos/chat-秘塔-ai-搜索.ico",
  "stability-ai": "assets/logos/lab-stability-ai.png",
  "aleph-alpha": "assets/logos/models-aleph-alpha.ico"
};

const newProviders = [
  {
    id: "dashscope",
    name: "阿里百炼 DashScope",
    group: "china",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    iconDomain: "bailian.aliyun.com",
    brandColor: "#624aff",
    note: "通义千问官方开放平台",
    tags: ["官方", "国内"]
  },
  {
    id: "sensenova",
    name: "商汤日日新",
    group: "china",
    baseUrl: "https://api.sensenova.cn/compatible-mode/v1",
    iconDomain: "sensenova.cn",
    brandColor: "#0066ff",
    note: "SenseNova 官方 OpenAI 兼容",
    tags: ["官方", "国内"]
  },
  {
    id: "ai360",
    name: "360智脑 官网",
    group: "china",
    baseUrl: "https://api.360.cn/v1",
    iconDomain: "ai.360.com",
    brandColor: "#00a854",
    note: "360 智脑开放平台",
    tags: ["官方", "国内"]
  },
  {
    id: "skywork",
    name: "昆仑天工 官网",
    group: "china",
    baseUrl: "https://api.apifree.ai/v1",
    iconDomain: "tiangong.cn",
    brandColor: "#6366f1",
    note: "天工 Skywork；官方平台 model-platform.tiangong.cn",
    tags: ["官方", "国内"]
  },
  {
    id: "modelbest",
    name: "面壁智能 官网",
    group: "china",
    baseUrl: "https://api.modelbest.cn/v1",
    iconDomain: "modelbest.cn",
    brandColor: "#111827",
    note: "MiniCPM 系列官方 API",
    tags: ["官方", "国内", "端侧"]
  },
  {
    id: "metaso",
    name: "秘塔 AI 官网",
    group: "china",
    baseUrl: "https://metaso.cn/api/v1",
    iconDomain: "metaso.cn",
    brandColor: "#2563eb",
    note: "秘塔搜索 / Metaso API",
    tags: ["官方", "国内", "搜索"]
  },
  {
    id: "gitee-ai",
    name: "Gitee 模力方舟",
    group: "china",
    baseUrl: "https://ai.gitee.com/v1",
    iconDomain: "gitee.com",
    brandColor: "#c71d23",
    note: "Gitee AI Serverless API",
    tags: ["官方", "国内", "开源"]
  },
  {
    id: "huawei-pangu",
    name: "华为盘古 官网",
    group: "china",
    baseUrl: "https://YOUR-ENDPOINT/api/v2",
    iconDomain: "huaweicloud.com",
    brandColor: "#cf0a2c",
    note: "华为云 ModelArts 部署端点",
    tags: ["官方", "国内", "企业"]
  },
  {
    id: "meta-llama",
    name: "Meta Llama 官网",
    group: "intl",
    baseUrl: "https://api.llama.com/compat/v1",
    iconDomain: "llama.com",
    brandColor: "#0467df",
    note: "Meta 官方 Llama API",
    tags: ["官方"]
  },
  {
    id: "stability-ai",
    name: "Stability AI 官网",
    group: "intl",
    baseUrl: "https://api.stability.ai/v1",
    iconDomain: "stability.ai",
    brandColor: "#7c3aed",
    note: "Stable Diffusion / 多模态 API",
    tags: ["官方"]
  },
  {
    id: "aleph-alpha",
    name: "Aleph Alpha 官网",
    group: "intl",
    baseUrl: "https://api.aleph-alpha.com/v1",
    iconDomain: "aleph-alpha.com",
    brandColor: "#0f172a",
    note: "欧洲 Luminous 系列",
    tags: ["官方", "欧洲"]
  }
];

const existingIds = new Set(data.providers.map((p) => p.id));
for (const provider of newProviders) {
  if (existingIds.has(provider.id)) continue;
  const customIndex = data.providers.findIndex((p) => p.id === "custom");
  data.providers.splice(customIndex, 0, provider);
  existingIds.add(provider.id);
}

for (const provider of data.providers) {
  if (provider.id === "custom") continue;
  if (!provider.tags?.includes("官方") && provider.group === "china" && !["siliconflow", "infini", "modelscope", "xirang", "tencent-ti", "longcat"].includes(provider.id)) {
    provider.tags = [...new Set([...(provider.tags || []), "官方"])];
  }
  const hint = logoHints[provider.id];
  if (hint && fs.existsSync(path.join(root, hint))) {
    provider.logo = hint;
  }
}

if (data.providers.find((p) => p.id === "minimax")) {
  const m = data.providers.find((p) => p.id === "minimax");
  m.logo = "assets/logos/lab-minimax.png";
}

data.version = 6;
fs.writeFileSync(providersPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Patched ${data.providers.length} providers, version ${data.version}`);
