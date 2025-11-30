import { OpenCascadeInstance } from "opencascade.js";
import { getOCC } from "./occ";
import { Shape2 } from "./shape2";
import { Shape3 } from "./shape3";

const oc = getOCC();

export class Sphere extends Shape3 {
  constructor(radius: number) {
    super(new oc.BRepPrimAPI_MakeSphere_1(radius).Shape());
  }
}

export class Box extends Shape3 {
  constructor(x: number, y: number, z: number, centered = true) {
    super(new oc.BRepPrimAPI_MakeBox_2(x, y, z).Shape());
    if (centered) this.translate([-x / 2.0, -y / 2.0, -z / 2.0]);
  }
}

export class Cylinder extends Shape3 {
  constructor(radius: number, height: number, centered = true) {
    super(new oc.BRepPrimAPI_MakeCylinder_1(radius, height).Shape());
    if (centered) this.translate([0, 0, height / 2.0]);
  }
}

export class Cone extends Shape3 {
  constructor(r1: number, r2: number, height: number, centered = false) {
    super(new oc.BRepPrimAPI_MakeCone_1(r1, r2, height).Shape());
    if (centered) this.translate([0, 0, height / 2.0]);
  }
}

export class Torus extends Shape3 {
  constructor(radius: number, innerRadius: number, centered = true) {
    super(new oc.BRepPrimAPI_MakeTorus_1(radius, innerRadius).Shape());
    if (!centered) this.translate([0, 0, innerRadius]);
  }
}

export class Wedge extends Shape3 {
  constructor(x: number, y: number, z: number, ltx: number, centered = true) {
    super(new oc.BRepPrimAPI_MakeWedge_1(x, y, z, ltx).Shape());
    if (centered) this.translate([-x / 2.0, -y / 2.0, -z / 2.0]);
  }
}

export class Circle extends Shape2 {
  constructor(radius: number) {
    const center = new oc.gp_Pnt_3(0, 0, 0); // center of circle
    const normal = new oc.gp_Dir_4(0, 0, 1); // Z axis normal
    const xDir = new oc.gp_Dir_4(1, 0, 0); // X axis direction
    const ax2 = new oc.gp_Ax2_2(center, normal, xDir);
    const circle = new oc.gp_Circ_2(ax2, radius);
    const edge = new oc.BRepBuilderAPI_MakeEdge_8(circle).Edge();
    const wire = new oc.BRepBuilderAPI_MakeWire_2(edge).Wire();
    const face = new oc.BRepBuilderAPI_MakeFace_15(wire, false);
    super(face.Shape());
  }
}

export class Polygon extends Shape2 {
  constructor(points: Vec2[], fillets?: number[]) {


    if (points.length < 3) {
      throw new Error("Polygon needs at least 3 points");
    }

    const mkWire = new oc.BRepBuilderAPI_MakePolygon();

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
