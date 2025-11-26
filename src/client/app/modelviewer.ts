import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, NumberInput, Title } from "./components";
import { signal, h } from "../lib";
import "@google/model-viewer";
import { modelUrl } from "./model-store";

export const ModelViewer = () => {
  const initialDirection = signal("45deg 75deg auto");

  return vbox().inner(
    hbox().inner(
      Button()
        .on("click", () => initialDirection.trigger())
        .inner("Reset View"),
    ),
    h("model-viewer")
      .attr("camera-controls")
      .attr("interaction-prompt", "none")
      .attr("camera-orbit", initialDirection)
      // .attr("src", modelUrl)
      .css("height","100%"),
  );
};
