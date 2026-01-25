import { hbox, signal, Signal } from "solid-vanilla";
import { ModelViewer } from "../components/modelviewer";
import { CodePad } from "../components/codepad";
import { FileList } from "../components/filelist";
import { loadModelFile } from "../base/util";

export const IDEView = (file: Signal<string | undefined>) => {
  const shapeFileContents = signal<string>();
  return hbox()
    .css("flex-grow", "1")
    .watch(file, async () => {
      const f = file.get();
      if (f == null || f === "/") return;
      let contents = await loadModelFile(f);
      shapeFileContents.set(contents);
    })
    .inner(
      FileList("/ide-view"),
      CodePad(shapeFileContents),
      ModelViewer(file, shapeFileContents),
    );
};
