import initOpenCascade, { OpenCascadeInstance } from "opencascade.js";

let occ: OpenCascadeInstance | null = null;
export const initOCC = async () => {
  if (occ) return occ;
  occ = await initOpenCascade();
  return occ;
};
export const getOCC = () => {
  if (!occ) throw new Error("OpenCascade not initialized yet!");
  return occ;
};

// @ts-ignore
if (import.meta.hot) {
  // Do NOT dispose this module during HMR
  // @ts-ignore
  import.meta.hot.accept();
}
