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
import { Shape } from "./shape";
import { Vec3 } from "./util";

export type WithRadius<T> = {
  radius: number;
  type?: "fillet" | "chamfer";
  target: T;
};

export class Shape3 extends Shape {
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

  private _handleSectionEdges(
    props: WithRadius<Shape3>,
    fuse: BRepAlgoAPI_Fuse_3,
  ) {
    const fusedShape = fuse.Shape();
    const mkFillet = new this.oc.BRepFilletAPI_MakeFillet(
      fusedShape,
      this.ChFi3d_Rational(),
    );
    const newEdgesList = fuse.SectionEdges();
    while (!newEdgesList.IsEmpty()) {
      const edgeShape = newEdgesList.First_1();
      newEdgesList.RemoveFirst();
      if (edgeShape.ShapeType() === this.oc.TopAbs_ShapeEnum.TopAbs_EDGE) {
        const edge = this.oc.TopoDS.Edge_1(edgeShape);
        mkFillet.Add_2(props.radius, edge);
      }
    }
    mkFillet.Build(this.progress());
    return mkFillet.Shape();
  }

  union(prop: Shape3 | WithRadius<Shape3>) {
    const fillProps: WithRadius<Shape3> =
      "target" in prop ? prop : { radius: 0, type: "fillet", target: prop };
    const prog = this.progress();
    const fuse = new this.oc.BRepAlgoAPI_Fuse_3(
      this.shape,
      fillProps.target.shape,
      prog,
    );
    fuse.Build(prog);

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
    const prog = this.progress();

    const cut = new this.oc.BRepAlgoAPI_Cut_3(
      this.shape,
      fillProps.target.shape,
      prog,
    );
    cut.Build(prog);
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
    const prog = this.progress();

    const intersect = new this.oc.BRepAlgoAPI_Common_3(
      this.shape,
      fillProps.target.shape,
      prog,
    );
    intersect.Build(prog);
    if (fillProps.radius) {
      this.shape = this._handleSectionEdges(fillProps, intersect);
    } else {
      this.shape = intersect.Shape();
    }
    return this;
  }

  private doEdges(fn: (edge: TopoDS_Edge, i: number) => void) {
    const edgeMap = new this.oc.TopTools_IndexedMapOfShape_1();
    this.oc.TopExp.MapShapes_1(this.shape, this.TopAbs_EDGE(), edgeMap);
    for (let i = 1; i <= edgeMap.Extent(); i++) {
      const edge = this.oc.TopoDS.Edge_1(edgeMap.FindKey(i));
      fn(edge, i - 1);
    }
  }

  fillet(radius: number, edges?: number[]) {
    const mkFillet = new this.oc.BRepFilletAPI_MakeFillet(
      this.shape,
      this.ChFi3d_Rational(),
    );

    const edgeSet = edges ? new Set(edges) : undefined;
    this.doEdges((edge, i) => {
      if (!edgeSet || edgeSet.has(i)) {
        mkFillet.Add_2(radius, edge);
      }
    });
    mkFillet.Build(this.progress());
    this.shape = mkFillet.Shape();
    return this;
  }
}
