import { hbox, vbox, Signal, signal, h, div, BaseNode } from "solid-vanilla";
import {
  downloadBinaryFile,
  setExtension,
  getModelShape,
  formatDate,
} from "./util";
import { Button } from "./components";
import {
  initOCC,
  getOCCNullable,
  renderToGLB,
  renderToSTL,
  stlToObj,
  Shape3,
} from "occ-tscad";

import "@google/model-viewer";

export const ModelViewer = (
  file: Signal<string | undefined>,
  ...buttons: BaseNode[]
) => {
  const initialDirection = signal("45deg auto auto");
  const errorMessage = hbox()
    .css("color", "red")
    .css("align-items", "center")
    .css("flex-grow", "1")
    .css("padding", ".25rem");

  return vbox()
    .cn("model-viewer")
    .css("flex-grow", "1")
    .inner(
      hbox().inner(
        Button()
          .on("click", () => initialDirection.trigger())
          .inner("Reset View"),
        Button()
          .on("click", async () => {
            if (getOCCNullable() == null) {
              await initOCC();
            }
            const model = await getModelShape(file.get());
            const stlBuffer = renderToSTL(model.shape);
            const objBuffer = stlToObj(stlBuffer);
            const url = URL.createObjectURL(
              // @ts-ignore
              new Blob([objBuffer.buffer], { type: "text/plain" }),
            );
            downloadBinaryFile(
              url,
              setExtension(file.get() ?? "shape.ts", "obj"),
            );
          })
          .inner("Download Obj"),
        ...buttons,
      ),
      hbox().inner(
        errorMessage,
        hbox()
          .css("align-items", "center")
          .watch(
            file,
            (node) => {
              node.inner(file.get());
            },
            true,
          ),
      ),
      h("model-viewer")
        .attr("camera-controls")
        .attr("interaction-prompt", "none")
        .attr("camera-orbit", initialDirection)
        .css("height", "100%")
        .css("width", "100%")
        .watch(file, async (node) => {
          try {
            if (getOCCNullable() == null) {
              errorMessage.inner("loading Opencascade ...");
              await initOCC();
            }
            errorMessage.inner("loading model ...");
            const model = await getModelShape(file.get());
            const oc = await initOCC();
            const rotate = new Shape3(model.shape, oc);
            rotate.rotateY(-90);
            rotate.rotateZ(-90);
            const glbFile = renderToGLB(rotate.shape);
            const url = URL.createObjectURL(
              // @ts-ignore
              new Blob([glbFile.buffer], { type: "model/gltf-binary" }),
            );
            // @ts-ignore
            node.el.src = url;
            errorMessage.inner("");
          } catch (e: any) {
            const err = e.name ?? `Render Error: ${e}`;
            errorMessage.inner(`${formatDate()} ${err}`);
            console.error(e);
          }
        }),
    );
};
