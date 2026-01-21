const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ MongoDB connect (FIXED)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fronttask-management-application-7xgl-bzabax0qe.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ❌ DO NOT listen on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// ✅ REQUIRED for Vercel
module.exports = app;
