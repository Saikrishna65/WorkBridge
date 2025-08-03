// routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { updateClientProfile } = require("../controllers/clientController");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

router.put(
  "/update-profile",
  protect,
  upload.single("avatar"), // ✅ 'avatar' should match frontend FormData key
  updateClientProfile
);

module.exports = router;
