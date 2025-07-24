import React, { useState } from "react";

const WelcomePage = ({ setUserType, setCurrentView, setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [userRole, setUserRole] = useState("patient");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialization: "", // for doctors
    licenseNumber: "", // for doctors
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - just proceed without validation
    setUserType(userRole);
    setIsAuthenticated(true);
    // Set initial view based on user role
    if (userRole === "patient") {
      setCurrentView("doctors");
    } else {
      setCurrentView("doctor-appointments");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Mock registration - just proceed without validation
    setUserType(userRole);
    setIsAuthenticated(true);
    // Set initial view based on user role
    if (userRole === "patient") {
      setCurrentView("doctors");
    } else {
      setCurrentView("doctor-appointments");
    }
  };

  const handleLoginInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterInputChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            HealthCare System
          </h2>
          <p className="text-gray-600">
            Your trusted healthcare management platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUserRole("patient")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                userRole === "patient"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              👨‍🦱 Patient
            </button>
            <button
              onClick={() => setUserRole("doctor")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                userRole === "doctor"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              👨‍⚕️ Doctor
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === "login"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === "register"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginInputChange}
                  placeholder={`Enter your ${userRole} email`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Login as {userRole === "patient" ? "Patient" : "Doctor"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterInputChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registerForm.phone}
                  onChange={handleRegisterInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Doctor-specific fields */}
              {userRole === "doctor" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={registerForm.specialization}
                      onChange={handleRegisterInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={registerForm.licenseNumber}
                      onChange={handleRegisterInputChange}
                      placeholder="Enter your license number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterInputChange}
                  placeholder="Create a password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterInputChange}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
              >
                Register as {userRole === "patient" ? "Patient" : "Doctor"}
              </button>
            </form>
          )}

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Demo Credentials:
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Patient:</strong> patient@demo.com / password123
              </p>
              <p>
                <strong>Doctor:</strong> doctor@demo.com / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
