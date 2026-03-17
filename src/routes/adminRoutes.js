const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewere/authMiddleware");

const {
  getAdminDashboard,
  deleteUser,
  updateUser
} = require("../controllers/userController");

router.get("/dashboard", protect, adminOnly, getAdminDashboard);

router.delete("/user/:id", protect, adminOnly, deleteUser);

router.put("/user/:id", protect, adminOnly, updateUser);

module.exports = router;