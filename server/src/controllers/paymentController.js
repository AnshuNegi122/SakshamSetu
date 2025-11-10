const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

/**
 * Mock Razorpay payment success
 */
const mockPayment = async (req, res, next) => {
  try {
    const {
      plan,
      amount,
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const donorId = req.user._id;

    // Create payment record with success status (mock)
    const payment = new Payment({
      donorId,
      plan,
      amount,
      status: 'Success',
      paymentId: paymentId || `MOCK_${Date.now()}`,
      razorpayOrderId: razorpayOrderId || `ORDER_${Date.now()}`,
      razorpayPaymentId: razorpayPaymentId || `PAY_${Date.now()}`,
      razorpaySignature: razorpaySignature || `SIG_${Date.now()}`,
      metadata: {
        mock: 'true',
        timestamp: new Date().toISOString(),
      },
    });

    await payment.save();

    // Create notification
    await Notification.create({
      userId: donorId,
      title: 'Payment Successful',
      message: `Your payment of ₹${amount} for ${plan} has been processed successfully.`,
      type: 'Success',
    });

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully (mock)',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  mockPayment,
};

