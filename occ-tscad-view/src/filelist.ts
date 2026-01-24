import { fragment, h, vbox, div, signal, RNode } from "solid-vanilla";
import { ClickLink, Title } from "./components";
import { router } from "./routes";

// @ts-ignore
const models = import.meta.glob("../public/models/**/*.ts", { eager: true });

const getFiles = async (): Promise<string[]> => {
  try {
    // try to get directory listing
    const resp = await fetch("/models");
    return await resp.json();
  } catch {
    // fallback to statically defined list of files (for vite and github pages)
    return Object.keys(models).map((file) =>
      file.substring("../public/models/".length),
    );
  }
};

export const fileList = () => {
  const loadFileList = async (node: RNode) => {
    const files = await getFiles();
    const list = files.sort().map((file) => {
      return ClickLink()
        .on("click", () => router.navigate(`/model-viewer/${file}`))
        .inner(file);
    });
    node.inner(...list);
  };

  return vbox()
    .css("border-right", "1px solid gray")
    .css("min-height", "calc(100vh - 1rem)")
    .css("min-width", "10rem")
    .inner(
      div()
        .css("border-bottom", "1px solid gray")
        .css("height", "calc(26px + .25rem)")
        .inner(Title("models")),
      vbox().css("padding-right", ".25rem").do(loadFileList),
    );
};
