# Quick Start Guide

This guide will help you get the Primo application up and running in under 10 minutes.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Clone or Navigate to Project

```bash
cd e:\projects\primo
```

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primo
JWT_SECRET=your_super_secret_jwt_key_here_change_this_immediately
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a random, secure string in production!

### 2.3 Start MongoDB

**Windows (if installed locally):**
```bash
# MongoDB should start automatically if installed as a service
# If not, run:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Or use MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### 2.4 Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

## Step 3: Frontend Setup

Open a **new terminal** window:

### 3.1 Install Frontend Dependencies

```bash
cd e:\projects\primo\frontend
npm install
```

### 3.2 Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
# Copy the example file
copy .env.example .env
```

The file should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.3 Start Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 4: Access the Application

1. Open your browser and navigate to: **http://localhost:5173**
2. You'll be redirected to the login page
3. Click **"Sign up"** to create a new account
4. Fill in the registration form:
   - Name: Your Name
   - Email: your@email.com
   - Password: Must contain uppercase, lowercase, and number (e.g., "Password123!")
5. After registration, you'll be automatically logged in and redirected to the dashboard

## Step 5: Test the Application

### Create Your First Task

1. Click on **"Tasks"** in the navigation bar
2. Click **"+ Create Task"** button
3. Fill in the task details:
   - Title: "My First Task"
   - Description: "This is a test task"
   - Status: Pending
   - Priority: Medium
   - Due Date: Select a date
4. Click **"Create"**
5. Your task should appear in the list!

### Test Features

- **Search**: Use the search box to filter tasks by title or description
- **Filter**: Use dropdowns to filter by status and priority
- **Edit**: Click "Edit" button on any task to modify it
- **Delete**: Click "Delete" button to remove a task
- **Profile**: Update your profile information
- **Password**: Change your password from the profile page

## Testing the API with Postman

1. Import the Postman collection from `backend/Primo_API_Collection.postman_collection.json`
2. Set the `BASE_URL` variable to `http://localhost:5000`
3. Register or login to get a JWT token
4. Copy the token and set it in the `TOKEN` variable
5. Test all API endpoints!

## Troubleshooting

### Backend won't start

**Issue**: "Cannot connect to MongoDB"
- **Solution**: Make sure MongoDB is running. Check if the `MONGODB_URI` in `.env` is correct.

**Issue**: "Port 5000 already in use"
- **Solution**: Change the `PORT` in `.env` to another port (e.g., 5001)

### Frontend won't start

**Issue**: "Failed to fetch"
- **Solution**: Make sure the backend is running on port 5000
- Check if `VITE_API_URL` in frontend `.env` matches your backend URL

**Issue**: "Cannot find module"
- **Solution**: Delete `node_modules` and run `npm install` again

### Login/Register Issues

**Issue**: "Network Error"
- **Solution**: Check if backend is running and CORS is properly configured

**Issue**: "Validation errors"
- **Solution**: Make sure password meets requirements (uppercase, lowercase, number, min 6 chars)

## Next Steps

Now that your application is running:

1. ✅ Explore the dashboard and view task statistics
2. ✅ Create, edit, and delete tasks
3. ✅ Update your profile information
4. ✅ Test search and filter functionality
5. ✅ Try the API with Postman
6. ✅ Read the main README.md for deployment options

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Changes to React files will automatically refresh the browser
- **Backend**: Changes to Node.js files will automatically restart the server (with nodemon)

### Database Inspection
To view your MongoDB data:
- Use **MongoDB Compass** (GUI tool)
- Or use MongoDB shell: `mongosh mongodb://localhost:27017/primo`

### Clearing Data
To reset the database:
```bash
mongosh mongodb://localhost:27017/primo
db.dropDatabase()
```

## Support

If you encounter any issues:
1. Check the terminal for error messages
2. Review the troubleshooting section above
3. Check browser console for frontend errors (F12)
4. Ensure all prerequisites are installed correctly

**Happy coding! 🚀**
