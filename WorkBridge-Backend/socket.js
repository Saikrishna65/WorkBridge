module.exports = function setupSocket(io) {
  const activeUsers = new Map(); // socket.id -> userId

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join", ({ chatId, userId }) => {
      if (!chatId || !userId) return;
      socket.join(chatId);
      activeUsers.set(socket.id, userId);
      console.log(`✅ ${userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", (messageData) => {
      const { chatId } = messageData;
      if (!chatId) return;
      io.to(chatId).emit("receiveMessage", messageData);
      console.log("📩 New message broadcast to:", chatId);
    });

    socket.on("readMessages", ({ chatId, readerId, messageTimes }) => {
      if (!chatId || !readerId || !Array.isArray(messageTimes)) return;

      // Forward to other users in the room (not sender)
      socket.to(chatId).emit("messageRead", {
        messageIds: messageTimes,
        readerId,
      });

      console.log(`📘 ${readerId} read messages in ${chatId}:`, messageTimes);
    });

    socket.on("leave", (chatId) => {
      socket.leave(chatId);
    });

    socket.on("disconnect", () => {
      activeUsers.delete(socket.id);
      console.log("❌ Disconnected:", socket.id);
    });
  });
};
