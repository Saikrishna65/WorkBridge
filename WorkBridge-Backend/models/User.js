const mongoose = require("mongoose");

// Sub-schema for individual message
const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: null,
    },
    read: Boolean,
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Optional: disables auto _id for each message
);

// Sub-schema for individual chat session
const ChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true, // e.g., "client_101_freelancer_22"
    },
    freelancerId: {
      type: String,
      required: true,
    },
    freelancerName: {
      type: String,
      required: true,
    },
    freelancerAvatar: {
      type: String,
      default: "",
    },
    messages: [MessageSchema],
  },
  { _id: false } // Optional
);

// Main client schema
const UserSchema = new mongoose.Schema({
  // Basic profile
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  avatar: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },

  role: { type: String, default: "user" },
  refreshToken: String,

  chats: [ChatSchema],
});

module.exports = mongoose.model("User", UserSchema);
