import { Router } from "express";
import {
  getGitHubFileTree,
  testGithubRepository,
} from "../controllers/github.controller";

const githubRouter = Router();

githubRouter.get("/:owner/:name/tree", getGitHubFileTree);
githubRouter.get("/test", testGithubRepository);

export default githubRouter;
