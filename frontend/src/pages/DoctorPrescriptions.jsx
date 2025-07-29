import React, { useState, useEffect } from "react";
import { prescriptionsAPI, appointmentsAPI } from "../services/api";
import Toast from "../components/Toast";

// Separate component to prevent re-creation on every render
const CreatePrescriptionForm = ({
  showCreateForm,
  setShowCreateForm,
  newPrescription,
  handleInputChange,
  handleMedicationChange,
  handleAddMedication,
  handleRemoveMedication,
  handleSubmitPrescription,
  doctorAppointments,
  error,
  isSubmitting,
}) => {
  if (!showCreateForm) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create New Prescription</h2>
            <button
              onClick={() => setShowCreateForm(false)}
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

        <form onSubmit={handleSubmitPrescription} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-xl">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Select Confirmed Consultation
              </label>
              <select
                name="appointmentId"
                value={newPrescription.appointmentId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" className="bg-gray-800">
                  Choose a confirmed consultation...
                </option>
                {doctorAppointments.length === 0 ? (
                  <option disabled className="bg-gray-800">
                    No confirmed consultations available
                  </option>
                ) : (
                  doctorAppointments.map((apt) => (
                    <option
                      key={apt._id}
                      value={apt._id}
                      className="bg-gray-800"
                    >
                      {apt.patient?.name || "Unknown Patient"} -{" "}
                      {new Date(apt.date).toLocaleDateString()} at {apt.time} (
                      {apt.reason})
                    </option>
                  ))
                )}
              </select>
              {doctorAppointments.length === 0 && (
                <p className="mt-2 text-sm text-white/60">
                  💡 Confirm patient consultations first to create prescriptions
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                value={newPrescription.followUpDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={newPrescription.diagnosis}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter diagnosis..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Medications</h3>
              <button
                type="button"
                onClick={handleAddMedication}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium"
              >
                + Add Medication
              </button>
            </div>

            {newPrescription.medications.length === 0 ? (
              <div className="text-center py-8 text-white/60 border-2 border-dashed border-white/20 rounded-xl">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="mb-2 font-medium text-white">
                  No medications added yet
                </p>
                <p className="text-sm">
                  Click "Add Medication" to prescribe medicines, or submit
                  without medications if none are needed
                </p>
              </div>
            ) : (
              newPrescription.medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-white">
                      Medication {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(medication.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Remove this medication"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Paracetamol"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "dosage",
                            e.target.value
                          )
                        }
                        placeholder="e.g., 500mg"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Frequency
                      </label>
                      <select
                        value={medication.frequency}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "frequency",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="" className="bg-gray-800">
                          Select frequency
                        </option>
                        <option value="Once daily" className="bg-gray-800">
                          Once daily
                        </option>
                        <option value="Twice daily" className="bg-gray-800">
                          Twice daily
                        </option>
                        <option
                          value="Three times daily"
                          className="bg-gray-800"
                        >
                          Three times daily
                        </option>
                        <option
                          value="Four times daily"
                          className="bg-gray-800"
                        >
                          Four times daily
                        </option>
                        <option value="As needed" className="bg-gray-800">
                          As needed
                        </option>
                        <option value="Every 4 hours" className="bg-gray-800">
                          Every 4 hours
                        </option>
                        <option value="Every 6 hours" className="bg-gray-800">
                          Every 6 hours
                        </option>
                        <option value="Every 8 hours" className="bg-gray-800">
                          Every 8 hours
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) =>
                          handleMedicationChange(
                            medication.id,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="e.g., 7 days"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      value={medication.instructions}
                      onChange={(e) =>
                        handleMedicationChange(
                          medication.id,
                          "instructions",
                          e.target.value
                        )
                      }
                      rows="2"
                      placeholder="e.g., Take with food, Take on empty stomach..."
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={newPrescription.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any additional notes or instructions..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl transition-all duration-300 flex items-center font-medium"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Prescription"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DoctorPrescriptions = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    appointmentId: "",
    diagnosis: "",
    medications: [], // Start with empty medications array - add as needed
    notes: "",
    followUpDate: "",
  });

  // Fetch prescriptions and appointments on component mount
  useEffect(() => {
    fetchPrescriptions();
    fetchDoctorAppointments();
  }, []);

  // Debug log for doctorAppointments state changes
  useEffect(() => {
    console.log("🔄 DoctorAppointments state updated:", {
      count: doctorAppointments.length,
      appointments: doctorAppointments.map(apt => ({
        id: apt._id,
        patient: apt.patient?.name || 'No patient name',
        date: apt.date,
        time: apt.time,
        status: apt.status
      }))
    });
  }, [doctorAppointments]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const result = await prescriptionsAPI.getDoctorPrescriptions();
      if (result.success) {
        setPrescriptions(result.prescriptions || []);
      } else {
        setError(result.message || "Failed to fetch prescriptions");
      }
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAppointments = async () => {
    try {
      console.log("🔍 Fetching confirmed appointments for prescriptions...");
      
      // Fetch confirmed appointments directly from API with higher limit
      const result = await appointmentsAPI.getDoctorAppointments({
        status: "confirmed",
        limit: 100, // Get up to 100 confirmed appointments
      });
      
      console.log("📋 API Response:", result);
      
      if (result.success) {
        const confirmedAppointments = result.appointments || [];

        console.log(
          `✅ Found ${confirmedAppointments.length} confirmed appointments for prescriptions:`,
          confirmedAppointments
        );
        setDoctorAppointments(confirmedAppointments);

        if (confirmedAppointments.length === 0) {
          console.log("⚠️ No confirmed appointments available for prescriptions");
        }
      } else {
        console.error("❌ Failed to fetch appointments:", result.message);
      }
    } catch (err) {
      console.error("💥 Error fetching appointments:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddMedication = () => {
    setNewPrescription((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          id: Date.now() + Math.random(), // Ensure unique ID
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  };

  const handleRemoveMedication = (medicationId) => {
    setNewPrescription((prev) => ({
      ...prev,
      medications: prev.medications.filter((med) => med.id !== medicationId),
    }));
  };

  const handleMedicationChange = (medicationId, field, value) => {
    setNewPrescription((prev) => ({
      ...prev,
      medications: prev.medications.map((med) =>
        med.id === medicationId ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Find the selected appointment to get patient info
      const selectedAppointment = doctorAppointments.find(
        (apt) => apt._id === newPrescription.appointmentId
      );

      if (!selectedAppointment) {
        setError("Please select an appointment");
        showToast("Please select an appointment", "error");
        setIsSubmitting(false);
        return;
      }

      // Prepare prescription data for API
      const prescriptionData = {
        patientId: selectedAppointment.patient._id,
        appointmentId: newPrescription.appointmentId,
        diagnosis: newPrescription.diagnosis,
        medications: newPrescription.medications.map((med) => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
        })),
        notes: newPrescription.notes,
        followUpDate: newPrescription.followUpDate || null,
      };

      console.log("Creating prescription:", prescriptionData);

      const result = await prescriptionsAPI.createPrescription(
        prescriptionData
      );

      if (result.success) {
        console.log("Prescription created successfully:", result.prescription);

        // Auto-complete the appointment after prescription creation
        try {
          const updateResult = await appointmentsAPI.updateAppointmentStatus(
            newPrescription.appointmentId,
            "completed"
          );
          if (updateResult.success) {
            console.log("Appointment auto-completed successfully");
          }
        } catch (updateError) {
          console.error("Error auto-completing appointment:", updateError);
          // Don't fail the prescription creation if status update fails
        }

        // Close form and reset
        setShowCreateForm(false);
        resetForm();

        // Refresh prescriptions list and appointments
        fetchPrescriptions();
        fetchDoctorAppointments(); // Refresh to remove completed appointment from list

        // Show success toast notification
        const medicationCount = newPrescription.medications.length;
        const successMessage =
          medicationCount > 0
            ? `✅ Prescription created with ${medicationCount} medication(s). Appointment completed!`
            : "✅ Prescription created successfully. Appointment completed!";
        showToast(successMessage, "success");
      } else {
        setError(result.message || "Failed to create prescription");
        showToast(result.message || "Failed to create prescription", "error");
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      setError("Network error. Please try again.");
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewPrescription({
      patientId: "",
      appointmentId: "",
      diagnosis: "",
      medications: [], // Start with empty medications array - add as needed
      notes: "",
      followUpDate: "",
    });
  };

  const PrescriptionCard = ({ prescription }) => {
    const patient = prescription.patient || {
      name: "Unknown Patient",
      email: "N/A",
      phone: "N/A",
    };

    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-semibold text-lg">
                {patient.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {patient.name}
              </h3>
              <p className="text-white/70">{patient.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">Prescribed on</p>
            <p className="font-medium text-white">
              {formatDate(prescription.createdAt || prescription.issuedDate)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-white/70">Diagnosis:</p>
          <p className="text-white">{prescription.diagnosis}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-white/70 mb-2">
            Medications ({prescription.medications.length}):
          </p>
          <div className="space-y-1">
            {prescription.medications.slice(0, 2).map((med, index) => (
              <div
                key={index}
                className="text-sm bg-blue-500/20 border border-blue-500/30 rounded-lg p-2"
              >
                <span className="font-medium text-blue-300">{med.name}</span>
                <span className="text-white/80">
                  {" "}
                  - {med.dosage}, {med.frequency}
                </span>
              </div>
            ))}
            {prescription.medications.length > 2 && (
              <p className="text-sm text-blue-300">
                +{prescription.medications.length - 2} more medications
              </p>
            )}
          </div>
        </div>

        {prescription.followUpDate && (
          <div className="border-t border-white/20 pt-3 mb-4">
            <p className="text-sm text-white/70">
              <span className="font-medium">Follow-up:</span>{" "}
              <span className="text-white">
                {formatDate(prescription.followUpDate)}
              </span>
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setSelectedPrescription(prescription)}
            className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors">
            Duplicate
          </button>
          <button className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Edit
          </button>
        </div>
      </div>
    );
  };

  const PrescriptionModal = ({ prescription, onClose }) => {
    if (!prescription) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Prescription Details</h2>
                <p className="text-blue-100">
                  Prescribed on{" "}
                  {formatDate(
                    prescription.createdAt || prescription.issuedDate
                  )}
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
            <div className="mb-6 pb-4 border-b border-white/20">
              <h4 className="font-semibold text-white mb-2">
                Patient Information
              </h4>
              <p className="text-white/80">
                {prescription.patient?.name || "Unknown Patient"}
              </p>
            </div>

            <div className="mb-6 pb-4 border-b border-white/20">
              <h4 className="font-semibold text-white mb-2">Diagnosis</h4>
              <p className="text-white/80">{prescription.diagnosis}</p>
            </div>

            <div className="mb-6 pb-4 border-b border-white/20">
              <h4 className="font-semibold text-white mb-4">
                Prescribed Medications
              </h4>
              <div className="space-y-4">
                {prescription.medications.map((med, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-white text-lg">
                          {med.name}
                        </p>
                        <p className="text-white/70">
                          Dosage:{" "}
                          <span className="font-medium text-white">
                            {med.dosage}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-white/70">
                          Frequency:{" "}
                          <span className="font-medium text-white">
                            {med.frequency}
                          </span>
                        </p>
                        <p className="text-white/70">
                          Duration:{" "}
                          <span className="font-medium text-white">
                            {med.duration}
                          </span>
                        </p>
                      </div>
                    </div>
                    {med.instructions && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-sm text-white/70">
                          <span className="font-medium text-white">
                            Instructions:
                          </span>{" "}
                          {med.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="mb-6 pb-4 border-b border-white/20">
                <h4 className="font-semibold text-white mb-2">Notes</h4>
                <p className="text-white/80">{prescription.notes}</p>
              </div>
            )}

            {prescription.followUpDate && (
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-2">
                  Follow-up Appointment
                </h4>
                <p className="text-white/80">
                  Scheduled for {formatDate(prescription.followUpDate)}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-300 font-medium">
                Download PDF
              </button>
              <button className="flex-1 bg-white/10 border border-white/20 hover:bg-white/20 text-white py-2 px-4 rounded-xl transition-all duration-300 font-medium">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="heading-gradient text-4xl font-bold mb-2">
                My Prescriptions
              </h1>
              <p className="text-gray-300 text-lg">
                Manage and create patient prescriptions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
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
            New Prescription
          </button>
        </div>

        {/* Prescriptions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-white/60 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-white/80">Loading prescriptions...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-white mb-2">
              Error loading prescriptions
            </h3>
            <p className="text-white/70 mb-6">{error}</p>
            <button
              onClick={() => fetchPrescriptions()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription._id}
                prescription={prescription}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-white mb-2">
              No prescriptions created yet
            </h3>
            <p className="text-white/70 mb-6">
              Start by creating your first prescription
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              Create Prescription
            </button>
          </div>
        )}

        {/* Modals */}
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
        <CreatePrescriptionForm
          showCreateForm={showCreateForm}
          setShowCreateForm={setShowCreateForm}
          newPrescription={newPrescription}
          handleInputChange={handleInputChange}
          handleMedicationChange={handleMedicationChange}
          handleAddMedication={handleAddMedication}
          handleRemoveMedication={handleRemoveMedication}
          handleSubmitPrescription={handleSubmitPrescription}
          doctorAppointments={doctorAppointments}
          error={error}
          isSubmitting={isSubmitting}
        />

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

export default DoctorPrescriptions;
