import { hbox, signal, Signal } from "solid-vanilla";
import { loadModelFile, FileList, ModelViewer } from "occ-tscad-base";
import { router } from "../routes";

export const ModelView = (file: Signal<string | undefined>) => {
  const shapeFileContents = signal<string>();
  const fileList = signal<string[]>([]);
  const onFileClick = (file: string) => {
    router.navigate(`/file-browser/${file}`);
  };

  const getFileList = async () => {
    const resp = await fetch("/models");
    const json = await resp.json();
    fileList.set(json);
  };
  getFileList();

  return hbox()
    .css("flex-grow", "1")
    .watch(file, async () => {
      const f = file.get();
      if (f == null || f === "") return;
      let contents = await loadModelFile(f);
      shapeFileContents.set(contents);
    })
    .inner(
      FileList(fileList, onFileClick),
      ModelViewer(file, shapeFileContents),
    );
};
