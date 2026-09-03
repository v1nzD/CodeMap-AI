import type { NextFunction, Request, Response } from "express";
import {
  createRepository,
  deleteRepository,
  getAllRepositories,
  getRepositoryById,
} from "../services/repositories/repositories.service";
import { createRepositorySchema } from "../validators/repositories.validator";

export async function createRepo(req: Request, res: Response) {
  // validate using zod
  const result = createRepositorySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.issues,
    });
  }

  // destructure data
  const { owner, name, url } = result.data;

  const repository = await createRepository(owner, name, url);
  return res.status(201).json({ data: repository });
}

export async function getAllRepo(req: Request, res: Response) {
  const repositories = await getAllRepositories();

  return res.status(200).json({
    data: repositories,
  });
}

export async function getRepoById(req: Request, res: Response) {
  const id = Number(req.params.id);

  // validate id
  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "Invalid repository ID",
    });
  }

  const repository = await getRepositoryById(id);

  if (!repository) {
    return res.status(404).json({ error: "Repository not found" });
  }

  return res.status(200).json({ data: repository });
}

export async function deleteRepo(req: Request, res: Response) {
  const id = Number(req.params.id);

  // validate id
  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "Invalid repository ID",
    });
  }

  const repository = await deleteRepository(id);

  if (!repository) {
    return res.status(404).json({ error: "Repository not found" });
  }

  return res
    .status(200)
    .json({ message: "Repository deleted", data: repository });
}
