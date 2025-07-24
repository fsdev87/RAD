const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "appointment_reminder",
        "appointment_confirmed",
        "appointment_cancelled",
        "appointment_rescheduled",
        "prescription_ready",
        "prescription_renewed",
        "test_results_available",
        "system_message",
        "payment_reminder",
        "payment_confirmed",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
    },
    relatedEntityType: {
      type: String,
      enum: ["Appointment", "Prescription", "MedicalRecord", "User"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    channel: {
      type: String,
      enum: ["in-app", "email", "sms"],
      default: "in-app",
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
notificationSchema.index({ recipient: 1, sentAt: -1 });
notificationSchema.index({ isRead: 1, sentAt: -1 });
notificationSchema.index({ type: 1, sentAt: -1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to create appointment reminder
notificationSchema.statics.createAppointmentReminder = async function (
  patientId,
  appointmentId,
  appointmentDate,
  doctorName
) {
  return this.create({
    recipient: patientId,
    type: "appointment_reminder",
    title: "Appointment Reminder",
    message: `You have an appointment with ${doctorName} tomorrow at ${appointmentDate}`,
    relatedEntity: appointmentId,
    relatedEntityType: "Appointment",
    priority: "high",
  });
};

// Static method to create prescription notification
notificationSchema.statics.createPrescriptionNotification = async function (
  patientId,
  prescriptionId,
  doctorName
) {
  return this.create({
    recipient: patientId,
    type: "prescription_ready",
    title: "Prescription Ready",
    message: `Your prescription from Dr. ${doctorName} is ready for pickup`,
    relatedEntity: prescriptionId,
    relatedEntityType: "Prescription",
    priority: "medium",
  });
};

module.exports = mongoose.model("Notification", notificationSchema);
