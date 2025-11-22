import { Box, Sphere } from "../src/common/csg/primitives";

export const main = () =>
  new Box(2, 2, 2).union(new Box(2, 2, 2).translate([1, 1, 1]), 0.2);
