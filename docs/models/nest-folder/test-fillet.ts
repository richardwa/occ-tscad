import { box, sphere, circle } from "occ-tscad";

export const main = () =>
  box(2, 2, 2).union({
    radius: 0.1,
    target: sphere(1).translate([-1.2, 1.2, 1.2]),
  });
