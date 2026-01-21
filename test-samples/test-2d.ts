import { box, poly } from "../src";

export const main = () =>
  poly([
    [-1, -1],
    [1, -1],
    [1, 1],
    [0, 2],
    [-1, 1],
  ]).extrude(1);
