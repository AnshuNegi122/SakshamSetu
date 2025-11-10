const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required'],
    },
    plan: {
      type: String,
      required: [true, 'Plan is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentId: {
      type: String,
      trim: true,
      sparse: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
      sparse: true,
    },
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
paymentSchema.index({ donorId: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);

