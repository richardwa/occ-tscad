import { hbox, signal, vbox, Signal } from "solid-vanilla";
import { ModelViewer, CodePad, loadModelFile, FileList } from "occ-tscad-base";
import { router } from "../routes";

const modelRoot = "../../public/models/";
// @ts-ignore
const models = import.meta.glob("../../public/models/**/*.ts");

export const IDEView = (file: Signal<string | undefined>) => {
  const shapeFileContents = signal<string>();
  const fileList = signal<string[]>(
    Object.keys(models).map((f) => f.substring(modelRoot.length)),
  );
  const onFileClick = (file: string) => {
    router.navigate(`/live-editor/${file}`);
  };

  return hbox()
    .css("flex-grow", "1")
    .watch(file, async () => {
      const f = file.get();
      if (f == null || f === "/" || f === "") return;
      let contents = await loadModelFile(f);
      shapeFileContents.set(contents);
    })
    .inner(
      FileList(fileList, onFileClick),
      CodePad(shapeFileContents),
      ModelViewer(file, shapeFileContents),
    );
};
