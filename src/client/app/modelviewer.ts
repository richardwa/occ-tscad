import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, NumberInput, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { shapeToGLB, glbToStlUrl, glbToObjUrl } from "./shapeToUrl";
import { setExtension } from "../../common/util";
import { getOCC } from "./occ";
import "@google/model-viewer";
import { modelUrl } from "./model-store";

export const ModelViewer = () => {
  const initialCameraDirection = "45deg 75deg auto";
  const resetSignal = signal(Symbol());

  return vbox(
    h("model-viewer")
      .attr("camera-controls")
      .attr("interaction-prompt", "none")
      .watch(resetSignal, (node) =>
        node.attr("camera-orbit", initialCameraDirection),
      )
      .watch(modelUrl, (node) => {
        node.attr("src", modelUrl.get());
      }),
    hbox(Button().on("click", () => resetSignal.set(Symbol()))).inner(
      "Reset View",
    ),
  );
};
