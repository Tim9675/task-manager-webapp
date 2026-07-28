import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import app from "./app.js";

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

const PORT = process.env.PORT || 5001;

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
