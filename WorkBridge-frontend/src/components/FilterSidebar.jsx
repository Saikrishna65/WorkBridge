import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const categories = [
  "Design",
  "Branding",
  "Web Design",
  "Frontend",
  "Programming",
  "Backend",
  "Web Development",
  "Animation",
  "Video Editing",
  "Content Creation",
  "Marketing",
  "Ads",
  "Strategy",
  "SEO",
  "Analytics",
];

const availabilityOptions = [
  "Full-time",
  "Part-time",
  "Freelance",
  "Project work",
];
const skillsList = [
  "Wireframes",
  "Spline",
  "Illustration",
  "Figma",
  "Adobe Photoshop",
  "Adobe After Effects",
];

const roundToNearest = (value, step = 10000) => {
  return Math.round(value / step) * step;
};

const FilterSidebar = ({ onFilter }) => {
  const [category, setCategory] = useState("design");

  const [availability, setAvailability] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState([1000, 3000]);
  const [expRange, setExpRange] = useState([1, 3]);
  const [selectedSkills, setSelectedSkills] = useState(["Wireframes"]);

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleReset = () => {
    const resetCategory = "";
    const resetAvailability = "";
    const resetSalaryRange = [0, Infinity];
    const resetExpRange = [0, Infinity];
    const resetSkills = [];

    // Reset local state
    setCategory("design");
    setAvailability("Full-time");
    setSalaryRange([1000, 3000]);
    setExpRange([1, 3]);
    setSelectedSkills([]);

    // Tell parent: "show all"
    onFilter({
      category: resetCategory,
      availability: resetAvailability,
      salaryRange: resetSalaryRange,
      expRange: resetExpRange,
      selectedSkills: resetSkills,
    });
  };

  const handleShowResults = () => {
    onFilter({
      category: category.toLowerCase(),
      availability: availability.toLowerCase(),
      salaryRange,
      expRange,
      selectedSkills: selectedSkills.map((s) => s.toLowerCase()),
    });

    console.log("Filters applied:", {
      category: category.toLowerCase(),
      availability: availability.toLowerCase(),
      salaryRange,
      expRange,
      selectedSkills: selectedSkills.map((s) => s.toLowerCase()),
    });
  };

  return (
    <div className="w-full max-w-xs p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold py-2">Filters</h2>
      </div>

      {/* Category */}
      <div className="relative w-full">
        <span className="absolute text-[10px] font-semibold text-gray-500 left-4 top-1 pointer-events-none z-10">
          Category
        </span>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-11 pt-3 pl-4 pr-10 bg-[#EDEDED] rounded-md appearance-none text-sm text-gray-800"
        >
          {categories.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
      </div>

      {/* Availability */}
      <div className="relative w-full">
        {/* Static label inside dropdown */}
        <span className="absolute text-[10px] text-gray-500 left-4 top-1 pointer-events-none z-10">
          Availability
        </span>

        {/* Select element */}
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full h-11 pt-3 pl-4 pr-10 bg-[#EDEDED] rounded-md appearance-none text-sm text-gray-800"
        >
          {availabilityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
      </div>

      {/* Salary */}
      <div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 text-sm">Salary</p>
          <button
            onClick={() => setSalaryRange([1000, 3000])}
            className="text-blue-600 text-sm font-semibold"
          >
            Reset
          </button>
        </div>
        <div className="mt-2">
          <Slider
            range
            min={1000}
            max={10000}
            step={1000}
            value={salaryRange}
            onChange={(range) => setSalaryRange(range)}
            trackStyle={[{ backgroundColor: "black" }]}
            handleStyle={[
              { borderColor: "black", backgroundColor: "white" },
              { borderColor: "black", backgroundColor: "white" },
            ]}
          />
          <div className="flex justify-between mt-4 space-x-2">
            <select
              value={salaryRange[0]}
              onChange={(e) =>
                setSalaryRange([+e.target.value, salaryRange[1]])
              }
              className="w-1/2 bg-[#EDEDED] font-semibold text-xs rounded-md px-2 py-1"
            >
              {[...Array(10)].map((_, i) => {
                const val = (i + 1) * 1000;
                return (
                  <option key={val} value={val}>
                    ₹{val.toLocaleString("en-IN")}
                  </option>
                );
              })}
            </select>
            <select
              value={salaryRange[1]}
              onChange={(e) =>
                setSalaryRange([salaryRange[0], +e.target.value])
              }
              className="w-1/2 bg-[#EDEDED] font-semibold text-xs rounded-md px-2 py-2"
            >
              {[...Array(10)].map((_, i) => {
                const val = (i + 1) * 1000;
                return (
                  <option key={val} value={val}>
                    ₹{val.toLocaleString("en-IN")}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex justify-between items-center">
          <p className="font-semibold">Years experience</p>
          <button
            onClick={() => setExpRange([1, 3])}
            className="text-blue-600 text-sm font-semibold"
          >
            Reset
          </button>
        </div>
        <div className="mt-4">
          <Slider
            range
            min={0}
            max={10}
            value={expRange}
            onChange={(range) => setExpRange(range)}
            trackStyle={[{ backgroundColor: "black" }]}
            handleStyle={[
              { borderColor: "black", backgroundColor: "white" },
              { borderColor: "black", backgroundColor: "white" },
            ]}
          />
          <div className="flex justify-between mt-4 space-x-2">
            <select
              value={expRange[0]}
              onChange={(e) => setExpRange([+e.target.value, expRange[1]])}
              className="w-1/2 bg-[#EDEDED] font-semibold text-xs rounded-md px-4 py-2"
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <select
              value={expRange[1]}
              onChange={(e) => setExpRange([expRange[0], +e.target.value])}
              className="w-1/2 bg-[#EDEDED] font-semibold text-xs rounded-md px-4 py-2"
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold">Skills</p>
          <button
            onClick={() => setSelectedSkills([])}
            className="text-blue-600 text-sm font-semibold"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-1 rounded-full border text-sm transition-all duration-150 ${
                selectedSkills.includes(skill)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4">
        <button
          onClick={handleShowResults}
          className="w-full bg-black text-white font-semibold py-2 rounded-lg"
        >
          Show results
        </button>
        <button
          onClick={handleReset}
          className="w-full mt-2 text-black font-semibold py-1 hover:underline border-black border-2 rounded-lg"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
