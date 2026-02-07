import path from "path";
import fs from "fs/promises";

async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listFiles(full);
      }
      return full;
    }),
  ).then((files) => files.flat());
}

export const lsDirectory = (dirRoot: string, contextPath: string) => ({
  name: "async-file-list-endpoint",
  configureServer(server) {
    server.middlewares.use(contextPath, async (_req, res) => {
      try {
        console.log("listFiles", dirRoot, contextPath);
        const files = await listFiles(dirRoot);
        const removeBase = files.map((f) =>
          f.substring(dirRoot.length + 1).replaceAll("\\", "/"),
        );
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(removeBase));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Failed to read files",
          }),
        );
      }
    });
  },
});
