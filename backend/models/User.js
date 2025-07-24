const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    // Patient-specific fields
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ["active", "resolved", "chronic"],
          default: "active",
        },
      },
    ],
    allergies: [String],
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    height: {
      type: Number, // in cm
    },
    weight: {
      type: Number, // in kg
    },
    insurance: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      expirationDate: Date,
    },
    // Common fields
    profileImage: {
      type: String, // URL to profile image
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    // Doctor-specific fields
    specialization: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    availability: [
      {
        dayOfWeek: {
          type: Number, // 0 = Sunday, 1 = Monday, etc.
          min: 0,
          max: 6,
        },
        startTime: String, // Format: "09:00"
        endTime: String, // Format: "17:00"
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    consultationFee: {
      type: Number,
    },
    bio: {
      type: String,
    },
    languages: [String],
    certifications: [
      {
        name: String,
        issuedBy: String,
        issuedDate: Date,
        expirationDate: Date,
      },
    ],
    avatar: {
      type: String, // URL to profile image
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
