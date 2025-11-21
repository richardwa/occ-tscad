import { fragment, h, vbox, div } from "../lib";
import { fetchJson } from "../../common/interface";
import { ClickLink, Title } from "./components";
import { router } from "./routes";

export const fileList = () =>
  vbox()
    .css("border-right", "1px solid gray")
    .css("min-height", "100vh")
    .inner(
      div()
        .css("border-bottom", "1px solid gray")
        .inner(
          Title("models")
            .css("text-align", "center")
            .css("margin", "0.25rem 0"),
        ),
      vbox()
        .css("padding", ".25rem")
        .do(async (node) => {
          const files = await fetchJson("listFiles");
          node.inner(
            ...files.map((file) =>
              ClickLink(file).on("click", () =>
                router.navigate(`/model-viewer/${file}`),
              ),
            ),
          );
        }),
    );
