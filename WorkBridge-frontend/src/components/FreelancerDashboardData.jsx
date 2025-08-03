import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Clock, Wallet, ArrowDown } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const FreelancerDashboardData = () => {
  const { user } = useAppContext();
  const [myProjects, setMyProjects] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const barHeightFactor = 5;

  const fetchFreelancerProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/projects/freelancer-projects",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );
      setMyProjects(res.data.projects);
    } catch (err) {
      console.error("Failed to fetch freelancer projects:", err.message);
    }
  };

  useEffect(() => {
    fetchFreelancerProjects();
  }, []);

  const activeProject = myProjects.find(
    (p) => p.state === "assigned" && p.acceptedAt && p.deadline
  );

  useEffect(() => {
    if (!activeProject?.acceptedAt || !activeProject?.deadline) return;

    const acceptedAt = new Date(activeProject.acceptedAt);
    const deadlineDate = new Date(
      acceptedAt.getTime() + activeProject.deadline * 24 * 60 * 60 * 1000
    );

    const updateTimeLeft = () => {
      const now = new Date();
      const secondsLeft = Math.max(0, Math.floor((deadlineDate - now) / 1000));
      setRemainingSeconds(secondsLeft);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [activeProject]);

  const totalSeconds = activeProject?.deadline
    ? activeProject.deadline * 24 * 60 * 60
    : 1;

  const percentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  const completedCount = myProjects.filter(
    (p) => p.state === "completed"
  ).length;
  const activeCount = myProjects.filter((p) => p.state === "assigned").length;
  const cancelledCount = myProjects.filter(
    (p) => p.state === "cancelled"
  ).length;

  const successRate =
    completedCount + cancelledCount > 0
      ? Math.round((completedCount / (completedCount + cancelledCount)) * 100)
      : 0;

  const dynamicStats = [
    {
      label: "Completed",
      value: completedCount,
      color: "bg-green-600",
      dot: "bg-green-600",
      textColor: "text-green-700",
    },
    {
      label: "Active",
      value: activeCount,
      color: "bg-blue-600",
      dot: "bg-blue-600",
      textColor: "text-blue-700",
    },
    {
      label: "Cancelled",
      value: cancelledCount,
      color: "bg-red-600",
      dot: "bg-red-600",
      textColor: "text-red-700",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      color: "bg-purple-600",
      dot: "bg-purple-600",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full pl-6 pt-5">
        <div className="text-3xl md:text-5xl font-extralight">
          Welcome in, {user?.name}
        </div>
      </div>

      <div className="w-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="relative w-full h-64 rounded-[2rem] overflow-hidden text-white">
          <img
            className="w-full h-full object-cover object-center"
            src={user?.avatar}
            alt="profile"
          />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-4 left-5 z-10">
            <div className="text-lg font-semibold">{user?.name}</div>
            <div className="text-xs text-white/80">
              {user?.services?.[0]?.name}
              {user?.services?.length > 1 && (
                <span className="text-[9px]"> +{user.services.length - 1}</span>
              )}
            </div>
          </div>
        </div>

        {/* Earnings */}
        <div className="w-full h-64 bg-gray-200 rounded-[2rem] p-6 text-gray-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Total Earnings
            </h2>
            <div className="flex items-center mt-1 text-3xl font-bold">
              ₹{completedCount * 2000}
              <Wallet className="w-5 h-5 ml-2" />
            </div>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Withdrawable</span>
              <span>₹{completedCount * 1500}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pending</span>
              <span>₹{completedCount * 500}</span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="w-full h-64 p-4 rounded-[2rem] bg-gray-200 flex flex-col">
          <h2 className="text-md font-semibold text-gray-800 mb-4">
            Time left for current project
          </h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-40 h-40">
              <CircularProgressbarWithChildren
                value={percentage}
                styles={buildStyles({
                  pathColor: "black",
                  trailColor: "white",
                })}
              >
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {hours}:{minutes}:{seconds}
                  </div>
                  <div className="text-xs text-gray-500">Time left</div>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </div>

        {/* Stats Graph */}
        <div className="flex justify-around items-end w-full h-64 rounded-[2rem] bg-gray-200 pb-3 px-4 overflow-hidden">
          {dynamicStats.map((item, index) => {
            const maxBarHeight = 120;
            const rawValue = parseInt(item.value) || 0;
            const heightPx = Math.min(rawValue * barHeightFactor, maxBarHeight);
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-end space-y-2"
              >
                <div className={`text-sm font-semibold ${item.textColor}`}>
                  {item.value}
                </div>
                <div
                  className={`w-4 rounded-full ${item.color}`}
                  style={{ height: `${heightPx}px` }}
                />
                <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                <div className="text-xs text-center text-gray-600">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboardData;
