import React, { useState } from "react";
import { getAppointmentsByPatient, getDoctorById } from "../data/mockData";

const PatientAppointments = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const currentPatientId = 1; // Mock current user ID

  const allAppointments = getAppointmentsByPatient(currentPatientId);

  // Separate appointments by status
  const upcomingAppointments = allAppointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "pending"
  );
  const pastAppointments = allAppointments.filter(
    (apt) => apt.status === "completed"
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    const doctor = getDoctorById(appointment.doctorId);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={doctor?.image || "/api/placeholder/60/60"}
              alt={appointment.doctorName}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.doctorName}
              </h3>
              <p className="text-blue-600 font-medium">{doctor?.specialty}</p>
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

        <div className="border-t pt-4">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-600">Reason: </span>
            <span className="text-gray-900">{appointment.reason}</span>
          </div>
          {appointment.notes && (
            <div>
              <span className="text-sm font-medium text-gray-600">Notes: </span>
              <span className="text-gray-900">{appointment.notes}</span>
            </div>
          )}
        </div>

        {appointment.status === "confirmed" && (
          <div className="mt-4 flex space-x-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
              Join Video Call
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
              Reschedule
            </button>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition duration-200">
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Appointments
        </h1>
        <p className="text-gray-600">
          Manage your upcoming and past appointments
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
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
              onClick={() => setSelectedTab("past")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "past"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-gray-600 mb-6">
                  Book an appointment with one of our doctors
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
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
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No past appointments
                </h3>
                <p className="text-gray-600">
                  Your completed appointments will appear here
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition duration-200">
            <div className="text-2xl mb-2">🩺</div>
            <p className="font-medium text-gray-900">Book New Appointment</p>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition duration-200">
            <div className="text-2xl mb-2">💊</div>
            <p className="font-medium text-gray-900">View Prescriptions</p>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition duration-200">
            <div className="text-2xl mb-2">📋</div>
            <p className="font-medium text-gray-900">Medical Records</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
