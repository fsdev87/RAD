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
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    historyOfPresentIllness: {
      type: String,
    },
    physicalExamination: {
      type: String,
    },
    vitalSigns: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      heartRate: Number,
      temperature: Number, // in Celsius
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: Number, // in kg
      height: Number, // in cm
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
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
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ doctor: 1, visitDate: -1 });
medicalRecordSchema.index({ appointment: 1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
