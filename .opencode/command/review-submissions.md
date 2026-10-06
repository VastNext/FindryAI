---
description: 审核 Findry AI 已验证徽章的优先队列；仅显式加 --without-badge 才审核普通队列（默认仅报告，加 auto 才执行）
---

执行 Findry AI 提交审核流程，严格遵循 `review-submissions` skill 的全部规则。

模式参数：$ARGUMENTS

队列参数：仅当 `$ARGUMENTS` **明确包含** `--without-badge` 时审核普通队列；否则只运行默认优先队列。选定队列为空时立即报告「该队列无待审提交」并结束本次命令；不得为了寻找待审条目而查询另一队列。`auto` 只改变是否写入裁决，不改变队列选择。

- 若参数包含 `auto`（或"全自动"/"执行"）：进入 **auto 模式**——裁决后自动执行 approve/reject、发送邮件、刷新缓存并做线上验收。
- 否则：**报告模式（默认）**——只运行只读脚本、输出裁决报告表后立即停止，不做任何写操作、不发邮件、不刷缓存。

先按 skill 的 Step 0 判定模式和队列，再执行所选队列的 Step 1；有待审提交才继续 Step 2 → Step 4（Step 5/6 仅 auto 模式）。
