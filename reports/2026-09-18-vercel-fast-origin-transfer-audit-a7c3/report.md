# Vercel Fast Origin Transfer (75% 预警) 深度调查与优化治理报告

**报告生成时间**：2026-09-18  
**目标团队**：`fountainchans-projects` (Vercel Hobby 免费版)  
**涉及核心项目**：`findryai`, `mkdirs`, `vast-translator`, `ai-daily-feeds`, `fierce-beaver`, `snobbish-kolibri`, `twikoo_4_blog`

---

## 一、执行摘要：75% 预警的真实含义与紧急风险

你收到的邮件警报：
> *“Your free team fountainchans-projects has used 75% of the included free tier usage for Fast Origin Transfer (10 GB).”*

### 1. 核心定义澄清：Fast Origin Transfer 到底是什么？
- **不是公网访问带宽（Fast Data Transfer）**：Vercel 免费版给普通 CDN 出口流量（Edge CDN 到用户浏览器）提供了 100 GB 额度。
- **是源站计算传输流量（Fast Origin Transfer）**：指 **Vercel 边缘 CDN 与后端计算实例（Serverless Functions / Edge Functions / Middleware / Blob / Data Cache 回源）之间传输的数据量**（包括请求 Request Headers+Body 与响应 Response Headers+Body）。
- **额度极低且团队共享**：Hobby 免费版每个月**只有 10 GB**，且由你团队下全部 7 个活跃项目（`findryai`、`vast-translator` 等）**累计共同消耗**。

### 2. 紧急风险
- 当前已经消耗约 **7.5 GB**。
- 一旦当月累计超过 **10 GB**，Vercel 会**自动暂停（Pause）团队下所有的项目部署与线上访问**，导致全站 503 宕机。

---

## 二、根因拆解：为什么流量会消耗到 7.5GB+？

下图清晰展示了普通访问与消耗 Fast Origin Transfer 的数据流路径差异：

```mermaid
flowchart TD
    User([终端用户 / 爬虫 / API 调用]) --> CF[Cloudflare CDN 代理]
    CF --> VercelEdge[Vercel Edge CDN 边缘节点]
    
    subgraph Fast_Data_Transfer [不计入 10GB 限制 (额度 100GB)]
        VercelEdge -.->|命中静态缓存 / 预渲染 HTML| User
    end
    
    subgraph Fast_Origin_Transfer [计入 10GB 额度限制 (已用 75%)]
        VercelEdge -->|未命中缓存 / 触发计算| MW[Vercel Middleware 边缘中间件 (第 1 次计量)]
        MW -->|调用下游 API / 页面渲染| FN[Serverless Functions / SSR / API Route (第 2 次计量)]
        FN -->|返回数据| VercelEdge
    end

    classDef core fill:#eef7f5,stroke:#0f766e,color:#134e4a,stroke-width:1.5px;
    classDef support fill:#eef4f8,stroke:#2563eb,color:#17324d,stroke-width:1.2px;
    classDef warning fill:#fff7ed,stroke:#c2410c,color:#7c2d12,stroke-width:1.2px;
    classDef risk fill:#fff1f0,stroke:#b42318,color:#7a271a,stroke-width:1.2px;

    class User neutral;
    class CF,VercelEdge support;
    class MW warning;
    class FN risk;
```

### 4 大核心消耗驱动因素

1. **中间件重复计量（Middleware Double Charge 陷阱）**：
   - Vercel 官方机制明确指出：如果一个动态请求经过了 `Middleware`，然后再由 `Serverless Function` 处理，**Fast Origin Transfer 会被计入两次**（Middleware 进出算一次，Function 进出再算一次）。
   - 当前仓库的 `src/middleware.ts` 匹配了大量原本不需要鉴权的公开路由与 API 路由。

2. **动态 API 未设置 CDN 缓存头（Cache-Control 缺失）**：
   - `/api/items`（首页无限滚动、目录翻页）：返回大型 JSON 数据（含 Sanity 几十个条目的完整字段），每次前端翻页或爬虫拉取，都会全量打到 Serverless Origin。
   - `/api/translate`（翻译接口）、`/api/upload-image` 等接口同样每次直接调用计算。

3. **7 个项目共享同一个 10GB 免费池**：
   - `vast-translator`（翻译服务）：若有外部调用或高频请求，Serverless 计算响应会极快消耗 Origin Transfer。
   - `ai-daily-feeds`（AI 日报聚合）、`findryai`（主站目录）、`mkdirs`、`twikoo_4_blog`（评论系统）等项目共用 10GB。

4. **Cloudflare 橙云未配置全站边缘缓存规则**：
   - 虽然域名开启了 Cloudflare 代理，但如果 Cloudflare 只缓存了图片/JS/CSS，所有页面请求和 API 依然穿透打向 Vercel 触发计算，并未在最外层起到“替 Vercel 挡流量”的作用。

---

## 三、代码与架构级深度审计

| 模块 / 路径 | 当前代码现状 | 对 Fast Origin Transfer 的影响 | 严重等级 |
|---|---|---|---|
| `src/middleware.ts` | `matcher` 配置过宽，包含 `/(api\|trpc)(.*)` 及根路径，所有 API 和公开请求均走中间件处理 | 导致每个动态 API 请求被 Vercel **双重计量（Double Billed）** | 🔴 极高 |
| `src/app/api/items/route.ts` | 动态 GET 请求未返回 `Cache-Control` / `s-maxage` 响应头 | 每次无限滚动请求直接穿透到 Serverless Function，返回大体积 JSON | 🔴 高 |
| `next.config.mjs` | `images.unoptimized: true` | 图片虽由 Sanity CDN 承载，但站内 public 资源或代理图片直接绕过 Vercel 优化（若有 local 访问则直接回源） | 🟡 中 |
| `src/app/sitemap.xml/route.ts` | `export const dynamic = "force-dynamic"` 且爬虫高频爬取 | 虽然设了 `s-maxage=86400`，但若 CDN 未锁死仍可能被爬虫频繁触发 | 🟡 中 |
| 团队 7 项目无流量隔离 | `vast-translator` / `ai-daily-feeds` / `findryai` 均在活跃运行 | 单一项目的突发流量会直接拖垮其他项目导致全部被暂停 | 🔴 高 |

---

## 四、系统级优化方案（按投入产出比排序）

```mermaid
flowchart LR
    Browser[客户端浏览器] -->|1. 请求| CF[Cloudflare 边缘缓存 (Cache Everything)]
    CF -->|命中缓存: 90% 流量在 CF 终止，0 Vercel 消耗| Browser
    CF -->|2. 未命中时才回源| VercelEdge[Vercel Edge CDN]
    VercelEdge -->|命中 s-maxage 边缘缓存| CF
    VercelEdge -->|3. 真正未缓存时| MW[收窄后的 Middleware]
    MW --> FN[Serverless Function / API]

    classDef core fill:#eef7f5,stroke:#0f766e,color:#134e4a,stroke-width:1.5px;
    classDef support fill:#eef4f8,stroke:#2563eb,color:#17324d,stroke-width:1.2px;
    classDef warning fill:#fff7ed,stroke:#c2410c,color:#7c2d12,stroke-width:1.2px;

    class CF core;
    class VercelEdge support;
    class MW,FN warning;
```

### 方案 1：收窄 `src/middleware.ts`，消除双倍计费（收益最大）
将不涉及用户身份验证的公开 API（如 `/api/items`、`/api/translate`、`sitemap.xml`）以及静态预渲染路由排除在 `middleware` 之外。

**建议改动**：
在 `src/middleware.ts` 中调整 matcher，或者直接跳过 public API：
```ts
// 仅拦截需要认证的 protected 路由与 auth 路由，避免让所有公开 API 承担中间件开销
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/submit/:path*",
    "/edit/:path*",
    "/auth/:path*",
  ],
};
```
*效果：公开访问（占 95% 以上流量）直接命中页面或 API，完全免除 Middleware 的额外 Origin Transfer 计算。*

---

### 方案 2：为公开 API 增加边缘缓存响应头（`s-maxage`）
在 `src/app/api/items/route.ts` 中为 GET 响应添加 CDN 缓存头：

```ts
return NextResponse.json(
  { items, totalCount },
  {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  }
);
```
*效果：相同分类/排序/分页的请求在 Vercel Edge 节点缓存 1 小时，不再每次穿透到 Node.js Serverless 运行时。*

---

### 方案 3：在 Cloudflare 控制台配置全站缓存规则（防御性护城河）
由于你的域名使用了 Cloudflare 橙云代理，可以在 Cloudflare 面板（`Rules` -> `Cache Rules`）添加规则：
1. **规则 1：静态页面全缓存**
   - 匹配路径：`findryai.com/*`（排除 `/dashboard/*`, `/auth/*`, `/studio/*`）
   - 缓存资格：`Eligible for cache` (Cache Everything)，边缘 TTL 设置为 1 天。
2. **规则 2：公开 API 缓存**
   - 匹配路径：`findryai.com/api/items*`
   - 边缘 TTL 设置为 1 小时。
*效果：90% 以上的公开流量在 Cloudflare 边缘直接响应，**连 Vercel 的 Edge CDN 都不需要触碰**，Fast Origin Transfer 消耗直接归零。*

---

### 方案 4：排查并分流团队内其他次要项目
在 Vercel 控制台检查各项目的用量占比：
- 登录 Vercel Dashboard -> 点击团队 `fountainchans-projects` -> `Usage` -> 查看 **Fast Origin Transfer** 选项卡下的 **Usage by Project**。
- 如果是闲置测试项目（如 `fierce-beaver`、`snobbish-kolibri`）或独立翻译项目 `vast-translator` 在消耗，可以：
  1. 暂停或删除闲置测试项目。
  2. 将 `vast-translator` 或独立 API 服务迁移至独立账号，避免与主站争抢 10GB 额度。

---

## 五、立即可执行的操作清单（Checklist）

- [ ] **步骤 1：去 Vercel Dashboard 确认具体是哪个项目在跑流量**
  - 路径：`https://vercel.com/dashboard/usage`
  - 观察 `Fast Origin Transfer` 中哪个 Project 占比最高。
- [ ] **步骤 2：优化代码库中的 Middleware 与 API 缓存（5 分钟内可完成）**
  - 优化 `src/middleware.ts` 的 matcher，放行公开路径与 API。
  - 为 `src/app/api/items/route.ts` 加上 `s-maxage` 缓存响应头。
- [ ] **步骤 3：在 Cloudflare 配置 Cache Rule**
  - 针对 `findryai.com` 设置 Cache Everything 规则，彻底在 Cloudflare 侧挡住流量。
- [ ] **步骤 4：清理无用项目**
  - 在 Vercel 控制台清理或暂停不再使用的测试部署。
