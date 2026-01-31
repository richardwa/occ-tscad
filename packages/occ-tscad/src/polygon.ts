import { OpenCascadeInstance } from "opencascade.js";
import { initOCC } from "./occ";
import { Shape2 } from "./shape2";
import { Vec2 } from "./util";

const oc = await initOCC();

const makeFace = (points: Vec2[]) => {
  const mkWire = new oc.BRepBuilderAPI_MakePolygon_1();

  // Add all points
  for (const [x, y] of points) {
    mkWire.Add_1(new oc.gp_Pnt_3(x, y, 0));
  }

  // Close polygon if not closed
  const [fx, fy] = points[0];
  const [lx, ly] = points[points.length - 1];
  if (fx !== lx || fy !== ly) {
    mkWire.Add_1(new oc.gp_Pnt_3(fx, fy, 0));
  }

  // Build the wire
  mkWire.Close();
  const wire = mkWire.Wire();

  // Make a face from the wire
  const faceMaker = new oc.BRepBuilderAPI_MakeFace_15(wire, true);
  return faceMaker.Face();
};

class Polygon extends Shape2 {
  constructor(points: Vec2[]) {
    if (points.length < 3) {
      throw new Error("Polygon needs at least 3 points");
    }
    super(makeFace(points));
  }
}

class RegularPolygon extends Shape2 {
  constructor(sides: number, radius: number) {
    if (sides < 3) {
      throw new Error("Polygon needs at least 3 sides");
    }
    const points: any[] = [];
    const angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
      const a = i * angleStep;
      points.push([radius * Math.cos(a), radius * Math.sin(a)]);
    }
    super(makeFace(points));
  }
}
type PolyFunc = {
  (...params: ConstructorParameters<typeof Polygon>): Shape2;
  (...params: ConstructorParameters<typeof RegularPolygon>): Shape2;
};
export const poly: PolyFunc = (p1: number | Vec2[], p2?: number) => {
  if (Array.isArray(p1)) {
    return new Polygon(p1);
  } else if (p2 != null) {
    return new RegularPolygon(p1, p2);
  }
  throw "no matching polygon constructor";
};
