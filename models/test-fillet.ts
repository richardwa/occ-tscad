import { Box, Sphere } from "../src/common/csg";

export const main = () =>
  new Box(2, 2, 2).union(new Box(2, 2, 2).translate([1, 1, 1])).fillet(0.2);
