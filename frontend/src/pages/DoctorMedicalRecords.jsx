import React, { useState, useEffect, useCallback } from "react";
import { medicalRecordsAPI, appointmentsAPI } from "../services/api";
import Toast from "../components/Toast";

// Create Record Modal Component (extracted to prevent re-creation)
const CreateRecordModal = ({
  createForm,
  recentAppointments,
  handleCreateFormChange,
  handleAppointmentSelect,
  addMedication,
  updateMedication,
  removeMedication,
  handleCreateRecord,
  loading,
  setShowCreateModal,
  formatDate,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleCreateRecord} className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Medical Record
          </h2>
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Appointment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Appointment (Recommended)
            </label>
            <select
              name="appointment"
              value={createForm.appointment}
              onChange={(e) => handleAppointmentSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a completed appointment...</option>
              {recentAppointments.map((appointment) => (
                <option key={appointment._id} value={appointment._id}>
                  {appointment.patient.name} - {formatDate(appointment.date)} -{" "}
                  {appointment.reason}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Select an appointment to auto-fill patient info, or fill manually
              below
            </p>
          </div>

          {/* Patient Info (if appointment not selected) */}
          {!createForm.appointment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID * (Note: In real app, this would be a patient
                selector)
              </label>
              <input
                type="text"
                name="patient"
                value={createForm.patient}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="For testing, use a patient ID from completed appointments"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: Check a completed appointment to get the patient ID
              </p>
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis *
            </label>
            <input
              type="text"
              name="diagnosis"
              value={createForm.diagnosis}
              onChange={handleCreateFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter diagnosis"
              required
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms
            </label>
            <textarea
              name="symptoms"
              value={createForm.symptoms}
              onChange={handleCreateFormChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe symptoms..."
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment
            </label>
            <textarea
              name="treatment"
              value={createForm.treatment}
              onChange={handleCreateFormChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe treatment plan..."
            />
          </div>

          {/* Vital Signs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vital Signs
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  name="vitalSigns.bloodPressure"
                  value={createForm.vitalSigns.bloodPressure}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Blood Pressure"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="vitalSigns.heartRate"
                  value={createForm.vitalSigns.heartRate}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Heart Rate (bpm)"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="vitalSigns.temperature"
                  value={createForm.vitalSigns.temperature}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Temperature (°F)"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="vitalSigns.weight"
                  value={createForm.vitalSigns.weight}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Weight (lbs)"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Medications
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Medication
              </button>
            </div>

            {createForm.medications.map((medication, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={medication.name}
                    onChange={(e) =>
                      updateMedication(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Medication name"
                  />
                  <input
                    type="text"
                    value={medication.dosage}
                    onChange={(e) =>
                      updateMedication(index, "dosage", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dosage"
                  />
                  <input
                    type="text"
                    value={medication.frequency}
                    onChange={(e) =>
                      updateMedication(index, "frequency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Frequency"
                  />
                  <input
                    type="text"
                    value={medication.duration}
                    onChange={(e) =>
                      updateMedication(index, "duration", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Duration"
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={medication.instructions}
                    onChange={(e) =>
                      updateMedication(index, "instructions", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Special instructions"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={createForm.notes}
              onChange={handleCreateFormChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes or observations..."
            />
          </div>

          {/* Follow-up */}
          <div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                name="followUpRequired"
                checked={createForm.followUpRequired}
                onChange={handleCreateFormChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Follow-up required
              </label>
            </div>

            {createForm.followUpRequired && (
              <input
                type="date"
                name="followUpDate"
                value={createForm.followUpDate}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Record"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const DoctorMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [recentAppointments, setRecentAppointments] = useState([]);

  // Toast state
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Form state for creating new record
  const [createForm, setCreateForm] = useState({
    patient: "",
    appointment: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medications: [],
    notes: "",
    followUpRequired: false,
    followUpDate: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
    },
  });

  // Toast functions
  const showToast = (message, type = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Fetch medical records
  const fetchRecords = useCallback(async (searchQuery = "") => {
    try {
      setLoading(true);
      const filters = {
        page: 1,
        limit: 10,
      };

      if (searchQuery) {
        filters.diagnosis = searchQuery;
      }

      const result = await medicalRecordsAPI.getDoctorRecords(filters);
      if (result.success) {
        setRecords(result.records);
        setError("");
      } else {
        setError(result.message || "Failed to fetch medical records");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch recent completed appointments for creating records
  const fetchRecentAppointments = useCallback(async () => {
    try {
      const result = await appointmentsAPI.getDoctorAppointments({
        status: "completed",
        limit: 20,
      });
      if (result.success) {
        setRecentAppointments(result.appointments);
      }
    } catch {
      // Silent fail for appointments
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchRecentAppointments();
  }, [fetchRecords, fetchRecentAppointments]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchRecords(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchRecords]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Handle both date string and date object
    let date;
    if (typeof dateString === "string") {
      date = new Date(dateString);
    } else if (dateString instanceof Date) {
      date = dateString;
    } else {
      return "N/A";
    }

    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Time";
    return date.toLocaleTimeString("en-US", {
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

  const handleCreateFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("vitalSigns.")) {
      const vitalSign = name.split(".")[1];
      setCreateForm((prev) => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [vitalSign]: value,
        },
      }));
    } else {
      setCreateForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }, []);

  const addMedication = useCallback(() => {
    setCreateForm((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  }, []);

  const updateMedication = useCallback((index, field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  }, []);

  const removeMedication = useCallback((index) => {
    setCreateForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAppointmentSelect = useCallback(
    (appointmentId) => {
      const appointment = recentAppointments.find(
        (app) => app._id === appointmentId
      );
      if (appointment) {
        setCreateForm((prev) => ({
          ...prev,
          appointment: appointmentId,
          patient: appointment.patient._id,
        }));
      }
    },
    [recentAppointments]
  );

  const handleCreateRecord = async (e) => {
    e.preventDefault();

    if (!createForm.patient || !createForm.diagnosis) {
      setError("Patient and diagnosis are required");
      return;
    }

    try {
      setLoading(true);
      const recordData = {
        ...createForm,
        medications: createForm.medications.filter(
          (med) => med.name.trim() !== ""
        ),
        vitalSigns: Object.fromEntries(
          Object.entries(createForm.vitalSigns).filter(
            ([, value]) => value.trim() !== ""
          )
        ),
      };

      const result = await medicalRecordsAPI.createRecord(recordData);
      if (result.success) {
        setShowCreateModal(false);
        setCreateForm({
          patient: "",
          appointment: "",
          diagnosis: "",
          symptoms: "",
          treatment: "",
          medications: [],
          notes: "",
          followUpRequired: false,
          followUpDate: "",
          vitalSigns: {
            bloodPressure: "",
            heartRate: "",
            temperature: "",
            weight: "",
          },
        });
        fetchRecords();
        setError("");
        showToast("Medical record created successfully!", "success");
      } else {
        setError(result.message || "Failed to create medical record");
        showToast(result.message || "Failed to create medical record", "error");
      }
    } catch {
      setError("Network error. Please try again.");
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const RecordDetailModal = ({ record, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Medical Record Details
              </h2>
              <p className="text-gray-600">
                {formatDate(record.recordDate)} at{" "}
                {formatTime(record.recordDate)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                👤 Patient Information
              </h3>
              <p className="text-blue-800">
                <strong>{record.patient.name}</strong>
              </p>
              <p className="text-blue-700 text-sm">{record.patient.email}</p>
              <p className="text-blue-700 text-sm">{record.patient.phone}</p>
            </div>

            {/* Appointment Info */}
            {record.appointment && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  📅 Related Appointment
                </h3>
                <p className="text-green-800">
                  {record.appointment.date
                    ? formatDate(record.appointment.date)
                    : "Date not available"}
                </p>
                <p className="text-green-700 text-sm">
                  {record.appointment.reason}
                </p>
              </div>
            )}
          </div>

          {/* Record content - same as patient view */}
          <div className="mt-6 space-y-6">
            {/* Diagnosis */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                {getRecordTypeIcon(record.diagnosis)} Diagnosis
              </h3>
              <p className="text-red-800">{record.diagnosis}</p>
            </div>

            {/* Rest of the content same as patient view... */}
            {/* (truncated for brevity - same content structure) */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
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
                  Medical Records
                </h1>
                <p className="text-gray-300 text-lg">
                  Manage patient medical records and create new entries
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-modern bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            >
              + Create Record
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Records
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by diagnosis, patient name, or treatment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {records.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No medical records found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Start by creating your first medical record"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <div
                      key={record._id}
                      className="p-6 hover:bg-gray-50 transition duration-200 cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">
                              {getRecordTypeIcon(record.diagnosis)}
                            </span>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {record.diagnosis}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Patient: {record.patient.name}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                Date
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(record.recordDate)}
                              </p>
                            </div>

                            {record.symptoms && (
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Symptoms
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {record.symptoms}
                                </p>
                              </div>
                            )}

                            {record.followUpRequired && (
                              <div>
                                <p className="text-sm font-medium text-orange-700">
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
          </>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateRecordModal
            createForm={createForm}
            recentAppointments={recentAppointments}
            handleCreateFormChange={handleCreateFormChange}
            handleAppointmentSelect={handleAppointmentSelect}
            addMedication={addMedication}
            updateMedication={updateMedication}
            removeMedication={removeMedication}
            handleCreateRecord={handleCreateRecord}
            loading={loading}
            setShowCreateModal={setShowCreateModal}
            formatDate={formatDate}
          />
        )}
        {selectedRecord && (
          <RecordDetailModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        )}

        {/* Toast notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
};

export default DoctorMedicalRecords;
