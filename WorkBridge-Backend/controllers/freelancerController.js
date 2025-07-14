const Freelancer = require("../models/Freelancer");

exports.completeProfile = async (req, res, next) => {
  const freelancerId = req.user.id;

  try {
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });

    const {
      username,
      bio,
      skills,
      categories,
      experience,
      availability,
      hourlyRate,
      location,
      languages,
      education,
      certifications,
      socialLinks,
    } = req.body;

    freelancer.username = username;
    freelancer.bio = bio;
    freelancer.skills = skills;
    freelancer.categories = categories;
    freelancer.experience = experience;
    freelancer.availability = availability;
    freelancer.hourlyRate = hourlyRate;
    freelancer.location = location;
    freelancer.languages = languages;
    freelancer.education = education;
    freelancer.certifications = certifications;
    freelancer.socialLinks = socialLinks;

    // Check if all required profile fields exist
    if (
      username &&
      bio &&
      skills?.length &&
      categories?.length &&
      experience &&
      availability &&
      hourlyRate &&
      location
    ) {
      freelancer.profileCompleted = true;
    }

    await freelancer.save();
    res.json({
      message: "Profile updated",
      profileCompleted: freelancer.profileCompleted,
    });
  } catch (err) {
    next(err);
  }
};
