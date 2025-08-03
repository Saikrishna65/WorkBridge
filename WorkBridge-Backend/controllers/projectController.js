const Freelancer = require("../models/Freelancer");
const Project = require("../models/project");

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, budget, deadline, type } = req.body;
    console.log(title, description, category, budget, deadline, type);

    const newProject = await Project.create({
      title,
      description,
      category,
      budget,
      deadline,
      type,
      state: "open",
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Project created", project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.allClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .populate("assignedTo", "name avatar") // optional: populate assigned freelancer
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching client projects:", error.message);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

exports.allFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ assignedTo: req.user._id })
      .populate("createdBy", "name avatar") // optional: info about the client
      .sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching freelancer projects:", error.message);
    res.status(500).json({ message: "Failed to fetch freelancer projects" });
  }
};

// POST /api/projects/:projectId/interest
exports.expressInterest = async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;

  try {
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Prevent duplicate interest
    const alreadyInterested = project.interested.some(
      (entry) => entry.client.toString() === req.user._id
    );

    if (alreadyInterested) {
      return res
        .status(400)
        .json({ error: "You have already expressed interest in this project" });
    }

    project.interested.push({
      client: req.user.id, // Freelancer ID
      message,
    });

    await project.save();

    res.status(200).json({ message: "Interest submitted successfully" });
  } catch (error) {
    console.error("Error expressing interest:", error);
    res
      .status(500)
      .json({ error: "Something went wrong while submitting interest" });
  }
};

// Client assigns project to a freelancer
exports.assignFreelancer = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { freelancerId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Assign the freelancer
    project.assignedTo = freelancerId;
    project.acceptedAt = new Date();
    project.state = "assigned";
    project.type = "assigned";

    // Remove from interested list if present (optional cleanup)
    project.interested = project.interested.filter(
      (entry) => entry.client.toString() !== freelancerId
    );

    await project.save();

    res.status(200).json({ message: "Freelancer assigned", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.expressInterestInProject = async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;
  const freelancerId = req.user._id;

  if (!message || message.trim() === "") {
    res.status(400);
    throw new Error("Message is required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Prevent duplicate interest
  const alreadyInterested = project.interested.some(
    (entry) => entry.client.toString() === freelancerId.toString()
  );

  if (alreadyInterested) {
    res.status(400);
    throw new Error("You have already expressed interest in this project");
  }

  // Add interest entry
  project.interested.push({
    client: freelancerId,
    message,
  });

  await project.save();

  res.status(200).json({ message: "Interest expressed successfully", project });
};

exports.getAllInterestedForMyProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all projects created by this user
    const projects = await Project.find({ createdBy: userId })
      .populate("interested.client", "name avatar")
      .select("-__v"); // exclude version key

    // Enrich each project's interested list
    const enrichedProjects = projects.map((project) => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      status: project.status,
      budget: project.budget,
      deadline: project.deadline,
      assignedTo: project.assignedTo,
      interested: project.interested.map((entry) => ({
        freelancerId: entry.client?._id,
        freelancerName: entry.client?.name,
        freelancerAvatar: entry.client?.avatar,
        message: entry.message,
        proposedAt: entry.proposedAt,
      })),
    }));

    res.json({ projects: enrichedProjects });
  } catch (err) {
    console.error("Error fetching interested projects:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getRelevantPostedProjects = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.user._id);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // Extract unique categories from services
    const serviceCategories = [
      ...new Set(freelancer.services.map((service) => service.category)),
    ];
    console.log(serviceCategories);

    if (serviceCategories.length === 0) {
      return res.status(200).json({ projects: [] }); // No matching categories
    }

    const matchingProjects = await Project.find({
      type: "post",
      category: { $in: serviceCategories },
    }).sort({ createdAt: -1 });

    res.status(200).json({ projects: matchingProjects });
  } catch (error) {
    console.error("Error fetching relevant projects:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markProjectCompleted = async (req, res) => {
  try {
    const { projectId } = req.params;
    const freelancerId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ error: "Project not found" });

    // Optional: check if project is assigned to this freelancer
    if (project.assignedTo.toString() !== freelancerId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to complete this project" });
    }

    project.state = "completed";
    project.type = "completed";

    await project.save();

    res.status(200).json({ message: "Project marked as completed", project });
  } catch (err) {
    console.error("Error marking project as completed:", err);
    res.status(500).json({ error: "Server error" });
  }
};
