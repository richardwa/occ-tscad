import { OpenCascadeInstance } from "opencascade.js";
import { getOCC } from "../../client/app/occ";
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
