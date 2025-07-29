import React, { useState, useEffect } from "react";
import { appointmentsAPI, schedulingAPI } from "../services/api";

const BookAppointment = ({ selectedDoctor, setCurrentView, currentUser }) => {
  const [formData, setFormData] = useState({
    selectedDate: "",
    selectedSlot: "",
    reason: "",
    notes: "",
    appointmentType: "consultation",
    patientName: currentUser?.name || "Unknown User",
    patientEmail: currentUser?.email || "",
    patientPhone: currentUser?.phone || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);

  // Load doctor's weekly availability when component mounts
  useEffect(() => {
    if (selectedDoctor?._id) {
      loadWeeklyAvailability();
    }
  }, [selectedDoctor]);

  // Load slots when date changes
  useEffect(() => {
    if (formData.selectedDate) {
      loadSlotsForDate(formData.selectedDate);
    }
  }, [formData.selectedDate]);

  const loadWeeklyAvailability = async () => {
    try {
      const result = await schedulingAPI.getDoctorWeeklyAvailability(
        selectedDoctor._id
      );
      if (result.success) {
        setWeeklyAvailability(result.weeklyAvailability);
      }
    } catch (error) {
      console.error("Error loading weekly availability:", error);
    }
  };

  const loadSlotsForDate = async (date) => {
    setLoadingSlots(true);
    try {
      const result = await schedulingAPI.getDoctorAvailability(
        selectedDoctor._id,
        date
      );
      if (result.success) {
        setSelectedDateSlots(result.availableSlots);
      } else {
        setSelectedDateSlots([]);
        console.error("No slots available:", result.message);
      }
    } catch (error) {
      console.error("Error loading slots:", error);
      setSelectedDateSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      // Check if this date has any available slots
      const hasSlots = weeklyAvailability[dateString]?.length > 0;

      dates.push({
        value: dateString,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        fullDate: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        hasSlots,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }

    return dates;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate slot availability before submitting
      const [datePart, timePart] = formData.selectedSlot.split("T");
      const timeString = timePart
        ? timePart.slice(0, 5)
        : formData.selectedSlot;

      const availabilityCheck = await schedulingAPI.checkSlotAvailability(
        selectedDoctor._id,
        formData.selectedDate,
        timeString
      );

      if (!availabilityCheck.success || !availabilityCheck.isAvailable) {
        alert(
          `This time slot is no longer available: ${
            availabilityCheck.reason || "Unknown reason"
          }`
        );
        setIsSubmitting(false);
        // Refresh slots for selected date
        loadSlotsForDate(formData.selectedDate);
        return;
      }

      // Prepare appointment data for API
      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: formData.selectedDate,
        time: timeString,
        reason: formData.reason,
        type: formData.appointmentType,
        symptoms: formData.notes ? [formData.notes] : [],
      };

      console.log("Creating appointment:", appointmentData);

      // Call real API to create appointment
      const result = await appointmentsAPI.createAppointment(appointmentData);

      if (result.success) {
        console.log("Appointment created successfully:", result.appointment);
        setIsSubmitting(false);
        setShowSuccess(true);

        // Auto redirect after 3 seconds
        setTimeout(() => {
          setCurrentView("appointments");
        }, 3000);
      } else {
        console.error("Failed to create appointment:", result.message);
        setIsSubmitting(false);
        alert(`Failed to book appointment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setIsSubmitting(false);
      alert(
        "An error occurred while booking your appointment. Please try again."
      );
    }
  };

  if (!selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No Doctor Selected
          </h2>
          <p className="text-gray-300 mb-6">
            Please select a doctor first to book an appointment.
          </p>
          <button
            onClick={() => setCurrentView("doctors")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center shadow-xl">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-300 mb-4">
              Appointment Booked Successfully!
            </h2>
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
              <p className="text-green-200 mb-2">
                <strong>Doctor:</strong> {selectedDoctor.name}
              </p>
              <p className="text-green-200 mb-2">
                <strong>Date & Time:</strong>{" "}
                {new Date(formData.selectedDate).toLocaleDateString()} at{" "}
                {new Date(
                  `2000-01-01 ${formData.selectedSlot}`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-green-200">
                <strong>Reason:</strong> {formData.reason}
              </p>
            </div>
            <p className="text-gray-300 mb-4">
              You will receive a confirmation email shortly. Redirecting to your
              appointments...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => setCurrentView("doctors")}
            className="flex items-center text-white/70 hover:text-white mb-6 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Doctors
          </button>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
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
            <h1 className="heading-gradient text-4xl font-bold">
              Book Appointment
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sticky top-8 shadow-xl">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 ring-2 ring-white/20"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">
                  {selectedDoctor.name}
                </h3>
                <p className="text-blue-300 font-medium mb-2">
                  {selectedDoctor.specialty}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {selectedDoctor.qualification}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="font-medium text-gray-200">
                      {selectedDoctor.experience}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-gray-200">
                      ⭐ {selectedDoctor.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee:</span>
                    <span className="font-bold text-green-300">
                      ${selectedDoctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Available Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select Date *
                  </label>
                  <select
                    name="selectedDate"
                    value={formData.selectedDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="" className="bg-gray-800">
                      Choose a date
                    </option>
                    {getAvailableDates().map((date) => (
                      <option
                        key={date.value}
                        value={date.value}
                        disabled={!date.hasSlots}
                        className="bg-gray-800"
                      >
                        {date.label}{" "}
                        {date.hasSlots ? "" : " (No slots available)"}{" "}
                        {date.isWeekend ? " (Weekend)" : ""}
                      </option>
                    ))}
                  </select>
                  {formData.selectedDate && (
                    <p className="text-sm text-blue-300 mt-1">
                      Selected:{" "}
                      {
                        getAvailableDates().find(
                          (d) => d.value === formData.selectedDate
                        )?.fullDate
                      }
                    </p>
                  )}
                </div>

                {/* Available Time Slots */}
                {formData.selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Select Available Time Slot *
                    </label>
                    {loadingSlots ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <p className="text-gray-300 text-sm">
                          Loading available slots...
                        </p>
                      </div>
                    ) : selectedDateSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedDateSlots.map((slot, index) => (
                          <label key={index} className="relative">
                            <input
                              type="radio"
                              name="selectedSlot"
                              value={slot.time}
                              checked={formData.selectedSlot === slot.time}
                              onChange={handleInputChange}
                              className="sr-only"
                              required
                            />
                            <div
                              className={`border-2 rounded-xl p-3 cursor-pointer transition duration-200 text-center ${
                                formData.selectedSlot === slot.time
                                  ? "border-blue-400 bg-blue-500/20"
                                  : "border-white/20 hover:border-blue-400/50 bg-white/5"
                              }`}
                            >
                              <p className="font-medium text-gray-200 text-sm">
                                {new Date(
                                  `2000-01-01 ${slot.time}`
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <svg
                          className="w-8 h-8 text-red-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-red-300 text-sm">
                          No available slots for this date
                        </p>
                        <p className="text-red-400 text-xs mt-1">
                          Please select a different date
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Appointment Type *
                  </label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="consultation" className="bg-gray-800">
                      Consultation
                    </option>
                    <option value="follow-up" className="bg-gray-800">
                      Follow-up
                    </option>
                    <option value="check-up" className="bg-gray-800">
                      Check-up
                    </option>
                    <option value="emergency" className="bg-gray-800">
                      Emergency
                    </option>
                  </select>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason for Visit *
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    <option value="" className="bg-gray-800">
                      Select reason for visit
                    </option>
                    <option value="Regular Checkup" className="bg-gray-800">
                      Regular Checkup
                    </option>
                    <option value="Follow-up" className="bg-gray-800">
                      Follow-up
                    </option>
                    <option value="Consultation" className="bg-gray-800">
                      Consultation
                    </option>
                    <option value="Emergency" className="bg-gray-800">
                      Emergency
                    </option>
                    <option value="Vaccination" className="bg-gray-800">
                      Vaccination
                    </option>
                    <option value="Health Screening" className="bg-gray-800">
                      Health Screening
                    </option>
                    <option value="Other" className="bg-gray-800">
                      Other
                    </option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Please describe your symptoms or any additional information..."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                {/* Patient Information */}
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-white/20 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center justify-center shadow-lg text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Booking Appointment...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </button>
                  <p className="text-sm text-gray-300 text-center mt-2">
                    You will receive a confirmation email after booking
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
