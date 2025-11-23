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
  const blob = new Blob([code], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);

  try {
    return await import(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const CodePad = (file: string) => {
  const fileContents = signal("");

  (async () => {
    const resp = await fetch(`/models/${file}`);
    const contents = await resp.text();
    fileContents.set(contents);

    /*
     
    const oc = getOCC();
    const path = `../../../models/${file}`;
    const loader = modules[path];
    if (!loader) {
      node.inner(Title("import failed"));
      return;
    }
    const { main } = await loader();
    if (!main) {
      node.inner(Title(`${file} does not export { main: Shape3 }`));
      return;
    }

    const result = main(oc);
    const url = shapeToGLB(oc, result.shape);
     */
  })();

  return vbox(
    hbox(
      Button("Render").on("click", async () => {
        const url = modelUrl.get();
        if (url) {
          const stlUrl = await glbToObjUrl(url);
          downloadBinaryFile(stlUrl, setExtension(file, "obj"));
        }
      }),
    ),
    TextArea(fileContents),
  );
};
