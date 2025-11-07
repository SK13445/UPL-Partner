const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { checkAuth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      // Check for franchise or channel partner password requirement
      if (
        (user.role === "franchise_partner" ||
          user.role === "channel_partner") &&
        !user.password
      ) {
        return res
          .status(401)
          .json({ message: "Please set your password first" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id);

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          franchiseId: user.franchiseId,
          partnerType: user.role, // for UI clarity
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/set-password
// @desc    Set password for franchise or channel partner user
// @access  Private (Franchise Partner + Channel Partner Only)
router.post(
  "/set-password",
  [checkAuth, body("password").isLength({ min: 6 })],
  async (req, res) => {
    try {
      if (
        req.user.role !== "franchise_partner" &&
        req.user.role !== "channel_partner"
      ) {
        return res
          .status(403)
          .json({ message: "Only partner accounts can set password" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password } = req.body;
      const user = await User.findById(req.user._id);
      user.password = password;
      await user.save();

      res.json({ message: "Password set successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
