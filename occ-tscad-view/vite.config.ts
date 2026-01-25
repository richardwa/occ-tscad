import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5177,
    host: true,
    allowedHosts: true,
    strictPort: true,
  },
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ["opencascade.js"],
  },
  assetsInclude: ["**/*.wasm"],
});
