# Ring A Doctor (RAD) API Documentation

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace the MONGODB_URI in your .env file

### 3. Install Dependencies & Start Server

```bash
cd backend
npm install
npm run dev
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`

Register a new user (patient or doctor)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient", // or "doctor"
  "phone": "+1-555-0123",
  // Doctor-specific fields (required if role is "doctor")
  "specialization": "Cardiology",
  "licenseNumber": "MD12345"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      /* user object */
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`

Login user

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      /* user object */
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/me`

Get current user (requires authentication)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### Doctor Routes (`/api/doctors`)

#### GET `/api/doctors`

Get all doctors (patients only)

**Query Parameters:**

- `specialization` - Filter by specialization
- `search` - Search by name or specialization
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### GET `/api/doctors/:id`

Get doctor by ID

#### GET `/api/doctors/:id/availability`

Get doctor's availability schedule

### Appointment Routes (`/api/appointments`)

#### POST `/api/appointments`

Create new appointment (patients only)

**Request Body:**

```json
{
  "doctorId": "doctor_id_here",
  "date": "2025-07-25",
  "time": "10:00",
  "reason": "Regular checkup",
  "symptoms": ["headache", "fatigue"],
  "type": "consultation"
}
```

#### GET `/api/appointments/patient`

Get appointments for current patient

#### GET `/api/appointments/doctor`

Get appointments for current doctor

#### GET `/api/appointments/:id`

Get appointment by ID

#### PUT `/api/appointments/:id/status`

Update appointment status

**Request Body:**

```json
{
  "status": "cancelled", // or "confirmed", "completed", etc.
  "reason": "Cancellation reason"
}
```

#### PUT `/api/appointments/:id/complete`

Complete appointment with diagnosis (doctors only)

**Request Body:**

```json
{
  "diagnosis": "Patient diagnosis",
  "treatmentPlan": "Treatment plan",
  "followUpRequired": true,
  "followUpDate": "2025-08-01",
  "notes": "Additional notes"
}
```

### Prescription Routes (`/api/prescriptions`)

#### POST `/api/prescriptions`

Create new prescription (doctors only)

**Request Body:**

```json
{
  "patientId": "patient_id_here",
  "appointmentId": "appointment_id_here",
  "diagnosis": "Patient diagnosis",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days",
      "instructions": "Take with food"
    }
  ],
  "notes": "Additional notes",
  "followUpDate": "2025-08-01",
  "labTests": [
    {
      "testName": "Blood Test",
      "instructions": "Fasting required",
      "urgent": false
    }
  ]
}
```

#### GET `/api/prescriptions/patient`

Get prescriptions for current patient

#### GET `/api/prescriptions/doctor`

Get prescriptions created by current doctor

#### GET `/api/prescriptions/:id`

Get prescription by ID

#### PUT `/api/prescriptions/:id`

Update prescription (doctors only)

#### PUT `/api/prescriptions/:id/status`

Update prescription status (doctors only)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error messages"] // Optional
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Sample Login Credentials (After Seeding)

### Patients:

- John Smith: `john@patient.com` / `password123`
- Emily Johnson: `emily@patient.com` / `password123`
- Michael Brown: `michael@patient.com` / `password123`

### Doctors:

- Dr. Sarah Wilson: `sarah@doctor.com` / `password123`
- Dr. James Rodriguez: `james@doctor.com` / `password123`
- Dr. Lisa Chen: `lisa@doctor.com` / `password123`
- Dr. Robert Taylor: `robert@doctor.com` / `password123`
- Dr. Maria Garcia: `maria@doctor.com` / `password123`

## Database Models

### User Model

- Supports both patients and doctors
- Role-based fields (patient-specific and doctor-specific)
- Password hashing with bcrypt
- Profile management

### Appointment Model

- Links patients and doctors
- Status tracking
- Payment information
- Cancellation handling

### Prescription Model

- Multiple medications per prescription
- Lab test recommendations
- Lifestyle recommendations
- Digital signature support

## Development Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Clear and reseed database
npm run reseed
```
