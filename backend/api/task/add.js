// api/tasks/add.js
import mongoose from "mongoose";
import Task from "../../models/Task.js";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDB();
      const { title, description, taskType, user } = req.body;

      if (!title || !taskType || !user) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const task = new Task({
        title,
        description,
        taskType,
        user,
      });

      await task.save();

      return res.status(201).json({ message: "Task added", task });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
