import { Router, div } from "../lib";
import { ModelViewer } from "./modelviewer";

const router = new Router();

router.addRoute("/", () => div("Select File"));
router.addRoute("/model-viewer/:file", (params) => ModelViewer(params.file));

export { router };
