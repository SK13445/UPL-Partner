const mongoose = require('mongoose');

const franchiseEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'hr_approved', 'hr_rejected', 'operational_approved', 'operational_rejected', 'approved', 'rejected'],
    default: 'pending'
  },
  hrNotes: {
    type: String,
    default: ''
  },
  operationalNotes: {
    type: String,
    default: ''
  },
  hrApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  operationalApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  hrApprovedAt: {
    type: Date,
    default: null
  },
  operationalApprovedAt: {
    type: Date,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FranchiseEnquiry', franchiseEnquirySchema);

