FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NO_TELEMETRY 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

ENV GITHUB_BRANCH='main'
ENV GITHUB_OWNER=''
ENV GITHUB_REPO=''
ENV NEXTAUTH_URL=''

WORKDIR /app

# ENV NO_TELEMETRY 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tinacms

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/_site ./_site
COPY --from=builder /app/dist ./dist

USER tinacms

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]
