import path from "path";
import { defineConfig, ViteDevServer } from "vite";
import { lsDirectory } from "./vite.ls-directory.plugin";

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
  plugins: [lsDirectory(path.resolve(__dirname, "models"), "/filelist.json")],
  optimizeDeps: {
    exclude: ["opencascade.js"],
  },
  assetsInclude: ["**/*.wasm"],
});
