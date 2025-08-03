import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AssignProject = () => {
  const { freelancerId } = useParams();
  const navigate = useNavigate();

  const [openProjects, setOpenProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
  });

  // Fetch client's open projects
  useEffect(() => {
    const fetchOpenProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/projects/client-projects",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }
        );

        const onlyOpen = res.data.projects
          ?.filter((proj) => proj.status === "open" || proj.status === "active")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOpenProjects(onlyOpen || []);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };

    fetchOpenProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let projectId = selectedProjectId;

      if (creatingNew) {
        const res = await axios.post(
          "http://localhost:4000/api/projects/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
            withCredentials: true,
          }
        );

        projectId = res.data.project._id;
      }

      await axios.post(
        `http://localhost:4000/api/projects/${projectId}/assign`,
        { freelancerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
          withCredentials: true,
        }
      );

      alert("Project successfully assigned!");
      navigate("/client/dashboard");
    } catch (err) {
      console.error("Assignment error:", err.response?.data || err.message);
      alert("Failed to assign project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Assign Project</h1>

      <label className="block mb-4">
        <input
          type="checkbox"
          checked={creatingNew}
          onChange={(e) => setCreatingNew(e.target.checked)}
        />
        <span className="ml-2">Create a new project</span>
      </label>

      <form onSubmit={handleSubmit} className="space-y-4">
        {creatingNew ? (
          <>
            {/* Title */}
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="e.g., Logo for Fintech Startup"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={3}
                placeholder="Describe your project..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
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
            </div>

            {/* Budget */}
            <div>
              <label className="block font-medium">Budget ($)</label>
              <input
                type="number"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="e.g., 2500"
              />
            </div>

            {/* Deadline (in days) */}
            <div>
              <label className="block font-medium">Deadline (days)</label>
              <input
                type="number"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="e.g., 3"
              />
            </div>
          </>
        ) : (
          <select
            className="w-full p-2 border rounded mb-6"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select an open project</option>
            {openProjects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Assigning..." : "Assign Project"}
        </button>
      </form>
    </div>
  );
};

export default AssignProject;
