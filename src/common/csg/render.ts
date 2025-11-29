import { TopoDS_Shape } from "opencascade.js";
import { getOCC } from "./occ";

export const renderToSTL = (
  shape: TopoDS_Shape,
): Uint8Array<ArrayBufferLike> => {
  const oc = getOCC();
  // Step 1: Triangulate the shape
  new oc.BRepMesh_IncrementalMesh_2(
    shape,
    0.1, // linear deflection
    true, // relative
    Math.PI / 18, // angular deflection (~10°)
    false, // in parallel
  );

  const writer = new oc.StlAPI_Writer();
  const wasmPath = "/output.stl";
  writer.Write(shape, wasmPath, new oc.Message_ProgressRange_1());
  return oc.FS.readFile(wasmPath);
};

export const renderToStep = (
  shape: TopoDS_Shape,
): Uint8Array<ArrayBufferLike> => {
  const oc = getOCC();
  // Step 1: Triangulate the shape
  const writer = new oc.STEPControl_Writer_1();
  const statusTransfer = writer.Transfer(
    shape,
    oc.STEPControl_StepModelType.STEPControl_AsIs as any,
    true,
    new oc.Message_ProgressRange_1(),
  );
  //console.log("Transfer status:", statusTransfer);
  const wasmPath = "output.step";
  const writeStatus = writer.Write(wasmPath); // in-memory
  // console.log("Write Status", writeStatus);
  return oc.FS.readFile(wasmPath); // Uint8Array
};

// Takes a TopoDS_Shape, creates a GLB file from it and returns a ObjectURL
export const renderToGLB = (
  shape: TopoDS_Shape,
): Uint8Array<ArrayBufferLike> => {
  const oc = getOCC();
  // Create a document and add our shape
  const docHandle = new oc.Handle_TDocStd_Document_2(
    new oc.TDocStd_Document(new oc.TCollection_ExtendedString_1()),
  );
  const shapeTool = oc.XCAFDoc_DocumentTool.ShapeTool(
    docHandle.get().Main(),
  ).get();
  shapeTool.SetShape(shapeTool.NewShape(), shape);

  // Tell OpenCascade that we want our shape to get meshed
  new oc.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.1, false);

  // Export a GLB file (this will also perform the meshing)
  const cafWriter = new oc.RWGltf_CafWriter(
    new oc.TCollection_AsciiString_2("./file.glb"),
    true,
  );
  cafWriter.Perform_2(
    docHandle,
    new oc.TColStd_IndexedDataMapOfStringString_1(),
    new oc.Message_ProgressRange_1(),
  );

  // Read the GLB file from the virtual file system
  return oc.FS.readFile("./file.glb", { encoding: "binary" });
};

export const renderToObj = (
  shape: TopoDS_Shape,
): Uint8Array<ArrayBufferLike> => {
  const oc = getOCC();

  // Step 1: Triangulate the shape (required for OBJ)
  // Linear deflection = 0.1, angular deflection ~10 degrees
  new oc.BRepMesh_IncrementalMesh_2(
    shape,
    0.1, // linear deflection
    true, // relative
    Math.PI / 18, // angular deflection
    false, // in parallel
  );

  const vertices: string[] = [];
  const faces: string[] = [];

  // Step 2: Traverse faces and collect triangulation
  const explorer = new oc.TopExp_Explorer_2(
    shape,
    oc.TopAbs_ShapeEnum.TopAbs_FACE as typeof oc.TopAbs_ShapeEnum,
    oc.TopAbs_ShapeEnum.TopAbs_EDGE as typeof oc.TopAbs_ShapeEnum,
  );
  while (explorer.More()) {
    const face = oc.TopoDS.Face_1(explorer.Current());
    const triangulationHandle = oc.BRep_Tool.Triangulation(
      face,
      new oc.TopLoc_Location_1(),
      1, // Poly_Triagulation
    );

    if (!triangulationHandle.IsNull()) {
      const triangulation = triangulationHandle.get();
      const numNodes = triangulation.NbNodes();
      const numTriangles = triangulation.NbTriangles();

      // Add vertices
      for (let i = 1; i <= numNodes; i++) {
        const p = triangulation.Node(i);
        vertices.push(`v ${p.X()} ${p.Y()} ${p.Z()}`);
      }

      // Add faces
      for (let i = 1; i <= numTriangles; i++) {
        const t = triangulation.Triangle(i);
        faces.push(`f ${t.Value(1)} ${t.Value(2)} ${t.Value(3)}`);
      }
    }

    explorer.Next();
  }

  // Step 3: Combine vertices and faces into OBJ format string
  const objString = [...vertices, ...faces].join("\n");

  // Step 4: Convert string to Uint8Array buffer
  return new TextEncoder().encode(objString);
};
