# Scalable Web App with Authentication & Dashboard

A full-stack web application with JWT authentication, user management, and task CRUD operations.

## 🚀 Tech Stack

### Frontend
- **React.js** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form validation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
primo/
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── ...
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & validation middleware
│   │   └── config/        # Configuration files
│   └── ...
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primo
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (if local):
```bash
mongod
```

5. Run backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Run frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?search=keyword&status=pending&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Build the authentication system",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-01-15"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Middleware validation
- **Input Validation**: Server-side validation with express-validator
- **Error Handling**: Centralized error handling middleware
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data in .env files

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Protected Routes**: Authentication required for dashboard
- **Form Validation**: Client-side validation with React Hook Form
- **Loading States**: User feedback during API calls
- **Error Handling**: User-friendly error messages
- **Search & Filter**: Real-time task filtering
- **Pagination**: Efficient data loading

## 📈 Scalability Considerations

### Current Architecture
- Modular code structure for easy maintenance
- Separation of concerns (controllers, services, models)
- RESTful API design
- Token-based authentication (stateless)

### Production Scaling Strategy

#### Backend Scaling
1. **Horizontal Scaling**: Deploy multiple instances behind a load balancer (NGINX/AWS ALB)
2. **Database**: 
   - Use MongoDB Atlas with replica sets
   - Implement connection pooling
   - Add Redis for caching and session management
3. **API Gateway**: Kong or AWS API Gateway for rate limiting, caching
4. **Containerization**: Docker + Kubernetes for orchestration
5. **Monitoring**: Add logging (Winston), APM (New Relic/DataDog)

#### Frontend Scaling
1. **CDN**: Serve static assets via CloudFront/Cloudflare
2. **Code Splitting**: Lazy loading for routes
3. **State Management**: Add Redux/Zustand for complex state
4. **SSR/SSG**: Migrate to Next.js for better SEO and performance
5. **Build Optimization**: Tree shaking, minification, compression

#### Infrastructure
1. **CI/CD**: GitHub Actions for automated testing and deployment
2. **Environment Management**: Dev, Staging, Production environments
3. **Database Migrations**: Implement migration strategy
4. **Backup Strategy**: Automated database backups
5. **Security**: WAF, DDoS protection, security headers

#### Microservices Evolution
- Separate auth service
- Dedicated task management service
- User service
- Notification service
- API Gateway pattern

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment Options
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2/ECS**: More control and scalability
- **DigitalOcean App Platform**: Simplified deployment
- **Railway/Render**: Modern deployment platforms

### Frontend Deployment Options
- **Vercel**: Optimized for React/Vite
- **Netlify**: Easy deployment with CI/CD
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting option

## 🔄 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social authentication (Google, GitHub)
- [ ] Real-time notifications (Socket.io)
- [ ] File upload functionality
- [ ] Task collaboration features
- [ ] Analytics dashboard
- [ ] Export data functionality
- [ ] Dark mode support
- [ ] Multi-language support

## 👤 Author

Built as a demonstration of full-stack development skills.

## 📄 License

MIT License
