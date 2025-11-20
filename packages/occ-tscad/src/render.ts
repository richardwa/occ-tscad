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

export const stlToObj = (
  stlBuffer: Uint8Array<ArrayBufferLike>,
): Uint8Array<ArrayBufferLike> => {
  const stlText = new TextDecoder().decode(stlBuffer);
  const lines = stlText.split(/\r?\n/);

  const vertices: string[] = [];
  const faces: string[] = [];
  let vertexIndex = 1;

  // Map to store vertex positions as strings to optionally deduplicate
  const vertexMap = new Map<string, number>();

  let currentFace: number[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("vertex")) {
      // Parse vertex coordinates
      const parts = trimmed.split(/\s+/);
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);

      const key = `${x} ${y} ${z}`;
      let index: number;

      if (vertexMap.has(key)) {
        index = vertexMap.get(key)!;
      } else {
        vertices.push(`v ${x} ${y} ${z}`);
        index = vertexIndex++;
        vertexMap.set(key, index);
      }

      currentFace.push(index);
    } else if (trimmed.startsWith("endfacet")) {
      if (currentFace.length === 3) {
        faces.push(`f ${currentFace[0]} ${currentFace[1]} ${currentFace[2]}`);
      }
      currentFace = [];
    }
  }

  const objString = [...vertices, ...faces].join("\n");
  return new TextEncoder().encode(objString);
};
