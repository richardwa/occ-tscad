import { box, sphere, circle } from "occ-tscad";

export const main = () =>
  box(2, 2, 2).intersect({
    radius: 0.6,
    target: box(2, 2, 3).translate([1, 1, 1]),
  });
