import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Bookmark, Share, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatPanel from "../components/ChatPanel";

const FreelancerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allFreelancers, getFreelancerRating } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const freelancer = allFreelancers.find((f) => f.id === id);
  if (!freelancer) return <div className="p-4">Freelancer not found.</div>;

  return (
    <div className="flex ">
      {/* Left: Profile & Services (scrollable) */}
      <div className="min-h-screen w-full md:w-[70vw] p-8 overflow-y-auto ">
        {/* Header */}
        <div className="md:flex justify-between items-center pb-8">
          <div className="flex items-center space-x-5">
            <img
              className="w-22 h-22 rounded-2xl"
              src={freelancer.avatar}
              alt="profile"
            />
            <div>
              <div className="text-3xl font-bold">{freelancer.name}</div>
              <div className="text-gray-600">{freelancer.services[0].name}</div>
              <div className="flex w-16 bg-black text-white items-center p-1 rounded-2xl space-x-1">
                <Star className="w-4 h-4 fill-white stroke-black" />
                <div className="text-[11px] font-semibold">
                  {getFreelancerRating(freelancer.id)}
                </div>
                <div className="text-[10px]">
                  ({freelancer.reviews?.length || 0})
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:flex-col justify-between md:items-end space-y-3 space-x-3 pt-5 md:pt-0">
            <div className="flex space-x-4">
              <div className="flex items-center p-[10px] border-gray-600 border rounded-full">
                <Share className="w-5 h-4" />
              </div>
              <div className="flex items-center p-[10px] border-gray-600 border rounded-full">
                <Bookmark className="w-5 h-5 fill-black stroke-black" />
              </div>
            </div>
            <button
              onClick={() => navigate(`/assign/${freelancer.id}`)}
              className="bg-black w-full h-10 text-white px-5 rounded-3xl text-sm"
            >
              Assign Project
            </button>
          </div>
        </div>

        {/* Services Tabs */}
        <div className="bg-[#EDEDED] h-80">
          <div className="overflow-x-auto whitespace-nowrap border-b border-gray-500">
            <div className="flex space-x-4 md:space-x-10 h-14 md:h-20 items-center text-xl p-5 md:text-4xl font-extralight">
              {freelancer.services.map((service, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`flex text-center items-center cursor-pointer h-14 md:h-20 transition-all ${
                    activeIndex === index
                      ? "font-semibold border-b-2"
                      : "font-extralight"
                  }`}
                >
                  {service.category}
                </div>
              ))}
            </div>
          </div>

          <div className="md:flex justify-between items-center">
            <div className="flex md:flex-col md:w-[50%] space-x-4 md:space-y-4 pl-5 md:pl-10 py-5">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-gray-700">Cost of Service</span>
                <span className="text-xl font-semibold">
                  ₹{freelancer.services[activeIndex].price}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-gray-700">Revisions</span>
                <span className="text-xl font-semibold">
                  {freelancer.services[activeIndex].revisions}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-gray-700">Deadlines</span>
                <span className="text-xl font-semibold">
                  {freelancer.services[activeIndex].deadline}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full md:w-[50%] space-y-2 px-5 md:p-1">
              <span className="text-sm text-gray-700">About</span>
              <span className="text-lg md:text-2xl font-semibold">
                {freelancer.services[activeIndex].description}
              </span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#EDEDED] mt-5 p-4">
          <div className="text-2xl font-semibold">Skills</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {freelancer.skills.map((skill, idx) => (
              <div
                key={idx}
                className="py-1 px-3 bg-white rounded-2xl font-semibold text-sm border border-gray-300 hover:bg-gray-200 transition-all cursor-pointer"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Works */}
        <div className="mt-10">
          <div className="text-2xl font-semibold">My works</div>
          <div className="flex flex-wrap gap-4 mt-4">
            {freelancer.works.map((work, idx) => (
              <img
                key={idx}
                className="w-36 h-36 md:w-48 md:h-48"
                src={work}
                alt="work"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Chat Panel */}
      <div className="hidden md:block h-screen fixed top-0 right-0 w-[30vw] border-l">
        <ChatPanel otherUser={freelancer} />
      </div>

      {/* Mobile Chat Button & Panel */}
      <AnimatePresence>
        {!isChatOpen && (
          <button
            className="md:hidden fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg z-50"
            onClick={() => setIsChatOpen(true)}
          >
            Chat
          </button>
        )}

        {isChatOpen && (
          <motion.div
            key="mobile-chat"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            {/* <div className="p-4 border-b flex justify-between items-center"> */}
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute right-5 top-2 text-3xl"
            >
              ×
            </button>
            {/* </div> */}
            <div className="flex">
              <ChatPanel otherUser={freelancer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreelancerDetail;
