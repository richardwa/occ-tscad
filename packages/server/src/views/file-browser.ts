import { hbox, signal, Signal, div } from "solid-vanilla";
import { ModelViewer, CheckBox, Button } from "../base";
import { router } from "../routes";

export const FileBrowser = (file: Signal<string | undefined>) => {
  const live = signal<boolean>(true).persistAs("LIVE_MODEL_VIEW");

  setInterval(() => {
    console.log("trigger", live.get());
    if (live.get()) {
      file.trigger();
    }
  }, 10_000);

  return hbox()
    .cn("file-browser")
    .css("height", "100%")
    .inner(
      ModelViewer(
        file,
        div().css("flex-grow", "1"),
        div()
          .css("display", "flex")
          .css("align-items", "center")
          .inner(CheckBox(live), div().inner("live")),
        Button()
          .on("click", () => file.trigger())
          .inner("Reload"),
        Button()
          .on("click", () => router.navigate("/"))
          .inner("Change File"),
      ),
    );
};
