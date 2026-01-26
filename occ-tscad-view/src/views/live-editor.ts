import { hbox, signal, vbox } from "solid-vanilla";
import { ModelViewer } from "../components/modelviewer";
import { CodePad } from "../components/codepad";
import { Button } from "../base";
import prettier from "prettier/standalone";
import * as tsPlugin from "prettier/plugins/typescript";
import * as estree from "prettier/plugins/estree";
// @ts-ignore
import sampleText from "./sample.ts?raw";

const storageKey = "sample.ts";
export const IDEView = () => {
  const shapeFileContents = signal<string>();
  (async () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      shapeFileContents.set(stored);
    } else {
      shapeFileContents.set(sampleText);
    }
  })();

  return hbox()
    .css("flex-grow", "1")
    .inner(
      vbox().inner(
        hbox().inner(
          Button()
            .on("click", () => shapeFileContents.trigger())
            .inner("Render"),
          Button()
            .on("click", async () => {
              localStorage.removeItem(storageKey);
              shapeFileContents.set(sampleText);
            })
            .inner("Reset"),
          Button()
            .on("click", async () => {
              const str = shapeFileContents.get();
              if (str != null) {
                const formatted = await prettier.format(str, {
                  parser: "typescript",
                  plugins: [tsPlugin, estree],
                });
                localStorage.setItem(storageKey, formatted);
                shapeFileContents.set(formatted);
              }
            })
            .inner("Save"),
        ),
        CodePad(shapeFileContents),
      ),
      ModelViewer(signal(storageKey), shapeFileContents),
    );
};
