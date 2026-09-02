import type { Request, Response } from "express";
import {
  getGithubFileTree,
  getGithubRepository,
} from "../services/github/github.service";
export async function testGithubRepository(req: Request, res: Response) {
  const repo = await getGithubFileTree("v1nzD", "PingUp");

  return res.status(200).json({ data: repo });
}
