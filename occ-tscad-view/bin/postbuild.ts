import { cp, rm, rename, exists } from "fs/promises";

if (await exists("../docs")) {
  await rm("../docs", { recursive: true, force: true });
}
await rename("dist", "../docs");
