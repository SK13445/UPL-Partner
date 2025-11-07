const express = require("express");
const { body, validationResult } = require("express-validator");
const Franchise = require("../models/Franchise");
const { checkAuth, checkRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/user/franchise/details
// @desc    Get franchise details
// @access  Private (Franchise)
router.get(
  "/franchise/details",
  checkAuth,
  checkRole("franchise_partner", "channel_partner"),
  async (req, res) => {
    try {
      const franchise = await Franchise.findOne({
        userId: req.user._id,
      }).populate("enquiryId");

      if (!franchise) {
        return res.status(404).json({ message: "Franchise details not found" });
      }

      res.json({ franchise });
    } catch (error) {
      console.error("Fetch franchise details error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   POST /api/user/franchise/submit-details
// @desc    Submit franchise onboarding details
// @access  Private (Franchise)
router.post(
  "/franchise/submit-details",
  [
    checkAuth,
    checkRole("franchise_partner", "channel_partner"),
    body("ownerName").notEmpty().trim(),
    body("businessName").notEmpty().trim(),
    body("address.street").optional().trim(),
    body("address.city").notEmpty().trim(),
    body("address.state").notEmpty().trim(),
    body("address.pincode").optional().trim(),
    body("idProof.type").isIn(["aadhar", "pan", "passport", "driving_license"]),
    body("idProof.number").notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const franchise = await Franchise.findOne({ userId: req.user._id });
      if (!franchise) {
        return res.status(404).json({ message: "Franchise not found" });
      }

      // Update franchise details
      Object.assign(franchise, {
        ownerName: req.body.ownerName,
        businessName: req.body.businessName,
        address: req.body.address,
        idProof: req.body.idProof,
        businessDetails: req.body.businessDetails || "",
        profileStatus: "complete",
      });

      await franchise.save();

      res.json({
        message: "Franchise details submitted successfully",
        franchise,
      });
    } catch (error) {
      console.error("Submit franchise details error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
