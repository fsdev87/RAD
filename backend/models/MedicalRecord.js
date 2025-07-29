const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    recordDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
    },
    treatment: {
      type: String,
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    vitalSigns: {
      bloodPressure: String,
      heartRate: String,
      temperature: String,
      weight: String,
    },
    notes: {
      type: String,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
    // Keep legacy fields for backward compatibility
    visitDate: {
      type: Date,
      default: Date.now,
    },
    chiefComplaint: {
      type: String,
    },
    historyOfPresentIllness: {
      type: String,
    },
    physicalExamination: {
      type: String,
    },
    labResults: [
      {
        testName: String,
        result: String,
        normalRange: String,
        date: Date,
        status: {
          type: String,
          enum: ["normal", "abnormal", "pending"],
          default: "normal",
        },
      },
    ],
    attachments: [
      {
        fileName: String,
        fileType: String,
        filePath: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
medicalRecordSchema.index({ patient: 1, recordDate: -1 });
medicalRecordSchema.index({ doctor: 1, recordDate: -1 });
medicalRecordSchema.index({ appointment: 1 });
medicalRecordSchema.index({ patient: 1, visitDate: -1 }); // Legacy support

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
