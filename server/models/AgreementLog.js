const mongoose = require('mongoose');

const agreementLogSchema = new mongoose.Schema({
  franchiseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise',
    required: true
  },
  agreementVersion: {
    type: String,
    default: '1.0'
  },
  acceptedAt: {
    type: Date,
    required: true
  },
  signatureData: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  pdfUrl: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('AgreementLog', agreementLogSchema);

