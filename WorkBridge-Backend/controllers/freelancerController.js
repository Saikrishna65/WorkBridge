const { default: mongoose } = require("mongoose");
const Freelancer = require("../models/Freelancer");
const project = require("../models/project");

exports.completeProfile = async (req, res) => {
  try {
    const { experience, title, type, skills, services } = req.body;

    const avatarUrl = req.files?.avatar?.[0]?.path || null;
    const worksUrls = req.files?.works?.map((file) => file.path) || [];

    // ✅ Parse skills
    let parsedSkills;
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else {
      try {
        parsedSkills = JSON.parse(skills);
      } catch {
        parsedSkills = skills.split(",").map((s) => s.trim());
      }
    }

    // ✅ Parse services
    let parsedServices;
    if (typeof services === "string") {
      try {
        parsedServices = JSON.parse(services);
      } catch {
        parsedServices = [services];
      }
    } else {
      parsedServices = services;
    }

    const updatedFreelancer = await Freelancer.findByIdAndUpdate(
      req.user._id,
      {
        avatar: avatarUrl,
        experience,
        title,
        type,
        skills: parsedSkills,
        services: parsedServices,
        works: worksUrls,
        profileCompleted: true,
      },
      { new: true, runValidators: true }
    );

    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.status(200).json({
      message: "Profile updated",
      freelancer: updatedFreelancer,
    });
  } catch (error) {
    console.error("Error updating freelancer profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const freelancer = await Freelancer.findById(userId);
    if (!freelancer) {
      return res.status(404).json({ error: "Freelancer not found" });
    }

    const { title, type, experience, skills, services } = req.body;

    if (title !== undefined) freelancer.title = title;
    if (type !== undefined) freelancer.type = type;
    if (experience !== undefined) freelancer.experience = parseInt(experience);

    if (skills !== undefined) {
      try {
        freelancer.skills =
          typeof skills === "string" ? JSON.parse(skills) : skills;
      } catch {
        return res.status(400).json({ error: "Invalid skills format" });
      }
    }

    if (services !== undefined) {
      try {
        freelancer.services =
          typeof services === "string" ? JSON.parse(services) : services;
      } catch {
        return res.status(400).json({ error: "Invalid services format" });
      }
    }

    if (req.files?.avatar?.length > 0) {
      freelancer.avatar = req.files.avatar[0].path;
    }

    if (req.files?.works?.length > 0) {
      const workUrls = req.files.works.map((file) => file.path);
      freelancer.works.push(...workUrls);
    }

    // ✅ Mark as completed if title/type provided (optional)
    if (
      title ||
      type ||
      experience ||
      skills ||
      services ||
      req.files?.avatar
    ) {
      freelancer.profileCompleted = true;
    }

    await freelancer.save();

    res.status(200).json({
      message: "Profile updated",
      freelancer,
    });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFreelancerDashboardSummary = async (req, res) => {
  try {
    const { id } = req.params; // freelancer ID
    const freelancerId = new mongoose.Types.ObjectId(id);

    // Check if freelancer exists
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // ✅ Get projects assigned to this freelancer
    const assignedProjects = await project.find({ assignedTo: freelancerId });

    const completed = assignedProjects.filter(
      (p) => p.state === "completed"
    ).length;
    const active = assignedProjects.filter(
      (p) => p.state === "assigned" || p.state === "in-progress"
    ).length;
    const cancelled = assignedProjects.filter(
      (p) => p.state === "cancelled"
    ).length;

    const total = completed + active + cancelled;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalEarnings = assignedProjects
      .filter((p) => p.state !== "cancelled")
      .reduce((sum, p) => sum + p.budget, 0);

    const withdrawable = totalEarnings * 0.75;
    const pending = totalEarnings * 0.25;

    // ✅ Count proposals this freelancer has sent (appeared in `interested`)
    const proposalCount = await project.countDocuments({
      "interested.client": freelancerId,
    });

    // ✅ Nearest upcoming deadline from assigned projects
    const upcoming = assignedProjects
      .filter((p) => p.state === "assigned" || p.state === "in-progress")
      .sort((a, b) => {
        const aDeadline =
          new Date(a.createdAt).getTime() + a.deadline * 86400000;
        const bDeadline =
          new Date(b.createdAt).getTime() + b.deadline * 86400000;
        return aDeadline - bDeadline;
      })[0];

    const deadlineDate = upcoming
      ? new Date(upcoming.createdAt.getTime() + upcoming.deadline * 86400000)
      : new Date(Date.now() + 3 * 86400000); // dummy

    const countdownSeconds = Math.max(0, (deadlineDate - new Date()) / 1000);

    res.json({
      name: freelancer.name,
      skills: freelancer.skills || [],
      proposalsSent: proposalCount,
      completed,
      active,
      cancelled,
      successRate,
      totalEarnings,
      withdrawable,
      pending,
      countdownSeconds,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
