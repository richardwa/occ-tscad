import { vbox, hbox, render, div } from "solid-vanilla";
import { router } from "./routes";
import { Navigation } from "./components/nav";

const App = () =>
  vbox()
    .css("padding", "0.5rem")
    .css("height", "calc(100vh - 1rem)")
    .inner(Navigation(), router.getRoot());

render(document.getElementById("app"), App());
