const mongoose = require('mongoose');

const pwdRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requested by is required'],
    },
    deviceType: {
      type: String,
      required: [true, 'Device type is required'],
      trim: true,
    },
    aidName: {
      type: String,
      required: [true, 'Aid name is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'InProgress', 'Delivered', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    region: {
      type: String,
      trim: true,
    },
    deliveredAt: {
      type: Date,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
pwdRequestSchema.index({ requestedBy: 1, status: 1 });
pwdRequestSchema.index({ status: 1, region: 1 });

module.exports = mongoose.model('PwDRequest', pwdRequestSchema);

