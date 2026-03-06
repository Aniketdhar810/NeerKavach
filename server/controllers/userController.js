const User = require("../models/User");

// GET /api/users/me — Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -verificationCode"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/me — Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, department, region } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (department) updates.department = department;
    if (region) updates.region = region;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password -verificationCode");

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
