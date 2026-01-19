// api/tasks/update.js
import mongoose from "mongoose";
import Task from "../../models/Task.js";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await connectDB();
      const { id, status } = req.body;

      const task = await Task.findByIdAndUpdate(
        id,
        {
          status,
          // ✅ if status is "done", set lastCompletedAt to now
          lastCompletedAt: status === "done" ? new Date() : null,
        },
        { new: true }
      );

      if (!task) return res.status(404).json({ message: "Task not found" });
      return res.status(200).json({ message: "Task updated", task });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
