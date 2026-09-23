import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";

const router = express.Router();

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  next();
};

// GET /tasks — retrieve all tasks (newest first)
router.get("/", async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /tasks — create a task (title required, dueDate optional)
router.post("/", async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Task title is required and cannot be empty" });
    }

    let due = null;
    if (dueDate) {
      const parsed = new Date(dueDate);
      if (isNaN(parsed.getTime())) {
        return res.status(400).json({ error: "Invalid due date" });
      }
      due = parsed;
    }

    const task = await Task.create({ title: title.trim(), dueDate: due });
    res.status(201).json(task);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /tasks/:id — edit title/dueDate/status, or toggle when body is empty
router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, dueDate, status } = req.body;
    const hasEdits =
      title !== undefined || dueDate !== undefined || status !== undefined;

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ error: "Task title cannot be empty" });
      }
      task.title = title.trim();
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === "") {
        task.dueDate = null;
      } else {
        const parsed = new Date(dueDate);
        if (isNaN(parsed.getTime())) {
          return res.status(400).json({ error: "Invalid due date" });
        }
        task.dueDate = parsed;
      }
    }

    if (status !== undefined) {
      if (!["pending", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      task.status = status;
    }

    if (!hasEdits) {
      task.status = task.status === "completed" ? "pending" : "completed";
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /tasks/:id
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
