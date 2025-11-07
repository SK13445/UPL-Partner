const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema({
  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FranchiseEnquiry",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  franchiseCode: {
    type: String,
    unique: true,
    required: true,
  },

  // ✅ Add Partner Type Here
  partnerType: {
    type: String,
    enum: ["franchise_partner", "channel_partner"],
    default: "franchise_partner",
  },

  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  businessName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: "India",
    },
  },
  idProof: {
    type: {
      type: String,
      enum: ["aadhar", "pan", "passport", "driving_license"],
    },
    number: String,
    documentUrl: String,
  },
  businessDetails: {
    type: String,
    trim: true,
  },
  profileStatus: {
    type: String,
    enum: ["incomplete", "complete"],
    default: "incomplete",
  },
  agreementStatus: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  agreementAcceptedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

franchiseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Franchise", franchiseSchema);
