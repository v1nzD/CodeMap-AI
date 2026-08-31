import express from "express";
import healthRouter from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use("/api", healthRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
