import { Box, Sphere } from "../src/common/csg";

export const main = () =>
  new Sphere(0.5)
    .union(new Box(1, 1, 1).translate([2, 0, 0]))
    .union(new Box(1.2, 1.2, 1.2).translate([0, 2, 0]).rotateX(45))
    .union(new Box(1.5, 1.5, 1.5).translate([0, 0, 2]));
