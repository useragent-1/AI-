import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(root, "script.js");
const outPath = path.join(root, "data", "catalog.json");
const legacyPath = path.join(root, "script.legacy.js");

const marker = "const categorySeeds = ";
let sourcePath = scriptPath;
let content = fs.readFileSync(sourcePath, "utf8");
if (!content.includes(marker) && fs.existsSync(legacyPath)) {
  sourcePath = legacyPath;
  content = fs.readFileSync(sourcePath, "utf8");
}
const start = content.indexOf(marker);
if (start < 0) throw new Error("categorySeeds not found in script.js or script.legacy.js");

const arrayStart = start + marker.length;
let depth = 0;
let inString = false;
let escape = false;
let quote = "";
let end = -1;

for (let i = arrayStart; i < content.length; i += 1) {
  const ch = content[i];
  if (inString) {
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === quote) inString = false;
    continue;
  }
  if (ch === "\"" || ch === "'") {
    inString = true;
    quote = ch;
    continue;
  }
  if (ch === "[") depth += 1;
  if (ch === "]") {
    depth -= 1;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}

if (end < 0) throw new Error("categorySeeds array end not found");

const arrayLiteral = content.slice(arrayStart, end);
const categorySeeds = Function(`"use strict"; return (${arrayLiteral});`)();
const tail = content.slice(end + 1).replace(/^\s*;\s*/, "");

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString().slice(0, 10), categories: categorySeeds }, null, 0)}\n`
);

if (fs.existsSync(scriptPath)) {
  fs.writeFileSync(legacyPath, content);
  console.log(`Backup: ${legacyPath}`);
}

console.log(`Wrote ${outPath} (${categorySeeds.length} categories, ${toolsCount(categorySeeds)} tools)`);

function toolsCount(categories) {
  return categories.reduce((sum, category) => sum + (category.tools?.length || 0), 0);
}
