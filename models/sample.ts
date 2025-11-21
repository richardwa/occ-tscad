import { Box, Sphere } from "../src/common/csg/primitives";

export const main = () =>
  new Box(2,2,2).cut(new Sphere(1).translate([1, 1, 1]));
