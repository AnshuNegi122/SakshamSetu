const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  approveUDID,
  getAllRequests,
  updateRequestStatus,
  getAnalytics,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, updateRequestStatusSchema } = require('../middleware/validation');

// All routes require authentication and Admin role
router.use(authenticate);
router.use(authorize('Admin'));

// Get all users
router.get('/users', getAllUsers);

// Approve/Verify UDID for a PwD user
router.patch('/users/:id/approve', approveUDID);

// Get all PwD requests
router.get('/requests', getAllRequests);

// Update request status
router.patch('/requests/:id/status', validate(updateRequestStatusSchema), updateRequestStatus);

// Get analytics and stats summary
router.get('/analytics', getAnalytics);

// Get pending verifications
router.get('/verifications', getPendingVerifications);

// Approve verification
router.patch('/verifications/:userId/approve', approveVerification);

// Reject verification
router.patch('/verifications/:userId/reject', rejectVerification);

module.exports = router;

