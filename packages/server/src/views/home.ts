import { vbox, signal } from "solid-vanilla";
import { ClickLink, FileList } from "../base";
import { router } from "../routes";

export const Home = () => {
  const fileList = signal<string[]>([]);
  const onFileClick = (file: string) => {
    router.navigate(`/file-browser/${file}`);
  };

  const getFileList = async () => {
    const resp = await fetch("/fileList.json");
    const json = await resp.json();
    fileList.set(json);
  };
  getFileList();
  return vbox()
    .cn("home")
    .css("gap", "1rem")
    .css("height", "100%")
    .inner(FileList(fileList, onFileClick));
};
