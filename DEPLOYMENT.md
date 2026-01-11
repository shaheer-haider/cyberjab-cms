# TinaCMS LMS - Docker Deployment Guide

## Quick Start

### 1. Create GitHub Personal Access Token

1. Go to **GitHub Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name: `tinacms-autopush`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. Copy the token (starts with `ghp_...`) - **you won't see it again!**

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```bash
# Git Configuration
GIT_USER=your-github-username
GIT_EMAIL=your-email@example.com
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GitHub Repository
GITHUB_OWNER=your-github-username
GITHUB_REPO=cyberjab-cms

# TinaCMS (optional - for cloud features)
TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
TINA_BRANCH=main

# Git Settings
GIT_REMOTE=origin
GIT_BRANCH=main
```

### 3. Build and Run

#### Option A: Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f cms

# Stop
docker-compose down
```

#### Option B: Docker CLI

```bash
# Build
docker build -t cyberjab-cms .

# Run
docker run -d \
  --name cyberjab-cms \
  -p 3000:3000 \
  -p 4001:4001 \
  --env-file .env \
  -v $(pwd)/content:/app/content \
  -v $(pwd)/.git:/app/.git \
  -v $(pwd)/public/uploads:/app/public/uploads \
  cyberjab-cms
```

### 4. Access the CMS

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **GraphQL API**: http://localhost:4001/graphql

## How Auto-Push Works

### When You Save Content in TinaCMS:

1. **TinaCMS writes** → File updated in `content/` directory
2. **Docker container detects** → Git monitors file changes
3. **Auto-commit** → `git add . && git commit -m "Update from TinaCMS"`
4. **Auto-push** → `git push origin main`
5. **GitHub receives** → Changes appear in your repository

### Git Configuration

The Docker container automatically:
- Configures Git user and email
- Sets up GitHub authentication with token
- Adds remote repository URL
- Enables auto-commit/push on content changes

### Viewing Git Activity

```bash
# Check container logs for Git operations
docker-compose logs -f cms | grep -i git

# Check Git status inside container
docker-compose exec cms git status

# View recent commits
docker-compose exec cms git log --oneline -10
```

## Deployment Scenarios

### Development (Local)

```bash
# Run locally without Docker
bun run dev

# Manual Git workflow
git add .
git commit -m "Update content"
git push
```

### Staging (Docker with Auto-Push)

```yaml
# docker-compose.staging.yml
services:
  cms:
    environment:
      - TINA_BRANCH=staging
      - GIT_BRANCH=staging
```

```bash
docker-compose -f docker-compose.staging.yml up -d
```

### Production (Docker with Auto-Push)

```yaml
# docker-compose.prod.yml
services:
  cms:
    environment:
      - TINA_BRANCH=main
      - GIT_BRANCH=main
      - NODE_ENV=production
    restart: always
```

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Integration with Django Backend

### Option 1: GitHub Webhooks (Recommended)

```python
# Django webhook endpoint
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import subprocess

@csrf_exempt
def tina_webhook(request):
    if request.method == 'POST':
        # Pull latest content
        subprocess.run(['git', 'pull', 'origin', 'main'], cwd='/path/to/content')

        # Sync to database
        sync_content_to_db()

        return JsonResponse({'status': 'synced'})
```

**GitHub Webhook Setup:**
1. Go to **Repository Settings** → **Webhooks** → **Add webhook**
2. Payload URL: `https://your-django-api.com/api/webhooks/tina`
3. Content type: `application/json`
4. Events: Select **"Just the push event"**

### Option 2: Scheduled Sync (Cron Job)

```python
# Django management command: sync_cms.py
from django.core.management.base import BaseCommand
import subprocess

class Command(BaseCommand):
    def handle(self, *args, **options):
        # Pull latest
        subprocess.run(['git', 'pull'], cwd='/path/to/cms/content')

        # Sync content
        from apps.lms.utils import sync_content
        sync_content()
```

```bash
# Crontab
*/5 * * * * cd /path/to/django && python manage.py sync_cms
```

### Option 3: Direct GraphQL API

```python
# Django service
import requests

class TinaCMSService:
    def __init__(self):
        self.api_url = "http://cms-container:4001/graphql"

    def get_module(self, slug):
        query = '''
        query($relativePath: String!) {
            module(relativePath: $relativePath) {
                name
                description
                instructor { firstName lastName }
            }
        }
        '''
        response = requests.post(self.api_url, json={
            'query': query,
            'variables': {'relativePath': f'{slug}.mdx'}
        })
        return response.json()
```

## Monitoring and Troubleshooting

### Health Check

```bash
# Check if container is healthy
docker-compose ps

# Test endpoint
curl http://localhost:3000/api/health
```

### Common Issues

#### 1. Git Push Fails

```bash
# Check Git credentials
docker-compose exec cms git config --list

# Test GitHub connection
docker-compose exec cms git ls-remote origin

# Fix: Update token in .env and restart
docker-compose down && docker-compose up -d
```

#### 2. Permission Errors

```bash
# Fix ownership
docker-compose exec cms chown -R nextjs:nodejs /app

# Restart
docker-compose restart cms
```

#### 3. Content Not Updating

```bash
# Check volume mounts
docker-compose exec cms ls -la /app/content

# Force sync
docker-compose exec cms git pull origin main

# Restart
docker-compose restart cms
```

### Logs

```bash
# All logs
docker-compose logs -f

# Only CMS logs
docker-compose logs -f cms

# Last 100 lines
docker-compose logs --tail=100 cms

# Git operations only
docker-compose logs -f cms | grep -i "git\|commit\|push"
```

## Security Best Practices

### 1. Never Commit Secrets

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. Use Docker Secrets (Production)

```yaml
# docker-compose.prod.yml
secrets:
  gh_token:
    file: ./secrets/gh_token.txt

services:
  cms:
    secrets:
      - gh_token
    environment:
      - GH_TOKEN_FILE=/run/secrets/gh_token
```

### 3. Rotate GitHub Tokens

- Rotate tokens every 90 days
- Use fine-grained tokens with minimal permissions
- Monitor token usage in GitHub Settings

## Backup and Recovery

### Backup Content

```bash
# Backup content directory
docker-compose exec cms tar -czf /tmp/content-backup.tar.gz /app/content

# Copy to host
docker cp cyberjab-cms:/tmp/content-backup.tar.gz ./backups/
```

### Restore Content

```bash
# Copy backup to container
docker cp ./backups/content-backup.tar.gz cyberjab-cms:/tmp/

# Extract
docker-compose exec cms tar -xzf /tmp/content-backup.tar.gz -C /app

# Commit and push
docker-compose exec cms git add .
docker-compose exec cms git commit -m "Restore from backup"
docker-compose exec cms git push origin main
```

## Performance Optimization

### 1. Enable Caching

```dockerfile
# Add to Dockerfile
ENV NEXT_PUBLIC_CACHE_ENABLED=true
```

### 2. Use Build Cache

```bash
# Build with cache
docker-compose build --build-arg BUILDKIT_INLINE_CACHE=1
```

### 3. Resource Limits

```yaml
# docker-compose.yml
services:
  cms:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Support

For issues, see:
- [TinaCMS Documentation](https://tina.io/docs)
- [GitHub Issues](https://github.com/your-org/cyberjab-cms/issues)
- [LMS-MIGRATION.md](./LMS-MIGRATION.md) for architecture details
