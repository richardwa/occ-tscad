import fs from "node:fs/promises";
import initOpenCascade from "opencascade.js/dist/node.js";

// Obliterate the browser-style WASM loader that opencascade.full.js uses
globalThis.fetch = async (url, opts) => {
  // If it’s a local file path, load via Node FS
  if (typeof url === "string" && !url.startsWith("http")) {
    const data = await fs.readFile(url);
    return new Response(data);
  }

  // Otherwise, real HTTP
  return fetch(url, opts);
};

const oc = await initOpenCascade();
console.log("loaded!");
