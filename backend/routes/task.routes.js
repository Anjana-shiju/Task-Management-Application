const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// ➕ ADD TASK
router.post("/add", auth, async (req, res) => {
  try {
    const { title, description, taskType } = req.body;
    
    // Task മോഡലിലെ .create() ഇപ്പോൾ വർക്ക് ആകും
    const task = await Task.create({
      title,
      description,
      taskType: taskType.toLowerCase(),
      user: req.userId, // auth middleware-ൽ നിന്ന് കിട്ടുന്നത്
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Task Add Error:", err);
    res.status(500).json({ message: "Task creation failed", error: err.message });
  }
});

// 📥 GET TASKS BY TYPE
router.get("/:type", auth, async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.userId;
    
    let query = { user: userId, taskType: type };

    // Today ആണെങ്കിൽ ഇന്നത്തെ ടാസ്ക്കുകൾ മാത്രം
    if (type === "today") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      query.createdAt = { $gte: startOfToday };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

// ✅ MARK AS DONE
router.put("/done/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status: "done", lastCompletedAt: new Date() },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// 🗑 DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;




