import { Router } from "express";
import { createRepo } from "../controllers/repository.controller";

const repoRouter = Router();

repoRouter.post("/", createRepo);

export default repoRouter;
