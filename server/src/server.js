import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { authMiddleWare } from "./middleware/authMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import rateLimiter from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import listsRoutes from "./routes/listsRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

const result = dotenv.config();

if (result.error) {
  console.warn(
    ".env file not found. Falling back to existing environment variables.",
  );
}

const requiredEnv = ["JWT_SECRET_KEY", "MONGO_URI", "CLIENT_URL"];

const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());
app.use(rateLimiter);

// DOC: Public Routes
app.use("/api/auth", authRoutes);

// DOC: Protected Routes
app.use(authMiddleWare);
app.use("/api/tasks", tasksRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/notes", notesRoutes);
app.use(errorMiddleware);

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("Failed to start server.");
  console.error(err.stack ?? err);
  process.exit(1);
}
