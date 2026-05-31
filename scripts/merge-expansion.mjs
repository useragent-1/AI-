import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { ADDITIONS, NEW_CATEGORIES } from "./expansion-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const scriptPath = path.join(root, "script.js");

const script = fs.readFileSync(scriptPath, "utf8");
const match = script.match(/const categorySeeds = (\[[\s\S]*?\n\]);/);
if (!match) throw new Error("categorySeeds block not found");

const ctx = vm.createContext({});
vm.runInContext(`var categorySeeds = ${match[1]};`, ctx);

const existingNames = new Set();
for (const category of ctx.categorySeeds) {
  for (const tool of category.tools) {
    existingNames.add(tool[0].toLowerCase());
  }
}

let added = 0;
for (const category of ctx.categorySeeds) {
  const extra = ADDITIONS[category.id];
  if (!extra) continue;
  for (const tool of extra) {
    const key = tool[0].toLowerCase();
    if (existingNames.has(key)) continue;
    category.tools.push(tool);
    existingNames.add(key);
    added += 1;
  }
}

for (const category of NEW_CATEGORIES) {
  const exists = ctx.categorySeeds.some((item) => item.id === category.id);
  if (exists) continue;
  const tools = [];
  for (const tool of category.tools) {
    const key = tool[0].toLowerCase();
    if (existingNames.has(key)) continue;
    tools.push(tool);
    existingNames.add(key);
    added += 1;
  }
  const { tools: _drop, ...meta } = category;
  ctx.categorySeeds.push({ ...meta, tools });
}

const total = ctx.categorySeeds.reduce((sum, category) => sum + category.tools.length, 0);
const serialized = JSON.stringify(ctx.categorySeeds, null, 2);
const updated = script.replace(/const categorySeeds = \[[\s\S]*?\n\];/, `const categorySeeds = ${serialized};`);
fs.writeFileSync(scriptPath, updated);

console.log(`Added ${added} tools. Total now: ${total}.`);
