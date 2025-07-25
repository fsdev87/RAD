import React, { useState } from "react";
import { appointmentsAPI } from "../services/api";

const BookAppointment = ({ selectedDoctor, setCurrentView, currentUser }) => {
  const [formData, setFormData] = useState({
    selectedSlot: "",
    reason: "",
    notes: "",
    patientName: currentUser?.name || "Unknown User",
    patientEmail: currentUser?.email || "",
    patientPhone: currentUser?.phone || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate default time slots for the next 7 days
  const generateDefaultSlots = () => {
    const slots = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Generate morning and afternoon slots
      const morningSlot = new Date(date);
      morningSlot.setHours(9, 0, 0, 0);

      const afternoonSlot = new Date(date);
      afternoonSlot.setHours(14, 0, 0, 0);

      const eveningSlot = new Date(date);
      eveningSlot.setHours(16, 30, 0, 0);

      slots.push(
        morningSlot.toISOString(),
        afternoonSlot.toISOString(),
        eveningSlot.toISOString()
      );
    }

    return slots;
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
      // Prepare appointment data for API
      const selectedDate = new Date(formData.selectedSlot);
      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD format
        time: selectedDate.toTimeString().slice(0, 5), // HH:MM format
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
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Doctor Selected
        </h2>
        <p className="text-gray-600 mb-6">
          Please select a doctor first to book an appointment.
        </p>
        <button
          onClick={() => setCurrentView("doctors")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Browse Doctors
        </button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Appointment Booked Successfully!
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 mb-2">
              <strong>Doctor:</strong> {selectedDoctor.name}
            </p>
            <p className="text-green-800 mb-2">
              <strong>Date & Time:</strong>{" "}
              {new Date(formData.selectedSlot).toLocaleDateString()} at{" "}
              {new Date(formData.selectedSlot).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-green-800">
              <strong>Reason:</strong> {formData.reason}
            </p>
          </div>
          <p className="text-gray-600 mb-4">
            You will receive a confirmation email shortly. Redirecting to your
            appointments...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => setCurrentView("doctors")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
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
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <img
              src={selectedDoctor.image}
              alt={selectedDoctor.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedDoctor.name}
              </h3>
              <p className="text-blue-600 font-medium mb-2">
                {selectedDoctor.specialty}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                {selectedDoctor.qualification}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">
                    {selectedDoctor.experience}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span>⭐ {selectedDoctor.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span className="font-bold text-green-600">
                    ${selectedDoctor.consultationFee}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Available Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Available Time Slot *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    selectedDoctor?.availableSlots || generateDefaultSlots()
                  ).map((slot, index) => (
                    <label key={index} className="relative">
                      <input
                        type="radio"
                        name="selectedSlot"
                        value={slot}
                        checked={formData.selectedSlot === slot}
                        onChange={handleInputChange}
                        className="sr-only"
                        required
                      />
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition duration-200 ${
                          formData.selectedSlot === slot
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-center">
                          <p className="font-medium text-gray-900">
                            {new Date(slot).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-blue-600 font-bold">
                            {new Date(slot).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select reason for visit</option>
                  <option value="Regular Checkup">Regular Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Health Screening">Health Screening</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Please describe your symptoms or any additional information..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Patient Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="patientEmail"
                      value={formData.patientEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
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
                <p className="text-sm text-gray-600 text-center mt-2">
                  You will receive a confirmation email after booking
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
