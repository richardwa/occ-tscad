import path from "path";
import { defineConfig, ViteDevServer } from "vite";
import express from "express";
import { serveIndexJson } from "./bin/serveIndexJson";

const expressPlugin = () => ({
  name: "vite-plugin-express",
  configureServer(server: ViteDevServer) {
    const app = express();
    const modelsFolder = path.resolve(__dirname, "models");
    app.get("/models", serveIndexJson(modelsFolder));
    app.use("/models", express.static(path.join(process.cwd(), modelsFolder)));
    server.middlewares.use(app);
  },
});

export default defineConfig({
  base: "./",
  server: {
    port: 5177,
    host: true,
    allowedHosts: true,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  plugins: [expressPlugin()],
  optimizeDeps: {
    exclude: ["opencascade.js"],
  },
  assetsInclude: ["**/*.wasm"],
});
