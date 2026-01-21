const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// ✅ CORS (allow local + vercel frontend)
app.use(cors({
  origin: [
    "http://localhost:3000", // local dev
    "https://fronttask-management-application-7xgl-no59ma310.vercel.app"
 // Vercel frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.options("*", cors()); // handle preflight requests

// ✅ Middleware
app.use(express.json());

// ✅ API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));


 app.get("/", (req, res) => { res.send("Backend is running ✅"); });

// ✅ Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ✅ Export for Vercel
module.exports = app;
