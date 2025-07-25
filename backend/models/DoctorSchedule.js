const mongoose = require("mongoose");

const doctorScheduleSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0, // Sunday
      max: 6, // Saturday
    },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    breakTimes: [
      {
        startTime: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        endTime: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
        description: String,
      },
    ],
    maxAppointments: {
      type: Number,
      default: 10,
    },
    appointmentDuration: {
      type: Number, // in minutes
      default: 30,
    },
    specialNotes: {
      type: String,
    },
    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
    effectiveTo: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique schedule per doctor per day
doctorScheduleSchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true });

// Method to check if doctor is available at specific time
doctorScheduleSchema.methods.isAvailableAt = function (time) {
  if (!this.isAvailable) return false;

  const timeMinutes = this.timeToMinutes(time);
  const startMinutes = this.timeToMinutes(this.startTime);
  const endMinutes = this.timeToMinutes(this.endTime);

  if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
    return false;
  }

  // Check if time falls within break times
  for (const breakTime of this.breakTimes) {
    const breakStartMinutes = this.timeToMinutes(breakTime.startTime);
    const breakEndMinutes = this.timeToMinutes(breakTime.endTime);

    if (timeMinutes >= breakStartMinutes && timeMinutes < breakEndMinutes) {
      return false;
    }
  }

  return true;
};

// Helper method to convert time string to minutes
doctorScheduleSchema.methods.timeToMinutes = function (timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

module.exports = mongoose.model("DoctorSchedule", doctorScheduleSchema);
