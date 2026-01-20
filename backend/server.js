// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();

// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("DB error:", err));

// app.use(cors());
// app.use(express.json());

// // ✅ USE api/index.js ONLY
// app.use("/api", require("./api"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));




const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

app.use(cors());
app.use(express.json());

// API റൂട്ടുകൾ
app.use("/api", require("./api"));

const PORT = process.env.PORT || 5000;

// വെർസലിൽ ഡിപ്ലോയ് ചെയ്യുമ്പോൾ ഇത് ആവശ്യമാണ്
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app; // ഇത് നിർബന്ധമായും ചേർക്കുക