# AI 导航星图

一个纯静态 AI 工具导航站，仿照大型 AI 工具目录的浏览体验，重点提供分类导航、搜索、筛选、收藏和外链跳转。

## 功能

- 29 个 AI 工具分类、700 款工具，覆盖聊天、写作、图像、视频、音频、开发、自动化、营销、SEO、办公、数据、教育、翻译、电商、招聘、法律金融、医疗、社媒、客服、3D、无代码、增长分析等。
- 工具数据位于 `data/catalog.json`，首屏异步加载；逻辑在 `script.js`。
- 前端本地搜索，支持按名称、描述、标签、分类检索；筛选状态同步到 URL（可分享链接）。
- 分类、价格、精选/最新/名称排序、收藏筛选、工具对比（最多 3 个）、卡片/紧凑视图。
- 纯 HTML/CSS/JavaScript，可直接部署到 GitHub Pages；可选 `npm run build` 从旧版数据重新生成 catalog。
- **试验场**（`#lab`）：OpenAI 兼容 API 配置、模型拉取、流式对话；密钥仅存浏览器 `localStorage`。

## 试验场

- 入口：顶部导航 **试验场**，或工具卡片上的 **试验场** 按钮（已映射的平台）。
- 深链：`?provider=openrouter#lab` 打开并选中对应平台。
- 配置：`neux-lab-v4` 存于 `localStorage`；支持导出/导入 JSON（可选是否含密钥）、一键清除本机数据。
- 会话：多会话列表保存在 `neux-lab-sessions-v1`，可导出当前会话为 Markdown。
- **CORS**：浏览器直连第三方 API 常被拦截，请用本地 Ollama/LM Studio 或自建 OpenAI 兼容反代；详见试验场内说明。

### 试验场本地预览

与整站相同，需通过静态服务器打开（不要直接双击 `file://`），否则无法加载 `data/lab-providers.json`。

## 构建与校验

```powershell
# 从含 categorySeeds 的 legacy 备份重新导出 catalog（日常无需运行）
npm run build

# 检查工具外链（较慢，会请求各官网）
npm run check-links
```

## 本地预览

直接打开 `index.html`，或在仓库目录启动一个静态服务器：

```powershell
cd "项目目录路径"
python -m http.server 4173 --bind 127.0.0.1
```

然后访问 **http://127.0.0.1:4173**（Windows 上比 `localhost` 更稳定）。

若提示端口占用，先在该终端按 `Ctrl+C` 结束旧服务，或换端口：`python -m http.server 8080 --bind 127.0.0.1`。

## 部署

仓库推送到 GitHub 后，可在 Settings -> Pages 中选择 `main` 分支根目录发布。
