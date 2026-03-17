const jwt = require("jsonwebtoken");
const User = require("../models/User");

// protected route
async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token invalid",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token",
    });
  }
};

// admin only route
const adminOnly = (req,res,next)=>{

if(req.user.role !== "admin"){

return res.status(403).json({
message:"Admin access only"
});

}

next();

};

module.exports = { protect , adminOnly};
