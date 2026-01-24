import {
  OpenCascadeInstance,
  TopoDS_Shape,
  TopoDS_Edge,
  TopTools_ListOfShape,
  TopAbs_ShapeEnum,
  ChFi3d_FilletShape,
  Message_ProgressRange,
  ProjLib_PrjResolve,
  BRepAlgoAPI_Fuse_3,
  gp_Ax1_2,
} from "opencascade.js";
import { initOCC } from "./occ";
import { Vec3 } from "./util";

const oc = await initOCC();

const TopAbs_EDGE: TopAbs_ShapeEnum = oc.TopAbs_ShapeEnum.TopAbs_EDGE as any;
const TopAbs_SHAPE: TopAbs_ShapeEnum = oc.TopAbs_ShapeEnum.TopAbs_SHAPE as any;
const ChFi3d_Rational: ChFi3d_FilletShape = oc.ChFi3d_FilletShape
  .ChFi3d_Rational as any;
const progress = new oc.Message_ProgressRange_1();
const axis_X = new oc.gp_Ax1_2(
  new oc.gp_Pnt_3(0, 0, 0),
  new oc.gp_Dir_4(1, 0, 0),
);
const axis_Y = new oc.gp_Ax1_2(
  new oc.gp_Pnt_3(0, 0, 0),
  new oc.gp_Dir_4(0, 1, 0),
);
const axis_Z = new oc.gp_Ax1_2(
  new oc.gp_Pnt_3(0, 0, 0),
  new oc.gp_Dir_4(0, 0, 1),
);

export class Shape {
  shape: TopoDS_Shape;
  constructor(shape: TopoDS_Shape) {
    this.shape = shape;
  }

  scale(x: number) {
    const tf = new oc.gp_Trsf_1();
    tf.SetScaleFactor(x);
    const loc = new oc.TopLoc_Location_2(tf);
    this.shape = this.shape.Moved(loc, false);
    return this;
  }

  translate([x, y, z]: Vec3) {
    const tf = new oc.gp_Trsf_1();
    tf.SetTranslation_1(new oc.gp_Vec_4(x, y, z));
    const loc = new oc.TopLoc_Location_2(tf);
    this.shape = this.shape.Moved(loc, false);
    return this;
  }

  private _rotate(axis: gp_Ax1_2, degrees: number) {
    const tf = new oc.gp_Trsf_1();
    const angle = degrees / (2 * Math.PI);
    tf.SetRotation_1(axis, angle);
    const transformer = new oc.BRepBuilderAPI_Transform_2(this.shape, tf, true);
    return transformer.Shape();
  }

  rotate(axis: Vec3, degrees: number) {
    const rotationAxis = new oc.gp_Ax1_2(
      new oc.gp_Pnt_3(0, 0, 0),
      new oc.gp_Dir_4(axis[0], axis[1], axis[2]),
    );
    this.shape = this._rotate(rotationAxis, degrees);
    return this;
  }

  rotateX(degrees: number) {
    this.shape = this._rotate(axis_X, degrees);
    return this;
  }

  rotateY(degrees: number) {
    this.shape = this._rotate(axis_Y, degrees);
    return this;
  }

  rotateZ(degrees: number) {
    this.shape = this._rotate(axis_Z, degrees);
    return this;
  }
}
