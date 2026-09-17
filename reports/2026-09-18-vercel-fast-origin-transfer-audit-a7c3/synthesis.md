# Synthesis: Vercel Fast Origin Transfer Usage Alert

## 原始问题
用户收到 Vercel 预警邮件：Hobby 免费团队 `fountainchans-projects` 的 **Fast Origin Transfer** 额度（10 GB）已使用了 75%（即已达 ~7.5 GB）。如果超标，项目会被自动暂停（Paused）。用户要求排查为什么用量这么大，并给出优化方案。

## 主线判断
1. **计费口径误区：Fast Origin Transfer ≠ 边缘 CDN 出口流量（Fast Data Transfer）**。
   - `Fast Data Transfer` 是 Vercel 边缘 CDN 发送给终端用户的公网带宽（Hobby 免费包含 100 GB）。
   - `Fast Origin Transfer` 是 **Vercel 内部 Serverless / Edge Function / Middleware / Blob 回源传输的流量**（Hobby 免费版每个月**仅有 10 GB**，且为团队内所有项目共享）。
2. **用量飙升的 4 大核心泄漏点**：
   - **泄漏点 1：Middleware 重复计量（Double Count）**。Vercel 规定当请求经过 Middleware 再打到 Function 时，Middleware 产生一次回源流量，下游 Function 又产生一次。仓库中 `middleware.ts` 匹配规则拦截了所有 `/api` 及多数页面路由。
   - **泄漏点 2：API 路由纯动态计算且未设 Edge Cache 响应头**。例如 `/api/items`、`/api/translate`、`/api/upload-image`，每次调用都全量穿透到 Vercel Serverless Origin。
   - **泄漏点 3：多项目团队级共享 10GB 额度**。团队内共有 7 个项目（`findryai`, `mkdirs`, `vast-translator`, `ai-daily-feeds`, `fierce-beaver`, `snobbish-kolibri`, `twikoo_4_blog`）。尤其 `vast-translator`（翻译服务）和 `ai-daily-feeds`、`findryai` 产生高频 API 交互。
   - **泄漏点 4：Cloudflare 橙云未配置全站边缘缓存规则（Cache Everything）**。虽然启用了 Cloudflare 反代，但若未在 Cloudflare 规则中对静态 HTML、API 或公共资源开启缓存，所有请求穿透 Cloudflare 后直达 Vercel，并在 Vercel 端触发 Origin 处理。
3. **优化后预期效果**：
   - 通过在 Cloudflare 配置 Cache-Control / Edge Cache、在 Next.js API 路由补充 CDN 缓存头、收窄 Middleware matcher，可将 Fast Origin Transfer **降低 80%~95%**，彻底杜绝超标暂停风险。
