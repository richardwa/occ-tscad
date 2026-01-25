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

router.addRoute("/ide-view:file", (params) => {
  currentFile.set(params.file);
  return root.memo("ide-view", () =>
    fragment().do(async (node) => {
      const { IDEView } = await import("./views/ide-view");
      node.inner(IDEView(currentFile));
    }),
  );
});

router.addRoute("/model-view/:file", (params) => {
  currentFile.set(params.file);
  return root.memo("model-view", () =>
    fragment().do(async (node) => {
      const { ModelView } = await import("./views/model-only");
      node.inner(ModelView(currentFile));
    }),
  );
});

export { router };
