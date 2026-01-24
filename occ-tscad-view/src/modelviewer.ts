import { hbox, vbox, div, fragment, grid } from "solid-vanilla";
import { Button, NumberInput, Title } from "./components";
import { signal, h } from "solid-vanilla";
import { renderToSTL, stlToObj, renderToGLB } from "occ-tscad";
import { modelShape } from "./model-store";
import { downloadBinaryFile, setExtension } from "./util";
import "@google/model-viewer";

export const ModelViewer = (file: string) => {
  const initialDirection = signal("45deg auto auto");

  return vbox()
    .css("flex-grow", "1")
    .css("min-height", "calc(-1rem + 100vh)")
    .inner(
      hbox().inner(
        Button()
          .on("click", () => initialDirection.trigger())
          .inner("Reset View"),
        Button()
          .on("click", async () => {
            const model = modelShape.get();
            if (!model) return;
            const stlBuffer = renderToSTL(model.shape);
            const objBuffer = stlToObj(stlBuffer);
            const url = URL.createObjectURL(
              // @ts-ignore
              new Blob([objBuffer.buffer], { type: "text/plain" }),
            );
            downloadBinaryFile(url, setExtension(file, "obj"));
          })
          .inner("Download Obj"),
      ),
      h("model-viewer")
        .attr("camera-controls")
        .attr("interaction-prompt", "none")
        .attr("camera-orbit", initialDirection)
        .css("height", "100%")
        .css("width", "100%")
        .watch(modelShape, async (node) => {
          const model = modelShape.get();
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
        }),
    );
};
