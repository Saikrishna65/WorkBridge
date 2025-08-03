import React, { useState, useEffect } from "react";
import axios from "axios";

const stateOptions = ["assigned", "completed", "cancelled"];

const FreelancerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedState, setSelectedState] = useState("assigned");
  const [loading, setLoading] = useState(true);

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
      setProjects(res.data.projects);
    } catch (err) {
      console.error("Failed to fetch freelancer projects:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerProjects();
  }, []);

  const handleMarkCompleted = async (projectId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/projects/${projectId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );
      // Refetch projects after marking complete
      fetchFreelancerProjects();
    } catch (err) {
      console.error("Failed to mark project as completed:", err.message);
      alert("Failed to update project.");
    }
  };

  const filteredProjects = projects.filter(
    (project) => project.state?.toLowerCase() === selectedState
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading projects...</div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      {/* State Filter Buttons */}
      <div className="flex gap-3 justify-center mb-6">
        {stateOptions.map((state) => (
          <button
            key={state}
            onClick={() => setSelectedState(state)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedState === state
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {
              {
                assigned: "Active",
                completed: "Completed",
                cancelled: "Cancelled",
              }[state]
            }
          </button>
        ))}
      </div>

      {/* Filtered Projects */}
      {filteredProjects.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="w-72 p-4 bg-gray-100 rounded-xl shadow space-y-3"
            >
              {/* Client Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <img
                    src={project.createdBy?.avatar || "/default-avatar.png"}
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {project.createdBy?.name || "Unknown Client"}
                  </div>
                  <div className="text-xs text-gray-500">Client</div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold">{project.title}</h3>

              {/* Details */}
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">Accepted at:</span>{" "}
                  {new Date(project.acceptedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {project.category}
                </div>
                <div>
                  <span className="font-medium">Deadline: </span>
                  {project.deadline} days
                </div>
                <div>
                  <span className="font-medium">Budget:</span> ₹{project.budget}
                </div>
              </div>

              {/* Mark as Completed Button */}
              {project.state === "assigned" && (
                <button
                  onClick={() => handleMarkCompleted(project._id)}
                  className="w-full mt-2 px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-green-700 transition"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No {selectedState === "assigned" ? "active" : selectedState} projects
          found.
        </div>
      )}
    </div>
  );
};

export default FreelancerProjects;
