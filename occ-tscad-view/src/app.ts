import { div, hbox, fragment, grid } from "solid-vanilla";
import { fileList } from "./filelist";
import { initOCC } from "occ-tscad";
import { router } from "./routes";

export const App = () =>
  hbox()
    .css("padding", "0.5rem")
    .do(async (node) => {
      await initOCC();
      node.inner(
        fileList(),
        div().css("flex-grow", "1").inner(router.getRoot()),
      );
    });
