import React, { useState } from "react";
// TODO: Import prescriptionsAPI when implementing real API integration

const PatientPrescriptions = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // TODO: Replace with real API call to prescriptionsAPI.getPatientPrescriptions()
  const prescriptions = []; // Placeholder - will be populated from database

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PrescriptionCard = ({ prescription }) => {
    // TODO: Doctor info will be populated from prescription.doctor when using real API
    const doctor = prescription.doctor || {
      name: "Unknown Doctor",
      specialization: "General",
    };

    return (
      <div
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer"
        onClick={() => setSelectedPrescription(prescription)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={doctor?.image || "/api/placeholder/50/50"}
              alt={prescription.doctorName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {prescription.doctorName}
              </h3>
              <p className="text-blue-600 text-sm">{doctor?.specialty}</p>
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
              <div key={index} className="text-sm bg-gray-50 rounded p-2">
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
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Follow-up:</span>{" "}
              {formatDate(prescription.followUpDate)}
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    );
  };

  const PrescriptionModal = ({ prescription, onClose }) => {
    if (!prescription) return null;

    // TODO: Doctor info will be populated from prescription.doctor when using real API
    const doctor = prescription.doctor || {
      name: "Unknown Doctor",
      specialization: "General",
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Medical Prescription</h2>
                <p className="text-blue-100">
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
            {/* Doctor Information */}
            <div className="flex items-center mb-6 pb-4 border-b">
              <img
                src={doctor?.image || "/api/placeholder/60/60"}
                alt={prescription.doctorName}
                className="w-15 h-15 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {prescription.doctorName}
                </h3>
                <p className="text-blue-600">{doctor?.specialty}</p>
                <p className="text-gray-600 text-sm">{doctor?.qualification}</p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold text-gray-900 mb-2">
                Patient Information
              </h4>
              <p className="text-gray-700">{prescription.patientName}</p>
            </div>

            {/* Diagnosis */}
            <div className="mb-6 pb-4 border-b">
              <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <p className="text-gray-700">{prescription.diagnosis}</p>
            </div>

            {/* Medications */}
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

            {/* Doctor's Notes */}
            {prescription.notes && (
              <div className="mb-6 pb-4 border-b">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Doctor's Notes
                </h4>
                <p className="text-gray-700">{prescription.notes}</p>
              </div>
            )}

            {/* Follow-up */}
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

            {/* Actions */}
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Prescriptions
        </h1>
        <p className="text-gray-600">
          View and manage your medical prescriptions
        </p>
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
          <div className="text-gray-400 text-6xl mb-4">💊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-600 mb-6">
            Your prescriptions from doctors will appear here
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Book Appointment
          </button>
        </div>
      )}

      {/* Prescription Detail Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />

      {/* Quick Tips */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          💡 Prescription Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Always take medications as prescribed by your doctor</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Don't stop medication without consulting your doctor</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Keep track of side effects and report them</span>
          </div>
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Store medications properly as instructed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
