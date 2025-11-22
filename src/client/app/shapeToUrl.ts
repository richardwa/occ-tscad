import {
  OpenCascadeInstance,
  TopoDS_Shape,
  STEPControl_StepModelType,
} from "opencascade.js";

// Takes a TopoDS_Shape, creates a GLB file from it and returns a ObjectURL
export function shapeToGLB(oc: OpenCascadeInstance, shape: TopoDS_Shape) {
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
  const glbFile = oc.FS.readFile("./file.glb", { encoding: "binary" });

  return URL.createObjectURL(
    // @ts-ignore
    new Blob([glbFile.buffer], { type: "model/gltf-binary" }),
  );
}

export async function glbToStlUrl(glbUrl: string): Promise<string> {
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const { STLExporter } = await import(
    "three/examples/jsm/exporters/STLExporter.js"
  );
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(glbUrl);

  const exporter = new STLExporter();
  const stlString = exporter.parse(gltf.scene);

  return URL.createObjectURL(new Blob([stlString], { type: "model/stl" }));
}

export async function glbToStlObj(glbUrl: string): Promise<string> {
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const { STLExporter } = await import(
    "three/examples/jsm/exporters/STLExporter.js"
  );
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(glbUrl);

  const exporter = new STLExporter();
  const stlString = exporter.parse(gltf.scene);

  return URL.createObjectURL(new Blob([stlString], { type: "model/stl" }));
}

export async function glbToObjUrl(glbUrl: string): Promise<string> {
  const { GLTFLoader } = await import(
    "three/examples/jsm/loaders/GLTFLoader.js"
  );
  const { OBJExporter } = await import(
    "three/examples/jsm/exporters/OBJExporter.js"
  );
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(glbUrl);

  const exporter = new OBJExporter();
  const objText = exporter.parse(gltf.scene); // OBJ string

  return URL.createObjectURL(new Blob([objText], { type: "text/plain" }));
}
