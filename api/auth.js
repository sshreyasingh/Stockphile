const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // First try cookies
  let token = req.cookies?.token;

  // If no token in cookies, try Authorization header
  if (!token && req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded; // attach decoded token payload
    next();
  });
}

module.exports = { verifyToken };

