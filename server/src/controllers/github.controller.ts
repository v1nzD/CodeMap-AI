import type { Request, Response } from "express";
import {
  getGithubFileTree as getGithubFileTreeService,
  getGithubRepository,
} from "../services/github/github.service";
import { buildFileTree } from "../utils/buildFileTree";
export async function testGithubRepository(req: Request, res: Response) {
  const repo = await getGithubFileTreeService("v1nzD", "PingUp");

  return res.status(200).json({ data: repo });
}

export async function getGitHubFileTree(
  req: Request<{ owner: string; name: string }>,
  res: Response,
) {
  const { owner, name } = req.params;

  const githubTree = await getGithubFileTreeService(owner, name);

  const fileTree = buildFileTree(githubTree.tree);

  return res.status(200).json({ data: fileTree });
}
