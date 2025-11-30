import { Box, Sphere, Circle } from "../../src/common/csg";

export const main = () => new Circle(1).translate([0, 5, 0]).revolveX(275);
