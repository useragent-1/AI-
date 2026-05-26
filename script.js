const categorySeeds = [
  {
    id: "chat",
    name: "对话聊天",
    short: "Chat",
    color: "#03a6a6",
    description: "通用助手、角色聊天、多模态问答",
    tools: [
      ["ChatGPT", "https://chatgpt.com/", "OpenAI 的多模态 AI 助手，适合写作、分析、编程和图片理解。", ["多模态", "通用助手"], "freemium", true],
      ["Claude", "https://claude.ai/", "Anthropic 的长文本 AI 助手，适合文档分析、代码和深度写作。", ["长上下文", "写作"], "freemium", true],
      ["Gemini", "https://gemini.google.com/", "Google 的多模态 AI 助手，连接搜索、办公和移动端生态。", ["Google", "多模态"], "freemium", true],
      ["Microsoft Copilot", "https://copilot.microsoft.com/", "面向搜索、Windows 和 Microsoft 365 的 AI 助手入口。", ["办公", "搜索"], "freemium", true],
      ["Perplexity", "https://www.perplexity.ai/", "带引用来源的 AI 搜索与问答工具，适合研究和快速查证。", ["AI 搜索", "研究"], "freemium", true],
      ["Poe", "https://poe.com/", "Quora 旗下多模型聊天平台，可集中使用不同 AI 模型。", ["多模型", "聊天"], "freemium", false],
      ["Character.AI", "https://character.ai/", "角色聊天社区，可创建虚拟角色、故事人物和陪伴型助手。", ["角色", "娱乐"], "freemium", false],
      ["HuggingChat", "https://huggingface.co/chat/", "Hugging Face 的开放模型聊天界面，适合体验开源模型。", ["开源模型", "聊天"], "free", false],
      ["Le Chat", "https://chat.mistral.ai/", "Mistral AI 的聊天助手，适合法英双语与欧洲模型生态。", ["Mistral", "聊天"], "freemium", false],
      ["You.com", "https://you.com/", "融合 AI 搜索、写作与研究流程的智能搜索平台。", ["搜索", "助手"], "freemium", false],
      ["DeepSeek", "https://chat.deepseek.com/", "高性价比推理与编程助手，适合中文场景和代码任务。", ["推理", "编程"], "free", true],
      ["Kimi", "https://kimi.moonshot.cn/", "月之暗面长文本助手，适合中文文档阅读、总结和联网搜索。", ["长文本", "中文"], "free", true],
      ["豆包", "https://www.doubao.com/", "字节跳动 AI 助手，覆盖聊天、写作、图片和办公任务。", ["中文", "多模态"], "free", true],
      ["通义千问", "https://tongyi.aliyun.com/qianwen/", "阿里云通义大模型助手，适合中文创作、办公和开发。", ["中文", "办公"], "free", false],
      ["文心一言", "https://yiyan.baidu.com/", "百度文心大模型助手，面向搜索、创作和企业场景。", ["中文", "百度"], "free", false],
      ["秘塔 AI 搜索", "https://metaso.cn/", "中文 AI 搜索工具，适合资料查找、文献检索和总结。", ["AI 搜索", "中文"], "free", true]
    ]
  },
  {
    id: "research",
    name: "搜索研究",
    short: "Research",
    color: "#2563eb",
    description: "AI 搜索、论文、知识库和文档问答",
    tools: [
      ["Elicit", "https://elicit.com/", "AI 文献研究助手，可检索论文、抽取结论并生成证据表。", ["论文", "研究"], "freemium", true],
      ["Consensus", "https://consensus.app/", "基于科研论文的问答搜索工具，适合查看学术共识。", ["论文", "问答"], "freemium", true],
      ["Semantic Scholar", "https://www.semanticscholar.org/", "AI 驱动的学术搜索引擎，覆盖论文、引用和作者关系。", ["学术搜索", "引用"], "free", false],
      ["SciSpace", "https://typeset.io/", "论文阅读、解释和文献综述工具，适合科研写作。", ["论文阅读", "综述"], "freemium", false],
      ["ResearchRabbit", "https://www.researchrabbit.ai/", "可视化论文发现工具，通过引用网络扩展研究路径。", ["论文网络", "发现"], "free", false],
      ["Scite", "https://scite.ai/", "通过智能引用判断论文支持、反驳或提及关系。", ["引用", "学术"], "paid", false],
      ["NotebookLM", "https://notebooklm.google/", "Google 的资料笔记助手，可基于上传资料问答和生成摘要。", ["笔记", "知识库"], "free", true],
      ["Connected Papers", "https://www.connectedpapers.com/", "按论文关系生成可视化文献图谱。", ["文献图谱", "论文"], "freemium", false],
      ["ChatPDF", "https://www.chatpdf.com/", "上传 PDF 后进行摘要、问答和重点提取。", ["PDF", "问答"], "freemium", false],
      ["Humata", "https://www.humata.ai/", "面向长文档和团队知识库的 AI 文档问答工具。", ["文档", "团队"], "freemium", false],
      ["Explainpaper", "https://www.explainpaper.com/", "选中论文段落即可获得通俗解释。", ["论文解释", "阅读"], "freemium", false],
      ["Tavily", "https://www.tavily.com/", "面向 AI Agent 的搜索 API，适合构建研究型应用。", ["搜索 API", "Agent"], "freemium", false]
    ]
  },
  {
    id: "writing",
    name: "写作内容",
    short: "Write",
    color: "#f45d48",
    description: "文案、博客、邮件、小说和润色",
    tools: [
      ["Jasper", "https://www.jasper.ai/", "面向营销团队的 AI 内容创作与品牌语气管理平台。", ["营销文案", "品牌"], "paid", true],
      ["Copy.ai", "https://www.copy.ai/", "销售、营销和内容团队的文案自动化工具。", ["文案", "销售"], "freemium", false],
      ["Writesonic", "https://writesonic.com/", "SEO 文章、广告文案和聊天助手一体化内容平台。", ["SEO", "文章"], "freemium", true],
      ["Grammarly", "https://www.grammarly.com/", "英文写作纠错、语气调整和生成式写作助手。", ["英文", "润色"], "freemium", true],
      ["QuillBot", "https://quillbot.com/", "改写、总结、语法检查和引用生成工具。", ["改写", "总结"], "freemium", false],
      ["Sudowrite", "https://www.sudowrite.com/", "面向小说作者的情节扩写、风格改写和灵感生成工具。", ["小说", "创意写作"], "paid", false],
      ["Anyword", "https://www.anyword.com/", "带表现预测的营销文案生成平台。", ["广告文案", "营销"], "paid", false],
      ["Rytr", "https://rytr.me/", "轻量级 AI 写作助手，覆盖博客、邮件和社媒文案。", ["写作", "轻量"], "freemium", false],
      ["HyperWrite", "https://www.hyperwriteai.com/", "AI 写作、邮件回复和浏览器工作流助手。", ["写作", "邮件"], "freemium", false],
      ["Wordtune", "https://www.wordtune.com/", "英文句子改写、扩写、缩短和语气优化工具。", ["英文", "改写"], "freemium", false],
      ["Frase", "https://www.frase.io/", "SEO 内容研究、文章大纲和优化工具。", ["SEO", "内容"], "paid", false],
      ["Typeface", "https://www.typeface.ai/", "企业级品牌内容生成平台，覆盖文案和视觉素材。", ["品牌", "企业"], "paid", false],
      ["Notion AI", "https://www.notion.so/product/ai", "在 Notion 文档中生成、总结、翻译和改写内容。", ["笔记", "办公"], "paid", true]
    ]
  },
  {
    id: "image",
    name: "图像生成",
    short: "Image",
    color: "#8a5cf6",
    description: "文生图、修图、设计和模型社区",
    tools: [
      ["Midjourney", "https://www.midjourney.com/", "高质量文生图工具，适合视觉概念、插画和设计灵感。", ["文生图", "艺术"], "paid", true],
      ["DALL-E", "https://openai.com/dall-e/", "OpenAI 图像生成模型，支持创意图片和编辑场景。", ["文生图", "OpenAI"], "paid", true],
      ["Adobe Firefly", "https://firefly.adobe.com/", "Adobe 的商业友好型生成式图像与设计工具。", ["设计", "商业"], "freemium", true],
      ["Stable Diffusion", "https://stability.ai/", "开源图像生成生态的核心模型与平台。", ["开源", "文生图"], "freemium", true],
      ["Leonardo AI", "https://leonardo.ai/", "面向游戏、产品和创意资产的 AI 图像生成平台。", ["游戏资产", "设计"], "freemium", true],
      ["Playground AI", "https://playground.com/", "在线 AI 图像创作和编辑工具。", ["图片编辑", "创作"], "freemium", false],
      ["Krea", "https://www.krea.ai/", "实时生成、风格探索和 AI 图像增强工具。", ["实时生成", "增强"], "freemium", true],
      ["Ideogram", "https://ideogram.ai/", "擅长文字排版和海报风格的 AI 图像生成工具。", ["文字海报", "设计"], "freemium", true],
      ["Recraft", "https://www.recraft.ai/", "矢量、图标、插画和品牌图形生成工具。", ["矢量", "品牌"], "freemium", false],
      ["Freepik AI", "https://www.freepik.com/ai", "图片、设计素材和 AI 生成工具集合。", ["素材", "设计"], "freemium", false],
      ["Clipdrop", "https://clipdrop.co/", "抠图、清理、放大、重光照等 AI 图像处理工具。", ["修图", "抠图"], "freemium", false],
      ["Civitai", "https://civitai.com/", "Stable Diffusion 模型、LoRA 和创作者社区。", ["模型社区", "开源"], "free", false],
      ["Dzine", "https://www.dzine.ai/", "AI 图像设计与编辑平台，适合电商和视觉内容。", ["电商图", "编辑"], "freemium", false],
      ["Magnific", "https://magnific.ai/", "AI 图像高清放大和细节增强工具。", ["放大", "增强"], "paid", false]
    ]
  },
  {
    id: "video",
    name: "视频生成",
    short: "Video",
    color: "#ff7a1a",
    description: "文生视频、数字人、剪辑和短视频",
    tools: [
      ["Runway", "https://runwayml.com/", "AI 视频生成与创意编辑平台，覆盖文生视频和视频特效。", ["文生视频", "剪辑"], "freemium", true],
      ["Pika", "https://pika.art/", "面向创作者的 AI 视频生成和动效编辑工具。", ["视频生成", "创意"], "freemium", true],
      ["Luma Dream Machine", "https://lumalabs.ai/dream-machine", "Luma 的视频生成模型，适合镜头运动和真实感画面。", ["文生视频", "镜头"], "freemium", true],
      ["Kling AI", "https://klingai.com/", "快手可灵 AI 视频生成平台，支持高质量中文视频创作。", ["中文", "视频生成"], "freemium", true],
      ["Sora", "https://openai.com/sora/", "OpenAI 视频生成模型，面向高保真长镜头创作。", ["OpenAI", "视频"], "paid", true],
      ["Google Veo", "https://deepmind.google/technologies/veo/", "Google DeepMind 视频生成模型与创作能力。", ["Google", "视频模型"], "paid", false],
      ["Synthesia", "https://www.synthesia.io/", "企业培训和营销用 AI 数字人视频生成平台。", ["数字人", "企业"], "paid", true],
      ["HeyGen", "https://www.heygen.com/", "数字人、视频翻译和营销视频生成工具。", ["数字人", "翻译"], "freemium", true],
      ["D-ID", "https://www.d-id.com/", "头像驱动视频和会话式数字人平台。", ["头像视频", "数字人"], "paid", false],
      ["InVideo AI", "https://invideo.io/ai/", "用提示词生成营销、社媒和讲解视频。", ["短视频", "营销"], "freemium", false],
      ["VEED", "https://www.veed.io/", "在线视频剪辑、字幕、翻译和 AI 视频工具集合。", ["剪辑", "字幕"], "freemium", false],
      ["Descript", "https://www.descript.com/", "文本式音视频剪辑、录屏、播客和 AI 配音工具。", ["剪辑", "播客"], "freemium", true],
      ["OpusClip", "https://www.opus.pro/", "将长视频自动剪成社媒短视频片段。", ["短视频", "切片"], "freemium", false],
      ["Viggle", "https://viggle.ai/", "角色动作迁移和趣味 AI 动画视频工具。", ["动画", "角色"], "freemium", false],
      ["PixVerse", "https://pixverse.ai/", "AI 视频生成平台，支持图片转视频和特效模板。", ["图生视频", "模板"], "freemium", false]
    ]
  },
  {
    id: "audio",
    name: "音频语音",
    short: "Audio",
    color: "#00a878",
    description: "配音、音乐、转写、降噪和声音克隆",
    tools: [
      ["ElevenLabs", "https://elevenlabs.io/", "高质量 AI 配音、声音克隆和多语言语音生成平台。", ["配音", "声音克隆"], "freemium", true],
      ["Suno", "https://suno.com/", "用提示词生成歌曲、伴奏和歌词演唱。", ["音乐生成", "歌曲"], "freemium", true],
      ["Udio", "https://www.udio.com/", "AI 音乐生成工具，适合歌曲片段和风格探索。", ["音乐", "创作"], "freemium", true],
      ["PlayHT", "https://play.ht/", "AI 文本转语音和配音 API 平台。", ["TTS", "API"], "freemium", false],
      ["Murf", "https://murf.ai/", "商业配音、演示视频和品牌语音生成工具。", ["配音", "商业"], "paid", false],
      ["Resemble AI", "https://www.resemble.ai/", "企业级声音克隆、语音合成和语音安全工具。", ["声音克隆", "安全"], "paid", false],
      ["Speechify", "https://speechify.com/", "文本朗读、配音和学习辅助语音工具。", ["朗读", "学习"], "freemium", false],
      ["Whisper", "https://openai.com/research/whisper", "OpenAI 开源语音识别模型，适合转写和字幕。", ["转写", "开源"], "free", true],
      ["AssemblyAI", "https://www.assemblyai.com/", "语音转写、说话人分离和音频理解 API。", ["转写 API", "语音理解"], "freemium", false],
      ["Krisp", "https://krisp.ai/", "会议降噪、回声消除和语音清晰化工具。", ["降噪", "会议"], "freemium", false],
      ["LALAL.AI", "https://www.lalal.ai/", "人声、伴奏和乐器分离工具。", ["音频分离", "音乐"], "freemium", false],
      ["AIVA", "https://www.aiva.ai/", "AI 作曲平台，适合游戏、广告和影视配乐。", ["作曲", "配乐"], "freemium", false],
      ["Soundraw", "https://soundraw.io/", "生成免版税音乐并按段落调整氛围。", ["免版税", "音乐"], "paid", false],
      ["Voicemod", "https://www.voicemod.net/", "实时变声和声音效果工具。", ["变声", "直播"], "freemium", false]
    ]
  },
  {
    id: "dev",
    name: "编程开发",
    short: "Code",
    color: "#14213d",
    description: "代码助手、IDE、代码审查和应用生成",
    tools: [
      ["GitHub Copilot", "https://github.com/features/copilot", "IDE 内 AI 编码助手，支持补全、聊天和代码解释。", ["代码补全", "IDE"], "paid", true],
      ["Cursor", "https://www.cursor.com/", "AI 原生代码编辑器，适合项目级修改、重构和问答。", ["IDE", "Agent"], "freemium", true],
      ["Windsurf", "https://windsurf.com/", "面向 AI 编程工作流的智能 IDE。", ["IDE", "代码助手"], "freemium", true],
      ["Replit", "https://replit.com/", "云端开发环境和 AI 应用生成平台。", ["云 IDE", "应用生成"], "freemium", true],
      ["Lovable", "https://lovable.dev/", "用自然语言生成全栈 Web 应用。", ["应用生成", "无代码"], "freemium", true],
      ["Bolt.new", "https://bolt.new/", "浏览器内 AI 全栈应用开发环境。", ["全栈", "浏览器 IDE"], "freemium", true],
      ["v0", "https://v0.dev/", "Vercel 的 AI UI 生成工具，适合 React 和前端页面。", ["UI 生成", "React"], "freemium", true],
      ["Sourcegraph Cody", "https://sourcegraph.com/cody", "代码库理解、问答和修复助手。", ["代码搜索", "代码库"], "freemium", false],
      ["Tabnine", "https://www.tabnine.com/", "企业代码补全助手，支持私有化和团队规范。", ["补全", "企业"], "freemium", false],
      ["Amazon Q Developer", "https://aws.amazon.com/q/developer/", "AWS 生态的 AI 开发助手，覆盖云资源和代码。", ["AWS", "开发"], "freemium", false],
      ["CodeRabbit", "https://www.coderabbit.ai/", "AI 代码审查工具，可在 Pull Request 中给出审查意见。", ["代码审查", "PR"], "freemium", false],
      ["Devin", "https://devin.ai/", "AI 软件工程 Agent，面向端到端开发任务。", ["Agent", "软件工程"], "paid", true],
      ["Phind", "https://www.phind.com/", "面向开发者的 AI 搜索和代码问答工具。", ["开发搜索", "问答"], "freemium", false],
      ["Continue", "https://www.continue.dev/", "开源 AI 代码助手，可接入本地或云端模型。", ["开源", "IDE"], "free", false],
      ["aider", "https://aider.chat/", "命令行 AI 结对编程工具，直接编辑 Git 仓库。", ["CLI", "开源"], "free", false]
    ]
  },
  {
    id: "agents",
    name: "自动化智能体",
    short: "Agent",
    color: "#e11d48",
    description: "工作流、Agent 构建、客服机器人和自动化",
    tools: [
      ["Zapier AI", "https://zapier.com/ai", "把 AI 接入数千个应用的自动化平台。", ["自动化", "集成"], "freemium", true],
      ["Make", "https://www.make.com/", "可视化工作流自动化平台，支持 AI 节点和多应用集成。", ["工作流", "集成"], "freemium", false],
      ["n8n", "https://n8n.io/", "开源自动化工作流平台，可自托管并接入 AI。", ["开源", "自动化"], "freemium", true],
      ["Gumloop", "https://www.gumloop.com/", "用可视化节点搭建 AI 自动化和数据处理流程。", ["可视化", "Agent"], "freemium", false],
      ["Lindy", "https://www.lindy.ai/", "个人和团队 AI 助手，可自动处理邮件、会议和业务流程。", ["AI 助手", "自动化"], "paid", true],
      ["MindStudio", "https://www.mindstudio.ai/", "无需代码构建和发布 AI 应用与工作流。", ["无代码", "AI 应用"], "freemium", false],
      ["Dify", "https://dify.ai/", "开源 LLM 应用开发平台，支持工作流、Agent 和知识库。", ["开源", "LLM 应用"], "freemium", true],
      ["Flowise", "https://flowiseai.com/", "低代码 LLM 应用与链路编排工具。", ["低代码", "LLM"], "free", false],
      ["LangChain", "https://www.langchain.com/", "构建 LLM 应用和 Agent 的开发框架与平台。", ["开发框架", "Agent"], "freemium", true],
      ["CrewAI", "https://www.crewai.com/", "多 Agent 协作框架和企业平台。", ["多 Agent", "框架"], "freemium", false],
      ["Microsoft AutoGen", "https://microsoft.github.io/autogen/", "微软开源多 Agent 应用开发框架。", ["开源", "多 Agent"], "free", false],
      ["Manus", "https://manus.im/", "通用 AI Agent 产品，面向复杂任务执行。", ["Agent", "任务执行"], "freemium", true],
      ["Chatbase", "https://www.chatbase.co/", "基于网站和文档训练客服聊天机器人。", ["客服", "知识库"], "freemium", false],
      ["Voiceflow", "https://www.voiceflow.com/", "构建聊天机器人、语音助手和客户支持 Agent。", ["客服", "对话设计"], "freemium", false],
      ["Botpress", "https://botpress.com/", "AI Agent 和聊天机器人构建平台。", ["机器人", "客服"], "freemium", false]
    ]
  },
  {
    id: "design",
    name: "设计创意",
    short: "Design",
    color: "#0ea5e9",
    description: "UI、品牌、PPT、原型和创意素材",
    tools: [
      ["Figma AI", "https://www.figma.com/ai/", "Figma 内置 AI 设计、重命名、搜索和原型辅助能力。", ["UI", "设计协作"], "paid", true],
      ["Canva", "https://www.canva.com/ai/", "图文设计、演示、视频和 AI 素材生成工具。", ["设计", "PPT"], "freemium", true],
      ["Uizard", "https://uizard.io/", "用文字或草图生成 UI 原型和界面设计。", ["UI 原型", "草图"], "freemium", false],
      ["Framer AI", "https://www.framer.com/ai/", "用提示词生成可发布网站页面。", ["网站", "无代码"], "freemium", true],
      ["Relume", "https://www.relume.io/", "AI 网站地图、线框图和文案生成工具。", ["网站", "线框图"], "freemium", false],
      ["Galileo AI", "https://www.usegalileo.ai/", "根据提示生成高保真 UI 设计稿。", ["UI 生成", "设计"], "paid", false],
      ["Mobbin", "https://mobbin.com/", "移动端和网页设计参考库，带 AI 搜索。", ["灵感", "产品设计"], "freemium", false],
      ["Khroma", "https://www.khroma.co/", "根据偏好生成和探索配色方案。", ["配色", "品牌"], "free", false],
      ["Looka", "https://looka.com/", "AI Logo、品牌套件和视觉识别生成工具。", ["Logo", "品牌"], "paid", false],
      ["Brandmark", "https://brandmark.io/", "AI 品牌标识和 Logo 设计工具。", ["Logo", "品牌"], "paid", false],
      ["Microsoft Designer", "https://designer.microsoft.com/", "微软图像设计、海报和社媒素材生成工具。", ["海报", "设计"], "freemium", false],
      ["Whimsical AI", "https://whimsical.com/ai", "用 AI 创建流程图、脑图、文档和线框图。", ["流程图", "脑图"], "freemium", false],
      ["Visily", "https://www.visily.ai/", "AI 线框图和产品原型设计工具。", ["原型", "UI"], "freemium", false],
      ["Gamma", "https://gamma.app/", "AI 生成演示文稿、网页和文档。", ["PPT", "文档"], "freemium", true],
      ["Beautiful.ai", "https://www.beautiful.ai/", "自动排版的 AI 演示文稿制作工具。", ["PPT", "排版"], "paid", false]
    ]
  },
  {
    id: "marketing",
    name: "营销增长",
    short: "Growth",
    color: "#f7b731",
    description: "广告、社媒、销售线索、邮件和品牌监测",
    tools: [
      ["HubSpot AI", "https://www.hubspot.com/artificial-intelligence", "CRM、营销、销售和客服场景中的 AI 助手。", ["CRM", "营销"], "paid", true],
      ["AdCreative.ai", "https://www.adcreative.ai/", "生成广告图片、文案和转化导向创意。", ["广告", "创意"], "paid", true],
      ["Predis.ai", "https://predis.ai/", "社媒帖子、短视频、广告素材和内容日历生成工具。", ["社媒", "广告"], "freemium", false],
      ["Ocoya", "https://www.ocoya.com/", "AI 社媒内容创作、排程和分析平台。", ["社媒", "排程"], "paid", false],
      ["Buffer AI Assistant", "https://buffer.com/ai-assistant", "为社媒帖子生成、改写和扩展内容。", ["社媒", "写作"], "freemium", false],
      ["Hootsuite OwlyWriter", "https://www.hootsuite.com/platform/owlywriter-ai", "Hootsuite 的社媒 AI 文案和排程助手。", ["社媒", "品牌"], "paid", false],
      ["Brand24", "https://brand24.com/", "品牌舆情监测和 AI 摘要分析平台。", ["舆情", "品牌"], "paid", false],
      ["Taplio", "https://taplio.com/", "LinkedIn 内容创作、排程和增长工具。", ["LinkedIn", "社媒"], "paid", false],
      ["FeedHive", "https://www.feedhive.com/", "AI 社媒内容规划、发布和复用平台。", ["社媒", "排程"], "paid", false],
      ["Clay", "https://www.clay.com/", "AI 销售线索挖掘、数据丰富和出海获客工具。", ["销售线索", "增长"], "freemium", true],
      ["Apollo", "https://www.apollo.io/", "销售线索数据库、自动化触达和 AI 辅助销售平台。", ["销售", "线索"], "freemium", false],
      ["Regie.ai", "https://www.regie.ai/", "销售邮件、序列和外呼团队内容自动化平台。", ["销售邮件", "自动化"], "paid", false],
      ["Lavender", "https://www.lavender.ai/", "销售邮件评分、改写和个性化建议工具。", ["邮件", "销售"], "freemium", false],
      ["Instantly", "https://instantly.ai/", "冷邮件外联、线索和自动化增长平台。", ["冷邮件", "外联"], "paid", false]
    ]
  },
  {
    id: "seo",
    name: "SEO 优化",
    short: "SEO",
    color: "#16a34a",
    description: "关键词、内容优化、排名追踪和搜索增长",
    tools: [
      ["Surfer SEO", "https://surferseo.com/", "AI 内容优化、关键词研究和 SERP 分析平台。", ["内容优化", "关键词"], "paid", true],
      ["Semrush ContentShake", "https://www.semrush.com/contentshake/", "Semrush 的 AI SEO 内容生成与优化工具。", ["SEO 内容", "Semrush"], "paid", false],
      ["Ahrefs", "https://ahrefs.com/", "SEO 数据平台，覆盖关键词、外链、排名和 AI 内容辅助。", ["SEO 数据", "外链"], "paid", true],
      ["Clearscope", "https://www.clearscope.io/", "内容相关性评分和 SEO 写作优化工具。", ["内容评分", "SEO"], "paid", false],
      ["MarketMuse", "https://www.marketmuse.com/", "AI 内容策略、主题集群和竞争分析平台。", ["内容策略", "主题集群"], "paid", false],
      ["NeuronWriter", "https://neuronwriter.com/", "基于 NLP 的 SEO 内容编辑和优化工具。", ["NLP", "内容"], "paid", false],
      ["Alli AI", "https://www.alliai.com/", "网站级 SEO 自动化和批量优化平台。", ["自动化", "网站优化"], "paid", false],
      ["AlsoAsked", "https://alsoasked.com/", "发现 People Also Ask 问题树，适合内容选题。", ["选题", "问题"], "freemium", false],
      ["Keyword Insights", "https://www.keywordinsights.ai/", "关键词聚类、内容简报和搜索意图分析工具。", ["关键词聚类", "意图"], "paid", false],
      ["SE Ranking", "https://seranking.com/", "排名追踪、竞品分析和 AI SEO 工具集合。", ["排名", "竞品"], "paid", false],
      ["Koala", "https://koala.sh/", "AI SEO 文章生成工具，适合博客和联盟内容。", ["文章生成", "联盟"], "paid", false],
      ["Frase", "https://www.frase.io/", "从 SERP 研究到 AI 大纲和内容优化。", ["SERP", "大纲"], "paid", false]
    ]
  },
  {
    id: "productivity",
    name: "办公效率",
    short: "Office",
    color: "#64748b",
    description: "笔记、项目、邮件、日程和会议效率",
    tools: [
      ["Microsoft 365 Copilot", "https://www.microsoft.com/microsoft-365/copilot", "Word、Excel、PowerPoint、Outlook 和 Teams 的 AI 助手。", ["办公套件", "企业"], "paid", true],
      ["Gemini for Workspace", "https://workspace.google.com/solutions/ai/", "Google Workspace 中的邮件、文档、表格和会议 AI。", ["Google", "办公"], "paid", true],
      ["Notion AI", "https://www.notion.so/product/ai", "笔记、知识库和项目文档中的 AI 写作与总结。", ["笔记", "知识库"], "paid", true],
      ["ClickUp Brain", "https://clickup.com/ai", "项目管理、文档、任务和知识库的 AI 工作助手。", ["项目管理", "任务"], "paid", false],
      ["Coda AI", "https://coda.io/product/ai", "在文档、表格和工作流中生成内容和自动化。", ["文档", "表格"], "paid", false],
      ["Airtable AI", "https://www.airtable.com/platform/ai", "在业务数据库中生成字段、总结记录和自动化。", ["数据库", "自动化"], "paid", false],
      ["Miro AI", "https://miro.com/ai/", "白板中的头脑风暴、总结、分类和图表生成工具。", ["白板", "协作"], "paid", false],
      ["Slack AI", "https://slack.com/features/ai", "频道摘要、线程总结和企业知识搜索。", ["团队沟通", "总结"], "paid", false],
      ["Mem", "https://get.mem.ai/", "自动组织和检索个人笔记的 AI 知识管理工具。", ["笔记", "个人知识"], "freemium", false],
      ["Taskade", "https://www.taskade.com/", "AI 任务、脑图、项目和团队协作工具。", ["任务", "团队"], "freemium", false],
      ["Superhuman AI", "https://superhuman.com/", "高效率邮件客户端中的 AI 写作和整理能力。", ["邮件", "效率"], "paid", false],
      ["Reclaim.ai", "https://reclaim.ai/", "AI 日程安排、任务排期和团队时间管理工具。", ["日程", "时间管理"], "freemium", false],
      ["Motion", "https://www.usemotion.com/", "AI 自动排期、任务和日历管理工具。", ["日历", "任务"], "paid", false],
      ["Scribe", "https://scribehow.com/", "自动记录操作流程并生成 SOP 文档。", ["SOP", "文档"], "freemium", false]
    ]
  },
  {
    id: "data",
    name: "数据分析",
    short: "Data",
    color: "#7c3aed",
    description: "BI、表格、SQL、数据科学和预测",
    tools: [
      ["ChatGPT Data Analyst", "https://chatgpt.com/", "上传文件后进行数据清洗、分析、可视化和报告生成。", ["数据分析", "可视化"], "paid", true],
      ["Julius", "https://julius.ai/", "用自然语言分析表格、CSV 和数据集。", ["表格", "分析"], "freemium", true],
      ["Databricks Assistant", "https://www.databricks.com/product/databricks-assistant", "Databricks 数据平台中的 SQL、代码和数据工程助手。", ["数据工程", "SQL"], "paid", false],
      ["Snowflake Cortex AI", "https://www.snowflake.com/en/data-cloud/cortex/", "Snowflake 内置的 LLM 和机器学习能力。", ["数据云", "LLM"], "paid", false],
      ["Tableau Pulse", "https://www.tableau.com/products/tableau-pulse", "面向业务指标的 AI 洞察和数据解释工具。", ["BI", "洞察"], "paid", false],
      ["Power BI Copilot", "https://powerbi.microsoft.com/", "在 Power BI 中生成报告、总结洞察和 DAX 辅助。", ["BI", "微软"], "paid", true],
      ["Akkio", "https://www.akkio.com/", "无代码预测分析和机器学习平台。", ["预测", "无代码"], "paid", false],
      ["Obviously AI", "https://www.obviously.ai/", "无代码机器学习预测和业务数据建模工具。", ["预测", "机器学习"], "paid", false],
      ["Polymer", "https://www.polymersearch.com/", "上传表格快速生成仪表盘和数据洞察。", ["仪表盘", "表格"], "freemium", false],
      ["DataRobot", "https://www.datarobot.com/", "企业级 AI 与机器学习自动化平台。", ["AutoML", "企业"], "paid", false],
      ["Dataiku", "https://www.dataiku.com/", "企业数据科学、机器学习和生成式 AI 平台。", ["数据科学", "企业"], "paid", false],
      ["Hex", "https://hex.tech/", "协作式数据分析笔记本，支持 SQL、Python 和 AI。", ["Notebook", "SQL"], "freemium", false],
      ["Rows AI", "https://rows.com/ai", "带 AI 的在线表格，可生成公式、分析和摘要。", ["表格", "公式"], "freemium", false],
      ["Seek AI", "https://www.seek.ai/", "企业自然语言数据问答和 SQL 生成平台。", ["SQL", "问答"], "paid", false]
    ]
  },
  {
    id: "education",
    name: "教育学习",
    short: "Learn",
    color: "#2fbf71",
    description: "学习辅导、题目解析、课程和教师工具",
    tools: [
      ["Khanmigo", "https://www.khanmigo.ai/", "Khan Academy 的 AI 学习导师和教师助手。", ["学习导师", "教育"], "paid", true],
      ["Quizlet", "https://quizlet.com/", "学习卡片、测验和 AI 学习辅助平台。", ["背诵", "测验"], "freemium", true],
      ["Duolingo Max", "https://www.duolingo.com/max", "Duolingo 的 AI 语言学习解释和角色对话功能。", ["语言学习", "对话"], "paid", false],
      ["Socratic", "https://socratic.org/", "Google 的拍题解答和学习辅助应用。", ["拍题", "学生"], "free", false],
      ["Photomath", "https://photomath.com/", "数学题拍照解析和步骤讲解工具。", ["数学", "解题"], "freemium", false],
      ["Wolfram Alpha", "https://www.wolframalpha.com/", "计算知识引擎，适合数学、科学和工程问题。", ["计算", "知识"], "freemium", true],
      ["Knowt", "https://knowt.com/", "AI 笔记、闪卡和测验生成工具。", ["笔记", "闪卡"], "freemium", false],
      ["Gizmo", "https://gizmo.ai/", "AI 闪卡和间隔重复学习工具。", ["闪卡", "复习"], "freemium", false],
      ["MagicSchool", "https://www.magicschool.ai/", "教师备课、评语、作业和课堂活动 AI 工具。", ["教师", "备课"], "freemium", true],
      ["Curipod", "https://curipod.com/", "AI 生成互动课堂活动和教学演示。", ["课堂", "互动"], "freemium", false],
      ["Studyable", "https://studyable.app/", "AI 学习助手、闪卡、作文反馈和题目练习。", ["学习", "反馈"], "freemium", false],
      ["ELSA Speak", "https://elsaspeak.com/", "AI 英语发音教练和口语练习应用。", ["英语", "口语"], "freemium", false]
    ]
  },
  {
    id: "translation",
    name: "翻译本地化",
    short: "Localize",
    color: "#0891b2",
    description: "文本、字幕、视频翻译和多语言内容",
    tools: [
      ["DeepL", "https://www.deepl.com/", "高质量机器翻译、写作改进和企业翻译 API。", ["翻译", "写作"], "freemium", true],
      ["Google Translate", "https://translate.google.com/", "覆盖广泛语言的免费翻译入口。", ["翻译", "免费"], "free", true],
      ["Papago", "https://papago.naver.com/", "Naver 翻译工具，擅长韩语、日语和亚洲语言。", ["亚洲语言", "翻译"], "free", false],
      ["ModernMT", "https://www.modernmt.com/", "自适应机器翻译平台，适合企业本地化。", ["企业", "本地化"], "paid", false],
      ["Lokalise AI", "https://lokalise.com/ai/", "产品本地化管理和 AI 翻译工作流平台。", ["产品本地化", "团队"], "paid", false],
      ["Smartling", "https://www.smartling.com/", "企业翻译管理、本地化自动化和 AI 翻译平台。", ["本地化", "企业"], "paid", false],
      ["Phrase", "https://phrase.com/", "软件本地化、翻译管理和 AI 语言技术平台。", ["软件本地化", "TMS"], "paid", false],
      ["Rask AI", "https://www.rask.ai/", "视频翻译、配音和口型同步工具。", ["视频翻译", "配音"], "paid", true],
      ["HeyGen Video Translate", "https://www.heygen.com/video-translate", "视频多语言翻译、配音和口型同步。", ["视频", "口型同步"], "freemium", true],
      ["ElevenLabs Dubbing", "https://elevenlabs.io/dubbing", "多语言视频和音频配音翻译工具。", ["配音", "多语言"], "freemium", false],
      ["Sonix", "https://sonix.ai/", "自动转写、翻译字幕和音视频搜索平台。", ["字幕", "转写"], "paid", false],
      ["Unbabel", "https://unbabel.com/", "面向客服和企业内容的 AI 翻译平台。", ["客服", "企业"], "paid", false]
    ]
  },
  {
    id: "ecommerce",
    name: "电商销售",
    short: "Commerce",
    color: "#db2777",
    description: "商品图、客服、个性化推荐和增长",
    tools: [
      ["Shopify Magic", "https://www.shopify.com/magic", "Shopify 内置 AI 文案、商品描述和店铺运营助手。", ["Shopify", "商品描述"], "free", true],
      ["Shopify Sidekick", "https://www.shopify.com/sidekick", "Shopify 商家 AI 经营助手，可分析店铺并执行运营任务。", ["经营助手", "Shopify"], "paid", true],
      ["Klaviyo AI", "https://www.klaviyo.com/ai", "电商邮件、短信营销和客户预测 AI 平台。", ["邮件营销", "电商"], "paid", false],
      ["Gorgias", "https://www.gorgias.com/", "电商客服平台，支持 AI 自动回复和工单处理。", ["客服", "工单"], "paid", false],
      ["Tidio", "https://www.tidio.com/", "AI 客服聊天机器人和电商客户支持工具。", ["客服", "机器人"], "freemium", false],
      ["Octane AI", "https://www.octaneai.com/", "电商测验、个性化推荐和客户数据收集工具。", ["推荐", "测验"], "paid", false],
      ["Rep AI", "https://www.hellorep.ai/", "面向电商网站的 AI 销售助理和客服。", ["销售助理", "客服"], "paid", false],
      ["Bloomreach", "https://www.bloomreach.com/", "电商搜索、个性化推荐和营销自动化平台。", ["个性化", "搜索"], "paid", false],
      ["Nosto", "https://www.nosto.com/", "电商个性化推荐、搜索和商品体验平台。", ["推荐", "个性化"], "paid", false],
      ["AdScale", "https://www.adscale.com/", "电商广告自动化和营销优化平台。", ["广告", "电商"], "paid", false],
      ["Clerk.io", "https://www.clerk.io/", "电商搜索、推荐、邮件和受众自动化工具。", ["推荐", "搜索"], "paid", false],
      ["Vue.ai", "https://vue.ai/", "零售商品标签、视觉搜索和个性化体验平台。", ["零售", "视觉搜索"], "paid", false],
      ["Claid.ai", "https://claid.ai/", "商品图片增强、背景生成和电商图片 API。", ["商品图", "图片增强"], "freemium", false],
      ["Pencil", "https://www.trypencil.com/", "电商和品牌广告创意生成与测试平台。", ["广告创意", "电商"], "paid", false]
    ]
  },
  {
    id: "hr",
    name: "HR 招聘",
    short: "HR",
    color: "#475569",
    description: "招聘、简历、面试、人才匹配和员工体验",
    tools: [
      ["Textio", "https://textio.com/", "招聘文案和绩效反馈的语言增强平台。", ["招聘文案", "反馈"], "paid", true],
      ["HireVue", "https://www.hirevue.com/", "视频面试、测评和 AI 招聘自动化平台。", ["面试", "测评"], "paid", false],
      ["Eightfold AI", "https://eightfold.ai/", "人才智能平台，覆盖招聘、内部流动和技能画像。", ["人才智能", "企业"], "paid", true],
      ["SeekOut", "https://www.seekout.com/", "人才搜索、候选人发现和招聘智能平台。", ["人才搜索", "招聘"], "paid", false],
      ["Paradox", "https://www.paradox.ai/", "Olivia 招聘助手，可自动处理候选人沟通和排程。", ["招聘助手", "排程"], "paid", false],
      ["Ashby", "https://www.ashbyhq.com/", "招聘 ATS、分析和 AI 辅助招聘流程平台。", ["ATS", "招聘"], "paid", false],
      ["Greenhouse", "https://www.greenhouse.com/", "招聘管理平台，支持结构化招聘和 AI 辅助能力。", ["ATS", "招聘管理"], "paid", false],
      ["Lever", "https://www.lever.co/", "ATS 和候选人关系管理平台。", ["ATS", "CRM"], "paid", false],
      ["Workable", "https://www.workable.com/", "招聘发布、候选人管理和 AI 筛选平台。", ["招聘", "筛选"], "paid", false],
      ["Rezi", "https://www.rezi.ai/", "AI 简历生成、优化和 ATS 友好检查工具。", ["简历", "求职"], "freemium", false],
      ["Teal", "https://www.tealhq.com/", "求职管理、简历优化和职位匹配工具。", ["求职", "简历"], "freemium", false],
      ["Kickresume", "https://www.kickresume.com/", "AI 简历、求职信和个人网站生成工具。", ["简历", "求职信"], "freemium", false],
      ["Resume.io", "https://resume.io/", "简历模板、求职信和简历生成工具。", ["简历", "模板"], "paid", false]
    ]
  },
  {
    id: "legal-finance",
    name: "法律金融",
    short: "Legal",
    color: "#0f766e",
    description: "合同、法研、投研、财务自动化和风控",
    tools: [
      ["Harvey", "https://www.harvey.ai/", "面向律所和企业法务的专业 AI 法律平台。", ["法律", "企业"], "paid", true],
      ["CoCounsel", "https://www.thomsonreuters.com/en/products-services/legal/cocounsel.html", "Thomson Reuters 法律 AI 助手，覆盖法研和文档任务。", ["法律研究", "法务"], "paid", true],
      ["Lexis+ AI", "https://www.lexisnexis.com/en-us/products/lexis-plus-ai.page", "LexisNexis 法律检索、摘要和起草 AI 平台。", ["法律检索", "起草"], "paid", false],
      ["Spellbook", "https://www.spellbook.legal/", "合同审查、起草和条款建议的 AI 法律工具。", ["合同", "审查"], "paid", false],
      ["Robin AI", "https://www.robinai.com/", "合同自动化、审查和企业法务 AI 平台。", ["合同", "法务"], "paid", false],
      ["Luminance", "https://www.luminance.com/", "法律文档审查、尽调和合同分析平台。", ["尽调", "合同"], "paid", false],
      ["Kira Systems", "https://kirasystems.com/", "机器学习合同分析和尽职调查工具。", ["合同分析", "尽调"], "paid", false],
      ["Klarity", "https://www.klarity.ai/", "文档审查、订单和财务流程自动化平台。", ["财务", "文档"], "paid", false],
      ["AlphaSense", "https://www.alpha-sense.com/", "市场情报、公司文件和投研搜索平台。", ["投研", "市场情报"], "paid", true],
      ["Hebbia", "https://www.hebbia.ai/", "面向金融和专业服务的文档研究与分析平台。", ["金融研究", "文档"], "paid", true],
      ["Vic.ai", "https://www.vic.ai/", "应付账款和财务流程 AI 自动化平台。", ["财务自动化", "AP"], "paid", false],
      ["Ramp Intelligence", "https://ramp.com/intelligence", "企业支出管理中的 AI 财务自动化能力。", ["支出管理", "财务"], "paid", false]
    ]
  },
  {
    id: "health",
    name: "医疗健康",
    short: "Health",
    color: "#ef4444",
    description: "临床记录、影像、诊断辅助和医疗运营",
    tools: [
      ["Abridge", "https://www.abridge.com/", "临床对话转写、摘要和医疗记录生成平台。", ["临床记录", "转写"], "paid", true],
      ["Nuance DAX", "https://www.microsoft.com/en-us/industry/health/microsoft-nuance", "微软 Nuance 临床环境语音记录和文档自动化工具。", ["临床语音", "微软"], "paid", true],
      ["Nabla", "https://www.nabla.com/", "AI 临床笔记助手，帮助医生生成就诊记录。", ["临床笔记", "医生"], "paid", false],
      ["Suki AI", "https://www.suki.ai/", "面向医生的语音助手和临床文档自动化平台。", ["医生助手", "文档"], "paid", false],
      ["Ambience Healthcare", "https://www.ambiencehealthcare.com/", "医疗环境 AI 文档、编码和临床支持平台。", ["医疗文档", "编码"], "paid", false],
      ["PathAI", "https://www.pathai.com/", "AI 病理分析和药物研发支持平台。", ["病理", "研发"], "paid", true],
      ["Viz.ai", "https://www.viz.ai/", "AI 医学影像和临床工作流协调平台。", ["医学影像", "工作流"], "paid", false],
      ["Aidoc", "https://www.aidoc.com/", "放射影像 AI 分析和临床决策支持平台。", ["影像", "放射"], "paid", false],
      ["Tempus", "https://www.tempus.com/", "精准医疗、数据和 AI 辅助治疗决策平台。", ["精准医疗", "数据"], "paid", false],
      ["Hippocratic AI", "https://www.hippocraticai.com/", "面向非诊断医疗任务的安全型医疗 AI Agent。", ["医疗 Agent", "运营"], "paid", true],
      ["Glass Health", "https://glass.health/", "医生临床推理、诊断差异和计划生成助手。", ["临床推理", "医生"], "freemium", false],
      ["Freed AI", "https://www.freed.ai/", "AI 医疗记录员，生成 SOAP 笔记和就诊摘要。", ["医疗记录", "SOAP"], "paid", false]
    ]
  },
  {
    id: "models",
    name: "模型与开源",
    short: "Models",
    color: "#9333ea",
    description: "开源模型、本地运行、模型社区和推理服务",
    tools: [
      ["Hugging Face", "https://huggingface.co/", "模型、数据集、Spaces 和开源 AI 社区。", ["模型社区", "开源"], "free", true],
      ["Ollama", "https://ollama.com/", "本地运行 Llama、DeepSeek、Qwen 等大模型的工具。", ["本地模型", "开源"], "free", true],
      ["LM Studio", "https://lmstudio.ai/", "桌面端本地模型下载、聊天和 OpenAI 兼容服务。", ["本地模型", "桌面"], "free", true],
      ["OpenRouter", "https://openrouter.ai/", "统一调用多家模型的 API 路由平台。", ["模型路由", "API"], "paid", true],
      ["Replicate", "https://replicate.com/", "托管和运行开源模型的云推理平台。", ["模型部署", "API"], "freemium", false],
      ["Together AI", "https://www.together.ai/", "开源模型训练、微调和高性能推理平台。", ["推理", "训练"], "paid", true],
      ["Groq", "https://groq.com/", "高速 LLM 推理平台和开发者 API。", ["高速推理", "API"], "freemium", true],
      ["Fireworks AI", "https://fireworks.ai/", "快速模型推理、微调和生产部署平台。", ["推理", "部署"], "paid", false],
      ["Weights & Biases", "https://wandb.ai/", "机器学习实验追踪、评估和模型开发平台。", ["MLOps", "评估"], "freemium", false],
      ["Comet", "https://www.comet.com/", "模型实验管理、评估和生产监控平台。", ["MLOps", "监控"], "freemium", false],
      ["Cohere", "https://cohere.com/", "企业语言模型、检索增强和嵌入服务。", ["企业模型", "RAG"], "paid", false],
      ["Mistral AI", "https://mistral.ai/", "开放权重与商业模型提供商，覆盖聊天和 API。", ["模型", "欧洲"], "freemium", true]
    ]
  },
  {
    id: "api",
    name: "API 平台",
    short: "API",
    color: "#0284c7",
    description: "大模型 API、云平台、嵌入、推理和企业集成",
    tools: [
      ["OpenAI Platform", "https://platform.openai.com/", "GPT、图像、语音、嵌入和 Agent 开发 API。", ["GPT", "API"], "paid", true],
      ["Anthropic Console", "https://console.anthropic.com/", "Claude 模型 API 和企业安全控制台。", ["Claude", "API"], "paid", true],
      ["Google AI Studio", "https://aistudio.google.com/", "Gemini 模型开发、测试和 API Key 管理平台。", ["Gemini", "开发"], "freemium", true],
      ["Azure AI Foundry", "https://ai.azure.com/", "微软企业 AI 应用、模型部署和治理平台。", ["Azure", "企业"], "paid", true],
      ["Amazon Bedrock", "https://aws.amazon.com/bedrock/", "AWS 托管的多模型生成式 AI 服务。", ["AWS", "多模型"], "paid", true],
      ["Mistral AI La Plateforme", "https://console.mistral.ai/", "Mistral 模型 API、微调和企业部署入口。", ["Mistral", "API"], "paid", false],
      ["Cohere Platform", "https://dashboard.cohere.com/", "Command、Embed、Rerank 等企业 LLM API。", ["RAG", "企业"], "paid", false],
      ["xAI API", "https://x.ai/api", "Grok 模型 API 和开发者平台。", ["Grok", "API"], "paid", true],
      ["DeepSeek API", "https://platform.deepseek.com/", "DeepSeek 模型 API，适合推理和代码任务。", ["推理", "API"], "paid", true],
      ["SiliconFlow", "https://siliconflow.cn/", "国内高性价比模型 API 和推理平台。", ["国内", "推理"], "freemium", false],
      ["Together AI", "https://api.together.ai/", "开源和商业模型 API，支持推理与微调。", ["开源模型", "API"], "paid", false],
      ["Replicate API", "https://replicate.com/docs", "通过 API 运行图像、视频、音频和语言模型。", ["多模态", "API"], "paid", false]
    ]
  },
  {
    id: "meeting",
    name: "会议转写",
    short: "Meet",
    color: "#6366f1",
    description: "会议记录、摘要、销售通话和知识沉淀",
    tools: [
      ["Otter", "https://otter.ai/", "会议转写、摘要、行动项和团队共享工具。", ["转写", "会议"], "freemium", true],
      ["Fireflies", "https://fireflies.ai/", "自动加入会议、转写、摘要并同步 CRM。", ["会议机器人", "CRM"], "freemium", true],
      ["Fathom", "https://fathom.video/", "会议录制、转写、摘要和片段分享工具。", ["会议摘要", "录制"], "freemium", false],
      ["tl;dv", "https://tldv.io/", "Google Meet 和 Zoom 会议记录、剪辑和 AI 摘要。", ["会议记录", "剪辑"], "freemium", false],
      ["Read AI", "https://www.read.ai/", "会议摘要、参与度分析和团队沟通洞察。", ["会议分析", "摘要"], "freemium", false],
      ["Granola", "https://www.granola.ai/", "面向个人的 AI 会议笔记工具，保留手写重点并自动补全。", ["会议笔记", "个人"], "freemium", true],
      ["Avoma", "https://www.avoma.com/", "销售会议智能、转写、教练和 CRM 更新。", ["销售会议", "CRM"], "paid", false],
      ["Sembly", "https://www.sembly.ai/", "会议助手、摘要、任务和团队知识沉淀工具。", ["会议助手", "任务"], "freemium", false],
      ["MeetGeek", "https://meetgeek.ai/", "自动录制、转写、总结和分享会议洞察。", ["会议洞察", "自动化"], "freemium", false],
      ["Gong", "https://www.gong.io/", "销售通话智能、收入预测和团队教练平台。", ["销售通话", "收入"], "paid", true],
      ["Chorus", "https://www.zoominfo.com/products/chorus", "销售会话智能和客户互动分析平台。", ["销售", "会话分析"], "paid", false],
      ["Zoom AI Companion", "https://www.zoom.com/en/products/ai-assistant/", "Zoom 会议摘要、聊天撰写和会议辅助功能。", ["Zoom", "会议"], "freemium", false]
    ]
  },
  {
    id: "safety",
    name: "检测安全",
    short: "Safety",
    color: "#dc2626",
    description: "AI 内容检测、审核、合规和可信验证",
    tools: [
      ["GPTZero", "https://gptzero.me/", "AI 文本检测工具，适合教育和内容审核场景。", ["AI 检测", "文本"], "freemium", true],
      ["Originality.ai", "https://originality.ai/", "AI 内容检测、抄袭检测和事实检查平台。", ["检测", "抄袭"], "paid", true],
      ["Copyleaks", "https://copyleaks.com/", "AI 内容检测、抄袭检测和写作完整性平台。", ["抄袭", "AI 检测"], "freemium", false],
      ["ZeroGPT", "https://www.zerogpt.com/", "在线 AI 文本检测和内容工具集合。", ["AI 检测", "文本"], "freemium", false],
      ["Sapling AI Detector", "https://sapling.ai/ai-content-detector", "快速检测文本是否可能由 AI 生成。", ["文本检测", "免费"], "freemium", false],
      ["Winston AI", "https://gowinston.ai/", "AI 内容检测和抄袭检测工具。", ["检测", "教育"], "paid", false],
      ["Smodin", "https://smodin.io/ai-content-detector", "AI 检测、改写、写作和引用工具集合。", ["检测", "写作"], "freemium", false],
      ["Hive Moderation", "https://thehive.ai/", "图像、视频、文本内容审核和 AI 生成内容检测 API。", ["审核", "API"], "paid", true],
      ["Content at Scale", "https://contentatscale.ai/ai-content-detector/", "AI 文本检测和内容质量工具。", ["文本检测", "内容"], "freemium", false],
      ["Turnitin", "https://www.turnitin.com/", "学术原创性检查、AI 写作检测和评分辅助平台。", ["教育", "原创性"], "paid", false],
      ["Deepware Scanner", "https://scanner.deepware.ai/", "深度伪造视频检测工具。", ["Deepfake", "视频"], "free", false],
      ["Reality Defender", "https://www.realitydefender.com/", "企业级深度伪造、语音和图像伪造检测平台。", ["Deepfake", "企业"], "paid", true]
    ]
  }
];

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

const state = {
  category: "all",
  query: "",
  price: "all",
  sort: "featured",
  favoritesOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem("ai-nav-favorites") || "[]"))
};

const categories = [
  {
    id: "all",
    name: "全部工具",
    short: "All",
    color: "#14213d",
    description: "完整 AI 导航"
  },
  ...categorySeeds.map(({ tools, ...category }) => category)
];

const tools = categorySeeds.flatMap((category, categoryIndex) =>
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
      rank: categoryIndex * 100 + toolIndex
    };
  })
);

const els = {
  searchInput: document.querySelector("#searchInput"),
  toolGrid: document.querySelector("#toolGrid"),
  categoryList: document.querySelector("#categoryList"),
  quickGrid: document.querySelector("#quickGrid"),
  resultTitle: document.querySelector("#resultTitle"),
  resultMeta: document.querySelector("#resultMeta"),
  activeTags: document.querySelector("#activeTags"),
  emptyState: document.querySelector("#emptyState"),
  sortSelect: document.querySelector("#sortSelect"),
  clearFilters: document.querySelector("#clearFilters"),
  favoriteToggle: document.querySelector("#favoriteToggle"),
  toolTotal: document.querySelector("#toolTotal"),
  categoryTotal: document.querySelector("#categoryTotal"),
  freeTotal: document.querySelector("#freeTotal")
};

document.addEventListener("DOMContentLoaded", () => {
  hydrateStats();
  renderQuickLinks();
  renderCategories();
  bindEvents();
  render();
});

function bindEvents() {
  document.querySelector(".search-panel").addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = els.searchInput.value.trim();
    render();
    document.querySelector("#directory").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    render();
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

  els.clearFilters.addEventListener("click", () => {
    state.category = "all";
    state.query = "";
    state.price = "all";
    state.sort = "featured";
    state.favoritesOnly = false;
    els.searchInput.value = "";
    els.sortSelect.value = "featured";
    document.querySelectorAll("[data-price]").forEach((button) => button.classList.toggle("active", button.dataset.price === "all"));
    els.favoriteToggle.classList.remove("active");
    renderCategories();
    render();
  });

  els.favoriteToggle.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    els.favoriteToggle.classList.toggle("active", state.favoritesOnly);
    render();
  });

  els.toolGrid.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (!favoriteButton) return;
    const id = favoriteButton.dataset.favorite;
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    localStorage.setItem("ai-nav-favorites", JSON.stringify([...state.favorites]));
    render();
  });
}

function hydrateStats() {
  const freeCount = tools.filter((tool) => tool.price === "free").length;
  els.toolTotal.textContent = tools.length;
  els.categoryTotal.textContent = categorySeeds.length;
  els.freeTotal.textContent = freeCount;
}

function renderQuickLinks() {
  const featured = categorySeeds.slice(0, 12);
  els.quickGrid.innerHTML = featured.map((category) => {
    const count = tools.filter((tool) => tool.categoryId === category.id).length;
    return `
      <button class="quick-card" type="button" data-quick-category="${category.id}" style="--tone:${hexToRgba(category.color, 0.12)};--tone-ink:${category.color}">
        <span class="quick-icon">${escapeHtml(category.short.slice(0, 2))}</span>
        <strong>${escapeHtml(category.name)}</strong>
        <span>${escapeHtml(category.description)} · ${count} 个</span>
      </button>
    `;
  }).join("");

  els.quickGrid.querySelectorAll("[data-quick-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.quickCategory;
      renderCategories();
      render();
      document.querySelector("#directory").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderCategories() {
  els.categoryList.innerHTML = categories.map((category) => {
    const count = category.id === "all" ? tools.length : tools.filter((tool) => tool.categoryId === category.id).length;
    const active = state.category === category.id ? "active" : "";
    return `
      <button class="category-button ${active}" type="button" data-category="${category.id}" style="--dot:${category.color}">
        <span class="category-dot" aria-hidden="true"></span>
        <span>${escapeHtml(category.name)}</span>
        <span class="category-count">${count}</span>
      </button>
    `;
  }).join("");

  els.categoryList.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      renderCategories();
      render();
    });
  });
}

function render() {
  const filtered = getFilteredTools();
  const currentCategory = categories.find((category) => category.id === state.category);
  const titlePrefix = state.favoritesOnly ? "收藏的" : "";
  els.resultTitle.textContent = `${titlePrefix}${currentCategory?.name || "全部工具"}`;
  els.resultMeta.textContent = `${filtered.length} 个结果 · ${state.query || currentCategory?.description || "完整 AI 导航"}`;
  renderActiveTags();
  renderTools(filtered);
}

function getFilteredTools() {
  const query = normalize(state.query);
  return tools
    .filter((tool) => state.category === "all" || tool.categoryId === state.category)
    .filter((tool) => state.price === "all" || tool.price === state.price)
    .filter((tool) => !state.favoritesOnly || state.favorites.has(tool.id))
    .filter((tool) => {
      if (!query) return true;
      const haystack = normalize(`${tool.name} ${tool.description} ${tool.categoryName} ${tool.tags.join(" ")}`);
      return haystack.includes(query);
    })
    .sort((a, b) => {
      if (state.sort === "name") return a.name.localeCompare(b.name);
      if (state.sort === "category") return a.categoryName.localeCompare(b.categoryName) || a.rank - b.rank;
      return Number(b.featured) - Number(a.featured) || a.rank - b.rank;
    });
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
      render();
    });
  });
}

function renderTools(items) {
  els.emptyState.hidden = items.length > 0;
  els.toolGrid.innerHTML = items.map((tool) => {
    const favorite = state.favorites.has(tool.id);
    const initials = getInitials(tool.name);
    return `
      <article class="tool-card">
        <div class="tool-head">
          <span class="tool-logo" style="--logo-bg:${tool.color}">${escapeHtml(initials)}</span>
          <div>
            <a class="tool-name" href="${tool.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.name)}</a>
            <span class="tool-category">${escapeHtml(tool.categoryName)}</span>
          </div>
          <button class="favorite-button ${favorite ? "active" : ""}" type="button" data-favorite="${tool.id}" aria-label="${favorite ? "取消收藏" : "收藏"} ${escapeHtml(tool.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 17.3-5.3 3 1.4-5.9-4.6-4 6-.5L12 4.4l2.4 5.5 6 .5-4.6 4 1.4 5.9z"/></svg>
          </button>
        </div>
        <p class="tool-description">${escapeHtml(tool.description)}</p>
        <div class="tag-row">${tool.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="tool-foot">
          <span class="price" style="--price-color:${priceColors[tool.price]}">${priceLabels[tool.price]}</span>
          <a class="tool-link" href="${tool.url}" target="_blank" rel="noopener noreferrer">访问 ↗</a>
        </div>
      </article>
    `;
  }).join("");
}

function normalize(value) {
  return value.toLowerCase().trim();
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
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
