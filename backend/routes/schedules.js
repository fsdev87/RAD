const express = require("express");
const DoctorSchedule = require("../models/DoctorSchedule");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { auth, requireDoctor } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/schedules/doctor/:doctorId/availability
// @desc    Get doctor's available time slots for a specific date
// @access  Public
router.get("/doctor/:doctorId/availability", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    // Verify doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Get doctor's schedule for this day
    const schedule = await DoctorSchedule.findOne({
      doctor: doctorId,
      dayOfWeek: dayOfWeek,
      isAvailable: true,
    });

    if (!schedule) {
      return res.json({
        success: true,
        data: {
          availableSlots: [],
          message: "Doctor is not available on this day",
        },
      });
    }

    // Get existing appointments for this date
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(date + "T00:00:00.000Z"),
        $lt: new Date(date + "T23:59:59.999Z"),
      },
      status: { $nin: ["cancelled", "no-show"] },
    }).select("time");

    const bookedTimes = existingAppointments.map((apt) => apt.time);

    // Generate time slots based on schedule
    const availableSlots = generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.appointmentDuration || 30,
      schedule.breakTimes || [],
      bookedTimes,
      targetDate
    );

    res.json({
      success: true,
      data: {
        availableSlots,
        doctorSchedule: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          appointmentDuration: schedule.appointmentDuration,
          maxAppointments: schedule.maxAppointments,
        },
      },
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

// @route   GET /api/schedules/doctor/my-schedule
// @desc    Get current doctor's schedule
// @access  Private (Doctors)
router.get("/doctor/my-schedule", auth, requireDoctor, async (req, res) => {
  try {
    const schedules = await DoctorSchedule.find({
      doctor: req.user._id,
    }).sort({ dayOfWeek: 1 });

    res.json({
      success: true,
      data: { schedules },
    });
  } catch (error) {
    console.error("Get doctor schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching schedule",
      error: error.message,
    });
  }
});

// @route   PUT /api/schedules/doctor/update-schedule
// @desc    Update doctor's schedule
// @access  Private (Doctors)
router.put("/doctor/update-schedule", auth, requireDoctor, async (req, res) => {
  try {
    const { schedules } = req.body;

    // Delete existing schedules
    await DoctorSchedule.deleteMany({ doctor: req.user._id });

    // Create new schedules
    const newSchedules = schedules.map((schedule) => ({
      ...schedule,
      doctor: req.user._id,
    }));

    const createdSchedules = await DoctorSchedule.insertMany(newSchedules);

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: { schedules: createdSchedules },
    });
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating schedule",
      error: error.message,
    });
  }
});

// @route   POST /api/schedules/check-availability
// @desc    Check if a specific time slot is available
// @access  Public
router.post("/check-availability", async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
      status: { $nin: ["cancelled", "no-show"] },
    });

    if (existingAppointment) {
      return res.json({
        success: true,
        data: { isAvailable: false, reason: "Time slot already booked" },
      });
    }

    // Check doctor's schedule
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    const schedule = await DoctorSchedule.findOne({
      doctor: doctorId,
      dayOfWeek: dayOfWeek,
      isAvailable: true,
    });

    if (!schedule) {
      return res.json({
        success: true,
        data: {
          isAvailable: false,
          reason: "Doctor not available on this day",
        },
      });
    }

    // Check if time is within working hours
    const isAvailable = schedule.isAvailableAt(time);

    res.json({
      success: true,
      data: {
        isAvailable,
        reason: isAvailable ? null : "Time outside working hours",
      },
    });
  } catch (error) {
    console.error("Check availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking availability",
      error: error.message,
    });
  }
});

// Helper function to generate time slots
function generateTimeSlots(
  startTime,
  endTime,
  duration = 30,
  breakTimes = [],
  bookedTimes = [],
  targetDate = new Date()
) {
  const slots = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const now = new Date();

  // Check if target date is today
  const isToday = targetDate.toDateString() === now.toDateString();
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

  for (let minutes = start; minutes < end; minutes += duration) {
    const timeString = minutesToTime(minutes);

    // Skip if time is in the past (for today only)
    if (isToday && minutes <= currentMinutes + 30) {
      continue; // Give 30-minute buffer for today's appointments
    }

    // Skip if time is already booked
    if (bookedTimes.includes(timeString)) {
      continue;
    }

    // Skip if time falls within break times
    const isBreakTime = breakTimes.some((breakTime) => {
      const breakStart = timeToMinutes(breakTime.startTime);
      const breakEnd = timeToMinutes(breakTime.endTime);
      return minutes >= breakStart && minutes < breakEnd;
    });

    if (!isBreakTime) {
      slots.push({
        time: timeString,
        datetime: new Date(targetDate.toDateString() + " " + timeString),
        available: true,
      });
    }
  }

  return slots;
}

// Helper functions
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

module.exports = router;
