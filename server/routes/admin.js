const express = require("express");
const User = require("../models/User");
const FranchiseEnquiry = require("../models/FranchiseEnquiry");
const Franchise = require("../models/Franchise");
const { checkAuth, checkRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin, Operational Head)
router.get(
  "/dashboard",
  checkAuth,
  checkRole("admin", "operational_head"),
  async (req, res) => {
    try {
      const totalEnquiries = await FranchiseEnquiry.countDocuments();
      const pendingEnquiries = await FranchiseEnquiry.countDocuments({
        status: "pending",
      });
      const approvedEnquiries = await FranchiseEnquiry.countDocuments({
        status: "approved",
      });
      const totalFranchises = await Franchise.countDocuments();
      const activeFranchises = await Franchise.countDocuments({
        agreementStatus: "accepted",
      });
      const totalUsers = await User.countDocuments();

      // Status breakdown
      const statusBreakdown = await FranchiseEnquiry.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      res.json({
        statistics: {
          totalEnquiries,
          pendingEnquiries,
          approvedEnquiries,
          totalFranchises,
          activeFranchises,
          totalUsers,
        },
        statusBreakdown,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin,Operational Head)
router.get(
  "/users",
  checkAuth,
  checkRole("admin,operational_head"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
