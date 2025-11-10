const mongoose = require('mongoose');

const consentLogSchema = new mongoose.Schema(
  {
    pwdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'PwD ID is required'],
    },
    granted: {
      type: Boolean,
      required: [true, 'Granted status is required'],
    },
    grantedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    consentType: {
      type: String,
      enum: ['Data', 'Contact', 'Location'],
      default: 'Data',
    },
    at: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
consentLogSchema.index({ pwdId: 1, at: -1 });

module.exports = mongoose.model('ConsentLog', consentLogSchema);

