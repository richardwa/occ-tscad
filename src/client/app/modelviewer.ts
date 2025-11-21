import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { ClickLink, NumberInput, Title } from "./components";
import { signal, h } from "../lib";
import shapeToUrl from "./shapeToUrl";
import initOpenCascade from "opencascade.js";
import "@google/model-viewer";
// @ts-ignore
const modules = import.meta.glob("../../../models/*");
const ocLoaded = initOpenCascade();

export const ModelViewer = (file: string) => {
  const modelUrl = signal<string>();

  return div(
    div().watch(modelUrl, (node) => {
      node.inner(modelUrl.get() ? "" : "loading...");
    }),
    h("model-viewer")
      .attr("camera-controls")
      .watch(modelUrl, (node) => {
        node.attr("src", modelUrl.get());
      }),
  ).do(async (node) => {
    const oc = await ocLoaded;
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
    modelUrl.set(shapeToUrl(oc, result));
  });
};
