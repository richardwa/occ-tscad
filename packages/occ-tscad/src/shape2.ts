import { TopoDS_Shape } from "opencascade.js";
import { Shape } from "./shape";
import { Shape3 } from "./shape3";
import { initOCC } from "./occ";
import { Vec3 } from "./util";

const oc = await initOCC();

export class Shape2 extends Shape {
  extrude(len: number | Vec3) {
    // Create a vector in Z direction
    const v = typeof len === "number" ? [0, 0, len] : len;
    const extDir = new oc.gp_Vec_4(v[0], v[1], v[2]);

    // Extrude the shape along the vector
    const prism = new oc.BRepPrimAPI_MakePrism_1(
      this.shape,
      extDir,
      false,
      false,
    );

    // Return a new Shape2 object with the extruded shape
    return new Shape3(prism.Shape(), this.oc);
  }

  // Rotate around an axis by angle (in degrees)
  revolve(direction: Vec3, angle: number) {
    const origin = new oc.gp_Pnt_3(0, 0, 0); // center of rotation
    const zDir = new oc.gp_Dir_4(...direction); // axis direction
    const axis = new oc.gp_Ax1_2(origin, zDir);

    // Create revolved shape
    const revol = new oc.BRepPrimAPI_MakeRevol_1(
      this.shape,
      axis,
      angle,
      false,
    );
    return new Shape3(revol.Shape(), this.oc);
  }

  // Rotate around an axis by angle (in degrees)
  revolveX(angle: number) {
    return this.revolve([1, 0, 0], angle);
  }
  revolveY(angle: number) {
    return this.revolve([0, 1, 0], angle);
  }
  revolveZ(angle: number) {
    return this.revolve([0, 0, 1], angle);
  }

  sweep(path: TopoDS_Shape) {
    const pipe = new oc.BRepOffsetAPI_MakePipe_1(path, this.shape);
    return new Shape3(pipe.Shape(), this.oc);
  }
}
