import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const downloadsDir = path.join(root, "data", "skill-downloads");
const outPath = path.join(root, "data", "skills.json");

function parseSkillMd(content, id) {
  const titleMatch = content.match(/^#\s+(.+?)(?:\r?\n|$)/m);
  const title = titleMatch ? titleMatch[1].trim() : id;

  const starsMatch = content.match(/Stars:\s*([\d,]+)/);
  const categoryMatch = content.match(/## 分类\r?\n(.+?)(?:\r?\n|$)/);
  const categoryLine = categoryMatch ? categoryMatch[1].trim() : "";
  const tags = categoryLine
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  const howToMatch = content.match(/## 使用方法\r?\n([\s\S]*?)(?=\r?\n## |$)/);
  const howTo = howToMatch ? howToMatch[1].trim() : "";

  const links = [];
  const linksSection = content.match(/## 资源链接\r?\n([\s\S]*?)(?=\r?\n## |$)/);
  if (linksSection) {
    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRe.exec(linksSection[1])) !== null) {
      links.push({ label: match[1].trim(), url: match[2].trim() });
    }
  }

  const item = {
    id,
    title,
    tags,
    howTo,
    links,
    permalink: `#skills?item=${id}`,
    downloadUrl: `data/skill-downloads/${id}.md`,
    source: "GitHub Search API"
  };

  if (starsMatch) {
    item.stars = Number(starsMatch[1].replace(/,/g, ""));
  }

  return item;
}

function skillFileSortKey(filename) {
  const match = /^(?:hot-)?skill-(\d+)/i.exec(filename);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function skillFileRank(filename) {
  return filename.startsWith("hot-skill-") ? 0 : 1;
}

const files = fs
  .readdirSync(downloadsDir)
  .filter((name) => /^(?:hot-)?skill-\d+(?:-.+)?\.md$/i.test(name))
  .sort((a, b) => {
    const rankDiff = skillFileRank(a) - skillFileRank(b);
    if (rankDiff !== 0) return rankDiff;
    return skillFileSortKey(a) - skillFileSortKey(b);
  });

const items = files.map((filename) => {
  const id = filename.replace(/\.md$/i, "");
  let content = fs.readFileSync(path.join(downloadsDir, filename), "utf8");
  if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);
  return parseSkillMd(content, id);
});

const payload = {
  version: 2,
  generatedAt: new Date().toISOString().slice(0, 10),
  source: "data/skill-downloads + GitHub Search API",
  count: items.length,
  downloadDirectory: "data/skill-downloads/",
  items
};

fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${items.length} skills to ${outPath}`);
