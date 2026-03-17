const express = require("express");
const router = express.Router();

const {registerUser , loginUser ,logout} = require("../controllers/authController");
const {protect , adminOnly} = require("../middlewere/authMiddleware");

// register
router.post("/register",registerUser);
// login
router.post("/login", loginUser);
// logout
router.post("/logout", logout);

// user route
router.get("/dashboard", protect,(req , res) => {
    res.json({
        message:"User dashboard"
    });
});
//admin router
router.get("/admin", protect , adminOnly, (req, res) => {
    res.json({
        message:"Admin dashboard"
    });
});

module.exports = router;