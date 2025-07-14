const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "freelancer" },
    refreshToken: String,

    // Profile fields
    username: { type: String, unique: true, sparse: true, trim: true },
    bio: { type: String, maxlength: 300 },
    skills: [String],
    categories: [String],
    experience: String,
    availability: String,
    hourlyRate: { type: Number, min: 0 },
    location: String,
    languages: [String],
    education: [
      {
        institution: String,
        degree: String,
        year: Number,
      },
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        year: Number,
      },
    ],
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },

    // Visibility control
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Freelancer", freelancerSchema);
