import React, { useState, useEffect } from "react";
import { appointmentsAPI } from "../services/api";

const PatientAppointments = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        console.log("Fetching patient appointments...");
        const result = await appointmentsAPI.getPatientAppointments();
        console.log("Appointments API result:", result);

        if (result.success) {
          console.log("Appointments data:", result.appointments);
          setAppointments(result.appointments || []);
        } else {
          console.error("Appointments API error:", result.message);
          setError(result.message || "Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Separate appointments by status
  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.status === "confirmed" ||
      apt.status === "pending" ||
      apt.status === "scheduled"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  );

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const AppointmentCard = ({ appointment }) => {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                appointment.doctor?.name || appointment.doctorName || "Doctor"
              )}&background=random&size=60`}
              alt={
                appointment.doctor?.name || appointment.doctorName || "Doctor"
              }
              className="w-12 h-12 rounded-full mr-4 ring-2 ring-white/20"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {appointment.doctor?.name || appointment.doctorName || "Doctor"}
              </h3>
              <p className="text-blue-300 font-medium">
                {appointment.doctor?.specialization || "General Medicine"}
              </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <span className="text-gray-300">
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
            <span className="text-gray-300">
              {formatTime(appointment.time)}
            </span>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-400">Reason: </span>
            <span className="text-gray-200">{appointment.reason}</span>
          </div>
          {appointment.notes && (
            <div>
              <span className="text-sm font-medium text-gray-400">Notes: </span>
              <span className="text-gray-200">{appointment.notes}</span>
            </div>
          )}
        </div>

        {appointment.status === "confirmed" && (
          <div className="mt-4 flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition duration-200 shadow-lg">
              Join Video Call
            </button>
            <button className="px-4 py-2 border border-white/30 text-gray-300 rounded-lg hover:bg-white/10 transition duration-200">
              Reschedule
            </button>
            <button className="px-4 py-2 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/10 transition duration-200">
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
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
            <div>
              <h1 className="heading-gradient text-4xl font-bold mb-2">
                My Appointments
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your upcoming and past appointments
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-300">Loading appointments...</span>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="border-b border-white/20">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setSelectedTab("upcoming")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === "upcoming"
                        ? "border-blue-400 text-blue-300"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
                    }`}
                  >
                    Upcoming ({upcomingAppointments.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab("past")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === "past"
                        ? "border-blue-400 text-blue-300"
                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
                    }`}
                  >
                    Past Appointments ({pastAppointments.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Appointments List */}
            <div className="space-y-6">
              {selectedTab === "upcoming" && (
                <>
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-10 h-10 text-gray-400"
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
                      <h3 className="text-lg font-medium text-white mb-2">
                        No upcoming appointments
                      </h3>
                      <p className="text-gray-300 mb-6">
                        Book an appointment with one of our doctors
                      </p>
                      <button
                        onClick={() => setCurrentView("doctors")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                      >
                        Find Doctors
                      </button>
                    </div>
                  )}
                </>
              )}

              {selectedTab === "past" && (
                <>
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        No past appointments
                      </h3>
                      <p className="text-gray-300">
                        Your completed appointments will appear here
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-medium text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentView("doctors")}
                  className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl p-6 text-center transition-all duration-300 backdrop-blur-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-gray-300 group-hover:text-white"
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
                  <p className="font-medium text-white group-hover:text-white transition-colors">
                    Find Doctors
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Browse available doctors
                  </p>
                </button>
                <button
                  onClick={() => setCurrentView("prescriptions")}
                  className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl p-6 text-center transition-all duration-300 backdrop-blur-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-gray-300 group-hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <p className="font-medium text-white group-hover:text-white transition-colors">
                    Prescriptions
                  </p>
                  <p className="text-sm text-gray-400 mt-1">View medications</p>
                </button>
                <button
                  onClick={() => setCurrentView("medical-records")}
                  className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl p-6 text-center transition-all duration-300 backdrop-blur-sm hover:shadow-xl"
                >
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-gray-300 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white group-hover:text-white transition-colors">
                    Medical Records
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    View health history
                  </p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
