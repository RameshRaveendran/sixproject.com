const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  renderUserDashboard,
  renderAdminDashboard
} = require("../controllers/viewController");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/dashboard", protect, renderUserDashboard);

router.get("/admin/dashboard", protect, adminOnly, renderAdminDashboard);

module.exports = router;