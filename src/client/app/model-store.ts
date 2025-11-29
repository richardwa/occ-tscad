import { TopoDS_Shape } from "opencascade.js";
import { signal } from "../lib";

export const modelShape = signal<TopoDS_Shape>();
