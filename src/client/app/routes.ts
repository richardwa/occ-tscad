import { Router, div } from "../lib";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";

const router = new Router();

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) => ModelViewer(params.file));

export { router };
