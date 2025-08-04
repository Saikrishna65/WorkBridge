const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const {
  completeProfile,
  updateFreelancerProfile,
  getFreelancerDashboardSummary,
} = require("../controllers/freelancerController");
const { protect } = require("../middleware/authMiddleware");
const { getFreelancerReviews } = require("../controllers/reviewController");

router.post(
  "/complete-profile",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "works", maxCount: 10 },
  ]),
  completeProfile
);

router.post(
  "/update-profile",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "works", maxCount: 10 },
  ]),
  updateFreelancerProfile
);

router.get("/dashboard-summary/:id", getFreelancerDashboardSummary);

router.get("/reviews", protect, getFreelancerReviews);

module.exports = router;
