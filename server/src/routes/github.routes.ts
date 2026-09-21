import { Router } from "express";
import {
  analyzeGithubRepositoryController,
  getGitHubFileTree,
  testGithubRepository,
} from "../controllers/github.controller";

const githubRouter = Router();

githubRouter.get("/:owner/:name/tree", getGitHubFileTree);
githubRouter.get("/test", testGithubRepository);
githubRouter.post(
  "/repositories/:owner/:name/analyze",
  analyzeGithubRepositoryController,
);

export default githubRouter;
