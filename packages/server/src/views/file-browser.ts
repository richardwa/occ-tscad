import { hbox, signal, Signal, div } from "solid-vanilla";
import { loadModelFile, ModelViewer, CheckBox, Button } from "../base";
import { router } from "../routes";

export const ModelView = (file: Signal<string | undefined>) => {
  const shapeFileContents = signal<string>();
  const live = signal<boolean>(true).persistAs("LIVE_MODEL_VIEW");

  const loadFile = async () => {
    const f = file.get();
    if (f == null || f === "") return;
    let contents = await loadModelFile(f);
    shapeFileContents.set(contents);
  };
  setInterval(() => {
    if (live.get()) {
      loadFile();
    }
  }, 10_000);

  return hbox()
    .css("flex-grow", "1")
    .watch(file, loadFile)
    .inner(
      ModelViewer(
        file,
        shapeFileContents,
        div().css("flex-grow", "1"),
        div()
          .css("display", "flex")
          .css("align-items", "center")
          .inner(CheckBox(live), div().inner("live")),
        Button().on("click", loadFile).inner("Reload"),
        Button()
          .on("click", () => router.navigate("/"))
          .inner("Change File"),
      ),
    );
};
