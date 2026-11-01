import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

function cookieOptions() {
  const secure = process.env.COOKIE_SECURE === "true";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function setAuthCookie(res, token) {
  res.cookie("token", token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SECURE === "true" ? "none" : "lax",
    path: "/",
  });
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function createUser({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password: hashedPassword,
    role,
  });
}

router.get("/admin-setup", async (_req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.json({ needsSetup: adminCount === 0 });
  } catch (err) {
    console.error("admin-setup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }
    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ msg: "User exists" });

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({
        msg: "Public signup is disabled. Ask an existing admin to add you.",
      });
    }
    const role = "admin";
    const user = await createUser({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    if (role === "admin") {
      const token = signToken(user);
      setAuthCookie(res, token);
      return res.status(201).json({
        msg: "Admin account created",
        user: publicUser(user),
        token,
      });
    }

    res.status(201).json({
      msg: "Account created. An existing admin can grant dashboard access.",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }
    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ msg: "User exists" });

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({
        msg: "An admin already exists. Log in, then add more admins from the dashboard.",
      });
    }

    const user = await createUser({
      name,
      email: normalizedEmail,
      password,
      role: "admin",
    });
    const token = signToken(user);
    setAuthCookie(res, token);
    res.status(201).json({
      msg: "Admin account created",
      user: publicUser(user),
      token,
    });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ msg: "All fields required" });
      }
      if (String(password).length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) return res.status(400).json({ msg: "User exists" });

      const user = await createUser({
        name,
        email: normalizedEmail,
        password,
        role: "admin",
      });
      res.status(201).json({
        msg: "Admin added",
        user: publicUser(user),
      });
    } catch (err) {
      console.error("Add admin error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  },
);

router.post("/login", async (req, res) => {
  try {
    const { email, password, adminOnly } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    if (adminOnly && user.role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount === 0) {
        user.role = "admin";
        await user.save();
      } else {
        return res.status(403).json({ msg: "This account is not an admin" });
      }
    }

    const token = signToken(user);
    setAuthCookie(res, token);
    res.json({
      msg: "Login success",
      user: publicUser(user),
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("/me error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ msg: "Logged out" });
});

export default router;
