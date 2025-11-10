const express = require('express');
const router = express.Router();
const {
  exploreNeeds,
  purchaseSubscription,
  getBeneficiaries,
  startSupport,
  approveSupport,
  getSupportStatus,
  getSupportedBeneficiaries,
} = require('../controllers/donorController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, supportSchema, paymentSchema } = require('../middleware/validation');

// All routes require authentication and Donor role
router.use(authenticate);
router.use(authorize('Donor'));

// Explore anonymized region-wise needs
router.get('/explore', exploreNeeds);

// Mock subscription/payment purchase
router.post('/purchase', validate(paymentSchema), purchaseSubscription);

// Get list of verified PwDs (beneficiaries)
router.get('/beneficiaries', getBeneficiaries);

// Start supporting a request
router.post('/support', validate(supportSchema), startSupport);

// Approve/Mark support as delivered
router.patch('/support/:id/approve', approveSupport);

// Get all supports with statuses
router.get('/status', getSupportStatus);

// Get supported beneficiaries (PwDs the donor is helping)
router.get('/beneficiaries/supported', getSupportedBeneficiaries);

module.exports = router;

