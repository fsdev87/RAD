import React, { useState, useEffect } from "react";
import { appointmentsAPI } from "../services/api";

const DoctorAppointments = ({ setCurrentView }) => {
  const [selectedTab, setSelectedTab] = useState("today");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctor appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctor appointments...");
        const result = await appointmentsAPI.getDoctorAppointments();
        console.log("Doctor appointments API result:", result);

        if (result.success) {
          console.log("Doctor appointments data:", result.appointments);
          setAllAppointments(result.appointments || []);
        } else {
          console.error("Doctor appointments API error:", result.message);
          setError(result.message || "Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Categorize appointments properly
  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = allAppointments.filter((apt) => {
    const appointmentDate = apt.date.split("T")[0]; // Get just the date part
    return (
      appointmentDate === today &&
      apt.status !== "completed" &&
      apt.status !== "cancelled"
    );
  });

  const upcomingAppointments = allAppointments.filter((apt) => {
    const appointmentDate = apt.date.split("T")[0]; // Get just the date part
    return (
      appointmentDate > today &&
      apt.status !== "completed" &&
      apt.status !== "cancelled"
    );
  });

  // Missed appointments (past due and need status update)
  const missedAppointments = allAppointments.filter((apt) => {
    const appointmentDate = apt.date.split("T")[0];
    return (
      appointmentDate < today &&
      apt.status !== "completed" &&
      apt.status !== "cancelled"
    );
  });

  // Only show completed and cancelled appointments in past
  const pastAppointments = allAppointments.filter((apt) => {
    return apt.status === "completed" || apt.status === "cancelled";
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "scheduled":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
      const result = await appointmentsAPI.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      if (result.success) {
        // Update the appointment in the local state
        setAllAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt._id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );
        setSelectedAppointment(null);
        console.log("Appointment status updated successfully");
      } else {
        console.error("Failed to update appointment status:", result.message);
        alert(`Failed to update appointment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert(
        "An error occurred while updating the appointment. Please try again."
      );
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }) => {
    // Use real appointment data structure
    const patient = appointment.patient || {
      name: "Unknown Patient",
      email: "N/A",
      phone: "N/A",
    };

    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-semibold text-lg">
                {patient.name?.charAt(0) || "P"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {patient.name}
              </h3>
              <p className="text-white/70">{patient.email}</p>
              <p className="text-white/70 text-sm">{patient.phone}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-white/60 mr-2"
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
            <span className="text-white/80">
              {formatDate(appointment.date)}
            </span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-white/60 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-white/80">
              {formatTime(appointment.time)}
            </span>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 mb-4">
          <div className="mb-2">
            <span className="text-sm font-medium text-white/70">Reason: </span>
            <span className="text-white">{appointment.reason}</span>
          </div>
          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium text-white/70">
                Symptoms:{" "}
              </span>
              <span className="text-white">
                {appointment.symptoms.join(", ")}
              </span>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-white/70">Type: </span>
            <span className="text-white capitalize">{appointment.type}</span>
          </div>
        </div>

        {showActions && appointment.status === "confirmed" && (
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedAppointment(appointment)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-xl transition-all duration-300 font-medium"
            >
              Start Consultation
            </button>
            <button
              onClick={() => setCurrentView && setCurrentView("prescriptions")}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium"
            >
              Create Prescription
            </button>
            <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white font-medium">
              Reschedule
            </button>
          </div>
        )}

        {showActions && appointment.status === "scheduled" && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl transition-all duration-300 font-medium"
            >
              Confirm Appointment
            </button>
            <button
              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
              className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        {showActions && appointment.status === "pending" && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl transition-all duration-300 font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
              className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-300 font-medium"
            >
              Decline
            </button>
          </div>
        )}

        {/* Show past due warning and completion option */}
        {showActions &&
          appointment.status === "confirmed" &&
          new Date(appointment.date).toISOString().split("T")[0] < today && (
            <div className="bg-orange-500/20 border border-orange-500/40 rounded-xl p-3 mt-3">
              <p className="text-orange-200 text-sm mb-2">
                ⚠️ This appointment is past due. Please update its status:
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleStatusUpdate(appointment._id, "completed")
                  }
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 font-medium"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(appointment._id, "cancelled")
                  }
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 font-medium"
                >
                  Mark No-Show
                </button>
              </div>
            </div>
          )}
      </div>
    );
  };

  const ConsultationModal = ({ appointment, onClose, setCurrentView }) => {
    if (!appointment) return null;

    const patient = appointment.patient || { name: "Unknown Patient" };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Patient Consultation</h2>
                <p className="text-blue-100">
                  {patient.name} - {formatDate(appointment.date)} at{" "}
                  {formatTime(appointment.time)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Patient Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Patient Information
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div>
                    <span className="font-medium text-white/70">Name:</span>
                    <span className="ml-2 text-white">{patient.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-white/70">Email:</span>
                    <span className="ml-2 text-white">
                      {patient.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-white/70">Phone:</span>
                    <span className="ml-2 text-white">
                      {patient.phone || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-white/70">Reason:</span>
                    <span className="ml-2 text-white">
                      {appointment.reason}
                    </span>
                  </div>
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div>
                      <span className="font-medium text-white/70">
                        Symptoms:
                      </span>
                      <p className="mt-1 text-white">
                        {appointment.symptoms.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setCurrentView("doctor-prescriptions");
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium"
                  >
                    📝 Create Prescription
                  </button>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium">
                    📋 Add Medical Notes
                  </button>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium">
                    📅 Schedule Follow-up
                  </button>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium">
                    🔬 Order Tests
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  setCurrentView && setCurrentView("doctor-prescriptions");
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 font-medium"
              >
                Create Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
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
                My Appointments
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your patient appointments and consultations
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                <p className="text-2xl font-bold text-white">
                  {todayAppointments.length}
                </p>
                <p className="text-gray-300 font-medium">Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {upcomingAppointments.length}
                </p>
                <p className="text-gray-300 font-medium">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {missedAppointments.length}
                </p>
                <p className="text-gray-300 font-medium">Missed</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {pastAppointments.length}
                </p>
                <p className="text-gray-300 font-medium">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {allAppointments.length}
                </p>
                <p className="text-gray-300 font-medium">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl">
            <nav className="flex space-x-2">
              <button
                onClick={() => setSelectedTab("today")}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedTab === "today"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Today ({todayAppointments.length})
              </button>
              <button
                onClick={() => setSelectedTab("upcoming")}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedTab === "upcoming"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setSelectedTab("missed")}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedTab === "missed"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Missed ({missedAppointments.length})
              </button>
              <button
                onClick={() => setSelectedTab("past")}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                  selectedTab === "past"
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                Past ({pastAppointments.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {selectedTab === "today" && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-white/70">{error}</p>
                </div>
              ) : todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No appointments today
                  </h3>
                  <p className="text-white/70">You have a free day!</p>
                </div>
              )}
            </>
          )}

          {selectedTab === "upcoming" && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-white/70">{error}</p>
                </div>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-white/70">
                    Your schedule is clear for the upcoming days
                  </p>
                </div>
              )}
            </>
          )}

          {selectedTab === "missed" && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-white/70">{error}</p>
                </div>
              ) : missedAppointments.length > 0 ? (
                <>
                  <div className="bg-orange-500/20 border border-orange-500/40 rounded-xl p-4 mb-6">
                    <div className="flex items-center">
                      <div className="text-orange-300 mr-3">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-orange-200 font-medium">
                          Missed Appointments
                        </h3>
                        <p className="text-orange-300 text-sm">
                          These appointments are past their scheduled date and
                          need status updates.
                        </p>
                      </div>
                    </div>
                  </div>
                  {missedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">✅</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No missed appointments
                  </h3>
                  <p className="text-white/70">
                    All appointments are properly tracked!
                  </p>
                </div>
              )}
            </>
          )}

          {selectedTab === "past" && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-white/70">{error}</p>
                </div>
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    showActions={false}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No past appointments
                  </h3>
                  <p className="text-white/70">
                    Completed appointments will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Consultation Modal */}
        <ConsultationModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          setCurrentView={setCurrentView}
        />
      </div>
    </div>
  );
};

export default DoctorAppointments;
