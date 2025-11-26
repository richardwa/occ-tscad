import { Router, div, hbox, grid, fragment } from "../lib";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";
import { CodePad } from "./codepad";

const router = new Router();

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) =>
  hbox().css("flex-grow","1").inner(ModelViewer(params.file), CodePad(params.file)),
);

export { router };
