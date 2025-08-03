import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StepForm = () => {
  const [formData, setFormData] = useState({
    services: [],
    works: [],
  });
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [service, setService] = useState({
    name: "",
    category: "",
    price: "",
    revisions: "",
    deadline: "",
    description: "",
  });

  const stepsList = [
    { key: "title", icon: "👤" },
    { key: "type", icon: "📄" },
    { key: "experience", icon: "🎯" },
    { key: "skills", icon: "💡" },
    { key: "avatar", icon: "🖼️" },
    { key: "services", icon: "🛠️" },
    { key: "works", icon: "📷" },
  ];
  const handleNext = () => {
    if (step === 0 && title.trim()) {
      setFormData((prev) => ({ ...prev, title }));
      setStep(step + 1);
    } else if (step === 1 && type.trim()) {
      setFormData((prev) => ({ ...prev, type }));
      setStep(step + 1);
    } else if (step === 2 && experience.trim()) {
      setFormData((prev) => ({ ...prev, experience }));
      setStep(step + 1);
    } else if (step === 3 && skills.trim()) {
      const skillArr = skills.split(",").map((s) => s.trim());
      setFormData((prev) => ({ ...prev, skills: skillArr }));
      setStep(step + 1);
    } else if (step === 4 && avatar) {
      setFormData((prev) => ({ ...prev, avatar })); // File instance
      setStep(step + 1);
    }
  };

  const handleAddService = () => {
    if (
      service.name &&
      service.category &&
      service.price &&
      service.revisions &&
      service.deadline &&
      service.description
    ) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, service],
      }));
      setService({
        name: "",
        category: "",
        price: "",
        revisions: "",
        deadline: "",
        description: "",
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setFormData((prev) => ({
      ...prev,
      works: [...prev.works, ...imageFiles], // ✅ store real files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("type", formData.type);
    payload.append("experience", formData.experience);
    payload.append("skills", JSON.stringify(formData.skills));
    payload.append("services", JSON.stringify(formData.services));

    // ✅ Avatar
    if (formData.avatar instanceof File) {
      payload.append("avatar", formData.avatar);
    }

    // ✅ Works
    if (formData.works?.length > 0) {
      formData.works.forEach((file) => {
        if (file instanceof File) {
          payload.append("works", file);
        }
      });
    }

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        "http://localhost:4000/api/freelancer/complete-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        console.log("Profile submitted:", res.data);
        navigate("/freelancer/dashboard");
      }
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="relative bg-[url('/complete-profile-bg.png')] bg-cover bg-center min-h-screen bg-[#f9f9f9] p-5 md:p-10 text-gray-800 flex flex-col md:flex-row">
      {/* Previous Data */}
      <div className="w-full md:w-1/3 space-y-4 pr-5">
        {formData.title && (
          <div className="text-sm">
            <span className="font-bold">Title:</span> {formData.title}
          </div>
        )}
        {formData.type && (
          <div className="text-sm">
            <span className="font-bold">Type:</span> {formData.type}
          </div>
        )}
        {formData.experience && (
          <div className="text-sm">
            <span className="font-bold">Experience:</span> {formData.experience}
          </div>
        )}
        {formData.skills && (
          <div className="text-sm">
            <span className="font-bold">Skills:</span>{" "}
            {formData.skills.join(", ")}
          </div>
        )}
        {formData.avatar && (
          <div className="text-sm">
            <span className="font-bold">Avatar:</span>
            <img
              src={URL.createObjectURL(formData.avatar)}
              alt="Avatar"
              className="w-20 h-20 rounded-full mt-2"
            />
          </div>
        )}
        {formData.services.length > 0 && (
          <div className="hidden md:block text-sm">
            <span className="font-bold">Services:</span>
            <ul className="list-disc pl-5 mt-1">
              {formData.services.map((s, idx) => (
                <li key={idx}>
                  {s.name} ({s.category})
                </li>
              ))}
            </ul>
          </div>
        )}
        {formData.works.length > 0 && (
          <div className="hidden md:block text-sm">
            <span className="font-bold">Works:</span>
            <div className="grid grid-cols-2 gap-2 mt-2 pr-10">
              {formData.works.map((url, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(url)}
                  alt={`Work ${idx + 1}`}
                  className="w-38 h-24 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="absolute bottom-0 md:relative flex flex-col items-center justify-center ml-5 md:ml-90 pr-2 md:pr-0 pb-30 md:pb-0">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="title"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <h2 className="text-2xl font-semibold">Enter Title</h2>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Landing Page Design etc..."
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="type" {...stepTransition} className="space-y-5">
                <h2 className="text-2xl font-semibold">Select Work Type</h2>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">-- Select Type --</option>
                  <option value="part-time">Part Time</option>
                  <option value="full-time">Full Time</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="project-work">Project Work</option>
                </select>
                <button
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-full"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="experience"
                {...stepTransition}
                className="space-y-5"
              >
                <h2 className="text-2xl font-semibold">Years of Experience</h2>
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="2, 5 etc."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-full"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="skills"
                {...stepTransition}
                className="space-y-5"
              >
                <h2 className="text-2xl font-semibold">Enter Skills</h2>
                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., figma, react, node.js"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-full"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="avatar"
                {...stepTransition}
                className="space-y-5"
              >
                <h2 className="text-2xl font-semibold">Upload Avatar</h2>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatar(file);
                  }}
                  className="w-full"
                />
                <button
                  onClick={handleNext}
                  className="bg-black text-white px-6 py-2 rounded-full"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="services"
                {...stepTransition}
                className="md:space-y-5"
              >
                <h2 className="text-2xl font-semibold">Add Service</h2>

                {/* Group inputs into a responsive grid */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-5">
                  <input
                    value={service.name}
                    onChange={(e) =>
                      setService({ ...service, name: e.target.value })
                    }
                    placeholder="Service name"
                    className="h-10 p-3 border rounded-lg w-full"
                  />

                  <select
                    value={service.category}
                    onChange={(e) =>
                      setService({ ...service, category: e.target.value })
                    }
                    className="h-10 p-2 border border-gray-300 rounded-lg w-full"
                  >
                    <option value="">Select Category</option>
                    <option value="design">Design</option>
                    <option value="branding">Branding</option>
                    <option value="web design">Web Design</option>
                    <option value="frontend">Frontend</option>
                    <option value="programming">Programming</option>
                    <option value="backend">Backend</option>
                    <option value="web development">Web Development</option>
                    <option value="video editing">Video Editing</option>
                    <option value="animation">Animation</option>
                    <option value="content creation">Content Creation</option>
                    <option value="marketing">Marketing</option>
                    <option value="ads">Ads</option>
                    <option value="strategy">Strategy</option>
                    <option value="seo">SEO</option>
                    <option value="analytics">Analytics</option>
                  </select>

                  <input
                    value={service.price}
                    onChange={(e) =>
                      setService({ ...service, price: e.target.value })
                    }
                    placeholder="Price"
                    type="number"
                    className="h-10 p-3 border rounded-lg w-full"
                  />

                  <input
                    value={service.revisions}
                    onChange={(e) =>
                      setService({ ...service, revisions: e.target.value })
                    }
                    placeholder="Revisions"
                    type="number"
                    className="h-10 p-3 border rounded-lg w-full"
                  />

                  <input
                    value={service.deadline}
                    onChange={(e) =>
                      setService({ ...service, deadline: e.target.value })
                    }
                    placeholder="Deadline (e.g. 5 days)"
                    className="h-10 p-3 border rounded-lg w-full"
                  />

                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      setService({ ...service, description: e.target.value })
                    }
                    placeholder="Description"
                    className="h-10 p-2 border rounded-lg w-full sm:col-span-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-2 md:mt-4">
                  <button
                    onClick={handleAddService}
                    className="bg-black text-white px-6 py-2 rounded-full"
                  >
                    Add Service
                  </button>
                  {formData.services.length > 0 && (
                    <button
                      onClick={() => setStep(6)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full"
                    >
                      Next
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="works" {...stepTransition} className="space-y-5">
                <h2 className="text-2xl font-semibold">Upload Work Images</h2>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded-full"
                >
                  Submit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Step Indicator */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center items-center px-4 md:px-20 pb-5">
        <div className="flex w-full h-22 items-center justify-between overflow-x-auto scrollable-no-scrollbar space-x-4 px-2">
          {stepsList.map((s, index) => (
            <React.Fragment key={s.key}>
              {/* Step Icon + Label */}
              <div className="flex flex-col items-center text-sm transition-all duration-300">
                {/* Icon with rounded background */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    step === index
                      ? "bg-blue-100 text-blue-600 -translate-y-3 shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                </div>

                {/* Step label */}
                <div className="mt-1 text-xs capitalize text-gray-500">
                  {s.key}
                </div>
              </div>

              {/* Line between steps */}
              {index < stepsList.length - 1 && (
                <div className="flex-grow h-0.5 bg-gray-300 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const stepTransition = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { duration: 0.4 },
};

export default StepForm;
