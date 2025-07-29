const express = require("express");
const router = express.Router();
const MedicalRecord = require("../models/MedicalRecord");
const { auth, requireDoctor, requirePatient } = require("../middleware/auth");

// @route   GET /api/medical-records/patient
// @desc    Get all medical records for a patient
// @access  Private (Patient only)
router.get("/patient", auth, requirePatient, async (req, res) => {
  try {
    const { page = 1, limit = 10, doctorId, condition } = req.query;

    // Build filter
    const filter = { patient: req.user._id };
    if (doctorId) filter.doctor = doctorId;
    if (condition) {
      filter.$or = [
        { diagnosis: { $regex: condition, $options: "i" } },
        { symptoms: { $regex: condition, $options: "i" } },
        { treatment: { $regex: condition, $options: "i" } },
      ];
    }

    // Get records with pagination
    const records = await MedicalRecord.find(filter)
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason")
      .sort({ recordDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get patient medical records error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
    });
  }
});

// @route   GET /api/medical-records/doctor
// @desc    Get all medical records created by a doctor
// @access  Private (Doctor only)
router.get("/doctor", auth, requireDoctor, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientName, diagnosis } = req.query;

    // Build filter
    const filter = { doctor: req.user._id };
    if (diagnosis) {
      filter.$or = [
        { diagnosis: { $regex: diagnosis, $options: "i" } },
        { symptoms: { $regex: diagnosis, $options: "i" } },
        { treatment: { $regex: diagnosis, $options: "i" } },
      ];
    }

    // Get records with pagination
    let query = MedicalRecord.find(filter)
      .populate("patient", "name email phone dateOfBirth")
      .populate("appointment", "date time reason")
      .sort({ recordDate: -1 });

    // Filter by patient name if provided
    if (patientName) {
      query = query.populate({
        path: "patient",
        match: { name: { $regex: patientName, $options: "i" } },
        select: "name email phone dateOfBirth",
      });
    }

    const records = await query.limit(limit * 1).skip((page - 1) * limit);

    // Filter out records where patient doesn't match (due to populate filter)
    const filteredRecords = records.filter((record) => record.patient);

    const total = await MedicalRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        records: filteredRecords,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get doctor medical records error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
    });
  }
});

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get medical records for a specific patient (doctor view)
// @access  Private (Doctor only)
router.get("/patient/:patientId", auth, requireDoctor, async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason")
      .sort({ recordDate: -1 });

    res.json({
      success: true,
      data: { records },
    });
  } catch (error) {
    console.error("Get patient records for doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient medical records",
    });
  }
});

// @route   POST /api/medical-records
// @desc    Create a new medical record
// @access  Private (Doctor only)
router.post("/", auth, requireDoctor, async (req, res) => {
  try {
    const {
      patient,
      appointment,
      diagnosis,
      symptoms,
      treatment,
      medications,
      notes,
      followUpRequired,
      followUpDate,
      vitalSigns,
    } = req.body;

    // Validation
    if (!patient || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: "Patient and diagnosis are required",
      });
    }

    const medicalRecord = new MedicalRecord({
      patient,
      doctor: req.user._id,
      appointment: appointment || null,
      diagnosis,
      symptoms: symptoms || "",
      treatment: treatment || "",
      medications: medications || [],
      notes: notes || "",
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      vitalSigns: vitalSigns || {},
      recordDate: new Date(),
    });

    await medicalRecord.save();

    // Populate the created record for response
    await medicalRecord.populate("patient", "name email");
    await medicalRecord.populate("doctor", "name specialization");
    if (appointment) {
      await medicalRecord.populate("appointment", "date time reason");
    }

    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: { record: medicalRecord },
    });
  } catch (error) {
    console.error("Create medical record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create medical record",
    });
  }
});

// @route   PUT /api/medical-records/:id
// @desc    Update a medical record
// @access  Private (Doctor only - can only update own records)
router.put("/:id", auth, requireDoctor, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      diagnosis,
      symptoms,
      treatment,
      medications,
      notes,
      followUpRequired,
      followUpDate,
      vitalSigns,
    } = req.body;

    // Find the record and check ownership
    const record = await MedicalRecord.findById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    if (record.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this medical record",
      });
    }

    // Update the record
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      {
        diagnosis,
        symptoms,
        treatment,
        medications,
        notes,
        followUpRequired,
        followUpDate,
        vitalSigns,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    )
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason");

    res.json({
      success: true,
      message: "Medical record updated successfully",
      data: { record: updatedRecord },
    });
  } catch (error) {
    console.error("Update medical record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update medical record",
    });
  }
});

// @route   DELETE /api/medical-records/:id
// @desc    Delete a medical record
// @access  Private (Doctor only - can only delete own records)
router.delete("/:id", auth, requireDoctor, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the record and check ownership
    const record = await MedicalRecord.findById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    if (record.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this medical record",
      });
    }

    await MedicalRecord.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Medical record deleted successfully",
    });
  } catch (error) {
    console.error("Delete medical record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete medical record",
    });
  }
});

// @route   GET /api/medical-records/:id
// @desc    Get a specific medical record
// @access  Private (Patient can view their own, Doctor can view their created records)
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const record = await MedicalRecord.findById(id)
      .populate("patient", "name email phone dateOfBirth")
      .populate("doctor", "name specialization")
      .populate("appointment", "date time reason");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    // Check authorization
    const isPatient =
      req.user.role === "patient" &&
      record.patient._id.toString() === req.user._id.toString();
    const isDoctor =
      req.user.role === "doctor" &&
      record.doctor._id.toString() === req.user._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this medical record",
      });
    }

    res.json({
      success: true,
      data: { record },
    });
  } catch (error) {
    console.error("Get medical record error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medical record",
    });
  }
});

module.exports = router;
