#!/bin/bash

# Primo Application - Automated Setup Script
# This script helps set up the development environment

echo "============================================"
echo "  Primo Application - Setup Script"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js is installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js is not installed!${NC}"
    echo -e "${RED}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check if MongoDB is installed or running
echo -e "${YELLOW}Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not running${NC}"
    echo -e "${YELLOW}  You can:${NC}"
    echo -e "${YELLOW}  1. Start MongoDB locally, or${NC}"
    echo -e "${YELLOW}  2. Use MongoDB Atlas (cloud)${NC}"
fi

echo ""
echo "============================================"
echo "  Setting up Backend..."
echo "============================================"

# Navigate to backend directory
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠ Please edit backend/.env and update JWT_SECRET!${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

echo ""
echo "============================================"
echo "  Setting up Frontend..."
echo "============================================"

# Navigate to frontend directory
cd ../frontend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Return to root directory
cd ..

echo ""
echo "============================================"
echo -e "${GREEN}  Setup Complete!${NC}"
echo "============================================"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Make sure MongoDB is running"
echo "2. Update backend/.env with your JWT_SECRET"
echo "3. Open TWO terminal windows:"
echo ""
echo -e "${CYAN}   Terminal 1 (Backend):${NC}"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo -e "${CYAN}   Terminal 2 (Frontend):${NC}"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo -e "${YELLOW}For detailed instructions, see QUICKSTART.md${NC}"
echo ""
