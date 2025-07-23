 const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create user (signup)
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users (for admin/dev only)
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
