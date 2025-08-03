const express = require("express");
const router = express.Router();
const {
  createProject,
  expressInterest,
  assignFreelancer,
  expressInterestInProject,
  getAllInterestedForMyProjects,
  allClientProjects,
  allFreelancerProjects,
  getRelevantPostedProjects,
  markProjectCompleted,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createProject);

router.get("/client-projects", protect, allClientProjects);

router.get("/freelancer-relevant-projects", protect, getRelevantPostedProjects);

router.get("/freelancer-projects", protect, allFreelancerProjects);

router.post("/:projectId/interest", protect, expressInterest);

router.post("/:projectId/assign", protect, assignFreelancer);

router.put("/:projectId/complete", protect, markProjectCompleted);

router.post("/:projectId/interested", protect, expressInterestInProject);

router.get("/get-all-interested", protect, getAllInterestedForMyProjects);

module.exports = router;
