const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      default: 30,
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["consultation", "follow-up", "emergency", "routine-checkup"],
      default: "consultation",
    },
    reason: {
      type: String,
      required: true,
    },
    symptoms: [String],
    notes: {
      type: String,
    },
    // Doctor's notes after the appointment
    diagnosis: {
      type: String,
    },
    treatmentPlan: {
      type: String,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    // Payment information
    consultationFee: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "insurance", "online"],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    // Cancellation information
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ date: 1, time: 1 });

// Prevent double booking
appointmentSchema.index(
  {
    doctor: 1,
    date: 1,
    time: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $nin: ["cancelled", "no-show"] },
    },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
