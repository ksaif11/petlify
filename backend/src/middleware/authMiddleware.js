import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication failed! Token is required." });
  }
  
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token. Token verification failed." });
    }
    
    // Ensure isAdmin is always a boolean
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      isAdmin: Boolean(decoded.isAdmin)
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please login again." });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }
    return res.status(401).json({ message: "Authentication failed: " + error.message });
  }
};

export const requireOrganization = async (req, res, next) => {
  // Ensure authenticate middleware was called first
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required. Please login first." });
  }
  
  // Check if user is admin (explicitly check for true boolean)
  if (!req.user.isAdmin || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  
  next();
};
