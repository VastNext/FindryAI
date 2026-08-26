# AGENTS.md

此文件所以告往来代码代理（Codex、Cursor、OpenCode 等）者，览之可悉本库之要。

## 项目概览

Findry AI 者，以 Next.js 十四（App Router）所造之 AI 工具目录网站也。内含 Sanity 内容管理、AI 助投、Stripe 支付、NextAuth 五代认证、博客暨邮件能力。包管理器用 **pnpm**（有 `pnpm-lock.yaml` 为凭）。

## 版本控制

- 每完成一组可独立说明、可验证的改动，立即创建 Git commit；不得累积多个无关改动，亦不得遗留已完成而未提交的修改。
- 提交前检查 diff，只暂存本次改动相关文件；不将每次文件保存拆成提交，提交须保持完整且可用。

### 功能分支预览交付流程

凡功能分支之改动可由网页观察（如页面、组件、样式、交互或公开路由），完成后必须依下列次序交付：

1. 运行与改动相称的验证；确认通过后提交当前分支。
2. 先将当前分支推送至远端；确认 push 成功后方可部署。
3. 将工作树绑定到既有 Vercel 项目，执行普通 `vercel deploy` 创建 **Preview**；不得使用 `--prod`。
4. 等待构建结束，以 `vercel inspect <preview-url>` 确认 `target=preview` 且 `status=Ready`。
5. 将 Preview URL 明确交给用户，说明此部署不影响生产环境，并以该地址继续收集反馈、修改、验证、提交、push 与重新部署。
6. 用户确认 Preview 符合预期后，主动询问是否合并至 `main`；仅在用户明确同意后方可合并或创建合并 PR。

**门禁**：Preview 地址交付之前，不得询问是否合并 `main`；用户明确确认之前，不得自行合并 `main`、提升 Preview 至 Production，亦不得运行 `vercel --prod`。

纯文档、内部脚本、无可访问页面的后端改动，或仓库未配置 Vercel 项目时，可不部署 Preview；交付时须说明不适用原因。若 Preview 构建失败，先修复并重新走验证、提交、push、部署流程，不得以失败地址作为验收地址。

## 生产部署（tag 触发）

生产环境**只允许**经由 GitHub Actions 部署，**禁止**手动运行 `vercel deploy --prod`（手动部署不经过 CI，会绕过本库发布门禁）。

- **工作流**：`.github/workflows/deploy.yml`（名「Deploy to Vercel」）
- **触发条件**：推送 `v*` tag（通常基于 `main`）；另支持 `workflow_dispatch` 手动触发
- **所需 GitHub Secrets（仓库级，勿写入代码或文档）**：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`、`VERCEL_PROJECT_NAME`
- **发布流程**：
  1. 确认 `main` 为最新且本地无未提交改动（`git fetch origin && git rev-parse origin/main && git status --short`）
  2. 打 annotated tag：`git tag -a vX.Y.Z -m "Release vX.Y.Z: <摘要>" <main-commit>`
  3. 推送 tag：`git push origin vX.Y.Z`（此举触发 Actions 部署）
  4. 以 `gh -R VastNext/FindryAI run list` 等候 Actions run 成功（留意对应 tag 与 `completed success`）
  5. 以 `vercel inspect findryai.com` 核对生产指向：`target=production` 且部署 URL 与 Actions run 产出一致
  6. 生产冒烟验证：如翻译器可 `curl -X POST https://findryai.com/api/translate -H "Content-Type: application/json" -d '{"text":"Hello","sourceLanguage":"auto","targetLanguage":"zh-CN","providers":["agnes-2-0"]}'`
- **生产环境变量**（如 `AGNES_API_KEY`）以 `vercel env add <NAME> production` 配置于 Vercel 项目（类型 Sensitive）；GitHub Actions 部署到同一项目会自动采用该项目已配置的生产环境变量，无需另行传入。密钥绝不写入仓库或 GitHub Secrets 之外的明文位置。
- **本地 `.env.local`** 仅供本地开发（已被 `.gitignore` 忽略），与生产环境变量相互独立；本地改动配置不影响线上。

## 指令

- **开发服务**：`pnpm dev`
- **构建**：`pnpm build`（兼司类型之察——库中别无 typecheck 之令）
- **Lint**：`pnpm lint`（只读检查，不得改写文件）
- **Lint 兼不安全之修**：`pnpm lint:fix`（会改写文件，须先确认工作区状态）
- **格式化**：`pnpm format`（会改写文件，须先确认工作区状态）
- **生成 Sanity 类型**：`pnpm typegen` —— **凡改 `src/sanity/schemas/` 者，必随后行之**；所以再生 `sanity.types.ts`，此文件已入库受版本管理
- **邮件预览**：`pnpm email`（React Email 开发服务，居三千三百三十三端口）
- **条目批处理**：`pnpm item:import`、`pnpm item:fetch`、`pnpm item:update`、`pnpm item:remove`
- **诸实体批处理**（类目、标签、分组、条目）：`pnpm batch`（或 `pnpm batch:import`、`pnpm batch:update`、`pnpm batch:remove`）

### 测试

库中**无测试之框架，亦无测试之文件**。欲验所改，唯只读之 `pnpm lint` 与 `pnpm build` 二途。

### 批量导入新站点

批量脚本（`scripts/batch-item.ts`）经本地 OpenAI 兼容网关调用 AI（`AI_BASE_URL` 等 env，默认 `http://localhost:20128/v1`），**无需代理**。流程：

1. 改 `scripts/batch-item.ts` 之 `links` 数组，列入欲导入之 URL
2. 单条试采：`npx tsx scripts/batch-item.ts fetch <url>`（观 AI 抓取与分类匹配之效）
3. 正式入库：`npx tsx scripts/batch-item.ts import`（脚本径置 `pricePlan=free`、`freePlanStatus=approved`、`publishDate=now`，不经审核即发布）
4. 移除所有条目：`npx tsx scripts/batch-item.ts remove`

注：脚本依赖 `.env` 中 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`SANITY_API_TOKEN`、`AI_BASE_URL`、`AI_API_KEY`、`AI_MODEL` 诸项齐备。AI 返回之分类/标签须站内已有方可匹配（空站会过滤为空），宜先在 `/studio` 或经 `scripts/batch-category.ts`、`scripts/batch-tag.ts` 建基础分类标签。

### Cloudflare 反代 Vercel（国内直连）

`*.vercel.app` 域被 DNS 污染、国内直连不通。以自有域名 + Cloudflare 橙云代理可绕开：用户 → Cloudflare 边缘（港/新/日）→ Vercel 源站，全程不接触 vercel.app 域名/IP。

**两要件缺一不可**：
1. DNS CNAME 记录开**橙云代理**（`proxied: true`，灰云则仍是直连 Vercel 被墙）
2. Cloudflare **SSL/TLS 必须 Full / Full (strict)**（Flexible 时 CF→源走 HTTP，Vercel 强制 308 跳 HTTPS，成重定向死循环）

**正确时序（先灰云后橙云，防 525）**：
1. 先加**灰云** CNAME，让 Vercel 完成域名验证并签发证书
2. 等 `vercel domains inspect` 配置正确、直连 https 返回 200（证书就绪）
3. **再开橙云**——若此时 525（SSL 握手失败），查源站证书是否就绪，而非 SSL 模式；若改过模式为 Flexible 则调回 Full

CF API 操作：Token 存 `.env` 之 `CF_API_TOKEN`；列表 `GET zones/{zoneId}/dns_records`，改代理 `PATCH .../dns_records/{id}` body `{"proxied":true|false}`。SSL 设置 `GET .../settings/ssl` 需更高权限 Token（仅 DNS 权限的 Token 会被拒），需人工在面板确认。

## 架构

### 路由之构（Next.js App Router）

`src/app/` 之下，有二顶层路由组：

- `(website)/` —— 正站也，内复分组：
  - `(public)/` —— 公开之页：首页、搜索、条目、类目、标签、合集、博客、定价
  - `(protected)/` —— 须认证之页：仪表盘、设置、投稿、编辑
  - `(newsletter)/` —— 邮件列表退订
  - `auth/` —— 登录、注册、重置密码、邮箱验核
- `(sanity)/` —— Sanity Studio 管理界面（挂于 `/studio`）

`src/app/api/` —— API 路由：曰 `auth`（NextAuth）、曰 `webhook`（Stripe）、曰 `og`（OG 图之生成）、曰 `draft` 与 `disable-draft`（Sanity 预览）、曰 `send-email`、曰 `upload-image`。

### 路由之守

`src/routes.ts` 定公开路由、认证路由及 API 认证前缀。`src/middleware.ts` 司门禁。已登录者访认证之页，则迁于 `/dashboard`。

### 数据之层

- **Sanity CMS** 乃内容正仓。模式藏于 `src/sanity/schemas/documents/`，以域分目：`directory/`（条目、类目、标签、合集、分组）、`blog/`（帖、作者）、`page/`、`order/`、`auth/`，及 `settings.ts`。
- **`src/data/`** 藏数据存取之函数（item.ts、blog.ts、collection.ts、user.ts、account.ts、order.ts、submission.ts 之类），服务端组件与动作咸用之。
- **`src/sanity/lib/`** 藏 Sanity 客户端器具及 GROQ 查询之助。
- **`sanity.types.ts`** 乃自 Sanity 模式所生之类型——勿手改之；欲其更新，行 `pnpm typegen`。

### 服务端动作

凡有变更，皆经 `src/actions/` 之服务端动作（一事一文件）：认证（登录、注册、重置）、条目操作（投稿、编辑、发布、下架）、支付（结账会话、客户门户）、设置、邮件列表及管理员诸务。

### 要集成

- **认证**：NextAuth 五代 beta，配置在 `src/auth.ts` 与 `src/auth.config.ts`。凭证兼 OAuth（Google、GitHub）。
- **支付**：Stripe 经由 `src/lib/stripe.ts`；webhook 处理在 `src/app/api/webhook/route.ts`。
- **AI**：Vercel AI SDK，供多家（Google、DeepSeek、OpenAI、xAI、OpenRouter），以环境变量 `DEFAULT_AI_PROVIDER` 择之。
- **邮件**：React Email 模板在 `emails/`，经 Resend 发送（`src/lib/mail.ts`）。
- **图片元数据**：Microlink（`@microlink/mql`），所以取网站截图与元数据。

### 配置

- `src/config/site.ts` —— 全站设置（名、址、述）
- `src/config/price.ts` —— 定价方案
- `src/config/dashboard.ts` —— 仪表盘导航
- `src/config/hero.ts`、`footer.ts`、`faq.ts`、`marketing.ts` —— 落地页诸节
- `src/lib/constants.ts` —— 共享常量
- `src/lib/schemas.ts` —— Zod 校验模式，表单与动作共用

### 样式

Tailwind CSS，配置在 `tailwind.config.ts`。UI 基元乃 Radix UI 系 shadcn/ui 组件，居 `src/components/ui/` —— **Biome 略过 `src/components/ui/*.tsx`**（生成之代码，勿手修其 lint 之弊）。组件以功能域分目于 `src/components/`（落地页有 `home/`、`home2/`、`home3/` 诸变体）。

## 环境

复制 `.env.example` 为 `.env`。要变量如下（名已核于 `.env.example`）：

- 站点：`NEXT_PUBLIC_APP_URL`
- Sanity：`NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`SANITY_API_TOKEN`
- 认证：`AUTH_SECRET`（另有可选 `AUTH_GOOGLE_ID/SECRET`、`AUTH_GITHUB_ID/SECRET`；Docker 则加 `AUTH_TRUST_HOST=true`）
- Stripe：`STRIPE_API_KEY`、`STRIPE_WEBHOOK_SECRET`、`NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`、`NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID`
- 邮件：`RESEND_API_KEY`、`RESEND_EMAIL_FROM`、`RESEND_EMAIL_ADMIN`、`RESEND_AUDIENCE_ID`
- AI：`DEFAULT_AI_PROVIDER`（取 `google`、`deepseek`、`openai`、`xai`、`openrouter` 之一）及其对应之 API key

## 陷阱

- `pnpm lint` 写修于文件——勿以为只读之察；欲只读，径用 `biome check .`。
- `scripts/` 批处理脚本经 `tsx` 运行，自理 `dotenv.config()`，直连 Sanity API——须 `.env` 齐备，且**将改动生产内容**。
- React Strict Mode 致邮箱验核表单（`new-verification-form`）开发模式下连发二次；此开发之独癖，非改之过（详见 `next.config.mjs` 中注释）。
- 生产构建剔除 `console.*` 诸调用（`next.config.mjs` 中 `removeConsole` 编译选项）。
- Next 图片设 `unoptimized: true` 且 `dangerouslyAllowSVG: true`（为 Sanity CDN 之 SVG）——添图片功能时宜留意。
- 库无 CI 流水线；规约唯 Biome 执之。
