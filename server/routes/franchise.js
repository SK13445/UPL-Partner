const express = require("express");
const { body, validationResult } = require("express-validator");
const FranchiseEnquiry = require("../models/FranchiseEnquiry");
const Franchise = require("../models/Franchise");
const User = require("../models/User");
const { checkAuth, checkRole } = require("../middleware/auth");
const {
  generateFranchiseCode,
  createFranchiseAccount,
} = require("../utils/franchiseUtils");

const router = express.Router();

// @route   POST /api/franchise/enquiry
// @desc    Submit franchise enquiry
// @access  Public
router.post(
  "/enquiry",
  [
    body("name").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("phone").notEmpty().trim(),
    body("location").notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const enquiry = new FranchiseEnquiry(req.body);
      await enquiry.save();

      res.status(201).json({
        message: "Enquiry submitted successfully",
        enquiry: {
          id: enquiry._id,
          name: enquiry.name,
          email: enquiry.email,
          status: enquiry.status,
        },
      });
    } catch (error) {
      console.error("Enquiry submission error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/franchise/enquiry/pending
// @desc    Get pending enquiries
// @access  Private (HR, Admin, Operational Head)
router.get(
  "/enquiry/pending",
  checkAuth,
  checkRole("hr", "admin", "operational_head"),
  async (req, res) => {
    try {
      const { status, role } = req.query;
      let query = {};

      if (role === "hr") {
        query = { status: "pending" };
      } else if (role === "operational_head") {
        query = { status: "hr_approved" };
      } else if (status) {
        query = { status };
      } else {
        query = {
          status: { $in: ["pending", "hr_approved", "operational_approved"] },
        };
      }

      const enquiries = await FranchiseEnquiry.find(query)
        .sort({ submittedAt: -1 })
        .populate("hrApprovedBy", "name email")
        .populate("operationalApprovedBy", "name email");

      res.json({ enquiries });
    } catch (error) {
      console.error("Fetch enquiries error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/franchise/enquiry/:id
// @desc    Get single enquiry
// @access  Private (HR, Admin, Operational Head)
router.get(
  "/enquiry/:id",
  checkAuth,
  checkRole("hr", "admin", "operational_head"),
  async (req, res) => {
    try {
      const enquiry = await FranchiseEnquiry.findById(req.params.id)
        .populate("hrApprovedBy", "name email")
        .populate("operationalApprovedBy", "name email");

      if (!enquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }

      res.json({ enquiry });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/franchise/create-partner
// @desc    HR manually adds a Franchise or Channel Partner request (awaiting Operational Head approval)
// @access  Private (HR only)
router.post(
  "/create-partner",
  [
    checkAuth,
    checkRole("hr"),
    body("name").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("phone").notEmpty().trim(),
    body("location").notEmpty().trim(),
    body("role").isIn(["franchise_partner", "channel_partner"]),
    body("notes").optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, location, role, notes } = req.body;

      // ✅ Store as enquiry with HR approval but waiting for Operational Head
      const enquiry = await FranchiseEnquiry.create({
        name,
        email,
        phone,
        location,
        hrNotes: notes || "",
        status: "hr_approved",
        hrApprovedBy: req.user._id,
        hrApprovedAt: new Date(),
        partnerType: role,
      });

      return res.json({
        message: "Partner saved. Awaiting approval from Operational Head.",
        enquiry,
      });
    } catch (error) {
      console.error("Manual partner creation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/franchise/list
// @desc    Get all franchises with standardized output
// @access  Private (Admin, Operational Head)
router.get(
  "/list",
  checkAuth,
  checkRole("admin", "operational_head"),
  async (req, res) => {
    try {
      const franchises = await Franchise.find()
        .populate("userId", "name email phone") // correct
        .populate("enquiryId", "name email phone location") // correct
        .sort({ createdAt: -1 })
        .lean();

      const formattedFranchises = franchises.map((f) => ({
        _id: f._id,
        franchiseCode: f.franchiseCode,
        partnerType: f.partnerType,
        businessName: f.businessName || "—",
        ownerName: f.ownerName || f.enquiryId?.name || "—",
        email: f.email || f.userId?.email || f.enquiryId?.email || "—",
        phone: f.phone || f.userId?.phone || f.enquiryId?.phone || "—",
        location: f.address?.city || f.enquiryId?.location || "—",
      }));

      res.json({ franchises: formattedFranchises });
    } catch (error) {
      console.error("Franchise List Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/franchise/create-partner
// @desc    HR can manually create a Franchise Partner or Channel Partner
// @access  Private (HR Only)
router.post(
  "/create-partner",
  [
    checkAuth,
    checkRole("hr"),
    body("name").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("phone").notEmpty().trim(),
    body("location").notEmpty().trim(),
    body("role").isIn(["franchise_partner", "channel_partner"]),
    body("notes").optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, location, role, notes } = req.body;

      // Create Enquiry as auto-approved
      const enquiry = await FranchiseEnquiry.create({
        name,
        email,
        phone,
        location,
        hrNotes: notes || "",
        status: "HR_Created",
        hrApprovedBy: req.user._id,
        hrApprovedAt: new Date(),
        operationalApprovedBy: req.user._id,
        operationalApprovedAt: new Date(),
      });

      return res.json({
        message: "Partner created successfully",
        enquiry,
        partnerAccount: {
          email: user.email,
          franchiseCode: franchise.franchiseCode,
          tempPassword,
        },
      });
    } catch (error) {
      console.error("Manual partner creation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/franchise/approve/:id
// @desc    Approve franchise enquiry step-by-step
// @access  Private (HR, Operational Head)
router.post(
  "/approve/:id",
  checkAuth,
  checkRole("hr", "operational_head"),
  async (req, res) => {
    try {
      const enquiry = await FranchiseEnquiry.findById(req.params.id);

      if (!enquiry) {
        return res.status(404).json({ message: "Enquiry not found" });
      }

      // HR Approval Step
      if (req.user.role === "hr" && enquiry.status === "pending") {
        enquiry.status = "hr_approved";
        enquiry.hrApprovedBy = req.user._id;
        enquiry.hrApprovedAt = new Date();
        await enquiry.save();
        return res.json({ message: "HR approved the enquiry", enquiry });
      }

      // Operational Head Final Approval & Account Creation
      if (
        req.user.role === "operational_head" &&
        enquiry.status === "hr_approved"
      ) {
        enquiry.status = "operational_approved";
        enquiry.operationalApprovedBy = req.user._id;
        enquiry.operationalApprovedAt = new Date();
        await enquiry.save();

        // ✅ Franchise Account Creation
        const franchise = await createFranchiseAccount(
          enquiry,
          enquiry.partnerType
        );

        return res.json({
          message: "Operational Head approved and franchise account created",
          enquiry,
          franchise,
        });
      }

      return res.status(400).json({
        message: "Invalid approval action or approval already completed",
      });
    } catch (error) {
      console.error("Approval error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
