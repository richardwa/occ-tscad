import { Box, Polygon } from "../../src/common/csg";

export const main = () =>
  new Polygon([
    [-1, -1],
    [1, -1],
    [1, 1],
    [0, 2],
    [-1, 1],
  ]).extrude(1);
