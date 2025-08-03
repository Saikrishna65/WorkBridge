import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const categories = [
  { key: "open", label: "Active Projects" },
  { key: "completed", label: "Completed Projects" },
  { key: "posted", label: "My Posts" },
  { key: "assigned", label: "Assigned Projects" },
];

const ClientProjects = () => {
  const { user } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/projects/client-projects",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        setProjects(res.data.projects);
      } catch (err) {
        console.error("Error fetching client projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "posted") {
      return project.createdBy === user._id;
    } else if (selectedCategory === "assigned") {
      return project.assignedTo && project.assignedTo._id;
    } else {
      return project.state === selectedCategory;
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Your Projects</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`min-w-[140px] px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === cat.key
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="rounded-2xl p-5 shadow-sm bg-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-700 text-sm mb-2">
                {project.description}
              </p>
              <div className="text-sm text-gray-700 mb-2">
                Category:{" "}
                <span className="font-medium">{project.category}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                Budget: ₹<span className="font-medium">{project.budget}</span>
              </div>
              {project.assignedTo && (
                <div className="text-sm text-gray-700 mb-1">
                  Assigned To:{" "}
                  <span className="font-medium">
                    {project.assignedTo.name || "Freelancer"}
                  </span>
                </div>
              )}
              <div className="text-xs text-gray-600">
                Posted On:{" "}
                {new Date(project.createdAt).toLocaleDateString("en-IN")}
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-gray-400 italic col-span-full text-center mt-6">
              No projects in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientProjects;
