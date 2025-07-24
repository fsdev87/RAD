# Ring A Doctor (RAD) Database Design

## 📊 Entity Relationship Overview

```
USERS (patients & doctors)
│
├── APPOINTMENTS ──── PRESCRIPTIONS
│                          │
└── MEDICAL_RECORDS ───────┘
│
├── DOCTOR_SCHEDULES
│
└── NOTIFICATIONS
```

## 🗃️ Table Definitions

### 1. USERS Table

**Purpose:** Store all system users (patients and doctors)

| Field        | Type     | Required | Description           |
| ------------ | -------- | -------- | --------------------- |
| \_id         | ObjectId | Yes      | Primary key           |
| name         | String   | Yes      | Full name             |
| email        | String   | Yes      | Unique email          |
| password     | String   | Yes      | Hashed password       |
| role         | Enum     | Yes      | 'patient' or 'doctor' |
| phone        | String   | No       | Contact number        |
| profileImage | String   | No       | Profile picture URL   |
| isActive     | Boolean  | Yes      | Account status        |
| lastLogin    | Date     | No       | Last login timestamp  |
| createdAt    | Date     | Yes      | Account creation      |
| updatedAt    | Date     | Yes      | Last update           |

**Patient-specific fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| dateOfBirth | Date | No | Birth date |
| gender | Enum | No | 'male', 'female', 'other' |
| bloodType | String | No | Blood type (A+, B-, etc.) |
| height | Number | No | Height in cm |
| weight | Number | No | Weight in kg |
| address | Object | No | Full address |
| emergencyContact | Object | No | Emergency contact info |
| allergies | Array | No | Known allergies |
| medicalHistory | Array | No | Past conditions |
| insurance | Object | No | Insurance details |

**Doctor-specific fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| specialization | String | Yes | Medical specialty |
| licenseNumber | String | Yes | Medical license |
| yearsOfExperience | Number | Yes | Experience years |
| education | Array | No | Educational background |
| consultationFee | Number | Yes | Fee per consultation |
| bio | String | No | Professional bio |
| languages | Array | No | Spoken languages |
| certifications | Array | No | Medical certifications |

### 2. APPOINTMENTS Table

**Purpose:** Store all appointment bookings

| Field           | Type     | Required | Description                                                                  |
| --------------- | -------- | -------- | ---------------------------------------------------------------------------- |
| \_id            | ObjectId | Yes      | Primary key                                                                  |
| patient         | ObjectId | Yes      | Ref to Users                                                                 |
| doctor          | ObjectId | Yes      | Ref to Users                                                                 |
| date            | Date     | Yes      | Appointment date                                                             |
| time            | String   | Yes      | Appointment time (HH:MM)                                                     |
| duration        | Number   | Yes      | Duration in minutes                                                          |
| status          | Enum     | Yes      | 'scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show' |
| type            | Enum     | Yes      | 'consultation', 'follow-up', 'emergency', 'routine-checkup'                  |
| reason          | String   | Yes      | Reason for visit                                                             |
| symptoms        | Array    | No       | Patient symptoms                                                             |
| notes           | String   | No       | Additional notes                                                             |
| consultationFee | Number   | Yes      | Fee for this appointment                                                     |
| paymentStatus   | Enum     | Yes      | 'pending', 'paid', 'refunded'                                                |
| reminderSent    | Boolean  | Yes      | Reminder notification status                                                 |
| createdAt       | Date     | Yes      | Booking timestamp                                                            |
| updatedAt       | Date     | Yes      | Last update                                                                  |

### 3. PRESCRIPTIONS Table

**Purpose:** Store medical prescriptions

| Field                | Type     | Required | Description                        |
| -------------------- | -------- | -------- | ---------------------------------- |
| \_id                 | ObjectId | Yes      | Primary key                        |
| patient              | ObjectId | Yes      | Ref to Users                       |
| doctor               | ObjectId | Yes      | Ref to Users                       |
| appointment          | ObjectId | No       | Ref to Appointments                |
| diagnosis            | String   | Yes      | Medical diagnosis                  |
| medications          | Array    | Yes      | List of prescribed medications     |
| notes                | String   | No       | Additional instructions            |
| issuedDate           | Date     | Yes      | Prescription date                  |
| validUntil           | Date     | No       | Expiration date                    |
| status               | Enum     | Yes      | 'active', 'completed', 'cancelled' |
| pharmacyInstructions | String   | No       | Special pharmacy notes             |
| createdAt            | Date     | Yes      | Creation timestamp                 |
| updatedAt            | Date     | Yes      | Last update                        |

**Medication sub-schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Medication name |
| dosage | String | Yes | Dosage amount |
| frequency | String | Yes | How often to take |
| duration | String | Yes | How long to take |
| instructions | String | No | Special instructions |
| startDate | Date | Yes | When to start |
| endDate | Date | No | When to stop |

### 4. MEDICAL_RECORDS Table

**Purpose:** Store patient medical history and visit records

| Field                   | Type     | Required | Description               |
| ----------------------- | -------- | -------- | ------------------------- |
| \_id                    | ObjectId | Yes      | Primary key               |
| patient                 | ObjectId | Yes      | Ref to Users              |
| doctor                  | ObjectId | Yes      | Ref to Users              |
| appointment             | ObjectId | No       | Ref to Appointments       |
| visitDate               | Date     | Yes      | Date of medical visit     |
| chiefComplaint          | String   | Yes      | Main reason for visit     |
| historyOfPresentIllness | String   | No       | Current illness details   |
| physicalExamination     | String   | No       | Physical exam findings    |
| vitalSigns              | Object   | No       | BP, pulse, temp, etc.     |
| diagnosis               | String   | Yes      | Medical diagnosis         |
| treatment               | String   | No       | Treatment provided        |
| labResults              | Array    | No       | Laboratory test results   |
| attachments             | Array    | No       | Medical images, documents |
| followUpRequired        | Boolean  | Yes      | Needs follow-up           |
| followUpDate            | Date     | No       | Scheduled follow-up       |
| notes                   | String   | No       | Additional notes          |
| createdAt               | Date     | Yes      | Record creation           |
| updatedAt               | Date     | Yes      | Last update               |

### 5. DOCTOR_SCHEDULES Table

**Purpose:** Manage doctor availability

| Field               | Type     | Required | Description                |
| ------------------- | -------- | -------- | -------------------------- |
| \_id                | ObjectId | Yes      | Primary key                |
| doctor              | ObjectId | Yes      | Ref to Users               |
| dayOfWeek           | Number   | Yes      | 0-6 (Sunday-Saturday)      |
| startTime           | String   | Yes      | Start time (HH:MM)         |
| endTime             | String   | Yes      | End time (HH:MM)           |
| isAvailable         | Boolean  | Yes      | Available on this day      |
| breakTimes          | Array    | No       | Break periods              |
| maxAppointments     | Number   | Yes      | Max appointments per day   |
| appointmentDuration | Number   | Yes      | Default appointment length |
| specialNotes        | String   | No       | Special availability notes |
| effectiveFrom       | Date     | Yes      | Schedule valid from        |
| effectiveTo         | Date     | No       | Schedule valid until       |
| createdAt           | Date     | Yes      | Creation timestamp         |
| updatedAt           | Date     | Yes      | Last update                |

### 6. NOTIFICATIONS Table

**Purpose:** Store system notifications

| Field             | Type     | Required | Description                                                                             |
| ----------------- | -------- | -------- | --------------------------------------------------------------------------------------- |
| \_id              | ObjectId | Yes      | Primary key                                                                             |
| recipient         | ObjectId | Yes      | Ref to Users                                                                            |
| sender            | ObjectId | No       | Ref to Users (if applicable)                                                            |
| type              | Enum     | Yes      | 'appointment_reminder', 'appointment_confirmed', 'prescription_ready', 'system_message' |
| title             | String   | Yes      | Notification title                                                                      |
| message           | String   | Yes      | Notification content                                                                    |
| relatedEntity     | ObjectId | No       | Ref to related record                                                                   |
| relatedEntityType | String   | No       | Type of related entity                                                                  |
| isRead            | Boolean  | Yes      | Read status                                                                             |
| sentAt            | Date     | Yes      | When notification was sent                                                              |
| readAt            | Date     | No       | When notification was read                                                              |
| priority          | Enum     | Yes      | 'low', 'medium', 'high', 'urgent'                                                       |
| channel           | Enum     | Yes      | 'in-app', 'email', 'sms'                                                                |
| createdAt         | Date     | Yes      | Creation timestamp                                                                      |

## 🔗 Relationships

1. **Users → Appointments** (1:Many)

   - One patient can have many appointments
   - One doctor can have many appointments

2. **Appointments → Prescriptions** (1:Many)

   - One appointment can generate multiple prescriptions

3. **Users → Prescriptions** (1:Many)

   - One patient can have many prescriptions
   - One doctor can write many prescriptions

4. **Appointments → Medical Records** (1:1)

   - Each appointment can have one medical record

5. **Users → Medical Records** (1:Many)

   - One patient can have many medical records

6. **Users → Doctor Schedules** (1:Many)

   - One doctor can have multiple schedule entries

7. **Users → Notifications** (1:Many)
   - One user can receive many notifications

## 📝 Sample Data Requirements

### Users (3 patients + 5 doctors = 8 total)

- **Patients:** John Smith, Emily Johnson, Michael Brown
- **Doctors:** Dr. Sarah Wilson (Cardiology), Dr. James Rodriguez (Neurology), Dr. Lisa Chen (Pediatrics), Dr. Robert Taylor (Orthopedics), Dr. Maria Garcia (Dermatology)

### Appointments (15-20 appointments)

- Mix of past, current, and future appointments
- Different statuses and types
- Multiple appointments per patient

### Prescriptions (10-15 prescriptions)

- Linked to completed appointments
- Various medications and dosages
- Different statuses

### Medical Records (10-15 records)

- Detailed visit records
- Various diagnoses and treatments
- Lab results and vital signs

### Doctor Schedules (35 schedule entries)

- 7 days × 5 doctors = 35 entries
- Different availability patterns
- Break times and special notes

### Notifications (20-30 notifications)

- Appointment reminders
- Prescription notifications
- System messages
- Mix of read/unread status

## 🎯 Next Steps

1. Create comprehensive seed script with all relationships
2. Populate with realistic sample data
3. Test all API endpoints with proper data
4. Verify frontend displays all data correctly
5. Add data validation and error handling
