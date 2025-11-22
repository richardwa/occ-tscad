import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, NumberInput, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { shapeToGLB, glbToStlUrl, glbToObjUrl } from "./shapeToUrl";
import { setExtension } from "../../common/util";
import { getOCC } from "./occ";
import "@google/model-viewer";

// @ts-ignore
const modules = import.meta.glob("../../../models/*");

export const ModelViewer = (file: string) => {
  const modelUrl = signal<string>();
  const downloadButton = Button("loading...");

  return div(
    downloadButton,
    h("model-viewer")
      .attr("camera-controls")
      .attr("interaction-prompt", "none")
      .attr("camera-orbit", "45deg 75deg auto")
      .watch(modelUrl, (node) => {
        node.attr("src", modelUrl.get());
      }),
  ).do(async (node) => {
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
    modelUrl.set(url);
    downloadButton.inner("Download").on("click", async () => {
      const stlUrl = await glbToObjUrl(url);
      downloadBinaryFile(stlUrl, setExtension(file, "obj"));
    });
  });
};
