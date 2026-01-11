# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:22-alpine AS deps

# Install build dependencies for native modules (bcrypt, sharp)
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# ========================================
# Stage 2: Builder
# ========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (migrate runs at runtime, not build time)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG DB_HOST
ENV DB_HOST=${DB_HOST}
ARG DB_USER
ENV DB_USER=${DB_USER}
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
ARG DB_DATABASE
ENV DB_DATABASE=${DB_DATABASE}
ARG DB_TYPE
ENV DB_TYPE=${DB_TYPE}
ARG LYNX_API_URL
ENV LYNX_API_URL=${LYNX_API_URL}
ARG LYNX_PORT
ENV LYNX_PORT=${LYNX_PORT}
RUN npx prisma migrate deploy
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# ========================================
# Stage 3: Production Runner
# ========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install production dependencies
RUN apk add --no-cache libc6-compat

# Add yt-dlp for video downloading functionality
RUN apk add --no-cache ffmpeg python3 py3-pip \
    && pip3 install --break-system-packages yt-dlp

# Set environment to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the entire build output (not using standalone)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bot ./bot
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/types ./types

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000
EXPOSE ${LYNX_PORT}

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application (both Next.js server and Discord bot)
CMD ["npm", "run", "start"]
