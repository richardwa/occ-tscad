import { div, hbox } from "../lib";
import { fileList } from "./filelist";
import { initOCC } from "./occ";
import { router } from "./routes";

export const App = () =>
  div()
    .css("padding", "0.5rem")
    .do(async (node) => {
      await initOCC();
      node.inner(hbox().inner(fileList(), router.getRoot()));
    });
