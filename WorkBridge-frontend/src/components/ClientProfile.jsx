import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const ClientProfile = () => {
  const { user, setUser } = useAppContext();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatar: previewUrl }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await axios.put(
        "http://localhost:4000/api/client/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.user) {
        setUser(res.data.user);
        setProfile(res.data.user);
        setEditMode(false);
        setAvatarFile(null);
        console.log("✅ Updated:", res.data.user);
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err.response?.data || err);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="p-6 md:p-10 mt-20 max-w-xl mx-auto bg-gray-200 rounded-xl shadow">
      <div className="flex flex-col items-center gap-4">
        <img
          src={profile.avatar || "/default-avatar.jpg"}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />

        {editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-sm"
          />
        )}

        <div className="text-center w-full">
          {editMode ? (
            <>
              <input
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="text-xl font-semibold px-3 py-2 rounded w-full mb-2 border"
                placeholder="Name"
              />
              <input
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="text-sm px-3 py-2 rounded w-full border"
                placeholder="Email"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </>
          )}
        </div>

        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ClientProfile;
