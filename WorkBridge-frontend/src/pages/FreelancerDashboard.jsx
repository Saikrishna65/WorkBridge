import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import FreelancerDashboardData from "../components/FreelancerDashboardData";
import FreelancerProjects from "../components/FreelancerProjects";
import FreelancerChatData from "../components/FreelancerChatData";
import FreelancerReviews from "../components/FreelancerReviews";
import FreelancerServices from "../components/FreelancerServices";
import FreelancerProfile from "../components/FreelancerProfile";
import { useNavigate } from "react-router-dom";
import RelevantProjects from "./RelevantProjects";

const tabs = [
  "Dashboard",
  "Find Projects",
  "My Projects",
  "Chat Messages",
  "My Services",
  "Reviews",
  "Profile",
];

const FreelancerDashboard = () => {
  const { logout } = useAppContext();
  const [activeTab, setActiveTab] = useState("Dashboard");
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
    <div className="w-full relative min-h-screen bg-white">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-4 md:px-8 bg-white">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3 mb-3 md:mb-0">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            WorkBridge
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div
            ref={containerRef}
            className="relative flex items-center overflow-x-auto scrollbar-hide whitespace-nowrap gap-2 bg-gray-100 px-2 py-2 rounded-full w-full"
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
                className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full whitespace-nowrap ${
                  activeTab === tab ? "text-white" : "text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={logout}
            className="bg-black px-5 py-2 font-semibold text-sm text-white rounded-full w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tab Content */}
      <main className="px-4 md:px-8 py-6">
        {activeTab === "Dashboard" && <FreelancerDashboardData />}
        {activeTab === "Find Projects" && <RelevantProjects />}
        {activeTab === "My Projects" && <FreelancerProjects />}
        {activeTab === "Chat Messages" && <FreelancerChatData />}
        {activeTab === "My Services" && <FreelancerServices />}
        {activeTab === "Reviews" && <FreelancerReviews />}
        {activeTab === "Profile" && <FreelancerProfile />}
      </main>
    </div>
  );
};

export default FreelancerDashboard;
