import { Router, div, hbox } from "../lib";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";
import { CodePad } from "./codepad";

const router = new Router();

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) =>
  hbox(ModelViewer(), CodePad(params.file)),
);

export { router };
