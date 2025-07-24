# Ring A Doctor (RAD) - Medical Appointment System

A comprehensive medical appointment management system built with React, Node.js, Express, and MongoDB.

## 🏥 Features

- **Patient Management**: Complete patient profiles with medical history
- **Doctor Management**: Doctor profiles with specializations and schedules
- **Appointment Booking**: Real-time appointment scheduling system
- **Prescription Management**: Digital prescription creation and tracking
- **Medical Records**: Comprehensive visit records with lab results
- **Notifications**: System notifications for appointments and prescriptions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
# Create .env file with MongoDB connection string
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
cd backend
node comprehensive-seed.js
```

## 🏗️ Project Structure

```
RAD/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── config/             # Database configuration
│   └── comprehensive-seed.js # Database seeding script
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── services/       # API integration
└── DATABASE_DESIGN.md      # Complete database schema documentation
```

## 🗄️ Database Models

- **Users** (Patients & Doctors)
- **Appointments**
- **Prescriptions**
- **Medical Records**
- **Doctor Schedules**
- **Notifications**

## 📝 Login Credentials (Development)

### Patients

- John Smith: `john@patient.com` / `password123`
- Emily Johnson: `emily@patient.com` / `password123`
- Michael Brown: `michael@patient.com` / `password123`

### Doctors

- Dr. Sarah Wilson: `sarah@doctor.com` / `password123`
- Dr. James Rodriguez: `james@doctor.com` / `password123`
- Dr. Lisa Chen: `lisa@doctor.com` / `password123`
- Dr. Robert Taylor: `robert@doctor.com` / `password123`
- Dr. Maria Garcia: `maria@doctor.com` / `password123`

## 🔧 Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens
- **Database**: MongoDB Atlas

## 📚 Documentation

See `DATABASE_DESIGN.md` for complete database schema and relationship documentation.

## 🎯 Current Status

✅ **Completed**:

- Complete database design with relationships
- Patient appointment booking and viewing
- Doctor listing with real data
- Authentication system
- Comprehensive sample data

🔄 **In Progress**:

- Patient prescriptions page
- Doctor appointments management
- Doctor prescriptions management

## 🤝 Contributing

This is a medical appointment management system project. All medical data used is for demonstration purposes only.
