const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const corsOptions = {
  origin: "https://frontttask-management-application-7xgl-bzabax0qe.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

// ✅ CORS middleware
app.use(cors(corsOptions));

// ✅ VERY IMPORTANT (preflight fix)
app.options("*", cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ❌ DO NOT listen in Vercel
module.exports = app;
