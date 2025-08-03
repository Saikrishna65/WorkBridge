const User = require("../models/User");

exports.updateClientProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updates = {
      name,
      email,
    };

    if (req.file && req.file.path) {
      updates.avatar = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Client profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update client profile error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};
