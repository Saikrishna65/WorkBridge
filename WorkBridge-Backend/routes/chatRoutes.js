const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary, storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const User = require("../models/User");
const Freelancer = require("../models/Freelancer");

/**
 * Mark messages as read for a user in a chat.
 * Returns true if any messages were updated.
 */
async function markRead(Model, modelId, chatId, readerId) {
  const doc = await Model.findById(modelId);
  if (!doc) throw new Error(`${Model.modelName} ${modelId} not found`);

  const chat = doc.chats.find((c) => c.chatId === chatId);
  if (!chat) return false;

  let changed = false;
  for (const msg of chat.messages) {
    if (msg.receiverId === readerId && !msg.read) {
      msg.read = true;
      changed = true;
    }
  }

  if (changed) await doc.save();
  return changed;
}

// 📩 Send message endpoint
router.post("/send", upload.single("file"), async (req, res) => {
  try {
    const {
      senderId,
      receiverId,
      message,
      chatId,
      senderRole,
      senderName,
      senderAvatar,
    } = req.body;

    if (!chatId) throw new Error("chatId is required");

    const fileUrl = req.file?.path || req.body.fileUrl || null;

    const newMessage = {
      senderId,
      receiverId,
      message,
      fileUrl,
      time: new Date(),
      read: false,
    };

    // Update chat document (add new message)
    const updateChat = async (Model, modelId, meta) => {
      const doc = await Model.findById(modelId);
      if (!doc) throw new Error(`${Model.modelName} ${modelId} not found`);
      if (!doc.chats) doc.chats = [];

      const idx = doc.chats.findIndex((c) => c.chatId === chatId);
      if (idx >= 0) {
        doc.chats[idx].messages.push(newMessage);
      } else {
        doc.chats.push({ chatId, ...meta, messages: [newMessage] });
      }

      await doc.save();
    };

    if (senderRole === "user") {
      const freelancer = await Freelancer.findById(receiverId);
      if (!freelancer) throw new Error("Freelancer not found");

      await updateChat(User, senderId, {
        freelancerId: freelancer._id,
        freelancerName: freelancer.name,
        freelancerAvatar: freelancer.avatar,
      });

      await updateChat(Freelancer, receiverId, {
        clientId: senderId,
        clientName: senderName,
        clientAvatar: senderAvatar,
      });
    } else {
      const user = await User.findById(receiverId);
      if (!user) throw new Error("User not found");

      await updateChat(Freelancer, senderId, {
        clientId: user._id,
        clientName: user.name,
        clientAvatar: user.avatar,
      });

      await updateChat(User, receiverId, {
        freelancerId: senderId,
        freelancerName: senderName,
        freelancerAvatar: senderAvatar,
      });
    }

    // ✅ Respond with message data
    res.status(200).json({ message: "Message sent", messageData: newMessage });
  } catch (err) {
    console.error("❌ Chat/send error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📘 Get chat history and mark messages as read
router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId, role } = req.query;

    if (!userId || !role)
      return res.status(400).json({ error: "Missing userId or role" });

    const Viewer = role === "freelancer" ? Freelancer : User;
    const Other = role === "freelancer" ? User : Freelancer;

    // 1. Mark messages as read for the viewer
    const didViewerRead = await markRead(Viewer, userId, chatId, userId);

    // 2. If anything was marked as read, update other side too
    if (didViewerRead) {
      const viewerDoc = await Viewer.findById(userId);
      const chatMeta = viewerDoc.chats.find((c) => c.chatId === chatId);
      const otherId = chatMeta.clientId || chatMeta.freelancerId;

      await markRead(Other, otherId, chatId, userId);

      // 3. Send read receipts to the other user (via socket)
      const readTimes = chatMeta.messages
        .filter((msg) => msg.receiverId === userId && msg.read)
        .map((msg) => msg.time.toISOString());

      const io = req.app.get("io");
      if (readTimes.length > 0) {
        io.to(chatId).emit("messageRead", {
          messageIds: readTimes,
        });

        console.log(`📘 Read receipts emitted for chat ${chatId}:`, readTimes);
      }
    }

    // 4. Return updated chat messages
    const updatedViewer = await Viewer.findById(userId);
    const updatedChat = updatedViewer.chats.find(
      (c) => c.chatId === chatId
    ) || {
      messages: [],
    };

    res.json(updatedChat.messages);
  } catch (err) {
    console.error("❌ Chat/fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
