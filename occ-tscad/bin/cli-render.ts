#!/usr/bin/env bun

import fs from "fs/promises";
import path from "path";
import { initOCC } from "../src/occ";
import {
  renderToGLB,
  stlToObj,
  renderToSTL,
  renderToStep,
} from "../src/render";

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

const renderFile = async (file: string) => {
  const oc = await initOCC();
  console.log("occ loaded!");

  const modulePath = path.resolve(process.cwd(), file);
  const filename = path.parse(file).name;
  const { main } = await import(modulePath);
  if (!main) {
    throw "file must export {main:Shape3}";
  }

  const shape = main().shape;
  let buffer, realPath;

  buffer = renderToSTL(shape);
  realPath = `./target/${filename}.stl`;
  await fs.writeFile(realPath, Buffer.from(buffer));
  console.log("file saved to:", realPath);

  buffer = stlToObj(buffer);
  realPath = `./target/${filename}.obj`;
  await fs.writeFile(realPath, Buffer.from(buffer));
  console.log("file saved to:", realPath);

  buffer = renderToGLB(shape);
  realPath = `./target/${filename}.glb`;
  await fs.writeFile(realPath, Buffer.from(buffer));
  console.log("file saved to:", realPath);

  buffer = renderToStep(shape);
  realPath = `./target/${filename}.step`;
  await fs.writeFile(realPath, Buffer.from(buffer));
  console.log("file saved to:", realPath);
};
const file = process.argv[2] ?? "public/models/sample.ts";
console.log(file);
renderFile(file);
