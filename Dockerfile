# syntax=docker.io/docker/dockerfile:1.7

FROM oven/bun:1.2.15-alpine AS bun

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY --from=bun /usr/local/bin/bunx /usr/local/bin/bunx

FROM base AS pruner
WORKDIR /app
COPY docs ./docs

WORKDIR /app/docs
RUN pnpm dlx turbo@2.9.6 prune docs --docker --out-dir /app/pruned

FROM base AS builder
WORKDIR /app/docs

COPY --from=pruner /app/pruned/json/ ./
COPY --from=pruner /app/pruned/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/pruned/full/ ./
COPY docs/examples ./examples
COPY docs/packages/base-ui ./packages/base-ui
COPY docs/packages/shared ./packages/shared
RUN pnpm turbo run build --filter=docs...

RUN mkdir -p /app/runtime/apps/docs/.next
RUN cp -R apps/docs/.next/standalone/. /app/runtime/
RUN cp -R apps/docs/.next/static /app/runtime/apps/docs/.next/static
RUN cp -R apps/docs/public /app/runtime/apps/docs/public

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/runtime ./

USER nextjs

EXPOSE 3000

CMD ["node", "apps/docs/server.js"]
