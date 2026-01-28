import { HashRouter, fragment, signal, div, hbox } from "solid-vanilla";
const root = hbox().css("flex-grow", "1");
const router = new HashRouter(root);

router.addRoute("/", (params) =>
  root.memo("home", () =>
    fragment().do(async (node) => {
      const { Home } = await import("./views/home");
      node.inner(Home());
    }),
  ),
);

const currentFile = signal<string>();
router.addRoute("/live-editor/:file", (params) => {
  currentFile.set(params.file);
  return root.memo("live-editor", () =>
    fragment().do(async (node) => {
      const { IDEView } = await import("./views/live-editor");
      node.inner(IDEView(currentFile));
    }),
  );
});

export { router };
