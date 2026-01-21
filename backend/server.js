const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// ✅ CORS (local + production frontend allow)
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "https://frontttask-management-application-7.vercel.app/"
    ],
    credentials: true
  })
);

app.use(express.json());

// ✅ API routes
app.use("/api", require("./api"));

// ❌ DO NOT use app.listen() in Vercel
module.exports = app;
