import { Box, Sphere } from "../src/common/csg";

export const main = () =>
  new Box(2, 2, 2).union({
    radius: 0.2,
    target: new Box(2, 2, 2).translate([1, 1, 1]),
  });
