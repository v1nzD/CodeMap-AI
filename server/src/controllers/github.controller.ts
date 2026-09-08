import type { Request, Response } from "express";
import {
  getGithubFileTree as getGithubFileTreeService,
  getGithubRepository,
} from "../services/github/github.service";
import { buildFileTree } from "../utils/buildFileTree";
import { analyzeGithubRepository } from "../services/analyzer/repository-analyzer.service";
import { getRepositoryByGithub } from "../services/repositories/repositories.service";

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

export async function analyzeGithubRepositoryController(
  req: Request<{ owner: string; name: string }>,
  res: Response,
) {
  const { owner, name } = req.params;

  const repository = await getRepositoryByGithub(owner, name);

  if (!repository) {
    return res.status(404).json({
      error: "Repository has not been added",
    });
  }

  const analysis = await analyzeGithubRepository(owner, name, repository.id);

  return res.status(200).json({ data: analysis });
}
