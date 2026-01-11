#!/bin/bash

# Primo Quick Deployment Script for Render.com
# This script helps you deploy to Render quickly

echo "🚀 Primo Deployment Helper"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes."
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
    fi
fi

# Check if remote exists
if ! git remote | grep -q 'origin'; then
    echo ""
    echo "📦 No git remote found."
    echo "Please create a GitHub repository and add it as remote:"
    echo ""
    echo "  git remote add origin https://github.com/YourUsername/primo.git"
    echo "  git push -u origin main"
    echo ""
    read -p "Press Enter after adding remote..."
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. MongoDB Atlas Setup:"
echo "   - Go to https://www.mongodb.com/cloud/atlas"
echo "   - Create a free cluster (M0)"
echo "   - Create a database user"
echo "   - Whitelist IP: 0.0.0.0/0 (for Render access)"
echo "   - Copy your connection string"
echo ""
echo "2. Deploy Backend on Render:"
echo "   - Go to https://dashboard.render.com/"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Name: primo-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add environment variables:"
echo "     * NODE_ENV=production"
echo "     * MONGODB_URI=<your-mongodb-connection-string>"
echo "     * JWT_SECRET=<generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\">"
echo "     * JWT_EXPIRE=7d"
echo "   - Copy the backend URL"
echo ""
echo "3. Deploy Frontend on Render:"
echo "   - Click 'New +' → 'Static Site'"
echo "   - Connect same repository"
echo "   - Name: primo-frontend"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo "   - Add environment variable:"
echo "     * VITE_API_URL=<your-backend-url>/api"
echo ""
echo "4. Update Backend CORS:"
echo "   - Go back to backend service on Render"
echo "   - Add environment variables:"
echo "     * CLIENT_URL=<your-frontend-url>"
echo "     * ALLOWED_ORIGINS=<your-frontend-url>"
echo ""
echo "🎉 Your app will be live shortly!"
echo ""
echo "Generate JWT Secret:"
node -e "console.log('\n  JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex') + '\n')"
