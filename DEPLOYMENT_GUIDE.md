# Deployment Guide for Primo

This guide provides step-by-step instructions for deploying your Primo application to various hosting platforms.

## Quick Comparison

| Platform | Frontend | Backend | Database | Cost | Setup Time |
|----------|----------|---------|----------|------|------------|
| **Render** | ✅ Free | ✅ Free | MongoDB Atlas Free | $0 | 15 min |
| **Vercel + Railway** | ✅ Free | ✅ Free | MongoDB Atlas Free | $0 | 20 min |
| **AWS (Production)** | S3+CloudFront | EC2/ECS | RDS/DocumentDB | ~$50-200/mo | 2-4 hours |
| **DigitalOcean** | App Platform | App Platform | Managed MongoDB | ~$25-100/mo | 1-2 hours |

---

## Option 1: Render.com (Easiest & Free)

### Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Render account (free)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**
```bash
cd e:\projects\primo
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Create a root `package.json` for monorepo detection** (optional but recommended)
```json
{
  "name": "primo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "install:backend": "cd backend && npm install",
    "install:frontend": "cd frontend && npm install",
    "start:backend": "cd backend && npm start",
    "build:frontend": "cd frontend && npm run build"
  }
}
```

### Step 2: MongoDB Atlas Setup (if not already done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Create a database user
4. Whitelist all IP addresses (`0.0.0.0/0`) for Render access
5. Copy your connection string

### Step 3: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the backend service:**
   - **Name**: `primo-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-strong-secret-key>
   JWT_EXPIRE=7d
   CLIENT_URL=<will-add-after-frontend-deployment>
   ```

6. **Generate JWT Secret** (run this locally):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

7. Click **"Create Web Service"**

8. **Copy your backend URL** (e.g., `https://primo-backend.onrender.com`)

### Step 4: Deploy Frontend to Render

1. **Click "New +" → "Static Site"**

2. **Connect same GitHub repository**

3. **Configure the frontend:**
   - **Name**: `primo-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://primo-backend.onrender.com/api
   ```

5. Click **"Create Static Site"**

6. **Copy your frontend URL** (e.g., `https://primo-frontend.onrender.com`)

### Step 5: Update Backend CORS

1. Go back to your backend service on Render
2. Update environment variables:
   ```
   CLIENT_URL=https://primo-frontend.onrender.com
   ALLOWED_ORIGINS=https://primo-frontend.onrender.com
   ```

3. Backend will automatically redeploy

### Step 6: Update Frontend API Configuration

Update `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    // Remove proxy in production
  },
  // Add base URL if needed
  base: '/',
})
```

Update `frontend/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api'
```

Push changes and Render will auto-redeploy!

### ⚠️ Important Notes for Render Free Tier:
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Free tier includes 750 hours/month (enough for one service)
- Consider upgrading to $7/month for always-on service

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Frontend:**
```bash
cd frontend
vercel
```

3. **Configure Environment:**
   - Add `VITE_API_URL` in Vercel dashboard
   - Point to Railway backend URL

### Backend on Railway

1. **Go to [Railway](https://railway.app/)**

2. **Create New Project → Deploy from GitHub**

3. **Select backend folder**

4. **Add Environment Variables**

5. **Railway will auto-detect Node.js and deploy**

---

## Option 3: DigitalOcean App Platform

### Step 1: Prepare App Spec

Create `app.yaml` in root:

```yaml
name: primo
services:
  - name: backend
    environment_slug: node-js
    github:
      repo: YourUsername/primo
      branch: main
      deploy_on_push: true
    source_dir: /backend
    build_command: npm install
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: ${db.DATABASE_URL}
        type: SECRET
      - key: JWT_SECRET
        type: SECRET
    http_port: 5000
    instance_count: 1
    instance_size_slug: basic-xxs

  - name: frontend
    environment_slug: node-js
    github:
      repo: YourUsername/primo
      branch: main
      deploy_on_push: true
    source_dir: /frontend
    build_command: npm install && npm run build
    static_sites:
      - name: primo-frontend
        build_command: npm run build
        output_dir: dist
    envs:
      - key: VITE_API_URL
        value: ${backend.PUBLIC_URL}/api

databases:
  - name: mongodb
    engine: MONGODB
    production: false
```

### Step 2: Deploy

1. Push to GitHub
2. Go to DigitalOcean App Platform
3. Create new app from GitHub
4. Select repository
5. DigitalOcean will detect `app.yaml` and configure automatically

**Cost**: ~$5-12/month for basic tier

---

## Option 4: AWS (Production-Ready)

### Architecture Overview
```
CloudFront (CDN) → S3 (Frontend)
Route53 (DNS) → ALB → ECS/EC2 (Backend) → DocumentDB/RDS
                                        → ElastiCache (Redis)
```

### Quick Start with AWS

1. **Create Dockerfiles:**

`backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

2. **Deploy Backend to ECS/Fargate:**
   - Build and push Docker image to ECR
   - Create ECS task definition
   - Create ECS service with ALB

3. **Deploy Frontend to S3 + CloudFront:**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://primo-frontend/ --delete
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

**Detailed AWS guide available in `SCALING.md`**

---

## Option 5: Docker Compose (Self-Hosting)

For VPS (DigitalOcean Droplet, AWS EC2, etc.)

### Step 1: Create Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    restart: always
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    networks:
      - primo-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/primo?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      CLIENT_URL: ${CLIENT_URL}
    depends_on:
      - mongodb
    networks:
      - primo-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${API_URL}
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - primo-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - primo-network

volumes:
  mongo_data:

networks:
  primo-network:
    driver: bridge
```

### Step 2: Create Frontend Dockerfile

`frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 3: Deploy to VPS

```bash
# SSH into your VPS
ssh user@your-server-ip

# Clone repository
git clone https://github.com/YourUsername/primo.git
cd primo

# Create .env file
nano .env
# Add: MONGO_PASSWORD, JWT_SECRET, CLIENT_URL, API_URL

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Post-Deployment Checklist

### Security
- [ ] Update CORS origins to production URLs
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Configure helmet.js headers
- [ ] Review MongoDB Atlas IP whitelist

### Performance
- [ ] Enable compression
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable CDN for static assets
- [ ] Add database indexes

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up logging (Winston)
- [ ] Add health check endpoints
- [ ] Configure alerts

### Environment Variables Required

**Backend:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
CLIENT_URL=<frontend-url>
ALLOWED_ORIGINS=<frontend-url>
```

**Frontend:**
```env
VITE_API_URL=<backend-api-url>
```

---

## Troubleshooting

### Backend Issues

**Connection Refused:**
- Check MongoDB connection string
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check backend logs for errors

**CORS Errors:**
- Update `CLIENT_URL` and `ALLOWED_ORIGINS` environment variables
- Ensure frontend URL is correct (include protocol)

**Slow Cold Starts (Render):**
- Upgrade to paid tier ($7/mo)
- Or keep backend warm with uptime monitoring pings

### Frontend Issues

**API Not Found:**
- Verify `VITE_API_URL` environment variable
- Check that API URL includes `/api` path
- Ensure backend is running

**Build Errors:**
- Clear cache: `rm -rf node_modules dist && npm install`
- Check for environment-specific code
- Verify all dependencies in package.json

---

## Recommended: Start with Render

For beginners, I recommend **Option 1 (Render)** because:

✅ Completely free to start
✅ Automatic deployments from GitHub
✅ Easy environment variable management
✅ Built-in SSL certificates
✅ Simple scaling when needed

Once you have more traffic, you can:
1. Upgrade Render to paid tier ($7/mo)
2. Move to DigitalOcean (~$12/mo)
3. Migrate to AWS for full scalability

---

## Next Steps

1. Choose your deployment platform
2. Follow the specific guide above
3. Complete the post-deployment checklist
4. Monitor your application
5. Scale as needed

Need help with deployment? Check:
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- AWS Guide in `SCALING.md`
