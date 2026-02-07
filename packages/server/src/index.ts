import { div, render } from "solid-vanilla";
import { router } from "./routes";
import "./base/hmr-listener";

const App = () =>
  div().css("padding", "0.5rem").css("height", "100vh").inner(router.getRoot());

render(document.getElementById("app"), App());
