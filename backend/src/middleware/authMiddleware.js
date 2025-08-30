import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Token not verified." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token " + error.message });
  }
};

export const requireOrganization = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Organization access required." });
  }
  next();
};
