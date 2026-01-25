import { hbox } from "solid-vanilla";
import { ClickLink } from "../base";
import { router } from "../routes";

export const Navigation = () => {
  return hbox()
    .css("gap", "1rem")
    .css("height", "2rem")
    .inner(
      ClickLink()
        .on("click", () => router.navigate("/"))
        .inner("[Home]"),
      ClickLink()
        .on("click", () => router.navigate("/ide-view/"))
        .inner("[IDE view]"),
      ClickLink()
        .on("click", () => router.navigate("/model-view/"))
        .inner("[Model view]"),
    );
};
