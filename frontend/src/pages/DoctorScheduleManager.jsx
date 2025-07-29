import React, { useState, useEffect } from "react";
import { schedulingAPI } from "../services/api";

const DoctorScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const defaultSchedule = {
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: true,
    maxAppointments: 16,
    appointmentDuration: 30,
    breakTimes: [
      {
        startTime: "12:00",
        endTime: "13:00",
        description: "Lunch break",
      },
    ],
    specialNotes: "",
  };

  useEffect(() => {
    loadCurrentSchedule();
  }, []);

  const loadCurrentSchedule = async () => {
    try {
      setLoading(true);
      const result = await schedulingAPI.getMySchedule();

      if (result.success) {
        // If no schedules exist, create default ones
        if (result.schedules.length === 0) {
          const defaultSchedules = [];
          for (let i = 1; i <= 5; i++) {
            // Monday to Friday
            defaultSchedules.push({
              ...defaultSchedule,
              dayOfWeek: i,
            });
          }
          setSchedules(defaultSchedules);
        } else {
          setSchedules(result.schedules);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (dayOfWeek, field, value) => {
    setSchedules((prevSchedules) => {
      const existingIndex = prevSchedules.findIndex(
        (s) => s.dayOfWeek === dayOfWeek
      );

      if (existingIndex >= 0) {
        // Update existing schedule
        const updated = [...prevSchedules];
        updated[existingIndex] = {
          ...updated[existingIndex],
          [field]: value,
        };
        return updated;
      } else {
        // Add new schedule
        return [
          ...prevSchedules,
          {
            ...defaultSchedule,
            dayOfWeek,
            [field]: value,
          },
        ];
      }
    });
  };

  const handleBreakTimeChange = (dayOfWeek, breakIndex, field, value) => {
    setSchedules((prevSchedules) => {
      const updated = [...prevSchedules];
      const scheduleIndex = updated.findIndex((s) => s.dayOfWeek === dayOfWeek);

      if (scheduleIndex >= 0) {
        const breakTimes = [...(updated[scheduleIndex].breakTimes || [])];
        if (breakTimes[breakIndex]) {
          breakTimes[breakIndex] = {
            ...breakTimes[breakIndex],
            [field]: value,
          };
        }
        updated[scheduleIndex] = {
          ...updated[scheduleIndex],
          breakTimes,
        };
      }

      return updated;
    });
  };

  const addBreakTime = (dayOfWeek) => {
    setSchedules((prevSchedules) => {
      const updated = [...prevSchedules];
      const scheduleIndex = updated.findIndex((s) => s.dayOfWeek === dayOfWeek);

      if (scheduleIndex >= 0) {
        const newBreak = {
          startTime: "12:00",
          endTime: "13:00",
          description: "Break",
        };

        updated[scheduleIndex] = {
          ...updated[scheduleIndex],
          breakTimes: [...(updated[scheduleIndex].breakTimes || []), newBreak],
        };
      }

      return updated;
    });
  };

  const removeBreakTime = (dayOfWeek, breakIndex) => {
    setSchedules((prevSchedules) => {
      const updated = [...prevSchedules];
      const scheduleIndex = updated.findIndex((s) => s.dayOfWeek === dayOfWeek);

      if (scheduleIndex >= 0) {
        const breakTimes = [...(updated[scheduleIndex].breakTimes || [])];
        breakTimes.splice(breakIndex, 1);

        updated[scheduleIndex] = {
          ...updated[scheduleIndex],
          breakTimes,
        };
      }

      return updated;
    });
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Filter out unavailable days and validate
      const validSchedules = schedules.filter((schedule) => {
        if (!schedule.isAvailable) return false;

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (
          !timeRegex.test(schedule.startTime) ||
          !timeRegex.test(schedule.endTime)
        ) {
          return false;
        }

        // Validate start time is before end time
        const start = new Date(`2000-01-01 ${schedule.startTime}`);
        const end = new Date(`2000-01-01 ${schedule.endTime}`);
        if (start >= end) return false;

        return true;
      });

      const result = await schedulingAPI.updateMySchedule(validSchedules);

      if (result.success) {
        setSuccess("Schedule updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  const getScheduleForDay = (dayOfWeek) => {
    return (
      schedules.find((s) => s.dayOfWeek === dayOfWeek) || {
        ...defaultSchedule,
        dayOfWeek,
        isAvailable: false,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading your schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="heading-gradient text-4xl font-bold mb-2">
                Schedule Management
              </h1>
              <p className="text-gray-300 text-lg">
                Set your availability and appointment preferences
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Schedule Grid */}
        <div className="space-y-6">
          {dayNames.map((dayName, dayOfWeek) => {
            const schedule = getScheduleForDay(dayOfWeek);

            return (
              <div
                key={dayOfWeek}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{dayName}</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.isAvailable}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayOfWeek,
                          "isAvailable",
                          e.target.checked
                        )
                      }
                      className="mr-2 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Available</span>
                  </label>
                </div>

                {schedule.isAvailable && (
                  <div className="space-y-4">
                    {/* Working Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              dayOfWeek,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              dayOfWeek,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Slot Duration (min)
                        </label>
                        <select
                          value={schedule.appointmentDuration}
                          onChange={(e) =>
                            handleScheduleChange(
                              dayOfWeek,
                              "appointmentDuration",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={15} className="bg-gray-800">
                            15 minutes
                          </option>
                          <option value={30} className="bg-gray-800">
                            30 minutes
                          </option>
                          <option value={45} className="bg-gray-800">
                            45 minutes
                          </option>
                          <option value={60} className="bg-gray-800">
                            60 minutes
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Max Appointments
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={schedule.maxAppointments}
                          onChange={(e) =>
                            handleScheduleChange(
                              dayOfWeek,
                              "maxAppointments",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Break Times */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          Break Times
                        </h4>
                        <button
                          onClick={() => addBreakTime(dayOfWeek)}
                          className="py-1 px-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/30 transition text-sm"
                        >
                          Add Break
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(schedule.breakTimes || []).map(
                          (breakTime, breakIndex) => (
                            <div
                              key={breakIndex}
                              className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg"
                            >
                              <input
                                type="time"
                                value={breakTime.startTime}
                                onChange={(e) =>
                                  handleBreakTimeChange(
                                    dayOfWeek,
                                    breakIndex,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                              />
                              <span className="text-gray-300">to</span>
                              <input
                                type="time"
                                value={breakTime.endTime}
                                onChange={(e) =>
                                  handleBreakTimeChange(
                                    dayOfWeek,
                                    breakIndex,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Description"
                                value={breakTime.description || ""}
                                onChange={(e) =>
                                  handleBreakTimeChange(
                                    dayOfWeek,
                                    breakIndex,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                              />
                              <button
                                onClick={() =>
                                  removeBreakTime(dayOfWeek, breakIndex)
                                }
                                className="py-1 px-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded hover:bg-red-500/30 transition text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Special Notes
                      </label>
                      <textarea
                        value={schedule.specialNotes || ""}
                        onChange={(e) =>
                          handleScheduleChange(
                            dayOfWeek,
                            "specialNotes",
                            e.target.value
                          )
                        }
                        placeholder="Any special notes for this day..."
                        rows="2"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={saveSchedule}
            disabled={saving}
            className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition duration-200 shadow-lg font-medium"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving Schedule...
              </div>
            ) : (
              "Save Schedule"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleManager;
