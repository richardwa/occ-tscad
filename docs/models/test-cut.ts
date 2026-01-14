import { box, sphere, circle } from "../../src/common/csg";

export const main = () =>
  box(2, 2, 2).cut({
    radius: 0.2,
    target: box(2, 2, 2).translate([1, 1, 1]),
  });
