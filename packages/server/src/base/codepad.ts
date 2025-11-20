import { hbox, vbox, Signal } from "solid-vanilla";
import { Button, TextArea } from "./components";

export const CodePad = (shapeFileContents: Signal<string | undefined>) => {
  return vbox().inner(
    hbox().inner(
      Button()
        .on("click", () => shapeFileContents.trigger())
        .inner("Render"),
    ),
    TextArea(shapeFileContents)
      .css("width", "40rem")
      .css("height", "100%")
      .css("flex-grow", "1"),
  );
};
