const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  confirmDelivery,
  uploadDocument,
  getDonorAccessLogs,
} = require('../controllers/pwdController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, pwdRequestSchema } = require('../middleware/validation');
const upload = require('../middleware/upload');

// All routes require authentication and PwD role
router.use(authenticate);
router.use(authorize('PwD'));

// Create assistive device request
router.post('/request', validate(pwdRequestSchema), createRequest);

// Get all my requests
router.get('/request', getMyRequests);

// Confirm/Verify delivery
router.patch('/request/:id/confirm', confirmDelivery);

// Upload verification document
router.post('/upload-doc', upload.single('file'), uploadDocument);

// Get donor access logs
router.get('/access-logs', getDonorAccessLogs);

module.exports = router;

