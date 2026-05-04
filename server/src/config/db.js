import mongoose from "mongoose";
import promises from "node:dns/promises";

promises.setServers(["1.1.1.1", "8.8.8.8"]);

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}
