import { Router } from "../lib";
import { ModelViewer } from "./modelviewer";

const router = new Router();

router.addRoute("/", () => ModelViewer());

export { router };
