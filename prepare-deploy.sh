#!/bin/bash
# Deployment Preparation Script for Primo

echo "🚀 Preparing Primo for Deployment..."
echo ""

# Add all deployment files
git add .

# Commit
git commit -m "Add deployment configuration for Render, Vercel, and Docker"

# Push to GitHub
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "BACKEND DEPLOYMENT (Render.com):"
echo "1. Go to https://render.com/dashboard"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your PrimoAI repository"
echo "4. IMPORTANT: Set 'Root Directory' to: backend"
echo "5. Build Command: npm install"
echo "6. Start Command: npm start"
echo "7. Add environment variables (see DEPLOYMENT_STEPS.md)"
echo "8. Click 'Create Web Service'"
echo ""
echo "FRONTEND DEPLOYMENT (Render.com):"
echo "1. Click 'New +' → 'Static Site'"
echo "2. Connect your PrimoAI repository"
echo "3. IMPORTANT: Set 'Root Directory' to: frontend"
echo "4. Build Command: npm install && npm run build"
echo "5. Publish Directory: dist"
echo "6. Add VITE_API_URL environment variable"
echo "7. Click 'Create Static Site'"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - DEPLOYMENT_STEPS.md (step-by-step guide)"
echo "   - RENDER_FIX.md (troubleshooting)"
echo ""
echo "🎉 Good luck with your deployment!"
