import { box, sphere, circle } from "occ-tscad";

export const main = () =>
  box(2, 2, 2).intersect({
    radius: 2,
    target: box(2, 2, 2).translate([1, 1, 1]),
  });
