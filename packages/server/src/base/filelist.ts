import {
  hbox,
  fragment,
  h,
  vbox,
  div,
  signal,
  RNode,
  Signal,
} from "solid-vanilla";
import { ClickLink, Title } from "./components";

export const FileList = (
  files: Signal<string[]>,
  onClick: (file: string) => void,
) => {
  return vbox()
    .css("border-right", "1px solid gray")
    .css("min-width", "10rem")
    .inner(
      hbox()
        .css("border-bottom", "1px solid gray")
        .css("height", "calc(26px + .25rem)")
        .css("align-items", "center")
        .inner(Title("files")),
      vbox()
        .css("padding-right", ".25rem")
        .watch(files, (node) => {
          console.log(files);
          const list = files
            .get()
            .sort()
            .map((file) => {
              return ClickLink()
                .on("click", () => onClick(file))
                .inner(file);
            });
          node.inner(...list);
        }),
    );
};
