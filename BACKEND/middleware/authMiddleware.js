const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header (Bearer token)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication failed: No token provided" });
  }

  try {
    // Verify the token using the secret key (same key used during token generation)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request object to use it in subsequent routes
    req.userId = decoded.userId; 

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: "Authentication failed: Invalid token" });
  }
};

module.exports = authMiddleware;