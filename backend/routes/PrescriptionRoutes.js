const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");

// Doctor submits prescription
router.post("/", async (req, res) => {
  try {
    const presc = new Prescription(req.body);
    const saved = await presc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View all prescriptions
router.get("/", async (req, res) => {
  const prescs = await Prescription.find()
    .populate("doctorId", "name email")
    .populate({
      path: "symptomId",
      populate: { path: "userId", select: "name email" }
    });

  res.json(prescs);
});

module.exports = router;
