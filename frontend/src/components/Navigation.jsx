import React, { useState } from "react";

const Navigation = ({ currentView, setCurrentView, userType, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const patientMenuItems = [
    { id: "doctors", label: "Find Doctors", icon: "👨‍⚕️" },
    { id: "appointments", label: "My Appointments", icon: "📅" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  ];

  const doctorMenuItems = [
    { id: "doctor-appointments", label: "My Appointments", icon: "📋" },
    { id: "doctor-prescriptions", label: "Prescriptions", icon: "📝" },
  ];

  const menuItems = userType === "patient" ? patientMenuItems : doctorMenuItems;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-2xl">🏥</div>
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                HealthCare
              </h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {userType === "patient" ? "Patient Portal" : "Doctor Portal"}
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  currentView === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side: Profile Menu */}
          <div className="flex items-center">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {userType === "patient" ? "👨‍🦱" : "👨‍⚕️"}
                  </span>
                </div>
                <svg
                  className="ml-1 w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-900">
                      {userType === "patient" ? "John Doe" : "Dr. Sarah Wilson"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {userType === "patient" ? "Patient" : "Cardiologist"}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Medical History
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Notifications
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    currentView === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              {/* Mobile Logout */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navigation;
