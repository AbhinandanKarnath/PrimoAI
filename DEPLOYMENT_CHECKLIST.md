# 🚀 Primo Deployment Checklist

## THE MAIN ISSUE: Root Directory Not Set

**The #1 reason your backend failed on Render:**
- ❌ Root directory was not set to `backend`
- ❌ Render was looking for `package.json` in the wrong place

**The Fix:**
- ✅ Set **Root Directory** to `backend` when creating the service
- ✅ This tells Render where to find your package.json

---

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All changes committed to git
- [ ] Code pushed to GitHub (main branch)
- [ ] MongoDB Atlas cluster created and accessible
- [ ] MongoDB Network Access set to `0.0.0.0/0` (allow all IPs)

### ✅ Environment Variables Ready
- [ ] MongoDB connection string (with password)
- [ ] JWT secret key (random 32+ characters)
- [ ] Note: Frontend URL and Backend URL will be set after deployment

---

## Backend Deployment (Render.com)

### Configuration
- [ ] Go to Render.com and sign in with GitHub
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Select your **PrimoAI** repository
- [ ] **Root Directory**: `backend` ⚠️ **CRITICAL - THIS FIXES THE ERROR**
- [ ] **Branch**: `main`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free

### Environment Variables to Add:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-random-secret-key-minimum-32-characters
JWT_EXPIRE=7d
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primo
CLIENT_URL=http://localhost:5173
```

### After Deployment:
- [ ] Backend URL copied: `https://______________.onrender.com`
- [ ] Health check works: Visit `https://your-backend-url.onrender.com/api/health`
- [ ] Should return: `{"success":true,"message":"API is running"}`

---

## Frontend Deployment (Render.com)

### Configuration
- [ ] Click **"New +"** → **"Static Site"**
- [ ] Select your **PrimoAI** repository
- [ ] **Root Directory**: `frontend` ⚠️ **IMPORTANT**
- [ ] **Branch**: `main`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Publish Directory**: `dist`

### Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com
```
(Use the backend URL from previous step)

### After Deployment:
- [ ] Frontend URL copied: `https://______________.onrender.com`
- [ ] Can access the site in browser
- [ ] Login/Register pages load correctly

---

## Final Configuration

### Update Backend CLIENT_URL
- [ ] Go to backend service in Render
- [ ] Navigate to **Environment**
- [ ] Update `CLIENT_URL` to your frontend URL
- [ ] Click **"Save Changes"** (triggers redeploy)
- [ ] Wait for redeploy to complete

---

## Testing Checklist

- [ ] Visit frontend URL
- [ ] Register a new account
- [ ] Login with credentials
- [ ] Create a new task
- [ ] View all tasks
- [ ] Update a task
- [ ] Delete a task
- [ ] Toggle task status (Complete/Cancel)
- [ ] Renew completed task
- [ ] Logout and login again
- [ ] Check browser console for errors

---

## Troubleshooting

### Backend Issues

**Build fails with "package.json not found"**
- ✅ **Solution**: Set Root Directory to `backend`

**"MongoServerError: Authentication failed"**
- ✅ Check MONGODB_URI password is correct
- ✅ Check MongoDB Atlas Network Access allows 0.0.0.0/0
- ✅ Check database user has read/write permissions

**Health check fails**
- ✅ Check Render logs for errors
- ✅ Verify MongoDB connection
- ✅ Make sure all environment variables are set

### Frontend Issues

**White screen or blank page**
- ✅ Check that VITE_API_URL is set correctly
- ✅ Check browser console for errors
- ✅ Verify build command completed successfully

**API errors (CORS)**
- ✅ Update backend CLIENT_URL with frontend URL
- ✅ Redeploy backend after updating CLIENT_URL
- ✅ Clear browser cache

**404 on page refresh**
- ✅ Render Static Sites should handle this automatically
- ✅ Check that routes are configured correctly in render.yaml

---

## Important Notes

### Free Tier Limitations (Render)
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ First request after spin down takes ~30 seconds
- ⚠️ Consider paid tier for production

### Security Notes
- 🔒 Change JWT_SECRET to a strong random value
- 🔒 Don't commit .env files to git
- 🔒 Use environment variables for all secrets
- 🔒 Consider rate limiting for production

---

## Quick Commands

### Push code to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Or use the script:
```bash
# PowerShell
.\prepare-deploy.ps1

# Linux/Mac
./prepare-deploy.sh
```

---

## Documentation Reference

- 📖 **DEPLOYMENT_STEPS.md** - Detailed step-by-step guide
- 📖 **RENDER_FIX.md** - Troubleshooting and fixes
- 📖 **DEPLOYMENT_GUIDE.md** - Alternative deployment options
- 📖 **README.md** - Project overview and local setup

---

## Your Deployment URLs

After deployment, record your URLs here:

- **Backend**: `https://_____________________.onrender.com`
- **Frontend**: `https://_____________________.onrender.com`
- **Health Check**: `https://_____________________.onrender.com/api/health`
- **MongoDB**: `mongodb+srv://_____________________`

---

## Success Criteria

✅ Backend health check returns success
✅ Frontend loads without errors
✅ Can register and login
✅ Can perform all CRUD operations on tasks
✅ No CORS errors in browser console
✅ All features work as expected

---

**Remember**: The most important setting is **Root Directory**!
- Backend: `backend`
- Frontend: `frontend`

This is what fixes your npm configuration error! 🎯
