# Primo Quick Deployment Script for Render.com (PowerShell)
# This script helps you deploy to Render quickly

Write-Host "🚀 Primo Deployment Helper" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "❌ Git repository not found. Initializing..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for deployment"
}

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  You have uncommitted changes." -ForegroundColor Yellow
    $commit = Read-Host "Do you want to commit them? (y/n)"
    if ($commit -eq 'y' -or $commit -eq 'Y') {
        git add .
        $commitMsg = Read-Host "Enter commit message"
        git commit -m "$commitMsg"
    }
}

# Check if remote exists
$remotes = git remote
if ($remotes -notcontains 'origin') {
    Write-Host ""
    Write-Host "📦 No git remote found." -ForegroundColor Yellow
    Write-Host "Please create a GitHub repository and add it as remote:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  git remote add origin https://github.com/YourUsername/primo.git" -ForegroundColor Green
    Write-Host "  git push -u origin main" -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter after adding remote"
}

# Push to GitHub
Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. MongoDB Atlas Setup:" -ForegroundColor Yellow
Write-Host "   - Go to https://www.mongodb.com/cloud/atlas"
Write-Host "   - Create a free cluster (M0)"
Write-Host "   - Create a database user"
Write-Host "   - Whitelist IP: 0.0.0.0/0 (for Render access)"
Write-Host "   - Copy your connection string"
Write-Host ""
Write-Host "2. Deploy Backend on Render:" -ForegroundColor Yellow
Write-Host "   - Go to https://dashboard.render.com/"
Write-Host "   - Click 'New +' → 'Web Service'"
Write-Host "   - Connect your GitHub repository"
Write-Host "   - Name: primo-backend"
Write-Host "   - Root Directory: backend"
Write-Host "   - Build Command: npm install"
Write-Host "   - Start Command: npm start"
Write-Host "   - Add environment variables:"
Write-Host "     * NODE_ENV=production"
Write-Host "     * MONGODB_URI=<your-mongodb-connection-string>"
Write-Host "     * JWT_SECRET=<see below>"
Write-Host "     * JWT_EXPIRE=7d"
Write-Host "   - Copy the backend URL"
Write-Host ""
Write-Host "3. Deploy Frontend on Render:" -ForegroundColor Yellow
Write-Host "   - Click 'New +' → 'Static Site'"
Write-Host "   - Connect same repository"
Write-Host "   - Name: primo-frontend"
Write-Host "   - Root Directory: frontend"
Write-Host "   - Build Command: npm install && npm run build"
Write-Host "   - Publish Directory: dist"
Write-Host "   - Add environment variable:"
Write-Host "     * VITE_API_URL=<your-backend-url>/api"
Write-Host ""
Write-Host "4. Update Backend CORS:" -ForegroundColor Yellow
Write-Host "   - Go back to backend service on Render"
Write-Host "   - Add environment variables:"
Write-Host "     * CLIENT_URL=<your-frontend-url>"
Write-Host "     * ALLOWED_ORIGINS=<your-frontend-url>"
Write-Host ""
Write-Host "🎉 Your app will be live shortly!" -ForegroundColor Green
Write-Host ""
Write-Host "Generate JWT Secret:" -ForegroundColor Cyan

# Generate JWT Secret
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$jwtSecret = [BitConverter]::ToString($bytes).Replace('-', '').ToLower()
Write-Host ""
Write-Host "  JWT_SECRET=$jwtSecret" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
