#!/usr/bin/env bun

import express, { Request, Response } from "express";
import path from "path";
import { serveIndexJson } from "./serveIndexJson";

const app = express();
const port = process.env.PORT || 5177;

// Get folder from command line argument
const modelsFolder = process.argv[2];
if (!modelsFolder) {
  console.error("Usage: bun server.ts <folder-to-serve>");
  process.exit(1);
}

app.get("/models", serveIndexJson(modelsFolder));
app.use("/models", express.static(path.join(process.cwd(), modelsFolder)));

// Serve frontend from built client
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
