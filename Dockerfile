# syntax=docker/dockerfile:1.7
# FindryAI 自托管镜像。构建期秘密通过 BuildKit secret 注入，不进入镜像层。
ARG NODE_VERSION=22.18.0
FROM node:${NODE_VERSION}-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1 \
    PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates tini \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g pnpm@11.22.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
# 公开构建期变量：NEXT_PUBLIC_* 会被固化进产物，不同环境必须分别构建。
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
ARG NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_OPENPANEL_CLIENT_ID
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_PLAUSIBLE_SCRIPT
ARG NEXT_PUBLIC_UMAMI_SCRIPT
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ARG BUILD_SECRET_TEST=0
# 构建期占位值：仅为让模块级 SDK 初始化通过页面数据收集；不会进入 runner 阶段，
# 运行期仍由 env_file 注入真实密钥，缺失时由部署预检拦截。
ENV RESEND_API_KEY=re_build_placeholder \
    STRIPE_API_KEY=sk_test_build_placeholder \
    AUTH_SECRET=build-placeholder-not-for-runtime \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID \
    NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET \
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=$NEXT_PUBLIC_STRIPE_PRO_PRICE_ID \
    NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID=$NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID \
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=$NEXT_PUBLIC_GOOGLE_ANALYTICS_ID \
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID=$NEXT_PUBLIC_OPENPANEL_CLIENT_ID \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_PUBLIC_PLAUSIBLE_SCRIPT=$NEXT_PUBLIC_PLAUSIBLE_SCRIPT \
    NEXT_PUBLIC_UMAMI_SCRIPT=$NEXT_PUBLIC_UMAMI_SCRIPT \
    NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 仅用于 CI 验证 BuildKit secret 不会进入最终镜像层；默认关闭。
RUN --mount=type=secret,id=test_marker if [ "$BUILD_SECRET_TEST" = "1" ] && [ -f /run/secrets/test_marker ]; then cp /run/secrets/test_marker /tmp/secret-marker; fi
# 构建期需要读取 Sanity 内容；token 仅存在于该 RUN 的临时挂载中。
RUN --mount=type=secret,id=sanity_token \
    SANITY_API_TOKEN="$(cat /run/secrets/sanity_token)" \
    pnpm build

FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs \
 && mkdir -p /app/.next/cache \
 && chown -R nextjs:nodejs /app
WORKDIR /app
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server.js"]
