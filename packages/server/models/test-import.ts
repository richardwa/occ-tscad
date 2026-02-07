import { box, sphere, circle } from "occ-tscad";
import { main as myShape } from "./test-intersect";

export const main = () => sphere(1).union(myShape());
