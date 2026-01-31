import { hbox, vbox, Signal, signal, h, div, BaseNode } from "solid-vanilla";
import {
  downloadBinaryFile,
  setExtension,
  getModelShape,
  formatDate,
} from "./util";
import { Button } from "./components";

import "@google/model-viewer";

export const ModelViewer = (
  file: Signal<string | undefined>,
  shapeFileContents: Signal<string | undefined>,
  ...buttons: BaseNode[]
) => {
  const initialDirection = signal("45deg auto auto");
  const errorMessage = hbox()
    .css("color", "red")
    .css("align-items", "center")
    .css("flex-grow", "1")
    .css("padding", ".25rem");

  return vbox()
    .css("flex-grow", "1")
    .inner(
      hbox().inner(
        Button()
          .on("click", () => initialDirection.trigger())
          .inner("Reset View"),
        Button()
          .on("click", async () => {
            const contents = shapeFileContents.get();
            if (contents == null) return;
            const { renderToSTL, stlToObj, renderToGLB } =
              await import("occ-tscad");

            const model = await getModelShape(contents);
            if (!model) return;
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
        .watch(shapeFileContents, async (node) => {
          const contents = shapeFileContents.get();
          if (contents == null) return;
          const { renderToSTL, stlToObj, renderToGLB } =
            await import("occ-tscad");
          try {
            const model = await getModelShape(contents);
            if (!model) return;
            const { Shape3 } = await import("occ-tscad");
            const rotate = new Shape3(model.shape);
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

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.decline();
}
