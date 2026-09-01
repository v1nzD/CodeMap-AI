import type { NextFunction, Request, Response } from "express";
import { createRepository } from "../services/repositories/repositories.service";

export async function createRepo(req: Request, res: Response) {
  const { owner, name, url } = req.body;

  if (!owner || !name || !url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const repository = await createRepository(owner, name, url);
  return res.status(201).json({ data: repository });
}
