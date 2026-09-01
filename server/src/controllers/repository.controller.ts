import type { NextFunction, Request, Response } from "express";
import { createRepository } from "../services/repositories/repositories.service";
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
