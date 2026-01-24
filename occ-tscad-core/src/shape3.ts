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

export type WithRadius<T> = {
  radius: number;
  type?: "fillet" | "chamfer";
  target: T;
};

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

  private _handleSectionEdges(
    props: WithRadius<Shape3>,
    fuse: BRepAlgoAPI_Fuse_3,
  ) {
    const fusedShape = fuse.Shape();
    const mkFillet = new oc.BRepFilletAPI_MakeFillet(
      fusedShape,
      ChFi3d_Rational,
    );
    const newEdgesList = fuse.SectionEdges();
    while (!newEdgesList.IsEmpty()) {
      const edgeShape = newEdgesList.First_1();
      newEdgesList.RemoveFirst();
      if (edgeShape.ShapeType() === oc.TopAbs_ShapeEnum.TopAbs_EDGE) {
        const edge = oc.TopoDS.Edge_1(edgeShape);
        mkFillet.Add_2(props.radius, edge);
      }
    }
    mkFillet.Build(progress);
    return mkFillet.Shape();
  }

  union(prop: Shape3 | WithRadius<Shape3>) {
    const fillProps: WithRadius<Shape3> =
      "target" in prop ? prop : { radius: 0, type: "fillet", target: prop };
    const fuse = new oc.BRepAlgoAPI_Fuse_3(
      this.shape,
      fillProps.target.shape,
      progress,
    );
    fuse.Build(progress);

    if (fillProps.radius) {
      this.shape = this._handleSectionEdges(fillProps, fuse);
    } else {
      this.shape = fuse.Shape();
    }
    return this;
  }

  cut(prop: Shape3 | WithRadius<Shape3>) {
    const fillProps: WithRadius<Shape3> =
      "target" in prop ? prop : { radius: 0, type: "fillet", target: prop };
    const cut = new oc.BRepAlgoAPI_Cut_3(
      this.shape,
      fillProps.target.shape,
      progress,
    );
    cut.Build(progress);
    if (fillProps.radius) {
      this.shape = this._handleSectionEdges(fillProps, cut);
    } else {
      this.shape = cut.Shape();
    }
    return this;
  }

  intersect(prop: Shape3 | WithRadius<Shape3>) {
    const fillProps: WithRadius<Shape3> =
      "target" in prop ? prop : { radius: 0, type: "fillet", target: prop };
    const intersect = new oc.BRepAlgoAPI_Common_3(
      this.shape,
      fillProps.target.shape,
      progress,
    );
    intersect.Build(progress);
    if (fillProps.radius) {
      this.shape = this._handleSectionEdges(fillProps, intersect);
    } else {
      this.shape = intersect.Shape();
    }
    return this;
  }

  private doEdges(fn: (edge: TopoDS_Edge, i: number) => void) {
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
    mkFillet.Build(progress);
    this.shape = mkFillet.Shape();
    return this;
  }
}
