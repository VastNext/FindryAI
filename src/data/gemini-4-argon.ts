import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Cpu,
  DollarSign,
  FastForward,
  FileCode2,
  Filter,
  Flame,
  Globe2,
  Layers,
  Lock,
  MessageSquare,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Video,
  Workflow,
  Zap,
} from "lucide-react";

export const gemini4Argon = {
  name: "Gemini 4 Argon",
  modelId: "gemini-4-argon",
  releaseDate: "October 13, 2026 (Global Public Launch)",
  initialAnnouncement: "September 30, 2026",
  tagline: "Our Next Era of Frontier Intelligence",
  developer: "Google DeepMind",
  leadAuthor:
    "Koray Kavukcuoglu (SVP, Google DeepMind and Chief AI Architect, Google)",
  accessProgram:
    "Generally Available Worldwide — Google AI Studio, Vertex AI, Gemini App & Google Antigravity",
  // Official & Reference URLs
  officialUrl:
    "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/",
  initialBlogUrl:
    "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
  modelCardUrl: "https://deepmind.google/models/model-cards/gemini-4-argon/",
  deepmindUrl: "https://deepmind.google/technologies/gemini/",
  developerDocsUrl: "https://ai.google.dev/gemini-api/docs/latest-model",
  theVergeUrl: "https://www.theverge.com/tech/1002980/google-gemini-4-argon",
  siliconAngleUrl:
    "https://siliconangle.com/2026/09/30/googles-new-frontier-ai-model-gemini-4-argon-goes-to-cybersecurity-defenders-first/",
  markTechPostUrl:
    "https://www.marktechpost.com/2026/09/30/google-deepmind-unveils-gemini-4-argon-with-1m-output-tokens-for-coding-knowledge-work-and-cyber-defense/",
  // Meta description & Hero
  description:
    "Gemini 4 Argon is Google DeepMind's flagship 4th-generation frontier model, now globally available as of October 13, 2026. Engineered for long-horizon software engineering, complex legal/finance knowledge work, and autonomous cybersecurity defense, Argon introduces an industry-first 1,000,000 output token generation headroom, unified 1M context window, 95% prompt caching discount, and introductory pricing of $2/$10 per 1M tokens through November 30, 2026.",
  heroSubtitle:
    "Now live worldwide across Google AI Studio, Vertex AI, and Gemini App: generate up to 1M tokens in a single trajectory, autonomously discover and patch zero-day vulnerabilities, and orchestrate GDP-weighted enterprise knowledge automation.",
};

export const heroStats: { value: string; label: string; sublabel?: string }[] =
  [
    {
      value: "1,000,000",
      label: "Max Output Tokens",
      sublabel: "Unified 1M context — 15x higher generation than rivals",
    },
    {
      value: "$2.00 / $10",
      label: "Introductory API Price",
      sublabel: "Through Nov 30, 2026 ($0.10 cached in / 1M)",
    },
    {
      value: "95% OFF",
      label: "Prompt Caching Discount",
      sublabel: "Implicit server caching down to $0.10 / 1M",
    },
    {
      value: "77.9%",
      label: "DeepSWE v1.1 Score",
      sublabel: "New #1 SOTA in long-horizon software engineering",
    },
  ];

export const corePillars: {
  icon: LucideIcon;
  title: string;
  badge: string;
  metric: string;
  description: string;
  highlights: string[];
}[] = [
  {
    icon: Terminal,
    title: "1M Output Token Trajectories",
    badge: "Sustained Deep Reasoning",
    metric: "1,000,000 tokens / run",
    description:
      "While Claude Opus 5.5 and GPT-6 Astra cap single-turn responses at 128K tokens, Argon expands generation headroom to a full 1M tokens via background continuation hops. This enables end-to-end monolithic refactoring, multi-volume legal drafting, and continuous reasoning chains without chunking or losing intermediate states.",
    highlights: [
      "Generates entire production codebases and migrations without pagination",
      "Executes hundreds of thousands of reasoning steps in one uninterrupted pass",
      "Unified 1,048,576 token space shared dynamically between prompt, thinking tokens, and generated output",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Autonomous Cyber Defense",
    badge: "Fairwind Defense Program",
    metric: "85.8% Vulnerability Recall",
    description:
      "Trained to autonomously uncover, validate, and patch critical software security flaws. Tested alongside Google-owned Wiz Scan for Good, Argon discovered previously undetected zero-days in worldwide hospital systems. Delivered without cyber guardrails to verified defenders.",
    highlights: [
      "Tied #1 on CWE-bench v1 remediation test at 68.0%",
      "70.9% on Wiz Black-Box Live Penetration Testing Benchmark",
      "85.8% source-code vulnerability discovery across 20 programming languages",
    ],
  },
  {
    icon: Code2,
    title: "Long-Horizon Software Engineering",
    badge: "DeepSWE SOTA",
    metric: "77.9% DeepSWE v1.1",
    description:
      "Powers Google's internal code migrations, including converting 800,000 lines of C/C++ in Fuchsia OS Zircon kernel to Rust, and replacing 32,000 lines of SIMD in libgav1 video decoder to achieve 2.7x speedups through iterative profile-guided analysis.",
    highlights: [
      "Leads DeepSWE v1.1 (77.9%) over Opus 5.5 (74.2%) and GPT-6 Astra (74.1%)",
      "91.9% on Vibe Code Bench for interactive UI and full-stack prototyping",
      "Automated Rust borrow-checker resolution across massive enterprise repositories",
    ],
  },
  {
    icon: Scale,
    title: "Enterprise Knowledge & Agent Workflows",
    badge: "Vals Index #1",
    metric: "68.9% Vals Index",
    description:
      "Trained on GDP-weighted economic enterprise tasks spanning financial modeling, corporate tax filings, and legal brief synthesis. Ranks #1 on Zapier AutomationBench (51.3% vs Opus 5.5's 42.5%) and crushes Harvey Legal Agent (19.6% vs 5.4% Astra).",
    highlights: [
      "19.6% on Harvey Legal Agent Benchmark (3.6x higher than GPT-6 Astra)",
      "65.4% on Vals Finance Agent v2 for multi-step quantitative valuation",
      "51.3% on Zapier AutomationBench for multi-app business execution",
    ],
  },
];

export const frontierSafeguards: {
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
}[] = [
  {
    icon: Lock,
    title: "Frontier Safety Framework (CBRN & Cyber)",
    category: "Misuse Defenses",
    description:
      "Includes continuous activation monitoring for high-risk chemical, biological, radiological, nuclear, and offensive cyber threats to prevent dangerous exploitation.",
  },
  {
    icon: ShieldAlert,
    title: "Indirect Prompt Injection (IPI) Immunity",
    category: "Adversarial Robustness",
    description:
      "Argon achieves top rank on Gray Swan's Indirect Prompt Injection benchmark, preventing malicious hidden instructions inside untrusted web pages or documents from hijacking agent behavior.",
  },
  {
    icon: BrainCircuit,
    title: "Real-Time Chain-of-Thought Monitoring",
    category: "Misalignment Watchdogs",
    description:
      "Independent monitor networks inspect internal reasoning traces and proposed tool calls in real time, capable of immediately arresting execution if unauthorized intent is detected.",
  },
  {
    icon: Cpu,
    title: "Sealed Evaluation Sandboxes",
    category: "Infrastructure Security",
    description:
      "All high-risk autonomous agent training, vulnerability scanning, and red-teaming benchmarks run inside hyper-isolated, air-gapped container sandboxes.",
  },
];

export const architecturalMatrix: {
  dimension: string;
  gemini4Argon: string;
  gpt6Astra: string;
  claudeOpus55: string;
  claudeFable51: string;
  notes: string;
}[] = [
  {
    dimension: "Developer & Origin",
    gemini4Argon: "Google DeepMind",
    gpt6Astra: "OpenAI",
    claudeOpus55: "Anthropic",
    claudeFable51: "Anthropic",
    notes: "Top-tier frontier labs with distinct model lineages",
  },
  {
    dimension: "Availability Status",
    gemini4Argon: "Generally Available (Oct 13, 2026)",
    gpt6Astra: "Live (ChatGPT Plus/Pro & API)",
    claudeOpus55: "Live (Claude.ai Pro/Team & API)",
    claudeFable51: "Enterprise Dedicated Only",
    notes: "Argon is live globally across API & consumer surfaces",
  },
  {
    dimension: "Context Window",
    gemini4Argon: "1,048,576 tokens (Unified)",
    gpt6Astra: "1,050,000 tokens",
    claudeOpus55: "1,000,000 tokens",
    claudeFable51: "1,000,000 tokens",
    notes: "All top frontier models now support ~1M token context",
  },
  {
    dimension: "Max Output Tokens",
    gemini4Argon: "1,000,000 tokens (Long Decode)",
    gpt6Astra: "128,000 tokens",
    claudeOpus55: "128,000 tokens",
    claudeFable51: "128,000 tokens",
    notes: "Argon leads by 7.8x with background continuation hops",
  },
  {
    dimension: "Thinking / Reasoning Control",
    gemini4Argon: "Tunable (Low / Med / High + Budget)",
    gpt6Astra: "5 Effort Levels (low to max)",
    claudeOpus55: "Extended Thinking Budget",
    claudeFable51: "Extended Thinking Budget",
    notes: "All offer granular latency vs depth trade-offs",
  },
  {
    dimension: "API Input Price / 1M",
    gemini4Argon: "$2.00 (Intro) / $4.00 (Standard)",
    gpt6Astra: "$10.00 / 1M",
    claudeOpus55: "$4.00 / 1M",
    claudeFable51: "$10.00 / 1M",
    notes: "Argon offers 50% discount vs Opus 5.5 through Nov 30",
  },
  {
    dimension: "API Output Price / 1M",
    gemini4Argon: "$10.00 (Intro) / $20.00 (Standard)",
    gpt6Astra: "$50.00 / 1M",
    claudeOpus55: "$20.00 / 1M",
    claudeFable51: "$50.00 / 1M",
    notes: "Argon is 80% cheaper than Astra and 50% cheaper than Opus",
  },
  {
    dimension: "Cached Input Discount",
    gemini4Argon: "-95% ($0.10 intro / $0.20 std)",
    gpt6Astra: "-90% ($1.00 / 1M)",
    claudeOpus55: "-95% ($0.20 / 1M)",
    claudeFable51: "-97.5% ($0.25 / 1M)",
    notes: "Massive savings on long prompts and recurring agent states",
  },
  {
    dimension: "Native Multimodal Modalities",
    gemini4Argon: "Text, Code, Vision, Audio, Video (1M)",
    gpt6Astra: "Text, Code, Vision",
    claudeOpus55: "Text, Code, Vision",
    claudeFable51: "Text, Code, Vision",
    notes: "DeepMind leads natively in long video & audio understanding",
  },
  {
    dimension: "Primary Sweet Spot",
    gemini4Argon: "Full codebase refactor & GDP knowledge",
    gpt6Astra: "Hard math/logic puzzles & GUI computer use",
    claudeOpus55: "Deep CLI shell automation & terminal tasks",
    claudeFable51: "High-assurance enterprise compliance",
    notes: "Complementary strengths across developer workflows",
  },
];

export const comparisonTable: {
  benchmark: string;
  category: string;
  gemini4Argon: string;
  gpt6Astra: string;
  claudeOpus55: string;
  claudeFable51: string;
  winner: "argon" | "astra" | "opus" | "tie";
  notes: string;
}[] = [
  {
    benchmark: "DeepSWE v1.1",
    category: "Long-Horizon Coding",
    gemini4Argon: "77.9%",
    gpt6Astra: "74.1%",
    claudeOpus55: "74.2%",
    claudeFable51: "67.4%",
    winner: "argon",
    notes: "New #1 SOTA on multi-file agentic software engineering",
  },
  {
    benchmark: "Vals Index (GDP-Weighted)",
    category: "Knowledge Work",
    gemini4Argon: "68.9%",
    gpt6Astra: "63.1%",
    claudeOpus55: "67.0%",
    claudeFable51: "65.8%",
    winner: "argon",
    notes: "Measures finance, legal, tax, and coding business impact",
  },
  {
    benchmark: "AutomationBench (Zapier)",
    category: "Workflow Automation",
    gemini4Argon: "51.3%",
    gpt6Astra: "41.4%",
    claudeOpus55: "42.5%",
    claudeFable51: "31.4%",
    winner: "argon",
    notes: "Evaluates end-to-end multi-step tool execution across APIs",
  },
  {
    benchmark: "Harvey Legal Agent",
    category: "Legal Reasoning",
    gemini4Argon: "19.6%",
    gpt6Astra: "5.4%",
    claudeOpus55: "3.8%",
    claudeFable51: "6.7%",
    winner: "argon",
    notes:
      "Dominates complex legal research and contract drafting (3.6x over Astra)",
  },
  {
    benchmark: "Vals Finance Agent v2",
    category: "Financial Research",
    gemini4Argon: "65.4%",
    gpt6Astra: "53.5%",
    claudeOpus55: "58.6%",
    claudeFable51: "58.9%",
    winner: "argon",
    notes: "Multi-step quantitative valuation and corporate filings",
  },
  {
    benchmark: "CWE-bench v1",
    category: "Cybersecurity Remediation",
    gemini4Argon: "68.0%",
    gpt6Astra: "68.0%",
    claudeOpus55: "67.0%",
    claudeFable51: "58.0%",
    winner: "tie",
    notes: "Tied #1 with GPT-6 Astra for automated security patching",
  },
  {
    benchmark: "LVBench (Long Video)",
    category: "Multimodal Video",
    gemini4Argon: "91.7%",
    gpt6Astra: "87.5%",
    claudeOpus55: "83.7%",
    claudeFable51: "79.7%",
    winner: "argon",
    notes: "State-of-the-art temporal understanding over hour-long videos",
  },
  {
    benchmark: "Chartography",
    category: "Chart & Visual Reasoning",
    gemini4Argon: "71.6%",
    gpt6Astra: "71.0%",
    claudeOpus55: "66.3%",
    claudeFable51: "46.2%",
    winner: "argon",
    notes: "Visual financial and scientific chart interpretation",
  },
  {
    benchmark: "GraphWalks (256K–1M)",
    category: "Long-Context Needle",
    gemini4Argon: "84.2%",
    gpt6Astra: "71.8%",
    claudeOpus55: "66.8%",
    claudeFable51: "65.0%",
    winner: "argon",
    notes: "Massive +12.4% lead over Astra on 1M token graph reasoning",
  },
  {
    benchmark: "GraphWalks (Up to 128K)",
    category: "Long-Context Retrieval",
    gemini4Argon: "99.7%",
    gpt6Astra: "98.7%",
    claudeOpus55: "90.6%",
    claudeFable51: "91.4%",
    winner: "argon",
    notes: "Near-flawless needle-in-a-haystack graph traversal",
  },
  {
    benchmark: "LABBench 2",
    category: "Scientific Research",
    gemini4Argon: "88.8%",
    gpt6Astra: "85.4%",
    claudeOpus55: "73.1%",
    claudeFable51: "68.6%",
    winner: "argon",
    notes: "Complex biological and chemical laboratory reasoning",
  },
  {
    benchmark: "RiemannBench",
    category: "Advanced Mathematics",
    gemini4Argon: "76.0%",
    gpt6Astra: "72.0%",
    claudeOpus55: "69.6%",
    claudeFable51: "65.6%",
    winner: "argon",
    notes: "Graduate-level theorem proving and algebraic topology",
  },
  {
    benchmark: "Vibe Code Bench",
    category: "Interactive Prototyping",
    gemini4Argon: "91.9%",
    gpt6Astra: "89.6%",
    claudeOpus55: "90.3%",
    claudeFable51: "90.3%",
    winner: "argon",
    notes: "Rapid aesthetic UI generation & full-stack app scaffolding",
  },
  {
    benchmark: "Agent's Last Exam",
    category: "General Agentic Tasks",
    gemini4Argon: "39.5%",
    gpt6Astra: "34.2%",
    claudeOpus55: "38.2%",
    claudeFable51: "—",
    winner: "argon",
    notes: "High-difficulty multi-hour autonomous agent benchmark",
  },
  {
    benchmark: "FrontierSWE v2",
    category: "Extreme SWE Puzzles",
    gemini4Argon: "55.0%",
    gpt6Astra: "65.5%",
    claudeOpus55: "62.3%",
    claudeFable51: "56.3%",
    winner: "astra",
    notes:
      "GPT-6 Astra maintains lead on specialized hard SWE algorithmic puzzles",
  },
  {
    benchmark: "Terminal-Bench 4.0",
    category: "CLI & Terminal Ops",
    gemini4Argon: "57.4%",
    gpt6Astra: "58.2%",
    claudeOpus55: "66.4%",
    claudeFable51: "57.9%",
    winner: "opus",
    notes: "Claude Opus 5.5 retains mastery over deep shell automation",
  },
  {
    benchmark: "OSWorld 2.0 (Offline)",
    category: "Computer Use / GUI",
    gemini4Argon: "69.2%",
    gpt6Astra: "72.6%",
    claudeOpus55: "—",
    claudeFable51: "—",
    winner: "astra",
    notes: "GPT-6 Astra leads direct desktop screen and mouse automation",
  },
  {
    benchmark: "PostTrainBench",
    category: "ML Engineering",
    gemini4Argon: "45.3%",
    gpt6Astra: "44.3%",
    claudeOpus55: "49.3%",
    claudeFable51: "40.2%",
    winner: "opus",
    notes: "Claude Opus 5.5 leads in machine learning system tuning",
  },
];

export const pricingComparison: {
  model: string;
  provider: string;
  inputPrice: string;
  outputPrice: string;
  cachedInputPrice: string;
  maxOutputLimit: string;
  contextWindow: string;
}[] = [
  {
    model: "Gemini 4 Argon (Intro Price)",
    provider: "Google DeepMind",
    inputPrice: "$2.00 / 1M",
    outputPrice: "$10.00 / 1M",
    cachedInputPrice: "$0.10 / 1M (-95%)",
    maxOutputLimit: "1,000,000 tokens",
    contextWindow: "1,048,576 tokens",
  },
  {
    model: "Gemini 4 Argon (Standard)",
    provider: "Google DeepMind",
    inputPrice: "$4.00 / 1M",
    outputPrice: "$20.00 / 1M",
    cachedInputPrice: "$0.20 / 1M (-95%)",
    maxOutputLimit: "1,000,000 tokens",
    contextWindow: "1,048,576 tokens",
  },
  {
    model: "Claude Opus 5.5",
    provider: "Anthropic",
    inputPrice: "$4.00 / 1M",
    outputPrice: "$20.00 / 1M",
    cachedInputPrice: "$0.20 / 1M (-95%)",
    maxOutputLimit: "128,000 tokens",
    contextWindow: "1,000,000 tokens",
  },
  {
    model: "GPT-6 Astra",
    provider: "OpenAI",
    inputPrice: "$10.00 / 1M",
    outputPrice: "$50.00 / 1M",
    cachedInputPrice: "$1.00 / 1M (-90%)",
    maxOutputLimit: "128,000 tokens",
    contextWindow: "1,050,000 tokens",
  },
  {
    model: "GPT-6.1 Sol",
    provider: "OpenAI",
    inputPrice: "$2.00 / 1M",
    outputPrice: "$10.00 / 1M",
    cachedInputPrice: "$0.10 / 1M (-95%)",
    maxOutputLimit: "128,000 tokens",
    contextWindow: "1,050,000 tokens",
  },
  {
    model: "Claude Fable 5.1",
    provider: "Anthropic",
    inputPrice: "$10.00 / 1M",
    outputPrice: "$50.00 / 1M",
    cachedInputPrice: "$0.25 / 1M (-97.5%)",
    maxOutputLimit: "128,000 tokens",
    contextWindow: "1,000,000 tokens",
  },
];

export const accessChannels: {
  icon: LucideIcon;
  channel: string;
  badge: string;
  targetAudience: string;
  description: string;
  actionUrl: string;
  actionText: string;
}[] = [
  {
    icon: Terminal,
    channel: "Google AI Studio",
    badge: "Web UI & Instant API Keys",
    targetAudience: "Developers, Prototypers & Independent Builders",
    description:
      "Direct browser playground and API key generation under model ID gemini-4-argon. Test tunable thinking levels, inspect reasoning steps, and build with immediate token quotas.",
    actionUrl: "https://aistudio.google.com/",
    actionText: "Open in AI Studio",
  },
  {
    icon: Cloud,
    channel: "Google Cloud Vertex AI",
    badge: "Enterprise Production Grade",
    targetAudience: "Enterprise Architects, Security & Cloud Teams",
    description:
      "Full compliance, VPC Service Controls, dedicated provisioned throughput, and strict zero-data-retention guarantees. Available across global Vertex AI regions.",
    actionUrl: "https://cloud.google.com/vertex-ai",
    actionText: "View Vertex AI",
  },
  {
    icon: Bot,
    channel: "Google Antigravity & AI Ultra",
    badge: "Autonomous Agent Workspace",
    targetAudience: "AI Superusers & Power Developers",
    description:
      "Integrated directly into Google Antigravity as the primary reasoning engine for managed background software engineering, deep document syntheses, and repository automation.",
    actionUrl: "https://gemini.google.com/advanced",
    actionText: "Access in Antigravity",
  },
  {
    icon: MessageSquare,
    channel: "Gemini App & Search AI Mode",
    badge: "Web, Desktop & Mobile Native",
    targetAudience: "Ultra & Pro Subscribers",
    description:
      "Available across gemini.google.com, desktop apps, and Google Search AI Mode for ultra-deep multi-step research, long document analysis, and native voice interactions.",
    actionUrl: "https://gemini.google.com/",
    actionText: "Try in Gemini App",
  },
  {
    icon: ShieldCheck,
    channel: "Fairwind Defense Program",
    badge: "Cyber Defense Fast-Track",
    targetAudience: "Vetted Defensive Cybersecurity Teams",
    description:
      "Exclusive access without cyber guardrails for certified defense institutions (CrowdStrike, Palo Alto Networks, Wiz) to uncover and patch zero-days in critical global infrastructure.",
    actionUrl:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
    actionText: "Learn about Fairwind",
  },
];

export const codeExamples: {
  id: string;
  title: string;
  language: string;
  framework: string;
  code: string;
}[] = [
  {
    id: "google-genai-ts",
    title: "Google GenAI SDK (TypeScript / Node)",
    language: "typescript",
    framework: "@google/genai",
    code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generating long-horizon refactor with 1M output headroom
const response = await ai.models.generateContent({
  model: "gemini-4-argon",
  contents: [
    {
      role: "user",
      parts: [
        { text: "Analyze this 250,000-line C++ module and execute complete Rust migration with full test coverage." },
        { fileData: { fileUri: "gs://enterprise-repo/zircon_kernel_cpp.tar.gz", mimeType: "application/gzip" } }
      ]
    }
  ],
  config: {
    maxOutputTokens: 1000000, // 1M tokens trajectory ceiling (via background continuation hops)
    temperature: 0.2,
    thinkingConfig: {
      thinkingBudget: 64000, // Allocate deep internal reasoning budget
      thinkingLevel: "high", // "low" | "medium" | "high"
    },
  },
});

console.log("Response text length:", response.text?.length);
console.log("Total tokens billed:", response.usageMetadata);`,
  },
  {
    id: "google-genai-python",
    title: "Python SDK (google-genai)",
    language: "python",
    framework: "google-genai (Python 3.11+)",
    code: `from google import genai
from google.genai import types

client = genai.Client()

# Execute automated cybersecurity patch analysis with tunable thinking
response = client.models.generate_content(
    model="gemini-4-argon",
    contents="Audit the following repository for memory-safety zero-days and emit verifiable patches:",
    config=types.GenerateContentConfig(
        max_output_tokens=1_000_000,
        temperature=0.1,
        thinking_config=types.ThinkingConfig(
            thinking_budget=32_000,
            thinking_level="medium"  # low, medium (default), or high
        ),
        system_instruction="You are an autonomous Fairwind defensive cybersecurity agent."
    )
)

print(f"Patches Generated: {len(response.text)}")
print(f"Input Tokens: {response.usage_metadata.prompt_token_count}")
print(f"Output Tokens (including thinking): {response.usage_metadata.candidates_token_count}")`,
  },
  {
    id: "vertex-ai-curl",
    title: "Google Cloud Vertex AI (Enterprise API)",
    language: "bash",
    framework: "Vertex AI REST API",
    code: `curl -X POST \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  "https://us-central1-aiplatform.googleapis.com/v1/projects/\${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-4-argon:generateContent" \\
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [{ "text": "Draft a multi-jurisdiction 300-page M&A contract synthesis." }]
      }
    ],
    "generationConfig": {
      "maxOutputTokens": 1000000,
      "temperature": 0.2,
      "thinkingConfig": {
        "thinkingLevel": "high"
      }
    }
  }'`,
  },
  {
    id: "vercel-ai-sdk",
    title: "Vercel AI SDK 7 Integration",
    language: "typescript",
    framework: "@ai-sdk/google",
    code: `import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text, usage } = await generateText({
  model: google('gemini-4-argon'),
  prompt: 'Synthesize comprehensive financial audit reports across 15 global subsidiaries.',
  maxTokens: 500000,
});

console.log('Result:', text);
console.log('Usage:', usage);`,
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Gemini 4 Argon and when was it released?",
    answer:
      "Gemini 4 Argon is Google DeepMind's flagship 4th-generation frontier artificial intelligence model. It was initially unveiled on September 30, 2026 for cyber defense partners and officially launched worldwide for all developers and users on October 13, 2026. Built to sustain deep reasoning across complex, long-horizon workflows, Argon excels in real-world software engineering, GDP-weighted enterprise knowledge work, and autonomous cybersecurity.",
  },
  {
    question: "How to use Gemini 4 Argon right now? (Access & Setup Guide)",
    answer:
      "Getting started with Gemini 4 Argon takes minutes: (1) Developers can generate API keys and start calling model ID 'gemini-4-argon' immediately in Google AI Studio; (2) Enterprise customers can deploy via Google Cloud Vertex AI with enterprise SLA and data isolation; (3) AI developers and subscribers can use it in Google Antigravity and the Gemini App (Ultra & Pro plans); (4) Certified cyber defense institutions access it through the Fairwind Program.",
  },
  {
    question: "What makes the 1 Million Output Token limit so significant?",
    answer:
      "Traditional frontier models (such as GPT-6 Astra and Claude Opus 5.5) cap a single response at 128,000 tokens (earlier models at 64,000 tokens). Argon increases output generation headroom to an industry-leading 1,000,000 tokens via a unified 1M input-output window and background continuation hops (64K per hop). This allows the model to produce massive monolithic code refactorings, complete multi-volume legal contracts, and deep reasoning trajectories in a single unbroken pass without lost context or manual chunking.",
  },
  {
    question:
      "Gemini 4 Argon vs Claude Opus 5.5: Which model should you choose?",
    answer:
      "When comparing Gemini Argon vs Claude Opus, the answer depends on your workload. Choose Gemini 4 Argon for massive monolithic code migrations, long-horizon multi-hour agent workflows, long video understanding, and enterprise legal/financial knowledge work (Argon scores 77.9% on DeepSWE v1.1 vs Opus 5.5's 74.2%, and offers 1,000,000 output tokens at $2/$10 introductory pricing — half of Claude Opus 5.5's cost). Choose Claude Opus 5.5 if your workflow relies heavily on deep bash/CLI automation, interactive terminal engineering (Terminal-Bench 4.0 66.4% vs Argon's 57.4%), and machine learning system tuning (PostTrainBench 49.3%).",
  },
  {
    question:
      "How does Gemini 4 Argon compare to GPT-6 Astra and Claude Opus 5.5?",
    answer:
      "According to Google's official Model Card, Argon leads on 13 of 18 benchmark evaluations: it is #1 on DeepSWE v1.1 (77.9% for agentic coding), the Vals Index (68.9% for GDP-weighted knowledge work), Zapier AutomationBench (51.3%), Harvey Legal Agent (19.6%), and LVBench video understanding (91.7%). Meanwhile, GPT-6 Astra retains leads on specialized puzzle coding (FrontierSWE v2 65.5%) and computer-use GUI automation (OSWorld 2.0 72.6%), and Claude Opus 5.5 remains dominant on deep CLI shell automation (Terminal-Bench 4.0 66.4%) and ML engineering (PostTrainBench 49.3%).",
  },
  {
    question: "What is the pricing for Gemini 4 Argon?",
    answer:
      "Through November 30, 2026, Argon is offered at an introductory rate of $2.00 per 1M input tokens and $10.00 per 1M output tokens (including thinking tokens) — half the cost of Claude Opus 5.5 and one-fifth the cost of GPT-6 Astra. In addition, cached input tokens receive a 95% discount ($0.10 per 1M tokens). Starting December 1, 2026, standard pricing will be $4.00 per 1M input and $20.00 per 1M output.",
  },
  {
    question: "What are the tunable thinking levels in Gemini 4 Argon?",
    answer:
      "Gemini 4 Argon supports tunable thinking levels: 'low', 'medium' (default), and 'high', as well as configurable thinkingBudget in tokens. This gives developers direct control over reasoning depth, allowing them to optimize for ultra-fast low-latency responses on simple queries or deep, multi-minute chain-of-thought exploration on complex architectural tasks.",
  },
  {
    question:
      "What real-world engineering results has Google demonstrated with Argon?",
    answer:
      "Internally at Google, Argon has autonomously migrated over 800,000 lines of C/C++ in the Fuchsia OS Zircon kernel into memory-safe Rust. In Google's open-source libgav1 video decoder, Argon refactored 32,000 lines of SIMD assembly/Rust through iterative profile-guided analysis, delivering a 2.7x speedup while maintaining bit-exact rendering.",
  },
  {
    question: "What is the Fairwind Program?",
    answer:
      "The Fairwind Program is Google's vetted cybersecurity initiative involving over 650 enterprise defense partners (including CrowdStrike, Palo Alto Networks, and Wiz). In this program, verified cyber defenders receive Argon with defensive cybersecurity capabilities unlocked to find, test, and patch critical zero-day software vulnerabilities before malicious actors can exploit them.",
  },
];

export const sources: { label: string; description: string; url: string }[] = [
  {
    label: "Google Blog — Global Launch (Oct 13, 2026)",
    description:
      "Gemini 4 Argon is now available for everyone: developers, enterprises, and Google AI Ultra subscribers.",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/",
  },
  {
    label: "Google DeepMind — Official Model Card",
    description:
      "Comprehensive benchmark evals covering DeepSWE, Vals Index, AutomationBench, and GraphWalks.",
    url: "https://deepmind.google/models/model-cards/gemini-4-argon/",
  },
  {
    label: "Google AI for Developers — API Documentation",
    description:
      "Technical specifications, 1M unified token limits, long decode background continuation, and pricing.",
    url: "https://ai.google.dev/gemini-api/docs/latest-model",
  },
  {
    label: "Google Cloud Blog — Vertex AI Availability",
    description:
      "Enterprise deployment details, SLA, region support, and security architecture on Google Cloud.",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud",
  },
  {
    label: "Google Blog — Initial Preview (Sep 30, 2026)",
    description:
      "Gemini 4 Argon: our next era of frontier intelligence by Koray Kavukcuoglu.",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
  },
  {
    label: "The Verge — Launch Coverage",
    description:
      "Google releases Gemini 4 Argon with 1M output tokens to developers and enterprise subscribers.",
    url: "https://www.theverge.com/tech/1002980/google-gemini-4-argon",
  },
];
