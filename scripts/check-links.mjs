import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const tools = catalog.categories.flatMap((category) =>
  category.tools.map(([name, url]) => ({ name, url, category: category.name }))
);

const timeoutMs = 12000;
const concurrency = 8;
let failed = 0;
let checked = 0;

async function checkUrl(tool) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(tool.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "AI-Nav-Link-Checker/1.0" }
    });
    if (response.status >= 400) {
      console.log(`[${response.status}] ${tool.name} (${tool.category}) → ${tool.url}`);
      failed += 1;
    }
  } catch (error) {
    console.log(`[FAIL] ${tool.name} (${tool.category}) → ${tool.url} — ${error.message}`);
    failed += 1;
  } finally {
    clearTimeout(timer);
    checked += 1;
  }
}

async function run() {
  console.log(`Checking ${tools.length} tool URLs…`);
  const queue = [...tools];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const tool = queue.shift();
      if (tool) await checkUrl(tool);
    }
  });
  await Promise.all(workers);
  console.log(`Done: ${checked} checked, ${failed} issues`);
  if (failed > 0) process.exitCode = 1;
}

run();
