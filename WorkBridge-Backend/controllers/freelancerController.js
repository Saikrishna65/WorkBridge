const Freelancer = require("../models/Freelancer");

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
