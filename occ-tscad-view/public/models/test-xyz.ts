import { box, sphere } from "occ-tscad";

export const main = () =>
  sphere(0.5)
    .union(box(1, 1, 1).translate([2, 0, 0]))
    .union(box(1.2, 1.2, 1.2).translate([0, 2, 0]))
    .union(box(1.5, 1.5, 1.5).translate([0, 0, 2]));
