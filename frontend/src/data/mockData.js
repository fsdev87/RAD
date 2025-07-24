// Mock data for HealthCare System MVP

export const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Cardiology",
    qualification: "MD, FACC",
    experience: "15 years",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    available: true,
    availableSlots: [
      "2025-07-25 09:00",
      "2025-07-25 10:00",
      "2025-07-25 14:00",
      "2025-07-26 09:00",
      "2025-07-26 11:00",
    ],
    consultationFee: 150,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    qualification: "MD, PhD",
    experience: "12 years",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    available: true,
    availableSlots: [
      "2025-07-25 10:00",
      "2025-07-25 15:00",
      "2025-07-26 09:00",
      "2025-07-26 13:00",
    ],
    consultationFee: 180,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    qualification: "MD, FAAP",
    experience: "8 years",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1594824242902-78a8b04b85c8?w=150&h=150&fit=crop&crop=face",
    available: true,
    availableSlots: [
      "2025-07-25 11:00",
      "2025-07-25 16:00",
      "2025-07-26 10:00",
      "2025-07-26 14:00",
    ],
    consultationFee: 120,
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    specialty: "Orthopedics",
    qualification: "MD, MS Ortho",
    experience: "20 years",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    available: false,
    availableSlots: [],
    consultationFee: 200,
  },
];

export const patients = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    age: 34,
    gender: "Male",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-0124",
    age: 28,
    gender: "Female",
    address: "456 Oak Ave, Los Angeles, CA 90001",
  },
];

export const appointments = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    patientName: "John Doe",
    doctorName: "Dr. Sarah Wilson",
    date: "2025-07-25",
    time: "09:00",
    reason: "Regular checkup",
    status: "confirmed",
    type: "consultation",
    notes: "Patient has been experiencing chest pain",
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 2,
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Chen",
    date: "2025-07-25",
    time: "10:00",
    reason: "Headache consultation",
    status: "pending",
    type: "consultation",
    notes: "Recurring headaches for past 2 weeks",
  },
  {
    id: 3,
    patientId: 1,
    doctorId: 3,
    patientName: "John Doe",
    doctorName: "Dr. Emily Rodriguez",
    date: "2025-07-24",
    time: "14:00",
    reason: "Child vaccination",
    status: "completed",
    type: "vaccination",
    notes: "Annual vaccination for 5-year-old",
  },
];

export const prescriptions = [
  {
    id: 1,
    appointmentId: 1,
    patientId: 1,
    doctorId: 1,
    patientName: "John Doe",
    doctorName: "Dr. Sarah Wilson",
    date: "2025-07-24",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food in the morning",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals",
      },
    ],
    diagnosis: "Hypertension and Type 2 Diabetes",
    notes: "Follow up in 2 weeks. Monitor blood pressure daily.",
    followUpDate: "2025-08-08",
  },
  {
    id: 2,
    appointmentId: 2,
    patientId: 2,
    doctorId: 2,
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Chen",
    date: "2025-07-24",
    medications: [
      {
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "As needed",
        duration: "10 tablets",
        instructions: "Take at onset of migraine",
      },
    ],
    diagnosis: "Migraine headaches",
    notes: "Avoid triggers. Keep headache diary.",
    followUpDate: "2025-08-15",
  },
];

// Helper functions
export const getDoctorById = (id) =>
  doctors.find((doctor) => doctor.id === parseInt(id));
export const getPatientById = (id) =>
  patients.find((patient) => patient.id === parseInt(id));
export const getAppointmentsByPatient = (patientId) =>
  appointments.filter((apt) => apt.patientId === parseInt(patientId));
export const getAppointmentsByDoctor = (doctorId) =>
  appointments.filter((apt) => apt.doctorId === parseInt(doctorId));
export const getPrescriptionsByPatient = (patientId) =>
  prescriptions.filter((rx) => rx.patientId === parseInt(patientId));
export const getPrescriptionsByDoctor = (doctorId) =>
  prescriptions.filter((rx) => rx.doctorId === parseInt(doctorId));
