import { mkdir, cp, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const files = [
  "index.html",
  "menu.html",
  "about.html",
  "contacts.html",
  "css",
  "js",
  "data",
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const name of files) {
  await cp(join(root, name), join(dist, name), { recursive: true });
}

console.log("built dist/");
