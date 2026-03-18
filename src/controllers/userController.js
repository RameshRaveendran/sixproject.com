const User = require("../models/User");

// User dashboard
exports.getUserDashboard = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({
    success: true,
    data: user
  });
};

// Admin dashboard
exports.getAdminDashboard = async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    success: true,
    data: users
  });
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "User deleted" });
};

// Update user email
exports.updateUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { email },
    { new: true }
  );

  res.json({ success: true, data: user });
};