/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = { message, statusCode: 400 };
  }

  // Multer error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = { message: 'File too large. Maximum size is 5MB.', statusCode: 400 };
    } else {
      error = { message: err.message || 'File upload error', statusCode: 400 };
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

