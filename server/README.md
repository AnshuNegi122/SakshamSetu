# SakshamSetu Backend API

Backend API for SakshamSetu - Assistive Device Platform for Persons with Disabilities (PwD).

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (PwD, Donor, Admin)
- **PwD Dashboard**: Request assistive devices, track requests, confirm delivery
- **Donor Dashboard**: Explore needs, support requests, track donations
- **Admin Dashboard**: User management, request approval, UDID verification, analytics
- **Payment Integration**: Mock Razorpay payment processing
- **Notifications**: Real-time notifications for users
- **Data Privacy**: Consent logging and anonymized data sharing

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens) for authentication
- **bcrypt** for password hashing
- **Zod** for request validation
- **Multer** for file uploads (configured, ready to use)
- **Helmet** for security headers
- **Morgan** for HTTP request logging
- **CORS** for cross-origin resource sharing

## 🛠️ Installation

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```bash
   # Copy the template file
   cp env.template .env
   
   # Or create .env manually with the content from env.template
   ```

4. **Configure `.env` file**:
   ```env
   MONGO_URI=mongodb://localhost:27017/sakshamsetu
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

5. **Start MongoDB** (if not running):
   ```bash
   # Windows
   mongod

   # macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

6. **Run the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── PwDRequest.js        # PwD request model
│   │   ├── Support.js           # Support/donation model
│   │   ├── Payment.js           # Payment model
│   │   ├── ConsentLog.js        # Consent logging model
│   │   └── Notification.js      # Notification model
│   ├── controllers/
│   │   ├── authController.js    # Authentication controllers
│   │   ├── pwdController.js     # PwD dashboard controllers
│   │   ├── donorController.js   # Donor dashboard controllers
│   │   ├── adminController.js   # Admin dashboard controllers
│   │   └── paymentController.js # Payment controllers
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validation.js        # Request validation (Zod)
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   ├── pwdRoutes.js         # PwD routes
│   │   ├── donorRoutes.js       # Donor routes
│   │   ├── adminRoutes.js       # Admin routes
│   │   ├── paymentRoutes.js     # Payment routes
│   │   └── index.js             # Route aggregator
│   ├── utils/
│   │   └── jwt.js               # JWT utility functions
│   └── server.js                # Express server setup
├── env.template                 # Environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### PwD Dashboard (`/api/pwd`)

- `POST /api/pwd/request` - Create assistive device request (Protected, PwD only)
- `GET /api/pwd/request` - List my requests (Protected, PwD only)
- `PATCH /api/pwd/request/:id/confirm` - Mark delivered/verified (Protected, PwD only)

### Donor Dashboard (`/api/donor`)

- `GET /api/donor/explore` - List anonymized region-wise needs (Protected, Donor only)
- `POST /api/donor/purchase` - Mock subscription/payment (Protected, Donor only)
- `GET /api/donor/beneficiaries` - List verified PwDs (Protected, Donor only)
- `POST /api/donor/support` - Start support (Protected, Donor only)
- `PATCH /api/donor/support/:id/approve` - Mark delivered (Protected, Donor only)
- `GET /api/donor/status` - All supports with statuses (Protected, Donor only)

### Admin Dashboard (`/api/admin`)

- `GET /api/admin/users` - List all users (Protected, Admin only)
- `PATCH /api/admin/users/:id/approve` - Verify UDID (Protected, Admin only)
- `GET /api/admin/requests` - All PwD requests (Protected, Admin only)
- `PATCH /api/admin/requests/:id/status` - Update request status (Protected, Admin only)
- `GET /api/admin/analytics` - Stats summary (Protected, Admin only)

### Payment (`/api/payment`)

- `POST /api/payment/mock` - Mock Razorpay payment success (Protected)

### Health Check

- `GET /api/health` - Health check endpoint

## 📝 Request/Response Examples

### Register User

**Request**:
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "PwD",
  "location": "Mumbai",
  "disabilityType": "Visual",
  "udidNumber": "UDID123456",
  "consent": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "PwD",
      "location": "Mumbai",
      "udidVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Request**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create PwD Request

**Request**:
```http
POST /api/pwd/request
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "deviceType": "Mobility Aid",
  "aidName": "Wheelchair",
  "description": "Manual wheelchair for daily use",
  "priority": "High",
  "region": "Mumbai"
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

The token is obtained from the login or register endpoint.

## 🗄️ Database Models

### User
- `name`, `email`, `passwordHash`, `role`, `location`
- `disabilityType`, `udidNumber`, `udidVerified`, `consent`
- `isActive`, `createdAt`, `updatedAt`

### PwDRequest
- `requestedBy`, `deviceType`, `aidName`, `status`
- `description`, `priority`, `region`
- `deliveredAt`, `verifiedAt`, `createdAt`, `updatedAt`

### Support
- `donorId`, `requestId`, `status`, `amount`, `notes`
- `deliveredAt`, `completedAt`, `createdAt`, `updatedAt`

### Payment
- `donorId`, `plan`, `amount`, `status`
- `paymentId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
- `metadata`, `createdAt`, `updatedAt`

### ConsentLog
- `pwdId`, `granted`, `grantedTo`, `consentType`
- `at`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt`

### Notification
- `userId`, `title`, `message`, `read`, `type`, `link`
- `createdAt`, `updatedAt`

## 🧪 Testing

You can test the API using tools like:
- **Postman**
- **Insomnia**
- **cURL**
- **Thunder Client** (VS Code extension)

## 🔧 Development

- **Hot reload**: Uses `nodemon` for automatic server restart on file changes
- **Environment variables**: Configure via `.env` file
- **Logging**: Morgan middleware logs all HTTP requests
- **Error handling**: Global error handler with detailed error messages

## 📌 Notes

- Passwords are automatically hashed using bcrypt before saving
- JWT tokens expire after 7 days (configurable via `JWT_EXPIRE`)
- Refresh tokens expire after 30 days (configurable via `JWT_REFRESH_EXPIRE`)
- CORS is enabled for `http://localhost:3000` by default
- All requests are validated using Zod schemas
- Error responses follow a consistent format

## 🐛 Troubleshooting

1. **MongoDB Connection Error**: Make sure MongoDB is running and `MONGO_URI` is correct
2. **Port Already in Use**: Change `PORT` in `.env` file
3. **JWT Error**: Check if `JWT_SECRET` is set in `.env`
4. **CORS Error**: Verify `CORS_ORIGIN` matches your frontend URL

## 📄 License

ISC

## 👥 Contributors

SakshamSetu Team

