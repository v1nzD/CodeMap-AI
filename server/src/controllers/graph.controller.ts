import type { Request, Response } from "express";
import { getRepositoryGraph } from "../services/graph/graph.service";

export async function getRepositoryGraphController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const repositoryId = Number(req.params.id);

  // validate repository id
  if (!Number.isInteger(repositoryId) || repositoryId <= 0) {
    return res.status(400).json({
      error: "Invalid repository ID",
    });
  }

  const graph = await getRepositoryGraph(repositoryId);

  // repository does not exist
  if (graph == null) {
    return res.status(404).json({
      error: "Repository not found",
    });
  }

  return res.status(200).json({ data: graph });
}
