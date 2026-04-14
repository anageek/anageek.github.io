# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Enable corepack for Yarn 4
RUN corepack enable && corepack prepare yarn@4.10.3 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

# Stage 2: Build the application
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.10.3 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY . .

# Build args for env vars needed at build time
ARG SESSION_SECRET=build-placeholder-secret-that-is-at-least-32-chars
ARG ADMIN_EMAIL=build@placeholder.com
ARG ADMIN_PASSWORD_HASH=placeholder

ENV SESSION_SECRET=${SESSION_SECRET}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH}
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# Stage 3: Production runner
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy public assets (static images already in repo)
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create data directory for SQLite (will be mounted as volume)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Create uploads directory (will be mounted as volume)
RUN mkdir -p /app/public/images/uploads && chown nextjs:nodejs /app/public/images/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
