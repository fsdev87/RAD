const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { auth, requirePatient, requireDoctor } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Patients)
router.post("/", auth, requirePatient, async (req, res) => {
  try {
    const { doctorId, date, time, reason, symptoms, type } = req.body;

    // Verify doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $nin: ["cancelled", "no-show"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      time,
      reason,
      symptoms: symptoms || [],
      type: type || "consultation",
      consultationFee: doctor.consultationFee,
    });

    await appointment.save();

    // Populate patient and doctor info
    await appointment.populate([
      { path: "patient", select: "name email phone" },
      { path: "doctor", select: "name specialization" },
    ]);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
});

// @route   GET /api/appointments/patient
// @desc    Get appointments for current patient
// @access  Private (Patients)
router.get("/patient", auth, requirePatient, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { patient: req.user._id };
    if (status) {
      // Handle multiple status values (e.g., "confirmed,pending,scheduled")
      const statusArray = status.split(",");
      filter.status = { $in: statusArray };
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
      .populate("doctor", "name specialization avatar")
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get patient appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
      error: error.message,
    });
  }
});

// @route   GET /api/appointments/doctor
// @desc    Get appointments for current doctor
// @access  Private (Doctors)
router.get("/doctor", auth, requireDoctor, async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;

    const filter = { doctor: req.user._id };

    if (status) {
      // Handle multiple status values (e.g., "confirmed,pending,scheduled")
      const statusArray = status.split(",");
      filter.status = { $in: statusArray };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email phone dateOfBirth gender")
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
      error: error.message,
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone dateOfBirth gender address")
      .populate("doctor", "name specialization")
      .populate("prescription");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check authorization
    const isAuthorized =
      appointment.patient._id.equals(req.user._id) ||
      appointment.doctor._id.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: { appointment },
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching appointment",
      error: error.message,
    });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check authorization
    const isAuthorized =
      appointment.patient.equals(req.user._id) ||
      appointment.doctor.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update appointment
    appointment.status = status;

    if (status === "cancelled") {
      appointment.cancelledBy = req.user._id;
      appointment.cancellationReason = reason;
      appointment.cancelledAt = new Date();
    }

    await appointment.save();

    await appointment.populate([
      { path: "patient", select: "name email" },
      { path: "doctor", select: "name specialization" },
    ]);

    res.json({
      success: true,
      message: "Appointment status updated successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating appointment",
      error: error.message,
    });
  }
});

// @route   PUT /api/appointments/:id/complete
// @desc    Complete appointment with diagnosis
// @access  Private (Doctors)
router.put("/:id/complete", auth, requireDoctor, async (req, res) => {
  try {
    const { diagnosis, treatmentPlan, followUpRequired, followUpDate, notes } =
      req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if this is the doctor's appointment
    if (!appointment.doctor.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update appointment
    appointment.status = "completed";
    appointment.diagnosis = diagnosis;
    appointment.treatmentPlan = treatmentPlan;
    appointment.followUpRequired = followUpRequired;
    appointment.followUpDate = followUpDate ? new Date(followUpDate) : null;
    appointment.notes = notes;

    await appointment.save();

    await appointment.populate([
      { path: "patient", select: "name email" },
      { path: "doctor", select: "name specialization" },
    ]);

    res.json({
      success: true,
      message: "Appointment completed successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Complete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while completing appointment",
      error: error.message,
    });
  }
});

module.exports = router;
