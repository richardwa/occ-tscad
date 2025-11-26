import { fragment, h, vbox, div, signal, RNode } from "../lib";
import { fetchJson } from "../../common/interface";
import { ClickLink, Title } from "./components";
import { router } from "./routes";

export const fileList = () => {
  const fetchPromise = fetchJson("listFiles");

  const loadFileList = async (node: RNode) => {
    const files = await fetchPromise;
    const list = files.sort().map((file) =>
      ClickLink()
        .on("click", () => router.navigate(`/model-viewer/${file}`))
        .inner(file),
    );
    node.inner(...list);
  };

  return vbox()
    .css("border-right", "1px solid gray")
    .css("min-height", "100vh")
    .inner(
      div().css("border-bottom", "1px solid gray").inner(Title("models")),
      vbox().css("padding-right", ".25rem").do(loadFileList),
    );
};
