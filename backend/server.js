const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* =======================
   MongoDB Connection
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* =======================
   CORS (IMPORTANT FIX)
======================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-management-application-dl9q-j14t3tua8.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

// preflight support
app.options("*", cors());

/* =======================
   Middleware
======================= */
app.use(express.json());

/* =======================
   Routes
======================= */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

/* =======================
   Test Route
======================= */
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/* =======================
   Local server only
======================= */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

/* =======================
   Export for Vercel
======================= */
module.exports = app;
