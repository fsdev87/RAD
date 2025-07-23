const express = require("express");
const router = express.Router();
const Symptom = require("../models/Symptom");

// Submit symptoms
router.post("/", async (req, res) => {
  try {
    const symptom = new Symptom(req.body);
    const saved = await symptom.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all symptom entries (for doctors)
router.get("/", async (req, res) => {
  const symptoms = await Symptom.find().populate("userId", "name email");
  res.json(symptoms);
});

module.exports = router;
