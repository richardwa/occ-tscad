import { div, hbox } from "../lib";
import { Title } from "./components";
import { fileList } from "./filelist";
import { router } from "./routes";

export const App = () =>
  div()
    .css("padding", "0.5rem")
    .inner(
      Title("Opencascade tsCAD")
        .css("font-weight", "bold")
        .css("margin-bottom", "1rem")
        .css("cursor", "pointer")
        .on("click", () => router.navigate("/")),
      hbox(fileList(), router.getRoot()),
    );
