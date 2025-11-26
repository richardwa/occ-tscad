import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, NumberInput, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { shapeToGLB, glbToStlUrl, glbToObjUrl } from "./shapeToUrl";
import { setExtension } from "../../common/util";
import "@google/model-viewer";
import { modelUrl } from "./model-store";

export const ModelViewer = (file: string) => {
  const initialDirection = signal("45deg 75deg auto");

  return vbox().css("flex-grow","1").inner(
    hbox().inner(
      Button()
        .on("click", () => initialDirection.trigger())
        .inner("Reset View"),
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
    h("model-viewer")
      .attr("camera-controls")
      .attr("interaction-prompt", "none")
      .attr("camera-orbit", initialDirection)
      .attr("src", modelUrl)
      .css("height", "100%").css("width","100%"),
  );
};
