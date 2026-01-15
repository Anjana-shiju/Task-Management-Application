const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 🔥 Bearer token split
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");

    req.userId = decoded.id; // 🔥 SINGLE SOURCE OF TRUTH
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
