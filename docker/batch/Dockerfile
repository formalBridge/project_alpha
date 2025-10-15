# Base image - Node.js LTS
FROM node:20-alpine AS base
WORKDIR /app

# -----------------------------
# deps: install node modules and generate prisma client
# -----------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN corepack enable pnpm && \
    pnpm install --frozen-lockfile --prod=false && \
    pnpm prisma generate

# -----------------------------
# builder: build TS scripts with tsup -> dist/
# -----------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Use the same bundling command as in package.json (outputs to /app/dist)
RUN corepack enable pnpm && pnpm run build:scripts

# -----------------------------
# runner: minimal runtime image
# -----------------------------
FROM base AS runner
ENV NODE_ENV=production
# copy runtime deps and prisma artifacts
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
# copy bundled output (dist/) produced by tsup, includes scripts/* and app/external/music/*
COPY --from=builder /app/dist ./dist

# default command: run job-runner; JOB_NAME must be provided as env
# e.g. JOB_NAME=dist/scripts/spotify-backfill.js
CMD ["node", "dist/scripts/job-runner.js"]
