import React, { useState } from "react";
import Navigation from "./components/Navigation";
import WelcomePage from "./pages/WelcomePage";
import DoctorList from "./pages/DoctorList";
import BookAppointment from "./pages/BookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";

const App = () => {
  const [currentView, setCurrentView] = useState("doctors");
  const [userType, setUserType] = useState("patient");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType("patient");
    setCurrentView("doctors");
    setSelectedDoctor(null);
  };

  // If not authenticated, show welcome page
  if (!isAuthenticated) {
    return (
      <WelcomePage
        setUserType={setUserType}
        setCurrentView={setCurrentView}
        setIsAuthenticated={setIsAuthenticated}
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
          Welcome to HealthCare System
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
        onLogout={handleLogout}
      />
      <main>{renderCurrentView()}</main>
    </div>
  );
};

export default App;
