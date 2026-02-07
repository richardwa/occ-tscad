import { hbox, signal, Signal, div } from "solid-vanilla";
import { ModelViewer, CheckBox, Button } from "../base";
import { router } from "../routes";

export const FileBrowser = (file: Signal<string | undefined>) => {
  return hbox()
    .cn("file-browser")
    .css("height", "100%")
    .inner(
      ModelViewer(
        file,
        div().css("flex-grow", "1"),
        Button()
          .on("click", () => router.navigate("/"))
          .inner("Change File"),
      ),
    );
};
