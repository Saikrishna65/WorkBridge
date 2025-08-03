import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const SUGGEST_URL = "http://localhost:4000/api/suggest-freelancer";

const InterestedFreelancers = () => {
  const { clientUser } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Per-project AI suggestion state
  const [suggestLoading, setSuggestLoading] = useState({}); // { [projectId]: boolean }
  const [suggestionByProject, setSuggestionByProject] = useState({}); // { [projectId]: { text, bestName, bestId, reason } }

  useEffect(() => {
    fetchInterested();
  }, []);

  const fetchInterested = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        "http://localhost:4000/api/projects/get-all-interested",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching interested freelancers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (projectId, freelancerId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        `http://localhost:4000/api/projects/${projectId}/assign`,
        { freelancerId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Freelancer assigned successfully!");
      fetchInterested(); // Refresh after assigning
    } catch (err) {
      console.error("Assignment error:", err);
      alert(err.response?.data?.error || "Failed to assign freelancer.");
    }
  };

  // --- AI Suggestion ---

  // Try to normalize your frontend data to what the AI route expects.
  // Your "interested" items look like:
  // { freelancerId, freelancerName, freelancerAvatar, message, ...maybe skills/experience }
  const normalizeForAI = (project) => {
    const freelancers = (project.interested || []).map((f) => ({
      id: f.freelancerId ?? f.id,
      name: f.freelancerName ?? f.name,
      avatar: f.freelancerAvatar ?? f.avatar,
      proposal: f.message ?? f.proposal ?? "",
      // Pass through if present (optional; AI can still work without these):
      skills: f.skills || [],
      experience: f.experience || "",
      rating: f.rating ?? undefined,
      completed: f.completed ?? undefined,
    }));

    const proj = {
      id: project._id || project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      budget: project.budget,
    };

    return { project: proj, freelancers };
  };

  // Extract best candidate name/id from text suggestion (fallback if backend returns plain text)
  const extractBestFromText = (text = "", project) => {
    // Heuristics:
    // 1) Look for a line like: "Best: <Name>" or "Recommended: <Name>" or first bold/first line.
    const line = (text.match(/(?:Best|Recommended)\s*[:\-]\s*(.+)/i)?.[1] || "")
      .split("\n")[0]
      .trim();

    // Try match to one of the interested names
    const names = (project.interested || []).map(
      (f) => f.freelancerName || f.name
    );
    let bestName =
      names.find((n) =>
        line ? line.toLowerCase().includes(n?.toLowerCase()) : false
      ) || "";

    // If still not found, try the first name mentioned in entire text
    if (!bestName) {
      bestName =
        names.find((n) => text.toLowerCase().includes(n?.toLowerCase())) || "";
    }

    // Reason: take 1–2 sentences after first line
    const reasonMatch = text.split("\n").slice(1, 3).join(" ").trim();

    // Best id if name matched
    let bestId = "";
    if (bestName) {
      const found = (project.interested || []).find((f) => {
        const nm = f.freelancerName || f.name;
        return nm && nm.toLowerCase() === bestName.toLowerCase();
      });
      bestId = found?.freelancerId || found?.id || "";
    }

    return { bestName, bestId, reason: reasonMatch || "" };
  };

  const handleSuggest = async (project) => {
    const pid = project._id || project.id;
    setSuggestLoading((s) => ({ ...s, [pid]: true }));

    try {
      const accessToken = localStorage.getItem("accessToken");
      const payload = normalizeForAI(project);

      const { data } = await axios.post(SUGGEST_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(data);

      // Support both structured and plain-text responses
      // Preferred structured: { best: { id, name, reason }, suggestion: "..." }
      let bestName = data?.best?.name || "";
      let bestId = data?.best?.id || "";
      let reason = data?.best?.reason || "";
      const text = data?.suggestion || data?.text || data || "";

      if (!bestName && text) {
        const extracted = extractBestFromText(text, project);
        bestName = extracted.bestName;
        bestId = extracted.bestId;
        if (!reason) reason = extracted.reason;
      }

      setSuggestionByProject((m) => ({
        ...m,
        [pid]: {
          text: text?.toString?.() || "",
          bestName,
          bestId,
          reason,
        },
      }));
    } catch (err) {
      console.error("AI suggestion error:", err);
      alert(err.response?.data?.error || "Failed to get AI suggestion.");
    } finally {
      setSuggestLoading((s) => ({ ...s, [pid]: false }));
    }
  };

  const isRecommended = (projectId, freelancer) => {
    const sug = suggestionByProject[projectId];
    if (!sug) return false;

    const id = freelancer.freelancerId ?? freelancer.id ?? "";
    const name = freelancer.freelancerName ?? freelancer.name ?? "";
    if (sug.bestId && id) return sug.bestId === id;
    if (sug.bestName && name)
      return sug.bestName.toLowerCase() === name.toLowerCase();
    return false;
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400 italic">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">
        Freelancers Interested in Your Projects
      </h2>

      {projects.length === 0 ? (
        <div className="text-center text-gray-400 italic mt-10">
          No freelancers have shown interest yet.
        </div>
      ) : (
        projects.map((project) =>
          (project.interested || []).length === 0 ? null : (
            <div key={project._id || project.id} className="mb-10">
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 className="text-xl font-semibold">{project.title}</h3>

                <button
                  onClick={() => handleSuggest(project)}
                  disabled={!!suggestLoading[project._id || project.id]}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  {suggestLoading[project._id || project.id]
                    ? "Analyzing..."
                    : "AI Suggest Best"}
                </button>
              </div>

              {/* AI suggestion banner */}
              {suggestionByProject[project._id || project.id]?.bestName && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-sm text-emerald-700 font-semibold">
                    Suggested:{" "}
                    {suggestionByProject[project._id || project.id].bestName}
                  </div>
                  {suggestionByProject[project._id || project.id]?.reason && (
                    <div className="text-xs text-emerald-700 mt-1">
                      {suggestionByProject[project._id || project.id].reason}
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(project.interested || []).map((freelancer, index) => {
                  const pid = project._id || project.id;
                  const recommended = isRecommended(pid, freelancer);

                  return (
                    <div
                      key={index}
                      className={`rounded-3xl shadow-sm p-5 transition ${
                        recommended
                          ? "bg-emerald-100 ring-2 ring-emerald-400"
                          : "bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4 mb-3">
                        <img
                          src={
                            freelancer.freelancerAvatar ||
                            freelancer.avatar ||
                            "/avatar.png"
                          }
                          alt={freelancer.freelancerName || freelancer.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            {freelancer.freelancerName || freelancer.name}
                            {recommended && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                                Recommended
                              </span>
                            )}
                          </h3>
                        </div>
                      </div>

                      {freelancer.message && (
                        <p className="text-sm text-gray-700 mb-3 italic">
                          “{freelancer.message}”
                        </p>
                      )}

                      {Array.isArray(freelancer.skills) &&
                        freelancer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs mb-4">
                            {freelancer.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="bg-white text-gray-700 px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleAssign(
                              project._id || project.id,
                              freelancer.freelancerId || freelancer.id
                            )
                          }
                          className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-green-700 transition"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default InterestedFreelancers;
