import type { Request, Response, NextFunction } from "express";

import { getRepositoryFileContent } from "../services/repositories/file-content.service";
import { error } from "node:console";

export async function getRepositoryFileContentController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const repositoryId = Number(req.params.id);
    const filePath = req.query.path;

    if (!Number.isInteger(repositoryId) || repositoryId <= 0) {
      return res.status(400).json({ error: "Invalid repository ID" });
    }

    if (typeof filePath !== "string" || filePath.trim().length === 0) {
      return res.status(400).json({ error: "A file path is required" });
    }

    const file = await getRepositoryFileContent(repositoryId, filePath);

    if (!file) {
      return res.status(400).json({ error: "File not found in repository" });
    }

    if (file.content === null) {
      return res.status(404).json({
        error: "Source content is unavailable. Re-analyze the repository",
      });
    }

    return res.status(200).json({
      data: {
        id: file.id,
        path: file.path,
        content: file.content,
      },
    });
  } catch (error) {
    next(error);
  }
}
