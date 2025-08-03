import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Loader2 } from "lucide-react";

const RelevantProjects = () => {
  const { user } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);
  const [interestMessage, setInterestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [improving, setImproving] = useState(false); // NEW
  const [submittedProjects, setSubmittedProjects] = useState([]);

  const fetchRelevantProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/projects/freelancer-relevant-projects",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching relevant projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestSubmit = async (projectId) => {
    if (!interestMessage.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(
        `http://localhost:4000/api/projects/${projectId}/interest`,
        { message: interestMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setSubmittedProjects((prev) => [...prev, projectId]);
      setShowForm(null);
      setInterestMessage("");
      alert("Interest submitted!");
    } catch (err) {
      console.error("Error submitting interest:", err);
      alert(
        err?.response?.data?.error || "Failed to submit interest. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleImproveText = async () => {
    if (!interestMessage.trim()) return;
    setImproving(true);
    try {
      const res = await axios.post("http://localhost:4000/api/improve-text", {
        inputText: interestMessage,
      });
      if (res.data.improvedText) {
        setInterestMessage(res.data.improvedText);
      }
    } catch (error) {
      console.error("Error improving text:", error);
      alert("Could not improve message. Try again later.");
    } finally {
      setImproving(false);
    }
  };

  useEffect(() => {
    fetchRelevantProjects();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recommended Projects</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No matching projects found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const isSubmitted = submittedProjects.includes(project._id);
            const isFormOpen = showForm === project._id;

            return (
              <div
                key={project._id}
                className="bg-gray-200 rounded-lg shadow p-5 hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Category:</span>{" "}
                  {project.category}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Budget:</span> ₹{project.budget}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Deadline:</span>{" "}
                  {project.deadline} day(s)
                </p>

                {project.createdBy && (
                  <div className="flex items-center gap-3 mt-3">
                    <img
                      src={project.createdBy.avatar}
                      alt={project.createdBy.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700">
                      {project.createdBy.name}
                    </span>
                  </div>
                )}

                {!isSubmitted && !isFormOpen && (
                  <button
                    onClick={() =>
                      setShowForm((prev) =>
                        prev === project._id ? null : project._id
                      )
                    }
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    I’m Interested
                  </button>
                )}

                {isFormOpen && !isSubmitted && (
                  <div className="mt-4">
                    <textarea
                      rows={3}
                      placeholder="Write a message to the client..."
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={interestMessage}
                      onChange={(e) => setInterestMessage(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleInterestSubmit(project._id)}
                        disabled={submitting}
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                      >
                        {submitting ? "Submitting..." : "Send Interest"}
                      </button>
                      <button
                        onClick={handleImproveText}
                        disabled={improving}
                        className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
                      >
                        {improving ? "Improving..." : "Improve ✨"}
                      </button>
                    </div>
                  </div>
                )}

                {isSubmitted && (
                  <div className="mt-4 text-green-600 font-medium">
                    Interest already submitted
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RelevantProjects;
