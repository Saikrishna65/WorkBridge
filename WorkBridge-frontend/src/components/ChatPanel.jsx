import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useAppContext } from "../context/AppContext";
import { Image as ImageIcon, X, CheckCheck } from "lucide-react";
import { format } from "date-fns";

const SOCKET_URL = "http://localhost:4000";
const API_BASE = "http://localhost:4000/api/chat";

const socket = io(SOCKET_URL, { autoConnect: false });

const ChatPanel = ({ otherUser }) => {
  const { user } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const currentUserId = user?._id;
  const otherUserId = otherUser?._id || otherUser?.id;
  const currentRole = user?.role;

  const chatId =
    currentUserId && otherUserId
      ? [currentUserId, otherUserId].sort().join("_")
      : null;

  // Socket setup
  useEffect(() => {
    if (!chatId || !currentUserId) return;

    socket.auth = { chatId };
    socket.connect();
    socket.emit("join", { chatId, userId: currentUserId });

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      emitReadStatus([msg.time]); // Emit read if chat is open
    };

    const handleReadReceipt = ({ messageIds, readerId }) => {
      if (readerId === currentUserId) return; // Ignore if self
      setMessages((prev) =>
        prev.map((msg) => {
          const timeKey =
            typeof msg.time === "string" ? msg.time : msg.time.toISOString();
          if (messageIds.includes(timeKey)) return { ...msg, read: true };
          return msg;
        })
      );
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("messageRead", handleReadReceipt);

    return () => {
      socket.emit("leave", chatId);
      socket.disconnect();
      socket.off("receiveMessage", handleReceive);
      socket.off("messageRead", handleReadReceipt);
    };
  }, [chatId, currentUserId]);

  // Fetch initial chat history
  useEffect(() => {
    if (!chatId || !currentUserId || !currentRole) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/${chatId}?userId=${currentUserId}&role=${currentRole}`
        );
        const data = await res.json();
        const msgs = Array.isArray(data) ? data : data.messages || [];
        setMessages(msgs);

        // Emit read for all messages immediately
        const unreadTimes = msgs
          .filter((m) => m.senderId !== currentUserId && !m.read)
          .map((m) =>
            typeof m.time === "string" ? m.time : m.time.toISOString()
          );
        if (unreadTimes.length) emitReadStatus(unreadTimes);
      } catch {
        setMessages([]);
      }
    })();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const emitReadStatus = (messageTimes = []) => {
    if (!chatId || !currentUserId || messageTimes.length === 0) return;
    socket.emit("readMessages", {
      chatId,
      readerId: currentUserId,
      messageTimes,
    });
  };

  const sendMessage = async () => {
    if (!chatId || (!inputMessage.trim() && !selectedFile)) return;
    setIsSending(true);

    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("senderId", currentUserId);
    formData.append("receiverId", otherUserId);
    formData.append("message", inputMessage.trim());
    formData.append("senderRole", currentRole);
    formData.append("senderName", user.name);
    formData.append("senderAvatar", user.avatar);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: "POST",
        body: formData,
      });
      const { messageData } = await res.json();
      if (res.ok && messageData) {
        socket.emit("sendMessage", { ...messageData, chatId });
        setInputMessage("");
        setSelectedFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isImageUrl = (url) => /\.(jpeg|jpg|png|gif|webp)$/i.test(url);

  const handleKeyPress = (e) => e.key === "Enter" && sendMessage();

  return (
    <div className="w-full h-screen flex flex-col border-l border-gray-100">
      {/* Header */}
      <div className="p-4 text-2xl font-semibold">
        Chat with {otherUser?.name}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollable-no-scrollbar">
        {messages.map((msg, idx) => {
          const isSent = msg.senderId === currentUserId;
          const formattedTime = format(new Date(msg.time), "hh:mm a");

          return (
            <div key={idx} className="flex flex-col space-y-1">
              {/* Message bubble */}
              <div
                className={`max-w-[70%] p-2 rounded-lg text-sm break-words ${
                  isSent
                    ? "ml-auto bg-black text-white"
                    : "mr-auto bg-gray-200 text-black"
                }`}
              >
                {msg.message && <p>{msg.message}</p>}

                {msg.fileUrl && isImageUrl(msg.fileUrl) && (
                  <img
                    src={msg.fileUrl}
                    alt="sent"
                    className="mt-2 max-w-[200px] rounded"
                  />
                )}

                {msg.fileUrl && !isImageUrl(msg.fileUrl) && (
                  <a
                    href={msg.fileUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline mt-1 inline-block"
                  >
                    Download file
                  </a>
                )}
              </div>

              {/* Time + Blue Tick row (below bubble) */}
              <div
                className={`flex items-center text-[10px] opacity-70 px-1 ${
                  isSent ? "justify-end pr-1" : "justify-start pl-1"
                }`}
              >
                <span>{formattedTime}</span>
                {isSent && (
                  <CheckCheck
                    size={12}
                    className={`ml-1 ${
                      msg.read ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Preview */}
      {imagePreview && (
        <div className="relative px-4 pb-2 w-fit">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-[150px] rounded border"
          />
          <button
            onClick={() => {
              setSelectedFile(null);
              setImagePreview(null);
            }}
            className="absolute -top-2 -right-2 bg-white text-black border rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 flex gap-2 items-center">
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isSending}
        >
          <ImageIcon
            className={`w-10 h-10 ${
              isSending ? "text-gray-300" : "text-gray-700 hover:text-black"
            }`}
          />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2 border rounded text-sm"
          disabled={isSending}
        />

        <button
          onClick={sendMessage}
          disabled={isSending}
          className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
