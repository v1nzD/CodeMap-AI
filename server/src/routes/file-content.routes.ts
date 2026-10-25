import { Router } from "express";

import { getRepositoryFileContentController } from "../controllers/file-content.controller";

const fileContentRouter = Router();

fileContentRouter.get(
  "/repositories/:id/file-content",
  getRepositoryFileContentController,
);

export default fileContentRouter;
