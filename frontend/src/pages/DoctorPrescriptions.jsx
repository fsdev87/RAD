import React, { useState } from "react";
import {
  getPrescriptionsByDoctor,
  getPatientById,
  getAppointmentsByDoctor,
} from "../data/mockData";

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
}) => {
  if (!showCreateForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create New Prescription</h2>
            <button
              onClick={() => setShowCreateForm(false)}
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

        <form onSubmit={handleSubmitPrescription} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient (Appointment)
              </label>
              <select
                name="appointmentId"
                value={newPrescription.appointmentId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose an appointment</option>
                {doctorAppointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.patientName} - {apt.date} {apt.time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                value={newPrescription.followUpDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={newPrescription.diagnosis}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter diagnosis..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Medications</h3>
              <button
                type="button"
                onClick={handleAddMedication}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                + Add Medication
              </button>
            </div>

            {newPrescription.medications.map((medication, index) => (
              <div
                key={medication.id}
                className="bg-gray-50 rounded-lg p-4 mb-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    Medication {index + 1}
                  </h4>
                  {newPrescription.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(medication.id)}
                      className="text-red-600 hover:text-red-700"
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
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">
                        Three times daily
                      </option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                      <option value="Every 4 hours">Every 4 hours</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={newPrescription.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any additional notes or instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
            >
              Create Prescription
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
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    appointmentId: "",
    diagnosis: "",
    medications: [
      {
        id: Date.now(), // Unique identifier
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    notes: "",
    followUpDate: "",
  });

  const currentDoctorId = 1; // Mock current doctor ID
  const prescriptions = getPrescriptionsByDoctor(currentDoctorId);
  const doctorAppointments = getAppointmentsByDoctor(currentDoctorId);

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

  const handleSubmitPrescription = (e) => {
    e.preventDefault();
    // Mock submission - in real app, this would call an API
    console.log("New prescription:", newPrescription);
    setShowCreateForm(false);
    setNewPrescription({
      patientId: "",
      appointmentId: "",
      diagnosis: "",
      medications: [
        {
          id: Date.now(),
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
      notes: "",
      followUpDate: "",
    });
    // Show success message or redirect
  };

  const PrescriptionCard = ({ prescription }) => {
    const patient = getPatientById(prescription.patientId);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600 font-semibold text-lg">
                {prescription.patientName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {prescription.patientName}
              </h3>
              <p className="text-gray-600">{patient?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Prescribed on</p>
            <p className="font-medium text-gray-900">
              {formatDate(prescription.date)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">Diagnosis:</p>
          <p className="text-gray-900">{prescription.diagnosis}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Medications ({prescription.medications.length}):
          </p>
          <div className="space-y-1">
            {prescription.medications.slice(0, 2).map((med, index) => (
              <div key={index} className="text-sm bg-green-50 rounded p-2">
                <span className="font-medium">{med.name}</span> - {med.dosage},{" "}
                {med.frequency}
              </div>
            ))}
            {prescription.medications.length > 2 && (
              <p className="text-sm text-blue-600">
                +{prescription.medications.length - 2} more medications
              </p>
            )}
          </div>
        </div>

        {prescription.followUpDate && (
          <div className="border-t pt-3 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Follow-up:</span>{" "}
              {formatDate(prescription.followUpDate)}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setSelectedPrescription(prescription)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </button>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Duplicate
          </button>
          <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
            Edit
          </button>
        </div>
      </div>
    );
  };

  const PrescriptionModal = ({ prescription, onClose }) => {
    if (!prescription) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-green-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Prescription Details</h2>
                <p className="text-green-100">
                  Prescribed on {formatDate(prescription.date)}
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
            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold text-gray-900 mb-2">
                Patient Information
              </h4>
              <p className="text-gray-700">{prescription.patientName}</p>
            </div>

            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <p className="text-gray-700">{prescription.diagnosis}</p>
            </div>

            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold text-gray-900 mb-4">
                Prescribed Medications
              </h4>
              <div className="space-y-4">
                {prescription.medications.map((med, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {med.name}
                        </p>
                        <p className="text-gray-600">
                          Dosage:{" "}
                          <span className="font-medium">{med.dosage}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          Frequency:{" "}
                          <span className="font-medium">{med.frequency}</span>
                        </p>
                        <p className="text-gray-600">
                          Duration:{" "}
                          <span className="font-medium">{med.duration}</span>
                        </p>
                      </div>
                    </div>
                    {med.instructions && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Instructions:</span>{" "}
                          {med.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="mb-6 pb-4 border-b">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700">{prescription.notes}</p>
              </div>
            )}

            {prescription.followUpDate && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Follow-up Appointment
                </h4>
                <p className="text-gray-700">
                  Scheduled for {formatDate(prescription.followUpDate)}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
                Download PDF
              </button>
              <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition duration-200">
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Prescriptions
          </h1>
          <p className="text-gray-600">
            Manage and create patient prescriptions
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center"
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
      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prescriptions created yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first prescription
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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
      />
    </div>
  );
};

export default DoctorPrescriptions;
