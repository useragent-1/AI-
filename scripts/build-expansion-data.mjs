import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const scriptPath = path.join(root, "script.js");
const outPath = path.join(__dirname, "expansion-data.mjs");

const script = fs.readFileSync(scriptPath, "utf8");
const match = script.match(/const categorySeeds = (\[[\s\S]*?\n\]);/);
const ctx = vm.createContext({});
vm.runInContext(`var categorySeeds = ${match[1]};`, ctx);
const existingNames = new Set();
for (const category of ctx.categorySeeds) {
  for (const tool of category.tools) existingNames.add(tool[0].toLowerCase());
}

function tool(name, url, desc, tags, price, featured) {
  return [name, url, desc, tags, price, featured];
}

const ADDITIONS_RAW = {
  chat: [
    tool("Grok", "https://grok.com/", "xAI 实时信息聊天助手，适合新闻、推理与幽默对话。", ["xAI", "实时"], "freemium", true),
    tool("Pi", "https://pi.ai/", "Inflection 情感陪伴型 AI 助手，适合日常聊天与情绪支持。", ["陪伴", "对话"], "free", false),
    tool("Meta AI", "https://www.meta.ai/", "Meta 多模态助手，集成 WhatsApp、Instagram 与 Facebook。", ["Meta", "多模态"], "free", true),
    tool("Mistral Le Chat Enterprise", "https://mistral.ai/products/le-chat", "Mistral 企业版聊天与工作流入口。", ["企业", "Mistral"], "paid", false),
    tool("Qwen Chat", "https://chat.qwen.ai/", "阿里通义千问官方聊天界面，支持长文本与多模态。", ["通义", "中文"], "free", true),
    tool("Yi-Large Chat", "https://platform.lingyiwanwu.com/", "零一万物大模型对话与 API 体验入口。", ["中文", "Yi"], "freemium", false),
    tool("Z.ai", "https://chat.z.ai/", "智谱 GLM 官方对话产品，适合中文推理与工具调用。", ["智谱", "GLM"], "free", true),
    tool("百川大模型", "https://www.baichuan-ai.com/", "百川智能中文大模型对话与行业应用入口。", ["中文", "百川"], "freemium", false),
    tool("腾讯元宝", "https://yuanbao.tencent.com/", "腾讯混元助手，覆盖搜索、写作、编程与多模态。", ["腾讯", "中文"], "free", true),
    tool("讯飞星火", "https://xinghuo.xfyun.cn/", "科大讯飞认知大模型，适合办公、教育与语音场景。", ["讯飞", "中文"], "freemium", false),
    tool("Copilot (GitHub)", "https://github.com/copilot", "GitHub 生态 AI 对话，可结合代码库与 Issues。", ["GitHub", "开发"], "paid", false),
    tool("LM Arena", "https://lmarena.ai/", "匿名盲测多模型对战平台，适合比较模型回答质量。", ["评测", "多模型"], "free", false),
    tool("OpenRouter Chat", "https://openrouter.ai/chat", "通过 OpenRouter 切换多家模型进行对话。", ["多模型", "API"], "freemium", false),
    tool("Jan", "https://jan.ai/", "开源本地聊天客户端，可离线运行多种开源模型。", ["本地", "开源"], "free", false),
    tool("LibreChat", "https://librechat.ai/", "自托管多模型聊天界面，支持 OpenAI、Anthropic 等。", ["自托管", "开源"], "free", false),
    tool("Open WebUI", "https://openwebui.com/", "自托管 Ollama 与 OpenAI 兼容聊天前端。", ["自托管", "Ollama"], "free", false),
    tool("Msty", "https://msty.app/", "桌面端多模型本地与云端聊天应用。", ["桌面", "多模型"], "freemium", false),
    tool("Hume AI", "https://www.hume.ai/", "情感语音与表情共情对话研究产品。", ["情感", "语音"], "freemium", false),
    tool("Cohere Coral", "https://cohere.com/chat", "Cohere 多文档聊天与企业知识问答。", ["RAG", "企业"], "freemium", false),
  ],
  research: [
    tool("Perplexity Pro", "https://www.perplexity.ai/pro", "深度研究模式与文件上传，适合专业调研。", ["研究", "搜索"], "paid", false),
    tool("Litmaps", "https://www.litmaps.com/", "文献地图与引文网络可视化发现工具。", ["文献", "可视化"], "freemium", false),
    tool("Iris.ai", "https://iris.ai/", "科研主题发现与论文推荐 AI 助手。", ["科研", "发现"], "paid", false),
    tool("Undermind", "https://www.undermind.ai/", "深度科学文献搜索与证据综合平台。", ["论文", "搜索"], "paid", false),
    tool("Paperpal", "https://paperpal.com/", "学术写作润色、查重与投稿辅助工具。", ["学术写作", "润色"], "freemium", false),
    tool("Scholarcy", "https://www.scholarcy.com/", "论文闪卡摘要与关键发现提取。", ["摘要", "论文"], "freemium", false),
    tool("Inciteful", "https://inciteful.xyz/", "从种子论文扩展相关文献与引用网络。", ["引文", "发现"], "free", false),
    tool("Keenious", "https://keenious.com/", "上传文档后推荐相关学术论文。", ["推荐", "论文"], "freemium", false),
    tool("Jenni AI", "https://jenni.ai/", "学术写作与文献引用辅助平台。", ["写作", "引用"], "freemium", true),
    tool("Paperpile", "https://paperpile.com/", "文献管理与 Google Docs 引用写作工具。", ["文献管理", "写作"], "paid", false),
    tool("Zotero", "https://www.zotero.org/", "开源文献管理，插件支持 AI 摘要与检索。", ["文献管理", "开源"], "free", false),
    tool("Dimensions AI", "https://www.dimensions.ai/", "科研出版物、专利与资助数据分析平台。", ["科研数据", "分析"], "freemium", false),
    tool("Springer Nature AI", "https://www.springernature.com/gp/ai", "出版社 AI 研究助手与论文发现服务。", ["出版", "论文"], "paid", false),
    tool("AlphaFold", "https://alphafold.ebi.ac.uk/", "DeepMind 蛋白质结构预测数据库与工具。", ["生物", "结构"], "free", true),
    tool("ResearchGate", "https://www.researchgate.net/", "学术社交网络与论文发现平台。", ["学术", "社交"], "free", false),
    tool("OpenAlex", "https://openalex.org/", "开放学术图谱与出版物检索 API。", ["开放数据", "API"], "free", false),
  ],
  writing: [
    tool("Writer", "https://writer.com/", "企业品牌语气与合规内容生成平台。", ["企业", "品牌"], "paid", true),
    tool("Longshot", "https://www.longshot.ai/", "事实核查与 SEO 长文写作工作流。", ["SEO", "事实核查"], "paid", false),
    tool("Narrato", "https://narrato.io/", "内容工作流、协作与 AI 写作一体化平台。", ["协作", "内容"], "paid", false),
    tool("Simplified", "https://simplified.com/", "文案、设计与视频一体化 AI 内容平台。", ["多模态", "营销"], "freemium", false),
    tool("ContentBot", "https://contentbot.ai/", "博客、广告与邮件 AI 文案生成工具。", ["文案", "博客"], "paid", false),
    tool("Copysmith", "https://copysmith.ai/", "电商与广告批量文案生成平台。", ["电商", "广告"], "paid", false),
    tool("Peppertype", "https://www.peppertype.ai/", "营销文案与创意变体生成工具。", ["营销", "创意"], "paid", false),
    tool("Writecream", "https://www.writecream.com/", "冷邮件、博客与语音内容生成工具。", ["冷邮件", "博客"], "freemium", false),
    tool("TextCortex", "https://textcortex.com/", "浏览器内写作、翻译与知识库助手。", ["浏览器", "写作"], "freemium", false),
    tool("Lex", "https://lex.page/", "AI 原生写作编辑器，适合长文与创意写作。", ["编辑器", "创意"], "freemium", true),
    tool("NovelAI", "https://novelai.net/", "面向小说与角色扮演的 AI 写作平台。", ["小说", "角色"], "paid", false),
    tool("Squibler", "https://www.squibler.io/", "剧本、书籍与故事结构 AI 写作工具。", ["故事", "剧本"], "paid", false),
    tool("ProWritingAid", "https://prowritingaid.com/", "英文写作风格、语法与可读性分析。", ["英文", "润色"], "freemium", false),
    tool("LanguageTool", "https://languagetool.org/", "多语言语法检查与 AI 改写建议。", ["语法", "多语言"], "freemium", false),
    tool("Moonbeam", "https://www.gomoonbeam.com/", "长文博客与 Newsletter AI 写作工具。", ["长文", "博客"], "paid", false),
  ],
  image: [
    tool("Flux", "https://blackforestlabs.ai/", "Black Forest Labs 高质量文生图模型家族。", ["文生图", "Flux"], "freemium", true),
    tool("Imagen", "https://deepmind.google/technologies/imagen/", "Google Imagen 图像生成研究与产品入口。", ["Google", "文生图"], "paid", false),
    tool("getimg.ai", "https://getimg.ai/", "在线 Stable Diffusion 与修图工具套件。", ["SD", "修图"], "freemium", false),
    tool("NightCafe", "https://creator.nightcafe.studio/", "多风格 AI 艺术生成社区平台。", ["艺术", "社区"], "freemium", false),
    tool("Artbreeder", "https://www.artbreeder.com/", "人像与角色基因混合创作平台。", ["人像", "混合"], "freemium", false),
    tool("Scenario", "https://www.scenario.com/", "游戏资产批量生成与风格训练平台。", ["游戏", "资产"], "paid", true),
    tool("Photoroom", "https://www.photoroom.com/", "电商抠图、背景替换与商品图 AI 工具。", ["电商", "抠图"], "freemium", true),
    tool("Remove.bg", "https://www.remove.bg/", "一键 AI 抠图与背景移除 API。", ["抠图", "API"], "freemium", false),
    tool("Topaz Photo AI", "https://www.topazlabs.com/photo-ai", "照片降噪、锐化与超分辨率增强。", ["修图", "增强"], "paid", false),
    tool("Bria", "https://bria.ai/", "商业安全文生图与编辑 API 平台。", ["API", "商业"], "paid", false),
    tool("Shutterstock AI", "https://www.shutterstock.com/ai-image-generator", "正版素材库 AI 图像生成入口。", ["素材", "商业"], "paid", false),
    tool("Vectorizer.AI", "https://vectorizer.ai/", "位图转矢量 SVG 的 AI 工具。", ["矢量", "转换"], "freemium", false),
    tool("Picsart AI", "https://picsart.com/ai-image-generator", "移动端 AI 图像生成与编辑。", ["移动端", "编辑"], "freemium", false),
    tool("Fotor AI", "https://www.fotor.com/ai-image-generator/", "在线 AI 图像生成与照片编辑套件。", ["在线", "修图"], "freemium", false),
  ],
  video: [
    tool("Haiper", "https://haiper.ai/", "文生视频与图生视频创作平台。", ["文生视频", "创意"], "freemium", true),
    tool("Minimax Video", "https://www.minimax.io/", "MiniMax 海螺 AI 视频生成产品。", ["中文", "视频"], "freemium", true),
    tool("Genmo", "https://www.genmo.ai/", "Mochi 等开源视频模型托管与生成。", ["开源", "视频"], "freemium", false),
    tool("LTX Studio", "https://ltx.studio/", "Lightricks 端到端 AI 影视分镜与视频工作流。", ["影视", "分镜"], "freemium", true),
    tool("Captions", "https://www.captions.ai/", "AI 字幕、配音与短视频剪辑应用。", ["字幕", "短视频"], "freemium", true),
    tool("Fliki", "https://fliki.ai/", "文本转视频与 AI 配音解说工具。", ["文本转视频", "配音"], "freemium", false),
    tool("Pictory", "https://pictory.ai/", "长文/博客自动转短视频营销内容。", ["营销", "短视频"], "paid", false),
    tool("Colossyan", "https://www.colossyan.com/", "企业培训与多语言数字人视频。", ["数字人", "培训"], "paid", false),
    tool("Elai.io", "https://elai.io/", "幻灯片转数字人讲解视频平台。", ["数字人", "PPT"], "paid", false),
    tool("Hour One", "https://hourone.ai/", "虚拟主播与品牌数字人视频生成。", ["数字人", "品牌"], "paid", false),
    tool("Wondershare Filmora AI", "https://filmora.wondershare.com/", "消费级视频剪辑内置 AI 特效套件。", ["剪辑", "特效"], "freemium", false),
    tool("Kapwing AI", "https://www.kapwing.com/ai", "在线协作剪辑与 AI 字幕、翻译工具。", ["协作", "字幕"], "freemium", false),
    tool("Submagic", "https://www.submagic.co/", "自动字幕样式与短视频包装 AI。", ["字幕", "包装"], "freemium", false),
    tool("Wisecut", "https://www.wisecut.video/", "自动剪静音、字幕与 B-roll 的 AI 剪辑。", ["自动剪辑", "短视频"], "freemium", false),
  ],
  audio: [
    tool("Stable Audio", "https://stableaudio.com/", "Stability AI 音乐与音效生成平台。", ["音乐", "Stability"], "freemium", true),
    tool("Beatoven.ai", "https://www.beatoven.ai/", "按情绪生成免版税背景音乐。", ["配乐", "情绪"], "freemium", false),
    tool("Boomy", "https://boomy.com/", "一键生成并发布 AI 音乐作品。", ["音乐", "创作"], "freemium", false),
    tool("Loudly", "https://www.loudly.com/", "AI 音乐生成与版权管理工具。", ["音乐", "版权"], "freemium", false),
    tool("Descript Overdub", "https://www.descript.com/overdub", "文本编辑式声音克隆与配音。", ["声音克隆", "播客"], "freemium", false),
    tool("Podcastle", "https://podcastle.ai/", "播客录制、降噪与 AI 音频增强。", ["播客", "录音"], "freemium", false),
    tool("Adobe Podcast", "https://podcast.adobe.com/", "浏览器端语音增强与降噪工具。", ["降噪", "免费"], "free", true),
    tool("Otter.ai Live", "https://otter.ai/", "实时会议转写与摘要（音频场景扩展）。", ["转写", "会议"], "freemium", false),
    tool("Rev AI", "https://www.rev.ai/", "高精度语音转写与字幕 API。", ["转写", "API"], "paid", false),
    tool("Deepgram", "https://deepgram.com/", "实时语音识别与理解 API。", ["ASR", "API"], "freemium", true),
    tool("Fish Audio", "https://fish.audio/", "中文语音合成与声音克隆平台。", ["中文", "TTS"], "freemium", true),
    tool("Coqui TTS", "https://coqui.ai/", "开源文本转语音与声音克隆工具。", ["开源", "TTS"], "free", false),
  ],
  dev: [
    tool("Codeium", "https://codeium.com/", "免费 AI 代码补全与聊天，支持多 IDE。", ["补全", "免费"], "free", true),
    tool("JetBrains AI", "https://www.jetbrains.com/ai/", "IntelliJ 系列内置 AI 助手与补全。", ["IDE", "JetBrains"], "paid", false),
    tool("Qodo", "https://www.qodo.ai/", "AI 测试生成与代码质量平台（原 Codium）。", ["测试", "质量"], "freemium", false),
    tool("Sweep AI", "https://sweep.dev/", "GitHub Issue 转 Pull Request 的 AI 工程师。", ["Agent", "GitHub"], "freemium", false),
    tool("Codegen", "https://www.codegen.com/", "企业级 AI 软件工程 Agent 平台。", ["Agent", "企业"], "paid", false),
    tool("Factory", "https://www.factory.ai/", "AI 软件工程师 Agent，面向复杂代码库任务。", ["Agent", "工程"], "paid", false),
    tool("Mentat", "https://www.mentat.ai/", "命令行多文件编辑 AI 编程助手。", ["CLI", "编辑"], "freemium", false),
    tool("OpenHands", "https://github.com/All-Hands-AI/OpenHands", "开源 AI 软件工程师 Agent 开发环境。", ["开源", "Agent"], "free", true),
    tool("SWE-agent", "https://github.com/princeton-nlp/SWE-agent", "学术开源仓库修复 Agent 框架。", ["开源", "研究"], "free", false),
    tool("Cline", "https://cline.bot/", "VS Code AI 自主编程 Agent 扩展。", ["VS Code", "Agent"], "freemium", true),
    tool("Roo Code", "https://roocode.com/", "VS Code 多模式 AI 编程 Agent。", ["VS Code", "Agent"], "free", false),
    tool("Augment Code", "https://www.augmentcode.com/", "深度代码库理解与团队 AI 编程。", ["代码库", "团队"], "paid", false),
    tool("Poolside", "https://poolside.ai/", "企业代码生成与软件工程模型平台。", ["企业", "模型"], "paid", false),
    tool("Magic", "https://magic.dev/", "超长上下文代码生成研究型产品。", ["长上下文", "代码"], "paid", false),
    tool("Supermaven", "https://supermaven.com/", "超快代码补全与多文件上下文。", ["补全", "速度"], "freemium", false),
    tool("Pieces", "https://pieces.app/", "开发者工作流 AI 与代码片段管理。", ["片段", "工作流"], "freemium", false),
  ],
  agents: [
    tool("Activepieces", "https://www.activepieces.com/", "开源 Zapier 替代，支持 AI 步骤与自托管。", ["开源", "自动化"], "freemium", false),
    tool("Pipedream", "https://pipedream.com/", "开发者向工作流与 AI 集成平台。", ["开发者", "API"], "freemium", true),
    tool("Tray.io Merlin", "https://tray.ai/", "企业 iPaaS 与 AI Agent 编排平台。", ["企业", "iPaaS"], "paid", false),
    tool("Workato", "https://www.workato.com/", "企业自动化与 AI 工作流集成。", ["企业", "集成"], "paid", false),
    tool("UiPath", "https://www.uipath.com/", "RPA 与 AI Agent 企业自动化平台。", ["RPA", "企业"], "paid", false),
    tool("Relevance AI", "https://relevanceai.com/", "构建与部署 AI 工作流与 Agent 团队。", ["Agent", "工作流"], "freemium", true),
    tool("Stack AI", "https://www.stack-ai.com/", "可视化构建企业 AI 应用与 Agent。", ["无代码", "企业"], "freemium", false),
    tool("Vellum", "https://www.vellum.ai/", "LLM 应用开发、评测与生产部署平台。", ["评测", "部署"], "paid", false),
    tool("LangSmith", "https://www.langchain.com/langsmith", "LangChain 应用追踪、评测与监控。", ["LangChain", "监控"], "paid", false),
    tool("Langfuse", "https://langfuse.com/", "开源 LLM 应用可观测与评测平台。", ["开源", "可观测"], "freemium", true),
    tool("Superagent", "https://www.superagent.sh/", "Guardrails 与 AI Agent 安全框架。", ["安全", "Agent"], "freemium", false),
    tool("AgentGPT", "https://agentgpt.reworkd.ai/", "浏览器内自主任务 Agent 实验平台。", ["自主", "实验"], "freemium", false),
    tool("MultiOn", "https://www.multion.ai/", "浏览器自动化 AI Agent API。", ["浏览器", "API"], "freemium", false),
    tool("Induced AI", "https://www.induced.ai/", "自然语言驱动的浏览器工作流 Agent。", ["浏览器", "自动化"], "paid", false),
  ],
  design: [
    tool("Sketch AI", "https://www.sketch.com/", "Mac 设计工具与 AI 辅助布局插件生态。", ["UI", "Mac"], "paid", false),
    tool("Adobe Express", "https://www.adobe.com/express/", "快速社媒设计与 Firefly AI 集成。", ["社媒", "Adobe"], "freemium", true),
    tool("Pitch", "https://pitch.com/", "AI 演示文稿协作与设计平台。", ["PPT", "协作"], "freemium", false),
    tool("Tome", "https://tome.app/", "AI 叙事型演示与故事网页生成。", ["演示", "叙事"], "freemium", true),
    tool("SlidesAI", "https://www.slidesai.io/", "Google Slides AI 幻灯片生成插件。", ["Google", "PPT"], "freemium", false),
    tool("Presentations.AI", "https://www.presentations.ai/", "提示词生成完整演示文稿。", ["PPT", "生成"], "freemium", false),
    tool("Kittl", "https://www.kittl.com/", "AI 平面设计、字体与品牌视觉工具。", ["平面", "品牌"], "freemium", false),
    tool("Designs.ai", "https://designs.ai/", "Logo、视频、语音一体化品牌套件。", ["品牌", "套件"], "paid", false),
    tool("Stockimg AI", "https://stockimg.ai/", "封面、Logo 与 UI 素材 AI 生成。", ["素材", "封面"], "freemium", false),
    tool("Autodraw", "https://www.autodraw.com/", "Google 快速涂鸦识别与补全工具。", ["涂鸦", "Google"], "free", false),
    tool("Magician for Figma", "https://magician.design/", "Figma 插件：图标、文案与图片生成。", ["Figma", "插件"], "freemium", false),
    tool("Diagram", "https://diagram.com/", "Figma 官方 AI 设计工具（Magician 团队）。", ["Figma", "AI"], "freemium", false),
  ],
  marketing: [
    tool("Salesforce Einstein", "https://www.salesforce.com/artificial-intelligence/", "CRM 销售、服务与营销 AI 能力套件。", ["CRM", "企业"], "paid", true),
    tool("Marketo AI", "https://business.adobe.com/products/marketo.html", "Adobe Marketo 营销自动化 AI 功能。", ["营销自动化", "Adobe"], "paid", false),
    tool("Mutiny", "https://www.mutinyhq.com/", "网站个性化与 AI 转化优化平台。", ["转化", "个性化"], "paid", false),
    tool("Persado", "https://www.persado.com/", "AI 营销语言情感优化平台。", ["文案", "情感"], "paid", false),
    tool("Jasper Campaigns", "https://www.jasper.ai/campaigns", "多渠道营销活动 AI 编排。", ["活动", "营销"], "paid", false),
    tool("Smartly.io", "https://www.smartly.io/", "广告创意自动化与跨渠道投放 AI。", ["广告", "自动化"], "paid", false),
    tool("Pencil Pro", "https://www.trypencil.com/", "性能驱动的广告创意生成与测试。", ["广告", "创意"], "paid", false),
    tool("Omneky", "https://www.omneky.com/", "多变量广告创意生成与优化。", ["广告", "A/B"], "paid", false),
    tool("Lately AI", "https://www.lately.ai/", "长内容切片为社媒帖子与活动。", ["社媒", "切片"], "paid", false),
    tool("SocialBee AI", "https://socialbee.com/ai-post-generator/", "社媒内容生成与排程助手。", ["社媒", "排程"], "paid", false),
    tool("Vista Social AI", "https://vistasocial.com/", "社媒管理内置 AI 文案与回复。", ["社媒", "管理"], "freemium", false),
    tool("Reply.io", "https://reply.io/", "销售外联序列与 AI 个性化邮件。", ["外联", "销售"], "paid", false),
    tool("Outreach Kaia", "https://www.outreach.io/", "销售对话智能与会议洞察。", ["销售", "对话"], "paid", false),
    tool("6sense", "https://6sense.com/", "B2B 意图数据与 AI 获客平台。", ["B2B", "意图"], "paid", false),
  ],
  seo: [
    tool("Screaming Frog AI", "https://www.screamingfrog.co.uk/seo-spider/", "爬虫 SEO 审计，集成 AI 内容分析。", ["审计", "爬虫"], "paid", false),
    tool("Sitebulb", "https://sitebulb.com/", "可视化 SEO 审计与技术问题诊断。", ["审计", "技术SEO"], "paid", false),
    tool("ContentKing", "https://www.contentkingapp.com/", "实时 SEO 监控与变更告警平台。", ["监控", "告警"], "paid", false),
    tool("BrightEdge", "https://www.brightedge.com/", "企业 SEO 与 AI 内容优化平台。", ["企业", "内容"], "paid", false),
    tool("Conductor", "https://www.conductor.com/", "企业内容智能与 SEO 工作流。", ["企业", "工作流"], "paid", false),
    tool("WriterZen", "https://writerzen.net/", "关键词聚类、主题研究与内容规划。", ["关键词", "规划"], "paid", false),
    tool("LowFruits", "https://lowfruits.io/", "发现低竞争长尾关键词机会。", ["长尾", "关键词"], "paid", false),
    tool("RankIQ", "https://www.rankiq.com/", "博客选题与 SEO 简报工具。", ["博客", "简报"], "paid", false),
    tool("PageOptimizer Pro", "https://www.pageoptimizer.pro/", "页面级 SEO 元素 AI 优化建议。", ["页面优化", "On-page"], "paid", false),
    tool("SurgeGraph", "https://surgegraph.io/", "内容规划与 SEO 文章生成平台。", ["文章", "规划"], "paid", false),
    tool("Outranking", "https://www.outranking.io/", "SERP 分析与 AI SEO 内容工作流。", ["SERP", "工作流"], "paid", false),
    tool("Dashword", "https://www.dashword.com/", "内容简报与 SEO 评分协作工具。", ["简报", "协作"], "paid", false),
  ],
  productivity: [
    tool("Microsoft Copilot Studio", "https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio", "构建企业 Copilot 与业务 Agent。", ["Copilot", "企业"], "paid", true),
    tool("Google NotebookLM Plus", "https://notebooklm.google/", "团队知识库笔记与音频概览。", ["知识库", "Google"], "paid", false),
    tool("Dropbox Dash", "https://www.dropbox.com/dash", "跨应用 AI 搜索与文件问答。", ["搜索", "文件"], "paid", false),
    tool("Box AI", "https://www.box.com/ai", "企业文件内容问答与摘要。", ["企业", "文件"], "paid", false),
    tool("Asana AI", "https://asana.com/product/ai", "项目任务智能、总结与目标追踪。", ["项目", "任务"], "paid", false),
    tool("Monday.com AI", "https://monday.com/w/ai", "工作 OS 中的 AI 列、摘要与自动化。", ["工作流", "协作"], "paid", false),
    tool("Linear AI", "https://linear.app/", "产品工程团队 Issue 与项目 AI 辅助。", ["工程", "Issue"], "paid", false),
    tool("Height", "https://height.app/", "自主项目协调与 AI 项目管理助手。", ["项目", "自主"], "freemium", false),
    tool("Trello AI", "https://trello.com/", "Atlassian 看板内置 AI 内容生成。", ["看板", "Atlassian"], "freemium", false),
    tool("Evernote AI", "https://evernote.com/", "笔记搜索、摘要与写作辅助。", ["笔记", "搜索"], "paid", false),
    tool("Reflect", "https://reflect.app/", "端到端加密笔记与 AI 助手。", ["笔记", "隐私"], "paid", false),
    tool("Cron Calendar AI", "https://cron.com/", "日历智能排程与会议准备（Notion 日历）。", ["日历", "排程"], "free", false),
    tool("Clockwise", "https://www.getclockwise.com/", "AI 专注时间与会议优化调度。", ["日历", "专注"], "freemium", false),
    tool("Fellow.app", "https://fellow.app/", "会议议程、笔记与 AI 行动项。", ["会议", "议程"], "freemium", false),
  ],
  data: [
    tool("ThoughtSpot Sage", "https://www.thoughtspot.com/", "自然语言 BI 搜索与 AI 洞察。", ["BI", "NLQ"], "paid", true),
    tool("Sigma Computing", "https://www.sigmacomputing.com/", "电子表格界面云数据仓库分析。", ["表格", "云"], "paid", false),
    tool("Metabase AI", "https://www.metabase.com/", "开源 BI 与 AI 查询辅助。", ["BI", "开源"], "freemium", false),
    tool("Mode AI", "https://mode.com/", "数据团队协作笔记本与 AI 分析。", ["Notebook", "团队"], "paid", false),
    tool("Observable AI", "https://observablehq.com/", "数据可视化笔记本与生成辅助。", ["可视化", "D3"], "freemium", false),
    tool("Pecan AI", "https://www.pecan.ai/", "预测分析无代码 SQL 替代方案。", ["预测", "无代码"], "paid", false),
    tool("MonkeyLearn", "https://monkeylearn.com/", "文本分类与情感分析无代码平台。", ["NLP", "分类"], "paid", false),
    tool("Obviously AI 2", "https://www.obviously.ai/", "表格上传自动机器学习（扩展条目）。", ["AutoML", "表格"], "paid", false),
    tool("H2O.ai", "https://h2o.ai/", "开源与企业 AutoML 与 Driverless AI。", ["AutoML", "开源"], "freemium", true),
    tool("Domo AI", "https://www.domo.com/", "企业 BI 仪表盘与 AI 数据洞察。", ["BI", "企业"], "paid", false),
    tool("Qlik Answers", "https://www.qlik.com/", "企业数据问答与生成式 BI。", ["BI", "问答"], "paid", false),
    tool("GoodData AI", "https://www.gooddata.com/", "嵌入式分析与 AI 指标解释。", ["嵌入式", "指标"], "paid", false),
  ],
  education: [
    tool("Brainly AI", "https://brainly.com/", "学生作业问答与分步解析社区。", ["作业", "社区"], "freemium", false),
    tool("Chegg Study", "https://www.chegg.com/study", "教材解答与 AI 学习辅导。", ["教材", "辅导"], "paid", false),
    tool("Course Hero AI", "https://www.coursehero.com/", "学习资料与 AI 文档问答。", ["资料", "问答"], "paid", false),
    tool("Numerade", "https://www.numerade.com/", "视频分步解题与 AI 导师。", ["视频", "解题"], "paid", false),
    tool("Cognii", "https://www.cognii.com/", "开放式作业自动评分与辅导。", ["评分", "作文"], "paid", false),
    tool("Gradescope", "https://www.gradescope.com/", "作业批改与 AI 辅助评分平台。", ["批改", "教师"], "paid", false),
    tool("QuestionWell", "https://questionwell.org/", "教师 AI 生成测验与评估题。", ["测验", "教师"], "freemium", false),
    tool("Eduaide", "https://www.eduaide.ai/", "课程计划、评语与差异化教学 AI。", ["备课", "教师"], "freemium", true),
    tool("Diffit", "https://www.diffit.me/", "按阅读水平改编教学文本。", ["差异化", "阅读"], "freemium", false),
    tool("SchoolAI", "https://schoolai.com/", "课堂安全 AI 助手与学生空间。", ["K12", "安全"], "freemium", false),
    tool("Speak", "https://www.speak.com/", "AI 口语对话语言学习应用。", ["口语", "语言"], "paid", true),
    tool("Praktika", "https://praktika.ai/", "AI 虚拟导师口语练习应用。", ["口语", "导师"], "freemium", false),
  ],
  translation: [
    tool("Microsoft Translator", "https://www.microsoft.com/translator", "微软多语言翻译 API 与文档翻译。", ["微软", "API"], "freemium", true),
    tool("Amazon Translate", "https://aws.amazon.com/translate/", "AWS 神经机器翻译服务。", ["AWS", "API"], "paid", false),
    tool("Crowdin AI", "https://crowdin.com/", "软件本地化协作与 AI 翻译建议。", ["本地化", "协作"], "paid", false),
    tool("Transifex AI", "https://www.transifex.com/", "持续本地化与 AI 翻译工作流。", ["本地化", "持续"], "paid", false),
    tool("Tolgee", "https://tolgee.io/", "开源 in-context 本地化与 AI 辅助。", ["开源", "in-context"], "freemium", false),
    tool("Weglot", "https://www.weglot.com/", "网站无代码多语言翻译与 SEO。", ["网站", "SEO"], "paid", false),
    tool("ConveyThis", "https://www.conveythis.com/", "网站 AI 翻译插件与语言切换。", ["网站", "插件"], "paid", false),
    tool("Maestra", "https://maestralabs.com/", "字幕、转写与视频翻译一体化。", ["字幕", "视频"], "paid", false),
    tool("Dubverse", "https://dubverse.ai/", "多语言视频配音与字幕 AI。", ["配音", "视频"], "freemium", false),
    tool("Captions Translate", "https://www.captions.ai/translate", "视频一键多语言翻译与配音。", ["视频", "配音"], "freemium", true),
  ],
  ecommerce: [
    tool("BigCommerce AI", "https://www.bigcommerce.com/", "电商平台 AI 商品与运营建议。", ["电商", "平台"], "paid", false),
    tool("WooCommerce AI", "https://woocommerce.com/", "WordPress 电商 AI 插件生态入口。", ["WordPress", "插件"], "freemium", false),
    tool("Amazon Seller Assistant", "https://sellercentral.amazon.com/", "卖家中心 AI  listing 与运营辅助。", ["Amazon", "卖家"], "paid", false),
    tool("Jungle Scout AI", "https://www.junglescout.com/", "亚马逊选品与关键词 AI 分析。", ["Amazon", "选品"], "paid", true),
    tool("Helium 10", "https://www.helium10.com/", "亚马逊卖家 AI 工具套件。", ["Amazon", "工具"], "paid", false),
    tool("Feedonomics", "https://www.feedonomics.com/", "商品 Feed 优化与 AI 数据质量。", ["Feed", "数据"], "paid", false),
    tool("Syte", "https://www.syte.ai/", "视觉搜索与电商发现 AI。", ["视觉搜索", "发现"], "paid", false),
    tool("Constructor.io", "https://constructor.io/", "电商 AI 搜索与产品发现平台。", ["搜索", "个性化"], "paid", false),
    tool("Dynamic Yield", "https://www.dynamicyield.com/", "个性化推荐与体验优化。", ["个性化", "体验"], "paid", false),
    tool("Rebuy", "https://www.rebuyengine.com/", "Shopify 购物车追加销售 AI。", ["Shopify", "追加销售"], "paid", false),
    tool("Klevu", "https://www.klevu.com/", "电商 NLP 搜索与商品发现。", ["搜索", "NLP"], "paid", false),
    tool("Photoroom API", "https://www.photoroom.com/api", "批量商品图背景处理 API。", ["商品图", "API"], "paid", false),
  ],
  hr: [
    tool("LinkedIn Talent Insights", "https://business.linkedin.com/talent-solutions", "人才市场分析与招聘 AI 洞察。", ["LinkedIn", "人才"], "paid", true),
    tool("Beamery", "https://beamery.com/", "人才 CRM 与 AI 技能画像平台。", ["人才CRM", "技能"], "paid", false),
    tool("Phenom", "https://www.phenom.com/", "候选人体验与招聘营销 AI 平台。", ["候选人", "体验"], "paid", false),
    tool("Fetcher", "https://www.fetcher.ai/", "AI 主动寻访与候选人推荐。", ["寻访", "自动化"], "paid", false),
    tool("HiredScore", "https://www.hiredscore.com/", "AI 简历筛选与内部人才流动。", ["筛选", "内部流动"], "paid", false),
    tool("Pymetrics", "https://www.pymetrics.ai/", "神经科学游戏化测评招聘。", ["测评", "游戏化"], "paid", false),
    tool("Sapia.ai", "https://sapia.ai/", "异步视频面试与 AI 评估。", ["面试", "评估"], "paid", false),
    tool("Metaview", "https://www.metaview.ai/", "面试自动笔记与招聘洞察。", ["面试", "笔记"], "paid", false),
    tool("BrightHire", "https://www.brighthire.ai/", "面试录制、转写与教练分析。", ["面试", "教练"], "paid", false),
    tool("Skillate", "https://www.skillate.com/", "简历解析与 AI 匹配评分。", ["简历", "匹配"], "paid", false),
    tool("Zavvy", "https://www.zavvy.io/", "员工发展、反馈与 AI 教练。", ["员工发展", "教练"], "paid", false),
    tool("Culture Amp AI", "https://www.cultureamp.com/", "员工调研与敬业度 AI 分析。", ["敬业度", "调研"], "paid", false),
  ],
  "legal-finance": [
    tool("Ironclad AI", "https://ironcladapp.com/", "合同生命周期管理与 AI 审查。", ["合同", "CLM"], "paid", true),
    tool("DocuSign IAM", "https://www.docusign.com/", "智能协议管理与 AI 条款分析。", ["签约", "合同"], "paid", false),
    tool("Linksquares", "https://linksquares.com/", "合同库搜索与 AI 法务分析。", ["合同库", "搜索"], "paid", false),
    tool("Evisort", "https://www.evisort.com/", "合同智能提取与义务追踪。", ["提取", "义务"], "paid", false),
    tool("Casetext CoCounsel", "https://casetext.com/", "法律研究与起草 AI（Thomson 生态）。", ["法研", "起草"], "paid", false),
    tool("Everlaw AI", "https://www.everlaw.com/", "电子取证与 AI 文档审查。", ["取证", "诉讼"], "paid", false),
    tool("Relativity aiR", "https://www.relativity.com/", "法律科技 ediscovery AI 功能。", ["ediscovery", "诉讼"], "paid", false),
    tool("Bloomberg Terminal AI", "https://www.bloomberg.com/professional/", "金融终端新闻与数据分析 AI。", ["金融", "终端"], "paid", true),
    tool("Koyfin", "https://www.koyfin.com/", "投资研究仪表盘与 AI 筛选。", ["投研", "仪表盘"], "freemium", false),
    tool("Finchat", "https://finchat.io/", "上市公司财报与自然语言问答。", ["财报", "问答"], "freemium", true),
    tool("Blue J", "https://www.bluej.com/", "税务与法律预测分析 AI。", ["税务", "预测"], "paid", false),
    tool("Trullion", "https://www.trullion.com/", "会计准则与审计 AI 自动化。", ["审计", "会计"], "paid", false),
  ],
  health: [
    tool("OpenEvidence", "https://www.openevidence.com/", "医生循证医学问答与文献摘要。", ["循证", "医生"], "free", true),
    tool("UpToDate AI", "https://www.uptodate.com/", "临床决策支持知识库 AI 功能。", ["临床", "知识库"], "paid", false),
    tool("Doximity GPT", "https://www.doximity.com/", "医生网络内置 AI 文档与沟通。", ["医生", "网络"], "free", false),
    tool("Glass.health", "https://glass.health/", "临床鉴别诊断与病例推理助手。", ["诊断", "病例"], "freemium", false),
    tool("Regard", "https://withregard.com/", "住院病历 AI 诊断建议与文档。", ["住院", "诊断"], "paid", false),
    tool("Navina", "https://www.navina.ai/", "基层医疗患者摘要与风险标记。", ["基层", "摘要"], "paid", false),
    tool("Aledade", "https://www.aledade.com/", "价值医疗数据分析与 AI 运营。", ["价值医疗", "数据"], "paid", false),
    tool("Arterys", "https://www.arterys.com/", "云影像 AI 分析与协作平台。", ["影像", "云"], "paid", false),
    tool("Qure.ai", "https://www.qure.ai/", "医学影像 AI 筛查与诊断辅助。", ["影像", "筛查"], "paid", true),
    tool("Butterfly Network", "https://www.butterflynetwork.com/", "手持超声 AI 引导成像设备。", ["超声", "设备"], "paid", false),
    tool("Insitro", "https://www.insitro.com/", "AI 驱动药物发现与生物学平台。", ["药物", "发现"], "paid", false),
    tool("Recursion", "https://www.recursion.com/", "AI 生物学实验与药物研发平台。", ["生物学", "研发"], "paid", false),
  ],
  models: [
    tool("Llama", "https://www.llama.com/", "Meta 开源大模型家族官方入口。", ["开源", "Meta"], "free", true),
    tool("Qwen", "https://qwenlm.github.io/", "阿里通义开源模型与 API 生态。", ["开源", "中文"], "freemium", true),
    tool("DeepSeek Models", "https://www.deepseek.com/", "DeepSeek 开源权重与 API 模型页。", ["开源", "推理"], "freemium", true),
    tool("AI21 Labs", "https://www.ai21.com/", "Jamba 等企业语言模型 API。", ["企业", "API"], "paid", false),
    tool("Aleph Alpha", "https://aleph-alpha.com/", "欧洲主权 AI 模型与 Luminous 系列。", ["欧洲", "企业"], "paid", false),
    tool("Inflection Pi API", "https://inflection.ai/", "Inflection 模型与 Pi 产品线。", ["对话", "模型"], "paid", false),
    tool("Perplexity Sonar", "https://docs.perplexity.ai/", "搜索增强型在线模型 API。", ["搜索", "API"], "paid", false),
    tool("Baseten", "https://www.baseten.co/", "模型部署、推理与 Truss 框架。", ["部署", "推理"], "freemium", false),
    tool("Modal", "https://modal.com/", "GPU 无服务器运行模型与训练。", ["GPU", "无服务器"], "paid", false),
    tool("Anyscale", "https://www.anyscale.com/", "Ray 分布式训练与推理平台。", ["Ray", "分布式"], "paid", false),
    tool("Predibase", "https://predibase.com/", "LoRA 微调与开源模型托管。", ["微调", "LoRA"], "freemium", false),
    tool("Unsloth", "https://unsloth.ai/", "高效开源模型微调与训练加速。", ["微调", "开源"], "free", true),
    tool("LiteLLM", "https://www.litellm.ai/", "统一调用百余家 LLM 的代理网关。", ["网关", "开源"], "free", false),
    tool("vLLM", "https://github.com/vllm-project/vllm", "高吞吐 LLM 推理服务引擎。", ["推理", "开源"], "free", true),
  ],
  api: [
    tool("NVIDIA NIM", "https://build.nvidia.com/", "NVIDIA 推理微服务与模型 API。", ["NVIDIA", "推理"], "freemium", true),
    tool("Google Vertex AI", "https://cloud.google.com/vertex-ai", "GCP 企业模型训练、部署与 API。", ["GCP", "企业"], "paid", true),
    tool("IBM watsonx", "https://www.ibm.com/watsonx", "IBM 企业生成式 AI 与数据平台。", ["IBM", "企业"], "paid", false),
    tool("Oracle OCI Generative AI", "https://www.oracle.com/artificial-intelligence/", "OCI 托管模型与 Agent 服务。", ["Oracle", "云"], "paid", false),
    tool("Cloudflare Workers AI", "https://developers.cloudflare.com/workers-ai/", "边缘运行开源模型 API。", ["边缘", "Workers"], "freemium", false),
    tool("Voyage AI", "https://www.voyageai.com/", "高质量文本嵌入与 Rerank API。", ["嵌入", "RAG"], "paid", false),
    tool("Jina AI", "https://jina.ai/", "嵌入、Rerank 与神经搜索 API。", ["搜索", "嵌入"], "freemium", true),
    tool("Pinecone", "https://www.pinecone.io/", "向量数据库与推理托管 API。", ["向量", "RAG"], "freemium", false),
    tool("Weaviate Cloud", "https://weaviate.io/", "向量数据库与生成式搜索 API。", ["向量", "搜索"], "freemium", false),
    tool("Qdrant Cloud", "https://qdrant.tech/", "向量数据库云 API 与混合搜索。", ["向量", "混合搜索"], "freemium", false),
    tool("Anthropic MCP", "https://www.anthropic.com/news/model-context-protocol", "模型上下文协议开放标准入口。", ["MCP", "标准"], "free", false),
    tool("OpenAI Realtime API", "https://platform.openai.com/docs/guides/realtime", "低延迟语音对话 API 文档入口。", ["语音", "实时"], "paid", false),
  ],
  meeting: [
    tool("Microsoft Teams Copilot", "https://www.microsoft.com/microsoft-teams/", "Teams 会议摘要、聊天与协作 AI。", ["Teams", "微软"], "paid", true),
    tool("Google Meet Gemini", "https://meet.google.com/", "Meet 笔记、摘要与 Workspace 集成。", ["Meet", "Google"], "paid", false),
    tool("Webex AI Assistant", "https://www.webex.com/", "思科会议摘要与行动项助手。", ["Webex", "企业"], "paid", false),
    tool("Krisp Meetings", "https://krisp.ai/meeting/", "会议降噪与 AI 笔记组合。", ["降噪", "笔记"], "freemium", false),
    tool("Notta", "https://www.notta.ai/", "会议转写、翻译与多语言摘要。", ["转写", "翻译"], "freemium", true),
    tool("Airgram", "https://www.airgram.io/", "会议录制、转写与协作笔记。", ["录制", "协作"], "freemium", false),
    tool("Supernormal", "https://supernormal.com/", "自动会议笔记与 CRM 同步。", ["笔记", "CRM"], "freemium", false),
    tool("Equal Time", "https://equaltime.io/", "会议发言时间公平性与洞察。", ["公平", "洞察"], "freemium", false),
    tool("Sybill", "https://www.sybill.ai/", "销售会议非语言信号与摘要分析。", ["销售", "信号"], "paid", false),
    tool("Clari Copilot", "https://www.clari.com/", "收入团队会议与管道 AI 洞察。", ["收入", "管道"], "paid", false),
    tool("Wingman", "https://www.trywingman.com/", "销售通话实时教练与提示。", ["销售", "教练"], "paid", false),
    tool("Grain", "https://grain.com/", "销售会议高光片段与知识库。", ["高光", "销售"], "freemium", false),
  ],
  safety: [
    tool("Anthropic Constitutional AI", "https://www.anthropic.com/research", "AI 安全与对齐研究公开资料。", ["对齐", "研究"], "free", false),
    tool("OpenAI Safety", "https://openai.com/safety", "OpenAI 安全系统与红队实践说明。", ["安全", "OpenAI"], "free", false),
    tool("Lakera Guard", "https://www.lakera.ai/", "提示词注入与 LLM 防火墙 API。", ["防火墙", "注入"], "freemium", true),
    tool("Protect AI", "https://protectai.com/", "机器学习供应链与模型安全平台。", ["ML安全", "供应链"], "paid", false),
    tool("Robust Intelligence", "https://www.robustintelligence.com/", "AI 验证、防火墙与合规测试。", ["验证", "合规"], "paid", false),
    tool("CalypsoAI", "https://calypsoai.com/", "生成式 AI 企业网关与策略执行。", ["网关", "策略"], "paid", false),
    tool("HiddenLayer", "https://hiddenlayer.com/", "AI 模型与应用运行时安全。", ["运行时", "安全"], "paid", false),
    tool("Preamble", "https://www.preamble.com/", "企业 AI 策略与护栏配置平台。", ["护栏", "企业"], "paid", false),
    tool("Azure AI Content Safety", "https://azure.microsoft.com/products/ai-services/ai-content-safety", "多模态有害内容检测 API。", ["审核", "Azure"], "paid", false),
    tool("Google Perspective API", "https://perspectiveapi.com/", "评论毒性检测与社区审核 API。", ["毒性", "评论"], "free", false),
    tool("Sightengine", "https://sightengine.com/", "图像与视频 NSFW 与 AI 生成检测 API。", ["审核", "API"], "paid", false),
    tool("C2PA", "https://c2pa.org/", "内容来源与真实性密码学标准生态。", ["溯源", "标准"], "free", false),
  ],
};

// Fix duplicate "Obviously AI 2" - replace with different tool
ADDITIONS_RAW.data = ADDITIONS_RAW.data.filter((t) => t[0] !== "Obviously AI 2");
ADDITIONS_RAW.data.push(
  tool("Kanaries", "https://kanaries.net/", "可视化探索分析与 AI 图表建议。", ["可视化", "探索"], "freemium", false)
);

const NEW_CATEGORIES_RAW = [
  {
    id: "social",
    name: "社媒运营",
    short: "Social",
    color: "#e1306c",
    description: "内容创作、排程、分析与多平台运营",
    tools: [
      tool("Later", "https://later.com/", "Instagram 等内容排程与 AI 文案建议。", ["排程", "Instagram"], "freemium", true),
      tool("Sprout Social", "https://sproutsocial.com/", "企业社媒管理、监听与 AI 洞察。", ["企业", "监听"], "paid", true),
      tool("SocialPilot", "https://www.socialpilot.co/", "多账号排程与 AI 帖子生成。", ["排程", "多账号"], "paid", false),
      tool("Publer", "https://publer.io/", "社媒排程、分析与 AI 助手。", ["排程", "分析"], "freemium", false),
      tool("Metricool", "https://metricool.com/", "跨平台数据与 AI 内容建议。", ["分析", "数据"], "freemium", false),
      tool("Planable", "https://planable.io/", "社媒内容协作审批与 AI 文案。", ["协作", "审批"], "paid", false),
      tool("ContentStudio", "https://contentstudio.io/", "内容发现、创作与排程一体化。", ["发现", "排程"], "paid", false),
      tool("Loomly", "https://www.loomly.com/", "品牌日历与帖子 AI 优化建议。", ["日历", "品牌"], "paid", false),
      tool("Brandwatch", "https://www.brandwatch.com/", "社交聆听与消费者洞察 AI。", ["聆听", "洞察"], "paid", true),
      tool("Meltwater", "https://www.meltwater.com/", "公关与社媒情报 AI 分析平台。", ["公关", "情报"], "paid", false),
      tool("Emplifi", "https://emplifi.io/", "客户体验与社媒营销 AI 套件。", ["CX", "营销"], "paid", false),
      tool("Canva Social", "https://www.canva.com/social-media/", "社媒尺寸设计与 AI 内容套件。", ["设计", "Canva"], "freemium", false),
      tool("Flick", "https://www.flick.social/", "Instagram 标签与 AI 文案助手。", ["Instagram", "标签"], "paid", false),
      tool("Hashtag Expert", "https://www.hashtagexpert.com/", "标签研究与 AI 推荐工具。", ["标签", "增长"], "freemium", false),
      tool("Typefully", "https://typefully.com/", "X/Twitter 线程写作与 AI 草稿。", ["Twitter", "线程"], "freemium", true),
    ],
  },
  {
    id: "support",
    name: "客服支持",
    short: "Support",
    color: "#0d9488",
    description: "智能客服、工单、知识库与全渠道支持",
    tools: [
      tool("Intercom Fin", "https://www.intercom.com/fin", "AI 客服 Agent 与知识库问答。", ["客服", "Agent"], "paid", true),
      tool("Zendesk AI", "https://www.zendesk.com/service/ai/", "工单摘要、自动回复与知识库。", ["工单", "Zendesk"], "paid", true),
      tool("Freshdesk Freddy", "https://www.freshworks.com/freshdesk/", "Freshworks AI 客服与自动化。", ["客服", "自动化"], "paid", false),
      tool("Ada", "https://www.ada.cx/", "企业级 AI 客服自动化平台。", ["自动化", "企业"], "paid", true),
      tool("Forethought", "https://forethought.ai/", "支持工单 AI 分类与回复建议。", ["工单", "分类"], "paid", false),
      tool("Ultimate.ai", "https://www.ultimate.ai/", "客服机器人多语言自动化。", ["机器人", "多语言"], "paid", false),
      tool("Cognigy", "https://www.cognigy.com/", "企业对话式 AI 与语音客服。", ["语音", "企业"], "paid", false),
      tool("Yellow.ai", "https://yellow.ai/", "全渠道客服 AI 与自动化编排。", ["全渠道", "编排"], "paid", false),
      tool("Kore.ai", "https://kore.ai/", "企业虚拟助手与流程自动化。", ["虚拟助手", "企业"], "paid", false),
      tool("LivePerson", "https://www.liveperson.com/", "对话式商务与生成式客服。", ["对话商务", "生成式"], "paid", false),
      tool("Gladly", "https://www.gladly.com/", "以客户为中心的 AI 客服平台。", ["客户中心", "客服"], "paid", false),
      tool("Help Scout AI", "https://www.helpscout.com/", "轻量帮助台 AI 草稿与摘要。", ["帮助台", "轻量"], "paid", false),
      tool("Crisp AI", "https://crisp.chat/", "网站客服 AI 与知识库机器人。", ["网站", "机器人"], "freemium", false),
      tool("Tawk.to AI", "https://www.tawk.to/", "免费客服聊天与 AI Assist 插件。", ["免费", "聊天"], "free", false),
      tool("Decagon", "https://decagon.ai/", "高性能 AI 客服 Agent 平台。", ["Agent", "性能"], "paid", false),
    ],
  },
  {
    id: "3d",
    name: "3D与空间",
    short: "3D",
    color: "#7c3aed",
    description: "3D 生成、扫描、纹理、数字孪生与空间计算",
    tools: [
      tool("Meshy", "https://www.meshy.ai/", "文本与图片生成 3D 模型与纹理。", ["文生3D", "纹理"], "freemium", true),
      tool("Luma AI Genie", "https://lumalabs.ai/genie", "文本生成 3D 资产与场景。", ["Luma", "文生3D"], "freemium", true),
      tool("Rodin", "https://hyperhuman.deemos.com/", "高保真 3D 头像与角色生成。", ["头像", "角色"], "paid", false),
      tool("Spline AI", "https://spline.design/", "浏览器 3D 设计与 AI 场景生成。", ["Web3D", "设计"], "freemium", true),
      tool("Kaedim", "https://www.kaedim3d.com/", "2D 概念图转 3D 游戏资产。", ["游戏", "资产"], "paid", false),
      tool("CSM", "https://csm.ai/", "图片转 3D 与场景生成平台。", ["图生3D", "场景"], "freemium", false),
      tool("Tripo AI", "https://www.tripo3d.ai/", "快速文本/图像生成 3D 模型。", ["快速", "3D"], "freemium", true),
      tool("Polycam", "https://poly.cam/", "手机 LiDAR 扫描与 Gaussian Splatting。", ["扫描", "移动端"], "freemium", false),
      tool("RealityScan", "https://www.unrealengine.com/en-US/realityscan", "Epic 照片转 3D 扫描应用。", ["扫描", "Epic"], "free", false),
      tool("Masterpiece X", "https://www.masterpiecex.com/", "VR 中生成与编辑 3D 资产。", ["VR", "编辑"], "freemium", false),
      tool("Scenario 3D", "https://www.scenario.com/features/3d", "游戏 3D 资产生成与风格训练。", ["游戏", "批量"], "paid", false),
      tool("NVIDIA Omniverse", "https://www.nvidia.com/en-us/omniverse/", "3D 协作、数字孪生与 OpenUSD。", ["数字孪生", "NVIDIA"], "freemium", true),
      tool("Unity Muse", "https://unity.com/products/muse", "Unity 编辑器 AI 资产生成套件。", ["Unity", "游戏"], "paid", false),
      tool("Unreal MetaHuman", "https://www.unrealengine.com/metahuman", "高保真数字人创建与动画。", ["数字人", "Unreal"], "free", true),
      tool("Arkio", "https://www.arkio.is/", "VR/AR 协作建筑与空间设计。", ["建筑", "VR"], "freemium", false),
    ],
  },
  {
    id: "nocode",
    name: "无代码应用",
    short: "NoCode",
    color: "#db2777",
    description: "AI 应用搭建、表单、数据库与内部工具",
    tools: [
      tool("Bubble", "https://bubble.io/", "可视化 Web 应用搭建与 AI 助手。", ["Web应用", "可视化"], "paid", true),
      tool("Glide", "https://www.glideapps.com/", "表格驱动移动应用与 AI 列。", ["移动", "表格"], "freemium", true),
      tool("Softr", "https://www.softr.io/", "Airtable/数据源转客户端与门户。", ["门户", "Airtable"], "freemium", false),
      tool("FlutterFlow", "https://flutterflow.io/", "可视化 Flutter 应用与 AI 生成。", ["Flutter", "移动"], "paid", false),
      tool("Retool AI", "https://retool.com/", "内部工具构建与 AI 工作流。", ["内部工具", "企业"], "paid", true),
      tool("Appsmith", "https://www.appsmith.com/", "开源低代码内部应用与 AI 集成。", ["开源", "内部工具"], "freemium", false),
      tool("ToolJet", "https://www.tooljet.com/", "开源 Retool 替代与 AI 插件。", ["开源", "低代码"], "freemium", false),
      tool("Budibase", "https://budibase.com/", "自托管内部工具与自动化。", ["自托管", "自动化"], "freemium", false),
      tool("WeWeb", "https://www.weweb.io/", "无代码前端连接任意后端与 AI。", ["前端", "无头"], "paid", false),
      tool("Adalo", "https://www.adalo.com/", "无代码原生移动应用搭建。", ["移动", "原生"], "paid", false),
      tool("Thunkable", "https://thunkable.com/", "拖拽式移动应用与 AI 组件。", ["移动", "拖拽"], "freemium", false),
      tool("Voiceflow Builder", "https://www.voiceflow.com/", "对话应用无代码构建（扩展分类）。", ["对话", "构建"], "freemium", false),
      tool("Zapier Interfaces", "https://zapier.com/interfaces", "AI 表单与轻量应用界面。", ["表单", "Zapier"], "freemium", false),
      tool("Fillout", "https://www.fillout.com/", "AI 表单、测验与逻辑分支。", ["表单", "测验"], "freemium", false),
      tool("Tally", "https://tally.so/", "免费表单与 AI 问题生成。", ["表单", "免费"], "freemium", true),
    ],
  },
  {
    id: "analytics-growth",
    name: "增长分析",
    short: "Analytics",
    color: "#ca8a04",
    description: "产品分析、实验、归因与增长情报",
    tools: [
      tool("Amplitude AI", "https://amplitude.com/", "产品分析与自然语言洞察问答。", ["产品分析", "NLQ"], "freemium", true),
      tool("Mixpanel Spark", "https://mixpanel.com/", "产品事件分析与 AI 异常检测。", ["事件", "检测"], "freemium", true),
      tool("Heap Sense", "https://www.heap.io/", "自动采集分析与 AI 洞察建议。", ["自动采集", "洞察"], "paid", false),
      tool("PostHog AI", "https://posthog.com/", "开源产品分析、实验与 AI 助手。", ["开源", "实验"], "freemium", true),
      tool("Pendo AI", "https://www.pendo.io/", "产品引导、反馈与 AI 路线图洞察。", ["引导", "反馈"], "paid", false),
      tool("FullStory", "https://www.fullstory.com/", "会话回放与 AI 行为洞察。", ["回放", "行为"], "paid", false),
      tool("Hotjar AI", "https://www.hotjar.com/", "热图、录屏与 AI 调研摘要。", ["热图", "调研"], "paid", false),
      tool("Statsig", "https://www.statsig.com/", "功能开关、实验与 AI 分析报告。", ["实验", "Feature Flag"], "freemium", false),
      tool("Optimizely", "https://www.optimizely.com/", "A/B 测试与个性化 AI 优化。", ["A/B", "个性化"], "paid", false),
      tool("LaunchDarkly", "https://launchdarkly.com/", "功能发布与 AI 运维洞察。", ["Feature Flag", "运维"], "paid", false),
      tool("Segment Protocols", "https://segment.com/", "客户数据平台与 AI 数据质量。", ["CDP", "数据"], "paid", false),
      tool("June", "https://www.june.so/", "B2B SaaS 产品分析 AI 简报。", ["B2B", "简报"], "freemium", false),
      tool("Clearbit Reveal", "https://clearbit.com/", "访客识别与 AI 线索评分。", ["线索", "识别"], "paid", false),
      tool("Factors.ai", "https://www.factors.ai/", "B2B 归因与 AI 管道洞察。", ["归因", "B2B"], "paid", false),
      tool("Gong Labs", "https://www.gong.io/labs/", "收入情报与对话 AI 研究入口。", ["收入", "研究"], "paid", false),
    ],
  },
  {
    id: "creative-video",
    name: "创意剪辑",
    short: "Edit",
    color: "#f97316",
    description: "智能剪辑、调色、特效、字幕与短视频包装",
    tools: [
      tool("Adobe Premiere Pro AI", "https://www.adobe.com/products/premiere.html", "专业剪辑内置生成式与自动工具。", ["专业", "Adobe"], "paid", true),
      tool("DaVinci Resolve AI", "https://www.blackmagicdesign.com/products/davinciresolve", "调色、剪辑与 Magic Mask AI 功能。", ["调色", "专业"], "freemium", true),
      tool("Runway Gen-3", "https://runwayml.com/", "Runway 新一代视频生成与编辑扩展。", ["Runway", "生成"], "freemium", true),
      tool("Topaz Video AI", "https://www.topazlabs.com/video-ai", "视频超分、降噪与帧插值增强。", ["超分", "增强"], "paid", false),
      tool("Gling", "https://www.gling.ai/", "自动剪除口误与静音的剪辑助手。", ["粗剪", "口误"], "freemium", false),
      tool("AutoPod", "https://www.autopod.fm/", "播客多机位自动剪辑插件。", ["播客", "多机位"], "paid", false),
      tool("Morphic", "https://www.morphic.com/", "AI 视频编辑与时间线助手。", ["时间线", "编辑"], "paid", false),
      tool("Filmora AI Portrait", "https://filmora.wondershare.com/", "人像抠像与 AI 背景替换。", ["人像", "抠像"], "freemium", false),
      tool("Unscreen", "https://www.unscreen.com/", "视频自动去背景与绿幕替代。", ["去背景", "视频"], "freemium", false),
      tool("Veed.io AI", "https://www.veed.io/tools/ai", "AI 剪辑、翻译与社媒尺寸导出。", ["社媒", "翻译"], "freemium", false),
      tool("Riverside AI", "https://riverside.fm/", "播客录制、剪辑与 Magic Clips。", ["播客", "录制"], "freemium", true),
      tool("Descript Underlord", "https://www.descript.com/", "AI 驱动全流程音视频编辑助手。", ["Underlord", "全流程"], "freemium", true),
      tool("Opus Clip Pro", "https://www.opus.pro/", "长视频 AI 切片与病毒式标题。", ["切片", "标题"], "freemium", false),
      tool("2short.ai", "https://2short.ai/", "YouTube 长视频自动转 Shorts。", ["Shorts", "YouTube"], "freemium", false),
      tool("Klap", "https://klap.app/", "长视频一键生成多条短视频。", ["短视频", "批量"], "freemium", true),
    ],
  },
];

function dedupeTools(list) {
  const seen = new Set();
  const out = [];
  for (const t of list) {
    const key = t[0].toLowerCase();
    if (seen.has(key) || existingNames.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

const ADDITIONS = {};
let additionsCount = 0;
for (const [id, list] of Object.entries(ADDITIONS_RAW)) {
  const deduped = dedupeTools(list);
  if (deduped.length) ADDITIONS[id] = deduped;
  additionsCount += deduped.length;
}

const NEW_CATEGORIES = NEW_CATEGORIES_RAW.map((cat) => {
  const tools = dedupeTools(cat.tools);
  additionsCount += tools.length;
  const { tools: _t, ...meta } = cat;
  return { ...meta, tools };
});

const allNewTools = [...Object.values(ADDITIONS).flat(), ...NEW_CATEGORIES.flatMap((c) => c.tools)];
const featuredTarget = Math.round(allNewTools.length * 0.25);
let featuredCount = allNewTools.filter((t) => t[5]).length;
for (const t of allNewTools) {
  if (featuredCount >= featuredTarget) break;
  if (!t[5]) {
    t[5] = true;
    featuredCount += 1;
  }
}

function serializeTool(t) {
  const tags = t[3].map((x) => JSON.stringify(x)).join(", ");
  return `    [${JSON.stringify(t[0])}, ${JSON.stringify(t[1])}, ${JSON.stringify(t[2])}, [${tags}], ${JSON.stringify(t[4])}, ${t[5]}]`;
}

let out = "export const ADDITIONS = {\n";
for (const [id, tools] of Object.entries(ADDITIONS)) {
  out += `  ${JSON.stringify(id)}: [\n`;
  out += tools.map(serializeTool).join(",\n");
  out += "\n  ],\n";
}
out += "};\n\nexport const NEW_CATEGORIES = [\n";
for (const cat of NEW_CATEGORIES) {
  out += `  {\n    id: ${JSON.stringify(cat.id)},\n`;
  out += `    name: ${JSON.stringify(cat.name)},\n`;
  out += `    short: ${JSON.stringify(cat.short)},\n`;
  out += `    color: ${JSON.stringify(cat.color)},\n`;
  out += `    description: ${JSON.stringify(cat.description)},\n`;
  out += `    tools: [\n`;
  out += cat.tools.map(serializeTool).join(",\n");
  out += "\n    ]\n  },\n";
}
out += "];\n";

fs.writeFileSync(outPath, out, "utf8");

const fileNames = new Set();
for (const tools of Object.values(ADDITIONS)) for (const t of tools) fileNames.add(t[0].toLowerCase());
for (const cat of NEW_CATEGORIES) for (const t of cat.tools) fileNames.add(t[0].toLowerCase());

console.log(`Wrote ${outPath}`);
console.log(`ADDITIONS categories: ${Object.keys(ADDITIONS).length}, tools: ${Object.values(ADDITIONS).reduce((s, a) => s + a.length, 0)}`);
console.log(`NEW_CATEGORIES: ${NEW_CATEGORIES.length}, tools: ${NEW_CATEGORIES.reduce((s, c) => s + c.tools.length, 0)}`);
console.log(`Total new tools: ${additionsCount}`);
console.log(`Unique names in file: ${fileNames.size}`);
console.log(`Projected total: ${306 + additionsCount}`);
