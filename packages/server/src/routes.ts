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
router.addRoute("/file-browser/:file", (params) => {
  currentFile.set(params.file);
  return root.memo("file-browser", () =>
    fragment().do(async (node) => {
      const { ModelView } = await import("./views/file-browser");
      node.inner(ModelView(currentFile));
    }),
  );
});

export { router };
