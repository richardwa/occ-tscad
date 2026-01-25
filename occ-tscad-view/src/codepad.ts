import { hbox, vbox, div, fragment, grid } from "solid-vanilla";
import { Button, TextArea, Title } from "./components";
import { signal, h } from "solid-vanilla";
import { modelShape } from "./model-store";
import { getOCC } from "occ-tscad";

export const CodePad = (file: string) => {
  const fileContents = signal("");
  console.log(file);

  const renderContents = async () => {
    const { sphere, box, circle, cone, cylinder, poly, torus, wedge } =
      await import("occ-tscad");
    let contents = fileContents.get();

    // remove imports
    contents = contents.replace(/^\s*import\s.*?;[\r\n]*/gm, "");
    // remove exports
    contents = contents.replace(/^\s*export /gm, "");

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
    const resp = await fetch(`${document.baseURI}models/${file}`);
    let contents = await resp.text();

    fileContents.set(contents);
    renderContents();
  })();

  return vbox()
    .css("min-height", "calc(-1rem + 100vh)")
    .inner(
      hbox().inner(Button().on("click", renderContents).inner("Render")),
      TextArea(fileContents)
        .css("width", "40rem")
        .css("height", "100%")
        .css("flex-grow", "1"),
    );
};
