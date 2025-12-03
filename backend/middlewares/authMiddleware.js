// /server/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // try cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // keep minimal info on req.user
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token invalid");
  }
});

// role guard
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Forbidden: insufficient role");
    }
    next();
  };
};
