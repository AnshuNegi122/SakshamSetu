const PwDRequest = require('../models/PwDRequest');
const User = require('../models/User');
const Support = require('../models/Support');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

/**
 * Explore anonymized region-wise needs
 */
const exploreNeeds = async (req, res, next) => {
  try {
    // Get requests that are pending or approved, grouped by region
    // Explicitly exclude Verified, Delivered, and InProgress requests
    // Donors should only see requests available for support
    const requests = await PwDRequest.find({
      status: { $in: ['Pending', 'Approved'] },
    })
      .select('-requestedBy -description') // Anonymize
      .populate({
        path: 'requestedBy',
        select: 'location disabilityType', // Only show location and disability type
      })
      .sort({ createdAt: -1 });

    // Group by region and device type
    const groupedNeeds = requests.reduce((acc, request) => {
      const region = request.region || 'Unknown';
      const deviceType = request.deviceType;

      if (!acc[region]) {
        acc[region] = {};
      }
      if (!acc[region][deviceType]) {
        acc[region][deviceType] = {
          count: 0,
          requests: [],
        };
      }

      acc[region][deviceType].count++;
      acc[region][deviceType].requests.push({
        id: request._id,
        aidName: request.aidName,
        priority: request.priority,
        status: request.status,
        createdAt: request.createdAt,
        // Anonymized user info
        location: request.requestedBy?.location,
        disabilityType: request.requestedBy?.disabilityType,
      });

      return acc;
    }, {});

    res.json({
      success: true,
      data: { needs: groupedNeeds, total: requests.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mock subscription/payment purchase
 */
const purchaseSubscription = async (req, res, next) => {
  try {
    const { plan, amount, planId } = req.body;
    const donorId = req.user._id;
    const donorEmail = req.user.email;

    // Use planId if provided, otherwise use plan
    const planName = planId || plan || 'Standard Plan';

    // Create payment record
    const payment = new Payment({
      donorId,
      plan: planName,
      amount: amount || 999,
      status: 'Success', // Mock payment always succeeds
      paymentId: `MOCK_${Date.now()}`,
      razorpayOrderId: `ORDER_${Date.now()}`,
      razorpayPaymentId: `PAY_${Date.now()}`,
    });

    await payment.save();

    // Log payment
    console.log(`${donorEmail} purchased plan ${planName} for ₹${amount || 999}`);

    // Create notification
    await Notification.create({
      userId: donorId,
      title: 'Subscription Purchased',
      message: `Your ${planName} subscription has been activated successfully. Access to verified PwDs granted.`,
      type: 'Success',
    });

    res.status(201).json({
      success: true,
      message: 'Payment successful! Access to verified PwDs granted.',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of verified PwDs (beneficiaries)
 */
const getBeneficiaries = async (req, res, next) => {
  try {
    // Get verified PwD users who have given consent
    const beneficiaries = await User.find({
      role: 'PwD',
      udidVerified: true,
      consent: true,
      isActive: true,
    }).select('name location disabilityType udidVerified');

    res.json({
      success: true,
      count: beneficiaries.length,
      data: { beneficiaries },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start supporting a request
 */
const startSupport = async (req, res, next) => {
  try {
    const { requestId, amount, notes } = req.body;
    const donorId = req.user._id;

    // Check if request exists
    const request = await PwDRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Check if request is supportable
    if (!['Pending', 'Approved'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot support request with status: ${request.status}`,
      });
    }

    // Check if already supporting
    const existingSupport = await Support.findOne({
      donorId,
      requestId,
      status: { $ne: 'Cancelled' },
    });

    if (existingSupport) {
      return res.status(400).json({
        success: false,
        message: 'You are already supporting this request',
      });
    }

    // Create support
    const support = new Support({
      donorId,
      requestId,
      amount: amount || 0,
      notes,
      status: 'Initiated',
    });

    await support.save();

    // Update request status if pending
    if (request.status === 'Pending') {
      request.status = 'Approved';
      await request.save();
    }

    // Create notifications
    await Notification.create({
      userId: donorId,
      title: 'Support Initiated',
      message: `You have started supporting request for ${request.aidName}.`,
      type: 'Success',
    });

    await Notification.create({
      userId: request.requestedBy,
      title: 'Support Received',
      message: `A donor has started supporting your request for ${request.aidName}.`,
      type: 'Success',
    });

    res.status(201).json({
      success: true,
      message: 'Support started successfully',
      data: { support },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve/Mark support as delivered
 */
const approveSupport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const donorId = req.user._id;

    const support = await Support.findById(id).populate('requestId');
    if (!support) {
      return res.status(404).json({
        success: false,
        message: 'Support not found',
      });
    }

    // Check if support belongs to donor
    if (support.donorId.toString() !== donorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to approve this support',
      });
    }

    // Update status
    support.status = 'Delivered';
    support.deliveredAt = new Date();
    await support.save();

    // Update request status
    if (support.requestId) {
      const request = await PwDRequest.findById(support.requestId._id || support.requestId);
      if (request && request.status !== 'Delivered' && request.status !== 'Verified') {
        request.status = 'Delivered';
        request.deliveredAt = new Date();
        await request.save();

        // Notify PwD
        await Notification.create({
          userId: request.requestedBy,
          title: 'Device Delivered',
          message: `Your requested ${request.aidName} has been delivered. Please verify.`,
          type: 'Success',
        });
      }
    }

    res.json({
      success: true,
      message: 'Support marked as delivered',
      data: { support },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all supports with statuses for donor
 */
const getSupportStatus = async (req, res, next) => {
  try {
    const donorId = req.user._id;
    const { status } = req.query;

    const query = { donorId };
    if (status) {
      query.status = status;
    }

    const supports = await Support.find(query)
      .populate({
        path: 'requestId',
        select: 'deviceType aidName status priority region',
        populate: {
          path: 'requestedBy',
          select: 'name location disabilityType',
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: supports.length,
      data: { supports },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get supported PwDs (beneficiaries that donor is supporting)
 */
const getSupportedBeneficiaries = async (req, res, next) => {
  try {
    const donorId = req.user._id;

    const supports = await Support.find({
      donorId,
      status: { $ne: 'Cancelled' },
    })
      .populate({
        path: 'requestId',
        select: 'deviceType aidName status priority region createdAt',
        populate: {
          path: 'requestedBy',
          select: 'name location disabilityType udidVerified',
        },
      })
      .sort({ createdAt: -1 });

    // Format the response
    const supportedPwDs = supports.map((support) => ({
      _id: support._id,
      supportId: support._id,
      requestId: support.requestId?._id,
      name: support.requestId?.requestedBy?.name || 'Unknown',
      location: support.requestId?.requestedBy?.location || support.requestId?.region || 'Unknown',
      disabilityType: support.requestId?.requestedBy?.disabilityType,
      aid: support.requestId?.aidName || 'Not specified',
      status: support.status,
      amount: support.amount,
      deliveredAt: support.deliveredAt,
      createdAt: support.createdAt,
      udidVerified: support.requestId?.requestedBy?.udidVerified || false,
    }));

    res.json({
      success: true,
      count: supportedPwDs.length,
      data: { beneficiaries: supportedPwDs },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exploreNeeds,
  purchaseSubscription,
  getBeneficiaries,
  startSupport,
  approveSupport,
  getSupportStatus,
  getSupportedBeneficiaries,
};

