const Freelancer = require("../models/Freelancer");

/**
 * @desc    Get reviews for the authenticated freelancer (with client name & avatar)
 * @route   GET /api/freelancers/reviews
 * @access  Private (freelancer only)
 */
const getFreelancerReviews = async (req, res) => {
  // ✅ Ensure the user is a freelancer
  if (req.user.role !== "freelancer") {
    res.status(403);
    throw new Error("Access denied: Not a freelancer");
  }

  const freelancerId = req.user._id;

  const freelancer = await Freelancer.findById(freelancerId).populate({
    path: "reviews.clientId",
    select: "name avatar",
    model: "Client",
  });

  if (!freelancer) {
    res.status(404);
    throw new Error("Freelancer not found");
  }

  const reviews = freelancer.reviews.map((r) => ({
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    reviewer: {
      _id: r.clientId._id,
      name: r.clientId.name,
      avatar: r.clientId.avatar,
    },
  }));

  res.json({ reviews });
};

module.exports = {
  getFreelancerReviews,
};
