# Primo Deployment Guide - Step by Step

## Quick Fix for Render Backend Deployment

### The Issue
Render was failing because the `render.yaml` configuration was trying to navigate directories incorrectly.

### Solution: Deploy Backend and Frontend Separately

## Backend Deployment (Render.com)

### Step 1: Push Your Code to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy Backend on Render

1. Go to [Render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your **PrimoAI** repository
4. Configure the service:

**Basic Settings:**
- **Name**: `primo-backend`
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

**Environment Variables** (Click "Advanced" → "Add Environment Variable"):
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
MONGODB_URI=your-mongodb-atlas-connection-string
CLIENT_URL=https://your-frontend-url.onrender.com
```

5. Click **"Create Web Service"**
6. Wait for deployment (usually 2-3 minutes)
7. **Copy your backend URL** (e.g., `https://primo-backend.onrender.com`)

### Step 3: Get Your MongoDB URI

If you haven't already:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster → **Connect** → **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add this to Render's `MONGODB_URI` environment variable

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/primo?retryWrites=true&w=majority
```

## Frontend Deployment (Render.com)

### Step 1: Deploy Frontend on Render

1. Click **"New +"** → **"Static Site"**
2. Connect your **PrimoAI** repository again
3. Configure the site:

**Basic Settings:**
- **Name**: `primo-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables:**
```
VITE_API_URL=https://primo-backend.onrender.com
```
(Use the backend URL from Step 2)

4. Click **"Create Static Site"**
5. Wait for deployment
6. **Copy your frontend URL** (e.g., `https://primo-frontend.onrender.com`)

### Step 2: Update Backend CLIENT_URL

1. Go back to your **primo-backend** service on Render
2. Navigate to **Environment** section
3. Update `CLIENT_URL` with your frontend URL
4. Click **"Save Changes"** (this will trigger a redeploy)

## Testing Your Deployment

1. Visit your frontend URL: `https://primo-frontend.onrender.com`
2. Try to register a new account
3. Login with your credentials
4. Create, view, update, and delete tasks
5. Check the browser console for any errors

## Common Issues & Fixes

### Backend Not Starting

**Error**: Build failed or health check failing

**Fix**:
1. Check Render logs (click on your service → "Logs" tab)
2. Verify `MONGODB_URI` is correct
3. Make sure `Root Directory` is set to `backend`
4. Verify all environment variables are set

### Frontend Not Loading

**Error**: White screen or API errors

**Fix**:
1. Check that `VITE_API_URL` points to your backend URL
2. Make sure backend `CLIENT_URL` includes your frontend URL
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### CORS Errors

**Error**: "Access to fetch... has been blocked by CORS policy"

**Fix**:
1. Update backend's `CLIENT_URL` environment variable
2. Check `backend/src/server.js` CORS configuration
3. Redeploy backend after changes

### MongoDB Connection Failed

**Error**: "MongoServerError" or connection timeout

**Fix**:
1. Check MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow connections from anywhere
3. Verify connection string has correct password
4. Make sure database user has read/write permissions

### Free Tier Spin Down

⚠️ **Important**: Render free tier services spin down after 15 minutes of inactivity
- First request after spin down takes ~30 seconds
- Consider upgrading to paid tier for production use

## Alternative: Deploy Using Render CLI (Advanced)

### Backend
```bash
cd backend
render deploy --service-name primo-backend
```

### Frontend
```bash
cd frontend
render deploy --service-name primo-frontend
```

## Environment Variables Reference

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | Random 32+ char string |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `https://primo-frontend.onrender.com` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://primo-backend.onrender.com` |

## Monitoring Your Application

1. **Backend Logs**: Render Dashboard → primo-backend → Logs
2. **Frontend Logs**: Render Dashboard → primo-frontend → Logs
3. **MongoDB Logs**: MongoDB Atlas → Database → Monitoring
4. **Health Check**: Visit `https://primo-backend.onrender.com/api/health`

## Next Steps

✅ Backend deployed and running
✅ Frontend deployed and accessible
✅ MongoDB connected
✅ CORS configured correctly

**Now you can**:
- Share your app: `https://primo-frontend.onrender.com`
- Monitor usage in Render dashboard
- Set up custom domain (paid feature)
- Upgrade to paid tier for better performance

## Support

If you encounter issues:
1. Check the [Render Troubleshooting Guide](https://render.com/docs/troubleshooting-deploys)
2. Review deployment logs in Render dashboard
3. Check MongoDB Atlas network settings
4. Verify all environment variables are correct

---

**Your Deployment URLs:**
- Frontend: `https://primo-frontend.onrender.com` (replace with your actual URL)
- Backend: `https://primo-backend.onrender.com` (replace with your actual URL)
- Health Check: `https://primo-backend.onrender.com/api/health`
