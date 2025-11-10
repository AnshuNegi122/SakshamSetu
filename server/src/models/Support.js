const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required'],
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PwDRequest',
      required: [true, 'Request ID is required'],
    },
    status: {
      type: String,
      enum: ['Initiated', 'Approved', 'InProgress', 'Delivered', 'Completed', 'Cancelled'],
      default: 'Initiated',
    },
    amount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
supportSchema.index({ donorId: 1, status: 1 });
supportSchema.index({ requestId: 1 });

module.exports = mongoose.model('Support', supportSchema);

