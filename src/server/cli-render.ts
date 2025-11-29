import fsp from "node:fs/promises";
import path from "path";
import { initOCC } from "../common/csg/occ";
import fs from "fs";

// Obliterate the browser-style WASM loader that opencascade.full.js uses
globalThis.fetch = async (url, opts) => {
  // If it’s a local file path, load via Node FS
  if (typeof url === "string" && !url.startsWith("http")) {
    const data = await fsp.readFile(url);
    return new Response(data);
  }

  // Otherwise, real HTTP
  return fetch(url, opts);
};

const renderFile = async (file: string) => {
  const oc = await initOCC();
  console.log("loaded!");

  const modulePath = path.resolve(process.cwd(), file);

  const { main } = await import(modulePath);
  if (!main) {
    throw "file must export {main:Shape3}";
  }

  const shape = main().shape;
  const writer = new oc.STEPControl_Writer_1();
  const statusTransfer = writer.Transfer(
    shape,
    oc.STEPControl_StepModelType.STEPControl_AsIs as any,
    true,
    new oc.Message_ProgressRange_1(),
  );
  //console.log("Transfer status:", statusTransfer);
  const wasmPath = "output.step";
  const writeStatus = writer.Write(wasmPath); // in-memory
  // console.log("Write Status", writeStatus);
  const stepBytes = oc.FS.readFile(wasmPath); // Uint8Array

  // Save to real filesystem
  const realPath = "./output.step";
  fs.writeFileSync(realPath, Buffer.from(stepBytes));
  console.log("STEP file saved to:", realPath);
};
const file = process.argv[2] ?? "public/models/sample.ts";
console.log(file);
renderFile(file);
