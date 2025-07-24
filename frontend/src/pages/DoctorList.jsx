import React, { useState } from "react";
import { doctors } from "../data/mockData";

const DoctorList = ({ setCurrentView, setSelectedDoctor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Get unique specialties
  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentView("book-appointment");
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "⭐" : "");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
        <p className="text-gray-600">
          Browse and book appointments with our qualified healthcare
          professionals
        </p>
      </div>

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
            key={doctor.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            {/* Doctor Image */}
            <div className="relative">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                  doctor.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {doctor.available ? "Available" : "Unavailable"}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm">{doctor.qualification}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Experience:</span>
                  <span className="ml-2 text-gray-900 font-medium">
                    {doctor.experience}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Rating:</span>
                  <span className="ml-2">{renderStars(doctor.rating)}</span>
                  <span className="ml-1 text-gray-700">({doctor.rating})</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Fee:</span>
                  <span className="ml-2 text-green-600 font-bold">
                    ${doctor.consultationFee}
                  </span>
                </div>
              </div>

              {/* Available Slots */}
              {doctor.available && doctor.availableSlots.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Next Available:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availableSlots.slice(0, 3).map((slot, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                      >
                        {new Date(slot).toLocaleDateString()}{" "}
                        {new Date(slot).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    ))}
                    {doctor.availableSlots.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{doctor.availableSlots.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Book Appointment Button */}
              <button
                onClick={() => handleBookAppointment(doctor)}
                disabled={!doctor.available}
                className={`w-full py-2 px-4 rounded-lg font-medium transition duration-200 ${
                  doctor.available
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {doctor.available
                  ? "Book Appointment"
                  : "Currently Unavailable"}
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
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
