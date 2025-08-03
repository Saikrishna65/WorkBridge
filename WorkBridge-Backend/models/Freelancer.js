const mongoose = require("mongoose");

// Message sub-schema
const MessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, default: "" },
    fileUrl: { type: String, default: null },
    read: Boolean,
    time: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Chat sub-schema
const ChatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    clientAvatar: { type: String, default: "" },
    messages: [MessageSchema],
  },
  { _id: false }
);

// Review sub-schema with reference to Client
const ReviewSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true, _id: false }
);

// Service sub-schema
const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    revisions: { type: Number, default: 0 },
    deadline: { type: String },
    description: { type: String },
  },
  { _id: false }
);

// Main freelancer schema
const FreelancerSchema = new mongoose.Schema({
  name: { type: String, required: true },
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
  },
  title: { type: String, default: "" },
  experience: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ["full-time", "part-time", "freelancer", "project-work"], // ✅ fix
  },
  earnings: { type: Number, default: 0 },
  reviews: [ReviewSchema],
  avatar: { type: String, default: "" },
  skills: [String],
  services: [ServiceSchema],
  works: [String], // Portfolio images or URLs
  chats: [ChatSchema],
  joinedAt: { type: Date, default: Date.now },
  role: { type: String, default: "freelancer" },
  refreshToken: String,
  profileCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Freelancer", FreelancerSchema);
