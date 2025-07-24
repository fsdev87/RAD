const express = require("express");
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const { auth, requirePatient, requireDoctor } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/prescriptions
// @desc    Create a new prescription
// @access  Private (Doctors)
router.post("/", auth, requireDoctor, async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      diagnosis,
      medications,
      notes,
      followUpDate,
      followUpInstructions,
      labTests,
      lifestyle,
    } = req.body;

    // Verify appointment belongs to this doctor
    if (appointmentId) {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: req.user._id,
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found or access denied",
        });
      }
    }

    // Create prescription
    const prescription = new Prescription({
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId,
      diagnosis,
      medications,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpInstructions,
      labTests: labTests || [],
      lifestyle: lifestyle || {},
    });

    await prescription.save();

    // Update appointment with prescription reference
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        prescription: prescription._id,
      });
    }

    // Populate patient and doctor info
    await prescription.populate([
      { path: "patient", select: "name email phone" },
      { path: "doctor", select: "name specialization" },
    ]);

    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: { prescription },
    });
  } catch (error) {
    console.error("Create prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating prescription",
      error: error.message,
    });
  }
});

// @route   GET /api/prescriptions/patient
// @desc    Get prescriptions for current patient
// @access  Private (Patients)
router.get("/patient", auth, requirePatient, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { patient: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const prescriptions = await Prescription.find(filter)
      .populate("doctor", "name specialization")
      .populate("appointment", "date time")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prescription.countDocuments(filter);

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get patient prescriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching prescriptions",
      error: error.message,
    });
  }
});

// @route   GET /api/prescriptions/doctor
// @desc    Get prescriptions created by current doctor
// @access  Private (Doctors)
router.get("/doctor", auth, requireDoctor, async (req, res) => {
  try {
    const { status, patientName, page = 1, limit = 10 } = req.query;

    const filter = { doctor: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    let prescriptions = await Prescription.find(filter)
      .populate("patient", "name email phone")
      .populate("appointment", "date time")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter by patient name if provided
    if (patientName) {
      prescriptions = prescriptions.filter((p) =>
        p.patient.name.toLowerCase().includes(patientName.toLowerCase())
      );
    }

    const total = await Prescription.countDocuments(filter);

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get doctor prescriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching prescriptions",
      error: error.message,
    });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get prescription by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "name email phone dateOfBirth gender address")
      .populate("doctor", "name specialization licenseNumber")
      .populate("appointment", "date time reason");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    // Check authorization
    const isAuthorized =
      prescription.patient._id.equals(req.user._id) ||
      prescription.doctor._id.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: { prescription },
    });
  } catch (error) {
    console.error("Get prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching prescription",
      error: error.message,
    });
  }
});

// @route   PUT /api/prescriptions/:id
// @desc    Update prescription
// @access  Private (Doctors)
router.put("/:id", auth, requireDoctor, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    // Check if this is the doctor's prescription
    if (!prescription.doctor.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update prescription
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        prescription[key] = updates[key];
      }
    });

    await prescription.save();

    await prescription.populate([
      { path: "patient", select: "name email phone" },
      { path: "doctor", select: "name specialization" },
    ]);

    res.json({
      success: true,
      message: "Prescription updated successfully",
      data: { prescription },
    });
  } catch (error) {
    console.error("Update prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating prescription",
      error: error.message,
    });
  }
});

// @route   PUT /api/prescriptions/:id/status
// @desc    Update prescription status
// @access  Private (Doctors)
router.put("/:id/status", auth, requireDoctor, async (req, res) => {
  try {
    const { status } = req.body;

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    // Check if this is the doctor's prescription
    if (!prescription.doctor.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    prescription.status = status;
    await prescription.save();

    res.json({
      success: true,
      message: "Prescription status updated successfully",
      data: { prescription },
    });
  } catch (error) {
    console.error("Update prescription status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating prescription status",
      error: error.message,
    });
  }
});

module.exports = router;
