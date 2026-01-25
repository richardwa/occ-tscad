import { cp, rm, rename, access } from "fs/promises";

try {
  await access("../docs");
  await rm("../docs", { recursive: true, force: true });
} catch {}
await rename("dist", "../docs");
