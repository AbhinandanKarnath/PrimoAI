# 🚨 RENDER BACKEND DEPLOYMENT FIX

## The Problem
Your backend build is failing on Render with npm configuration errors.

## The Solution - 3 Steps

### Step 1: Set the Root Directory

When creating/editing your Render web service:

1. Go to your Render dashboard
2. Click on your backend service (or create new if needed)
3. In **Settings** → **Build & Deploy**:
   - **Root Directory**: `backend` ⚠️ THIS IS CRITICAL!
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Verify Environment Variables

Make sure these are set in Render dashboard → Environment:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-random-secret-key-minimum-32-characters
JWT_EXPIRE=7d
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primo?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

⚠️ **MONGODB_URI**: Replace with your actual MongoDB Atlas connection string
⚠️ **JWT_SECRET**: Use a strong random string (can generate one at https://randomkeygen.com/)
⚠️ **CLIENT_URL**: Update after frontend deployment

### Step 3: Manual Deployment Option

If the blueprint deployment isn't working, deploy manually:

#### Option A: Via Render Dashboard (Recommended)

1. **Delete old service** if it exists and has errors
2. Click **"New +"** → **"Web Service"**
3. Select your **GitHub repository** (PrimoAI)
4. Enter these settings:

```
Name: primo-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend          ← MUST BE SET!
Runtime: Node
Build Command: npm install
Start Command: npm start
```

5. Add environment variables (see Step 2)
6. Click **"Create Web Service"**

#### Option B: Create render.yaml in backend folder

I've already created `backend/render.yaml` for you. To use it:

1. Commit and push changes:
```bash
git add .
git commit -m "Add backend render.yaml"
git push origin main
```

2. In Render dashboard:
   - Select your repo
   - Render will automatically detect `backend/render.yaml`
   - Follow the prompts

## Why This Happens

Render was trying to run `npm install` from the root directory (`/opt/render/project`) but:
- Your `package.json` is in the `backend` folder
- The old `render.yaml` had incorrect `cd backend` commands
- Render's working directory wasn't set correctly

## Verify It Works

After deployment, test these URLs:

```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Should return:
{"success":true,"message":"API is running"}
```

## Still Having Issues?

### Check Render Logs:
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. Look for errors

### Common Error Messages & Fixes:

**"npm: not found"** or **"package.json not found"**
- ✅ Fix: Set Root Directory to `backend`

**"MongoServerError: Authentication failed"**
- ✅ Fix: Check your MONGODB_URI password and username
- ✅ Fix: Add `0.0.0.0/0` to MongoDB Atlas Network Access

**"ENOENT: no such file or directory"**
- ✅ Fix: Verify Root Directory is `backend`
- ✅ Fix: Make sure package.json exists in backend folder

**"Port 5000 is already in use"**
- ✅ Fix: Use PORT=10000 in environment variables (Render default)

**Health check failed**
- ✅ Fix: Make sure your backend starts successfully
- ✅ Fix: Verify `/api/health` endpoint exists
- ✅ Fix: Check MongoDB connection is working

## Alternative: Use Docker (Advanced)

If you continue having issues, you can use Docker deployment:

```dockerfile
# Already created: backend/Dockerfile
# Render can build and deploy this automatically
```

In Render settings:
- **Runtime**: Docker
- **Dockerfile Path**: backend/Dockerfile

## Quick Command Reference

```bash
# Test locally first
cd backend
npm install
npm start

# Should see:
# Server running on port 5000
# MongoDB Connected

# Push to GitHub
git add .
git commit -m "Fix backend deployment"
git push origin main
```

## Need More Help?

1. Share the **full error log** from Render
2. Verify your file structure:
```
primo/
├── backend/
│   ├── package.json      ← Must exist
│   ├── src/
│   │   └── server.js     ← Must exist
│   └── render.yaml       ← Now exists
└── frontend/
```

3. Double-check MongoDB Atlas:
   - Network Access → Allow 0.0.0.0/0
   - Database Access → User has read/write permissions
   - Connection string has correct password

---

**TL;DR:**
1. Set **Root Directory** to `backend` in Render
2. Use `npm install` and `npm start` commands
3. Add all environment variables
4. Deploy and check logs

Your backend should now deploy successfully! 🚀
