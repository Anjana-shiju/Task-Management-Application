// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// // Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5173",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json());

// // Routes
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/tasks", require("./routes/task.routes"));

// app.get("/", (req, res) => {
//   res.send("Backend running locally ✅");
// });

// // Start server (LOCAL)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// 1. MongoDB Connection
// Render-ലെ Environment Variables-ൽ MONGO_URL സെറ്റ് ചെയ്യാൻ മറക്കരുത്
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully ✅"))
  .catch((err) => console.error("MongoDB connection error: ❌", err));


app.use(cors());
app.use(express.json());


app.use("/api", require("./api/index"));


app.get("/", (req, res) => {
  res.send("Backend is running live on Render! 🚀");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});