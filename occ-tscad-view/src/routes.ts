import { HashRouter, hbox } from "solid-vanilla";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";
import { CodePad } from "./codepad";

const router = new HashRouter();

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) => {
  console.log(params);
  return hbox()
    .css("flex-grow", "1")
    .inner(CodePad(params.file), ModelViewer(params.file));
});
export { router };
