const categorySeeds = [
  {
    "id": "chat",
    "name": "对话聊天",
    "short": "Chat",
    "color": "#03a6a6",
    "description": "通用助手、角色聊天、多模态问答",
    "tools": [
      [
        "ChatGPT",
        "https://chatgpt.com/",
        "OpenAI 的多模态 AI 助手，适合写作、分析、编程和图片理解。",
        [
          "多模态",
          "通用助手"
        ],
        "freemium",
        true
      ],
      [
        "Claude",
        "https://claude.ai/",
        "Anthropic 的长文本 AI 助手，适合文档分析、代码和深度写作。",
        [
          "长上下文",
          "写作"
        ],
        "freemium",
        true
      ],
      [
        "Gemini",
        "https://gemini.google.com/",
        "Google 的多模态 AI 助手，连接搜索、办公和移动端生态。",
        [
          "Google",
          "多模态"
        ],
        "freemium",
        true
      ],
      [
        "Microsoft Copilot",
        "https://copilot.microsoft.com/",
        "面向搜索、Windows 和 Microsoft 365 的 AI 助手入口。",
        [
          "办公",
          "搜索"
        ],
        "freemium",
        true
      ],
      [
        "Perplexity",
        "https://www.perplexity.ai/",
        "带引用来源的 AI 搜索与问答工具，适合研究和快速查证。",
        [
          "AI 搜索",
          "研究"
        ],
        "freemium",
        true
      ],
      [
        "Poe",
        "https://poe.com/",
        "Quora 旗下多模型聊天平台，可集中使用不同 AI 模型。",
        [
          "多模型",
          "聊天"
        ],
        "freemium",
        false
      ],
      [
        "Character.AI",
        "https://character.ai/",
        "角色聊天社区，可创建虚拟角色、故事人物和陪伴型助手。",
        [
          "角色",
          "娱乐"
        ],
        "freemium",
        false
      ],
      [
        "HuggingChat",
        "https://huggingface.co/chat/",
        "Hugging Face 的开放模型聊天界面，适合体验开源模型。",
        [
          "开源模型",
          "聊天"
        ],
        "free",
        false
      ],
      [
        "Le Chat",
        "https://chat.mistral.ai/",
        "Mistral AI 的聊天助手，适合法英双语与欧洲模型生态。",
        [
          "Mistral",
          "聊天"
        ],
        "freemium",
        false
      ],
      [
        "You.com",
        "https://you.com/",
        "融合 AI 搜索、写作与研究流程的智能搜索平台。",
        [
          "搜索",
          "助手"
        ],
        "freemium",
        false
      ],
      [
        "DeepSeek",
        "https://chat.deepseek.com/",
        "高性价比推理与编程助手，适合中文场景和代码任务。",
        [
          "推理",
          "编程"
        ],
        "free",
        true
      ],
      [
        "Kimi",
        "https://kimi.moonshot.cn/",
        "月之暗面长文本助手，适合中文文档阅读、总结和联网搜索。",
        [
          "长文本",
          "中文"
        ],
        "free",
        true
      ],
      [
        "豆包",
        "https://www.doubao.com/",
        "字节跳动 AI 助手，覆盖聊天、写作、图片和办公任务。",
        [
          "中文",
          "多模态"
        ],
        "free",
        true
      ],
      [
        "通义千问",
        "https://tongyi.aliyun.com/qianwen/",
        "阿里云通义大模型助手，适合中文创作、办公和开发。",
        [
          "中文",
          "办公"
        ],
        "free",
        false
      ],
      [
        "文心一言",
        "https://yiyan.baidu.com/",
        "百度文心大模型助手，面向搜索、创作和企业场景。",
        [
          "中文",
          "百度"
        ],
        "free",
        false
      ],
      [
        "秘塔 AI 搜索",
        "https://metaso.cn/",
        "中文 AI 搜索工具，适合资料查找、文献检索和总结。",
        [
          "AI 搜索",
          "中文"
        ],
        "free",
        true
      ],
      [
        "Grok",
        "https://grok.com/",
        "xAI 实时信息聊天助手，适合新闻、推理与幽默对话。",
        [
          "xAI",
          "实时"
        ],
        "freemium",
        true
      ],
      [
        "Pi",
        "https://pi.ai/",
        "Inflection 情感陪伴型 AI 助手，适合日常聊天与情绪支持。",
        [
          "陪伴",
          "对话"
        ],
        "free",
        true
      ],
      [
        "Meta AI",
        "https://www.meta.ai/",
        "Meta 多模态助手，集成 WhatsApp、Instagram 与 Facebook。",
        [
          "Meta",
          "多模态"
        ],
        "free",
        true
      ],
      [
        "Mistral Le Chat Enterprise",
        "https://mistral.ai/products/le-chat",
        "Mistral 企业版聊天与工作流入口。",
        [
          "企业",
          "Mistral"
        ],
        "paid",
        true
      ],
      [
        "Qwen Chat",
        "https://chat.qwen.ai/",
        "阿里通义千问官方聊天界面，支持长文本与多模态。",
        [
          "通义",
          "中文"
        ],
        "free",
        true
      ],
      [
        "Yi-Large Chat",
        "https://platform.lingyiwanwu.com/",
        "零一万物大模型对话与 API 体验入口。",
        [
          "中文",
          "Yi"
        ],
        "freemium",
        true
      ],
      [
        "Z.ai",
        "https://chat.z.ai/",
        "智谱 GLM 官方对话产品，适合中文推理与工具调用。",
        [
          "智谱",
          "GLM"
        ],
        "free",
        true
      ],
      [
        "百川大模型",
        "https://www.baichuan-ai.com/",
        "百川智能中文大模型对话与行业应用入口。",
        [
          "中文",
          "百川"
        ],
        "freemium",
        true
      ],
      [
        "腾讯元宝",
        "https://yuanbao.tencent.com/",
        "腾讯混元助手，覆盖搜索、写作、编程与多模态。",
        [
          "腾讯",
          "中文"
        ],
        "free",
        true
      ],
      [
        "讯飞星火",
        "https://xinghuo.xfyun.cn/",
        "科大讯飞认知大模型，适合办公、教育与语音场景。",
        [
          "讯飞",
          "中文"
        ],
        "freemium",
        true
      ],
      [
        "Copilot (GitHub)",
        "https://github.com/copilot",
        "GitHub 生态 AI 对话，可结合代码库与 Issues。",
        [
          "GitHub",
          "开发"
        ],
        "paid",
        true
      ],
      [
        "LM Arena",
        "https://lmarena.ai/",
        "匿名盲测多模型对战平台，适合比较模型回答质量。",
        [
          "评测",
          "多模型"
        ],
        "free",
        true
      ],
      [
        "OpenRouter Chat",
        "https://openrouter.ai/chat",
        "通过 OpenRouter 切换多家模型进行对话。",
        [
          "多模型",
          "API"
        ],
        "freemium",
        true
      ],
      [
        "Jan",
        "https://jan.ai/",
        "开源本地聊天客户端，可离线运行多种开源模型。",
        [
          "本地",
          "开源"
        ],
        "free",
        true
      ],
      [
        "LibreChat",
        "https://librechat.ai/",
        "自托管多模型聊天界面，支持 OpenAI、Anthropic 等。",
        [
          "自托管",
          "开源"
        ],
        "free",
        true
      ],
      [
        "Open WebUI",
        "https://openwebui.com/",
        "自托管 Ollama 与 OpenAI 兼容聊天前端。",
        [
          "自托管",
          "Ollama"
        ],
        "free",
        true
      ],
      [
        "Msty",
        "https://msty.app/",
        "桌面端多模型本地与云端聊天应用。",
        [
          "桌面",
          "多模型"
        ],
        "freemium",
        true
      ],
      [
        "Hume AI",
        "https://www.hume.ai/",
        "情感语音与表情共情对话研究产品。",
        [
          "情感",
          "语音"
        ],
        "freemium",
        true
      ],
      [
        "Cohere Coral",
        "https://cohere.com/chat",
        "Cohere 多文档聊天与企业知识问答。",
        [
          "RAG",
          "企业"
        ],
        "freemium",
        true
      ]
    ]
  },
  {
    "id": "research",
    "name": "搜索研究",
    "short": "Research",
    "color": "#2563eb",
    "description": "AI 搜索、论文、知识库和文档问答",
    "tools": [
      [
        "Elicit",
        "https://elicit.com/",
        "AI 文献研究助手，可检索论文、抽取结论并生成证据表。",
        [
          "论文",
          "研究"
        ],
        "freemium",
        true
      ],
      [
        "Consensus",
        "https://consensus.app/",
        "基于科研论文的问答搜索工具，适合查看学术共识。",
        [
          "论文",
          "问答"
        ],
        "freemium",
        true
      ],
      [
        "Semantic Scholar",
        "https://www.semanticscholar.org/",
        "AI 驱动的学术搜索引擎，覆盖论文、引用和作者关系。",
        [
          "学术搜索",
          "引用"
        ],
        "free",
        false
      ],
      [
        "SciSpace",
        "https://typeset.io/",
        "论文阅读、解释和文献综述工具，适合科研写作。",
        [
          "论文阅读",
          "综述"
        ],
        "freemium",
        false
      ],
      [
        "ResearchRabbit",
        "https://www.researchrabbit.ai/",
        "可视化论文发现工具，通过引用网络扩展研究路径。",
        [
          "论文网络",
          "发现"
        ],
        "free",
        false
      ],
      [
        "Scite",
        "https://scite.ai/",
        "通过智能引用判断论文支持、反驳或提及关系。",
        [
          "引用",
          "学术"
        ],
        "paid",
        false
      ],
      [
        "NotebookLM",
        "https://notebooklm.google/",
        "Google 的资料笔记助手，可基于上传资料问答和生成摘要。",
        [
          "笔记",
          "知识库"
        ],
        "free",
        true
      ],
      [
        "Connected Papers",
        "https://www.connectedpapers.com/",
        "按论文关系生成可视化文献图谱。",
        [
          "文献图谱",
          "论文"
        ],
        "freemium",
        false
      ],
      [
        "ChatPDF",
        "https://www.chatpdf.com/",
        "上传 PDF 后进行摘要、问答和重点提取。",
        [
          "PDF",
          "问答"
        ],
        "freemium",
        false
      ],
      [
        "Humata",
        "https://www.humata.ai/",
        "面向长文档和团队知识库的 AI 文档问答工具。",
        [
          "文档",
          "团队"
        ],
        "freemium",
        false
      ],
      [
        "Explainpaper",
        "https://www.explainpaper.com/",
        "选中论文段落即可获得通俗解释。",
        [
          "论文解释",
          "阅读"
        ],
        "freemium",
        false
      ],
      [
        "Tavily",
        "https://www.tavily.com/",
        "面向 AI Agent 的搜索 API，适合构建研究型应用。",
        [
          "搜索 API",
          "Agent"
        ],
        "freemium",
        false
      ],
      [
        "Perplexity Pro",
        "https://www.perplexity.ai/pro",
        "深度研究模式与文件上传，适合专业调研。",
        [
          "研究",
          "搜索"
        ],
        "paid",
        true
      ],
      [
        "Litmaps",
        "https://www.litmaps.com/",
        "文献地图与引文网络可视化发现工具。",
        [
          "文献",
          "可视化"
        ],
        "freemium",
        true
      ],
      [
        "Iris.ai",
        "https://iris.ai/",
        "科研主题发现与论文推荐 AI 助手。",
        [
          "科研",
          "发现"
        ],
        "paid",
        true
      ],
      [
        "Undermind",
        "https://www.undermind.ai/",
        "深度科学文献搜索与证据综合平台。",
        [
          "论文",
          "搜索"
        ],
        "paid",
        true
      ],
      [
        "Paperpal",
        "https://paperpal.com/",
        "学术写作润色、查重与投稿辅助工具。",
        [
          "学术写作",
          "润色"
        ],
        "freemium",
        true
      ],
      [
        "Scholarcy",
        "https://www.scholarcy.com/",
        "论文闪卡摘要与关键发现提取。",
        [
          "摘要",
          "论文"
        ],
        "freemium",
        false
      ],
      [
        "Inciteful",
        "https://inciteful.xyz/",
        "从种子论文扩展相关文献与引用网络。",
        [
          "引文",
          "发现"
        ],
        "free",
        false
      ],
      [
        "Keenious",
        "https://keenious.com/",
        "上传文档后推荐相关学术论文。",
        [
          "推荐",
          "论文"
        ],
        "freemium",
        false
      ],
      [
        "Jenni AI",
        "https://jenni.ai/",
        "学术写作与文献引用辅助平台。",
        [
          "写作",
          "引用"
        ],
        "freemium",
        true
      ],
      [
        "Paperpile",
        "https://paperpile.com/",
        "文献管理与 Google Docs 引用写作工具。",
        [
          "文献管理",
          "写作"
        ],
        "paid",
        false
      ],
      [
        "Zotero",
        "https://www.zotero.org/",
        "开源文献管理，插件支持 AI 摘要与检索。",
        [
          "文献管理",
          "开源"
        ],
        "free",
        false
      ],
      [
        "Dimensions AI",
        "https://www.dimensions.ai/",
        "科研出版物、专利与资助数据分析平台。",
        [
          "科研数据",
          "分析"
        ],
        "freemium",
        false
      ],
      [
        "Springer Nature AI",
        "https://www.springernature.com/gp/ai",
        "出版社 AI 研究助手与论文发现服务。",
        [
          "出版",
          "论文"
        ],
        "paid",
        false
      ],
      [
        "AlphaFold",
        "https://alphafold.ebi.ac.uk/",
        "DeepMind 蛋白质结构预测数据库与工具。",
        [
          "生物",
          "结构"
        ],
        "free",
        true
      ],
      [
        "ResearchGate",
        "https://www.researchgate.net/",
        "学术社交网络与论文发现平台。",
        [
          "学术",
          "社交"
        ],
        "free",
        false
      ],
      [
        "OpenAlex",
        "https://openalex.org/",
        "开放学术图谱与出版物检索 API。",
        [
          "开放数据",
          "API"
        ],
        "free",
        false
      ]
    ]
  },
  {
    "id": "writing",
    "name": "写作内容",
    "short": "Write",
    "color": "#f45d48",
    "description": "文案、博客、邮件、小说和润色",
    "tools": [
      [
        "Jasper",
        "https://www.jasper.ai/",
        "面向营销团队的 AI 内容创作与品牌语气管理平台。",
        [
          "营销文案",
          "品牌"
        ],
        "paid",
        true
      ],
      [
        "Copy.ai",
        "https://www.copy.ai/",
        "销售、营销和内容团队的文案自动化工具。",
        [
          "文案",
          "销售"
        ],
        "freemium",
        false
      ],
      [
        "Writesonic",
        "https://writesonic.com/",
        "SEO 文章、广告文案和聊天助手一体化内容平台。",
        [
          "SEO",
          "文章"
        ],
        "freemium",
        true
      ],
      [
        "Grammarly",
        "https://www.grammarly.com/",
        "英文写作纠错、语气调整和生成式写作助手。",
        [
          "英文",
          "润色"
        ],
        "freemium",
        true
      ],
      [
        "QuillBot",
        "https://quillbot.com/",
        "改写、总结、语法检查和引用生成工具。",
        [
          "改写",
          "总结"
        ],
        "freemium",
        false
      ],
      [
        "Sudowrite",
        "https://www.sudowrite.com/",
        "面向小说作者的情节扩写、风格改写和灵感生成工具。",
        [
          "小说",
          "创意写作"
        ],
        "paid",
        false
      ],
      [
        "Anyword",
        "https://www.anyword.com/",
        "带表现预测的营销文案生成平台。",
        [
          "广告文案",
          "营销"
        ],
        "paid",
        false
      ],
      [
        "Rytr",
        "https://rytr.me/",
        "轻量级 AI 写作助手，覆盖博客、邮件和社媒文案。",
        [
          "写作",
          "轻量"
        ],
        "freemium",
        false
      ],
      [
        "HyperWrite",
        "https://www.hyperwriteai.com/",
        "AI 写作、邮件回复和浏览器工作流助手。",
        [
          "写作",
          "邮件"
        ],
        "freemium",
        false
      ],
      [
        "Wordtune",
        "https://www.wordtune.com/",
        "英文句子改写、扩写、缩短和语气优化工具。",
        [
          "英文",
          "改写"
        ],
        "freemium",
        false
      ],
      [
        "Frase",
        "https://www.frase.io/",
        "SEO 内容研究、文章大纲和优化工具。",
        [
          "SEO",
          "内容"
        ],
        "paid",
        false
      ],
      [
        "Typeface",
        "https://www.typeface.ai/",
        "企业级品牌内容生成平台，覆盖文案和视觉素材。",
        [
          "品牌",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Notion AI",
        "https://www.notion.so/product/ai",
        "在 Notion 文档中生成、总结、翻译和改写内容。",
        [
          "笔记",
          "办公"
        ],
        "paid",
        true
      ],
      [
        "Writer",
        "https://writer.com/",
        "企业品牌语气与合规内容生成平台。",
        [
          "企业",
          "品牌"
        ],
        "paid",
        true
      ],
      [
        "Longshot",
        "https://www.longshot.ai/",
        "事实核查与 SEO 长文写作工作流。",
        [
          "SEO",
          "事实核查"
        ],
        "paid",
        false
      ],
      [
        "Narrato",
        "https://narrato.io/",
        "内容工作流、协作与 AI 写作一体化平台。",
        [
          "协作",
          "内容"
        ],
        "paid",
        false
      ],
      [
        "Simplified",
        "https://simplified.com/",
        "文案、设计与视频一体化 AI 内容平台。",
        [
          "多模态",
          "营销"
        ],
        "freemium",
        false
      ],
      [
        "ContentBot",
        "https://contentbot.ai/",
        "博客、广告与邮件 AI 文案生成工具。",
        [
          "文案",
          "博客"
        ],
        "paid",
        false
      ],
      [
        "Copysmith",
        "https://copysmith.ai/",
        "电商与广告批量文案生成平台。",
        [
          "电商",
          "广告"
        ],
        "paid",
        false
      ],
      [
        "Peppertype",
        "https://www.peppertype.ai/",
        "营销文案与创意变体生成工具。",
        [
          "营销",
          "创意"
        ],
        "paid",
        false
      ],
      [
        "Writecream",
        "https://www.writecream.com/",
        "冷邮件、博客与语音内容生成工具。",
        [
          "冷邮件",
          "博客"
        ],
        "freemium",
        false
      ],
      [
        "TextCortex",
        "https://textcortex.com/",
        "浏览器内写作、翻译与知识库助手。",
        [
          "浏览器",
          "写作"
        ],
        "freemium",
        false
      ],
      [
        "Lex",
        "https://lex.page/",
        "AI 原生写作编辑器，适合长文与创意写作。",
        [
          "编辑器",
          "创意"
        ],
        "freemium",
        true
      ],
      [
        "NovelAI",
        "https://novelai.net/",
        "面向小说与角色扮演的 AI 写作平台。",
        [
          "小说",
          "角色"
        ],
        "paid",
        false
      ],
      [
        "Squibler",
        "https://www.squibler.io/",
        "剧本、书籍与故事结构 AI 写作工具。",
        [
          "故事",
          "剧本"
        ],
        "paid",
        false
      ],
      [
        "ProWritingAid",
        "https://prowritingaid.com/",
        "英文写作风格、语法与可读性分析。",
        [
          "英文",
          "润色"
        ],
        "freemium",
        false
      ],
      [
        "LanguageTool",
        "https://languagetool.org/",
        "多语言语法检查与 AI 改写建议。",
        [
          "语法",
          "多语言"
        ],
        "freemium",
        false
      ],
      [
        "Moonbeam",
        "https://www.gomoonbeam.com/",
        "长文博客与 Newsletter AI 写作工具。",
        [
          "长文",
          "博客"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "image",
    "name": "图像生成",
    "short": "Image",
    "color": "#8a5cf6",
    "description": "文生图、修图、设计和模型社区",
    "tools": [
      [
        "Midjourney",
        "https://www.midjourney.com/",
        "高质量文生图工具，适合视觉概念、插画和设计灵感。",
        [
          "文生图",
          "艺术"
        ],
        "paid",
        true
      ],
      [
        "DALL-E",
        "https://openai.com/dall-e/",
        "OpenAI 图像生成模型，支持创意图片和编辑场景。",
        [
          "文生图",
          "OpenAI"
        ],
        "paid",
        true
      ],
      [
        "Adobe Firefly",
        "https://firefly.adobe.com/",
        "Adobe 的商业友好型生成式图像与设计工具。",
        [
          "设计",
          "商业"
        ],
        "freemium",
        true
      ],
      [
        "Stable Diffusion",
        "https://stability.ai/",
        "开源图像生成生态的核心模型与平台。",
        [
          "开源",
          "文生图"
        ],
        "freemium",
        true
      ],
      [
        "Leonardo AI",
        "https://leonardo.ai/",
        "面向游戏、产品和创意资产的 AI 图像生成平台。",
        [
          "游戏资产",
          "设计"
        ],
        "freemium",
        true
      ],
      [
        "Playground AI",
        "https://playground.com/",
        "在线 AI 图像创作和编辑工具。",
        [
          "图片编辑",
          "创作"
        ],
        "freemium",
        false
      ],
      [
        "Krea",
        "https://www.krea.ai/",
        "实时生成、风格探索和 AI 图像增强工具。",
        [
          "实时生成",
          "增强"
        ],
        "freemium",
        true
      ],
      [
        "Ideogram",
        "https://ideogram.ai/",
        "擅长文字排版和海报风格的 AI 图像生成工具。",
        [
          "文字海报",
          "设计"
        ],
        "freemium",
        true
      ],
      [
        "Recraft",
        "https://www.recraft.ai/",
        "矢量、图标、插画和品牌图形生成工具。",
        [
          "矢量",
          "品牌"
        ],
        "freemium",
        false
      ],
      [
        "Freepik AI",
        "https://www.freepik.com/ai",
        "图片、设计素材和 AI 生成工具集合。",
        [
          "素材",
          "设计"
        ],
        "freemium",
        false
      ],
      [
        "Clipdrop",
        "https://clipdrop.co/",
        "抠图、清理、放大、重光照等 AI 图像处理工具。",
        [
          "修图",
          "抠图"
        ],
        "freemium",
        false
      ],
      [
        "Civitai",
        "https://civitai.com/",
        "Stable Diffusion 模型、LoRA 和创作者社区。",
        [
          "模型社区",
          "开源"
        ],
        "free",
        false
      ],
      [
        "Dzine",
        "https://www.dzine.ai/",
        "AI 图像设计与编辑平台，适合电商和视觉内容。",
        [
          "电商图",
          "编辑"
        ],
        "freemium",
        false
      ],
      [
        "Magnific",
        "https://magnific.ai/",
        "AI 图像高清放大和细节增强工具。",
        [
          "放大",
          "增强"
        ],
        "paid",
        false
      ],
      [
        "Flux",
        "https://blackforestlabs.ai/",
        "Black Forest Labs 高质量文生图模型家族。",
        [
          "文生图",
          "Flux"
        ],
        "freemium",
        true
      ],
      [
        "Imagen",
        "https://deepmind.google/technologies/imagen/",
        "Google Imagen 图像生成研究与产品入口。",
        [
          "Google",
          "文生图"
        ],
        "paid",
        false
      ],
      [
        "getimg.ai",
        "https://getimg.ai/",
        "在线 Stable Diffusion 与修图工具套件。",
        [
          "SD",
          "修图"
        ],
        "freemium",
        false
      ],
      [
        "NightCafe",
        "https://creator.nightcafe.studio/",
        "多风格 AI 艺术生成社区平台。",
        [
          "艺术",
          "社区"
        ],
        "freemium",
        false
      ],
      [
        "Artbreeder",
        "https://www.artbreeder.com/",
        "人像与角色基因混合创作平台。",
        [
          "人像",
          "混合"
        ],
        "freemium",
        false
      ],
      [
        "Scenario",
        "https://www.scenario.com/",
        "游戏资产批量生成与风格训练平台。",
        [
          "游戏",
          "资产"
        ],
        "paid",
        true
      ],
      [
        "Photoroom",
        "https://www.photoroom.com/",
        "电商抠图、背景替换与商品图 AI 工具。",
        [
          "电商",
          "抠图"
        ],
        "freemium",
        true
      ],
      [
        "Remove.bg",
        "https://www.remove.bg/",
        "一键 AI 抠图与背景移除 API。",
        [
          "抠图",
          "API"
        ],
        "freemium",
        false
      ],
      [
        "Topaz Photo AI",
        "https://www.topazlabs.com/photo-ai",
        "照片降噪、锐化与超分辨率增强。",
        [
          "修图",
          "增强"
        ],
        "paid",
        false
      ],
      [
        "Bria",
        "https://bria.ai/",
        "商业安全文生图与编辑 API 平台。",
        [
          "API",
          "商业"
        ],
        "paid",
        false
      ],
      [
        "Shutterstock AI",
        "https://www.shutterstock.com/ai-image-generator",
        "正版素材库 AI 图像生成入口。",
        [
          "素材",
          "商业"
        ],
        "paid",
        false
      ],
      [
        "Vectorizer.AI",
        "https://vectorizer.ai/",
        "位图转矢量 SVG 的 AI 工具。",
        [
          "矢量",
          "转换"
        ],
        "freemium",
        false
      ],
      [
        "Picsart AI",
        "https://picsart.com/ai-image-generator",
        "移动端 AI 图像生成与编辑。",
        [
          "移动端",
          "编辑"
        ],
        "freemium",
        false
      ],
      [
        "Fotor AI",
        "https://www.fotor.com/ai-image-generator/",
        "在线 AI 图像生成与照片编辑套件。",
        [
          "在线",
          "修图"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "video",
    "name": "视频生成",
    "short": "Video",
    "color": "#ff7a1a",
    "description": "文生视频、数字人、剪辑和短视频",
    "tools": [
      [
        "Runway",
        "https://runwayml.com/",
        "AI 视频生成与创意编辑平台，覆盖文生视频和视频特效。",
        [
          "文生视频",
          "剪辑"
        ],
        "freemium",
        true
      ],
      [
        "Pika",
        "https://pika.art/",
        "面向创作者的 AI 视频生成和动效编辑工具。",
        [
          "视频生成",
          "创意"
        ],
        "freemium",
        true
      ],
      [
        "Luma Dream Machine",
        "https://lumalabs.ai/dream-machine",
        "Luma 的视频生成模型，适合镜头运动和真实感画面。",
        [
          "文生视频",
          "镜头"
        ],
        "freemium",
        true
      ],
      [
        "Kling AI",
        "https://klingai.com/",
        "快手可灵 AI 视频生成平台，支持高质量中文视频创作。",
        [
          "中文",
          "视频生成"
        ],
        "freemium",
        true
      ],
      [
        "Sora",
        "https://openai.com/sora/",
        "OpenAI 视频生成模型，面向高保真长镜头创作。",
        [
          "OpenAI",
          "视频"
        ],
        "paid",
        true
      ],
      [
        "Google Veo",
        "https://deepmind.google/technologies/veo/",
        "Google DeepMind 视频生成模型与创作能力。",
        [
          "Google",
          "视频模型"
        ],
        "paid",
        false
      ],
      [
        "Synthesia",
        "https://www.synthesia.io/",
        "企业培训和营销用 AI 数字人视频生成平台。",
        [
          "数字人",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "HeyGen",
        "https://www.heygen.com/",
        "数字人、视频翻译和营销视频生成工具。",
        [
          "数字人",
          "翻译"
        ],
        "freemium",
        true
      ],
      [
        "D-ID",
        "https://www.d-id.com/",
        "头像驱动视频和会话式数字人平台。",
        [
          "头像视频",
          "数字人"
        ],
        "paid",
        false
      ],
      [
        "InVideo AI",
        "https://invideo.io/ai/",
        "用提示词生成营销、社媒和讲解视频。",
        [
          "短视频",
          "营销"
        ],
        "freemium",
        false
      ],
      [
        "VEED",
        "https://www.veed.io/",
        "在线视频剪辑、字幕、翻译和 AI 视频工具集合。",
        [
          "剪辑",
          "字幕"
        ],
        "freemium",
        false
      ],
      [
        "Descript",
        "https://www.descript.com/",
        "文本式音视频剪辑、录屏、播客和 AI 配音工具。",
        [
          "剪辑",
          "播客"
        ],
        "freemium",
        true
      ],
      [
        "OpusClip",
        "https://www.opus.pro/",
        "将长视频自动剪成社媒短视频片段。",
        [
          "短视频",
          "切片"
        ],
        "freemium",
        false
      ],
      [
        "Viggle",
        "https://viggle.ai/",
        "角色动作迁移和趣味 AI 动画视频工具。",
        [
          "动画",
          "角色"
        ],
        "freemium",
        false
      ],
      [
        "PixVerse",
        "https://pixverse.ai/",
        "AI 视频生成平台，支持图片转视频和特效模板。",
        [
          "图生视频",
          "模板"
        ],
        "freemium",
        false
      ],
      [
        "Haiper",
        "https://haiper.ai/",
        "文生视频与图生视频创作平台。",
        [
          "文生视频",
          "创意"
        ],
        "freemium",
        true
      ],
      [
        "Minimax Video",
        "https://www.minimax.io/",
        "MiniMax 海螺 AI 视频生成产品。",
        [
          "中文",
          "视频"
        ],
        "freemium",
        true
      ],
      [
        "Genmo",
        "https://www.genmo.ai/",
        "Mochi 等开源视频模型托管与生成。",
        [
          "开源",
          "视频"
        ],
        "freemium",
        false
      ],
      [
        "LTX Studio",
        "https://ltx.studio/",
        "Lightricks 端到端 AI 影视分镜与视频工作流。",
        [
          "影视",
          "分镜"
        ],
        "freemium",
        true
      ],
      [
        "Captions",
        "https://www.captions.ai/",
        "AI 字幕、配音与短视频剪辑应用。",
        [
          "字幕",
          "短视频"
        ],
        "freemium",
        true
      ],
      [
        "Fliki",
        "https://fliki.ai/",
        "文本转视频与 AI 配音解说工具。",
        [
          "文本转视频",
          "配音"
        ],
        "freemium",
        false
      ],
      [
        "Pictory",
        "https://pictory.ai/",
        "长文/博客自动转短视频营销内容。",
        [
          "营销",
          "短视频"
        ],
        "paid",
        false
      ],
      [
        "Colossyan",
        "https://www.colossyan.com/",
        "企业培训与多语言数字人视频。",
        [
          "数字人",
          "培训"
        ],
        "paid",
        false
      ],
      [
        "Elai.io",
        "https://elai.io/",
        "幻灯片转数字人讲解视频平台。",
        [
          "数字人",
          "PPT"
        ],
        "paid",
        false
      ],
      [
        "Hour One",
        "https://hourone.ai/",
        "虚拟主播与品牌数字人视频生成。",
        [
          "数字人",
          "品牌"
        ],
        "paid",
        false
      ],
      [
        "Wondershare Filmora AI",
        "https://filmora.wondershare.com/",
        "消费级视频剪辑内置 AI 特效套件。",
        [
          "剪辑",
          "特效"
        ],
        "freemium",
        false
      ],
      [
        "Kapwing AI",
        "https://www.kapwing.com/ai",
        "在线协作剪辑与 AI 字幕、翻译工具。",
        [
          "协作",
          "字幕"
        ],
        "freemium",
        false
      ],
      [
        "Submagic",
        "https://www.submagic.co/",
        "自动字幕样式与短视频包装 AI。",
        [
          "字幕",
          "包装"
        ],
        "freemium",
        false
      ],
      [
        "Wisecut",
        "https://www.wisecut.video/",
        "自动剪静音、字幕与 B-roll 的 AI 剪辑。",
        [
          "自动剪辑",
          "短视频"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "audio",
    "name": "音频语音",
    "short": "Audio",
    "color": "#00a878",
    "description": "配音、音乐、转写、降噪和声音克隆",
    "tools": [
      [
        "ElevenLabs",
        "https://elevenlabs.io/",
        "高质量 AI 配音、声音克隆和多语言语音生成平台。",
        [
          "配音",
          "声音克隆"
        ],
        "freemium",
        true
      ],
      [
        "Suno",
        "https://suno.com/",
        "用提示词生成歌曲、伴奏和歌词演唱。",
        [
          "音乐生成",
          "歌曲"
        ],
        "freemium",
        true
      ],
      [
        "Udio",
        "https://www.udio.com/",
        "AI 音乐生成工具，适合歌曲片段和风格探索。",
        [
          "音乐",
          "创作"
        ],
        "freemium",
        true
      ],
      [
        "PlayHT",
        "https://play.ht/",
        "AI 文本转语音和配音 API 平台。",
        [
          "TTS",
          "API"
        ],
        "freemium",
        false
      ],
      [
        "Murf",
        "https://murf.ai/",
        "商业配音、演示视频和品牌语音生成工具。",
        [
          "配音",
          "商业"
        ],
        "paid",
        false
      ],
      [
        "Resemble AI",
        "https://www.resemble.ai/",
        "企业级声音克隆、语音合成和语音安全工具。",
        [
          "声音克隆",
          "安全"
        ],
        "paid",
        false
      ],
      [
        "Speechify",
        "https://speechify.com/",
        "文本朗读、配音和学习辅助语音工具。",
        [
          "朗读",
          "学习"
        ],
        "freemium",
        false
      ],
      [
        "Whisper",
        "https://openai.com/research/whisper",
        "OpenAI 开源语音识别模型，适合转写和字幕。",
        [
          "转写",
          "开源"
        ],
        "free",
        true
      ],
      [
        "AssemblyAI",
        "https://www.assemblyai.com/",
        "语音转写、说话人分离和音频理解 API。",
        [
          "转写 API",
          "语音理解"
        ],
        "freemium",
        false
      ],
      [
        "Krisp",
        "https://krisp.ai/",
        "会议降噪、回声消除和语音清晰化工具。",
        [
          "降噪",
          "会议"
        ],
        "freemium",
        false
      ],
      [
        "LALAL.AI",
        "https://www.lalal.ai/",
        "人声、伴奏和乐器分离工具。",
        [
          "音频分离",
          "音乐"
        ],
        "freemium",
        false
      ],
      [
        "AIVA",
        "https://www.aiva.ai/",
        "AI 作曲平台，适合游戏、广告和影视配乐。",
        [
          "作曲",
          "配乐"
        ],
        "freemium",
        false
      ],
      [
        "Soundraw",
        "https://soundraw.io/",
        "生成免版税音乐并按段落调整氛围。",
        [
          "免版税",
          "音乐"
        ],
        "paid",
        false
      ],
      [
        "Voicemod",
        "https://www.voicemod.net/",
        "实时变声和声音效果工具。",
        [
          "变声",
          "直播"
        ],
        "freemium",
        false
      ],
      [
        "Stable Audio",
        "https://stableaudio.com/",
        "Stability AI 音乐与音效生成平台。",
        [
          "音乐",
          "Stability"
        ],
        "freemium",
        true
      ],
      [
        "Beatoven.ai",
        "https://www.beatoven.ai/",
        "按情绪生成免版税背景音乐。",
        [
          "配乐",
          "情绪"
        ],
        "freemium",
        false
      ],
      [
        "Boomy",
        "https://boomy.com/",
        "一键生成并发布 AI 音乐作品。",
        [
          "音乐",
          "创作"
        ],
        "freemium",
        false
      ],
      [
        "Loudly",
        "https://www.loudly.com/",
        "AI 音乐生成与版权管理工具。",
        [
          "音乐",
          "版权"
        ],
        "freemium",
        false
      ],
      [
        "Descript Overdub",
        "https://www.descript.com/overdub",
        "文本编辑式声音克隆与配音。",
        [
          "声音克隆",
          "播客"
        ],
        "freemium",
        false
      ],
      [
        "Podcastle",
        "https://podcastle.ai/",
        "播客录制、降噪与 AI 音频增强。",
        [
          "播客",
          "录音"
        ],
        "freemium",
        false
      ],
      [
        "Adobe Podcast",
        "https://podcast.adobe.com/",
        "浏览器端语音增强与降噪工具。",
        [
          "降噪",
          "免费"
        ],
        "free",
        true
      ],
      [
        "Otter.ai Live",
        "https://otter.ai/",
        "实时会议转写与摘要（音频场景扩展）。",
        [
          "转写",
          "会议"
        ],
        "freemium",
        false
      ],
      [
        "Rev AI",
        "https://www.rev.ai/",
        "高精度语音转写与字幕 API。",
        [
          "转写",
          "API"
        ],
        "paid",
        false
      ],
      [
        "Deepgram",
        "https://deepgram.com/",
        "实时语音识别与理解 API。",
        [
          "ASR",
          "API"
        ],
        "freemium",
        true
      ],
      [
        "Fish Audio",
        "https://fish.audio/",
        "中文语音合成与声音克隆平台。",
        [
          "中文",
          "TTS"
        ],
        "freemium",
        true
      ],
      [
        "Coqui TTS",
        "https://coqui.ai/",
        "开源文本转语音与声音克隆工具。",
        [
          "开源",
          "TTS"
        ],
        "free",
        false
      ]
    ]
  },
  {
    "id": "dev",
    "name": "编程开发",
    "short": "Code",
    "color": "#14213d",
    "description": "代码助手、IDE、代码审查和应用生成",
    "tools": [
      [
        "GitHub Copilot",
        "https://github.com/features/copilot",
        "IDE 内 AI 编码助手，支持补全、聊天和代码解释。",
        [
          "代码补全",
          "IDE"
        ],
        "paid",
        true
      ],
      [
        "Cursor",
        "https://www.cursor.com/",
        "AI 原生代码编辑器，适合项目级修改、重构和问答。",
        [
          "IDE",
          "Agent"
        ],
        "freemium",
        true
      ],
      [
        "Windsurf",
        "https://windsurf.com/",
        "面向 AI 编程工作流的智能 IDE。",
        [
          "IDE",
          "代码助手"
        ],
        "freemium",
        true
      ],
      [
        "Replit",
        "https://replit.com/",
        "云端开发环境和 AI 应用生成平台。",
        [
          "云 IDE",
          "应用生成"
        ],
        "freemium",
        true
      ],
      [
        "Lovable",
        "https://lovable.dev/",
        "用自然语言生成全栈 Web 应用。",
        [
          "应用生成",
          "无代码"
        ],
        "freemium",
        true
      ],
      [
        "Bolt.new",
        "https://bolt.new/",
        "浏览器内 AI 全栈应用开发环境。",
        [
          "全栈",
          "浏览器 IDE"
        ],
        "freemium",
        true
      ],
      [
        "v0",
        "https://v0.dev/",
        "Vercel 的 AI UI 生成工具，适合 React 和前端页面。",
        [
          "UI 生成",
          "React"
        ],
        "freemium",
        true
      ],
      [
        "Sourcegraph Cody",
        "https://sourcegraph.com/cody",
        "代码库理解、问答和修复助手。",
        [
          "代码搜索",
          "代码库"
        ],
        "freemium",
        false
      ],
      [
        "Tabnine",
        "https://www.tabnine.com/",
        "企业代码补全助手，支持私有化和团队规范。",
        [
          "补全",
          "企业"
        ],
        "freemium",
        false
      ],
      [
        "Amazon Q Developer",
        "https://aws.amazon.com/q/developer/",
        "AWS 生态的 AI 开发助手，覆盖云资源和代码。",
        [
          "AWS",
          "开发"
        ],
        "freemium",
        false
      ],
      [
        "CodeRabbit",
        "https://www.coderabbit.ai/",
        "AI 代码审查工具，可在 Pull Request 中给出审查意见。",
        [
          "代码审查",
          "PR"
        ],
        "freemium",
        false
      ],
      [
        "Devin",
        "https://devin.ai/",
        "AI 软件工程 Agent，面向端到端开发任务。",
        [
          "Agent",
          "软件工程"
        ],
        "paid",
        true
      ],
      [
        "Phind",
        "https://www.phind.com/",
        "面向开发者的 AI 搜索和代码问答工具。",
        [
          "开发搜索",
          "问答"
        ],
        "freemium",
        false
      ],
      [
        "Continue",
        "https://www.continue.dev/",
        "开源 AI 代码助手，可接入本地或云端模型。",
        [
          "开源",
          "IDE"
        ],
        "free",
        false
      ],
      [
        "aider",
        "https://aider.chat/",
        "命令行 AI 结对编程工具，直接编辑 Git 仓库。",
        [
          "CLI",
          "开源"
        ],
        "free",
        false
      ],
      [
        "Codeium",
        "https://codeium.com/",
        "免费 AI 代码补全与聊天，支持多 IDE。",
        [
          "补全",
          "免费"
        ],
        "free",
        true
      ],
      [
        "JetBrains AI",
        "https://www.jetbrains.com/ai/",
        "IntelliJ 系列内置 AI 助手与补全。",
        [
          "IDE",
          "JetBrains"
        ],
        "paid",
        false
      ],
      [
        "Qodo",
        "https://www.qodo.ai/",
        "AI 测试生成与代码质量平台（原 Codium）。",
        [
          "测试",
          "质量"
        ],
        "freemium",
        false
      ],
      [
        "Sweep AI",
        "https://sweep.dev/",
        "GitHub Issue 转 Pull Request 的 AI 工程师。",
        [
          "Agent",
          "GitHub"
        ],
        "freemium",
        false
      ],
      [
        "Codegen",
        "https://www.codegen.com/",
        "企业级 AI 软件工程 Agent 平台。",
        [
          "Agent",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Factory",
        "https://www.factory.ai/",
        "AI 软件工程师 Agent，面向复杂代码库任务。",
        [
          "Agent",
          "工程"
        ],
        "paid",
        false
      ],
      [
        "Mentat",
        "https://www.mentat.ai/",
        "命令行多文件编辑 AI 编程助手。",
        [
          "CLI",
          "编辑"
        ],
        "freemium",
        false
      ],
      [
        "OpenHands",
        "https://github.com/All-Hands-AI/OpenHands",
        "开源 AI 软件工程师 Agent 开发环境。",
        [
          "开源",
          "Agent"
        ],
        "free",
        true
      ],
      [
        "SWE-agent",
        "https://github.com/princeton-nlp/SWE-agent",
        "学术开源仓库修复 Agent 框架。",
        [
          "开源",
          "研究"
        ],
        "free",
        false
      ],
      [
        "Cline",
        "https://cline.bot/",
        "VS Code AI 自主编程 Agent 扩展。",
        [
          "VS Code",
          "Agent"
        ],
        "freemium",
        true
      ],
      [
        "Roo Code",
        "https://roocode.com/",
        "VS Code 多模式 AI 编程 Agent。",
        [
          "VS Code",
          "Agent"
        ],
        "free",
        false
      ],
      [
        "Augment Code",
        "https://www.augmentcode.com/",
        "深度代码库理解与团队 AI 编程。",
        [
          "代码库",
          "团队"
        ],
        "paid",
        false
      ],
      [
        "Poolside",
        "https://poolside.ai/",
        "企业代码生成与软件工程模型平台。",
        [
          "企业",
          "模型"
        ],
        "paid",
        false
      ],
      [
        "Magic",
        "https://magic.dev/",
        "超长上下文代码生成研究型产品。",
        [
          "长上下文",
          "代码"
        ],
        "paid",
        false
      ],
      [
        "Supermaven",
        "https://supermaven.com/",
        "超快代码补全与多文件上下文。",
        [
          "补全",
          "速度"
        ],
        "freemium",
        false
      ],
      [
        "Pieces",
        "https://pieces.app/",
        "开发者工作流 AI 与代码片段管理。",
        [
          "片段",
          "工作流"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "agents",
    "name": "自动化智能体",
    "short": "Agent",
    "color": "#e11d48",
    "description": "工作流、Agent 构建、客服机器人和自动化",
    "tools": [
      [
        "Zapier AI",
        "https://zapier.com/ai",
        "把 AI 接入数千个应用的自动化平台。",
        [
          "自动化",
          "集成"
        ],
        "freemium",
        true
      ],
      [
        "Make",
        "https://www.make.com/",
        "可视化工作流自动化平台，支持 AI 节点和多应用集成。",
        [
          "工作流",
          "集成"
        ],
        "freemium",
        false
      ],
      [
        "n8n",
        "https://n8n.io/",
        "开源自动化工作流平台，可自托管并接入 AI。",
        [
          "开源",
          "自动化"
        ],
        "freemium",
        true
      ],
      [
        "Gumloop",
        "https://www.gumloop.com/",
        "用可视化节点搭建 AI 自动化和数据处理流程。",
        [
          "可视化",
          "Agent"
        ],
        "freemium",
        false
      ],
      [
        "Lindy",
        "https://www.lindy.ai/",
        "个人和团队 AI 助手，可自动处理邮件、会议和业务流程。",
        [
          "AI 助手",
          "自动化"
        ],
        "paid",
        true
      ],
      [
        "MindStudio",
        "https://www.mindstudio.ai/",
        "无需代码构建和发布 AI 应用与工作流。",
        [
          "无代码",
          "AI 应用"
        ],
        "freemium",
        false
      ],
      [
        "Dify",
        "https://dify.ai/",
        "开源 LLM 应用开发平台，支持工作流、Agent 和知识库。",
        [
          "开源",
          "LLM 应用"
        ],
        "freemium",
        true
      ],
      [
        "Flowise",
        "https://flowiseai.com/",
        "低代码 LLM 应用与链路编排工具。",
        [
          "低代码",
          "LLM"
        ],
        "free",
        false
      ],
      [
        "LangChain",
        "https://www.langchain.com/",
        "构建 LLM 应用和 Agent 的开发框架与平台。",
        [
          "开发框架",
          "Agent"
        ],
        "freemium",
        true
      ],
      [
        "CrewAI",
        "https://www.crewai.com/",
        "多 Agent 协作框架和企业平台。",
        [
          "多 Agent",
          "框架"
        ],
        "freemium",
        false
      ],
      [
        "Microsoft AutoGen",
        "https://microsoft.github.io/autogen/",
        "微软开源多 Agent 应用开发框架。",
        [
          "开源",
          "多 Agent"
        ],
        "free",
        false
      ],
      [
        "Manus",
        "https://manus.im/",
        "通用 AI Agent 产品，面向复杂任务执行。",
        [
          "Agent",
          "任务执行"
        ],
        "freemium",
        true
      ],
      [
        "Chatbase",
        "https://www.chatbase.co/",
        "基于网站和文档训练客服聊天机器人。",
        [
          "客服",
          "知识库"
        ],
        "freemium",
        false
      ],
      [
        "Voiceflow",
        "https://www.voiceflow.com/",
        "构建聊天机器人、语音助手和客户支持 Agent。",
        [
          "客服",
          "对话设计"
        ],
        "freemium",
        false
      ],
      [
        "Botpress",
        "https://botpress.com/",
        "AI Agent 和聊天机器人构建平台。",
        [
          "机器人",
          "客服"
        ],
        "freemium",
        false
      ],
      [
        "Activepieces",
        "https://www.activepieces.com/",
        "开源 Zapier 替代，支持 AI 步骤与自托管。",
        [
          "开源",
          "自动化"
        ],
        "freemium",
        false
      ],
      [
        "Pipedream",
        "https://pipedream.com/",
        "开发者向工作流与 AI 集成平台。",
        [
          "开发者",
          "API"
        ],
        "freemium",
        true
      ],
      [
        "Tray.io Merlin",
        "https://tray.ai/",
        "企业 iPaaS 与 AI Agent 编排平台。",
        [
          "企业",
          "iPaaS"
        ],
        "paid",
        false
      ],
      [
        "Workato",
        "https://www.workato.com/",
        "企业自动化与 AI 工作流集成。",
        [
          "企业",
          "集成"
        ],
        "paid",
        false
      ],
      [
        "UiPath",
        "https://www.uipath.com/",
        "RPA 与 AI Agent 企业自动化平台。",
        [
          "RPA",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Relevance AI",
        "https://relevanceai.com/",
        "构建与部署 AI 工作流与 Agent 团队。",
        [
          "Agent",
          "工作流"
        ],
        "freemium",
        true
      ],
      [
        "Stack AI",
        "https://www.stack-ai.com/",
        "可视化构建企业 AI 应用与 Agent。",
        [
          "无代码",
          "企业"
        ],
        "freemium",
        false
      ],
      [
        "Vellum",
        "https://www.vellum.ai/",
        "LLM 应用开发、评测与生产部署平台。",
        [
          "评测",
          "部署"
        ],
        "paid",
        false
      ],
      [
        "LangSmith",
        "https://www.langchain.com/langsmith",
        "LangChain 应用追踪、评测与监控。",
        [
          "LangChain",
          "监控"
        ],
        "paid",
        false
      ],
      [
        "Langfuse",
        "https://langfuse.com/",
        "开源 LLM 应用可观测与评测平台。",
        [
          "开源",
          "可观测"
        ],
        "freemium",
        true
      ],
      [
        "Superagent",
        "https://www.superagent.sh/",
        "Guardrails 与 AI Agent 安全框架。",
        [
          "安全",
          "Agent"
        ],
        "freemium",
        false
      ],
      [
        "AgentGPT",
        "https://agentgpt.reworkd.ai/",
        "浏览器内自主任务 Agent 实验平台。",
        [
          "自主",
          "实验"
        ],
        "freemium",
        false
      ],
      [
        "MultiOn",
        "https://www.multion.ai/",
        "浏览器自动化 AI Agent API。",
        [
          "浏览器",
          "API"
        ],
        "freemium",
        false
      ],
      [
        "Induced AI",
        "https://www.induced.ai/",
        "自然语言驱动的浏览器工作流 Agent。",
        [
          "浏览器",
          "自动化"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "design",
    "name": "设计创意",
    "short": "Design",
    "color": "#0ea5e9",
    "description": "UI、品牌、PPT、原型和创意素材",
    "tools": [
      [
        "Figma AI",
        "https://www.figma.com/ai/",
        "Figma 内置 AI 设计、重命名、搜索和原型辅助能力。",
        [
          "UI",
          "设计协作"
        ],
        "paid",
        true
      ],
      [
        "Canva",
        "https://www.canva.com/ai/",
        "图文设计、演示、视频和 AI 素材生成工具。",
        [
          "设计",
          "PPT"
        ],
        "freemium",
        true
      ],
      [
        "Uizard",
        "https://uizard.io/",
        "用文字或草图生成 UI 原型和界面设计。",
        [
          "UI 原型",
          "草图"
        ],
        "freemium",
        false
      ],
      [
        "Framer AI",
        "https://www.framer.com/ai/",
        "用提示词生成可发布网站页面。",
        [
          "网站",
          "无代码"
        ],
        "freemium",
        true
      ],
      [
        "Relume",
        "https://www.relume.io/",
        "AI 网站地图、线框图和文案生成工具。",
        [
          "网站",
          "线框图"
        ],
        "freemium",
        false
      ],
      [
        "Galileo AI",
        "https://www.usegalileo.ai/",
        "根据提示生成高保真 UI 设计稿。",
        [
          "UI 生成",
          "设计"
        ],
        "paid",
        false
      ],
      [
        "Mobbin",
        "https://mobbin.com/",
        "移动端和网页设计参考库，带 AI 搜索。",
        [
          "灵感",
          "产品设计"
        ],
        "freemium",
        false
      ],
      [
        "Khroma",
        "https://www.khroma.co/",
        "根据偏好生成和探索配色方案。",
        [
          "配色",
          "品牌"
        ],
        "free",
        false
      ],
      [
        "Looka",
        "https://looka.com/",
        "AI Logo、品牌套件和视觉识别生成工具。",
        [
          "Logo",
          "品牌"
        ],
        "paid",
        false
      ],
      [
        "Brandmark",
        "https://brandmark.io/",
        "AI 品牌标识和 Logo 设计工具。",
        [
          "Logo",
          "品牌"
        ],
        "paid",
        false
      ],
      [
        "Microsoft Designer",
        "https://designer.microsoft.com/",
        "微软图像设计、海报和社媒素材生成工具。",
        [
          "海报",
          "设计"
        ],
        "freemium",
        false
      ],
      [
        "Whimsical AI",
        "https://whimsical.com/ai",
        "用 AI 创建流程图、脑图、文档和线框图。",
        [
          "流程图",
          "脑图"
        ],
        "freemium",
        false
      ],
      [
        "Visily",
        "https://www.visily.ai/",
        "AI 线框图和产品原型设计工具。",
        [
          "原型",
          "UI"
        ],
        "freemium",
        false
      ],
      [
        "Gamma",
        "https://gamma.app/",
        "AI 生成演示文稿、网页和文档。",
        [
          "PPT",
          "文档"
        ],
        "freemium",
        true
      ],
      [
        "Beautiful.ai",
        "https://www.beautiful.ai/",
        "自动排版的 AI 演示文稿制作工具。",
        [
          "PPT",
          "排版"
        ],
        "paid",
        false
      ],
      [
        "Sketch AI",
        "https://www.sketch.com/",
        "Mac 设计工具与 AI 辅助布局插件生态。",
        [
          "UI",
          "Mac"
        ],
        "paid",
        false
      ],
      [
        "Adobe Express",
        "https://www.adobe.com/express/",
        "快速社媒设计与 Firefly AI 集成。",
        [
          "社媒",
          "Adobe"
        ],
        "freemium",
        true
      ],
      [
        "Pitch",
        "https://pitch.com/",
        "AI 演示文稿协作与设计平台。",
        [
          "PPT",
          "协作"
        ],
        "freemium",
        false
      ],
      [
        "Tome",
        "https://tome.app/",
        "AI 叙事型演示与故事网页生成。",
        [
          "演示",
          "叙事"
        ],
        "freemium",
        true
      ],
      [
        "SlidesAI",
        "https://www.slidesai.io/",
        "Google Slides AI 幻灯片生成插件。",
        [
          "Google",
          "PPT"
        ],
        "freemium",
        false
      ],
      [
        "Presentations.AI",
        "https://www.presentations.ai/",
        "提示词生成完整演示文稿。",
        [
          "PPT",
          "生成"
        ],
        "freemium",
        false
      ],
      [
        "Kittl",
        "https://www.kittl.com/",
        "AI 平面设计、字体与品牌视觉工具。",
        [
          "平面",
          "品牌"
        ],
        "freemium",
        false
      ],
      [
        "Designs.ai",
        "https://designs.ai/",
        "Logo、视频、语音一体化品牌套件。",
        [
          "品牌",
          "套件"
        ],
        "paid",
        false
      ],
      [
        "Stockimg AI",
        "https://stockimg.ai/",
        "封面、Logo 与 UI 素材 AI 生成。",
        [
          "素材",
          "封面"
        ],
        "freemium",
        false
      ],
      [
        "Autodraw",
        "https://www.autodraw.com/",
        "Google 快速涂鸦识别与补全工具。",
        [
          "涂鸦",
          "Google"
        ],
        "free",
        false
      ],
      [
        "Magician for Figma",
        "https://magician.design/",
        "Figma 插件：图标、文案与图片生成。",
        [
          "Figma",
          "插件"
        ],
        "freemium",
        false
      ],
      [
        "Diagram",
        "https://diagram.com/",
        "Figma 官方 AI 设计工具（Magician 团队）。",
        [
          "Figma",
          "AI"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "marketing",
    "name": "营销增长",
    "short": "Growth",
    "color": "#f7b731",
    "description": "广告、社媒、销售线索、邮件和品牌监测",
    "tools": [
      [
        "HubSpot AI",
        "https://www.hubspot.com/artificial-intelligence",
        "CRM、营销、销售和客服场景中的 AI 助手。",
        [
          "CRM",
          "营销"
        ],
        "paid",
        true
      ],
      [
        "AdCreative.ai",
        "https://www.adcreative.ai/",
        "生成广告图片、文案和转化导向创意。",
        [
          "广告",
          "创意"
        ],
        "paid",
        true
      ],
      [
        "Predis.ai",
        "https://predis.ai/",
        "社媒帖子、短视频、广告素材和内容日历生成工具。",
        [
          "社媒",
          "广告"
        ],
        "freemium",
        false
      ],
      [
        "Ocoya",
        "https://www.ocoya.com/",
        "AI 社媒内容创作、排程和分析平台。",
        [
          "社媒",
          "排程"
        ],
        "paid",
        false
      ],
      [
        "Buffer AI Assistant",
        "https://buffer.com/ai-assistant",
        "为社媒帖子生成、改写和扩展内容。",
        [
          "社媒",
          "写作"
        ],
        "freemium",
        false
      ],
      [
        "Hootsuite OwlyWriter",
        "https://www.hootsuite.com/platform/owlywriter-ai",
        "Hootsuite 的社媒 AI 文案和排程助手。",
        [
          "社媒",
          "品牌"
        ],
        "paid",
        false
      ],
      [
        "Brand24",
        "https://brand24.com/",
        "品牌舆情监测和 AI 摘要分析平台。",
        [
          "舆情",
          "品牌"
        ],
        "paid",
        false
      ],
      [
        "Taplio",
        "https://taplio.com/",
        "LinkedIn 内容创作、排程和增长工具。",
        [
          "LinkedIn",
          "社媒"
        ],
        "paid",
        false
      ],
      [
        "FeedHive",
        "https://www.feedhive.com/",
        "AI 社媒内容规划、发布和复用平台。",
        [
          "社媒",
          "排程"
        ],
        "paid",
        false
      ],
      [
        "Clay",
        "https://www.clay.com/",
        "AI 销售线索挖掘、数据丰富和出海获客工具。",
        [
          "销售线索",
          "增长"
        ],
        "freemium",
        true
      ],
      [
        "Apollo",
        "https://www.apollo.io/",
        "销售线索数据库、自动化触达和 AI 辅助销售平台。",
        [
          "销售",
          "线索"
        ],
        "freemium",
        false
      ],
      [
        "Regie.ai",
        "https://www.regie.ai/",
        "销售邮件、序列和外呼团队内容自动化平台。",
        [
          "销售邮件",
          "自动化"
        ],
        "paid",
        false
      ],
      [
        "Lavender",
        "https://www.lavender.ai/",
        "销售邮件评分、改写和个性化建议工具。",
        [
          "邮件",
          "销售"
        ],
        "freemium",
        false
      ],
      [
        "Instantly",
        "https://instantly.ai/",
        "冷邮件外联、线索和自动化增长平台。",
        [
          "冷邮件",
          "外联"
        ],
        "paid",
        false
      ],
      [
        "Salesforce Einstein",
        "https://www.salesforce.com/artificial-intelligence/",
        "CRM 销售、服务与营销 AI 能力套件。",
        [
          "CRM",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Marketo AI",
        "https://business.adobe.com/products/marketo.html",
        "Adobe Marketo 营销自动化 AI 功能。",
        [
          "营销自动化",
          "Adobe"
        ],
        "paid",
        false
      ],
      [
        "Mutiny",
        "https://www.mutinyhq.com/",
        "网站个性化与 AI 转化优化平台。",
        [
          "转化",
          "个性化"
        ],
        "paid",
        false
      ],
      [
        "Persado",
        "https://www.persado.com/",
        "AI 营销语言情感优化平台。",
        [
          "文案",
          "情感"
        ],
        "paid",
        false
      ],
      [
        "Jasper Campaigns",
        "https://www.jasper.ai/campaigns",
        "多渠道营销活动 AI 编排。",
        [
          "活动",
          "营销"
        ],
        "paid",
        false
      ],
      [
        "Smartly.io",
        "https://www.smartly.io/",
        "广告创意自动化与跨渠道投放 AI。",
        [
          "广告",
          "自动化"
        ],
        "paid",
        false
      ],
      [
        "Pencil Pro",
        "https://www.trypencil.com/",
        "性能驱动的广告创意生成与测试。",
        [
          "广告",
          "创意"
        ],
        "paid",
        false
      ],
      [
        "Omneky",
        "https://www.omneky.com/",
        "多变量广告创意生成与优化。",
        [
          "广告",
          "A/B"
        ],
        "paid",
        false
      ],
      [
        "Lately AI",
        "https://www.lately.ai/",
        "长内容切片为社媒帖子与活动。",
        [
          "社媒",
          "切片"
        ],
        "paid",
        false
      ],
      [
        "SocialBee AI",
        "https://socialbee.com/ai-post-generator/",
        "社媒内容生成与排程助手。",
        [
          "社媒",
          "排程"
        ],
        "paid",
        false
      ],
      [
        "Vista Social AI",
        "https://vistasocial.com/",
        "社媒管理内置 AI 文案与回复。",
        [
          "社媒",
          "管理"
        ],
        "freemium",
        false
      ],
      [
        "Reply.io",
        "https://reply.io/",
        "销售外联序列与 AI 个性化邮件。",
        [
          "外联",
          "销售"
        ],
        "paid",
        false
      ],
      [
        "Outreach Kaia",
        "https://www.outreach.io/",
        "销售对话智能与会议洞察。",
        [
          "销售",
          "对话"
        ],
        "paid",
        false
      ],
      [
        "6sense",
        "https://6sense.com/",
        "B2B 意图数据与 AI 获客平台。",
        [
          "B2B",
          "意图"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "seo",
    "name": "SEO 优化",
    "short": "SEO",
    "color": "#16a34a",
    "description": "关键词、内容优化、排名追踪和搜索增长",
    "tools": [
      [
        "Surfer SEO",
        "https://surferseo.com/",
        "AI 内容优化、关键词研究和 SERP 分析平台。",
        [
          "内容优化",
          "关键词"
        ],
        "paid",
        true
      ],
      [
        "Semrush ContentShake",
        "https://www.semrush.com/contentshake/",
        "Semrush 的 AI SEO 内容生成与优化工具。",
        [
          "SEO 内容",
          "Semrush"
        ],
        "paid",
        false
      ],
      [
        "Ahrefs",
        "https://ahrefs.com/",
        "SEO 数据平台，覆盖关键词、外链、排名和 AI 内容辅助。",
        [
          "SEO 数据",
          "外链"
        ],
        "paid",
        true
      ],
      [
        "Clearscope",
        "https://www.clearscope.io/",
        "内容相关性评分和 SEO 写作优化工具。",
        [
          "内容评分",
          "SEO"
        ],
        "paid",
        false
      ],
      [
        "MarketMuse",
        "https://www.marketmuse.com/",
        "AI 内容策略、主题集群和竞争分析平台。",
        [
          "内容策略",
          "主题集群"
        ],
        "paid",
        false
      ],
      [
        "NeuronWriter",
        "https://neuronwriter.com/",
        "基于 NLP 的 SEO 内容编辑和优化工具。",
        [
          "NLP",
          "内容"
        ],
        "paid",
        false
      ],
      [
        "Alli AI",
        "https://www.alliai.com/",
        "网站级 SEO 自动化和批量优化平台。",
        [
          "自动化",
          "网站优化"
        ],
        "paid",
        false
      ],
      [
        "AlsoAsked",
        "https://alsoasked.com/",
        "发现 People Also Ask 问题树，适合内容选题。",
        [
          "选题",
          "问题"
        ],
        "freemium",
        false
      ],
      [
        "Keyword Insights",
        "https://www.keywordinsights.ai/",
        "关键词聚类、内容简报和搜索意图分析工具。",
        [
          "关键词聚类",
          "意图"
        ],
        "paid",
        false
      ],
      [
        "SE Ranking",
        "https://seranking.com/",
        "排名追踪、竞品分析和 AI SEO 工具集合。",
        [
          "排名",
          "竞品"
        ],
        "paid",
        false
      ],
      [
        "Koala",
        "https://koala.sh/",
        "AI SEO 文章生成工具，适合博客和联盟内容。",
        [
          "文章生成",
          "联盟"
        ],
        "paid",
        false
      ],
      [
        "Frase",
        "https://www.frase.io/",
        "从 SERP 研究到 AI 大纲和内容优化。",
        [
          "SERP",
          "大纲"
        ],
        "paid",
        false
      ],
      [
        "Screaming Frog AI",
        "https://www.screamingfrog.co.uk/seo-spider/",
        "爬虫 SEO 审计，集成 AI 内容分析。",
        [
          "审计",
          "爬虫"
        ],
        "paid",
        false
      ],
      [
        "Sitebulb",
        "https://sitebulb.com/",
        "可视化 SEO 审计与技术问题诊断。",
        [
          "审计",
          "技术SEO"
        ],
        "paid",
        false
      ],
      [
        "ContentKing",
        "https://www.contentkingapp.com/",
        "实时 SEO 监控与变更告警平台。",
        [
          "监控",
          "告警"
        ],
        "paid",
        false
      ],
      [
        "BrightEdge",
        "https://www.brightedge.com/",
        "企业 SEO 与 AI 内容优化平台。",
        [
          "企业",
          "内容"
        ],
        "paid",
        false
      ],
      [
        "Conductor",
        "https://www.conductor.com/",
        "企业内容智能与 SEO 工作流。",
        [
          "企业",
          "工作流"
        ],
        "paid",
        false
      ],
      [
        "WriterZen",
        "https://writerzen.net/",
        "关键词聚类、主题研究与内容规划。",
        [
          "关键词",
          "规划"
        ],
        "paid",
        false
      ],
      [
        "LowFruits",
        "https://lowfruits.io/",
        "发现低竞争长尾关键词机会。",
        [
          "长尾",
          "关键词"
        ],
        "paid",
        false
      ],
      [
        "RankIQ",
        "https://www.rankiq.com/",
        "博客选题与 SEO 简报工具。",
        [
          "博客",
          "简报"
        ],
        "paid",
        false
      ],
      [
        "PageOptimizer Pro",
        "https://www.pageoptimizer.pro/",
        "页面级 SEO 元素 AI 优化建议。",
        [
          "页面优化",
          "On-page"
        ],
        "paid",
        false
      ],
      [
        "SurgeGraph",
        "https://surgegraph.io/",
        "内容规划与 SEO 文章生成平台。",
        [
          "文章",
          "规划"
        ],
        "paid",
        false
      ],
      [
        "Outranking",
        "https://www.outranking.io/",
        "SERP 分析与 AI SEO 内容工作流。",
        [
          "SERP",
          "工作流"
        ],
        "paid",
        false
      ],
      [
        "Dashword",
        "https://www.dashword.com/",
        "内容简报与 SEO 评分协作工具。",
        [
          "简报",
          "协作"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "productivity",
    "name": "办公效率",
    "short": "Office",
    "color": "#64748b",
    "description": "笔记、项目、邮件、日程和会议效率",
    "tools": [
      [
        "Microsoft 365 Copilot",
        "https://www.microsoft.com/microsoft-365/copilot",
        "Word、Excel、PowerPoint、Outlook 和 Teams 的 AI 助手。",
        [
          "办公套件",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Gemini for Workspace",
        "https://workspace.google.com/solutions/ai/",
        "Google Workspace 中的邮件、文档、表格和会议 AI。",
        [
          "Google",
          "办公"
        ],
        "paid",
        true
      ],
      [
        "Notion AI",
        "https://www.notion.so/product/ai",
        "笔记、知识库和项目文档中的 AI 写作与总结。",
        [
          "笔记",
          "知识库"
        ],
        "paid",
        true
      ],
      [
        "ClickUp Brain",
        "https://clickup.com/ai",
        "项目管理、文档、任务和知识库的 AI 工作助手。",
        [
          "项目管理",
          "任务"
        ],
        "paid",
        false
      ],
      [
        "Coda AI",
        "https://coda.io/product/ai",
        "在文档、表格和工作流中生成内容和自动化。",
        [
          "文档",
          "表格"
        ],
        "paid",
        false
      ],
      [
        "Airtable AI",
        "https://www.airtable.com/platform/ai",
        "在业务数据库中生成字段、总结记录和自动化。",
        [
          "数据库",
          "自动化"
        ],
        "paid",
        false
      ],
      [
        "Miro AI",
        "https://miro.com/ai/",
        "白板中的头脑风暴、总结、分类和图表生成工具。",
        [
          "白板",
          "协作"
        ],
        "paid",
        false
      ],
      [
        "Slack AI",
        "https://slack.com/features/ai",
        "频道摘要、线程总结和企业知识搜索。",
        [
          "团队沟通",
          "总结"
        ],
        "paid",
        false
      ],
      [
        "Mem",
        "https://get.mem.ai/",
        "自动组织和检索个人笔记的 AI 知识管理工具。",
        [
          "笔记",
          "个人知识"
        ],
        "freemium",
        false
      ],
      [
        "Taskade",
        "https://www.taskade.com/",
        "AI 任务、脑图、项目和团队协作工具。",
        [
          "任务",
          "团队"
        ],
        "freemium",
        false
      ],
      [
        "Superhuman AI",
        "https://superhuman.com/",
        "高效率邮件客户端中的 AI 写作和整理能力。",
        [
          "邮件",
          "效率"
        ],
        "paid",
        false
      ],
      [
        "Reclaim.ai",
        "https://reclaim.ai/",
        "AI 日程安排、任务排期和团队时间管理工具。",
        [
          "日程",
          "时间管理"
        ],
        "freemium",
        false
      ],
      [
        "Motion",
        "https://www.usemotion.com/",
        "AI 自动排期、任务和日历管理工具。",
        [
          "日历",
          "任务"
        ],
        "paid",
        false
      ],
      [
        "Scribe",
        "https://scribehow.com/",
        "自动记录操作流程并生成 SOP 文档。",
        [
          "SOP",
          "文档"
        ],
        "freemium",
        false
      ],
      [
        "Microsoft Copilot Studio",
        "https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio",
        "构建企业 Copilot 与业务 Agent。",
        [
          "Copilot",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Google NotebookLM Plus",
        "https://notebooklm.google/",
        "团队知识库笔记与音频概览。",
        [
          "知识库",
          "Google"
        ],
        "paid",
        false
      ],
      [
        "Dropbox Dash",
        "https://www.dropbox.com/dash",
        "跨应用 AI 搜索与文件问答。",
        [
          "搜索",
          "文件"
        ],
        "paid",
        false
      ],
      [
        "Box AI",
        "https://www.box.com/ai",
        "企业文件内容问答与摘要。",
        [
          "企业",
          "文件"
        ],
        "paid",
        false
      ],
      [
        "Asana AI",
        "https://asana.com/product/ai",
        "项目任务智能、总结与目标追踪。",
        [
          "项目",
          "任务"
        ],
        "paid",
        false
      ],
      [
        "Monday.com AI",
        "https://monday.com/w/ai",
        "工作 OS 中的 AI 列、摘要与自动化。",
        [
          "工作流",
          "协作"
        ],
        "paid",
        false
      ],
      [
        "Linear AI",
        "https://linear.app/",
        "产品工程团队 Issue 与项目 AI 辅助。",
        [
          "工程",
          "Issue"
        ],
        "paid",
        false
      ],
      [
        "Height",
        "https://height.app/",
        "自主项目协调与 AI 项目管理助手。",
        [
          "项目",
          "自主"
        ],
        "freemium",
        false
      ],
      [
        "Trello AI",
        "https://trello.com/",
        "Atlassian 看板内置 AI 内容生成。",
        [
          "看板",
          "Atlassian"
        ],
        "freemium",
        false
      ],
      [
        "Evernote AI",
        "https://evernote.com/",
        "笔记搜索、摘要与写作辅助。",
        [
          "笔记",
          "搜索"
        ],
        "paid",
        false
      ],
      [
        "Reflect",
        "https://reflect.app/",
        "端到端加密笔记与 AI 助手。",
        [
          "笔记",
          "隐私"
        ],
        "paid",
        false
      ],
      [
        "Cron Calendar AI",
        "https://cron.com/",
        "日历智能排程与会议准备（Notion 日历）。",
        [
          "日历",
          "排程"
        ],
        "free",
        false
      ],
      [
        "Clockwise",
        "https://www.getclockwise.com/",
        "AI 专注时间与会议优化调度。",
        [
          "日历",
          "专注"
        ],
        "freemium",
        false
      ],
      [
        "Fellow.app",
        "https://fellow.app/",
        "会议议程、笔记与 AI 行动项。",
        [
          "会议",
          "议程"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "data",
    "name": "数据分析",
    "short": "Data",
    "color": "#7c3aed",
    "description": "BI、表格、SQL、数据科学和预测",
    "tools": [
      [
        "ChatGPT Data Analyst",
        "https://chatgpt.com/",
        "上传文件后进行数据清洗、分析、可视化和报告生成。",
        [
          "数据分析",
          "可视化"
        ],
        "paid",
        true
      ],
      [
        "Julius",
        "https://julius.ai/",
        "用自然语言分析表格、CSV 和数据集。",
        [
          "表格",
          "分析"
        ],
        "freemium",
        true
      ],
      [
        "Databricks Assistant",
        "https://www.databricks.com/product/databricks-assistant",
        "Databricks 数据平台中的 SQL、代码和数据工程助手。",
        [
          "数据工程",
          "SQL"
        ],
        "paid",
        false
      ],
      [
        "Snowflake Cortex AI",
        "https://www.snowflake.com/en/data-cloud/cortex/",
        "Snowflake 内置的 LLM 和机器学习能力。",
        [
          "数据云",
          "LLM"
        ],
        "paid",
        false
      ],
      [
        "Tableau Pulse",
        "https://www.tableau.com/products/tableau-pulse",
        "面向业务指标的 AI 洞察和数据解释工具。",
        [
          "BI",
          "洞察"
        ],
        "paid",
        false
      ],
      [
        "Power BI Copilot",
        "https://powerbi.microsoft.com/",
        "在 Power BI 中生成报告、总结洞察和 DAX 辅助。",
        [
          "BI",
          "微软"
        ],
        "paid",
        true
      ],
      [
        "Akkio",
        "https://www.akkio.com/",
        "无代码预测分析和机器学习平台。",
        [
          "预测",
          "无代码"
        ],
        "paid",
        false
      ],
      [
        "Obviously AI",
        "https://www.obviously.ai/",
        "无代码机器学习预测和业务数据建模工具。",
        [
          "预测",
          "机器学习"
        ],
        "paid",
        false
      ],
      [
        "Polymer",
        "https://www.polymersearch.com/",
        "上传表格快速生成仪表盘和数据洞察。",
        [
          "仪表盘",
          "表格"
        ],
        "freemium",
        false
      ],
      [
        "DataRobot",
        "https://www.datarobot.com/",
        "企业级 AI 与机器学习自动化平台。",
        [
          "AutoML",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Dataiku",
        "https://www.dataiku.com/",
        "企业数据科学、机器学习和生成式 AI 平台。",
        [
          "数据科学",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Hex",
        "https://hex.tech/",
        "协作式数据分析笔记本，支持 SQL、Python 和 AI。",
        [
          "Notebook",
          "SQL"
        ],
        "freemium",
        false
      ],
      [
        "Rows AI",
        "https://rows.com/ai",
        "带 AI 的在线表格，可生成公式、分析和摘要。",
        [
          "表格",
          "公式"
        ],
        "freemium",
        false
      ],
      [
        "Seek AI",
        "https://www.seek.ai/",
        "企业自然语言数据问答和 SQL 生成平台。",
        [
          "SQL",
          "问答"
        ],
        "paid",
        false
      ],
      [
        "ThoughtSpot Sage",
        "https://www.thoughtspot.com/",
        "自然语言 BI 搜索与 AI 洞察。",
        [
          "BI",
          "NLQ"
        ],
        "paid",
        true
      ],
      [
        "Sigma Computing",
        "https://www.sigmacomputing.com/",
        "电子表格界面云数据仓库分析。",
        [
          "表格",
          "云"
        ],
        "paid",
        false
      ],
      [
        "Metabase AI",
        "https://www.metabase.com/",
        "开源 BI 与 AI 查询辅助。",
        [
          "BI",
          "开源"
        ],
        "freemium",
        false
      ],
      [
        "Mode AI",
        "https://mode.com/",
        "数据团队协作笔记本与 AI 分析。",
        [
          "Notebook",
          "团队"
        ],
        "paid",
        false
      ],
      [
        "Observable AI",
        "https://observablehq.com/",
        "数据可视化笔记本与生成辅助。",
        [
          "可视化",
          "D3"
        ],
        "freemium",
        false
      ],
      [
        "Pecan AI",
        "https://www.pecan.ai/",
        "预测分析无代码 SQL 替代方案。",
        [
          "预测",
          "无代码"
        ],
        "paid",
        false
      ],
      [
        "MonkeyLearn",
        "https://monkeylearn.com/",
        "文本分类与情感分析无代码平台。",
        [
          "NLP",
          "分类"
        ],
        "paid",
        false
      ],
      [
        "H2O.ai",
        "https://h2o.ai/",
        "开源与企业 AutoML 与 Driverless AI。",
        [
          "AutoML",
          "开源"
        ],
        "freemium",
        true
      ],
      [
        "Domo AI",
        "https://www.domo.com/",
        "企业 BI 仪表盘与 AI 数据洞察。",
        [
          "BI",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Qlik Answers",
        "https://www.qlik.com/",
        "企业数据问答与生成式 BI。",
        [
          "BI",
          "问答"
        ],
        "paid",
        false
      ],
      [
        "GoodData AI",
        "https://www.gooddata.com/",
        "嵌入式分析与 AI 指标解释。",
        [
          "嵌入式",
          "指标"
        ],
        "paid",
        false
      ],
      [
        "Kanaries",
        "https://kanaries.net/",
        "可视化探索分析与 AI 图表建议。",
        [
          "可视化",
          "探索"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "education",
    "name": "教育学习",
    "short": "Learn",
    "color": "#2fbf71",
    "description": "学习辅导、题目解析、课程和教师工具",
    "tools": [
      [
        "Khanmigo",
        "https://www.khanmigo.ai/",
        "Khan Academy 的 AI 学习导师和教师助手。",
        [
          "学习导师",
          "教育"
        ],
        "paid",
        true
      ],
      [
        "Quizlet",
        "https://quizlet.com/",
        "学习卡片、测验和 AI 学习辅助平台。",
        [
          "背诵",
          "测验"
        ],
        "freemium",
        true
      ],
      [
        "Duolingo Max",
        "https://www.duolingo.com/max",
        "Duolingo 的 AI 语言学习解释和角色对话功能。",
        [
          "语言学习",
          "对话"
        ],
        "paid",
        false
      ],
      [
        "Socratic",
        "https://socratic.org/",
        "Google 的拍题解答和学习辅助应用。",
        [
          "拍题",
          "学生"
        ],
        "free",
        false
      ],
      [
        "Photomath",
        "https://photomath.com/",
        "数学题拍照解析和步骤讲解工具。",
        [
          "数学",
          "解题"
        ],
        "freemium",
        false
      ],
      [
        "Wolfram Alpha",
        "https://www.wolframalpha.com/",
        "计算知识引擎，适合数学、科学和工程问题。",
        [
          "计算",
          "知识"
        ],
        "freemium",
        true
      ],
      [
        "Knowt",
        "https://knowt.com/",
        "AI 笔记、闪卡和测验生成工具。",
        [
          "笔记",
          "闪卡"
        ],
        "freemium",
        false
      ],
      [
        "Gizmo",
        "https://gizmo.ai/",
        "AI 闪卡和间隔重复学习工具。",
        [
          "闪卡",
          "复习"
        ],
        "freemium",
        false
      ],
      [
        "MagicSchool",
        "https://www.magicschool.ai/",
        "教师备课、评语、作业和课堂活动 AI 工具。",
        [
          "教师",
          "备课"
        ],
        "freemium",
        true
      ],
      [
        "Curipod",
        "https://curipod.com/",
        "AI 生成互动课堂活动和教学演示。",
        [
          "课堂",
          "互动"
        ],
        "freemium",
        false
      ],
      [
        "Studyable",
        "https://studyable.app/",
        "AI 学习助手、闪卡、作文反馈和题目练习。",
        [
          "学习",
          "反馈"
        ],
        "freemium",
        false
      ],
      [
        "ELSA Speak",
        "https://elsaspeak.com/",
        "AI 英语发音教练和口语练习应用。",
        [
          "英语",
          "口语"
        ],
        "freemium",
        false
      ],
      [
        "Brainly AI",
        "https://brainly.com/",
        "学生作业问答与分步解析社区。",
        [
          "作业",
          "社区"
        ],
        "freemium",
        false
      ],
      [
        "Chegg Study",
        "https://www.chegg.com/study",
        "教材解答与 AI 学习辅导。",
        [
          "教材",
          "辅导"
        ],
        "paid",
        false
      ],
      [
        "Course Hero AI",
        "https://www.coursehero.com/",
        "学习资料与 AI 文档问答。",
        [
          "资料",
          "问答"
        ],
        "paid",
        false
      ],
      [
        "Numerade",
        "https://www.numerade.com/",
        "视频分步解题与 AI 导师。",
        [
          "视频",
          "解题"
        ],
        "paid",
        false
      ],
      [
        "Cognii",
        "https://www.cognii.com/",
        "开放式作业自动评分与辅导。",
        [
          "评分",
          "作文"
        ],
        "paid",
        false
      ],
      [
        "Gradescope",
        "https://www.gradescope.com/",
        "作业批改与 AI 辅助评分平台。",
        [
          "批改",
          "教师"
        ],
        "paid",
        false
      ],
      [
        "QuestionWell",
        "https://questionwell.org/",
        "教师 AI 生成测验与评估题。",
        [
          "测验",
          "教师"
        ],
        "freemium",
        false
      ],
      [
        "Eduaide",
        "https://www.eduaide.ai/",
        "课程计划、评语与差异化教学 AI。",
        [
          "备课",
          "教师"
        ],
        "freemium",
        true
      ],
      [
        "Diffit",
        "https://www.diffit.me/",
        "按阅读水平改编教学文本。",
        [
          "差异化",
          "阅读"
        ],
        "freemium",
        false
      ],
      [
        "SchoolAI",
        "https://schoolai.com/",
        "课堂安全 AI 助手与学生空间。",
        [
          "K12",
          "安全"
        ],
        "freemium",
        false
      ],
      [
        "Speak",
        "https://www.speak.com/",
        "AI 口语对话语言学习应用。",
        [
          "口语",
          "语言"
        ],
        "paid",
        true
      ],
      [
        "Praktika",
        "https://praktika.ai/",
        "AI 虚拟导师口语练习应用。",
        [
          "口语",
          "导师"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "translation",
    "name": "翻译本地化",
    "short": "Localize",
    "color": "#0891b2",
    "description": "文本、字幕、视频翻译和多语言内容",
    "tools": [
      [
        "DeepL",
        "https://www.deepl.com/",
        "高质量机器翻译、写作改进和企业翻译 API。",
        [
          "翻译",
          "写作"
        ],
        "freemium",
        true
      ],
      [
        "Google Translate",
        "https://translate.google.com/",
        "覆盖广泛语言的免费翻译入口。",
        [
          "翻译",
          "免费"
        ],
        "free",
        true
      ],
      [
        "Papago",
        "https://papago.naver.com/",
        "Naver 翻译工具，擅长韩语、日语和亚洲语言。",
        [
          "亚洲语言",
          "翻译"
        ],
        "free",
        false
      ],
      [
        "ModernMT",
        "https://www.modernmt.com/",
        "自适应机器翻译平台，适合企业本地化。",
        [
          "企业",
          "本地化"
        ],
        "paid",
        false
      ],
      [
        "Lokalise AI",
        "https://lokalise.com/ai/",
        "产品本地化管理和 AI 翻译工作流平台。",
        [
          "产品本地化",
          "团队"
        ],
        "paid",
        false
      ],
      [
        "Smartling",
        "https://www.smartling.com/",
        "企业翻译管理、本地化自动化和 AI 翻译平台。",
        [
          "本地化",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Phrase",
        "https://phrase.com/",
        "软件本地化、翻译管理和 AI 语言技术平台。",
        [
          "软件本地化",
          "TMS"
        ],
        "paid",
        false
      ],
      [
        "Rask AI",
        "https://www.rask.ai/",
        "视频翻译、配音和口型同步工具。",
        [
          "视频翻译",
          "配音"
        ],
        "paid",
        true
      ],
      [
        "HeyGen Video Translate",
        "https://www.heygen.com/video-translate",
        "视频多语言翻译、配音和口型同步。",
        [
          "视频",
          "口型同步"
        ],
        "freemium",
        true
      ],
      [
        "ElevenLabs Dubbing",
        "https://elevenlabs.io/dubbing",
        "多语言视频和音频配音翻译工具。",
        [
          "配音",
          "多语言"
        ],
        "freemium",
        false
      ],
      [
        "Sonix",
        "https://sonix.ai/",
        "自动转写、翻译字幕和音视频搜索平台。",
        [
          "字幕",
          "转写"
        ],
        "paid",
        false
      ],
      [
        "Unbabel",
        "https://unbabel.com/",
        "面向客服和企业内容的 AI 翻译平台。",
        [
          "客服",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Microsoft Translator",
        "https://www.microsoft.com/translator",
        "微软多语言翻译 API 与文档翻译。",
        [
          "微软",
          "API"
        ],
        "freemium",
        true
      ],
      [
        "Amazon Translate",
        "https://aws.amazon.com/translate/",
        "AWS 神经机器翻译服务。",
        [
          "AWS",
          "API"
        ],
        "paid",
        false
      ],
      [
        "Crowdin AI",
        "https://crowdin.com/",
        "软件本地化协作与 AI 翻译建议。",
        [
          "本地化",
          "协作"
        ],
        "paid",
        false
      ],
      [
        "Transifex AI",
        "https://www.transifex.com/",
        "持续本地化与 AI 翻译工作流。",
        [
          "本地化",
          "持续"
        ],
        "paid",
        false
      ],
      [
        "Tolgee",
        "https://tolgee.io/",
        "开源 in-context 本地化与 AI 辅助。",
        [
          "开源",
          "in-context"
        ],
        "freemium",
        false
      ],
      [
        "Weglot",
        "https://www.weglot.com/",
        "网站无代码多语言翻译与 SEO。",
        [
          "网站",
          "SEO"
        ],
        "paid",
        false
      ],
      [
        "ConveyThis",
        "https://www.conveythis.com/",
        "网站 AI 翻译插件与语言切换。",
        [
          "网站",
          "插件"
        ],
        "paid",
        false
      ],
      [
        "Maestra",
        "https://maestralabs.com/",
        "字幕、转写与视频翻译一体化。",
        [
          "字幕",
          "视频"
        ],
        "paid",
        false
      ],
      [
        "Dubverse",
        "https://dubverse.ai/",
        "多语言视频配音与字幕 AI。",
        [
          "配音",
          "视频"
        ],
        "freemium",
        false
      ],
      [
        "Captions Translate",
        "https://www.captions.ai/translate",
        "视频一键多语言翻译与配音。",
        [
          "视频",
          "配音"
        ],
        "freemium",
        true
      ]
    ]
  },
  {
    "id": "ecommerce",
    "name": "电商销售",
    "short": "Commerce",
    "color": "#db2777",
    "description": "商品图、客服、个性化推荐和增长",
    "tools": [
      [
        "Shopify Magic",
        "https://www.shopify.com/magic",
        "Shopify 内置 AI 文案、商品描述和店铺运营助手。",
        [
          "Shopify",
          "商品描述"
        ],
        "free",
        true
      ],
      [
        "Shopify Sidekick",
        "https://www.shopify.com/sidekick",
        "Shopify 商家 AI 经营助手，可分析店铺并执行运营任务。",
        [
          "经营助手",
          "Shopify"
        ],
        "paid",
        true
      ],
      [
        "Klaviyo AI",
        "https://www.klaviyo.com/ai",
        "电商邮件、短信营销和客户预测 AI 平台。",
        [
          "邮件营销",
          "电商"
        ],
        "paid",
        false
      ],
      [
        "Gorgias",
        "https://www.gorgias.com/",
        "电商客服平台，支持 AI 自动回复和工单处理。",
        [
          "客服",
          "工单"
        ],
        "paid",
        false
      ],
      [
        "Tidio",
        "https://www.tidio.com/",
        "AI 客服聊天机器人和电商客户支持工具。",
        [
          "客服",
          "机器人"
        ],
        "freemium",
        false
      ],
      [
        "Octane AI",
        "https://www.octaneai.com/",
        "电商测验、个性化推荐和客户数据收集工具。",
        [
          "推荐",
          "测验"
        ],
        "paid",
        false
      ],
      [
        "Rep AI",
        "https://www.hellorep.ai/",
        "面向电商网站的 AI 销售助理和客服。",
        [
          "销售助理",
          "客服"
        ],
        "paid",
        false
      ],
      [
        "Bloomreach",
        "https://www.bloomreach.com/",
        "电商搜索、个性化推荐和营销自动化平台。",
        [
          "个性化",
          "搜索"
        ],
        "paid",
        false
      ],
      [
        "Nosto",
        "https://www.nosto.com/",
        "电商个性化推荐、搜索和商品体验平台。",
        [
          "推荐",
          "个性化"
        ],
        "paid",
        false
      ],
      [
        "AdScale",
        "https://www.adscale.com/",
        "电商广告自动化和营销优化平台。",
        [
          "广告",
          "电商"
        ],
        "paid",
        false
      ],
      [
        "Clerk.io",
        "https://www.clerk.io/",
        "电商搜索、推荐、邮件和受众自动化工具。",
        [
          "推荐",
          "搜索"
        ],
        "paid",
        false
      ],
      [
        "Vue.ai",
        "https://vue.ai/",
        "零售商品标签、视觉搜索和个性化体验平台。",
        [
          "零售",
          "视觉搜索"
        ],
        "paid",
        false
      ],
      [
        "Claid.ai",
        "https://claid.ai/",
        "商品图片增强、背景生成和电商图片 API。",
        [
          "商品图",
          "图片增强"
        ],
        "freemium",
        false
      ],
      [
        "Pencil",
        "https://www.trypencil.com/",
        "电商和品牌广告创意生成与测试平台。",
        [
          "广告创意",
          "电商"
        ],
        "paid",
        false
      ],
      [
        "BigCommerce AI",
        "https://www.bigcommerce.com/",
        "电商平台 AI 商品与运营建议。",
        [
          "电商",
          "平台"
        ],
        "paid",
        false
      ],
      [
        "WooCommerce AI",
        "https://woocommerce.com/",
        "WordPress 电商 AI 插件生态入口。",
        [
          "WordPress",
          "插件"
        ],
        "freemium",
        false
      ],
      [
        "Amazon Seller Assistant",
        "https://sellercentral.amazon.com/",
        "卖家中心 AI  listing 与运营辅助。",
        [
          "Amazon",
          "卖家"
        ],
        "paid",
        false
      ],
      [
        "Jungle Scout AI",
        "https://www.junglescout.com/",
        "亚马逊选品与关键词 AI 分析。",
        [
          "Amazon",
          "选品"
        ],
        "paid",
        true
      ],
      [
        "Helium 10",
        "https://www.helium10.com/",
        "亚马逊卖家 AI 工具套件。",
        [
          "Amazon",
          "工具"
        ],
        "paid",
        false
      ],
      [
        "Feedonomics",
        "https://www.feedonomics.com/",
        "商品 Feed 优化与 AI 数据质量。",
        [
          "Feed",
          "数据"
        ],
        "paid",
        false
      ],
      [
        "Syte",
        "https://www.syte.ai/",
        "视觉搜索与电商发现 AI。",
        [
          "视觉搜索",
          "发现"
        ],
        "paid",
        false
      ],
      [
        "Constructor.io",
        "https://constructor.io/",
        "电商 AI 搜索与产品发现平台。",
        [
          "搜索",
          "个性化"
        ],
        "paid",
        false
      ],
      [
        "Dynamic Yield",
        "https://www.dynamicyield.com/",
        "个性化推荐与体验优化。",
        [
          "个性化",
          "体验"
        ],
        "paid",
        false
      ],
      [
        "Rebuy",
        "https://www.rebuyengine.com/",
        "Shopify 购物车追加销售 AI。",
        [
          "Shopify",
          "追加销售"
        ],
        "paid",
        false
      ],
      [
        "Klevu",
        "https://www.klevu.com/",
        "电商 NLP 搜索与商品发现。",
        [
          "搜索",
          "NLP"
        ],
        "paid",
        false
      ],
      [
        "Photoroom API",
        "https://www.photoroom.com/api",
        "批量商品图背景处理 API。",
        [
          "商品图",
          "API"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "hr",
    "name": "HR 招聘",
    "short": "HR",
    "color": "#475569",
    "description": "招聘、简历、面试、人才匹配和员工体验",
    "tools": [
      [
        "Textio",
        "https://textio.com/",
        "招聘文案和绩效反馈的语言增强平台。",
        [
          "招聘文案",
          "反馈"
        ],
        "paid",
        true
      ],
      [
        "HireVue",
        "https://www.hirevue.com/",
        "视频面试、测评和 AI 招聘自动化平台。",
        [
          "面试",
          "测评"
        ],
        "paid",
        false
      ],
      [
        "Eightfold AI",
        "https://eightfold.ai/",
        "人才智能平台，覆盖招聘、内部流动和技能画像。",
        [
          "人才智能",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "SeekOut",
        "https://www.seekout.com/",
        "人才搜索、候选人发现和招聘智能平台。",
        [
          "人才搜索",
          "招聘"
        ],
        "paid",
        false
      ],
      [
        "Paradox",
        "https://www.paradox.ai/",
        "Olivia 招聘助手，可自动处理候选人沟通和排程。",
        [
          "招聘助手",
          "排程"
        ],
        "paid",
        false
      ],
      [
        "Ashby",
        "https://www.ashbyhq.com/",
        "招聘 ATS、分析和 AI 辅助招聘流程平台。",
        [
          "ATS",
          "招聘"
        ],
        "paid",
        false
      ],
      [
        "Greenhouse",
        "https://www.greenhouse.com/",
        "招聘管理平台，支持结构化招聘和 AI 辅助能力。",
        [
          "ATS",
          "招聘管理"
        ],
        "paid",
        false
      ],
      [
        "Lever",
        "https://www.lever.co/",
        "ATS 和候选人关系管理平台。",
        [
          "ATS",
          "CRM"
        ],
        "paid",
        false
      ],
      [
        "Workable",
        "https://www.workable.com/",
        "招聘发布、候选人管理和 AI 筛选平台。",
        [
          "招聘",
          "筛选"
        ],
        "paid",
        false
      ],
      [
        "Rezi",
        "https://www.rezi.ai/",
        "AI 简历生成、优化和 ATS 友好检查工具。",
        [
          "简历",
          "求职"
        ],
        "freemium",
        false
      ],
      [
        "Teal",
        "https://www.tealhq.com/",
        "求职管理、简历优化和职位匹配工具。",
        [
          "求职",
          "简历"
        ],
        "freemium",
        false
      ],
      [
        "Kickresume",
        "https://www.kickresume.com/",
        "AI 简历、求职信和个人网站生成工具。",
        [
          "简历",
          "求职信"
        ],
        "freemium",
        false
      ],
      [
        "Resume.io",
        "https://resume.io/",
        "简历模板、求职信和简历生成工具。",
        [
          "简历",
          "模板"
        ],
        "paid",
        false
      ],
      [
        "LinkedIn Talent Insights",
        "https://business.linkedin.com/talent-solutions",
        "人才市场分析与招聘 AI 洞察。",
        [
          "LinkedIn",
          "人才"
        ],
        "paid",
        true
      ],
      [
        "Beamery",
        "https://beamery.com/",
        "人才 CRM 与 AI 技能画像平台。",
        [
          "人才CRM",
          "技能"
        ],
        "paid",
        false
      ],
      [
        "Phenom",
        "https://www.phenom.com/",
        "候选人体验与招聘营销 AI 平台。",
        [
          "候选人",
          "体验"
        ],
        "paid",
        false
      ],
      [
        "Fetcher",
        "https://www.fetcher.ai/",
        "AI 主动寻访与候选人推荐。",
        [
          "寻访",
          "自动化"
        ],
        "paid",
        false
      ],
      [
        "HiredScore",
        "https://www.hiredscore.com/",
        "AI 简历筛选与内部人才流动。",
        [
          "筛选",
          "内部流动"
        ],
        "paid",
        false
      ],
      [
        "Pymetrics",
        "https://www.pymetrics.ai/",
        "神经科学游戏化测评招聘。",
        [
          "测评",
          "游戏化"
        ],
        "paid",
        false
      ],
      [
        "Sapia.ai",
        "https://sapia.ai/",
        "异步视频面试与 AI 评估。",
        [
          "面试",
          "评估"
        ],
        "paid",
        false
      ],
      [
        "Metaview",
        "https://www.metaview.ai/",
        "面试自动笔记与招聘洞察。",
        [
          "面试",
          "笔记"
        ],
        "paid",
        false
      ],
      [
        "BrightHire",
        "https://www.brighthire.ai/",
        "面试录制、转写与教练分析。",
        [
          "面试",
          "教练"
        ],
        "paid",
        false
      ],
      [
        "Skillate",
        "https://www.skillate.com/",
        "简历解析与 AI 匹配评分。",
        [
          "简历",
          "匹配"
        ],
        "paid",
        false
      ],
      [
        "Zavvy",
        "https://www.zavvy.io/",
        "员工发展、反馈与 AI 教练。",
        [
          "员工发展",
          "教练"
        ],
        "paid",
        false
      ],
      [
        "Culture Amp AI",
        "https://www.cultureamp.com/",
        "员工调研与敬业度 AI 分析。",
        [
          "敬业度",
          "调研"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "legal-finance",
    "name": "法律金融",
    "short": "Legal",
    "color": "#0f766e",
    "description": "合同、法研、投研、财务自动化和风控",
    "tools": [
      [
        "Harvey",
        "https://www.harvey.ai/",
        "面向律所和企业法务的专业 AI 法律平台。",
        [
          "法律",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "CoCounsel",
        "https://www.thomsonreuters.com/en/products-services/legal/cocounsel.html",
        "Thomson Reuters 法律 AI 助手，覆盖法研和文档任务。",
        [
          "法律研究",
          "法务"
        ],
        "paid",
        true
      ],
      [
        "Lexis+ AI",
        "https://www.lexisnexis.com/en-us/products/lexis-plus-ai.page",
        "LexisNexis 法律检索、摘要和起草 AI 平台。",
        [
          "法律检索",
          "起草"
        ],
        "paid",
        false
      ],
      [
        "Spellbook",
        "https://www.spellbook.legal/",
        "合同审查、起草和条款建议的 AI 法律工具。",
        [
          "合同",
          "审查"
        ],
        "paid",
        false
      ],
      [
        "Robin AI",
        "https://www.robinai.com/",
        "合同自动化、审查和企业法务 AI 平台。",
        [
          "合同",
          "法务"
        ],
        "paid",
        false
      ],
      [
        "Luminance",
        "https://www.luminance.com/",
        "法律文档审查、尽调和合同分析平台。",
        [
          "尽调",
          "合同"
        ],
        "paid",
        false
      ],
      [
        "Kira Systems",
        "https://kirasystems.com/",
        "机器学习合同分析和尽职调查工具。",
        [
          "合同分析",
          "尽调"
        ],
        "paid",
        false
      ],
      [
        "Klarity",
        "https://www.klarity.ai/",
        "文档审查、订单和财务流程自动化平台。",
        [
          "财务",
          "文档"
        ],
        "paid",
        false
      ],
      [
        "AlphaSense",
        "https://www.alpha-sense.com/",
        "市场情报、公司文件和投研搜索平台。",
        [
          "投研",
          "市场情报"
        ],
        "paid",
        true
      ],
      [
        "Hebbia",
        "https://www.hebbia.ai/",
        "面向金融和专业服务的文档研究与分析平台。",
        [
          "金融研究",
          "文档"
        ],
        "paid",
        true
      ],
      [
        "Vic.ai",
        "https://www.vic.ai/",
        "应付账款和财务流程 AI 自动化平台。",
        [
          "财务自动化",
          "AP"
        ],
        "paid",
        false
      ],
      [
        "Ramp Intelligence",
        "https://ramp.com/intelligence",
        "企业支出管理中的 AI 财务自动化能力。",
        [
          "支出管理",
          "财务"
        ],
        "paid",
        false
      ],
      [
        "Ironclad AI",
        "https://ironcladapp.com/",
        "合同生命周期管理与 AI 审查。",
        [
          "合同",
          "CLM"
        ],
        "paid",
        true
      ],
      [
        "DocuSign IAM",
        "https://www.docusign.com/",
        "智能协议管理与 AI 条款分析。",
        [
          "签约",
          "合同"
        ],
        "paid",
        false
      ],
      [
        "Linksquares",
        "https://linksquares.com/",
        "合同库搜索与 AI 法务分析。",
        [
          "合同库",
          "搜索"
        ],
        "paid",
        false
      ],
      [
        "Evisort",
        "https://www.evisort.com/",
        "合同智能提取与义务追踪。",
        [
          "提取",
          "义务"
        ],
        "paid",
        false
      ],
      [
        "Casetext CoCounsel",
        "https://casetext.com/",
        "法律研究与起草 AI（Thomson 生态）。",
        [
          "法研",
          "起草"
        ],
        "paid",
        false
      ],
      [
        "Everlaw AI",
        "https://www.everlaw.com/",
        "电子取证与 AI 文档审查。",
        [
          "取证",
          "诉讼"
        ],
        "paid",
        false
      ],
      [
        "Relativity aiR",
        "https://www.relativity.com/",
        "法律科技 ediscovery AI 功能。",
        [
          "ediscovery",
          "诉讼"
        ],
        "paid",
        false
      ],
      [
        "Bloomberg Terminal AI",
        "https://www.bloomberg.com/professional/",
        "金融终端新闻与数据分析 AI。",
        [
          "金融",
          "终端"
        ],
        "paid",
        true
      ],
      [
        "Koyfin",
        "https://www.koyfin.com/",
        "投资研究仪表盘与 AI 筛选。",
        [
          "投研",
          "仪表盘"
        ],
        "freemium",
        false
      ],
      [
        "Finchat",
        "https://finchat.io/",
        "上市公司财报与自然语言问答。",
        [
          "财报",
          "问答"
        ],
        "freemium",
        true
      ],
      [
        "Blue J",
        "https://www.bluej.com/",
        "税务与法律预测分析 AI。",
        [
          "税务",
          "预测"
        ],
        "paid",
        false
      ],
      [
        "Trullion",
        "https://www.trullion.com/",
        "会计准则与审计 AI 自动化。",
        [
          "审计",
          "会计"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "health",
    "name": "医疗健康",
    "short": "Health",
    "color": "#ef4444",
    "description": "临床记录、影像、诊断辅助和医疗运营",
    "tools": [
      [
        "Abridge",
        "https://www.abridge.com/",
        "临床对话转写、摘要和医疗记录生成平台。",
        [
          "临床记录",
          "转写"
        ],
        "paid",
        true
      ],
      [
        "Nuance DAX",
        "https://www.microsoft.com/en-us/industry/health/microsoft-nuance",
        "微软 Nuance 临床环境语音记录和文档自动化工具。",
        [
          "临床语音",
          "微软"
        ],
        "paid",
        true
      ],
      [
        "Nabla",
        "https://www.nabla.com/",
        "AI 临床笔记助手，帮助医生生成就诊记录。",
        [
          "临床笔记",
          "医生"
        ],
        "paid",
        false
      ],
      [
        "Suki AI",
        "https://www.suki.ai/",
        "面向医生的语音助手和临床文档自动化平台。",
        [
          "医生助手",
          "文档"
        ],
        "paid",
        false
      ],
      [
        "Ambience Healthcare",
        "https://www.ambiencehealthcare.com/",
        "医疗环境 AI 文档、编码和临床支持平台。",
        [
          "医疗文档",
          "编码"
        ],
        "paid",
        false
      ],
      [
        "PathAI",
        "https://www.pathai.com/",
        "AI 病理分析和药物研发支持平台。",
        [
          "病理",
          "研发"
        ],
        "paid",
        true
      ],
      [
        "Viz.ai",
        "https://www.viz.ai/",
        "AI 医学影像和临床工作流协调平台。",
        [
          "医学影像",
          "工作流"
        ],
        "paid",
        false
      ],
      [
        "Aidoc",
        "https://www.aidoc.com/",
        "放射影像 AI 分析和临床决策支持平台。",
        [
          "影像",
          "放射"
        ],
        "paid",
        false
      ],
      [
        "Tempus",
        "https://www.tempus.com/",
        "精准医疗、数据和 AI 辅助治疗决策平台。",
        [
          "精准医疗",
          "数据"
        ],
        "paid",
        false
      ],
      [
        "Hippocratic AI",
        "https://www.hippocraticai.com/",
        "面向非诊断医疗任务的安全型医疗 AI Agent。",
        [
          "医疗 Agent",
          "运营"
        ],
        "paid",
        true
      ],
      [
        "Glass Health",
        "https://glass.health/",
        "医生临床推理、诊断差异和计划生成助手。",
        [
          "临床推理",
          "医生"
        ],
        "freemium",
        false
      ],
      [
        "Freed AI",
        "https://www.freed.ai/",
        "AI 医疗记录员，生成 SOAP 笔记和就诊摘要。",
        [
          "医疗记录",
          "SOAP"
        ],
        "paid",
        false
      ],
      [
        "OpenEvidence",
        "https://www.openevidence.com/",
        "医生循证医学问答与文献摘要。",
        [
          "循证",
          "医生"
        ],
        "free",
        true
      ],
      [
        "UpToDate AI",
        "https://www.uptodate.com/",
        "临床决策支持知识库 AI 功能。",
        [
          "临床",
          "知识库"
        ],
        "paid",
        false
      ],
      [
        "Doximity GPT",
        "https://www.doximity.com/",
        "医生网络内置 AI 文档与沟通。",
        [
          "医生",
          "网络"
        ],
        "free",
        false
      ],
      [
        "Glass.health",
        "https://glass.health/",
        "临床鉴别诊断与病例推理助手。",
        [
          "诊断",
          "病例"
        ],
        "freemium",
        false
      ],
      [
        "Regard",
        "https://withregard.com/",
        "住院病历 AI 诊断建议与文档。",
        [
          "住院",
          "诊断"
        ],
        "paid",
        false
      ],
      [
        "Navina",
        "https://www.navina.ai/",
        "基层医疗患者摘要与风险标记。",
        [
          "基层",
          "摘要"
        ],
        "paid",
        false
      ],
      [
        "Aledade",
        "https://www.aledade.com/",
        "价值医疗数据分析与 AI 运营。",
        [
          "价值医疗",
          "数据"
        ],
        "paid",
        false
      ],
      [
        "Arterys",
        "https://www.arterys.com/",
        "云影像 AI 分析与协作平台。",
        [
          "影像",
          "云"
        ],
        "paid",
        false
      ],
      [
        "Qure.ai",
        "https://www.qure.ai/",
        "医学影像 AI 筛查与诊断辅助。",
        [
          "影像",
          "筛查"
        ],
        "paid",
        true
      ],
      [
        "Butterfly Network",
        "https://www.butterflynetwork.com/",
        "手持超声 AI 引导成像设备。",
        [
          "超声",
          "设备"
        ],
        "paid",
        false
      ],
      [
        "Insitro",
        "https://www.insitro.com/",
        "AI 驱动药物发现与生物学平台。",
        [
          "药物",
          "发现"
        ],
        "paid",
        false
      ],
      [
        "Recursion",
        "https://www.recursion.com/",
        "AI 生物学实验与药物研发平台。",
        [
          "生物学",
          "研发"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "models",
    "name": "模型与开源",
    "short": "Models",
    "color": "#9333ea",
    "description": "开源模型、本地运行、模型社区和推理服务",
    "tools": [
      [
        "Hugging Face",
        "https://huggingface.co/",
        "模型、数据集、Spaces 和开源 AI 社区。",
        [
          "模型社区",
          "开源"
        ],
        "free",
        true
      ],
      [
        "Ollama",
        "https://ollama.com/",
        "本地运行 Llama、DeepSeek、Qwen 等大模型的工具。",
        [
          "本地模型",
          "开源"
        ],
        "free",
        true
      ],
      [
        "LM Studio",
        "https://lmstudio.ai/",
        "桌面端本地模型下载、聊天和 OpenAI 兼容服务。",
        [
          "本地模型",
          "桌面"
        ],
        "free",
        true
      ],
      [
        "OpenRouter",
        "https://openrouter.ai/",
        "统一调用多家模型的 API 路由平台。",
        [
          "模型路由",
          "API"
        ],
        "paid",
        true
      ],
      [
        "Replicate",
        "https://replicate.com/",
        "托管和运行开源模型的云推理平台。",
        [
          "模型部署",
          "API"
        ],
        "freemium",
        false
      ],
      [
        "Together AI",
        "https://www.together.ai/",
        "开源模型训练、微调和高性能推理平台。",
        [
          "推理",
          "训练"
        ],
        "paid",
        true
      ],
      [
        "Groq",
        "https://groq.com/",
        "高速 LLM 推理平台和开发者 API。",
        [
          "高速推理",
          "API"
        ],
        "freemium",
        true
      ],
      [
        "Fireworks AI",
        "https://fireworks.ai/",
        "快速模型推理、微调和生产部署平台。",
        [
          "推理",
          "部署"
        ],
        "paid",
        false
      ],
      [
        "Weights & Biases",
        "https://wandb.ai/",
        "机器学习实验追踪、评估和模型开发平台。",
        [
          "MLOps",
          "评估"
        ],
        "freemium",
        false
      ],
      [
        "Comet",
        "https://www.comet.com/",
        "模型实验管理、评估和生产监控平台。",
        [
          "MLOps",
          "监控"
        ],
        "freemium",
        false
      ],
      [
        "Cohere",
        "https://cohere.com/",
        "企业语言模型、检索增强和嵌入服务。",
        [
          "企业模型",
          "RAG"
        ],
        "paid",
        false
      ],
      [
        "Mistral AI",
        "https://mistral.ai/",
        "开放权重与商业模型提供商，覆盖聊天和 API。",
        [
          "模型",
          "欧洲"
        ],
        "freemium",
        true
      ],
      [
        "Llama",
        "https://www.llama.com/",
        "Meta 开源大模型家族官方入口。",
        [
          "开源",
          "Meta"
        ],
        "free",
        true
      ],
      [
        "Qwen",
        "https://qwenlm.github.io/",
        "阿里通义开源模型与 API 生态。",
        [
          "开源",
          "中文"
        ],
        "freemium",
        true
      ],
      [
        "DeepSeek Models",
        "https://www.deepseek.com/",
        "DeepSeek 开源权重与 API 模型页。",
        [
          "开源",
          "推理"
        ],
        "freemium",
        true
      ],
      [
        "AI21 Labs",
        "https://www.ai21.com/",
        "Jamba 等企业语言模型 API。",
        [
          "企业",
          "API"
        ],
        "paid",
        false
      ],
      [
        "Aleph Alpha",
        "https://aleph-alpha.com/",
        "欧洲主权 AI 模型与 Luminous 系列。",
        [
          "欧洲",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Inflection Pi API",
        "https://inflection.ai/",
        "Inflection 模型与 Pi 产品线。",
        [
          "对话",
          "模型"
        ],
        "paid",
        false
      ],
      [
        "Perplexity Sonar",
        "https://docs.perplexity.ai/",
        "搜索增强型在线模型 API。",
        [
          "搜索",
          "API"
        ],
        "paid",
        false
      ],
      [
        "Baseten",
        "https://www.baseten.co/",
        "模型部署、推理与 Truss 框架。",
        [
          "部署",
          "推理"
        ],
        "freemium",
        false
      ],
      [
        "Modal",
        "https://modal.com/",
        "GPU 无服务器运行模型与训练。",
        [
          "GPU",
          "无服务器"
        ],
        "paid",
        false
      ],
      [
        "Anyscale",
        "https://www.anyscale.com/",
        "Ray 分布式训练与推理平台。",
        [
          "Ray",
          "分布式"
        ],
        "paid",
        false
      ],
      [
        "Predibase",
        "https://predibase.com/",
        "LoRA 微调与开源模型托管。",
        [
          "微调",
          "LoRA"
        ],
        "freemium",
        false
      ],
      [
        "Unsloth",
        "https://unsloth.ai/",
        "高效开源模型微调与训练加速。",
        [
          "微调",
          "开源"
        ],
        "free",
        true
      ],
      [
        "LiteLLM",
        "https://www.litellm.ai/",
        "统一调用百余家 LLM 的代理网关。",
        [
          "网关",
          "开源"
        ],
        "free",
        false
      ],
      [
        "vLLM",
        "https://github.com/vllm-project/vllm",
        "高吞吐 LLM 推理服务引擎。",
        [
          "推理",
          "开源"
        ],
        "free",
        true
      ]
    ]
  },
  {
    "id": "api",
    "name": "API 平台",
    "short": "API",
    "color": "#0284c7",
    "description": "大模型 API、云平台、嵌入、推理和企业集成",
    "tools": [
      [
        "OpenAI Platform",
        "https://platform.openai.com/",
        "GPT、图像、语音、嵌入和 Agent 开发 API。",
        [
          "GPT",
          "API"
        ],
        "paid",
        true
      ],
      [
        "Anthropic Console",
        "https://console.anthropic.com/",
        "Claude 模型 API 和企业安全控制台。",
        [
          "Claude",
          "API"
        ],
        "paid",
        true
      ],
      [
        "Google AI Studio",
        "https://aistudio.google.com/",
        "Gemini 模型开发、测试和 API Key 管理平台。",
        [
          "Gemini",
          "开发"
        ],
        "freemium",
        true
      ],
      [
        "Azure AI Foundry",
        "https://ai.azure.com/",
        "微软企业 AI 应用、模型部署和治理平台。",
        [
          "Azure",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Amazon Bedrock",
        "https://aws.amazon.com/bedrock/",
        "AWS 托管的多模型生成式 AI 服务。",
        [
          "AWS",
          "多模型"
        ],
        "paid",
        true
      ],
      [
        "Mistral AI La Plateforme",
        "https://console.mistral.ai/",
        "Mistral 模型 API、微调和企业部署入口。",
        [
          "Mistral",
          "API"
        ],
        "paid",
        false
      ],
      [
        "Cohere Platform",
        "https://dashboard.cohere.com/",
        "Command、Embed、Rerank 等企业 LLM API。",
        [
          "RAG",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "xAI API",
        "https://x.ai/api",
        "Grok 模型 API 和开发者平台。",
        [
          "Grok",
          "API"
        ],
        "paid",
        true
      ],
      [
        "DeepSeek API",
        "https://platform.deepseek.com/",
        "DeepSeek 模型 API，适合推理和代码任务。",
        [
          "推理",
          "API"
        ],
        "paid",
        true
      ],
      [
        "SiliconFlow",
        "https://siliconflow.cn/",
        "国内高性价比模型 API 和推理平台。",
        [
          "国内",
          "推理"
        ],
        "freemium",
        false
      ],
      [
        "Together AI",
        "https://api.together.ai/",
        "开源和商业模型 API，支持推理与微调。",
        [
          "开源模型",
          "API"
        ],
        "paid",
        false
      ],
      [
        "Replicate API",
        "https://replicate.com/docs",
        "通过 API 运行图像、视频、音频和语言模型。",
        [
          "多模态",
          "API"
        ],
        "paid",
        false
      ],
      [
        "NVIDIA NIM",
        "https://build.nvidia.com/",
        "NVIDIA 推理微服务与模型 API。",
        [
          "NVIDIA",
          "推理"
        ],
        "freemium",
        true
      ],
      [
        "Google Vertex AI",
        "https://cloud.google.com/vertex-ai",
        "GCP 企业模型训练、部署与 API。",
        [
          "GCP",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "IBM watsonx",
        "https://www.ibm.com/watsonx",
        "IBM 企业生成式 AI 与数据平台。",
        [
          "IBM",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Oracle OCI Generative AI",
        "https://www.oracle.com/artificial-intelligence/",
        "OCI 托管模型与 Agent 服务。",
        [
          "Oracle",
          "云"
        ],
        "paid",
        false
      ],
      [
        "Cloudflare Workers AI",
        "https://developers.cloudflare.com/workers-ai/",
        "边缘运行开源模型 API。",
        [
          "边缘",
          "Workers"
        ],
        "freemium",
        false
      ],
      [
        "Voyage AI",
        "https://www.voyageai.com/",
        "高质量文本嵌入与 Rerank API。",
        [
          "嵌入",
          "RAG"
        ],
        "paid",
        false
      ],
      [
        "Jina AI",
        "https://jina.ai/",
        "嵌入、Rerank 与神经搜索 API。",
        [
          "搜索",
          "嵌入"
        ],
        "freemium",
        true
      ],
      [
        "Pinecone",
        "https://www.pinecone.io/",
        "向量数据库与推理托管 API。",
        [
          "向量",
          "RAG"
        ],
        "freemium",
        false
      ],
      [
        "Weaviate Cloud",
        "https://weaviate.io/",
        "向量数据库与生成式搜索 API。",
        [
          "向量",
          "搜索"
        ],
        "freemium",
        false
      ],
      [
        "Qdrant Cloud",
        "https://qdrant.tech/",
        "向量数据库云 API 与混合搜索。",
        [
          "向量",
          "混合搜索"
        ],
        "freemium",
        false
      ],
      [
        "Anthropic MCP",
        "https://www.anthropic.com/news/model-context-protocol",
        "模型上下文协议开放标准入口。",
        [
          "MCP",
          "标准"
        ],
        "free",
        false
      ],
      [
        "OpenAI Realtime API",
        "https://platform.openai.com/docs/guides/realtime",
        "低延迟语音对话 API 文档入口。",
        [
          "语音",
          "实时"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "meeting",
    "name": "会议转写",
    "short": "Meet",
    "color": "#6366f1",
    "description": "会议记录、摘要、销售通话和知识沉淀",
    "tools": [
      [
        "Otter",
        "https://otter.ai/",
        "会议转写、摘要、行动项和团队共享工具。",
        [
          "转写",
          "会议"
        ],
        "freemium",
        true
      ],
      [
        "Fireflies",
        "https://fireflies.ai/",
        "自动加入会议、转写、摘要并同步 CRM。",
        [
          "会议机器人",
          "CRM"
        ],
        "freemium",
        true
      ],
      [
        "Fathom",
        "https://fathom.video/",
        "会议录制、转写、摘要和片段分享工具。",
        [
          "会议摘要",
          "录制"
        ],
        "freemium",
        false
      ],
      [
        "tl;dv",
        "https://tldv.io/",
        "Google Meet 和 Zoom 会议记录、剪辑和 AI 摘要。",
        [
          "会议记录",
          "剪辑"
        ],
        "freemium",
        false
      ],
      [
        "Read AI",
        "https://www.read.ai/",
        "会议摘要、参与度分析和团队沟通洞察。",
        [
          "会议分析",
          "摘要"
        ],
        "freemium",
        false
      ],
      [
        "Granola",
        "https://www.granola.ai/",
        "面向个人的 AI 会议笔记工具，保留手写重点并自动补全。",
        [
          "会议笔记",
          "个人"
        ],
        "freemium",
        true
      ],
      [
        "Avoma",
        "https://www.avoma.com/",
        "销售会议智能、转写、教练和 CRM 更新。",
        [
          "销售会议",
          "CRM"
        ],
        "paid",
        false
      ],
      [
        "Sembly",
        "https://www.sembly.ai/",
        "会议助手、摘要、任务和团队知识沉淀工具。",
        [
          "会议助手",
          "任务"
        ],
        "freemium",
        false
      ],
      [
        "MeetGeek",
        "https://meetgeek.ai/",
        "自动录制、转写、总结和分享会议洞察。",
        [
          "会议洞察",
          "自动化"
        ],
        "freemium",
        false
      ],
      [
        "Gong",
        "https://www.gong.io/",
        "销售通话智能、收入预测和团队教练平台。",
        [
          "销售通话",
          "收入"
        ],
        "paid",
        true
      ],
      [
        "Chorus",
        "https://www.zoominfo.com/products/chorus",
        "销售会话智能和客户互动分析平台。",
        [
          "销售",
          "会话分析"
        ],
        "paid",
        false
      ],
      [
        "Zoom AI Companion",
        "https://www.zoom.com/en/products/ai-assistant/",
        "Zoom 会议摘要、聊天撰写和会议辅助功能。",
        [
          "Zoom",
          "会议"
        ],
        "freemium",
        false
      ],
      [
        "Microsoft Teams Copilot",
        "https://www.microsoft.com/microsoft-teams/",
        "Teams 会议摘要、聊天与协作 AI。",
        [
          "Teams",
          "微软"
        ],
        "paid",
        true
      ],
      [
        "Google Meet Gemini",
        "https://meet.google.com/",
        "Meet 笔记、摘要与 Workspace 集成。",
        [
          "Meet",
          "Google"
        ],
        "paid",
        false
      ],
      [
        "Webex AI Assistant",
        "https://www.webex.com/",
        "思科会议摘要与行动项助手。",
        [
          "Webex",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Krisp Meetings",
        "https://krisp.ai/meeting/",
        "会议降噪与 AI 笔记组合。",
        [
          "降噪",
          "笔记"
        ],
        "freemium",
        false
      ],
      [
        "Notta",
        "https://www.notta.ai/",
        "会议转写、翻译与多语言摘要。",
        [
          "转写",
          "翻译"
        ],
        "freemium",
        true
      ],
      [
        "Airgram",
        "https://www.airgram.io/",
        "会议录制、转写与协作笔记。",
        [
          "录制",
          "协作"
        ],
        "freemium",
        false
      ],
      [
        "Supernormal",
        "https://supernormal.com/",
        "自动会议笔记与 CRM 同步。",
        [
          "笔记",
          "CRM"
        ],
        "freemium",
        false
      ],
      [
        "Equal Time",
        "https://equaltime.io/",
        "会议发言时间公平性与洞察。",
        [
          "公平",
          "洞察"
        ],
        "freemium",
        false
      ],
      [
        "Sybill",
        "https://www.sybill.ai/",
        "销售会议非语言信号与摘要分析。",
        [
          "销售",
          "信号"
        ],
        "paid",
        false
      ],
      [
        "Clari Copilot",
        "https://www.clari.com/",
        "收入团队会议与管道 AI 洞察。",
        [
          "收入",
          "管道"
        ],
        "paid",
        false
      ],
      [
        "Wingman",
        "https://www.trywingman.com/",
        "销售通话实时教练与提示。",
        [
          "销售",
          "教练"
        ],
        "paid",
        false
      ],
      [
        "Grain",
        "https://grain.com/",
        "销售会议高光片段与知识库。",
        [
          "高光",
          "销售"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "safety",
    "name": "检测安全",
    "short": "Safety",
    "color": "#dc2626",
    "description": "AI 内容检测、审核、合规和可信验证",
    "tools": [
      [
        "GPTZero",
        "https://gptzero.me/",
        "AI 文本检测工具，适合教育和内容审核场景。",
        [
          "AI 检测",
          "文本"
        ],
        "freemium",
        true
      ],
      [
        "Originality.ai",
        "https://originality.ai/",
        "AI 内容检测、抄袭检测和事实检查平台。",
        [
          "检测",
          "抄袭"
        ],
        "paid",
        true
      ],
      [
        "Copyleaks",
        "https://copyleaks.com/",
        "AI 内容检测、抄袭检测和写作完整性平台。",
        [
          "抄袭",
          "AI 检测"
        ],
        "freemium",
        false
      ],
      [
        "ZeroGPT",
        "https://www.zerogpt.com/",
        "在线 AI 文本检测和内容工具集合。",
        [
          "AI 检测",
          "文本"
        ],
        "freemium",
        false
      ],
      [
        "Sapling AI Detector",
        "https://sapling.ai/ai-content-detector",
        "快速检测文本是否可能由 AI 生成。",
        [
          "文本检测",
          "免费"
        ],
        "freemium",
        false
      ],
      [
        "Winston AI",
        "https://gowinston.ai/",
        "AI 内容检测和抄袭检测工具。",
        [
          "检测",
          "教育"
        ],
        "paid",
        false
      ],
      [
        "Smodin",
        "https://smodin.io/ai-content-detector",
        "AI 检测、改写、写作和引用工具集合。",
        [
          "检测",
          "写作"
        ],
        "freemium",
        false
      ],
      [
        "Hive Moderation",
        "https://thehive.ai/",
        "图像、视频、文本内容审核和 AI 生成内容检测 API。",
        [
          "审核",
          "API"
        ],
        "paid",
        true
      ],
      [
        "Content at Scale",
        "https://contentatscale.ai/ai-content-detector/",
        "AI 文本检测和内容质量工具。",
        [
          "文本检测",
          "内容"
        ],
        "freemium",
        false
      ],
      [
        "Turnitin",
        "https://www.turnitin.com/",
        "学术原创性检查、AI 写作检测和评分辅助平台。",
        [
          "教育",
          "原创性"
        ],
        "paid",
        false
      ],
      [
        "Deepware Scanner",
        "https://scanner.deepware.ai/",
        "深度伪造视频检测工具。",
        [
          "Deepfake",
          "视频"
        ],
        "free",
        false
      ],
      [
        "Reality Defender",
        "https://www.realitydefender.com/",
        "企业级深度伪造、语音和图像伪造检测平台。",
        [
          "Deepfake",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Anthropic Constitutional AI",
        "https://www.anthropic.com/research",
        "AI 安全与对齐研究公开资料。",
        [
          "对齐",
          "研究"
        ],
        "free",
        false
      ],
      [
        "OpenAI Safety",
        "https://openai.com/safety",
        "OpenAI 安全系统与红队实践说明。",
        [
          "安全",
          "OpenAI"
        ],
        "free",
        false
      ],
      [
        "Lakera Guard",
        "https://www.lakera.ai/",
        "提示词注入与 LLM 防火墙 API。",
        [
          "防火墙",
          "注入"
        ],
        "freemium",
        true
      ],
      [
        "Protect AI",
        "https://protectai.com/",
        "机器学习供应链与模型安全平台。",
        [
          "ML安全",
          "供应链"
        ],
        "paid",
        false
      ],
      [
        "Robust Intelligence",
        "https://www.robustintelligence.com/",
        "AI 验证、防火墙与合规测试。",
        [
          "验证",
          "合规"
        ],
        "paid",
        false
      ],
      [
        "CalypsoAI",
        "https://calypsoai.com/",
        "生成式 AI 企业网关与策略执行。",
        [
          "网关",
          "策略"
        ],
        "paid",
        false
      ],
      [
        "HiddenLayer",
        "https://hiddenlayer.com/",
        "AI 模型与应用运行时安全。",
        [
          "运行时",
          "安全"
        ],
        "paid",
        false
      ],
      [
        "Preamble",
        "https://www.preamble.com/",
        "企业 AI 策略与护栏配置平台。",
        [
          "护栏",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Azure AI Content Safety",
        "https://azure.microsoft.com/products/ai-services/ai-content-safety",
        "多模态有害内容检测 API。",
        [
          "审核",
          "Azure"
        ],
        "paid",
        false
      ],
      [
        "Google Perspective API",
        "https://perspectiveapi.com/",
        "评论毒性检测与社区审核 API。",
        [
          "毒性",
          "评论"
        ],
        "free",
        false
      ],
      [
        "Sightengine",
        "https://sightengine.com/",
        "图像与视频 NSFW 与 AI 生成检测 API。",
        [
          "审核",
          "API"
        ],
        "paid",
        false
      ],
      [
        "C2PA",
        "https://c2pa.org/",
        "内容来源与真实性密码学标准生态。",
        [
          "溯源",
          "标准"
        ],
        "free",
        false
      ]
    ]
  },
  {
    "id": "social",
    "name": "社媒运营",
    "short": "Social",
    "color": "#e1306c",
    "description": "内容创作、排程、分析与多平台运营",
    "tools": [
      [
        "Later",
        "https://later.com/",
        "Instagram 等内容排程与 AI 文案建议。",
        [
          "排程",
          "Instagram"
        ],
        "freemium",
        true
      ],
      [
        "Sprout Social",
        "https://sproutsocial.com/",
        "企业社媒管理、监听与 AI 洞察。",
        [
          "企业",
          "监听"
        ],
        "paid",
        true
      ],
      [
        "SocialPilot",
        "https://www.socialpilot.co/",
        "多账号排程与 AI 帖子生成。",
        [
          "排程",
          "多账号"
        ],
        "paid",
        false
      ],
      [
        "Publer",
        "https://publer.io/",
        "社媒排程、分析与 AI 助手。",
        [
          "排程",
          "分析"
        ],
        "freemium",
        false
      ],
      [
        "Metricool",
        "https://metricool.com/",
        "跨平台数据与 AI 内容建议。",
        [
          "分析",
          "数据"
        ],
        "freemium",
        false
      ],
      [
        "Planable",
        "https://planable.io/",
        "社媒内容协作审批与 AI 文案。",
        [
          "协作",
          "审批"
        ],
        "paid",
        false
      ],
      [
        "ContentStudio",
        "https://contentstudio.io/",
        "内容发现、创作与排程一体化。",
        [
          "发现",
          "排程"
        ],
        "paid",
        false
      ],
      [
        "Loomly",
        "https://www.loomly.com/",
        "品牌日历与帖子 AI 优化建议。",
        [
          "日历",
          "品牌"
        ],
        "paid",
        false
      ],
      [
        "Brandwatch",
        "https://www.brandwatch.com/",
        "社交聆听与消费者洞察 AI。",
        [
          "聆听",
          "洞察"
        ],
        "paid",
        true
      ],
      [
        "Meltwater",
        "https://www.meltwater.com/",
        "公关与社媒情报 AI 分析平台。",
        [
          "公关",
          "情报"
        ],
        "paid",
        false
      ],
      [
        "Emplifi",
        "https://emplifi.io/",
        "客户体验与社媒营销 AI 套件。",
        [
          "CX",
          "营销"
        ],
        "paid",
        false
      ],
      [
        "Canva Social",
        "https://www.canva.com/social-media/",
        "社媒尺寸设计与 AI 内容套件。",
        [
          "设计",
          "Canva"
        ],
        "freemium",
        false
      ],
      [
        "Flick",
        "https://www.flick.social/",
        "Instagram 标签与 AI 文案助手。",
        [
          "Instagram",
          "标签"
        ],
        "paid",
        false
      ],
      [
        "Hashtag Expert",
        "https://www.hashtagexpert.com/",
        "标签研究与 AI 推荐工具。",
        [
          "标签",
          "增长"
        ],
        "freemium",
        false
      ],
      [
        "Typefully",
        "https://typefully.com/",
        "X/Twitter 线程写作与 AI 草稿。",
        [
          "Twitter",
          "线程"
        ],
        "freemium",
        true
      ]
    ]
  },
  {
    "id": "support",
    "name": "客服支持",
    "short": "Support",
    "color": "#0d9488",
    "description": "智能客服、工单、知识库与全渠道支持",
    "tools": [
      [
        "Intercom Fin",
        "https://www.intercom.com/fin",
        "AI 客服 Agent 与知识库问答。",
        [
          "客服",
          "Agent"
        ],
        "paid",
        true
      ],
      [
        "Zendesk AI",
        "https://www.zendesk.com/service/ai/",
        "工单摘要、自动回复与知识库。",
        [
          "工单",
          "Zendesk"
        ],
        "paid",
        true
      ],
      [
        "Freshdesk Freddy",
        "https://www.freshworks.com/freshdesk/",
        "Freshworks AI 客服与自动化。",
        [
          "客服",
          "自动化"
        ],
        "paid",
        false
      ],
      [
        "Ada",
        "https://www.ada.cx/",
        "企业级 AI 客服自动化平台。",
        [
          "自动化",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Forethought",
        "https://forethought.ai/",
        "支持工单 AI 分类与回复建议。",
        [
          "工单",
          "分类"
        ],
        "paid",
        false
      ],
      [
        "Ultimate.ai",
        "https://www.ultimate.ai/",
        "客服机器人多语言自动化。",
        [
          "机器人",
          "多语言"
        ],
        "paid",
        false
      ],
      [
        "Cognigy",
        "https://www.cognigy.com/",
        "企业对话式 AI 与语音客服。",
        [
          "语音",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "Yellow.ai",
        "https://yellow.ai/",
        "全渠道客服 AI 与自动化编排。",
        [
          "全渠道",
          "编排"
        ],
        "paid",
        false
      ],
      [
        "Kore.ai",
        "https://kore.ai/",
        "企业虚拟助手与流程自动化。",
        [
          "虚拟助手",
          "企业"
        ],
        "paid",
        false
      ],
      [
        "LivePerson",
        "https://www.liveperson.com/",
        "对话式商务与生成式客服。",
        [
          "对话商务",
          "生成式"
        ],
        "paid",
        false
      ],
      [
        "Gladly",
        "https://www.gladly.com/",
        "以客户为中心的 AI 客服平台。",
        [
          "客户中心",
          "客服"
        ],
        "paid",
        false
      ],
      [
        "Help Scout AI",
        "https://www.helpscout.com/",
        "轻量帮助台 AI 草稿与摘要。",
        [
          "帮助台",
          "轻量"
        ],
        "paid",
        false
      ],
      [
        "Crisp AI",
        "https://crisp.chat/",
        "网站客服 AI 与知识库机器人。",
        [
          "网站",
          "机器人"
        ],
        "freemium",
        false
      ],
      [
        "Tawk.to AI",
        "https://www.tawk.to/",
        "免费客服聊天与 AI Assist 插件。",
        [
          "免费",
          "聊天"
        ],
        "free",
        false
      ],
      [
        "Decagon",
        "https://decagon.ai/",
        "高性能 AI 客服 Agent 平台。",
        [
          "Agent",
          "性能"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "3d",
    "name": "3D与空间",
    "short": "3D",
    "color": "#7c3aed",
    "description": "3D 生成、扫描、纹理、数字孪生与空间计算",
    "tools": [
      [
        "Meshy",
        "https://www.meshy.ai/",
        "文本与图片生成 3D 模型与纹理。",
        [
          "文生3D",
          "纹理"
        ],
        "freemium",
        true
      ],
      [
        "Luma AI Genie",
        "https://lumalabs.ai/genie",
        "文本生成 3D 资产与场景。",
        [
          "Luma",
          "文生3D"
        ],
        "freemium",
        true
      ],
      [
        "Rodin",
        "https://hyperhuman.deemos.com/",
        "高保真 3D 头像与角色生成。",
        [
          "头像",
          "角色"
        ],
        "paid",
        false
      ],
      [
        "Spline AI",
        "https://spline.design/",
        "浏览器 3D 设计与 AI 场景生成。",
        [
          "Web3D",
          "设计"
        ],
        "freemium",
        true
      ],
      [
        "Kaedim",
        "https://www.kaedim3d.com/",
        "2D 概念图转 3D 游戏资产。",
        [
          "游戏",
          "资产"
        ],
        "paid",
        false
      ],
      [
        "CSM",
        "https://csm.ai/",
        "图片转 3D 与场景生成平台。",
        [
          "图生3D",
          "场景"
        ],
        "freemium",
        false
      ],
      [
        "Tripo AI",
        "https://www.tripo3d.ai/",
        "快速文本/图像生成 3D 模型。",
        [
          "快速",
          "3D"
        ],
        "freemium",
        true
      ],
      [
        "Polycam",
        "https://poly.cam/",
        "手机 LiDAR 扫描与 Gaussian Splatting。",
        [
          "扫描",
          "移动端"
        ],
        "freemium",
        false
      ],
      [
        "RealityScan",
        "https://www.unrealengine.com/en-US/realityscan",
        "Epic 照片转 3D 扫描应用。",
        [
          "扫描",
          "Epic"
        ],
        "free",
        false
      ],
      [
        "Masterpiece X",
        "https://www.masterpiecex.com/",
        "VR 中生成与编辑 3D 资产。",
        [
          "VR",
          "编辑"
        ],
        "freemium",
        false
      ],
      [
        "Scenario 3D",
        "https://www.scenario.com/features/3d",
        "游戏 3D 资产生成与风格训练。",
        [
          "游戏",
          "批量"
        ],
        "paid",
        false
      ],
      [
        "NVIDIA Omniverse",
        "https://www.nvidia.com/en-us/omniverse/",
        "3D 协作、数字孪生与 OpenUSD。",
        [
          "数字孪生",
          "NVIDIA"
        ],
        "freemium",
        true
      ],
      [
        "Unity Muse",
        "https://unity.com/products/muse",
        "Unity 编辑器 AI 资产生成套件。",
        [
          "Unity",
          "游戏"
        ],
        "paid",
        false
      ],
      [
        "Unreal MetaHuman",
        "https://www.unrealengine.com/metahuman",
        "高保真数字人创建与动画。",
        [
          "数字人",
          "Unreal"
        ],
        "free",
        true
      ],
      [
        "Arkio",
        "https://www.arkio.is/",
        "VR/AR 协作建筑与空间设计。",
        [
          "建筑",
          "VR"
        ],
        "freemium",
        false
      ]
    ]
  },
  {
    "id": "nocode",
    "name": "无代码应用",
    "short": "NoCode",
    "color": "#db2777",
    "description": "AI 应用搭建、表单、数据库与内部工具",
    "tools": [
      [
        "Bubble",
        "https://bubble.io/",
        "可视化 Web 应用搭建与 AI 助手。",
        [
          "Web应用",
          "可视化"
        ],
        "paid",
        true
      ],
      [
        "Glide",
        "https://www.glideapps.com/",
        "表格驱动移动应用与 AI 列。",
        [
          "移动",
          "表格"
        ],
        "freemium",
        true
      ],
      [
        "Softr",
        "https://www.softr.io/",
        "Airtable/数据源转客户端与门户。",
        [
          "门户",
          "Airtable"
        ],
        "freemium",
        false
      ],
      [
        "FlutterFlow",
        "https://flutterflow.io/",
        "可视化 Flutter 应用与 AI 生成。",
        [
          "Flutter",
          "移动"
        ],
        "paid",
        false
      ],
      [
        "Retool AI",
        "https://retool.com/",
        "内部工具构建与 AI 工作流。",
        [
          "内部工具",
          "企业"
        ],
        "paid",
        true
      ],
      [
        "Appsmith",
        "https://www.appsmith.com/",
        "开源低代码内部应用与 AI 集成。",
        [
          "开源",
          "内部工具"
        ],
        "freemium",
        false
      ],
      [
        "ToolJet",
        "https://www.tooljet.com/",
        "开源 Retool 替代与 AI 插件。",
        [
          "开源",
          "低代码"
        ],
        "freemium",
        false
      ],
      [
        "Budibase",
        "https://budibase.com/",
        "自托管内部工具与自动化。",
        [
          "自托管",
          "自动化"
        ],
        "freemium",
        false
      ],
      [
        "WeWeb",
        "https://www.weweb.io/",
        "无代码前端连接任意后端与 AI。",
        [
          "前端",
          "无头"
        ],
        "paid",
        false
      ],
      [
        "Adalo",
        "https://www.adalo.com/",
        "无代码原生移动应用搭建。",
        [
          "移动",
          "原生"
        ],
        "paid",
        false
      ],
      [
        "Thunkable",
        "https://thunkable.com/",
        "拖拽式移动应用与 AI 组件。",
        [
          "移动",
          "拖拽"
        ],
        "freemium",
        false
      ],
      [
        "Voiceflow Builder",
        "https://www.voiceflow.com/",
        "对话应用无代码构建（扩展分类）。",
        [
          "对话",
          "构建"
        ],
        "freemium",
        false
      ],
      [
        "Zapier Interfaces",
        "https://zapier.com/interfaces",
        "AI 表单与轻量应用界面。",
        [
          "表单",
          "Zapier"
        ],
        "freemium",
        false
      ],
      [
        "Fillout",
        "https://www.fillout.com/",
        "AI 表单、测验与逻辑分支。",
        [
          "表单",
          "测验"
        ],
        "freemium",
        false
      ],
      [
        "Tally",
        "https://tally.so/",
        "免费表单与 AI 问题生成。",
        [
          "表单",
          "免费"
        ],
        "freemium",
        true
      ]
    ]
  },
  {
    "id": "analytics-growth",
    "name": "增长分析",
    "short": "Analytics",
    "color": "#ca8a04",
    "description": "产品分析、实验、归因与增长情报",
    "tools": [
      [
        "Amplitude AI",
        "https://amplitude.com/",
        "产品分析与自然语言洞察问答。",
        [
          "产品分析",
          "NLQ"
        ],
        "freemium",
        true
      ],
      [
        "Mixpanel Spark",
        "https://mixpanel.com/",
        "产品事件分析与 AI 异常检测。",
        [
          "事件",
          "检测"
        ],
        "freemium",
        true
      ],
      [
        "Heap Sense",
        "https://www.heap.io/",
        "自动采集分析与 AI 洞察建议。",
        [
          "自动采集",
          "洞察"
        ],
        "paid",
        false
      ],
      [
        "PostHog AI",
        "https://posthog.com/",
        "开源产品分析、实验与 AI 助手。",
        [
          "开源",
          "实验"
        ],
        "freemium",
        true
      ],
      [
        "Pendo AI",
        "https://www.pendo.io/",
        "产品引导、反馈与 AI 路线图洞察。",
        [
          "引导",
          "反馈"
        ],
        "paid",
        false
      ],
      [
        "FullStory",
        "https://www.fullstory.com/",
        "会话回放与 AI 行为洞察。",
        [
          "回放",
          "行为"
        ],
        "paid",
        false
      ],
      [
        "Hotjar AI",
        "https://www.hotjar.com/",
        "热图、录屏与 AI 调研摘要。",
        [
          "热图",
          "调研"
        ],
        "paid",
        false
      ],
      [
        "Statsig",
        "https://www.statsig.com/",
        "功能开关、实验与 AI 分析报告。",
        [
          "实验",
          "Feature Flag"
        ],
        "freemium",
        false
      ],
      [
        "Optimizely",
        "https://www.optimizely.com/",
        "A/B 测试与个性化 AI 优化。",
        [
          "A/B",
          "个性化"
        ],
        "paid",
        false
      ],
      [
        "LaunchDarkly",
        "https://launchdarkly.com/",
        "功能发布与 AI 运维洞察。",
        [
          "Feature Flag",
          "运维"
        ],
        "paid",
        false
      ],
      [
        "Segment Protocols",
        "https://segment.com/",
        "客户数据平台与 AI 数据质量。",
        [
          "CDP",
          "数据"
        ],
        "paid",
        false
      ],
      [
        "June",
        "https://www.june.so/",
        "B2B SaaS 产品分析 AI 简报。",
        [
          "B2B",
          "简报"
        ],
        "freemium",
        false
      ],
      [
        "Clearbit Reveal",
        "https://clearbit.com/",
        "访客识别与 AI 线索评分。",
        [
          "线索",
          "识别"
        ],
        "paid",
        false
      ],
      [
        "Factors.ai",
        "https://www.factors.ai/",
        "B2B 归因与 AI 管道洞察。",
        [
          "归因",
          "B2B"
        ],
        "paid",
        false
      ],
      [
        "Gong Labs",
        "https://www.gong.io/labs/",
        "收入情报与对话 AI 研究入口。",
        [
          "收入",
          "研究"
        ],
        "paid",
        false
      ]
    ]
  },
  {
    "id": "creative-video",
    "name": "创意剪辑",
    "short": "Edit",
    "color": "#f97316",
    "description": "智能剪辑、调色、特效、字幕与短视频包装",
    "tools": [
      [
        "Adobe Premiere Pro AI",
        "https://www.adobe.com/products/premiere.html",
        "专业剪辑内置生成式与自动工具。",
        [
          "专业",
          "Adobe"
        ],
        "paid",
        true
      ],
      [
        "DaVinci Resolve AI",
        "https://www.blackmagicdesign.com/products/davinciresolve",
        "调色、剪辑与 Magic Mask AI 功能。",
        [
          "调色",
          "专业"
        ],
        "freemium",
        true
      ],
      [
        "Runway Gen-3",
        "https://runwayml.com/",
        "Runway 新一代视频生成与编辑扩展。",
        [
          "Runway",
          "生成"
        ],
        "freemium",
        true
      ],
      [
        "Topaz Video AI",
        "https://www.topazlabs.com/video-ai",
        "视频超分、降噪与帧插值增强。",
        [
          "超分",
          "增强"
        ],
        "paid",
        false
      ],
      [
        "Gling",
        "https://www.gling.ai/",
        "自动剪除口误与静音的剪辑助手。",
        [
          "粗剪",
          "口误"
        ],
        "freemium",
        false
      ],
      [
        "AutoPod",
        "https://www.autopod.fm/",
        "播客多机位自动剪辑插件。",
        [
          "播客",
          "多机位"
        ],
        "paid",
        false
      ],
      [
        "Morphic",
        "https://www.morphic.com/",
        "AI 视频编辑与时间线助手。",
        [
          "时间线",
          "编辑"
        ],
        "paid",
        false
      ],
      [
        "Filmora AI Portrait",
        "https://filmora.wondershare.com/",
        "人像抠像与 AI 背景替换。",
        [
          "人像",
          "抠像"
        ],
        "freemium",
        false
      ],
      [
        "Unscreen",
        "https://www.unscreen.com/",
        "视频自动去背景与绿幕替代。",
        [
          "去背景",
          "视频"
        ],
        "freemium",
        false
      ],
      [
        "Veed.io AI",
        "https://www.veed.io/tools/ai",
        "AI 剪辑、翻译与社媒尺寸导出。",
        [
          "社媒",
          "翻译"
        ],
        "freemium",
        false
      ],
      [
        "Riverside AI",
        "https://riverside.fm/",
        "播客录制、剪辑与 Magic Clips。",
        [
          "播客",
          "录制"
        ],
        "freemium",
        true
      ],
      [
        "Descript Underlord",
        "https://www.descript.com/",
        "AI 驱动全流程音视频编辑助手。",
        [
          "Underlord",
          "全流程"
        ],
        "freemium",
        true
      ],
      [
        "Opus Clip Pro",
        "https://www.opus.pro/",
        "长视频 AI 切片与病毒式标题。",
        [
          "切片",
          "标题"
        ],
        "freemium",
        false
      ],
      [
        "2short.ai",
        "https://2short.ai/",
        "YouTube 长视频自动转 Shorts。",
        [
          "Shorts",
          "YouTube"
        ],
        "freemium",
        false
      ],
      [
        "Klap",
        "https://klap.app/",
        "长视频一键生成多条短视频。",
        [
          "短视频",
          "批量"
        ],
        "freemium",
        true
      ]
    ]
  }
];

const NEW_CATEGORY_IDS = new Set(["social", "support", "3d", "nocode", "analytics-growth", "creative-video"]);

const CATEGORY_DISPLAY_ORDER = [
  "chat", "research", "writing", "image", "3d", "video", "creative-video", "audio",
  "dev", "agents", "nocode", "design", "marketing", "social", "seo", "analytics-growth",
  "productivity", "meeting", "support", "data", "education", "translation",
  "ecommerce", "hr", "legal-finance", "health", "models", "api", "safety"
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

const state = {
  category: "all",
  query: "",
  price: "all",
  sort: "featured",
  favoritesOnly: false,
  newOnly: false,
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
      rank: categoryIndex * 100 + toolIndex,
      isNew: isNewTool(category, toolIndex)
    };
  })
);

const els = {
  searchInput: document.querySelector("#searchInput"),
  toolGrid: document.querySelector("#toolGrid"),
  categoryList: document.querySelector("#categoryList"),
  quickGrid: document.querySelector("#quickGrid"),
  trendingList: document.querySelector("#trendingList"),
  newList: document.querySelector("#newList"),
  tagCloud: document.querySelector("#tagCloud"),
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
  newOnlyToggle: document.querySelector("#newOnlyToggle"),
  sortSelect: document.querySelector("#sortSelect"),
  clearFilters: document.querySelector("#clearFilters"),
  favoriteToggle: document.querySelector("#favoriteToggle"),
  toolTotal: document.querySelector("#toolTotal"),
  categoryTotal: document.querySelector("#categoryTotal"),
  freeTotal: document.querySelector("#freeTotal")
};

document.addEventListener("DOMContentLoaded", () => {
  hydrateStats();
  renderSideRails();
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
    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(() => {
      state.query = event.target.value.trim();
      render();
    }, 220);
  });

  document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      state.query = button.dataset.query;
      els.searchInput.value = state.query;
      render();
      document.querySelector("#directory").scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
  els.emptyClearQuery?.addEventListener("click", clearSearchQuery);
  els.emptyExpandSearch?.addEventListener("click", expandSearchToAll);
  els.emptyResetAll?.addEventListener("click", resetAllFilters);

  els.favoriteToggle.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    els.favoriteToggle.classList.toggle("active", state.favoritesOnly);
    render();
  });

  els.newOnlyToggle?.addEventListener("click", () => {
    state.newOnly = !state.newOnly;
    els.newOnlyToggle.classList.toggle("active", state.newOnly);
    els.newOnlyToggle.setAttribute("aria-pressed", String(state.newOnly));
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
  const newCount = tools.filter((tool) => tool.isNew).length;
  els.toolTotal.textContent = tools.length;
  els.categoryTotal.textContent = categorySeeds.length;
  els.freeTotal.textContent = freeCount;
}

function renderQuickCategoryCard(category) {
  const count = tools.filter((tool) => tool.categoryId === category.id).length;
  return `
    <button class="quick-card" type="button" data-quick-category="${category.id}" style="--tone:${hexToRgba(category.color, 0.12)};--tone-ink:${category.color}">
      <span class="quick-icon" aria-hidden="true">${escapeHtml(getCategoryBadge(category))}</span>
      <strong class="quick-name">${escapeHtml(category.name)}</strong>
      <span class="quick-meta">${escapeHtml(category.description)} · ${count} 个</span>
    </button>
  `;
}

function bindQuickCategoryButtons(root) {
  root.querySelectorAll("[data-quick-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.quickCategory;
      renderCategories();
      render();
      document.querySelector("#directory").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderQuickLinks() {
  els.quickGrid.innerHTML = getOrderedCategorySeeds().map(renderQuickCategoryCard).join("");
  bindQuickCategoryButtons(els.quickGrid);
}

function renderSideRails() {
  const trendingNames = ["ChatGPT", "Midjourney", "Runway", "Cursor", "Perplexity"];
  const trending = trendingNames.map((name) => tools.find((tool) => tool.name === name)).filter(Boolean);
  const recent = tools.slice(-5).reverse();
  els.trendingList.innerHTML = renderMiniList(trending);
  els.newList.innerHTML = renderMiniList(recent);
  bindLogoFallbacks(els.trendingList);
  bindLogoFallbacks(els.newList);
  const tags = ["文生图", "视频生成", "代码", "SEO", "会议", "自动化", "论文", "配音", "PPT", "电商"];
  els.tagCloud.innerHTML = tags.map((tag) => `<button type="button" data-query="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("");
}

function renderMiniList(items) {
  return items.map((tool) => `
    <div class="mini-item">
      ${renderLogoMarkup(tool, "spotlight-logo")}
      <div>
        <strong>${escapeHtml(tool.name)}</strong>
        <span>${escapeHtml(tool.categoryName)} · ${escapeHtml(tool.tags[0])}</span>
      </div>
      <a href="${tool.url}" target="_blank" rel="noopener noreferrer" aria-label="访问 ${escapeHtml(tool.name)}">↗</a>
    </div>
  `).join("");
}

function renderCategories() {
  const byId = Object.fromEntries(categories.map((category) => [category.id, category]));
  const orderedCategories = [byId.all, ...getOrderedCategorySeeds().map((seed) => byId[seed.id])];

  els.categoryList.innerHTML = orderedCategories.map((category) => {
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
  renderResultHeader(filtered);
  renderActiveTags();
  renderTools(filtered);
  renderEmptyState(filtered);
}

function renderResultHeader(filtered) {
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

  const metaParts = [`${filtered.length} 个结果`];
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
    if (state.sort === "name") return a.name.localeCompare(b.name);
    if (state.sort === "category") return a.categoryName.localeCompare(b.categoryName) || a.rank - b.rank;
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

function renderTools(items) {
  els.toolGrid.innerHTML = items.map((tool) => {
    const favorite = state.favorites.has(tool.id);
    return `
      <article class="tool-card" style="--logo-bg:${tool.color}">
        <div class="tool-head">
          ${renderLogoMarkup(tool, "tool-logo")}
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
  bindLogoFallbacks(els.toolGrid);
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getToolLogoUrl(tool) {
  const file = logoManifest[tool.id];
  if (file) return `assets/logos/${encodeURI(file)}`;
  const domain = getDomain(tool.url);
  if (!domain) return "";
  const ddgFallback = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
  return `https://unavatar.io/${encodeURIComponent(domain)}?fallback=${encodeURIComponent(ddgFallback)}`;
}

function renderLogoMarkup(tool, className) {
  const initials = getInitials(tool.name);
  const domain = getDomain(tool.url);
  const logoUrl = getToolLogoUrl(tool);
  const remoteUrl = (() => {
    if (!domain) return "";
    const ddgFallback = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
    return `https://unavatar.io/${encodeURIComponent(domain)}?fallback=${encodeURIComponent(ddgFallback)}`;
  })();
  const remoteAttr = remoteUrl && logoManifest[tool.id] ? ` data-remote="${remoteUrl}"` : "";
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
        img.src = `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
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
