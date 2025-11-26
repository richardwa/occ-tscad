import { Box, Sphere } from "../../src/common/csg";

export const main = () =>
  new Box(2, 2, 2).union({
    radius: 0.1,
    target: new Sphere(1).translate([-1.2, 1.2, 1.2]),
  });
