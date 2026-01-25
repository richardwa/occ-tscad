import { vbox } from "solid-vanilla";
import { Title } from "../base";

export const Home = () => {
  return vbox().css("font-size", "large").inner(Title("select view then file"));
};
