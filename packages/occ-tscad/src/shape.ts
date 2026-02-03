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
import { Vec3 } from "./util";

export class Shape {
  shape: TopoDS_Shape;
  oc: OpenCascadeInstance;
  constructor(shape: TopoDS_Shape, oc: OpenCascadeInstance) {
    this.shape = shape;
    this.oc = oc;
  }

  protected TopAbs_EDGE() {
    return this.oc.TopAbs_ShapeEnum.TopAbs_EDGE as TopAbs_ShapeEnum;
  }
  protected TopAbs_SHAPE() {
    return this.oc.TopAbs_ShapeEnum.TopAbs_SHAPE as TopAbs_ShapeEnum;
  }
  protected ChFi3d_Rational() {
    return this.oc.ChFi3d_FilletShape.ChFi3d_Rational as ChFi3d_FilletShape;
  }
  protected progress() {
    return new this.oc.Message_ProgressRange_1();
  }
  protected axis_X() {
    return new this.oc.gp_Ax1_2(
      new this.oc.gp_Pnt_3(0, 0, 0),
      new this.oc.gp_Dir_4(1, 0, 0),
    );
  }
  protected axis_Y() {
    return new this.oc.gp_Ax1_2(
      new this.oc.gp_Pnt_3(0, 0, 0),
      new this.oc.gp_Dir_4(0, 1, 0),
    );
  }
  protected axis_Z() {
    return new this.oc.gp_Ax1_2(
      new this.oc.gp_Pnt_3(0, 0, 0),
      new this.oc.gp_Dir_4(0, 0, 1),
    );
  }

  scale(x: number) {
    const tf = new this.oc.gp_Trsf_1();
    tf.SetScaleFactor(x);
    const loc = new this.oc.TopLoc_Location_2(tf);
    this.shape = this.shape.Moved(loc, false);
    return this;
  }

  translate([x, y, z]: Vec3) {
    const tf = new this.oc.gp_Trsf_1();
    tf.SetTranslation_1(new this.oc.gp_Vec_4(x, y, z));
    const loc = new this.oc.TopLoc_Location_2(tf);
    this.shape = this.shape.Moved(loc, false);
    return this;
  }

  private _rotate(axis: gp_Ax1_2, degrees: number) {
    const tf = new this.oc.gp_Trsf_1();
    const angle = degrees / (2 * Math.PI);
    tf.SetRotation_1(axis, angle);
    const transformer = new this.oc.BRepBuilderAPI_Transform_2(
      this.shape,
      tf,
      true,
    );
    return transformer.Shape();
  }

  rotate(axis: Vec3, degrees: number) {
    const rotationAxis = new this.oc.gp_Ax1_2(
      new this.oc.gp_Pnt_3(0, 0, 0),
      new this.oc.gp_Dir_4(axis[0], axis[1], axis[2]),
    );
    this.shape = this._rotate(rotationAxis, degrees);
    return this;
  }

  rotateX(degrees: number) {
    this.shape = this._rotate(this.axis_X(), degrees);
    return this;
  }

  rotateY(degrees: number) {
    this.shape = this._rotate(this.axis_Y(), degrees);
    return this;
  }

  rotateZ(degrees: number) {
    this.shape = this._rotate(this.axis_Z(), degrees);
    return this;
  }
}
