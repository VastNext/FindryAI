# 收录存量页处置记录（2026-10-14）

## 取证范围

- GSC 域属性 `findryai.com` 的「网页编入索引」示例 URL（面板标注最后更新 10 月 9 日），不是实时全站索引统计。
- 「已抓取—尚未编入索引」581 条中，页面 DOM 可读到 577 个 URL：332 个 alternatives、171 个 item、26 个 tag、3 个 blog、45 个其他路径；其余 4 条本次未取到，不推测其类型。
- 「已发现—尚未编入索引」821 条中，581 个 alternatives、239 个 item、1 个其他路径。
- 因此，**至少 913 个示例 URL 是 alternatives**；这批历史 URL 中，非白名单路径现已返回 404。GSC 计数仍是旧抓取状态，不能把 581 + 821 当作需要删除的 1,402 个 item 页面。

## 已执行的安全处置

- alternatives 候选改为针对具体用途的站内条目列表；候选未发布、隐藏或不存在时由 GROQ 排除；缺少可信候选的 `jan`、`lightcraft` 不再开放 alternatives。
- sitemap 只列出白名单内且已发布的 item 对比页，不虚报 `gamma`、`elephas` 等不可用条目；分类页不再指向非白名单的 404 对比页。
- `/tag/open-source?page=2` 已实测返回 `noindex, follow`；`/item/storyai/alternatives` 已实测返回 404。白名单 item 详情页本身不下架。

## 暂不下架的页面与理由

- `vectorcraft`、`photocraft` 等近期条目，以及已有曝光的 `novelai`、`chefgpt`、`replicastudios`、`i10x`、`plask`、`chattydocs`、`webbotify` 进入保护名单。
- GSC 示例中的 `ai2image`、`woebot-health`、`orkas`、`chat-prompt-genius`、`storyai`、`addy-ai`、`10web` 等 item 页面目前均返回 200，且存在独立描述。仅凭未收录状态无法判定应返回 404；需先核验服务存活、内容原创性和搜索曝光。
- 本轮**不批量修改 Sanity item 文档，也不删除已发布产品**。下一轮只对核实停运或内容无法修复、且无曝光的具体 URL 做小批量处理，并记录下架前后状态。

## 后续监控

部署后 7–14 天按相同 GSC 报告口径记录：alternatives 示例数量、真实 404 数量、item 索引和曝光、重要 Craft 页面状态与分类页死链。GSC 更新有延迟；出现保护名单条目 404、白名单页面大规模空候选或 sitemap 含 404 时优先回滚。不要因为汇总计数暂未下降而再次批量下架。
