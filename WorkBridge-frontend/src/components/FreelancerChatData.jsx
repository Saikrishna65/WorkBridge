// 📁 components/FreelancerChatData.jsx

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { X as CloseIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import ChatPanel from "./ChatPanel";

const FreelancerChatData = () => {
  const { user } = useAppContext();
  const [selectedClient, setSelectedClient] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [tab, setTab] = useState("new"); // 'new' or 'all'

  const isFreelancer = user.role === "freelancer";

  const allChats = user.chats || [];

  const unreadChats = allChats.filter((chat) =>
    chat.messages.some((m) => m.receiverId === user._id && !m.read)
  );

  const getSummaryCards = (chats) =>
    chats.map((chat) => {
      const otherId = isFreelancer ? chat.clientId : chat.freelancerId;
      const otherName = isFreelancer ? chat.clientName : chat.freelancerName;
      const otherAvatar = isFreelancer
        ? chat.clientAvatar
        : chat.freelancerAvatar;

      const unread = chat.messages.filter(
        (m) => m.receiverId === user._id && !m.read
      );
      const count = unread.length;
      const lastTime = new Date(
        Math.max(...chat.messages.map((m) => new Date(m.time)))
      );

      return {
        otherId,
        otherName,
        otherAvatar,
        count,
        lastTime,
        chatId: chat.chatId,
      };
    });

  const cards = getSummaryCards(tab === "new" ? unreadChats : allChats);

  const handleSelect = (card) => {
    setSelectedClient({
      _id: card.otherId,
      name: card.otherName,
      avatar: card.otherAvatar,
    });
    setMobileChatOpen(true);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`w-full md:w-[70vw] overflow-auto p-10 bg-white ${
          mobileChatOpen ? "hidden md:block" : "block"
        }`}
      >
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab("new")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === "new" ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            New Messages
          </button>
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === "all" ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            All Messages
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          {tab === "new" ? "Unread Chats" : "All Chats"}
        </h2>

        {cards.length === 0 ? (
          <p className="text-gray-500">
            {tab === "new"
              ? "All caught up! 🎉"
              : "No previous messages found."}
          </p>
        ) : (
          cards.map((card) => (
            <div
              key={card.otherId}
              onClick={() => handleSelect(card)}
              className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition ${
                selectedClient?._id === card.otherId
                  ? "bg-gray-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={card.otherAvatar}
                  alt={card.otherName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{card.otherName}</p>
                  {tab === "new" && (
                    <p className="text-xs text-gray-600">
                      {card.count} unread{" "}
                      {card.count === 1 ? "message" : "messages"}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {formatDistanceToNow(card.lastTime, { addSuffix: true })}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Desktop ChatPanel */}
      <div className="hidden md:flex md:w-[30vw] bg-white">
        {selectedClient ? (
          <ChatPanel otherUser={selectedClient} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500"></div>
        )}
      </div>

      {/* Mobile ChatPanel */}
      {mobileChatOpen && (
        <div className="fixed inset-0 z-20 w-full bg-white md:hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gray-100">
            <button onClick={() => setMobileChatOpen(false)}>
              <CloseIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="font-semibold">
              Chat with {selectedClient?.name}
            </div>
            <div className="w-6 h-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            {selectedClient && <ChatPanel otherUser={selectedClient} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerChatData;
