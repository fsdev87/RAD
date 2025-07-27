import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import WelcomePage from "./pages/WelcomePage";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/BookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorMedicalRecords from "./pages/DoctorMedicalRecords";
import { authAPI, apiUtils } from "./services/api";

const App = () => {
  const [currentView, setCurrentView] = useState("doctors");
  const [userType, setUserType] = useState("patient");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(
    "App render - isAuthenticated:",
    isAuthenticated,
    "currentUser:",
    currentUser
  );

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiUtils.isLoggedIn()) {
          const storedUser = apiUtils.getStoredUser();
          if (storedUser) {
            setCurrentUser(storedUser);
            setUserType(storedUser.role);
            setIsAuthenticated(true);
            // Set initial view based on user role
            if (storedUser.role === "patient") {
              setCurrentView("doctors");
            } else {
              setCurrentView("doctor-appointments");
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear invalid auth
        authAPI.logout();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserType("patient");
    setCurrentView("doctors");
    setSelectedDoctor(null);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-8 w-8 text-white"
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
              <span className="text-white text-lg font-medium">
                Loading Medical Platform...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show welcome page
  if (!isAuthenticated) {
    return (
      <WelcomePage
        setUserType={setUserType}
        setCurrentView={setCurrentView}
        setIsAuthenticated={setIsAuthenticated}
        setCurrentUser={setCurrentUser}
      />
    );
  }

  const renderCurrentView = () => {
    // Patient Views
    if (userType === "patient") {
      switch (currentView) {
        case "doctors":
          return (
            <DoctorList
              setCurrentView={setCurrentView}
              setSelectedDoctor={setSelectedDoctor}
            />
          );
        case "book-appointment":
          return (
            <BookAppointment
              selectedDoctor={selectedDoctor}
              setCurrentView={setCurrentView}
              currentUser={currentUser}
            />
          );
        case "appointments":
          return <PatientAppointments setCurrentView={setCurrentView} />;
        case "prescriptions":
          return <PatientPrescriptions />;
        case "medical-records":
          return <PatientMedicalRecords />;
        default:
          return (
            <DoctorList
              setCurrentView={setCurrentView}
              setSelectedDoctor={setSelectedDoctor}
            />
          );
      }
    }

    // Doctor Views
    if (userType === "doctor") {
      switch (currentView) {
        case "doctor-appointments":
          return <DoctorAppointments setCurrentView={setCurrentView} />;
        case "doctor-prescriptions":
          return <DoctorPrescriptions />;
        case "doctor-medical-records":
          return <DoctorMedicalRecords />;
        default:
          return <DoctorAppointments />;
      }
    }

    // Fallback
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Ring A Doctor (RAD)
        </h2>
        <p className="text-gray-600">
          Please select a view from the navigation
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-purple-900">
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        userType={userType}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="animate-fade-in-up">{renderCurrentView()}</main>
    </div>
  );
};

export default App;
