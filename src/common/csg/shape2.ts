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
} from "opencascade.js";
import { getOCC } from "../../client/app/occ";

const oc = getOCC();

const TopAbs_EDGE: TopAbs_ShapeEnum = oc.TopAbs_ShapeEnum.TopAbs_EDGE as any;
const TopAbs_SHAPE: TopAbs_ShapeEnum = oc.TopAbs_ShapeEnum.TopAbs_SHAPE as any;
const ChFi3d_Rational: ChFi3d_FilletShape = oc.ChFi3d_FilletShape
  .ChFi3d_Rational as any;
const progress = new oc.Message_ProgressRange_1();

export class Shape2 {
  shape: TopoDS_Shape;
  constructor(shape: TopoDS_Shape) {
    this.shape = shape;
  }
}
