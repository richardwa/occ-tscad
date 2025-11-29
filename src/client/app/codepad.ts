import { hbox, vbox, div, fragment, grid } from "../lib/base-components";
import { Button, TextArea, Title } from "./components";
import { signal, h, downloadBinaryFile } from "../lib";
import { modelShape } from "./model-store";
import { getOCC } from "../../common/csg/occ";

export const CodePad = (file: string) => {
  const fileContents = signal("");
  console.log(file);

  const renderContents = async () => {
    const { Sphere, Box, Circle, Cone, Cylinder, Polygon, Torus, Wedge } =
      await import("../../common/csg");
    const contents = fileContents.get();
    const main = eval(contents + "\n try{main;}catch{}");
    if (!main) {
      console.error(`code must contain "const main"`);
      return;
    }
    const oc = getOCC();
    const result = main(oc);
    modelShape.set(result);
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

  return vbox()
    .css("height", "100%")
    .inner(
      hbox().inner(Button().on("click", renderContents).inner("Render")),
      TextArea(fileContents)
        .css("width", "40rem")
        .css("height", "100%")
        .css("flex-grow", "1"),
    );
};
