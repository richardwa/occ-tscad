import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  publicDir: path.resolve(__dirname, "public"),
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
  optimizeDeps: {
    exclude: ["opencascade.js"],
  },
  assetsInclude: ["**/*.wasm"],
});
