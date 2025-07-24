import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import WelcomePage from "./pages/WelcomePage";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/BookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600"
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
            <span className="text-gray-600">Loading...</span>
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
          return <DoctorAppointments />;
        case "doctor-prescriptions":
          return <DoctorPrescriptions />;
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
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        userType={userType}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main>{renderCurrentView()}</main>
    </div>
  );
};

export default App;
