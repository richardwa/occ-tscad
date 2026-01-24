import { box, sphere } from "../../src/common/csg";

export const main = () =>
  box(2, 2, 2).union({
    radius: 0.2,
    target: box(2, 2, 2).translate([1, 1, -1]),
  });
