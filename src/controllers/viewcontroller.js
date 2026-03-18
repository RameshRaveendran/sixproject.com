const User = require("../models/User");

exports.renderUserDashboard = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.render("user/dashboard", { user });
};

exports.renderAdminDashboard = async (req, res) => {
  const users = await User.find();

  res.render("admin/dashboard", { users });
};