#!/bin/sh
set -e

echo "🚀 Starting TinaCMS LMS..."

# Configure Git if credentials are provided
if [ -n "$GIT_USER" ] && [ -n "$GIT_EMAIL" ]; then
    echo "📝 Configuring Git user..."
    git config --global user.name "$GIT_USER"
    git config --global user.email "$GIT_EMAIL"
fi

# Configure Git authentication with GitHub token
if [ -n "$GH_TOKEN" ]; then
    echo "🔐 Configuring GitHub authentication..."

    # Set up credential helper for HTTPS
    git config --global credential.helper store

    # Store credentials
    if [ -n "$GITHUB_OWNER" ] && [ -n "$GITHUB_REPO" ]; then
        echo "https://${GH_TOKEN}@github.com" > ~/.git-credentials

        # Set remote URL with token
        REPO_URL="https://${GH_TOKEN}@github.com/${GITHUB_OWNER}/${GITHUB_REPO}.git"
        git remote set-url origin "$REPO_URL" 2>/dev/null || \
        git remote add origin "$REPO_URL" 2>/dev/null || true
    fi
fi

# Initialize git repository if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit from Docker" || true
fi

# Fetch latest changes
if [ -n "$GIT_BRANCH" ]; then
    echo "🔄 Syncing with remote branch: $GIT_BRANCH"
    git fetch origin "$GIT_BRANCH" 2>/dev/null || true
    git reset --hard "origin/$GIT_BRANCH" 2>/dev/null || true
fi

echo "✅ Git configuration complete"
echo "🦙 TinaCMS will auto-commit and push changes to GitHub"

# Execute the main command
exec "$@"
