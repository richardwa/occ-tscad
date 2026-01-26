import { hbox, fragment, h, vbox, div, signal, RNode } from "solid-vanilla";
import { ClickLink, Title } from "../base";
import { router } from "../routes";

// @ts-ignore
const models = import.meta.glob("../../public/models/**/*.ts");

const getFiles = async (): Promise<string[]> => {
  try {
    // try to get directory listing
    const resp = await fetch("/models");
    return await resp.json();
  } catch {
    // fallback to statically defined list of files (for vite and github pages)
    return Object.keys(models).map((file) =>
      file.substring("../../public/models/".length),
    );
  }
};

export const FileList = (baseRoute: string) => {
  const loadFileList = async (node: RNode) => {
    const files = await getFiles();
    const list = files.sort().map((file) => {
      return ClickLink()
        .on("click", () => router.navigate(`${baseRoute}/${file}`))
        .inner(file);
    });
    node.inner(...list);
  };

  return vbox()
    .css("border-right", "1px solid gray")
    .css("min-width", "10rem")
    .inner(
      hbox()
        .css("border-bottom", "1px solid gray")
        .css("height", "calc(26px + .25rem)")
        .css("align-items", "center")
        .inner(Title("files")),
      vbox().css("padding-right", ".25rem").do(loadFileList),
    );
};
