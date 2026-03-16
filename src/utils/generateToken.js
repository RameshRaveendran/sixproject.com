// const jwt = require("jsonwebtoken");

// function generateToken(id) {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// }

// module.exports = generateToken;

const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

module.exports = generateToken;
