import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const extract = path.join(root, "scripts", "extract-catalog.mjs");

const result = spawnSync(process.execPath, [extract], { stdio: "inherit" });
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("Build complete: data/catalog.json");
