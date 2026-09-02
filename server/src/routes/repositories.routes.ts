import { Router } from "express";
import {
  createRepo,
  deleteRepo,
  getAllRepo,
  getRepoById,
} from "../controllers/repository.controller";

const repoRouter = Router();

repoRouter.post("/", createRepo);
repoRouter.get("/", getAllRepo);
repoRouter.get("/:id", getRepoById);
repoRouter.delete("/:id", deleteRepo);

export default repoRouter;
