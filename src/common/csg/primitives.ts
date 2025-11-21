import { OpenCascadeInstance, TopoDS_Shape } from "opencascade.js";
import { getOCC } from "../../client/app/occ";

const oc = getOCC();

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

  cut(anotherShape: Shape3){
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
