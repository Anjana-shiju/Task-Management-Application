// api/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("../routes/auth.routes");
const taskRoutes = require("../routes/task.routes");

router.use("/auth", authRoutes);

// 🔥 CHANGE HERE
router.use("/tasks", taskRoutes);

module.exports = router;
