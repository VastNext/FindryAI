export interface CuratedTweetSummary {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  verified?: boolean;
  date: string;
  datePublished: string;
  category: "agent" | "research" | "openclaw" | "hermes" | "tools";
  categoryLabel: string;
  title: string;
  summary: string;
  url: string;
  keyTakeaways: string[];
}

export const curatedTweetSummaries: CuratedTweetSummary[] = [
  {
    id: "2094475193829012480",
    authorName: "Peter Steinberger",
    authorHandle: "steipete",
    date: "Today",
    datePublished: "2026-09-18T08:30:00Z",
    category: "agent",
    categoryLabel: "Autonomous Agents",
    title:
      "Coding with Autonomous AI Agents: Practical Workflows & OpenClaw Lessons",
    summary:
      "Peter Steinberger shares hands-on architectural reflections on delegating full-stack engineering to autonomous agent swarms, leveraging Git worktrees for safe isolation, and minimizing token waste with Think-in-Code sandboxes.",
    url: "https://x.com/steipete/status/2094475193829012480",
    keyTakeaways: [
      "Subagent delegation with strict verification gates outperforms monolithic agent prompting",
      "Git worktree branching isolates risky agent refactors without corrupting active worktrees",
      "Structured session logs create persistent memory trails across long-running developer loops",
    ],
  },
  {
    id: "2094471048291048192",
    authorName: "Google Research & Time Series",
    authorHandle: "googleresearch",
    date: "Today",
    datePublished: "2026-09-18T07:15:00Z",
    category: "research",
    categoryLabel: "Foundation Models",
    title: "TimesFM 3.0: Zero-Shot Time-Series Forecasting at Frontier Scale",
    summary:
      "Google's TimesFM 3.0 foundation model demonstrates state-of-the-art zero-shot forecasting across financial, server telemetry, and climate benchmarks with 4x inference throughput improvements.",
    url: "https://x.com/googleresearch/status/2094471048291048192",
    keyTakeaways: [
      "Zero-shot generalization matches supervised domain-specific architectures",
      "Extended context horizon enables multi-seasonal trend capture without retraining",
      "Optimized ONNX runtime support for low-latency edge deployment",
    ],
  },
  {
    id: "2094463924007498190",
    authorName: "AI Agent Pulse",
    authorHandle: "agentpulse_ai",
    date: "Today",
    datePublished: "2026-09-18T06:00:00Z",
    category: "agent",
    categoryLabel: "Autonomous Agents",
    title: "Multi-Agent Orchestration Frameworks Leap Forward",
    summary:
      "New benchmarks reveal multi-agent swarms with hierarchical supervisor delegation outperform monolithic single-prompt reasoning by 34% on complex SWE tasks and multi-file code generation.",
    url: "https://x.com/agentpulse_ai/status/2094463924007498190",
    keyTakeaways: [
      "Hierarchical delegation cuts token loops by 28%",
      "Specialized review personas reduce hallucination in production code",
      "Dynamic tool execution verification emerges as table stakes",
    ],
  },
  {
    id: "2094446499350683921",
    authorName: "OpenClaw Updates",
    authorHandle: "openclaw_dev",
    date: "Today",
    datePublished: "2026-09-18T04:30:00Z",
    category: "openclaw",
    categoryLabel: "OpenClaw Ecosystem",
    title: "OpenClaw v2.4 Release: Native Webhook Streaming & Tool Registry",
    summary:
      "OpenClaw rolls out native SSE event streaming for agent execution loops and introduces an open tool marketplace with zero-config MCP server integration.",
    url: "https://x.com/openclaw_dev/status/2094446499350683921",
    keyTakeaways: [
      "Full Model Context Protocol (MCP) server auto-discovery",
      "Reduced latency on multi-turn tool calling pipelines",
      "One-click deployment templates for cloud agent runtimes",
    ],
  },
  {
    id: "2094434546573832631",
    authorName: "Hermes Agent Hub",
    authorHandle: "hermes_agents",
    date: "Yesterday",
    datePublished: "2026-09-17T16:00:00Z",
    category: "hermes",
    categoryLabel: "Hermes Agent",
    title: "Hermes 3 Function Calling Optimization in Local Inference",
    summary:
      "Community engineering insights on maximizing structured output reliability for Hermes 3 across Ollama and vLLM without JSON schema breakage.",
    url: "https://x.com/hermes_agents/status/2094434546573832631",
    keyTakeaways: [
      "Strict schema enforcement via GBNF grammars improves reliability to 99.4%",
      "Recommended quantization matrix for consumer 24GB GPUs",
      "Practical agent reasoning loop templates shared on GitHub",
    ],
  },
  {
    id: "2094432569077137732",
    authorName: "Swarm Intelligence Lab",
    authorHandle: "swarmlab_ai",
    date: "Yesterday",
    datePublished: "2026-09-17T12:00:00Z",
    category: "agent",
    categoryLabel: "Agent Protocols",
    title: "Memory Persistence Patterns for Long-Horizon Coding Agents",
    summary:
      "Comparing vector database recall vs. hierarchical session compression files for agents working in large enterprise codebases over multi-day sessions.",
    url: "https://x.com/swarmlab_ai/status/2094432569077137732",
    keyTakeaways: [
      "File-based markdown logs consistently beat naive embedding similarity for code context",
      "Git worktree isolation enables safe parallel branch execution",
      "Auto-commit hooks prevent context drift during long refactoring runs",
    ],
  },
  {
    id: "2094431070481752434",
    authorName: "AI Research Wire",
    authorHandle: "airesearchwire",
    date: "Sep 16",
    datePublished: "2026-09-16T18:00:00Z",
    category: "research",
    categoryLabel: "LLM Research",
    title: "Test-Time Compute Scaling Across Modern Reasoning Models",
    summary:
      "Comprehensive breakdown of test-time compute: how adaptive thinking steps, parallel candidate generation, and consensus voting scale inference accuracy on math and hard logic.",
    url: "https://x.com/airesearchwire/status/2094431070481752434",
    keyTakeaways: [
      "Verification models provide greater accuracy uplift than simply increasing reasoning tokens",
      "Token budget management strategies for production reasoning APIs",
      "Cost-performance frontiers compared across frontier labs",
    ],
  },
  {
    id: "2094428759097245768",
    authorName: "Developer Tooling Digest",
    authorHandle: "devtools_digest",
    date: "Sep 16",
    datePublished: "2026-09-16T10:00:00Z",
    category: "tools",
    categoryLabel: "Developer Tools",
    title: "CLI Coding Agents vs. GUI Web Interfaces: Where Devs Are Shifting",
    summary:
      "Survey of 1,200 software engineers reveals CLI-first terminal agents (Codex CLI, Claude Code, Aider) now represent over 60% of daily active developer agent workflows.",
    url: "https://x.com/devtools_digest/status/2094428759097245768",
    keyTakeaways: [
      "Terminal workflows minimize context switching from active IDE windows",
      "Git-integrated workflows allow instant rollback of faulty edits",
      "Agent subtask dispatch in background PTYs accelerates repetitive refactors",
    ],
  },
  {
    id: "2094426225573818511",
    authorName: "OpenSource AI Frontier",
    authorHandle: "os_ai_frontier",
    date: "Sep 15",
    datePublished: "2026-09-15T15:00:00Z",
    category: "openclaw",
    categoryLabel: "Open Source",
    title: "Self-Hosting Autonomous Agent Runtimes: Security & Sandboxing",
    summary:
      "Best practices for Docker container isolation, eBPF network monitoring, and safe credential injection when granting coding agents terminal execution permissions.",
    url: "https://x.com/os_ai_frontier/status/2094426225573818511",
    keyTakeaways: [
      "Read-only root filesystems with ephemeral scratch volumes",
      "Network egress whitelisting prevents accidental secret exfiltration",
      "Audit logging for every shell invocation and file write",
    ],
  },
  {
    id: "2094424468269437358",
    authorName: "Next-Gen Prompting",
    authorHandle: "promptcraft_hq",
    date: "Sep 15",
    datePublished: "2026-09-15T09:00:00Z",
    category: "tools",
    categoryLabel: "Prompt Engineering",
    title: "System Prompt Patterns That Prevent Agent Infinite Loops",
    summary:
      "A battle-tested rubric of 4 guardrail constraints that force autonomous agents to declare blockers and request feedback instead of endlessly trying broken code fixes.",
    url: "https://x.com/promptcraft_hq/status/2094424468269437358",
    keyTakeaways: [
      "Hard loop caps with explicit diagnostic triggers",
      "Obligatory root-cause isolation step before emitting edits",
      "Self-verification test command gates prior to completion assertions",
    ],
  },
];
