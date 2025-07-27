import React, { useState, useEffect, useCallback } from "react";
import { medicalRecordsAPI } from "../services/api";

const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pagination, setPagination] = useState({});

  // Fetch medical records
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        page: 1,
        limit: 10,
      };

      if (searchTerm) {
        filters.condition = searchTerm;
      }

      const result = await medicalRecordsAPI.getPatientRecords(filters);
      if (result.success) {
        setRecords(result.records);
        setPagination(result.pagination);
        setError("");
      } else {
        setError(result.message || "Failed to fetch medical records");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecordTypeIcon = (diagnosis) => {
    const lowerDiagnosis = diagnosis.toLowerCase();
    if (lowerDiagnosis.includes("heart") || lowerDiagnosis.includes("cardiac"))
      return "❤️";
    if (lowerDiagnosis.includes("brain") || lowerDiagnosis.includes("neuro"))
      return "🧠";
    if (
      lowerDiagnosis.includes("lung") ||
      lowerDiagnosis.includes("respiratory")
    )
      return "🫁";
    if (lowerDiagnosis.includes("bone") || lowerDiagnosis.includes("fracture"))
      return "🦴";
    if (lowerDiagnosis.includes("skin") || lowerDiagnosis.includes("derma"))
      return "🩹";
    return "📋";
  };

  const RecordDetailModal = ({ record, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Medical Record Details</h2>
              <p className="text-blue-100">
                {formatDate(record.recordDate)} at{" "}
                {formatTime(record.recordDate)}
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

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Doctor Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <svg
                  className="w-5 h-5 text-blue-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="font-semibold text-white">Doctor Information</h3>
              </div>
              <p className="text-white font-medium">Dr. {record.doctor.name}</p>
              <p className="text-gray-300 text-sm">
                {record.doctor.specialization}
              </p>
            </div>

            {/* Appointment Info */}
            {record.appointment && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <svg
                    className="w-5 h-5 text-blue-400 mr-2"
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
                  <h3 className="font-semibold text-white">
                    Related Appointment
                  </h3>
                </div>
                <p className="text-white font-medium">
                  {record.appointment.date
                    ? formatDate(record.appointment.date)
                    : "Date not available"}
                </p>
                <p className="text-gray-300 text-sm">
                  {record.appointment.reason}
                </p>
              </div>
            )}
          </div>

          {/* Main Record Content */}
          <div className="space-y-4">
            {/* Diagnosis */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
              <div className="flex items-center mb-3">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
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
                <h3 className="font-semibold text-white text-lg">Diagnosis</h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
                {record.diagnosis}
              </p>
            </div>

            {/* Symptoms */}
            {record.symptoms && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <svg
                    className="w-5 h-5 text-orange-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-semibold text-white text-lg">Symptoms</h3>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  {record.symptoms}
                </p>
              </div>
            )}

            {/* Treatment */}
            {record.treatment && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <svg
                    className="w-5 h-5 text-green-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"
                    />
                  </svg>
                  <h3 className="font-semibold text-white text-lg">
                    Treatment
                  </h3>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  {record.treatment}
                </p>
              </div>
            )}

            {/* Medications */}
            {record.medications && record.medications.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <svg
                    className="w-5 h-5 text-purple-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <h3 className="font-semibold text-white text-lg">
                    Medications
                  </h3>
                </div>
                <div className="space-y-3">
                  {record.medications.map((med, index) => (
                    <div
                      key={index}
                      className="bg-white/10 border border-white/20 rounded-xl p-4"
                    >
                      <p className="font-semibold text-white text-base mb-2">
                        {med.name}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Dosage:</span>{" "}
                          {med.dosage}
                        </div>
                        <div>
                          <span className="text-gray-400">Frequency:</span>{" "}
                          {med.frequency}
                        </div>
                        <div>
                          <span className="text-gray-400">Duration:</span>{" "}
                          {med.duration}
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-400">Instructions:</span>{" "}
                            {med.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vital Signs */}
            {record.vitalSigns && Object.keys(record.vitalSigns).length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
                <div className="flex items-center mb-4">
                  <svg
                    className="w-5 h-5 text-indigo-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="font-semibold text-white text-lg">
                    Vital Signs
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {record.vitalSigns.bloodPressure && (
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-400 mb-1">
                        Blood Pressure
                      </p>
                      <p className="font-semibold text-white text-lg">
                        {typeof record.vitalSigns.bloodPressure === "object"
                          ? `${record.vitalSigns.bloodPressure.systolic}/${record.vitalSigns.bloodPressure.diastolic}`
                          : record.vitalSigns.bloodPressure}
                      </p>
                    </div>
                  )}
                  {record.vitalSigns.heartRate && (
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-400 mb-1">Heart Rate</p>
                      <p className="font-semibold text-white text-lg">
                        {record.vitalSigns.heartRate}{" "}
                        <span className="text-sm text-gray-400">bpm</span>
                      </p>
                    </div>
                  )}
                  {record.vitalSigns.temperature && (
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-400 mb-1">Temperature</p>
                      <p className="font-semibold text-white text-lg">
                        {record.vitalSigns.temperature}
                        <span className="text-sm text-gray-400">°F</span>
                      </p>
                    </div>
                  )}
                  {record.vitalSigns.weight && (
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-400 mb-1">Weight</p>
                      <p className="font-semibold text-white text-lg">
                        {record.vitalSigns.weight}{" "}
                        <span className="text-sm text-gray-400">lbs</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {record.notes && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <h3 className="font-semibold text-white">Additional Notes</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{record.notes}</p>
              </div>
            )}

            {/* Follow-up */}
            {record.followUpRequired && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <svg
                    className="w-5 h-5 mr-2 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="font-semibold text-orange-300">
                    Follow-up Required
                  </h3>
                </div>
                {record.followUpDate && (
                  <p className="text-gray-300">
                    Scheduled for: {formatDate(record.followUpDate)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="heading-gradient text-4xl font-bold mb-2">
                My Medical Records
              </h1>
              <p className="text-gray-300 text-lg">
                View your complete medical history and records from all
                consultations
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Records
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by diagnosis, symptoms, or treatment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading medical records...
            </span>
          </div>
        ) : (
          <>
            {/* Records List */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
              {records.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No medical records found
                  </h3>
                  <p className="text-gray-300">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Your medical records will appear here after consultations"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {records.map((record) => (
                    <div
                      key={record._id}
                      className="p-6 hover:bg-white/15 transition duration-200 cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">
                              {getRecordTypeIcon(record.diagnosis)}
                            </span>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {record.diagnosis}
                              </h3>
                              <p className="text-sm text-gray-300">
                                by Dr. {record.doctor.name} •{" "}
                                {record.doctor.specialization}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium text-gray-300">
                                Date
                              </p>
                              <p className="text-sm text-gray-400">
                                {formatDate(record.recordDate)}
                              </p>
                            </div>

                            {record.symptoms && (
                              <div>
                                <p className="text-sm font-medium text-gray-300">
                                  Symptoms
                                </p>
                                <p className="text-sm text-gray-400 truncate">
                                  {record.symptoms}
                                </p>
                              </div>
                            )}

                            {record.followUpRequired && (
                              <div>
                                <p className="text-sm font-medium text-orange-300">
                                  Follow-up Required
                                </p>
                                <p className="text-sm text-orange-600">
                                  {record.followUpDate
                                    ? formatDate(record.followUpDate)
                                    : "Date TBD"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-4">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        pagination.currentPage === index + 1
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/15"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Record Detail Modal */}
        {selectedRecord && (
          <RecordDetailModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
