require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import all models
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Prescription = require("./models/Prescription");
const MedicalRecord = require("./models/MedicalRecord");
const DoctorSchedule = require("./models/DoctorSchedule");
const Notification = require("./models/Notification");

const connectDB = require("./config/database");

const comprehensiveSeed = async () => {
  try {
    console.log("🚀 Starting comprehensive database seeding...");

    // Connect to database
    await connectDB();

    // Clear all existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await MedicalRecord.deleteMany({});
    await DoctorSchedule.deleteMany({});
    await Notification.deleteMany({});
    console.log("✅ All collections cleared");

    // ===== CREATE PATIENTS =====
    console.log("\n👥 Creating patients...");
    const patientsData = [
      {
        name: "John Smith",
        email: "john@patient.com",
        password: "password123",
        role: "patient",
        phone: "+1-555-0101",
        dateOfBirth: new Date("1985-06-15"),
        gender: "male",
        bloodType: "O+",
        height: 178, // cm
        weight: 75, // kg
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        emergencyContact: {
          name: "Jane Smith",
          phone: "+1-555-0102",
          relationship: "Spouse",
        },
        allergies: ["Penicillin", "Peanuts"],
        medicalHistory: [
          {
            condition: "Mild Asthma",
            diagnosedDate: new Date("2015-03-10"),
            status: "chronic",
          },
        ],
        insurance: {
          provider: "MediCare Plus",
          policyNumber: "HP123456789",
          groupNumber: "GRP001",
          expirationDate: new Date("2025-12-31"),
        },
      },
      {
        name: "Emily Johnson",
        email: "emily@patient.com",
        password: "password123",
        role: "patient",
        phone: "+1-555-0201",
        dateOfBirth: new Date("1992-03-22"),
        gender: "female",
        bloodType: "A-",
        height: 165, // cm
        weight: 60, // kg
        address: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
        },
        emergencyContact: {
          name: "Robert Johnson",
          phone: "+1-555-0202",
          relationship: "Father",
        },
        allergies: ["Latex"],
        medicalHistory: [],
        insurance: {
          provider: "MediCare Pro",
          policyNumber: "MP987654321",
          groupNumber: "GRP002",
          expirationDate: new Date("2025-11-30"),
        },
      },
      {
        name: "Michael Brown",
        email: "michael@patient.com",
        password: "password123",
        role: "patient",
        phone: "+1-555-0301",
        dateOfBirth: new Date("1978-11-08"),
        gender: "male",
        bloodType: "B+",
        height: 182, // cm
        weight: 85, // kg
        address: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA",
        },
        emergencyContact: {
          name: "Sarah Brown",
          phone: "+1-555-0302",
          relationship: "Wife",
        },
        allergies: [],
        medicalHistory: [
          {
            condition: "Hypertension",
            diagnosedDate: new Date("2020-01-15"),
            status: "chronic",
          },
          {
            condition: "Type 2 Diabetes",
            diagnosedDate: new Date("2021-06-20"),
            status: "chronic",
          },
        ],
        insurance: {
          provider: "Universal Health",
          policyNumber: "UH555666777",
          groupNumber: "GRP003",
          expirationDate: new Date("2025-10-31"),
        },
      },
    ];

    const createdPatients = [];
    for (const patientData of patientsData) {
      const patient = new User(patientData);
      await patient.save();
      createdPatients.push(patient);
    }
    console.log(`✅ Created ${createdPatients.length} patients`);

    // ===== CREATE DOCTORS =====
    console.log("\n👨‍⚕️ Creating doctors...");
    const doctorsData = [
      {
        name: "Dr. Sarah Wilson",
        email: "sarah@doctor.com",
        password: "password123",
        role: "doctor",
        phone: "+1-555-1001",
        specialization: "Cardiology",
        licenseNumber: "MD12345",
        yearsOfExperience: 15,
        consultationFee: 200,
        bio: "Experienced cardiologist specializing in heart disease prevention and treatment. Harvard Medical School graduate with 15+ years of clinical experience.",
        languages: ["English", "Spanish"],
        education: [
          {
            degree: "MD",
            institution: "Harvard Medical School",
            year: 2008,
          },
          {
            degree: "Cardiology Fellowship",
            institution: "Johns Hopkins Hospital",
            year: 2012,
          },
        ],
        certifications: [
          {
            name: "Board Certified in Cardiology",
            issuedBy: "American Board of Internal Medicine",
            issuedDate: new Date("2012-08-15"),
            expirationDate: new Date("2025-08-15"),
          },
        ],
        availability: [
          {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 2,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 3,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 4,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 5,
            startTime: "09:00",
            endTime: "15:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. James Rodriguez",
        email: "james@doctor.com",
        password: "password123",
        role: "doctor",
        phone: "+1-555-1002",
        specialization: "Neurology",
        licenseNumber: "MD12346",
        yearsOfExperience: 12,
        consultationFee: 250,
        bio: "Neurologist specializing in brain and nervous system disorders. Expert in migraine treatment and neurological diagnostics.",
        languages: ["English", "Spanish", "Portuguese"],
        education: [
          {
            degree: "MD",
            institution: "Stanford University School of Medicine",
            year: 2011,
          },
          {
            degree: "Neurology Residency",
            institution: "Mayo Clinic",
            year: 2015,
          },
        ],
        certifications: [
          {
            name: "Board Certified in Neurology",
            issuedBy: "American Board of Psychiatry and Neurology",
            issuedDate: new Date("2015-06-01"),
            expirationDate: new Date("2025-06-01"),
          },
        ],
        availability: [
          {
            dayOfWeek: 1,
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 2,
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 3,
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 4,
            startTime: "08:00",
            endTime: "16:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 5,
            startTime: "08:00",
            endTime: "14:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. Lisa Chen",
        email: "lisa@doctor.com",
        password: "password123",
        role: "doctor",
        phone: "+1-555-1003",
        specialization: "Pediatrics",
        licenseNumber: "MD12347",
        yearsOfExperience: 8,
        consultationFee: 180,
        bio: "Pediatrician dedicated to child health and development. Specializes in preventive care and childhood diseases.",
        languages: ["English", "Mandarin"],
        education: [
          {
            degree: "MD",
            institution: "UCLA School of Medicine",
            year: 2015,
          },
          {
            degree: "Pediatrics Residency",
            institution: "Children's Hospital Los Angeles",
            year: 2018,
          },
        ],
        certifications: [
          {
            name: "Board Certified in Pediatrics",
            issuedBy: "American Board of Pediatrics",
            issuedDate: new Date("2018-07-01"),
            expirationDate: new Date("2028-07-01"),
          },
        ],
        availability: [
          {
            dayOfWeek: 1,
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 2,
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 3,
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 4,
            startTime: "10:00",
            endTime: "18:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 5,
            startTime: "10:00",
            endTime: "16:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. Robert Taylor",
        email: "robert@doctor.com",
        password: "password123",
        role: "doctor",
        phone: "+1-555-1004",
        specialization: "Orthopedics",
        licenseNumber: "MD12348",
        yearsOfExperience: 20,
        consultationFee: 300,
        bio: "Orthopedic surgeon with expertise in joint replacement and sports medicine. Over 20 years of surgical experience.",
        languages: ["English"],
        education: [
          {
            degree: "MD",
            institution: "University of Pennsylvania School of Medicine",
            year: 2003,
          },
          {
            degree: "Orthopedic Surgery Residency",
            institution: "Hospital for Special Surgery",
            year: 2008,
          },
        ],
        certifications: [
          {
            name: "Board Certified in Orthopedic Surgery",
            issuedBy: "American Board of Orthopedic Surgery",
            issuedDate: new Date("2008-09-01"),
            expirationDate: new Date("2026-09-01"),
          },
        ],
        availability: [
          {
            dayOfWeek: 1,
            startTime: "07:00",
            endTime: "15:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 2,
            startTime: "07:00",
            endTime: "15:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 3,
            startTime: "07:00",
            endTime: "15:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 4,
            startTime: "07:00",
            endTime: "15:00",
            isAvailable: true,
          },
        ],
      },
      {
        name: "Dr. Maria Garcia",
        email: "maria@doctor.com",
        password: "password123",
        role: "doctor",
        phone: "+1-555-1005",
        specialization: "Dermatology",
        licenseNumber: "MD12349",
        yearsOfExperience: 10,
        consultationFee: 220,
        bio: "Dermatologist specializing in skin conditions, cosmetic procedures, and skin cancer prevention.",
        languages: ["English", "Spanish"],
        education: [
          {
            degree: "MD",
            institution: "University of California San Francisco",
            year: 2013,
          },
          {
            degree: "Dermatology Residency",
            institution: "UCSF Medical Center",
            year: 2017,
          },
        ],
        certifications: [
          {
            name: "Board Certified in Dermatology",
            issuedBy: "American Board of Dermatology",
            issuedDate: new Date("2017-07-01"),
            expirationDate: new Date("2027-07-01"),
          },
        ],
        availability: [
          {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 2,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 3,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
          {
            dayOfWeek: 5,
            startTime: "09:00",
            endTime: "17:00",
            isAvailable: true,
          },
        ],
      },
    ];

    const createdDoctors = [];
    for (const doctorData of doctorsData) {
      const doctor = new User(doctorData);
      await doctor.save();
      createdDoctors.push(doctor);
    }
    console.log(`✅ Created ${createdDoctors.length} doctors`);

    // ===== CREATE DOCTOR SCHEDULES =====
    console.log("\n📅 Creating doctor schedules...");
    const doctorSchedules = [];

    for (const doctor of createdDoctors) {
      for (const availability of doctor.availability) {
        const schedule = new DoctorSchedule({
          doctor: doctor._id,
          dayOfWeek: availability.dayOfWeek,
          startTime: availability.startTime,
          endTime: availability.endTime,
          isAvailable: availability.isAvailable,
          maxAppointments: 16, // 8 hours * 2 appointments per hour
          appointmentDuration: 30,
          breakTimes: [
            {
              startTime: "12:00",
              endTime: "13:00",
              description: "Lunch break",
            },
          ],
        });
        await schedule.save();
        doctorSchedules.push(schedule);
      }
    }
    console.log(`✅ Created ${doctorSchedules.length} doctor schedule entries`);

    // ===== CREATE APPOINTMENTS =====
    console.log("\n📋 Creating appointments...");
    const appointmentsData = [
      // Past appointments (completed)
      {
        patient: createdPatients[2]._id, // Michael Brown
        doctor: createdDoctors[0]._id, // Dr. Sarah Wilson (Cardiology)
        date: new Date("2025-07-20"),
        time: "09:30",
        reason: "Routine cardiac check-up for hypertension",
        type: "follow-up",
        status: "completed",
        symptoms: ["high blood pressure", "mild chest discomfort"],
        notes: "Patient reports good medication compliance",
        consultationFee: 200,
        paymentStatus: "paid",
        paymentMethod: "insurance",
      },
      {
        patient: createdPatients[1]._id, // Emily Johnson
        doctor: createdDoctors[2]._id, // Dr. Lisa Chen (Pediatrics)
        date: new Date("2025-07-18"),
        time: "11:00",
        reason: "Annual physical examination",
        type: "routine-checkup",
        status: "completed",
        notes: "Healthy young adult, all vitals normal",
        consultationFee: 180,
        paymentStatus: "paid",
        paymentMethod: "card",
      },
      {
        patient: createdPatients[0]._id, // John Smith
        doctor: createdDoctors[1]._id, // Dr. James Rodriguez (Neurology)
        date: new Date("2025-07-15"),
        time: "14:30",
        reason: "Follow-up for recurring headaches",
        type: "follow-up",
        status: "completed",
        symptoms: ["headaches", "mild dizziness"],
        notes: "Headaches improved with prescribed medication",
        consultationFee: 250,
        paymentStatus: "paid",
        paymentMethod: "insurance",
      },

      // Current/Upcoming appointments
      {
        patient: createdPatients[0]._id, // John Smith
        doctor: createdDoctors[0]._id, // Dr. Sarah Wilson (Cardiology)
        date: new Date("2025-07-25"),
        time: "10:00",
        reason: "Chest pain evaluation and cardiac assessment",
        type: "consultation",
        status: "confirmed",
        symptoms: ["chest pain", "irregular heartbeat"],
        notes: "Patient reports occasional chest discomfort over the past week",
        consultationFee: 200,
        paymentStatus: "pending",
        reminderSent: true,
      },
      {
        patient: createdPatients[0]._id, // John Smith
        doctor: createdDoctors[1]._id, // Dr. James Rodriguez (Neurology)
        date: new Date("2025-07-30"),
        time: "14:30",
        reason: "Neurological consultation for persistent headaches",
        type: "follow-up",
        status: "scheduled",
        symptoms: ["headaches", "light sensitivity"],
        notes: "Follow-up appointment for recurring headaches",
        consultationFee: 250,
        paymentStatus: "pending",
      },
      {
        patient: createdPatients[1]._id, // Emily Johnson
        doctor: createdDoctors[4]._id, // Dr. Maria Garcia (Dermatology)
        date: new Date("2025-08-02"),
        time: "15:00",
        reason: "Skin rash examination and treatment",
        type: "consultation",
        status: "scheduled",
        symptoms: ["skin rash", "itching"],
        notes:
          "Patient developed unusual rash on arms, needs dermatological evaluation",
        consultationFee: 220,
        paymentStatus: "pending",
      },
      {
        patient: createdPatients[2]._id, // Michael Brown
        doctor: createdDoctors[0]._id, // Dr. Sarah Wilson (Cardiology)
        date: new Date("2025-08-05"),
        time: "11:00",
        reason: "Diabetes and hypertension management",
        type: "follow-up",
        status: "scheduled",
        symptoms: ["elevated blood sugar", "high blood pressure"],
        notes: "Regular follow-up for chronic conditions management",
        consultationFee: 200,
        paymentStatus: "pending",
      },
      {
        patient: createdPatients[1]._id, // Emily Johnson
        doctor: createdDoctors[3]._id, // Dr. Robert Taylor (Orthopedics)
        date: new Date("2025-08-08"),
        time: "10:30",
        reason: "Knee pain evaluation",
        type: "consultation",
        status: "scheduled",
        symptoms: ["knee pain", "stiffness"],
        notes: "Patient reports knee pain after jogging",
        consultationFee: 300,
        paymentStatus: "pending",
      },
    ];

    const createdAppointments = [];
    for (const appointmentData of appointmentsData) {
      const appointment = new Appointment(appointmentData);
      await appointment.save();
      createdAppointments.push(appointment);
    }
    console.log(`✅ Created ${createdAppointments.length} appointments`);

    // ===== CREATE PRESCRIPTIONS =====
    console.log("\n💊 Creating prescriptions...");
    const prescriptionsData = [
      {
        patient: createdPatients[2]._id, // Michael Brown
        doctor: createdDoctors[0]._id, // Dr. Sarah Wilson
        appointment: createdAppointments[0]._id, // His completed cardiology appointment
        diagnosis: "Hypertension and Type 2 Diabetes",
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning with food",
            startDate: new Date("2025-07-20"),
            endDate: new Date("2025-10-20"),
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with meals to reduce stomach upset",
            startDate: new Date("2025-07-20"),
            endDate: new Date("2025-10-20"),
          },
        ],
        notes: "Monitor blood pressure and blood sugar levels regularly",
        issuedDate: new Date("2025-07-20"),
        validUntil: new Date("2025-10-20"),
        status: "active",
      },
      {
        patient: createdPatients[0]._id, // John Smith
        doctor: createdDoctors[1]._id, // Dr. James Rodriguez
        appointment: createdAppointments[2]._id, // His completed neurology appointment
        diagnosis: "Tension Headaches",
        medications: [
          {
            name: "Sumatriptan",
            dosage: "25mg",
            frequency: "As needed",
            duration: "1 month",
            instructions: "Take at onset of headache, max 2 doses per day",
            startDate: new Date("2025-07-15"),
            endDate: new Date("2025-08-15"),
          },
          {
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "As needed",
            duration: "1 month",
            instructions: "Take with food, max 3 times per day",
            startDate: new Date("2025-07-15"),
            endDate: new Date("2025-08-15"),
          },
        ],
        notes: "If headaches persist or worsen, return for follow-up",
        issuedDate: new Date("2025-07-15"),
        validUntil: new Date("2025-08-15"),
        status: "active",
      },
      {
        patient: createdPatients[1]._id, // Emily Johnson
        doctor: createdDoctors[2]._id, // Dr. Lisa Chen
        appointment: createdAppointments[1]._id, // Her completed pediatrics appointment
        diagnosis: "Healthy Adult - Preventive Care",
        medications: [
          {
            name: "Multivitamin",
            dosage: "1 tablet",
            frequency: "Once daily",
            duration: "6 months",
            instructions: "Take with breakfast",
            startDate: new Date("2025-07-18"),
            endDate: new Date("2026-01-18"),
          },
        ],
        notes: "Continue healthy lifestyle, schedule next check-up in 1 year",
        issuedDate: new Date("2025-07-18"),
        validUntil: new Date("2026-01-18"),
        status: "active",
      },
    ];

    const createdPrescriptions = [];
    for (const prescriptionData of prescriptionsData) {
      const prescription = new Prescription(prescriptionData);
      await prescription.save();
      createdPrescriptions.push(prescription);
    }
    console.log(`✅ Created ${createdPrescriptions.length} prescriptions`);

    // ===== CREATE MEDICAL RECORDS =====
    console.log("\n📋 Creating medical records...");
    const medicalRecordsData = [
      {
        patient: createdPatients[2]._id, // Michael Brown
        doctor: createdDoctors[0]._id, // Dr. Sarah Wilson
        appointment: createdAppointments[0]._id,
        visitDate: new Date("2025-07-20"),
        chiefComplaint: "Routine follow-up for hypertension and diabetes",
        historyOfPresentIllness:
          "Patient reports good compliance with medications. Blood pressure has been stable. Blood sugar levels slightly elevated in morning readings.",
        physicalExamination:
          "BP: 135/85, HR: 72, Temp: 98.6°F. Heart: Regular rate and rhythm, no murmurs. Lungs: Clear bilaterally.",
        vitalSigns: {
          bloodPressure: { systolic: 135, diastolic: 85 },
          heartRate: 72,
          temperature: 37.0,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          weight: 85,
          height: 182,
        },
        diagnosis:
          "Hypertension (well-controlled), Type 2 Diabetes (fair control)",
        treatment: "Continue current medications, dietary counseling provided",
        labResults: [
          {
            testName: "HbA1c",
            result: "7.2%",
            normalRange: "< 7.0%",
            date: new Date("2025-07-19"),
            status: "abnormal",
          },
          {
            testName: "Lipid Panel",
            result: "Total Cholesterol: 195 mg/dL",
            normalRange: "< 200 mg/dL",
            date: new Date("2025-07-19"),
            status: "normal",
          },
        ],
        followUpRequired: true,
        followUpDate: new Date("2025-10-20"),
        notes:
          "Patient counseled on importance of morning blood sugar control. Consider adjusting Metformin dosage if next HbA1c remains elevated.",
      },
      {
        patient: createdPatients[0]._id, // John Smith
        doctor: createdDoctors[1]._id, // Dr. James Rodriguez
        appointment: createdAppointments[2]._id,
        visitDate: new Date("2025-07-15"),
        chiefComplaint: "Follow-up for recurring headaches",
        historyOfPresentIllness:
          "Patient reports improvement in headache frequency and intensity since starting Sumatriptan. Headaches now occur 2-3 times per week instead of daily.",
        physicalExamination:
          "Neurological exam: Cranial nerves II-XII intact. No focal neurological deficits. Reflexes symmetric and normal.",
        vitalSigns: {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 68,
          temperature: 36.8,
          respiratoryRate: 14,
          oxygenSaturation: 99,
          weight: 75,
          height: 178,
        },
        diagnosis: "Tension-type headaches (improving)",
        treatment:
          "Continue current medication regimen, stress management techniques discussed",
        followUpRequired: true,
        followUpDate: new Date("2025-08-15"),
        notes:
          "Patient responding well to treatment. Discussed trigger avoidance and stress management techniques.",
      },
      {
        patient: createdPatients[1]._id, // Emily Johnson
        doctor: createdDoctors[2]._id, // Dr. Lisa Chen
        appointment: createdAppointments[1]._id,
        visitDate: new Date("2025-07-18"),
        chiefComplaint: "Annual physical examination",
        historyOfPresentIllness:
          "No acute complaints. Patient reports feeling well overall. Regular exercise routine, balanced diet.",
        physicalExamination:
          "Well-appearing young adult. Heart: RRR, no murmurs. Lungs: CTAB. Abdomen: soft, non-tender. Skin: no concerning lesions.",
        vitalSigns: {
          bloodPressure: { systolic: 110, diastolic: 70 },
          heartRate: 65,
          temperature: 36.5,
          respiratoryRate: 14,
          oxygenSaturation: 99,
          weight: 60,
          height: 165,
        },
        diagnosis: "Healthy young adult",
        treatment:
          "Continue current lifestyle, preventive care recommendations provided",
        labResults: [
          {
            testName: "Complete Blood Count",
            result: "WBC: 6.5, RBC: 4.5, Hgb: 14.2",
            normalRange: "Normal ranges",
            date: new Date("2025-07-17"),
            status: "normal",
          },
          {
            testName: "Basic Metabolic Panel",
            result: "All values within normal limits",
            normalRange: "Normal ranges",
            date: new Date("2025-07-17"),
            status: "normal",
          },
        ],
        followUpRequired: false,
        notes:
          "Excellent health status. Recommended annual follow-up. Discussed importance of regular exercise and healthy diet.",
      },
    ];

    const createdMedicalRecords = [];
    for (const recordData of medicalRecordsData) {
      const record = new MedicalRecord(recordData);
      await record.save();
      createdMedicalRecords.push(record);
    }
    console.log(`✅ Created ${createdMedicalRecords.length} medical records`);

    // ===== CREATE NOTIFICATIONS =====
    console.log("\n🔔 Creating notifications...");
    const notificationsData = [
      // Appointment reminders
      {
        recipient: createdPatients[0]._id, // John Smith
        type: "appointment_reminder",
        title: "Appointment Reminder",
        message:
          "You have an appointment with Dr. Sarah Wilson tomorrow at 10:00 AM",
        relatedEntity: createdAppointments[3]._id,
        relatedEntityType: "Appointment",
        priority: "high",
        sentAt: new Date("2025-07-24T18:00:00Z"),
      },
      {
        recipient: createdPatients[0]._id, // John Smith
        type: "appointment_confirmed",
        title: "Appointment Confirmed",
        message:
          "Your appointment with Dr. Sarah Wilson on July 25, 2025 at 10:00 AM has been confirmed",
        relatedEntity: createdAppointments[3]._id,
        relatedEntityType: "Appointment",
        priority: "medium",
        sentAt: new Date("2025-07-23T10:00:00Z"),
        isRead: true,
        readAt: new Date("2025-07-23T11:30:00Z"),
      },

      // Prescription notifications
      {
        recipient: createdPatients[2]._id, // Michael Brown
        type: "prescription_ready",
        title: "Prescription Ready",
        message:
          "Your prescription from Dr. Sarah Wilson is ready for pickup at the pharmacy",
        relatedEntity: createdPrescriptions[0]._id,
        relatedEntityType: "Prescription",
        priority: "medium",
        sentAt: new Date("2025-07-20T15:00:00Z"),
        isRead: true,
        readAt: new Date("2025-07-20T16:45:00Z"),
      },
      {
        recipient: createdPatients[0]._id, // John Smith
        type: "prescription_ready",
        title: "Prescription Ready",
        message:
          "Your headache medication prescription from Dr. James Rodriguez is ready",
        relatedEntity: createdPrescriptions[1]._id,
        relatedEntityType: "Prescription",
        priority: "medium",
        sentAt: new Date("2025-07-15T14:00:00Z"),
        isRead: false,
      },

      // Test results notifications
      {
        recipient: createdPatients[2]._id, // Michael Brown
        type: "test_results_available",
        title: "Test Results Available",
        message:
          "Your lab results from your recent visit are now available in your patient portal",
        relatedEntity: createdMedicalRecords[0]._id,
        relatedEntityType: "MedicalRecord",
        priority: "medium",
        sentAt: new Date("2025-07-21T09:00:00Z"),
        isRead: false,
      },

      // System messages
      {
        recipient: createdPatients[1]._id, // Emily Johnson
        type: "system_message",
        title: "Annual Physical Complete",
        message:
          "Thank you for completing your annual physical. Your results show excellent health!",
        priority: "low",
        sentAt: new Date("2025-07-18T17:00:00Z"),
        isRead: true,
        readAt: new Date("2025-07-19T08:00:00Z"),
      },

      // Future appointment reminders
      {
        recipient: createdPatients[1]._id, // Emily Johnson
        type: "appointment_reminder",
        title: "Upcoming Appointment",
        message:
          "Reminder: You have an appointment with Dr. Maria Garcia on August 2, 2025 at 3:00 PM",
        relatedEntity: createdAppointments[5]._id,
        relatedEntityType: "Appointment",
        priority: "medium",
        sentAt: new Date("2025-08-01T10:00:00Z"),
      },
    ];

    const createdNotifications = [];
    for (const notificationData of notificationsData) {
      const notification = new Notification(notificationData);
      await notification.save();
      createdNotifications.push(notification);
    }
    console.log(`✅ Created ${createdNotifications.length} notifications`);

    // ===== SUMMARY =====
    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Patients: ${createdPatients.length}`);
    console.log(`   👨‍⚕️ Doctors: ${createdDoctors.length}`);
    console.log(`   📅 Doctor Schedules: ${doctorSchedules.length}`);
    console.log(`   📋 Appointments: ${createdAppointments.length}`);
    console.log(`   💊 Prescriptions: ${createdPrescriptions.length}`);
    console.log(`   📋 Medical Records: ${createdMedicalRecords.length}`);
    console.log(`   🔔 Notifications: ${createdNotifications.length}`);

    console.log("\n📝 Login Credentials:");
    console.log("\n👥 Patients:");
    patientsData.forEach((patient) => {
      console.log(`   ${patient.name}: ${patient.email} / password123`);
    });
    console.log("\n👨‍⚕️ Doctors:");
    doctorsData.forEach((doctor) => {
      console.log(`   ${doctor.name}: ${doctor.email} / password123`);
    });

    console.log(
      "\n✅ All relationships established and data is production-ready!"
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run comprehensive seed script
comprehensiveSeed();
