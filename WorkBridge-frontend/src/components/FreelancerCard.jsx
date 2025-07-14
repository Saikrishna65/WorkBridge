import React from "react";
import { Bookmark, Briefcase, Clock, Star } from "lucide-react";

const FreelancerCard = ({ freelancer }) => {
  const {
    name,
    work,
    rating,
    reviews,
    avatar,
    title,
    price,
    experience,
    type,
    description,
  } = freelancer;

  return (
    <div className="bg-[#EDEDED] w-[90vw] md:w-80 h-60">
      <div className="flex p-4">
        <div className="w-8 h-8 overflow-hidden rounded-tr-xl rounded-br-xl rounded-bl-xl">
          <img
            src={avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 ml-4 flex flex-col">
          <div className="text-xs">{name}</div>
          <div className="text-sm">{work}</div>
        </div>
        <div className="flex h-5 space-x-2">
          <div className="flex bg-white items-center p-1 rounded-lg space-x-1">
            <Star className="w-3 h-3 fill-black stroke-black" />
            <div className="text-xs font-bold">{rating}</div>
            <div className="text-xs font-bold">({reviews})</div>
          </div>
          <Bookmark className="w-5 h-5" />
        </div>
      </div>
      <div className="relative flex px-4">
        <div className="w-[60%] text-xl font-semibold">{title}</div>
        <div className="absolute w-1/3 right-0 text-sm text-gray-500">
          from{" "}
          <span className="text-lg text-black font-semibold">₹{price}</span>{" "}
        </div>
      </div>
      <div className="flex space-x-1 px-4 pt-2 text-xs">
        <div className="flex justify-center items-center border rounded-xl py-1 px-3">
          <Briefcase className="text-gray-700 w-4 h-4 mr-2" />
          <span className="font-semibold text-gray-800">
            {experience} years exp
          </span>
        </div>
        <div className="flex justify-center items-center border rounded-xl py-1 px-3">
          <Clock className="text-gray-700 w-4 h-4 mr-2" />
          <span className="font-semibold text-gray-800">{type}</span>
        </div>
      </div>
      <div className="text-sm px-4 pt-2 text-gray-600">{description}</div>
    </div>
  );
};

export default FreelancerCard;
