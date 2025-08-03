import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import API from "../utils/api";

const FreelancerProfile = () => {
  const { user, setUser, token } = useAppContext();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newWorkFiles, setNewWorkFiles] = useState([]);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveWork = (index) => {
    setProfile((prev) => ({
      ...prev,
      works: prev.works.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", profile.title || "");
      formData.append("name", profile.name);
      formData.append("type", profile.type);
      formData.append("experience", profile.experience);
      formData.append("skills", JSON.stringify(profile.skills || []));
      formData.append("services", JSON.stringify(profile.services || []));

      // ✅ Avatar
      if (typeof profile.avatar !== "string" && profile.avatar) {
        formData.append("avatar", profile.avatar);
      }

      // ✅ Existing works are kept (string URLs)
      // ✅ New works (files) are appended
      newWorkFiles.forEach((file) => {
        formData.append("works", file);
      });

      const res = await API.post("/freelancer/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.freelancer);
      setProfile(res.data.freelancer);
      setEditMode(false);
      setNewWorkFiles([]);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="p-6 md:p-10 md:mt-10 max-w-4xl mx-4 md:mx-auto bg-gray-200 rounded-xl">
      {/* Avatar + Name */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={
            typeof profile.avatar === "string"
              ? profile.avatar
              : URL.createObjectURL(profile.avatar)
          }
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover shadow"
        />
        <div className="space-y-1 flex-1">
          {editMode ? (
            <input
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="text-xl font-semibold border px-2 py-1 rounded w-full"
            />
          ) : (
            <>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.title}</p>
            </>
          )}
        </div>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="ml-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      {editMode && (
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Change Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange("avatar", e.target.files[0])}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      )}

      {/* Info Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Experience
          </label>
          {editMode ? (
            <input
              value={profile.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
              type="number"
              className="w-full border px-3 py-1 rounded"
            />
          ) : (
            <p>{profile.experience} years</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Job Type
          </label>
          {editMode ? (
            <select
              value={profile.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border px-3 py-1 rounded"
            >
              <option value="full time">Full Time</option>
              <option value="part time">Part Time</option>
              <option value="project work">Project Work</option>
            </select>
          ) : (
            <p className="capitalize">{profile.type}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.skills?.map((skill, i) => (
            <div
              key={i}
              className="bg-black text-white text-sm px-3 py-1 rounded-full flex items-center gap-2"
            >
              {skill}
              {editMode && (
                <button
                  onClick={() => handleRemoveSkill(i)}
                  className="ml-1 text-red-300 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {editMode && (
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="border px-3 py-1 rounded w-full"
              placeholder="New skill"
            />
            <button
              onClick={handleAddSkill}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Works */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Work Showcase</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {profile.works?.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`work-${i}`}
                className="w-full h-32 object-cover rounded shadow-sm"
              />
              {editMode && (
                <button
                  onClick={() => handleRemoveWork(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {editMode && (
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Upload More Works
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewWorkFiles(Array.from(e.target.files))}
              className="border px-3 py-1 rounded w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;
