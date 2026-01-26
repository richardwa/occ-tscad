import { hbox, vbox, Signal, signal, BaseNode } from "solid-vanilla";
import { Button, TextArea } from "../base";

export const CodePad = (shapeFileContents: Signal<string | undefined>) =>
  TextArea(shapeFileContents)
    .css("width", "40rem")
    .css("height", "100%")
    .css("flex-grow", "1");
