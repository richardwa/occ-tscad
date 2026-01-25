import { hbox, vbox, Signal, signal } from "solid-vanilla";
import { Button, TextArea } from "../base";

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
