import React, { useState, useEffect } from "react";
import { prescriptionsAPI } from "../services/api";

const PatientPrescriptions = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch prescriptions on component mount
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await prescriptionsAPI.getPatientPrescriptions();

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PrescriptionCard = ({ prescription }) => {
    const doctor = prescription.doctor || {
      name: "Unknown Doctor",
      specialization: "General",
    };

    return (
      <div
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer shadow-xl"
        onClick={() => setSelectedPrescription(prescription)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={doctor?.image || "/api/placeholder/50/50"}
              alt={doctor.name}
              className="w-10 h-10 rounded-full mr-3 ring-2 ring-white/20"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">
                {doctor.name}
              </h3>
              <p className="text-blue-300 text-sm">{doctor.specialization}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Prescribed on</p>
            <p className="font-medium text-gray-200">
              {formatDate(prescription.createdAt || prescription.issuedDate)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-400">Diagnosis:</p>
          <p className="text-gray-200">{prescription.diagnosis}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-400 mb-2">
            Medications ({prescription.medications.length}):
          </p>
          <div className="space-y-1">
            {prescription.medications.slice(0, 2).map((med, index) => (
              <div key={index} className="text-sm bg-white/5 rounded p-2">
                <span className="font-medium text-gray-200">{med.name}</span> -{" "}
                <span className="text-gray-300">
                  {med.dosage}, {med.frequency}
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
          <div className="border-t border-white/20 pt-3">
            <p className="text-sm text-gray-300">
              <span className="font-medium">Follow-up:</span>{" "}
              {formatDate(prescription.followUpDate)}
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    );
  };

  const PrescriptionModal = ({ prescription, onClose }) => {
    if (!prescription) return null;

    const doctor = prescription.doctor || {
      name: "Unknown Doctor",
      specialization: "General",
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Medical Prescription</h2>
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
            {/* Doctor Information */}
            <div className="flex items-center mb-6 pb-4 border-b border-white/20">
              <img
                src={doctor?.image || "/api/placeholder/60/60"}
                alt={doctor.name}
                className="w-15 h-15 rounded-full mr-4 ring-2 ring-white/20"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Dr. {doctor.name}
                </h3>
                <p className="text-blue-300">{doctor.specialization}</p>
                <p className="text-gray-300 text-sm">
                  {doctor.qualification || doctor.specialization}
                </p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-6 pb-4 border-b border-white/20">
              <h4 className="font-semibold text-white mb-2">
                Patient Information
              </h4>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-gray-300">
                  {prescription.patient?.name || "You"}
                </p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-6 pb-4 border-b border-white/20">
              <h4 className="font-semibold text-white mb-2">Diagnosis</h4>
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-200">{prescription.diagnosis}</p>
              </div>
            </div>

            {/* Medications */}
            <div className="mb-6 pb-4 border-b border-white/20">
              <h4 className="font-semibold text-white mb-4">
                Prescribed Medications
              </h4>
              <div className="space-y-4">
                {prescription.medications.map((med, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-white text-lg">
                          {med.name}
                        </p>
                        <p className="text-gray-300">
                          Dosage:{" "}
                          <span className="font-medium text-blue-300">
                            {med.dosage}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-300">
                          Frequency:{" "}
                          <span className="font-medium text-blue-300">
                            {med.frequency}
                          </span>
                        </p>
                        <p className="text-gray-300">
                          Duration:{" "}
                          <span className="font-medium text-purple-300">
                            {med.duration}
                          </span>
                        </p>
                      </div>
                    </div>
                    {med.instructions && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-yellow-300">
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

            {/* Doctor's Notes */}
            {prescription.notes && (
              <div className="mb-6 pb-4 border-b border-white/20">
                <h4 className="font-semibold text-white mb-2">
                  Doctor's Notes
                </h4>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-300">{prescription.notes}</p>
                </div>
              </div>
            )}

            {/* Follow-up */}
            {prescription.followUpDate && (
              <div className="mb-6">
                <h4 className="font-semibold text-white mb-2">
                  Follow-up Appointment
                </h4>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-200">
                    Scheduled for {formatDate(prescription.followUpDate)}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition duration-200 font-medium shadow-lg">
                Download PDF
              </button>
              <button className="flex-1 border border-white/30 hover:bg-white/10 text-gray-300 hover:text-white py-3 px-4 rounded-xl transition duration-200 font-medium">
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
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <div>
              <h1 className="heading-gradient text-4xl font-bold mb-2">
                My Prescriptions
              </h1>
              <p className="text-gray-300 text-lg">
                View and manage your medical prescriptions
              </p>
            </div>
          </div>
        </div>

        {/* Prescriptions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-400 mr-3"
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
              <span className="text-gray-300">Loading prescriptions...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-white mb-2">
              Error loading prescriptions
            </h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => fetchPrescriptions()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : prescriptions.length > 0 ? (
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
            <div className="text-gray-400 text-6xl mb-4">💊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No prescriptions found
            </h3>
            <p className="text-gray-600 mb-6">
              Your prescriptions from doctors will appear here
            </p>
            <div className="space-x-4">
              <button
                onClick={() => fetchPrescriptions()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Prescription Detail Modal */}
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />

        {/* Quick Tips */}
        <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            💡 Prescription Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Always take medications as prescribed by your doctor</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Don't stop medication without consulting your doctor</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Keep track of side effects and report them</span>
            </div>
            <div className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Store medications properly as instructed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
