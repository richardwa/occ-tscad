import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, TextArea, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { modelUrl } from "./model-store";
import { shapeToGLB, glbToStlUrl, glbToObjUrl } from "./shapeToUrl";
import { setExtension } from "../../common/util";
import { getOCC } from "./occ";
import "@google/model-viewer";

// @ts-ignore
const modules = import.meta.glob("../../../public/models/*");

async function evalModule(code: string) {
  const rewrite = rewriteImports(code);
  const blob = new Blob([rewrite], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);

  try {
    return await import(/* @vite-ignore */ url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function normalizePath(path: string) {
  const segments = path.split("/");
  const out = [];

  for (const segment of segments) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") out.pop();
    else out.push(segment);
  }
  return "/" + out.join("/");
}

function rewriteImports(code: string) {
  return code.replace(
    /import\s+([^'"]*?)['"]([^'"]+)['"]/g,
    (full, clause, spec) => {
      // Ignore non-JS imports (http, https, data:, etc.)
      if (/^(https?:|data:|blob:)/.test(spec)) {
        return full;
      }

      let path = spec;

      // Normalize relative paths into absolute paths
      if (path.startsWith(".")) {
        // Convert relative → absolute using the page's base
        const base = new URL(".", window.location.href).pathname;
        path = normalizePath(base + path);
      }

      // Only rewrite imports that target /src/
      if (path.includes("/src/") === false) {
        return full;
      }

      const url = `${window.location.origin}${path}`;
      return `import ${clause}"${url}"`;
    },
  );
}

export const CodePad = (file: string) => {
  const fileContents = signal("");
  const renderContents = async () => {
    const contents = fileContents.get();
    const { main } = await evalModule(contents);
    if (!main) {
      console.log(`${file} does not export { main: Shape3 }`);
      return;
    }
    const oc = getOCC();
    const result = main(oc);
    const url = shapeToGLB(oc, result.shape);
    modelUrl.set(url);
  };

  (async () => {
    const resp = await fetch(`/models/${file}`);
    const contents = await resp.text();
    fileContents.set(contents);
    renderContents();
  })();

  return vbox(
    hbox(
      Button().on("click", renderContents).inner("Render"),
      Button()
        .on("click", async () => {
          const url = modelUrl.get();
          if (url) {
            const stlUrl = await glbToObjUrl(url);
            downloadBinaryFile(stlUrl, setExtension(file, "obj"));
          }
        })
        .inner("Download Obj"),
    ),
    TextArea(fileContents).css("width", "600px").css("height", "500px"),
  );
};
