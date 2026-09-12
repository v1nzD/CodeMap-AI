import { Router } from "express";
import { getRepositoryGraphController } from "../controllers/graph.controller";

const graphRouter = Router();

graphRouter.get("/repositories/:id/graph", getRepositoryGraphController);

export default graphRouter;
