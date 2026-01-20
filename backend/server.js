const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// ✅ CORS (frontend vercel url allow)
app.use(cors({
  origin: "https://task-management-application-23b7.vercel.app"
}));

app.use(express.json());

// ✅ API routes
app.use("/api", require("./api"));

// ❌ DO NOT use app.listen() in Vercel
// app.listen(PORT, ...)

module.exports = app; // ⭐ MUST for Vercel
