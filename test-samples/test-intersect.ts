import { box, sphere, circle } from "../src";

export const main = () =>
  box(2, 2, 2).intersect({
    radius: 0.2,
    target: box(2, 2, 2).translate([1, 1, 1]),
  });
