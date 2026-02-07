import { div, render } from "solid-vanilla";
import { router } from "./routes";

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.on("vite:beforeFullReload", () => {
    throw new Error("(skipping full reload)");
  });
}

const App = () =>
  div().css("padding", "0.5rem").css("height", "100vh").inner(router.getRoot());

render(document.getElementById("app"), App());
