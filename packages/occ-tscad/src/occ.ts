import initOpenCascade, { OpenCascadeInstance } from "opencascade.js";

let occ: OpenCascadeInstance | null = null;

export const initOCC = async () => {
  if (occ) return occ;
  console.log("loading occ");
  occ = await initOpenCascade();
  return occ;
};

export const getOCC = () => {
  if (!occ) throw new Error("OpenCascade not initialized yet!");
  return occ;
};

export const getOCCNullable = () => {
  return occ;
};
