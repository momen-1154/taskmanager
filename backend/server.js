import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "TaskFlow Manager API is running" });
});

app.use("/tasks", taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskflow";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
