import { hbox, vbox, div, fragment, grid } from "solid-vanilla";
import { Button, NumberInput, Title } from "./components";
import { signal, h } from "solid-vanilla";
import { renderToSTL, stlToObj, renderToGLB } from "../common/csg/render";
import { setExtension } from "../common/util";
import "@google/model-viewer";
import { modelShape } from "./model-store";
import { downloadBinaryFile } from "./util";

export const ModelViewer = (file: string) => {
  const initialDirection = signal("45deg auto auto");

  return vbox()
    .css("flex-grow", "1")
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
        .watch(modelShape, async (node) => {
          const model = modelShape.get();
          if (!model) return;
          const { Shape3 } = await import("../common/csg/shape3");
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
