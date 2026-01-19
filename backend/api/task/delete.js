// api/tasks/delete.js
import mongoose from "mongoose";
import Task from "../../models/Task.js";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      await connectDB();
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Task ID required" });
      }

      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
