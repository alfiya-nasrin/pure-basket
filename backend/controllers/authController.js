// /server/controllers/authController.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import { generateToken } from "../utils/generateToken.js";

// Helper to set HttpOnly cookie
const sendTokenCookie = (res, token) => {
  const raw = process.env.JWT_EXPIRES_IN || "7d";
  const maxAge = raw.endsWith("d")
    ? (Number(raw.slice(0, -1)) || 7) * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });
};

// Register (buyer or seller)
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const emailNormalized = email.trim().toLowerCase();
  const userExists = await User.findOne({ email: emailNormalized });
  if (userExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name: name.trim(),
    email: emailNormalized,
    password,
    role: role === "seller" ? "seller" : "buyer",
  });

  if (!user) {
    res.status(400);
    throw new Error("Failed to create user");
  }

  let seller = null;
  if (user.role === "seller") {
    const { shopName, phone, fssaiNumber, location } = req.body;
    seller = await Seller.create({
      user: user._id,
      shopName: shopName || "",
      phone: phone || "",
      fssaiNumber: fssaiNumber || "",
      location: location || {},
      status: "draft",
    });
  }

  const token = generateToken({ id: user._id, role: user.role });
  sendTokenCookie(res, token);

  res.status(201).json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    seller: seller ? { _id: seller._id, status: seller.status } : null,
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  const emailNormalized = email.trim().toLowerCase();
  const user = await User.findOne({ email: emailNormalized });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // optional: attach seller info in login response
  let sellerInfo = null;
  if (user.role === "seller") {
    sellerInfo = await Seller.findOne({ user: user._id }).select("-docs");
  }

  const token = generateToken({ id: user._id, role: user.role });
  sendTokenCookie(res, token);

  res.json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    seller: sellerInfo,
  });
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  let sellerInfo = null;
  if (user.role === "seller") {
    sellerInfo = await Seller.findOne({ user: user._id }).select("-docs");
  }

  res.json({ success: true, user, seller: sellerInfo });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out" });
});
