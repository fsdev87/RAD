const express = require("express");
const User = require("../models/User");
const { auth, requirePatient } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Private (Patients)
router.get("/", auth, requirePatient, async (req, res) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { role: "doctor" };

    if (specialization && specialization !== "all") {
      filter.specialization = { $regex: specialization, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    const doctors = await User.find(filter)
      .select("-password")
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching doctors",
      error: error.message,
    });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: { doctor },
    });
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching doctor",
      error: error.message,
    });
  }
});

// @route   GET /api/doctors/:id/availability
// @desc    Get doctor's availability
// @access  Private
router.get("/:id/availability", auth, async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("availability");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: { availability: doctor.availability || [] },
    });
  } catch (error) {
    console.error("Get availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching availability",
      error: error.message,
    });
  }
});

// @route   GET /api/doctors/specializations
// @desc    Get all unique specializations
// @access  Private
router.get("/meta/specializations", auth, async (req, res) => {
  try {
    const specializations = await User.distinct("specialization", {
      role: "doctor",
      specialization: { $exists: true, $ne: null },
    });

    res.json({
      success: true,
      data: { specializations },
    });
  } catch (error) {
    console.error("Get specializations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching specializations",
      error: error.message,
    });
  }
});

module.exports = router;
