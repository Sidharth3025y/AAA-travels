import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Forbidden: Admins only" });
  }
  next();
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

  if (!token) return res.status(401).json({ msg: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};
