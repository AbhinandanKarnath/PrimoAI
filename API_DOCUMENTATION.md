# API Documentation

Complete API reference for the Primo application.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.primo.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters, must contain uppercase, lowercase, and number

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-01-10T10:00:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### Login User

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-01-10T10:00:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

Get the currently authenticated user's information.

**Endpoint:** `GET /auth/me`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null,
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T10:00:00.000Z"
  }
}
```

---

### Logout

Logout the current user (client-side token removal).

**Endpoint:** `POST /auth/logout`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Profile Endpoints

### Get User Profile

Get detailed profile information.

**Endpoint:** `GET /users/profile`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null,
    "isActive": true,
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T12:00:00.000Z"
  }
}
```

---

### Update User Profile

Update user profile information.

**Endpoint:** `PUT /users/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Validation Rules:**
- `name`: Optional, 2-50 characters
- `email`: Optional, valid email format, must be unique

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.new@example.com",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "updatedAt": "2026-01-10T14:00:00.000Z"
  }
}
```

---

### Update Password

Change user password.

**Endpoint:** `PUT /users/password`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Task Endpoints

### Get All Tasks

Retrieve all tasks for the authenticated user with optional filtering, searching, and pagination.

**Endpoint:** `GET /tasks`

**Authentication:** Required

**Query Parameters:**
- `search` (string): Search in title and description
- `status` (string): Filter by status (`pending`, `in-progress`, `completed`, `cancelled`)
- `priority` (string): Filter by priority (`low`, `medium`, `high`, `urgent`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortBy` (string): Sort field (default: `createdAt`)
- `order` (string): Sort order (`asc`, `desc`, default: `desc`)

**Example Request:**
```
GET /tasks?search=project&status=pending&priority=high&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-01-15T00:00:00.000Z",
      "tags": ["documentation", "project"],
      "user": "507f1f77bcf86cd799439010",
      "completedAt": null,
      "createdAt": "2026-01-10T10:00:00.000Z",
      "updatedAt": "2026-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### Get Single Task

Retrieve a specific task by ID.

**Endpoint:** `GET /tasks/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-01-15T00:00:00.000Z",
    "tags": ["documentation", "project"],
    "user": "507f1f77bcf86cd799439010",
    "completedAt": null,
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### Create Task

Create a new task.

**Endpoint:** `POST /tasks`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-01-15T00:00:00.000Z",
  "tags": ["documentation", "project"]
}
```

**Validation Rules:**
- `title`: Required, 3-100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, one of: `pending`, `in-progress`, `completed`, `cancelled`
- `priority`: Optional, one of: `low`, `medium`, `high`, `urgent`
- `dueDate`: Optional, valid ISO 8601 date
- `tags`: Optional, array of strings

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-01-15T00:00:00.000Z",
    "tags": ["documentation", "project"],
    "user": "507f1f77bcf86cd799439010",
    "completedAt": null,
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T10:00:00.000Z"
  }
}
```

---

### Update Task

Update an existing task.

**Endpoint:** `PUT /tasks/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Task ID

**Request Body:**
```json
{
  "title": "Updated task title",
  "status": "completed",
  "priority": "medium"
}
```

**Note:** You can update any fields. The completedAt timestamp is automatically set when status changes to "completed".

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated task title",
    "description": "Write comprehensive API documentation",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2026-01-15T00:00:00.000Z",
    "tags": ["documentation", "project"],
    "user": "507f1f77bcf86cd799439010",
    "completedAt": "2026-01-10T14:00:00.000Z",
    "createdAt": "2026-01-10T10:00:00.000Z",
    "updatedAt": "2026-01-10T14:00:00.000Z"
  }
}
```

---

### Delete Task

Delete a task.

**Endpoint:** `DELETE /tasks/:id`

**Authentication:** Required

**URL Parameters:**
- `id`: Task ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {}
}
```

---

### Get Task Statistics

Get aggregated statistics about tasks.

**Endpoint:** `GET /tasks/stats`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "byStatus": [
      { "_id": "pending", "count": 10 },
      { "_id": "in-progress", "count": 8 },
      { "_id": "completed", "count": 5 },
      { "_id": "cancelled", "count": 2 }
    ],
    "byPriority": [
      { "_id": "low", "count": 5 },
      { "_id": "medium", "count": 10 },
      { "_id": "high", "count": 7 },
      { "_id": "urgent", "count": 3 }
    ]
  }
}
```

---

## Health Check

### Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-10T10:00:00.000Z"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP address
- **Response Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Rate Limit Exceeded Response (429):**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

---

## Error Codes

### Validation Errors (400)

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Authentication Errors (401)

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Authorization Errors (403)

```json
{
  "success": false,
  "message": "User role user is not authorized to access this route"
}
```

### Not Found Errors (404)

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

### Get Tasks (with auth)
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "high"
  }'
```

---

## Postman Collection

Import the Postman collection from `backend/Primo_API_Collection.postman_collection.json` to test all endpoints easily.

### Setup Postman Variables
1. `BASE_URL`: `http://localhost:5000`
2. `TOKEN`: Your JWT token (obtained from login/register)

---

## WebSocket Support (Future)

Real-time updates will be added in future versions using Socket.io for:
- Live task updates
- Notifications
- Collaboration features
