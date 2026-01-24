import { box, sphere, circle } from "occ-tscad";

export const main = () => circle(1).translate([0, 5, 0]).revolveX(275);
