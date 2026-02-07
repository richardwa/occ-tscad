type ModuleLoader = () => Promise<any>;

const modules: Record<string, ModuleLoader> = import.meta.glob(
  "../../models/**/*.ts",
);

export const getModelShape = async (file: string | undefined) => {
  const key = `../../models/${file}`;
  const loader = modules[key];
  const { main } = await loader();
  if (!main) {
    throw new Error(`${file}: must export "const main = () => Shape"`);
  }
  return main();
};
