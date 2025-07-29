import axios from "axios";

// Base API configuration
const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("API Request - Token:", token ? "Found" : "Not found");
    console.log("API Request - URL:", config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true, user, token };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true, user, token };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        return { success: true, user: response.data.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to get user",
      };
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const response = await api.put("/auth/profile", updates);
      if (response.data.success) {
        const user = response.data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true };
  },
};

// Doctors API calls
export const doctorsAPI = {
  // Get all doctors
  getAllDoctors: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.specialization)
        params.append("specialization", filters.specialization);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/doctors?${params}`);
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.doctors, // Return as 'data' not 'doctors'
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch doctors",
      };
    }
  },

  // Get doctor by ID
  getDoctorById: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      if (response.data.success) {
        return { success: true, doctor: response.data.data.doctor };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch doctor",
      };
    }
  },

  // Get doctor availability
  getDoctorAvailability: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability`);
      if (response.data.success) {
        return { success: true, availability: response.data.data.availability };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch availability",
      };
    }
  },

  // Get specializations
  getSpecializations: async () => {
    try {
      const response = await api.get("/doctors/meta/specializations");
      if (response.data.success) {
        return {
          success: true,
          specializations: response.data.data.specializations,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch specializations",
      };
    }
  },
};

// Appointments API calls
export const appointmentsAPI = {
  // Create appointment (patient)
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post("/appointments", appointmentData);
      if (response.data.success) {
        return { success: true, appointment: response.data.data.appointment };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create appointment",
      };
    }
  },

  // Get patient appointments
  getPatientAppointments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/appointments/patient?${params}`);
      if (response.data.success) {
        return {
          success: true,
          appointments: response.data.data.appointments,
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch appointments",
      };
    }
  },

  // Get doctor appointments
  getDoctorAppointments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/appointments/doctor?${params}`);
      if (response.data.success) {
        return {
          success: true,
          appointments: response.data.data.appointments,
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch appointments",
      };
    }
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      if (response.data.success) {
        return { success: true, appointment: response.data.data.appointment };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch appointment",
      };
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status, reason = null) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/status`, {
        status,
        reason,
      });
      if (response.data.success) {
        return { success: true, appointment: response.data.data.appointment };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update appointment",
      };
    }
  },

  // Complete appointment (doctor)
  completeAppointment: async (appointmentId, completionData) => {
    try {
      const response = await api.put(
        `/appointments/${appointmentId}/complete`,
        completionData
      );
      if (response.data.success) {
        return { success: true, appointment: response.data.data.appointment };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to complete appointment",
      };
    }
  },
};

// Prescriptions API calls
export const prescriptionsAPI = {
  // Create prescription (doctor)
  createPrescription: async (prescriptionData) => {
    try {
      const response = await api.post("/prescriptions", prescriptionData);
      if (response.data.success) {
        return { success: true, prescription: response.data.data.prescription };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create prescription",
      };
    }
  },

  // Get patient prescriptions
  getPatientPrescriptions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/prescriptions/patient?${params}`);
      if (response.data.success) {
        return {
          success: true,
          prescriptions: response.data.data.prescriptions,
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch prescriptions",
      };
    }
  },

  // Get doctor prescriptions
  getDoctorPrescriptions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.patientName)
        params.append("patientName", filters.patientName);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/prescriptions/doctor?${params}`);
      if (response.data.success) {
        return {
          success: true,
          prescriptions: response.data.data.prescriptions,
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch prescriptions",
      };
    }
  },

  // Get prescription by ID
  getPrescriptionById: async (prescriptionId) => {
    try {
      const response = await api.get(`/prescriptions/${prescriptionId}`);
      if (response.data.success) {
        return { success: true, prescription: response.data.data.prescription };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch prescription",
      };
    }
  },

  // Update prescription (doctor)
  updatePrescription: async (prescriptionId, updates) => {
    try {
      const response = await api.put(
        `/prescriptions/${prescriptionId}`,
        updates
      );
      if (response.data.success) {
        return { success: true, prescription: response.data.data.prescription };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update prescription",
      };
    }
  },

  // Update prescription status (doctor)
  updatePrescriptionStatus: async (prescriptionId, status) => {
    try {
      const response = await api.put(
        `/prescriptions/${prescriptionId}/status`,
        { status }
      );
      if (response.data.success) {
        return { success: true, prescription: response.data.data.prescription };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to update prescription status",
      };
    }
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem("token");
  },
};

// Medical Records API calls
export const medicalRecordsAPI = {
  // Get patient medical records
  getPatientRecords: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.doctorId) params.append("doctorId", filters.doctorId);
      if (filters.condition) params.append("condition", filters.condition);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/medical-records/patient?${params}`);
      if (response.data.success) {
        return {
          success: true,
          records: response.data.data.records,
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch medical records",
      };
    }
  },

  // Get doctor medical records
  getDoctorRecords: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.patientName)
        params.append("patientName", filters.patientName);
      if (filters.diagnosis) params.append("diagnosis", filters.diagnosis);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const response = await api.get(`/medical-records/doctor?${params}`);
      if (response.data.success) {
        return {
          success: true,
          records: response.data.data.records,
          pagination: response.data.data.pagination,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch medical records",
      };
    }
  },

  // Get medical records for specific patient (doctor view)
  getPatientRecordsForDoctor: async (patientId) => {
    try {
      const response = await api.get(`/medical-records/patient/${patientId}`);
      if (response.data.success) {
        return {
          success: true,
          records: response.data.data.records,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch patient records",
      };
    }
  },

  // Create medical record (doctor)
  createRecord: async (recordData) => {
    try {
      const response = await api.post("/medical-records", recordData);
      if (response.data.success) {
        return { success: true, record: response.data.data.record };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create medical record",
      };
    }
  },

  // Update medical record (doctor)
  updateRecord: async (recordId, recordData) => {
    try {
      const response = await api.put(
        `/medical-records/${recordId}`,
        recordData
      );
      if (response.data.success) {
        return { success: true, record: response.data.data.record };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update medical record",
      };
    }
  },

  // Get medical record by ID
  getRecordById: async (recordId) => {
    try {
      const response = await api.get(`/medical-records/${recordId}`);
      if (response.data.success) {
        return { success: true, record: response.data.data.record };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch medical record",
      };
    }
  },

  // Delete medical record (doctor)
  deleteRecord: async (recordId) => {
    try {
      const response = await api.delete(`/medical-records/${recordId}`);
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to delete medical record",
      };
    }
  },
};

// Scheduling API calls
export const schedulingAPI = {
  // Get doctor availability for a specific date
  getDoctorAvailability: async (doctorId, date) => {
    try {
      const response = await api.get(
        `/schedules/doctor/${doctorId}/availability?date=${date}`
      );
      if (response.data.success) {
        return {
          success: true,
          availableSlots: response.data.data.availableSlots,
          doctorSchedule: response.data.data.doctorSchedule,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch availability",
      };
    }
  },

  // Get doctor's weekly availability (next 14 days)
  getDoctorWeeklyAvailability: async (doctorId) => {
    try {
      const today = new Date();
      const availabilityData = {};

      // Get availability for next 14 days
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split("T")[0];

        const result = await schedulingAPI.getDoctorAvailability(
          doctorId,
          dateString
        );
        if (result.success) {
          availabilityData[dateString] = result.availableSlots;
        }
      }

      return { success: true, weeklyAvailability: availabilityData };
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch weekly availability",
      };
    }
  },

  // Check if specific time slot is available
  checkSlotAvailability: async (doctorId, date, time) => {
    try {
      const response = await api.post("/schedules/check-availability", {
        doctorId,
        date,
        time,
      });
      if (response.data.success) {
        return {
          success: true,
          isAvailable: response.data.data.isAvailable,
          reason: response.data.data.reason,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to check availability",
      };
    }
  },

  // Get doctor's current schedule (for doctors)
  getMySchedule: async () => {
    try {
      const response = await api.get("/schedules/doctor/my-schedule");
      if (response.data.success) {
        return {
          success: true,
          schedules: response.data.data.schedules,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch schedule",
      };
    }
  },

  // Update doctor's schedule (for doctors)
  updateMySchedule: async (schedules) => {
    try {
      const response = await api.put("/schedules/doctor/update-schedule", {
        schedules,
      });
      if (response.data.success) {
        return {
          success: true,
          schedules: response.data.data.schedules,
          message: response.data.message,
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update schedule",
      };
    }
  },
};

export default api;
