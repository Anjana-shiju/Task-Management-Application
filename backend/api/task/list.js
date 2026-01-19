// api/tasks/list.js
import mongoose from "mongoose";
import Task from "../../models/Task.js";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId required" });
      }

      // ✅ fetch tasks for this user
      const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

      return res.status(200).json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
