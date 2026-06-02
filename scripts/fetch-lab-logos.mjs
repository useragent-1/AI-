import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const providersPath = path.join(root, "data", "lab-providers.json");
const logoDir = path.join(root, "assets", "logos");
const manifestPath = path.join(logoDir, "lab-providers-manifest.json");

const LOGO_EXTS = [".png", ".svg", ".jpg", ".jpeg", ".ico", ".webp"];

const data = JSON.parse(fs.readFileSync(providersPath, "utf8"));
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

const extFromType = (type = "") => {
  if (type.includes("svg")) return ".svg";
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  if (type.includes("icon") || type.includes("ico")) return ".ico";
  return ".png";
};

function findExistingLabFile(id) {
  for (const ext of LOGO_EXTS) {
    const name = `lab-${id}${ext}`;
    if (fs.existsSync(path.join(logoDir, name))) return name;
  }
  return null;
}

function copyToLabFile(id, srcPath) {
  if (!srcPath || !fs.existsSync(srcPath)) return null;
  const ext = path.extname(srcPath) || ".png";
  const outName = `lab-${id}${ext}`;
  const dest = path.join(logoDir, outName);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(srcPath, dest);
  }
  return outName;
}

function resolveSourcePath(provider) {
  if (provider.logo) {
    const fromLogo = path.join(root, provider.logo.replace(/^\//, ""));
    if (fs.existsSync(fromLogo)) return fromLogo;
  }
  const legacy = manifest[provider.id];
  if (legacy) {
    const fromManifest = path.join(logoDir, legacy);
    if (fs.existsSync(fromManifest)) return fromManifest;
  }
  return null;
}

async function fetchLogo(domain) {
  const sources = [
    `https://unavatar.io/${domain}?fallback=false`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source, {
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "NEUX-Lab-Logo-Fetcher/1.0" }
      });
      if (!response.ok) continue;

      const type = response.headers.get("content-type") || "";
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 48) continue;

      return { buffer, ext: extFromType(type), source };
    } catch {
      continue;
    }
  }

  return null;
}

async function runPool(items, worker, concurrency = 10) {
  const results = new Array(items.length);
  let index = 0;

  async function next() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => next()));
  return results;
}

fs.mkdirSync(logoDir, { recursive: true });

const targets = data.providers.filter((p) => p.id !== "custom");
console.log(`Syncing lab logos for ${targets.length} providers...`);

let copied = 0;
let saved = 0;
let skipped = 0;
let failed = 0;

await runPool(targets, async (provider) => {
  const key = provider.id;
  let outName = findExistingLabFile(key);

  if (!outName) {
    const src = resolveSourcePath(provider);
    if (src) {
      outName = copyToLabFile(key, src);
      if (outName) {
        copied += 1;
        process.stdout.write("c");
      }
    }
  }

  if (!outName) {
    const domain = provider.iconDomain;
    if (!domain) {
      failed += 1;
      process.stdout.write("x");
      return;
    }

    const logo = await fetchLogo(domain);
    if (!logo) {
      failed += 1;
      process.stdout.write(".");
      return;
    }

    outName = `lab-${key}${logo.ext}`;
    fs.writeFileSync(path.join(logoDir, outName), logo.buffer);
    saved += 1;
    process.stdout.write("+");
  } else if (!copied) {
    skipped += 1;
    process.stdout.write("s");
  }

  if (outName) {
    manifest[key] = outName;
    provider.logo = `assets/logos/${outName}`;
  }
});

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

data.version = Math.max(data.version || 0, 7) + 1;
fs.writeFileSync(providersPath, `${JSON.stringify(data, null, 2)}\n`);

const stats = { local: 0, domainOnly: 0, none: 0 };
for (const provider of targets) {
  const file = manifest[provider.id];
  const hasLocal = file && fs.existsSync(path.join(logoDir, file));
  if (hasLocal && provider.logo?.includes(`lab-${provider.id}`)) stats.local += 1;
  else if (provider.iconDomain) stats.domainOnly += 1;
  else stats.none += 1;
}

console.log(
  `\nDone: ${copied} copied, ${saved} fetched, ${skipped} existing, ${failed} failed.`
);
console.log(`Coverage: ${stats.local} lab-local, ${stats.domainOnly} domain-fallback, ${stats.none} no icon.`);
