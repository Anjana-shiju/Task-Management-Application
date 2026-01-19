// api/tasks/history.js
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
      if (!userId) return res.status(400).json({ message: "userId required" });

      // ✅ find completed tasks
      const tasks = await Task.find({
        user: userId,
        status: "done",
        lastCompletedAt: { $ne: null },
      });

      // ✅ return completion dates
      const history = tasks.map((t) => ({
        date: t.lastCompletedAt.toISOString().split("T")[0],
        taskId: t._id,
        title: t.title,
      }));

      return res.status(200).json(history);
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
