# 🚀 Quick Deployment Guide - Get Your App Live in 15 Minutes!

This is the fastest way to deploy your Primo app for FREE using Render.com.

## Prerequisites (5 minutes)

1. **GitHub Account** - [Sign up](https://github.com/signup) if you don't have one
2. **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register) for free
3. **Render Account** - [Sign up](https://dashboard.render.com/register) for free

---

## Step 1: Push Code to GitHub (2 minutes)

### If you haven't already:

```powershell
# In your project directory (e:\projects\primo)
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/primo.git
git branch -M main
git push -u origin main
```

### Or use the deployment script:

```powershell
.\deploy.ps1
```

---

## Step 2: Setup MongoDB Atlas (3 minutes)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Click "Build a Database"
   - Choose **FREE** tier (M0)
   - Select a region close to you
   - Click "Create"

2. **Create Database User**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `primo_user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Atlas Admin"
   - Click "Add User"

3. **Whitelist IP Addresses**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere"
   - IP: `0.0.0.0/0` (this allows Render to connect)
   - Click "Confirm"

4. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `primo`
   
   Example: 
   ```
   mongodb+srv://primo_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/primo?retryWrites=true&w=majority
   ```

---

## Step 3: Deploy Backend to Render (4 minutes)

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service**
   - Click "New +" button (top right)
   - Select "Web Service"
   - Click "Connect account" to connect GitHub
   - Select your `primo` repository
   - Click "Connect"

3. **Configure Backend**
   ```
   Name: primo-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these one by one:
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = <paste your MongoDB connection string from Step 2>
   JWT_SECRET = <generate below>
   JWT_EXPIRE = 7d
   ```

5. **Generate JWT Secret** (run this in PowerShell):
   ```powershell
   $bytes = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [BitConverter]::ToString($bytes).Replace('-', '').ToLower()
   ```
   Copy the output and use it as JWT_SECRET

6. **Click "Create Web Service"**
   - Wait for deployment (2-3 minutes)
   - Copy your backend URL (e.g., `https://primo-backend.onrender.com`)

---

## Step 4: Deploy Frontend to Render (3 minutes)

1. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"
   - Select your `primo` repository again
   - Click "Connect"

2. **Configure Frontend**
   ```
   Name: primo-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variable**
   Click "Advanced" → "Add Environment Variable"
   ```
   VITE_API_URL = <your backend URL from Step 3>/api
   ```
   
   Example: `https://primo-backend.onrender.com/api`

4. **Click "Create Static Site"**
   - Wait for deployment (2-3 minutes)
   - Copy your frontend URL (e.g., `https://primo-frontend.onrender.com`)

---

## Step 5: Update Backend CORS (2 minutes)

1. **Go back to your backend service** on Render

2. **Click "Environment" in left sidebar**

3. **Add two more environment variables:**
   ```
   CLIENT_URL = <your frontend URL from Step 4>
   ALLOWED_ORIGINS = <your frontend URL from Step 4>
   ```
   
   Example: `https://primo-frontend.onrender.com`

4. **Click "Save Changes"**
   - Backend will automatically redeploy (1-2 minutes)

---

## Step 6: Test Your App! 🎉

1. Open your frontend URL (from Step 4)
2. Register a new account
3. Log in
4. Create some tasks
5. Test all features

**Your app is now LIVE!** 🚀

---

## Important Notes About Free Tier

⚠️ **Free tier limitations:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- This is perfect for testing and demos

💡 **To keep backend awake:**
- Upgrade to paid tier ($7/month) for always-on service
- Or use a free uptime monitor like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 10 minutes

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify password doesn't have special characters (or URL encode them)
- Check Render logs: Backend service → "Logs" tab

### Frontend shows "Network Error"
- Verify `VITE_API_URL` has `/api` at the end
- Check backend is running (visit `https://your-backend.onrender.com/api/health`)
- Verify CORS settings (CLIENT_URL and ALLOWED_ORIGINS)

### Can't login after deployment
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check backend logs for errors

### MongoDB connection errors
- Verify IP whitelist includes `0.0.0.0/0`
- Check database user has correct permissions
- Ensure password in connection string is correct

---

## Upgrade Options

### When you need more:

**Render Paid Tier ($7/mo)**
- Always-on backend (no sleep)
- Faster performance
- More resources

**Custom Domain ($12/year)**
- Buy domain from Namecheap/Google Domains
- Add to Render: Settings → Custom Domain

**Better Database ($9-57/mo)**
- MongoDB Atlas Shared Cluster (M2/M5)
- Better performance and backups

---

## Next Steps

✅ Your app is deployed!

Now you can:
1. Share the URL with friends/clients
2. Add custom domain
3. Set up monitoring (Sentry, LogRocket)
4. Add more features
5. Scale up when needed

---

## Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/
- **Deployment Issues**: Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting

---

## Deployment URLs Checklist

Fill this in as you deploy:

```
MongoDB Connection String: ___________________________________
Backend URL: ___________________________________
Frontend URL: ___________________________________
JWT Secret: ___________________________________ (keep secret!)

Deployment Date: ___________________
```

**Congratulations! Your app is live! 🎉🚀**
