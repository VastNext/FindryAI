---
description: 检查 Findry AI 新提交的网站，按五道门禁审核并出裁决报告（默认仅报告；加 auto 参数全自动执行批准/打回）
---

执行 Findry AI 提交审核流程，严格遵循 `review-submissions` skill 的全部规则。

模式参数：$ARGUMENTS

- 若参数包含 `auto`（或"全自动"/"执行"）：进入 **auto 模式**——裁决后自动执行 approve/reject、发送邮件、刷新缓存并做线上验收。
- 否则：**报告模式（默认）**——只运行只读脚本、输出裁决报告表后立即停止，不做任何写操作、不发邮件、不刷缓存。

先按 skill 的 Step 0 判定模式，然后依次执行 Step 1 → Step 6（Step 5/6 仅 auto 模式）。
