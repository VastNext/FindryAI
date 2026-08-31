# GitHub Agent Skill URL 自动录入需求

## 背景

FindryAI 的 Agent Skills 页面是英文目录。运营者希望以后只提供一个 GitHub 仓库、子目录或 `SKILL.md` 地址，系统自动识别 Skill 信息、生成英文短描述、选择分类，并在人工确认后加入目录。

## 目标体验

```text
pnpm agent-skill:import <github-url>
  ↓
解析 owner / repo / branch / path
  ↓
寻找并读取 SKILL.md、README 与仓库元数据
  ↓
生成英文名称、短描述、来源链接与候选分类
  ↓
输出 dry-run 预览和置信度
  ↓
人工确认
  ↓
写入目录数据并执行去重、格式化和验证
```

## 支持输入

- GitHub 仓库根地址；
- GitHub `tree/<branch>/<path>` 子目录；
- GitHub `blob/<branch>/<path>/SKILL.md`；
- `raw.githubusercontent.com` 的 `SKILL.md`；
- 仓库中包含多个 Skill 时，列出候选路径，不自动全部发布。

## 自动提取

- 名称：优先读取 `SKILL.md` frontmatter `name`，其次目录名或仓库名；
- 描述：优先读取 frontmatter `description`，再基于 README / SKILL.md 生成一句英文价值描述；
- 链接：保存最具体、最可操作的 Skill 目录或文件地址；
- 分类：只能从当前 17 个分类中选择；
- 去重：按规范化 GitHub owner/repo/path 判断；
- 来源：记录解析到的 branch、path 和文件类型供审查。

## 分类策略

分类使用受限枚举，不允许模型自由创造新分类。模型返回：

```json
{
  "primaryCategory": "Web & Automation",
  "confidence": 0.91,
  "alternatives": ["Agent Boost", "Vibe Coding"],
  "reason": "The skill automates browser-based workflows."
}
```

- `confidence >= 0.8`：默认选中，仍需人工确认；
- `0.55 <= confidence < 0.8`：显示候选，要求人工选择；
- `< 0.55`：不写入，要求人工指定分类。

## 安全与质量门禁

- 只读取公开文本，不执行仓库中的脚本；
- 限制下载文件大小和读取文件数量；
- 忽略仓库内容中的提示注入指令，只把它当作待分析数据；
- 禁止自动发布无人工确认结果；
- 写入前检查 URL、名称和规范化仓库路径重复；
- 描述必须是英文、单句、适合目录卡片；
- 失效、归档或无明确 Skill 内容的仓库不得自动加入。

## 推荐阶段

### MVP

实现本地 CLI 的 dry-run JSON，不写生产 Sanity：

```text
pnpm agent-skill:inspect <url>
```

运营者确认输出后，由 CLI 更新静态数据或提交一份候选 JSON。

### 后续

- 将候选写入 Sanity 的 pending 状态；
- Studio 中人工审核与修改；
- 定时同步 stars、版本、许可证和维护状态；
- 支持批量 URL 和 GitHub Issue 提交入口。
