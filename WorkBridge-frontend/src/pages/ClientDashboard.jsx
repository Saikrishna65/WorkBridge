import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import ClientProjects from "../components/ClientProjects";
import FreelancerChatData from "../components/FreelancerChatData";
import InterestedFreelancers from "../components/InterestedFreelancers";
import ClientProfile from "../components/ClientProfile";
import { useNavigate } from "react-router-dom";

const tabs = [
  "My Projects",
  "Chat Messages",
  "Interested Freelancers",
  "Profile",
];

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("My Projects");
  const [pillProps, setPillProps] = useState({ width: 0, left: 0 });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const updatePillPosition = () => {
    const activeEl = document.getElementById(`tab-${activeTab}`);
    const containerEl = containerRef.current;
    if (activeEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const scrollLeft = containerEl.scrollLeft;

      setPillProps({
        width: activeRect.width,
        left: activeRect.left - containerRect.left + scrollLeft,
      });
    }
  };

  useEffect(() => {
    updatePillPosition();
    window.addEventListener("resize", updatePillPosition);
    return () => window.removeEventListener("resize", updatePillPosition);
  }, [activeTab]);

  return (
    <div className="w-full relative">
      <header className="w-full flex flex-col md:flex-row items-center justify-between p-3 md:p-1 md:pr-10 cursor-pointer">
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 mb-1 md:mb-0 md:pl-5"
        >
          <img
            className="w-16 h-16 md:w-20 md:h-20"
            src="/logo.png"
            alt="Logo"
          />
          <span className="text-3xl font-semibold">WorkBridge</span>
        </div>

        <div
          ref={containerRef}
          className="relative flex items-center bg-gray-200 overflow-x-auto whitespace-nowrap space-x-2 p-2 rounded-full shadow-md scrollable-no-scrollbar w-full md:w-auto"
        >
          <motion.div
            className="absolute h-10 bg-black rounded-full z-0"
            animate={{ width: pillProps.width, left: pillProps.left }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 min-w-max px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab ? "text-white" : "text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === "My Projects" && <ClientProjects />}
      {activeTab === "Chat Messages" && <FreelancerChatData />}
      {activeTab === "Interested Freelancers" && <InterestedFreelancers />}
      {activeTab === "Profile" && <ClientProfile />}
    </div>
  );
};

export default ClientDashboard;
