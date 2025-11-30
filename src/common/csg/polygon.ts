import { OpenCascadeInstance } from "opencascade.js";
import { initOCC } from "./occ";
import { Shape2 } from "./shape2";
import { Shape3 } from "./shape3";

const oc = await initOCC();

export class Polygon extends Shape2 {
  constructor(points: Vec2[], fillets?: number[]) {
    if (points.length < 3) {
      throw new Error("Polygon needs at least 3 points");
    }

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

    super(faceMaker.Face());
  }
}
