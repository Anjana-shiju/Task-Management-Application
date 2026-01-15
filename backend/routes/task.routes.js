const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const TaskHistory = require("../models/TasHistory");

// helper
const todayString = () => new Date().toISOString().split("T")[0];

// ➕ ADD TASK
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      taskType: req.body.taskType, // today | daily | weekly
      user: req.userId,
    });

    res.json(task);
  } catch {
    res.status(500).json("Task creation failed");
  }
});

// ✅ MARK AS DONE
router.put("/done/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) return res.status(404).json("Task not found");

    const today = todayString();

    // prevent duplicate completion for same day
    const alreadyDone = await TaskHistory.findOne({
      taskId: task._id,
      user: req.userId,
      date: today,
    });

    if (!alreadyDone) {
      await TaskHistory.create({
        taskId: task._id,
        user: req.userId,
        date: today,
      });
    }

    task.lastCompletedAt = new Date();
    await task.save();

    res.json({ message: "Task marked as done" });
  } catch {
    res.status(500).json("Update failed");
  }
});

// 📄 GET TASKS BY TYPE
router.get("/:type", auth, async (req, res) => {
  try {
    const type = req.params.type;
    const userId = req.userId;
    const today = todayString();

    // TODAY TASKS
    if (type === "today") {
      const tasks = await Task.find({
        user: userId,
        taskType: "today",
        createdAt: {
          $gte: new Date(today),
        },
      }).sort({ createdAt: -1 });

      return res.json(tasks);
    }

    // DAILY / WEEKLY
    const tasks = await Task.find({
      user: userId,
      taskType: type,
    });

    const completedToday = await TaskHistory.find({
      user: userId,
      date: today,
    }).select("taskId");

    const completedIds = completedToday.map((h) => h.taskId.toString());

    const filtered = tasks.filter(
      (t) => !completedIds.includes(t._id.toString())
    );

    res.json(filtered);
  } catch {
    res.status(500).json("Fetch failed");
  }
});

// ❌ DELETE TASK (permanent)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    await TaskHistory.deleteMany({
      taskId: req.params.id,
      user: req.userId,
    });

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json("Delete failed");
  }
});

module.exports = router;
