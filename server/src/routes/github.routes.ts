import { Router } from "express";
import { testGithubRepository } from "../controllers/github.controller";

const githubRouter = Router();

githubRouter.get("/test", testGithubRepository);

export default githubRouter;
