import { vbox, render } from "solid-vanilla";
import { router } from "./routes";

const App = () =>
  vbox()
    .css("padding", "0.5rem")
    .css("height", "calc(100vh - 1rem)")
    .inner(router.getRoot());

render(document.getElementById("app"), App());
