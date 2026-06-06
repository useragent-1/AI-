import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const target = path.join(root, "server.js");
let source = readFileSync(target, "utf8");
const start = source.indexOf("function slugify(value, fallback");
const end = source.indexOf("function sanitizeAgentFilename");
if (start < 0 || end < 0) {
  throw new Error(`markers not found: ${start}, ${end}`);
}

const insert = `function slugify(value, fallback = "agent-project") {
  const cleaned = String(value || "")
    .toLowerCase()
    .replace(/[\\u4e00-\\u9fa5]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return cleaned || \`\${fallback}-\${Date.now().toString(36)}\`;
}

function deriveProjectMeta(body) {
  const title = String(body.title || "").trim() || "Agent 项目";
  const slugSource = title !== "Agent 项目" ? title : body.prompt || "agent-project";
  return {
    type: "model",
    slug: slugify(slugSource, "agent-project"),
    title: title.slice(0, 120),
    summary: "由模型根据需求与规划自主生成，无预设模板。"
  };
}

`;

source = source.slice(0, start) + insert + source.slice(end);
writeFileSync(target, source);
console.log("patched server.js");
