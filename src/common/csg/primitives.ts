import {
  OpenCascadeInstance,
  TopoDS_Shape,
  TopoDS_Edge,
  TopTools_ListOfShape,
  TopAbs_ShapeEnum,
  ChFi3d_FilletShape,
  Message_ProgressRange,
} from "opencascade.js";
import { getOCC } from "../../client/app/occ";

const oc = getOCC();

const TopAbs_EDGE: TopAbs_ShapeEnum = oc.TopAbs_ShapeEnum.TopAbs_EDGE as any;
const TopAbs_SHAPE: TopAbs_ShapeEnum = oc.TopAbs_ShapeEnum.TopAbs_SHAPE as any;
const ChFi3d_Rational: ChFi3d_FilletShape = oc.ChFi3d_FilletShape
  .ChFi3d_Rational as any;
new oc.Message_ProgressRange_1();

export class Shape3 {
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

  translate([x, y, z]: number[]) {
    const tf = new oc.gp_Trsf_1();
    tf.SetTranslation_1(new oc.gp_Vec_4(x, y, z));
    const loc = new oc.TopLoc_Location_2(tf);
    this.shape = this.shape.Moved(loc, false);
    return this;
  }

  union(anotherShape: Shape3) {
    const fuse = new oc.BRepAlgoAPI_Fuse_3(
      this.shape,
      anotherShape.shape,
      new oc.Message_ProgressRange_1(),
    );
    fuse.Build(new oc.Message_ProgressRange_1());
    this.shape = fuse.Shape();
    return this;
  }

  doEdges(fn: (edge: TopoDS_Edge, i: number) => void) {
    const edgeMap = new oc.TopTools_IndexedMapOfShape_1();
    oc.TopExp.MapShapes_1(this.shape, TopAbs_EDGE, edgeMap);
    for (let i = 1; i <= edgeMap.Extent(); i++) {
      const edge = oc.TopoDS.Edge_1(edgeMap.FindKey(i));
      fn(edge, i - 1);
    }
  }

  fillet(radius: number, edges?: number[]) {
    const mkFillet = new oc.BRepFilletAPI_MakeFillet(
      this.shape,
      ChFi3d_Rational,
    );

    const edgeSet = edges ? new Set(edges) : undefined;
    this.doEdges((edge, i) => {
      if (!edgeSet || edgeSet.has(i)) {
        mkFillet.Add_2(radius, edge);
      }
    });
    mkFillet.Build(new oc.Message_ProgressRange_1());
    this.shape = mkFillet.Shape();
    return this;
  }

  cut(anotherShape: Shape3) {
    const cut = new oc.BRepAlgoAPI_Cut_3(
      this.shape,
      anotherShape.shape,
      new oc.Message_ProgressRange_1(),
    );
    cut.Build(new oc.Message_ProgressRange_1());
    this.shape = cut.Shape();
    return this;
  }
}

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
