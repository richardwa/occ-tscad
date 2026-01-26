import { hbox, vbox, Signal, signal, BaseNode } from "solid-vanilla";
import { Button, TextArea } from "../base";

export const CodePad = (shapeFileContents: Signal<string | undefined>) =>
  TextArea(shapeFileContents)
    .attr("cols", "90")
    .css("height", "100%")
    .css("flex-grow", "1")
    .css("font-size", "small");
