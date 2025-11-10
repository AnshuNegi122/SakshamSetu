const { z } = require('zod');

/**
 * Middleware to validate request body using Zod schemas
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({
          success: false,
          message: 'Validation error: ' + message,
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['PwD', 'Donor', 'Admin']),
  location: z.string().min(2, 'Location is required'),
  disabilityType: z.string().optional(),
  udidNumber: z.string().optional(),
  consent: z.boolean().optional().default(false),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const pwdRequestSchema = z.object({
  deviceType: z.string().min(1, 'Device type is required'),
  aidName: z.string().min(1, 'Aid name is required'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  region: z.string().optional(),
});

const supportSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  notes: z.string().optional(),
});

const paymentSchema = z.object({
  plan: z.string().min(1, 'Plan is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  paymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

const updateRequestStatusSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'InProgress', 'Delivered', 'Verified', 'Rejected']),
});

const updateSupportStatusSchema = z.object({
  status: z.enum(['Initiated', 'Approved', 'InProgress', 'Delivered', 'Completed', 'Cancelled']),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  pwdRequestSchema,
  supportSchema,
  paymentSchema,
  updateRequestStatusSchema,
  updateSupportStatusSchema,
};
