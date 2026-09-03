import express from "express";
import healthRouter from "./routes/health.routes";
import cors from "cors";
import "dotenv/config";
import pool from "./database/connection";
import repoRouter from "./routes/repositories.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api/repositories", repoRouter);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB connected:", res.rows[0]);
  } catch (err) {
    console.error("DB connection failed", err);
  }

  console.log(`Server running on http://localhost:${PORT}`);
});
