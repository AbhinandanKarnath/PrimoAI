# Configuration Checklist

Use this checklist to ensure your Primo application is properly configured before deployment.

## ✅ Pre-Deployment Checklist

### Backend Configuration

#### 1. Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primo?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=CHANGE_THIS_TO_A_STRONG_RANDOM_STRING_AT_LEAST_32_CHARACTERS
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=https://yourdomain.com
```

**Action Items:**
- [ ] Set `NODE_ENV` to `production`
- [ ] Update `MONGODB_URI` with your database connection string
- [ ] **CRITICAL**: Change `JWT_SECRET` to a strong, random string
- [ ] Update `CLIENT_URL` with your frontend domain
- [ ] Verify `PORT` is available

**Generate Strong JWT Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

#### 2. Database Setup

MongoDB Options:
- [ ] **Local MongoDB**: Ensure MongoDB is running
- [ ] **MongoDB Atlas**: Create cluster and get connection string

**MongoDB Atlas Setup:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist your IP address (or 0.0.0.0/0 for development)
5. Get connection string
6. Replace `<username>`, `<password>`, and `<dbname>` in connection string

#### 3. Security Check

- [ ] JWT_SECRET is unique and secure (not the example value)
- [ ] MONGODB_URI does not contain plain text passwords in code
- [ ] Environment variables are not committed to Git
- [ ] `.env` is in `.gitignore`
- [ ] CORS is properly configured for your domain

#### 4. Dependencies

```bash
cd backend
npm install
```

- [ ] All dependencies installed without errors
- [ ] No security vulnerabilities (run `npm audit`)

---

### Frontend Configuration

#### 1. Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

**For Production:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Action Items:**
- [ ] Update `VITE_API_URL` to point to your backend
- [ ] Ensure URL does **not** end with a trailing slash

#### 2. Dependencies

```bash
cd frontend
npm install
```

- [ ] All dependencies installed without errors
- [ ] No security vulnerabilities (run `npm audit`)

#### 3. Build Test

```bash
npm run build
```

- [ ] Build completes without errors
- [ ] Output in `dist/` folder
- [ ] Check build size (should be < 1MB for initial load)

---

## 🚀 Deployment Checklist

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

- [ ] App deployed successfully
- [ ] Environment variables set
- [ ] Health check endpoint accessible
- [ ] Database connected

#### Option 2: DigitalOcean/AWS/VPS

- [ ] Server provisioned
- [ ] Node.js installed (v18+)
- [ ] MongoDB accessible
- [ ] Environment variables configured
- [ ] PM2 or similar process manager installed
- [ ] NGINX configured as reverse proxy
- [ ] SSL certificate installed
- [ ] Firewall configured

**PM2 Setup:**
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name primo-backend
pm2 save
pm2 startup
```

### Frontend Deployment

#### Option 1: Vercel (Recommended for React/Vite)

```bash
# Install Vercel CLI
npm install -g vercel

cd frontend
vercel
```

- [ ] App deployed successfully
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured (optional)

#### Option 2: Netlify

```bash
cd frontend
npm run build

# Drag and drop `dist` folder to Netlify
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

- [ ] App deployed successfully
- [ ] Environment variables set in Netlify dashboard
- [ ] Redirects configured for SPA

**netlify.toml:**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Option 3: AWS S3 + CloudFront

- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] Files uploaded to S3
- [ ] CloudFront distribution created
- [ ] SSL certificate configured
- [ ] Custom domain configured (optional)

---

## 🧪 Testing Checklist

### Backend Testing

```bash
cd backend
```

- [ ] Server starts without errors: `npm run dev`
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Database connected (check console logs)
- [ ] CORS working (check browser console)

**Test API Endpoints:**
- [ ] POST /api/auth/register (create test account)
- [ ] POST /api/auth/login (login with test account)
- [ ] GET /api/auth/me (with token)
- [ ] GET /api/tasks (with token)
- [ ] POST /api/tasks (create task)
- [ ] PUT /api/tasks/:id (update task)
- [ ] DELETE /api/tasks/:id (delete task)

### Frontend Testing

```bash
cd frontend
npm run dev
```

**Manual Testing:**
- [ ] App loads without errors
- [ ] Can navigate to login page
- [ ] Can navigate to register page
- [ ] Registration works
- [ ] Login works
- [ ] Redirects to dashboard after login
- [ ] Dashboard displays user info
- [ ] Can create task
- [ ] Can edit task
- [ ] Can delete task
- [ ] Search works
- [ ] Filter works
- [ ] Profile update works
- [ ] Password change works
- [ ] Logout works
- [ ] Protected routes redirect to login when not authenticated

**Browser Testing:**
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile responsive

---

## 📊 Performance Checklist

### Backend Performance

- [ ] Database indexes created
- [ ] Response compression enabled
- [ ] Rate limiting configured
- [ ] Error logging enabled
- [ ] Response times < 200ms (check with browser dev tools)

### Frontend Performance

- [ ] Build size optimized
- [ ] Images optimized
- [ ] Lazy loading implemented (where applicable)
- [ ] Bundle analyzed (run `npm run build` and check output)
- [ ] Lighthouse score > 90

**Run Lighthouse:**
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Check scores for Performance, Accessibility, Best Practices, SEO

---

## 🔒 Security Checklist

### Backend Security

- [ ] All secrets in environment variables
- [ ] JWT secret is strong and unique
- [ ] Passwords are hashed (bcrypt)
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] HTTPS enabled (production)
- [ ] Security headers configured (helmet)
- [ ] No sensitive data in error messages
- [ ] Database queries use parameterized queries (Mongoose does this)

### Frontend Security

- [ ] API URL in environment variable
- [ ] No sensitive data in client-side code
- [ ] No API keys exposed
- [ ] XSS protection (React does this by default)
- [ ] HTTPS enabled (production)
- [ ] Tokens stored securely (localStorage is acceptable for JWT)

---

## 📝 Documentation Checklist

- [ ] README.md updated with deployment URLs
- [ ] API documentation accurate
- [ ] Environment variables documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide available

---

## 🌐 Domain & DNS (Optional)

If using a custom domain:

- [ ] Domain purchased
- [ ] DNS records configured:
  - [ ] A record for backend (if applicable)
  - [ ] A record or CNAME for frontend
- [ ] SSL certificate installed
- [ ] HTTPS enforced

---

## 📧 Post-Deployment

After successful deployment:

1. **Test in Production:**
   - [ ] Create an account
   - [ ] Login
   - [ ] Perform CRUD operations
   - [ ] Test all features

2. **Monitor:**
   - [ ] Check server logs
   - [ ] Monitor error rates
   - [ ] Check response times
   - [ ] Monitor database connections

3. **Document:**
   - [ ] Save deployment URLs
   - [ ] Document any issues encountered
   - [ ] Update README with production URLs

---

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection string
- Verify environment variables are set
- Check if port is available
- Review server logs

**Frontend can't connect to backend:**
- Verify API URL in frontend .env
- Check CORS configuration in backend
- Ensure backend is running
- Check browser console for errors

**Database connection fails:**
- Verify MongoDB is running (if local)
- Check connection string format
- Verify database user credentials
- Check IP whitelist (if using MongoDB Atlas)

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure token is passed correctly in headers

---

## ✅ Final Checklist

Before marking the project as complete:

- [ ] All features working
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Code committed to Git
- [ ] Repository pushed to GitHub
- [ ] README has clear instructions
- [ ] Environment variables documented
- [ ] Security best practices followed
- [ ] Performance optimized
- [ ] Responsive design verified
- [ ] Cross-browser testing done
- [ ] Production deployment successful (if applicable)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error messages carefully
3. Check browser console and network tab
4. Review server logs
5. Refer to documentation

---

**Congratulations! Your Primo application is ready! 🎉**
