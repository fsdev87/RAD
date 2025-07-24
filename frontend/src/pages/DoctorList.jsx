import React, { useState, useEffect } from "react";
import { doctorsAPI } from "../services/api";

const DoctorList = ({ setCurrentView, setSelectedDoctor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log("Fetching doctors...");
        const result = await doctorsAPI.getAllDoctors();
        console.log("Doctors API result:", result);
        if (result.success) {
          console.log("Doctors data:", result.data);
          setDoctors(result.data);
        } else {
          console.error("Doctors API error:", result.message);
          setError(result.message || "Failed to fetch doctors");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique specialties - safely handle empty/undefined doctors array
  const specialties = [
    ...new Set((doctors || []).map((doctor) => doctor.specialization)),
  ];

  // Filter doctors based on search and specialty - safely handle empty/undefined doctors array
  const filteredDoctors = (doctors || []).filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "" || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView("book-appointment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
        <p className="text-gray-600">
          Browse and book appointments with our qualified medical professionals
        </p>
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
          <span className="ml-3 text-gray-600">Loading doctors...</span>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Doctors
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or specialty..."
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

              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                {/* Doctor Image */}
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.name
                    )}&background=random&size=300`}
                    alt={doctor.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {doctor.specialization}
                    </p>
                    <p className="text-gray-600 text-sm">
                      License: {doctor.licenseNumber}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm">Email:</span>
                      <span className="ml-2 text-gray-900 text-sm">
                        {doctor.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm">Phone:</span>
                      <span className="ml-2 text-gray-900 text-sm">
                        {doctor.phone}
                      </span>
                    </div>
                  </div>

                  {/* Book Appointment Button */}
                  <button
                    onClick={() => handleBookAppointment(doctor)}
                    className="w-full py-2 px-4 rounded-lg font-medium transition duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorList;
