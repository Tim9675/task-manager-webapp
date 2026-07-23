import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import tasksRoutes from "./routes/tasksRoutes.js";
import listsRoutes from "./routes/listsRoutes.js";
import tagsRoutes from "./routes/tagsRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { authMiddleWare } from "./middleware/authMiddleware.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json()); // makes req.body available as JSON
app.use(rateLimiter);

//Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use(authMiddleWare);

app.use("/api/tasks", tasksRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
