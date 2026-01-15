const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router(); // 🔥 REQUIRED

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed
    });

    await user.save();
    console.log("USER SAVED");

    res.status(201).json("Registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
