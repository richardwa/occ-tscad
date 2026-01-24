import { hbox, vbox, div, fragment, grid } from "solid-vanilla";
import { Button, TextArea, Title } from "./components";
import { signal, h } from "solid-vanilla";
import { modelShape } from "./model-store";
import { getOCC } from "occ-tscad-core";

// check for github pages
const baseContext = document.location.pathname.includes("occ-tscad")
  ? "/occ-tscad"
  : "";

export const CodePad = (file: string) => {
  const fileContents = signal("");
  console.log(file);

  const renderContents = async () => {
    const { sphere, box, circle, cone, cylinder, poly, torus, wedge } =
      await import("occ-tscad-core");
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
    const resp = await fetch(`${baseContext}/models/${file}`);
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
