import { Router, div, hbox, grid, fragment } from "solid-vanilla";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";
import { CodePad } from "./codepad";

const router = new Router("occ-tscad");

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) =>
  hbox()
    .css("flex-grow", "1")
    .inner(CodePad(params.file), ModelViewer(params.file)),
);
export { router };
