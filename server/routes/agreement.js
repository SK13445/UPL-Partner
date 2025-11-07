const express = require("express");
const Franchise = require("../models/Franchise");
const AgreementLog = require("../models/AgreementLog");
const { checkAuth, checkRole } = require("../middleware/auth");
const { generateAgreementPDF } = require("../utils/pdfGenerator");

const router = express.Router();

// @route   POST /api/agreement/accept
// @desc    Accept agreement
// @access  Private (Franchise)
router.post(
  "/accept",
  checkAuth,
  checkRole("franchise_partner"),
  async (req, res) => {
    try {
      const franchise = await Franchise.findOne({ userId: req.user._id });
      if (!franchise) {
        return res.status(404).json({ message: "Franchise not found" });
      }

      if (franchise.profileStatus !== "complete") {
        return res
          .status(400)
          .json({ message: "Please complete your profile first" });
      }

      if (franchise.agreementStatus === "accepted") {
        return res.status(400).json({ message: "Agreement already accepted" });
      }

      // Update franchise agreement status
      franchise.agreementStatus = "accepted";
      franchise.agreementAcceptedAt = new Date();
      await franchise.save();

      // Log agreement acceptance
      const agreementLog = new AgreementLog({
        franchiseId: franchise._id,
        acceptedAt: new Date(),
        signatureData: req.body.signatureData || null,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
      });
      await agreementLog.save();

      res.json({
        message: "Agreement accepted successfully",
        franchise,
      });
    } catch (error) {
      console.error("Accept agreement error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/agreement/print/:id
// @desc    Generate and return agreement PDF
// @access  Private (Franchise, Admin, Operational Head)
router.get("/print/:id", checkAuth, async (req, res) => {
  try {
    let franchise;

    if (req.user.role === "franchise_partner") {
      franchise = await Franchise.findOne({ userId: req.user._id });
    } else {
      franchise = await Franchise.findById(req.params.id);
    }

    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    if (franchise.agreementStatus !== "accepted") {
      return res
        .status(400)
        .json({ message: "Agreement must be accepted before printing" });
    }

    // Generate PDF
    const pdfBuffer = await generateAgreementPDF(franchise);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Agreement-${franchise.franchiseCode}.pdf"`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generate agreement PDF error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/agreement/status
// @desc    Get agreement status
// @access  Private (Franchise)
router.get(
  "/status",
  checkAuth,
  checkRole("franchise_partner"),
  async (req, res) => {
    try {
      const franchise = await Franchise.findOne({ userId: req.user._id });
      if (!franchise) {
        return res.status(404).json({ message: "Franchise not found" });
      }

      res.json({
        agreementStatus: franchise.agreementStatus,
        agreementAcceptedAt: franchise.agreementAcceptedAt,
        profileStatus: franchise.profileStatus,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
