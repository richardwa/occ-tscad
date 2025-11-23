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
  })();

  return vbox(
    hbox(
      Button()
        .on("click", async () => {
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
        })
        .inner("Render"),
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
