# Quick Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher) - Make sure MongoDB is running locally

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env` File

Create a `.env` file in the `server` directory with the following content:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/sakshamsetu

# Server Port
PORT=4000

# JWT Secrets (Change these in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS Origin
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development
```

**Important**: Replace the JWT secrets with strong, random strings in production!

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows**:
```bash
mongod
```

**macOS/Linux**:
```bash
sudo systemctl start mongod
# or
mongod
```

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

### 5. Verify Installation

Open your browser or use curl to test:

```bash
curl http://localhost:4000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "SakshamSetu API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "PwD",
    "location": "Mumbai",
    "disabilityType": "Visual",
    "consent": true
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

### 3. Get Profile (Protected Route)

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Common Issues

### MongoDB Connection Error

- Make sure MongoDB is running: `mongod` or `sudo systemctl start mongod`
- Check if `MONGO_URI` in `.env` is correct
- Verify MongoDB is accessible on the default port (27017)

### Port Already in Use

- Change `PORT` in `.env` file to a different port (e.g., 4001)
- Or stop the process using port 4000

### JWT Error

- Make sure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`
- Use strong, random strings (at least 32 characters)

### CORS Error

- Verify `CORS_ORIGIN` in `.env` matches your frontend URL
- Default is `http://localhost:3000`

## Next Steps

1. Connect your frontend to `http://localhost:4000/api`
2. Use the `accessToken` from login/register in the `Authorization` header
3. Test all endpoints as per the API documentation in README.md

## Database

The database will be automatically created when you first run the server. All collections (users, requests, supports, payments, etc.) will be created automatically when data is inserted.

## Production Deployment

Before deploying to production:

1. Change all JWT secrets to strong, random values
2. Set `NODE_ENV=production`
3. Use a secure MongoDB connection (MongoDB Atlas recommended)
4. Configure proper CORS origins
5. Enable HTTPS
6. Set up proper logging and monitoring
7. Use environment-specific configuration

