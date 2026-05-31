import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const scriptPath = path.join(root, "script.js");
const logoDir = path.join(root, "assets", "logos");
const manifestPath = path.join(logoDir, "manifest.json");

const script = fs.readFileSync(scriptPath, "utf8");
const match = script.match(/const categorySeeds = (\[[\s\S]*?\n\]);/);
if (!match) throw new Error("categorySeeds not found in script.js");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`var categorySeeds = ${match[1]};`, sandbox);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const tools = sandbox.categorySeeds.flatMap((category, categoryIndex) =>
  category.tools.map((tool, toolIndex) => {
    const [name, url] = tool;
    return {
      id: slugify(`${category.id}-${name}`),
      name,
      url,
      domain: getDomain(url)
    };
  })
);

const extFromType = (type = "") => {
  if (type.includes("png")) return ".png";
  if (type.includes("svg")) return ".svg";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  if (type.includes("icon") || type.includes("ico")) return ".ico";
  if (type.includes("webp")) return ".webp";
  return ".png";
};

async function fetchLogo(domain) {
  const sources = [
    `https://unavatar.io/${domain}?fallback=false`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source, {
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        headers: { "User-Agent": "AI-Nav-Logo-Fetcher/1.0" }
      });
      if (!response.ok) continue;

      const type = response.headers.get("content-type") || "";
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 48) continue;

      return {
        buffer,
        ext: extFromType(type),
        source
      };
    } catch {
      continue;
    }
  }

  return null;
}

async function runPool(items, worker, concurrency = 12) {
  const results = new Array(items.length);
  let index = 0;

  async function next() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

fs.mkdirSync(logoDir, { recursive: true });

const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

console.log(`Fetching logos for ${tools.length} tools...`);

let saved = 0;
let skipped = 0;
let failed = 0;

await runPool(tools, async (tool) => {
  const existing = manifest[tool.id];
  if (existing && fs.existsSync(path.join(logoDir, existing))) {
    skipped += 1;
    process.stdout.write("s");
    return;
  }

  if (!tool.domain) {
    failed += 1;
    process.stdout.write("x");
    return;
  }

  const logo = await fetchLogo(tool.domain);
  if (!logo) {
    failed += 1;
    process.stdout.write(".");
    return;
  }

  const filename = `${tool.id}${logo.ext}`;
  fs.writeFileSync(path.join(logoDir, filename), logo.buffer);
  manifest[tool.id] = filename;
  saved += 1;
  process.stdout.write("+");
});

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(
  path.join(logoDir, "manifest.js"),
  `window.LOGO_MANIFEST=${JSON.stringify(manifest)};\n`
);

console.log(`\nDone: ${saved} saved, ${skipped} skipped, ${failed} failed, ${Object.keys(manifest).length} in manifest.`);
