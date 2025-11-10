const User = require('../models/User');
const PwDRequest = require('../models/PwDRequest');
const Support = require('../models/Support');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, udidVerified, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (udidVerified !== undefined) query.udidVerified = udidVerified === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve/Verify UDID for a PwD user
 */
const approveUDID = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'PwD') {
      return res.status(400).json({
        success: false,
        message: 'User is not a PwD',
      });
    }

    if (!user.udidNumber) {
      return res.status(400).json({
        success: false,
        message: 'User does not have UDID number',
      });
    }

    user.udidVerified = true;
    await user.save();

    // Create notification
    await Notification.create({
      userId: user._id,
      title: 'UDID Verified',
      message: 'Your UDID has been verified by the admin. You can now access all features.',
      type: 'Success',
    });

    res.json({
      success: true,
      message: 'UDID verified successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all PwD requests
 */
const getAllRequests = async (req, res, next) => {
  try {
    const { status, region, deviceType } = req.query;

    const query = {};
    if (status) query.status = status;
    if (region) query.region = region;
    if (deviceType) query.deviceType = deviceType;

    const requests = await PwDRequest.find(query)
      .populate('requestedBy', 'name email location disabilityType udidNumber udidVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update request status
 */
const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await PwDRequest.findById(id).populate('requestedBy');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    const oldStatus = request.status;
    request.status = status;

    // Update timestamps based on status
    if (status === 'Delivered') {
      request.deliveredAt = new Date();
    } else if (status === 'Verified') {
      request.verifiedAt = new Date();
    }

    await request.save();

    // Create notification for PwD
    if (request.requestedBy) {
      await Notification.create({
        userId: request.requestedBy._id,
        title: 'Request Status Updated',
        message: `Your request for ${request.aidName} status has been updated from ${oldStatus} to ${status}.`,
        type: 'Info',
      });
    }

    res.json({
      success: true,
      message: 'Request status updated successfully',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get analytics and stats summary
 */
const getAnalytics = async (req, res, next) => {
  try {
    // Get user counts
    const totalUsers = await User.countDocuments();
    const pwdUsers = await User.countDocuments({ role: 'PwD' });
    const donorUsers = await User.countDocuments({ role: 'Donor' });
    const verifiedPwD = await User.countDocuments({ role: 'PwD', udidVerified: true });

    // Get request counts
    const totalRequests = await PwDRequest.countDocuments();
    const pendingRequests = await PwDRequest.countDocuments({ status: 'Pending' });
    const approvedRequests = await PwDRequest.countDocuments({ status: 'Approved' });
    const deliveredRequests = await PwDRequest.countDocuments({ status: 'Delivered' });
    const verifiedRequests = await PwDRequest.countDocuments({ status: 'Verified' });

    // Get support counts
    const totalSupports = await Support.countDocuments();
    const activeSupports = await Support.countDocuments({ status: { $in: ['Initiated', 'Approved', 'InProgress'] } });
    const completedSupports = await Support.countDocuments({ status: 'Completed' });

    // Get payment stats
    const totalPayments = await Payment.countDocuments({ status: 'Success' });
    const totalAmount = await Payment.aggregate([
      { $match: { status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalAmount.length > 0 ? totalAmount[0].total : 0;

    // Get requests by region
    const requestsByRegion = await PwDRequest.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get requests by device type
    const requestsByDeviceType = await PwDRequest.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRequests = await PwDRequest.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentSupports = await Support.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          pwd: pwdUsers,
          donor: donorUsers,
          verifiedPwD,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          delivered: deliveredRequests,
          verified: verifiedRequests,
        },
        supports: {
          total: totalSupports,
          active: activeSupports,
          completed: completedSupports,
        },
        payments: {
          total: totalPayments,
          revenue: totalRevenue,
        },
        distribution: {
          byRegion: requestsByRegion,
          byDeviceType: requestsByDeviceType,
        },
        recentActivity: {
          requests: recentRequests,
          supports: recentSupports,
          users: recentUsers,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending verifications
 */
const getPendingVerifications = async (req, res, next) => {
  try {
    const users = await User.find({
      role: 'PwD',
      verificationStatus: { $in: ['Pending', 'Approved', 'Rejected'] },
    })
      .select('name email verificationStatus verificationDoc udidNumber location disabilityType createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve verification
 */
const approveVerification = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: 'Approved',
        udidVerified: true,
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create notification for user
    await Notification.create({
      userId: user._id,
      title: 'Verification Approved',
      message: 'Your verification document has been approved. Your UDID is now verified.',
      type: 'Success',
    });

    res.json({
      success: true,
      message: 'User verified successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject verification
 */
const rejectVerification = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: 'Rejected',
        udidVerified: false,
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create notification for user
    await Notification.create({
      userId: user._id,
      title: 'Verification Rejected',
      message: 'Your verification document has been rejected. Please upload a valid document.',
      type: 'Error',
    });

    res.json({
      success: true,
      message: 'Verification rejected',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  approveUDID,
  getAllRequests,
  updateRequestStatus,
  getAnalytics,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
};

