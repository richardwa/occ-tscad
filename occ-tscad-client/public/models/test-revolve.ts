import { box, sphere, circle } from "occ-tscad-core";

export const main = () => circle(1).translate([0, 5, 0]).revolveX(275);
