const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Unified Cloudinary storage for avatar and works
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isAvatar = file.fieldname === "avatar";
    return {
      folder: isAvatar ? "freelancers/avatar" : "freelancers/works",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${isAvatar ? "avatar" : "work"}-${Date.now()}-${
        file.originalname
      }`,
    };
  },
});

module.exports = { cloudinary, storage };
