import { div, hbox } from "../lib";
import { Title } from "./components";
import { fileList } from "./filelist";
import { initOCC } from "./occ";
import { router } from "./routes";

export const App = () =>
  div()
    .css("padding", "0.5rem")
    .do(async (node) => {
      await initOCC();
      node.inner(hbox(fileList(), router.getRoot()));
    });
