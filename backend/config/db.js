const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully ✅");
  } catch (err) {
    console.error("MongoDB connection error: ❌", err);
    process.exit(1); // കണക്ഷൻ പരാജയപ്പെട്ടാൽ സെർവർ നിർത്താൻ
  }
};

module.exports = connectDB;