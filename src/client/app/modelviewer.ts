import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, NumberInput, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { renderToSTL, stlToObj, renderToGLB } from "../../common/csg/render";
import { setExtension } from "../../common/util";
import "@google/model-viewer";
import { modelShape } from "./model-store";

export const ModelViewer = (file: string) => {
  const initialDirection = signal("45deg 75deg auto");

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
        .attr("src", () => {
          const model = modelShape.get();
          if (!model) return;
          const glbFile = renderToGLB(model.shape);
          const url = URL.createObjectURL(
            // @ts-ignore
            new Blob([glbFile.buffer], { type: "model/gltf-binary" }),
          );
          return url;
        })
        .css("height", "100%")
        .css("width", "100%"),
    );
};
