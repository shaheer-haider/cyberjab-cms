# LMS Migration Plan: Blog to Learning Management System

## Overview

This document outlines the migration from a blog-focused TinaCMS setup to a Learning Management System (LMS) focused on cybersecurity training content.

The goal is to have a Git-based headless CMS that provides APIs for managing and delivering LMS content including instructors, learning tracks, modules, lessons, and labs.
And at the same time we keep the history on the Git
---

## Current State (Blog CMS)

### Collections Being Removed
- ❌ **Posts** (`content/posts/`) - Blog posts
- ❌ **Authors** (`content/authors/`) - Blog authors
- ❌ **Tags** (`content/tags/`) - Post categorization
- ❌ **Pages** (`content/pages/`) - We dont need pages as project will be used only as a headless CMS

---

## Target State (LMS CMS)

### New Collections Structure

```
content/
├── instructors/       # Instructor profiles
├── tracks/            # Learning tracks (job/skill paths)
├── modules/           # Course modules
├── lessons/           # Individual lessons
├── labs/              # Hands-on lab exercises
├── topics/            # Categorization (Azure, KQL, Linux, etc.)
├── skills/            # Skill tags for content
├── global/            # Site-wide LMS settings
└── pages/             # Static pages (About, Contact, etc.)
```

---

## Data Model & Relationships

### Entity Relationship Diagram

```
┌─────────────┐
│   Topic     │◄───────────┐
│  (Azure,    │            │
│   KQL,      │            │
│   Linux)    │            │
└─────────────┘            │
                           │
┌─────────────┐            │         ┌─────────────┐
│ Instructor  │            │         │    Skill    │
│             │            │         │ (Log Anal-  │
│             │            │         │  ysis, IR)  │
└──────┬──────┘            │         └──────┬──────┘
       │                   │                │
       │ 1:N               │                │
       │                   │                │ M:N
       ▼                   │                │
┌─────────────┐            │                │
│   Module    │◄───────────┤                │
│             │            │                │
└──────┬──────┘            │                │
       │                   │                │
       │ 1:N               │                │
       │                   │                │
       ▼                   │                ▼
┌─────────────┐       ┌────┴────┐    ┌──────────┐
│   Lesson    │◄─────►│  Track  │    │   Lab    │◄────┐
│             │ M:N   │         │    │          │     │
└──────┬──────┘ via   └─────────┘    └────┬─────┘     │
       │      TrackStep                    │           │
       │ 1:0..1                            │ M:N       │
       │                                   │           │
       └───────────────────────────────────┘           │
         (lesson.lab reference)                        │
                                                       │
                                                  ┌────┴────┐
                                                  │ LabFlag │
                                                  └─────────┘
```

### Relationships Explained

1. **Instructor → Module** (1:N)
   - One instructor per module
   - One instructor can teach multiple modules

2. **Module → Lesson** (1:N)
   - One module contains multiple lessons
   - Each lesson belongs to exactly one module

3. **Track → Module** (M:N via TrackStep)
   - A track can contain multiple modules
   - A module can belong to multiple tracks
   - TrackStep provides ordering and metadata

4. **Lesson ↔ Lab** (1:0..1)
   - A lesson may have zero or one lab
   - A lab can optionally reference a lesson
   - Some labs are standalone (no lesson reference)

5. **Topic → Track/Module/Lab** (1:N categorization)
   - Topics categorize content (Azure, KQL, Windows Security)
   - Used for filtering and organization

6. **Skill → Lab** (M:N tagging)
   - Labs can teach multiple skills
   - Skills can be developed through multiple labs

7. **Lab → LabFlag** (1:N)
   - Challenge labs have multiple flags to capture
   - Guided labs typically have no flags

---

## TinaCMS Collections Design

### 1. Instructor Collection

**Location:** `content/instructors/*.md`

**Fields:**
```typescript
{
  name: 'instructor',
  label: 'Instructors',
  path: 'content/instructors',
  format: 'md',
  fields: [
    { name: 'firstName', type: 'string', required: true },
    { name: 'lastName', type: 'string', required: true },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'bio', type: 'rich-text' },
    { name: 'expertise', type: 'string', list: true },
    { name: 'yearsOfExperience', type: 'number' },
    { name: 'profileImage', type: 'image' },
    { name: 'linkedinUrl', type: 'string' },
    { name: 'githubUrl', type: 'string' },
    { name: 'websiteUrl', type: 'string' },
    { name: 'isActive', type: 'boolean', default: true },
    { name: 'slug', type: 'string', required: true },
  ]
}
```

**Example File:** `content/instructors/john-doe.md`

---

### 2. Topic Collection

**Location:** `content/topics/*.md`

**Fields:**
```typescript
{
  name: 'topic',
  label: 'Topics',
  path: 'content/topics',
  format: 'md',
  fields: [
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    { name: 'description', type: 'rich-text' },
    { name: 'icon', type: 'string', help: 'Icon name from lucide-react' },
    { name: 'color', type: 'string', default: '#6762F0', help: 'Hex color code' },
    { name: 'order', type: 'number', default: 0 },
  ]
}
```

**Example File:** `content/topics/azure-security.md`

---

### 3. Skill Collection

**Location:** `content/skills/*.md`

**Fields:**
```typescript
{
  name: 'skill',
  label: 'Skills',
  path: 'content/skills',
  format: 'md',
  fields: [
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    { name: 'description', type: 'rich-text' },
    {
      name: 'topic',
      type: 'reference',
      collections: ['topic'],
      help: 'Related topic category'
    },
  ]
}
```

**Example File:** `content/skills/log-analysis.md`

---

### 4. Module Collection

**Location:** `content/modules/*.mdx`

**Fields:**
```typescript
{
  name: 'module',
  label: 'Modules',
  path: 'content/modules',
  format: 'mdx',
  fields: [
    { name: 'externalId', type: 'string', help: 'UUID for import/export' },
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    { name: 'description', type: 'rich-text' },
    { name: 'short_description', type: 'string', max: 300 },
    {
      name: 'instructor',
      type: 'reference',
      collections: ['instructor'],
      required: true
    },
    {
      name: 'topic',
      type: 'reference',
      collections: ['topic']
    },
    { name: 'photo', type: 'image' },
    {
      name: 'difficulty',
      type: 'string',
      options: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    { name: 'durationHours', type: 'number', default: 0 },
    {
      name: 'accessLevel',
      type: 'string',
      options: ['free', 'basic', 'premium'],
      default: 'premium'
    },
    { name: 'isPublished', type: 'boolean', default: false },
    { name: 'isFeatured', type: 'boolean', default: false },
    { name: 'isCyberRange', type: 'boolean', default: false },
    { name: 'cyberRangeOrder', type: 'number', default: 0 },
  ]
}
```

**Example File:** `content/modules/azure-security-fundamentals.mdx`

---

### 5. Lesson Collection

**Location:** `content/lessons/*.mdx`

**Fields:**
```typescript
{
  name: 'lesson',
  label: 'Lessons',
  path: 'content/lessons',
  format: 'mdx',
  fields: [
    { name: 'externalId', type: 'string' },
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    {
      name: 'module',
      type: 'reference',
      collections: ['module'],
      required: true
    },
    { name: 'order', type: 'number', default: 0 },
    { name: 'body', type: 'rich-text', label: 'Content' },
    { name: 'durationMinutes', type: 'number', default: 15 },
    {
      name: 'lab',
      type: 'reference',
      collections: ['lab'],
      help: 'Optional: Link to associated lab'
    },
    { name: 'isCyberRange', type: 'boolean', default: false },
  ]
}
```

**Example File:** `content/lessons/understanding-azure-ad.mdx`

---

### 6. Lab Collection

**Location:** `content/labs/*.mdx`

**Fields:**
```typescript
{
  name: 'lab',
  label: 'Labs',
  path: 'content/labs',
  format: 'mdx',
  fields: [
    { name: 'externalId', type: 'string' },
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    { name: 'description', type: 'rich-text' },
    { name: 'short_description', type: 'string', max: 300 },
    {
      name: 'labType',
      type: 'string',
      options: ['guided', 'challenge'],
      default: 'guided',
      help: 'Guided lab or CTF challenge'
    },
    {
      name: 'topic',
      type: 'reference',
      collections: ['topic']
    },
    {
      name: 'skills',
      type: 'reference',
      collections: ['skill'],
      list: true
    },
    { name: 'photo', type: 'image' },
    { name: 'instructions', type: 'rich-text' },
    { name: 'solution', type: 'rich-text', help: 'Hidden from users' },
    {
      name: 'difficulty',
      type: 'string',
      options: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    { name: 'durationMinutes', type: 'number', default: 30 },
    { name: 'totalPoints', type: 'number', default: 100 },
    {
      name: 'accessLevel',
      type: 'string',
      options: ['free', 'basic', 'premium'],
      default: 'premium'
    },
    { name: 'isPublished', type: 'boolean', default: false },
    { name: 'isFeatured', type: 'boolean', default: false },
    { name: 'requiresCyberRange', type: 'boolean', default: false },

    // Challenge Lab Settings
    { name: 'timeLimitMinutes', type: 'number', help: 'For CTF challenges' },
    { name: 'allowHints', type: 'boolean', default: true },
    { name: 'hintPenaltyPercent', type: 'number', default: 10 },
    { name: 'maxAttempts', type: 'number', default: 0, help: '0 = unlimited' },

    // Extension settings
    { name: 'allowsExtension', type: 'boolean', default: false },
    { name: 'extensionMinutes', type: 'number', default: 15 },

    // Lab Flags (for CTF challenges)
    {
      name: 'flags',
      type: 'object',
      list: true,
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'description', type: 'string' },
        { name: 'flagValue', type: 'string', required: true },
        { name: 'points', type: 'number', default: 10 },
        { name: 'order', type: 'number', default: 0 },
        { name: 'hint', type: 'string' },
        { name: 'hintPenalty', type: 'number', default: 10 },
        { name: 'caseSensitive', type: 'boolean', default: false },
        { name: 'isRegex', type: 'boolean', default: false },
      ]
    },

    // Optional lesson reference
    {
      name: 'lesson',
      type: 'reference',
      collections: ['lesson'],
      help: 'Optional: If this lab is tied to a specific lesson'
    },
  ]
}
```

**Example File:** `content/labs/azure-ad-enumeration-challenge.mdx`

---

### 7. Track Collection

**Location:** `content/tracks/*.mdx`

**Fields:**
```typescript
{
  name: 'track',
  label: 'Tracks',
  path: 'content/tracks',
  format: 'mdx',
  fields: [
    { name: 'externalId', type: 'string' },
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    { name: 'description', type: 'rich-text' },
    { name: 'short_description', type: 'string', max: 300 },
    {
      name: 'trackType',
      type: 'string',
      options: ['job', 'skill', 'custom'],
      default: 'skill',
      help: 'Job Track (SOC Analyst) or Skill Track'
    },
    {
      name: 'topic',
      type: 'reference',
      collections: ['topic']
    },
    { name: 'photo', type: 'image' },
    { name: 'icon', type: 'string' },
    { name: 'color', type: 'string', default: '#6762F0' },
    {
      name: 'difficulty',
      type: 'string',
      options: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    { name: 'durationHours', type: 'number', default: 0 },
    {
      name: 'accessLevel',
      type: 'string',
      options: ['free', 'basic', 'premium'],
      default: 'premium'
    },
    { name: 'isPublished', type: 'boolean', default: false },
    { name: 'isFeatured', type: 'boolean', default: false },
    { name: 'isCyberRange', type: 'boolean', default: false },

    // Track Steps (ordered list of modules/labs)
    {
      name: 'steps',
      type: 'object',
      list: true,
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'description', type: 'string' },
        { name: 'order', type: 'number', required: true },
        {
          name: 'stepType',
          type: 'string',
          options: ['module', 'lab', 'checkpoint'],
          default: 'module'
        },
        {
          name: 'module',
          type: 'reference',
          collections: ['module'],
          help: 'If stepType is "module"'
        },
        {
          name: 'lab',
          type: 'reference',
          collections: ['lab'],
          help: 'If stepType is "lab"'
        },
        { name: 'isRequired', type: 'boolean', default: true },
        { name: 'isLocked', type: 'boolean', default: false },
      ]
    }
  ]
}
```
---

## Migration Steps

### Phase 1: Backup & Cleanup
1. ✅ Create this migration plan document
2. 🔲 Backup existing `content/` directory
3. 🔲 Backup existing `tina/collection/` files
4. 🔲 Remove blog collections: `post.tsx`, `author.ts`, `tag.ts`
5. 🔲 Delete blog content: `content/posts/`, `content/authors/`, `content/tags/`

### Phase 2: Create LMS Collections
1. 🔲 Create `tina/collection/instructor.ts`
2. 🔲 Create `tina/collection/topic.ts`
3. 🔲 Create `tina/collection/skill.ts`
4. 🔲 Create `tina/collection/module.tsx`
5. 🔲 Create `tina/collection/lesson.tsx`
6. 🔲 Create `tina/collection/lab.tsx`
7. 🔲 Create `tina/collection/track.tsx`
8. 🔲 Update `tina/collection/global.ts`

### Phase 3: Update TinaCMS Config
1. 🔲 Update `tina/config.tsx` to register new collections
2. 🔲 Remove old blog collections from config
3. 🔲 Run `tinacms codegen` to regenerate types

### Phase 4: Create Content Directories
1. 🔲 Create `content/instructors/`
2. 🔲 Create `content/topics/`
3. 🔲 Create `content/skills/`
4. 🔲 Create `content/modules/`
5. 🔲 Create `content/lessons/`
6. 🔲 Create `content/labs/`
7. 🔲 Create `content/tracks/`

### Phase 5: Update Frontend
1. 🔲 Remove blog routes: `app/posts/`
2. 🔲 Create LMS routes:
   - `app/tracks/[...slug]/`
   - `app/modules/[...slug]/`
   - `app/lessons/[...slug]/`
   - `app/labs/[...slug]/`
3. 🔲 Update navigation components
4. 🔲 Create LMS-specific UI components

### Phase 6: Seed Sample Content
1. 🔲 Create sample instructor
2. 🔲 Create sample topics (Azure, KQL, Linux)
3. 🔲 Create sample skills
4. 🔲 Create sample module with lessons
5. 🔲 Create sample lab
6. 🔲 Create sample track

### Phase 7: Testing
1. 🔲 Test visual editing in TinaCMS admin
2. 🔲 Test all reference fields work correctly
3. 🔲 Test frontend rendering of all content types
4. 🔲 Verify breadcrumb navigation
5. 🔲 Test build process

---

## Production Architecture & Git Workflow

### How TinaCMS Works as Headless CMS

TinaCMS can operate in **Self-Hosted Git Mode** where:
- ✅ Content updates automatically commit to Git
- ✅ Changes can auto-push to GitHub/GitLab
- ✅ Works in Docker containers
- ✅ Provides GraphQL API for content delivery
- ✅ Git history preserved for all changes

### Self-Hosted Git Setup (Production)

#### 1. **Git Authentication in Docker**

Your container needs GitHub credentials to push changes:

**Option A: Personal Access Token (Recommended)**
```dockerfile
# In your Docker container
ENV GH_TOKEN=ghp_your_token_here
ENV GIT_USER=your-github-username
ENV GIT_EMAIL=your@email.com

# Configure Git in container startup
RUN git config --global user.name "$GIT_USER" && \
    git config --global user.email "$GIT_EMAIL" && \
    git config --global credential.helper store
```

**Option B: SSH Keys**
```dockerfile
# Mount SSH keys as volume
VOLUME ["/root/.ssh"]

# Or copy during build
COPY .ssh/id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
```

#### 2. **TinaCMS Git Configuration**

```typescript
// tina/config.tsx
export default defineConfig({
  // ... other config

  // For self-hosted mode
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  // Git integration
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  // This enables Git-based backend
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
});
```

#### 3. **Auto-Commit & Push Workflow**

TinaCMS provides these options:

**Local Development:**
```bash
# TinaCMS dev mode with local Git
pnpm dev
# Edits create commits automatically in local repo
# You manually push: git push origin main
```

**Production (Docker):**
```typescript
// Add Git hooks for auto-push
// package.json
{
  "scripts": {
    "tina:push": "git push origin main",
    "postbuild": "npm run tina:push"
  }
}
```

Or use TinaCMS Cloud for managed Git operations (paid service).

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Container                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js + TinaCMS App                     │ │
│  │                                                        │ │
│  │  ┌──────────────┐         ┌────────────────┐         │ │
│  │  │  /admin      │         │  GraphQL API   │         │ │
│  │  │  (TinaCMS    │◄────────┤  (Port 3000)   │         │ │
│  │  │   Editor)    │         │                │         │ │
│  │  └──────┬───────┘         └────────┬───────┘         │ │
│  │         │                          │                  │ │
│  │         ▼                          ▼                  │ │
│  │  ┌──────────────────────────────────────────┐        │ │
│  │  │      File System (content/*.mdx)         │        │ │
│  │  └──────────────┬───────────────────────────┘        │ │
│  │                 │                                     │ │
│  │                 ▼                                     │ │
│  │  ┌──────────────────────────────────────────┐        │ │
│  │  │          Git Repository                  │        │ │
│  │  │  (auto-commit on content changes)        │        │ │
│  │  └──────────────┬───────────────────────────┘        │ │
│  └─────────────────┼─────────────────────────────────────┘ │
│                    │                                        │
│                    │ git push (with GH_TOKEN)               │
└────────────────────┼────────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  GitHub Repository │
            │  (lab-platform-cms)│
            └────────────────────┘
                     │
                     │ Webhook (optional)
                     ▼
            ┌────────────────────┐
            │  Trigger Rebuild   │
            │  or Notify Django  │
            └────────────────────┘
```

### API Access Patterns

#### Pattern 1: Direct GraphQL API (Recommended for LMS)

Your Django backend queries TinaCMS directly:

```python
# Django backend consuming TinaCMS API
import requests

TINA_CMS_URL = "https://cms.yourdomain.com"

def get_module(slug: str):
    query = """
    query ModuleQuery($relativePath: String!) {
      module(relativePath: $relativePath) {
        name
        description
        instructor {
          firstName
          lastName
        }
      }
    }
    """
    response = requests.post(
        f"{TINA_CMS_URL}/api/graphql",
        json={
            "query": query,
            "variables": {"relativePath": f"{slug}.mdx"}
        }
    )
    return response.json()
```

#### Pattern 2: Webhook-Based Sync

TinaCMS → GitHub → Webhook → Django:

```python
# Django webhook receiver
@csrf_exempt
def github_webhook(request):
    # Verify signature
    signature = request.headers.get('X-Hub-Signature-256')

    # Process content update
    payload = json.loads(request.body)

    if payload['ref'] == 'refs/heads/main':
        # Pull latest content
        # Parse MDX files
        # Update Django cache/database
        sync_content_from_cms()

    return HttpResponse(status=200)
```

#### Pattern 3: Scheduled Sync

Run periodic sync from Git:

```python
# Django management command
class Command(BaseCommand):
    def handle(self, *args, **options):
        # Clone/pull CMS repo
        repo = Repo.clone_from(
            'https://github.com/user/lab-platform-cms',
            'cms-content'
        )

        # Parse content
        for mdx_file in Path('cms-content/content').glob('**/*.mdx'):
            # Parse frontmatter + content
            # Update Django models
            self.sync_content(mdx_file)
```

### Environment Variables for Production

```bash
# .env.production
# TinaCMS
NEXT_PUBLIC_TINA_CLIENT_ID=<your-client-id>
TINA_TOKEN=<your-token>
NEXT_PUBLIC_TINA_BRANCH=main

# Git Integration
GIT_USER=github-username
GIT_EMAIL=email@example.com
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# API
NEXT_PUBLIC_API_URL=https://cms.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Django Backend URL (for webhooks)
DJANGO_WEBHOOK_URL=https://api.yourdomain.com/webhooks/cms-update
```

### Docker Deployment Example

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install git
RUN apk add --no-cache git

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Configure Git
RUN git config --global user.name "${GIT_USER}" && \
    git config --global user.email "${GIT_EMAIL}"

EXPOSE 3000

CMD ["pnpm", "start"]
```

```yaml
# docker-compose.yml
services:
  cms:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_TINA_CLIENT_ID=${NEXT_PUBLIC_TINA_CLIENT_ID}
      - TINA_TOKEN=${TINA_TOKEN}
      - GH_TOKEN=${GH_TOKEN}
      - GIT_USER=${GIT_USER}
      - GIT_EMAIL=${GIT_EMAIL}
    volumes:
      - ./content:/app/content
      - git-data:/app/.git
    restart: unless-stopped

volumes:
  git-data:
```

### Deployment Workflow

1. **Initial Setup:**
   ```bash
   # Clone repo in container
   git clone https://github.com/user/lab-platform-cms.git
   cd lab-platform-cms

   # Configure Git credentials
   git config user.name "CMS Bot"
   git config user.email "cms@yourdomain.com"

   # Set up token authentication
   git remote set-url origin https://${GH_TOKEN}@github.com/user/lab-platform-cms.git
   ```

2. **Content Update Flow:**
   ```bash
   # User edits content in /admin
   # TinaCMS saves file → auto-commit

   # Auto-push script (runs after save)
   git push origin main
   ```

3. **Django Backend Integration:**
   ```python
   # Option A: Poll for changes
   # Option B: GitHub webhook triggers sync
   # Option C: Query GraphQL API directly
   ```

### Security Considerations

1. **Token Storage:**
   - Use Kubernetes secrets or Docker secrets
   - Never commit tokens to repo
   - Rotate tokens regularly

2. **API Access:**
   - Enable CORS for your Django backend only
   - Use API keys for GraphQL queries
   - Rate limit the API

3. **Git Credentials:**
   - Use Personal Access Tokens (not passwords)
   - Minimal permissions (repo read/write only)
   - Consider using GitHub Apps for better security

### Advantages of This Setup

✅ **Git History:** Every content change is versioned
✅ **Rollback:** Easy to revert to previous versions
✅ **Audit Trail:** See who changed what and when
✅ **Collaboration:** Multiple content editors with conflict resolution
✅ **Backup:** Git serves as automatic backup
✅ **Review:** Can implement PR-based approval workflow
✅ **Deployment:** Content changes don't require app rebuilds

---

## Key Design Decisions

### ✅ What's Stored in TinaCMS
- Instructor profiles (static info)
- Module/lesson content (curriculum)
- Lab configurations (instructions, flags, settings)
- Track structure (learning paths)
- Topics and skills (taxonomy)

### ❌ What's NOT Stored in TinaCMS
- User progress tracking
- Lab sessions and submissions
- User stats and achievements
- Enrollment data
- Dynamic scoring/timing data

**Rationale:** TinaCMS is for content authoring only. All dynamic user data, progress tracking, and analytics should remain in your Django backend database.

---

## Content Authoring Workflow

### Creating a New Track (Example: "SOC Analyst Path")

1. **Create Topic** (if needed)
   - `/admin` → Topics → New
   - Name: "Security Operations"
   - Icon: "shield"
   - Color: "#6762F0"

2. **Create Instructor**
   - `/admin` → Instructors → New
   - Name: "John Doe"
   - Bio: "20 years in cybersecurity..."
   - Upload profile image

3. **Create Module**
   - `/admin` → Modules → New
   - Name: "SIEM Fundamentals"
   - Instructor: Select "John Doe"
   - Topic: Select "Security Operations"
   - Upload cover photo

4. **Create Lessons** (for the module)
   - `/admin` → Lessons → New
   - Module: Select "SIEM Fundamentals"
   - Write lesson content in rich-text editor
   - Set order: 1, 2, 3...

5. **Create Lab** (optional)
   - `/admin` → Labs → New
   - Link to lesson (or standalone)
   - Add flags for CTF challenges
   - Configure time limits, hints, etc.

6. **Create Track**
   - `/admin` → Tracks → New
   - Name: "SOC Analyst Path"
   - Add steps with modules and labs
   - Set ordering and requirements

---

## Next Steps

1. **Review this plan** - Does this match your vision?
2. **Approve relationships** - Are the connections between entities correct?
3. **Start implementation** - Begin with Phase 1 (backup & cleanup)
4. **Iterative feedback** - Test as we build each collection

---

## Questions to Answer Before Starting

- [ ] Do you want to keep the `pages` collection for static pages?
- [ ] Should Topics have hierarchies (parent/child)?
- [ ] Do you need versioning for lesson content?
- [ ] Should tracks support prerequisites (Track A required before Track B)?
- [ ] Do you want draft/review workflow for content approval?

---

**Last Updated:** 2026-01-08
**Status:** 📝 Planning Phase
**Next Action:** Review and approve this plan
