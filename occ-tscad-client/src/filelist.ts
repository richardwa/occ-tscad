import { fragment, h, vbox, div, signal, RNode } from "solid-vanilla";
import { ClickLink, Title } from "./components";
import { router } from "./routes";

// @ts-ignore
const models = import.meta.glob("../public/models/*.ts", { eager: true });

export const fileList = () => {
  const loadFileList = async (node: RNode) => {
    const list = Object.keys(models)
      .sort()
      .map((filePath) => {
        const file = filePath.split("/").pop();
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
