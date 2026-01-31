import path from "path";
import fs from "fs/promises";
import { Request, Response } from "express";

export const serveIndexJson =
  (folder: string) => async (req: Request, res: Response) => {
    try {
      // Determine folder to list
      const subPath = req.params[0] || "";
      const folderPath = path.join(folder, subPath);

      // Read directory contents
      const entries = await fs.readdir(folderPath, { recursive: true });

      // Return JSON with name and type
      const listing = entries.filter((o) => o.endsWith(".ts"));

      res.json(listing);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to read directory" });
    }
  };
