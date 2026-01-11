#!/bin/bash

# TinaCMS LMS - Quick Start Script

set -e

echo "🚀 TinaCMS LMS Docker Setup"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env and fill in your values:"
    echo "   - GIT_USER: Your GitHub username"
    echo "   - GIT_EMAIL: Your GitHub email"
    echo "   - GH_TOKEN: GitHub Personal Access Token (generate at https://github.com/settings/tokens)"
    echo "   - GITHUB_OWNER: Your GitHub username"
    echo "   - GITHUB_REPO: Repository name (e.g., cyberjab-cms)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Load environment variables
source .env

# Check required variables
MISSING=0

if [ -z "$GIT_USER" ]; then
    echo "❌ GIT_USER not set in .env"
    MISSING=1
fi

if [ -z "$GIT_EMAIL" ]; then
    echo "❌ GIT_EMAIL not set in .env"
    MISSING=1
fi

if [ -z "$GH_TOKEN" ]; then
    echo "❌ GH_TOKEN not set in .env"
    MISSING=1
fi

if [ -z "$GITHUB_OWNER" ]; then
    echo "❌ GITHUB_OWNER not set in .env"
    MISSING=1
fi

if [ -z "$GITHUB_REPO" ]; then
    echo "❌ GITHUB_REPO not set in .env"
    MISSING=1
fi

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "Please set the missing variables in .env and try again."
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Build and start
echo "🏗️  Building Docker image..."
docker-compose build

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ TinaCMS LMS is running!"
    echo ""
    echo "📍 Access Points:"
    echo "   Frontend:     http://localhost:3000"
    echo "   Admin Panel:  http://localhost:3000/admin"
    echo "   GraphQL API:  http://localhost:4001/graphql"
    echo ""
    echo "📝 Auto-Push Configuration:"
    echo "   Repository:   https://github.com/$GITHUB_OWNER/$GITHUB_REPO"
    echo "   Branch:       $GIT_BRANCH"
    echo "   User:         $GIT_USER"
    echo ""
    echo "💡 Changes made in the admin panel will automatically:"
    echo "   1. Commit to Git"
    echo "   2. Push to GitHub"
    echo "   3. Trigger webhooks (if configured)"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f cms"
    echo ""
    echo "🛑 Stop containers:"
    echo "   docker-compose down"
else
    echo ""
    echo "❌ Failed to start containers"
    echo ""
    echo "View logs:"
    echo "   docker-compose logs cms"
    exit 1
fi
