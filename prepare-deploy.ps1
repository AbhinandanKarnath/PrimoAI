# PowerShell Deployment Preparation Script for Primo

Write-Host "🚀 Preparing Primo for Deployment..." -ForegroundColor Cyan
Write-Host ""

# Add all deployment files
git add .

# Commit
git commit -m "Add deployment configuration for Render, Vercel, and Docker"

# Push to GitHub
git push origin main

Write-Host ""
Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "BACKEND DEPLOYMENT (Render.com):" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com/dashboard"
Write-Host "2. Click 'New +' → 'Web Service'"
Write-Host "3. Connect your PrimoAI repository"
Write-Host "4. IMPORTANT: Set 'Root Directory' to: backend" -ForegroundColor Red
Write-Host "5. Build Command: npm install"
Write-Host "6. Start Command: npm start"
Write-Host "7. Add environment variables (see DEPLOYMENT_STEPS.md)"
Write-Host "8. Click 'Create Web Service'"
Write-Host ""
Write-Host "FRONTEND DEPLOYMENT (Render.com):" -ForegroundColor Cyan
Write-Host "1. Click 'New +' → 'Static Site'"
Write-Host "2. Connect your PrimoAI repository"
Write-Host "3. IMPORTANT: Set 'Root Directory' to: frontend" -ForegroundColor Red
Write-Host "4. Build Command: npm install && npm run build"
Write-Host "5. Publish Directory: dist"
Write-Host "6. Add VITE_API_URL environment variable"
Write-Host "7. Click 'Create Static Site'"
Write-Host ""
Write-Host "📖 For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "   - DEPLOYMENT_STEPS.md (step-by-step guide)"
Write-Host "   - RENDER_FIX.md (troubleshooting)"
Write-Host ""
Write-Host "🎉 Good luck with your deployment!" -ForegroundColor Green
