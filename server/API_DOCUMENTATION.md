# API Documentation

Complete API documentation for SakshamSetu Backend.

## Base URL

```
http://localhost:4000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "PwD" | "Donor" | "Admin",
    "location": "string",
    "disabilityType": "string" (optional, required for PwD),
    "udidNumber": "string" (optional, for PwD),
    "consent": "boolean" (optional)
  }
  ```
- **Response**: User object + accessToken + refreshToken

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object + accessToken + refreshToken

#### Get Profile
- **GET** `/api/auth/me`
- **Auth**: Required
- **Response**: User object

#### Logout
- **POST** `/api/auth/logout`
- **Auth**: Required
- **Response**: Success message

---

### PwD Routes (`/api/pwd`)

All routes require PwD role.

#### Create Request
- **POST** `/api/pwd/request`
- **Auth**: Required (PwD)
- **Body**:
  ```json
  {
    "deviceType": "string",
    "aidName": "string",
    "description": "string" (optional),
    "priority": "Low" | "Medium" | "High" (optional),
    "region": "string" (optional)
  }
  ```
- **Response**: Request object

#### Get My Requests
- **GET** `/api/pwd/request`
- **Auth**: Required (PwD)
- **Query Params**: `status` (optional)
- **Response**: Array of requests

#### Confirm Delivery
- **PATCH** `/api/pwd/request/:id/confirm`
- **Auth**: Required (PwD)
- **Response**: Updated request object

---

### Donor Routes (`/api/donor`)

All routes require Donor role.

#### Explore Needs
- **GET** `/api/donor/explore`
- **Auth**: Required (Donor)
- **Response**: Anonymized region-wise needs

#### Purchase Subscription
- **POST** `/api/donor/purchase`
- **Auth**: Required (Donor)
- **Body**:
  ```json
  {
    "plan": "string",
    "amount": "number"
  }
  ```
- **Response**: Payment object

#### Get Beneficiaries
- **GET** `/api/donor/beneficiaries`
- **Auth**: Required (Donor)
- **Response**: Array of verified PwD users

#### Start Support
- **POST** `/api/donor/support`
- **Auth**: Required (Donor)
- **Body**:
  ```json
  {
    "requestId": "string",
    "amount": "number" (optional),
    "notes": "string" (optional)
  }
  ```
- **Response**: Support object

#### Approve Support
- **PATCH** `/api/donor/support/:id/approve`
- **Auth**: Required (Donor)
- **Response**: Updated support object

#### Get Support Status
- **GET** `/api/donor/status`
- **Auth**: Required (Donor)
- **Query Params**: `status` (optional)
- **Response**: Array of supports

---

### Admin Routes (`/api/admin`)

All routes require Admin role.

#### Get All Users
- **GET** `/api/admin/users`
- **Auth**: Required (Admin)
- **Query Params**: `role`, `udidVerified`, `isActive` (all optional)
- **Response**: Array of users

#### Approve UDID
- **PATCH** `/api/admin/users/:id/approve`
- **Auth**: Required (Admin)
- **Response**: Updated user object

#### Get All Requests
- **GET** `/api/admin/requests`
- **Auth**: Required (Admin)
- **Query Params**: `status`, `region`, `deviceType` (all optional)
- **Response**: Array of requests

#### Update Request Status
- **PATCH** `/api/admin/requests/:id/status`
- **Auth**: Required (Admin)
- **Body**:
  ```json
  {
    "status": "Pending" | "Approved" | "InProgress" | "Delivered" | "Verified" | "Rejected"
  }
  ```
- **Response**: Updated request object

#### Get Analytics
- **GET** `/api/admin/analytics`
- **Auth**: Required (Admin)
- **Response**: Analytics data (users, requests, supports, payments, distributions, recent activity)

---

### Payment Routes (`/api/payment`)

#### Mock Payment
- **POST** `/api/payment/mock`
- **Auth**: Required
- **Body**:
  ```json
  {
    "plan": "string",
    "amount": "number",
    "paymentId": "string" (optional),
    "razorpayOrderId": "string" (optional),
    "razorpayPaymentId": "string" (optional),
    "razorpaySignature": "string" (optional)
  }
  ```
- **Response**: Payment object

---

### Health Check

#### Health Check
- **GET** `/api/health`
- **Response**: Health status

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] (optional, for validation errors)
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Models

### User
- `_id`, `name`, `email`, `role`, `location`
- `disabilityType`, `udidNumber`, `udidVerified`, `consent`
- `isActive`, `createdAt`, `updatedAt`

### PwDRequest
- `_id`, `requestedBy`, `deviceType`, `aidName`, `status`
- `description`, `priority`, `region`
- `deliveredAt`, `verifiedAt`, `createdAt`, `updatedAt`

### Support
- `_id`, `donorId`, `requestId`, `status`, `amount`, `notes`
- `deliveredAt`, `completedAt`, `createdAt`, `updatedAt`

### Payment
- `_id`, `donorId`, `plan`, `amount`, `status`
- `paymentId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
- `metadata`, `createdAt`, `updatedAt`

### Notification
- `_id`, `userId`, `title`, `message`, `read`, `type`, `link`
- `createdAt`, `updatedAt`

### ConsentLog
- `_id`, `pwdId`, `granted`, `grantedTo`, `consentType`
- `at`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt`

