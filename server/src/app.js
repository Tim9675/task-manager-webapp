import express from "express";
import cors from "cors";

import { authMiddleWare } from "./middleware/authMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";
import { loginLimiter, registerLimiter, apiLimiter } from "./config/upstash.js";
import authRoutes from "./routes/authRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import listsRoutes from "./routes/listsRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    exposedHeaders: ["Retry-After"],
  }),
);
app.use(express.json());
app.use("/api/auth/login", createRateLimiter(loginLimiter));
app.use("/api/auth/register", createRateLimiter(registerLimiter));

// DOC: Public Routes
app.use("/api/auth", authRoutes);

// DOC: Protected Routes
app.use(authMiddleWare);
app.use(createRateLimiter(apiLimiter));
app.use("/api/tasks", tasksRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/notes", notesRoutes);
app.use(errorMiddleware);

export default app;
