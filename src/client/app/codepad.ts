import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, TextArea, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { modelUrl } from "./model-store";
import { shapeToGLB, glbToStlUrl, glbToObjUrl } from "./shapeToUrl";
import { setExtension } from "../../common/util";
import { getOCC } from "./occ";

export const CodePad = (file: string) => {
  const fileContents = signal("");

  const renderContents = async () => {
    const { Sphere, Box } = await import("../../common/csg");
    const contents = fileContents.get();
    const main = eval(contents + "\n try{main;}catch{}");
    if (!main) {
      console.error(`code must contain "const main"`);
      return;
    }
    const oc = getOCC();
    const result = main(oc);
    const url = shapeToGLB(oc, result.shape);
    modelUrl.set(url);
  };

  (async () => {
    const resp = await fetch(`/models/${file}`);
    let contents = await resp.text();
    // remove imports
    contents = contents.replace(/^\s*import\s.*?;[\r\n]*/gm, "");

    // remove export
    contents = contents.replace(/^\s*export /gm, "");

    fileContents.set(contents);
    renderContents();
  })();

  return vbox().inner(
    hbox().inner(
      Button().on("click", renderContents).inner("Render"),
      Button()
        .on("click", async () => {
          const url = modelUrl.get();
          if (url) {
            const stlUrl = await glbToObjUrl(url);
            downloadBinaryFile(stlUrl, setExtension(file, "obj"));
          }
        })
        .inner("Download Obj"),
    ),
    TextArea(fileContents).css("width", "600px").css("height", "500px"),
  );
};
