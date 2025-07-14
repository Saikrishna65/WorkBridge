const express = require("express");
const router = express.Router();
const { completeProfile } = require("../controllers/freelancerController");
const { protect } = require("../middleware/authMiddleware");

// Only a logged-in freelancer can update their profile
router.patch(
  "/profile",
  protect,
  (req, res, next) => {
    if (req.user.role !== "freelancer") {
      return res
        .status(403)
        .json({ message: "Only freelancers can update profiles" });
    }
    next();
  },
  completeProfile
);

module.exports = router;
