import express from "express";
import healthRouter from "./routes/health.routes";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

app.use("/api", healthRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
