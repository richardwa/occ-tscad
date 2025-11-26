import { div, hbox, fragment, grid } from "../lib";
import { fileList } from "./filelist";
import { initOCC } from "./occ";
import { router } from "./routes";

export const App = () =>
  hbox()
    .css("padding", "0.5rem")
    .do(async (node) => {
      await initOCC();
      node.inner(fileList(), router.getRoot());
    });
