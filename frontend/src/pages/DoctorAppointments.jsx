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
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-semibold text-lg">
                {patient.name?.charAt(0) || "P"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {patient.name}
              </h3>
              <p className="text-gray-600">{patient.email}</p>
              <p className="text-gray-600 text-sm">{patient.phone}</p>
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
              className="w-5 h-5 text-gray-400 mr-2"
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
            <span className="text-gray-700">
              {formatDate(appointment.date)}
            </span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-400 mr-2"
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
            <span className="text-gray-700">
              {formatTime(appointment.time)}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-600">Reason: </span>
            <span className="text-gray-900">{appointment.reason}</span>
          </div>
          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-600">
                Symptoms:{" "}
              </span>
              <span className="text-gray-900">
                {appointment.symptoms.join(", ")}
              </span>
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-600">Type: </span>
            <span className="text-gray-900 capitalize">{appointment.type}</span>
          </div>
        </div>

        {showActions && appointment.status === "confirmed" && (
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedAppointment(appointment)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Start Consultation
            </button>
            <button
              onClick={() => setCurrentView && setCurrentView("prescriptions")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
            >
              Create Prescription
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
              Reschedule
            </button>
          </div>
        )}

        {showActions && appointment.status === "scheduled" && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Confirm Appointment
            </button>
            <button
              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        )}

        {showActions && appointment.status === "pending" && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Confirm
            </button>
            <button
              onClick={() => handleStatusUpdate(appointment._id, "cancelled")}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition duration-200"
            >
              Decline
            </button>
          </div>
        )}

        {/* Show past due warning and completion option */}
        {showActions &&
          appointment.status === "confirmed" &&
          new Date(appointment.date).toISOString().split("T")[0] < today && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
              <p className="text-orange-800 text-sm mb-2">
                ⚠️ This appointment is past due. Please update its status:
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleStatusUpdate(appointment._id, "completed")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm transition duration-200"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(appointment._id, "cancelled")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition duration-200"
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
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
                className="text-white hover:text-gray-200 p-1"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patient Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">{patient.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-900">
                      {patient.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="ml-2 text-gray-900">
                      {patient.phone || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Reason:</span>
                    <span className="ml-2 text-gray-900">
                      {appointment.reason}
                    </span>
                  </div>
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Symptoms:
                      </span>
                      <p className="mt-1 text-gray-900">
                        {appointment.symptoms.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      setCurrentView("doctor-prescriptions");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-200"
                  >
                    📝 Create Prescription
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-200">
                    📋 Add Medical Notes
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition duration-200">
                    📅 Schedule Follow-up
                  </button>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition duration-200">
                    🔬 Order Tests
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  setCurrentView && setCurrentView("doctor-prescriptions");
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
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
              <h1 className="heading-gradient text-4xl font-bold">
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
          <div className="card-modern p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500">
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
                <p className="text-2xl font-bold text-gray-900">
                  {todayAppointments.length}
                </p>
                <p className="text-gray-600 font-medium">Today</p>
              </div>
            </div>
          </div>
          <div className="card-modern p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
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
                <p className="text-2xl font-bold text-purple-600">
                  {upcomingAppointments.length}
                </p>
                <p className="text-gray-600 font-medium">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="card-modern p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
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
                <p className="text-2xl font-bold text-orange-600">
                  {missedAppointments.length}
                </p>
                <p className="text-gray-600 font-medium">Missed</p>
              </div>
            </div>
          </div>
          <div className="card-modern p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
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
                <p className="text-2xl font-bold text-green-600">
                  {pastAppointments.length}
                </p>
                <p className="text-gray-600 font-medium">Completed</p>
              </div>
            </div>
          </div>
          <div className="card-modern p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500">
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
                <p className="text-2xl font-bold text-indigo-600">
                  {allAppointments.length}
                </p>
                <p className="text-gray-600 font-medium">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab("today")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "today"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Today ({todayAppointments.length})
              </button>
              <button
                onClick={() => setSelectedTab("upcoming")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "upcoming"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setSelectedTab("missed")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "missed"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Missed ({missedAppointments.length})
              </button>
              <button
                onClick={() => setSelectedTab("past")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "past"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                  <div className="text-gray-400 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-gray-600">{error}</p>
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
                  <div className="text-gray-400 text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No appointments today
                  </h3>
                  <p className="text-gray-600">You have a free day!</p>
                </div>
              )}
            </>
          )}

          {selectedTab === "upcoming" && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-gray-600">{error}</p>
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
                  <div className="text-gray-400 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-600">
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
                  <div className="text-gray-400 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              ) : missedAppointments.length > 0 ? (
                <>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <div className="text-orange-600 mr-3">
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
                        <h3 className="text-orange-800 font-medium">
                          Missed Appointments
                        </h3>
                        <p className="text-orange-700 text-sm">
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
                  <div className="text-gray-400 text-6xl mb-4">✅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No missed appointments
                  </h3>
                  <p className="text-gray-600">
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
                  <div className="text-gray-400 text-6xl mb-4">⏳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading appointments...
                  </h3>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading appointments
                  </h3>
                  <p className="text-gray-600">{error}</p>
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
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No past appointments
                  </h3>
                  <p className="text-gray-600">
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
