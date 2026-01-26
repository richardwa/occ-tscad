import {
  box,
  circle,
  cone,
  cylinder,
  poly,
  sphere,
  torus,
  wedge,
} from "occ-tscad";

export const main = () =>
  box(2, 2, 2).cut({
    radius: 0.2,
    target: box(2, 2, 2).translate([1, 1, 1]),
  });

/* *** API reference **

box(x: number, y: number, z: number, centered = true) => Shape3
circle(radius: number) => Shape2
cone(r1: number, r2: number, height: number, centered = false) => Shape3
cylinder(radius: number, height: number, centered = true) => Shape3
poly(sides: number, radius: number) => Shape2, (points: Vec2[]) => Shape2
sphere(radius: number) => Shape3
torus(radius: number, innerRadius: number, centered = true) => Shape3
wedge(x: number, y: number, z: number, ltx: number, centered = true) => Shape3

class Shape2 {
  extrude(len: number | Vec3) => Shape3
  revolve(direction: Vec3, angle: number) => Shape3
  revolveX(angle: number) => Shape3
  revolveY(angle: number) => Shape3
  revolveZ(angle: number) => Shape3
}
class Shape3 {
  scale(x: number) => Shape3
  translate([x, y, z]: Vec3) => Shape3
  rotate(axis: Vec3, degrees: number) => Shape3
  rotateX(degrees: number) => Shape3
  rotateY(degrees: number) => Shape3
  rotateZ(degrees: number) => Shape3

  union(prop: Shape3) => Shape3
  union({
    radius: number;
    type?: "fillet" | "chamfer";
    target: Shape3;
  }) => Shape3
  intersect(props same as union)
  cut(props same as union)
  fillet(radius: number, edges?: number[]) 
}
***  END COMMENT *** */
