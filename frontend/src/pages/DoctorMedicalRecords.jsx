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
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Create Medical Record
            </h2>
            <p className="text-white/70 text-sm">
              Document patient diagnosis and treatment
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
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

      <form onSubmit={handleCreateRecord} className="p-6">
        <div className="space-y-6">
          {/* Appointment Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Related Appointment (Recommended)
            </label>
            <select
              name="appointment"
              value={createForm.appointment}
              onChange={(e) => handleAppointmentSelect(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-gray-800">
                Select a completed appointment...
              </option>
              {recentAppointments.map((appointment) => (
                <option
                  key={appointment._id}
                  value={appointment._id}
                  className="bg-gray-800"
                >
                  {appointment.patient.name} - {formatDate(appointment.date)} -{" "}
                  {appointment.reason}
                </option>
              ))}
            </select>
            <p className="text-sm text-white/50 mt-1">
              Select an appointment to auto-fill patient information
            </p>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Diagnosis *
            </label>
            <input
              type="text"
              name="diagnosis"
              value={createForm.diagnosis}
              onChange={handleCreateFormChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
              placeholder="Enter diagnosis"
              required
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Symptoms
            </label>
            <textarea
              name="symptoms"
              value={createForm.symptoms}
              onChange={handleCreateFormChange}
              rows="3"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
              placeholder="Describe symptoms..."
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Treatment
            </label>
            <textarea
              name="treatment"
              value={createForm.treatment}
              onChange={handleCreateFormChange}
              rows="3"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
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
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                  placeholder="Blood Pressure"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="vitalSigns.heartRate"
                  value={createForm.vitalSigns.heartRate}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                  placeholder="Heart Rate (bpm)"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="vitalSigns.temperature"
                  value={createForm.vitalSigns.temperature}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                  placeholder="Temperature (°F)"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="vitalSigns.weight"
                  value={createForm.vitalSigns.weight}
                  onChange={handleCreateFormChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                  placeholder="Weight (lbs)"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-white/80">
                Medications
              </label>
              <button
                type="button"
                onClick={addMedication}
                className="px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                + Add Medication
              </button>
            </div>

            {createForm.medications.map((medication, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={medication.name}
                    onChange={(e) =>
                      updateMedication(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                    placeholder="Medication name"
                  />
                  <input
                    type="text"
                    value={medication.dosage}
                    onChange={(e) =>
                      updateMedication(index, "dosage", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                    placeholder="Dosage"
                  />
                  <input
                    type="text"
                    value={medication.frequency}
                    onChange={(e) =>
                      updateMedication(index, "frequency", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                    placeholder="Frequency"
                  />
                  <input
                    type="text"
                    value={medication.duration}
                    onChange={(e) =>
                      updateMedication(index, "duration", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
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
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                    placeholder="Special instructions"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="px-4 py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600/80 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={createForm.notes}
              onChange={handleCreateFormChange}
              rows="3"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
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
                className="mr-3 h-4 w-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-white/80">
                Follow-up required
              </label>
            </div>

            {createForm.followUpRequired && (
              <input
                type="date"
                name="followUpDate"
                value={createForm.followUpDate}
                onChange={handleCreateFormChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-white/20">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
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
        }));
      }
    },
    [recentAppointments]
  );

  const handleCreateRecord = async (e) => {
    e.preventDefault();

    if (!createForm.appointment || !createForm.diagnosis) {
      setError("Please select an appointment and provide a diagnosis");
      return;
    }

    try {
      setLoading(true);

      // Get patient ID from selected appointment
      const selectedAppointment = recentAppointments.find(
        (apt) => apt._id === createForm.appointment
      );

      if (!selectedAppointment) {
        setError("Selected appointment not found");
        return;
      }

      const recordData = {
        ...createForm,
        patient: selectedAppointment.patient._id,
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Medical Record Details
              </h2>
              <p className="text-white/70 text-sm">
                {formatDate(record.recordDate)} at{" "}
                {formatTime(record.recordDate)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all duration-200"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Patient Info */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Patient Information
              </h3>
              <p className="text-white font-medium">{record.patient.name}</p>
              <p className="text-white/70 text-sm">{record.patient.email}</p>
              <p className="text-white/70 text-sm">{record.patient.phone}</p>
            </div>

            {/* Appointment Info */}
            {record.appointment && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Related Appointment
                </h3>
                <p className="text-white font-medium">
                  {record.appointment.date
                    ? formatDate(record.appointment.date)
                    : "Date not available"}
                </p>
                <p className="text-white/70 text-sm">
                  {record.appointment.reason}
                </p>
              </div>
            )}
          </div>

          {/* Record content */}
          <div className="space-y-6">
            {/* Diagnosis */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-3 flex items-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Diagnosis
              </h3>
              <p className="text-white/90">{record.diagnosis}</p>
            </div>

            {/* Symptoms */}
            {record.symptoms && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Symptoms
                </h3>
                <p className="text-white/90">{record.symptoms}</p>
              </div>
            )}

            {/* Treatment */}
            {record.treatment && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Treatment
                </h3>
                <p className="text-white/90">{record.treatment}</p>
              </div>
            )}

            {/* Medications */}
            {record.medications && record.medications.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Medications
                </h3>
                <div className="space-y-3">
                  {record.medications.map((med, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-white">
                          {med.name}
                        </span>
                        <span className="text-white/70 text-sm">
                          {med.dosage}
                        </span>
                      </div>
                      {med.frequency && (
                        <p className="text-white/70 text-sm">
                          Frequency: {med.frequency}
                        </p>
                      )}
                      {med.duration && (
                        <p className="text-white/70 text-sm">
                          Duration: {med.duration}
                        </p>
                      )}
                      {med.instructions && (
                        <p className="text-white/70 text-sm">
                          Instructions: {med.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vital Signs */}
            {record.vitalSigns &&
              Object.keys(record.vitalSigns).some(
                (key) => record.vitalSigns[key]
              ) && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {record.vitalSigns.bloodPressure && (
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Blood Pressure</p>
                        <p className="text-white font-medium">
                          {record.vitalSigns.bloodPressure}
                        </p>
                      </div>
                    )}
                    {record.vitalSigns.heartRate && (
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Heart Rate</p>
                        <p className="text-white font-medium">
                          {record.vitalSigns.heartRate} bpm
                        </p>
                      </div>
                    )}
                    {record.vitalSigns.temperature && (
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Temperature</p>
                        <p className="text-white font-medium">
                          {record.vitalSigns.temperature}°F
                        </p>
                      </div>
                    )}
                    {record.vitalSigns.weight && (
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Weight</p>
                        <p className="text-white font-medium">
                          {record.vitalSigns.weight} lbs
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Notes */}
            {record.notes && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Additional Notes
                </h3>
                <p className="text-white/90">{record.notes}</p>
              </div>
            )}

            {/* Follow-up */}
            {record.followUpRequired && (
              <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-400/40 rounded-xl p-4">
                <h3 className="font-semibold text-amber-200 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Follow-up Required
                </h3>
                {record.followUpDate && (
                  <p className="text-amber-100">
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
          <div className="flex justify-between items-center">
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
                  Medical Records
                </h1>
                <p className="text-gray-300 text-lg">
                  Manage patient medical records and create new entries
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center shadow-lg font-medium"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Record
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Search Records
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by diagnosis, patient name, or treatment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-white/60"
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
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60"></div>
            <span className="ml-3 text-white/80">
              Loading medical records...
            </span>
          </div>
        ) : (
          <>
            {/* Records List */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl">
              {records.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-white/60 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No medical records found
                  </h3>
                  <p className="text-white/70">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Start by creating your first medical record"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {records.map((record) => (
                    <div
                      key={record._id}
                      className="p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer"
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
                              <p className="text-sm text-white/70">
                                Patient: {record.patient.name}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium text-white/80">
                                Date
                              </p>
                              <p className="text-sm text-white/70">
                                {formatDate(record.recordDate)}
                              </p>
                            </div>

                            {record.symptoms && (
                              <div>
                                <p className="text-sm font-medium text-white/80">
                                  Symptoms
                                </p>
                                <p className="text-sm text-white/70 truncate">
                                  {record.symptoms}
                                </p>
                              </div>
                            )}

                            {record.followUpRequired && (
                              <div>
                                <p className="text-sm font-medium text-orange-300">
                                  Follow-up Required
                                </p>
                                <p className="text-sm text-orange-200">
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
