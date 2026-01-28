import { vbox } from "solid-vanilla";
import { ClickLink } from "occ-tscad-base";
import { router } from "../routes";

export const Home = () => {
  return vbox()
    .css("gap", "1rem")
    .css("height", "2rem")
    .inner(
      ClickLink()
        .on("click", () => router.navigate("/file-browser/"))
        .inner("[file browser]"),
    );
};
