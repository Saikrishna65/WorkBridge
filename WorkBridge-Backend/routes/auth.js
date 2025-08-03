const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");
const { protect } = require("../middleware/authMiddleware");

// Separate registration routes
router.post("/register-user", registerValidation, authController.registerUser);
router.post(
  "/register-freelancer",
  registerValidation,
  authController.registerFreelancer
);

// Shared login & token logic
router.post("/login", loginValidation, authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

// Protected route (works for both users & freelancers)
router.get("/me", protect, authController.fetchUser);

module.exports = router;
