import { cp, rm, rename } from "fs/promises";
import { existsSync } from "fs";

await cp("dist/index.html", "dist/404.html");

if (existsSync("../docs")) {
  await rm("../docs", { recursive: true, force: true });
}

await rename("dist", "../docs");
