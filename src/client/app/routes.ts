import { Router, div, hbox, grid } from "../lib";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";
import { CodePad } from "./codepad";

const router = new Router();

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) =>
  grid("1fr 1fr")
    .css("gap", "0.25rem")
    .css("height", "100%")
    .css("width", "100%")
    .inner(CodePad(params.file), ModelViewer()),
);

export { router };
