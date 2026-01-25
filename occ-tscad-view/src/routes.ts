import { Router, hbox } from "solid-vanilla";
import { ModelViewer } from "./modelviewer";
import { Title } from "./components";
import { CodePad } from "./codepad";

const base = import.meta.env.BASE_URL;
const router = new Router(base?.substring(0, base.length - 1));

router.addRoute("/", () => Title("Select File"));
router.addRoute("/model-viewer/:file", (params) =>
  hbox()
    .css("flex-grow", "1")
    .inner(CodePad(params.file), ModelViewer(params.file)),
);
export { router };
