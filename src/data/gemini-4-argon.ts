import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock,
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
  releaseDate: "September 30, 2026",
  tagline: "Our Next Era of Frontier Intelligence",
  developer: "Google DeepMind",
  leadAuthor:
    "Koray Kavukcuoglu (SVP, Google DeepMind and Chief AI Architect, Google)",
  accessProgram:
    "Fairwind Program (Rolling out to Cyber Defenders, then Paid API & Google AI Ultra)",
  // Official & Reference URLs
  officialUrl:
    "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
  deepmindUrl: "https://deepmind.google/technologies/gemini/",
  theVergeUrl: "https://www.theverge.com/tech/1002980/google-gemini-4-argon",
  siliconAngleUrl:
    "https://siliconangle.com/2026/09/30/googles-new-frontier-ai-model-gemini-4-argon-goes-to-cybersecurity-defenders-first/",
  markTechPostUrl:
    "https://www.marktechpost.com/2026/09/30/google-deepmind-unveils-gemini-4-argon-with-1m-output-tokens-for-coding-knowledge-work-and-cyber-defense/",
  // Meta description & Hero
  description:
    "Gemini 4 Argon is Google DeepMind's flagship 4th-generation frontier model announced on September 30, 2026. Engineered for long-horizon software engineering, complex legal/finance knowledge work, and autonomous cybersecurity defense, Argon introduces an industry-first 1,000,000 output token generation ceiling, 95% prompt caching discount, and introductory pricing of $2/$10 per 1M tokens.",
  heroSubtitle:
    "Engineered for deep reasoning across long-horizon workflows: generate up to 1M tokens in a single trajectory, autonomously discover and patch zero-day vulnerabilities, and orchestrate complex enterprise automation.",
};

export const heroStats: { value: string; label: string; sublabel?: string }[] =
  [
    {
      value: "1,000,000",
      label: "Max Output Tokens",
      sublabel: "Up from 64K — 15x higher than rivals",
    },
    {
      value: "$2.00 / $10",
      label: "Introductory API Price",
      sublabel: "Input / Output per 1M tokens",
    },
    {
      value: "95% OFF",
      label: "Prompt Caching Discount",
      sublabel: "Cached input at $0.10 / 1M tokens",
    },
    {
      value: "77.9%",
      label: "DeepSWE v1.1 Score",
      sublabel: "New SOTA in long-horizon coding",
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
      "While Claude Opus 5.5 and GPT-6 Astra cap single-turn responses at 128K tokens, Argon expands generation headroom to a full 1M tokens. This enables end-to-end monolithic refactoring, multi-volume legal drafting, and continuous reasoning chains without chunking or losing intermediate states.",
    highlights: [
      "Generates entire production modules without pagination",
      "Executes hundreds of thousands of reasoning steps in one pass",
      "Eliminates loss of context caused by multi-turn conversation chopping",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Autonomous Cyber Defense",
    badge: "Fairwind Program",
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
      "91.9% on Vibe Code Bench",
      "Automated Rust borrow-checker resolution across massive repos",
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
      "65.4% on Vals Finance Agent v2",
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
    notes: "New SOTA on multi-file agentic software engineering",
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
    notes: "Dominates complex legal research and contract drafting",
  },
  {
    benchmark: "Vals Finance Agent v2",
    category: "Financial Research",
    gemini4Argon: "65.4%",
    gpt6Astra: "53.5%",
    claudeOpus55: "58.6%",
    claudeFable51: "58.9%",
    winner: "argon",
    notes: "Multi-step quantitative analysis & corporate filings",
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
    benchmark: "Vibe Code Bench",
    category: "Interactive Frontend",
    gemini4Argon: "91.9%",
    gpt6Astra: "89.6%",
    claudeOpus55: "90.3%",
    claudeFable51: "90.3%",
    winner: "argon",
    notes: "Evaluates rapid aesthetic UI & full-stack app prototyping",
  },
  {
    benchmark: "FrontierSWE v2",
    category: "Extreme Coding Tasks",
    gemini4Argon: "55.0%",
    gpt6Astra: "65.5%",
    claudeOpus55: "62.3%",
    claudeFable51: "56.3%",
    winner: "astra",
    notes: "GPT-6 Astra maintains lead on specialized hard SWE puzzles",
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
    benchmark: "OSWorld 2.0",
    category: "Computer Use / GUI",
    gemini4Argon: "69.2%",
    gpt6Astra: "72.6%",
    claudeOpus55: "—",
    claudeFable51: "—",
    winner: "astra",
    notes: "GPT-6 Astra leads direct desktop screen automation",
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
    model: "Gemini 4 Argon (Intro)",
    provider: "Google DeepMind",
    inputPrice: "$2.00 / 1M",
    outputPrice: "$10.00 / 1M",
    cachedInputPrice: "$0.10 / 1M (-95%)",
    maxOutputLimit: "1,000,000 tokens",
    contextWindow: "1,000,000+ tokens",
  },
  {
    model: "Gemini 4 Argon (Standard)",
    provider: "Google DeepMind",
    inputPrice: "$4.00 / 1M",
    outputPrice: "$20.00 / 1M",
    cachedInputPrice: "$0.20 / 1M (-95%)",
    maxOutputLimit: "1,000,000 tokens",
    contextWindow: "1,000,000+ tokens",
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
    maxOutputTokens: 1000000, // 1M tokens trajectory ceiling
    temperature: 0.2,
    thinkingConfig: {
      thinkingBudget: 64000, // Allocate deep internal reasoning budget
    },
  },
});

console.log("Response text length:", response.text.length);
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

# Execute automated cybersecurity patch analysis
response = client.models.generate_content(
    model="gemini-4-argon",
    contents="Audit the following repository for memory-safety zero-days and emit verifiable patches:",
    config=types.GenerateContentConfig(
        max_output_tokens=1_000_000,
        temperature=0.1,
        system_instruction="You are an autonomous Fairwind defensive cybersecurity agent."
    )
)

print(f"Patches Generated: {len(response.text)}")
print(f"Input Tokens: {response.usage_metadata.prompt_token_count}")
print(f"Output Tokens: {response.usage_metadata.candidates_token_count}")`,
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
      "temperature": 0.2
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

export const accessStages: {
  stage: string;
  status: "active" | "next" | "future";
  audience: string;
  description: string;
}[] = [
  {
    stage: "Wave 1: Fairwind Program (Current)",
    status: "active",
    audience: "Vetted Cybersecurity Defenders & Internal Google Teams",
    description:
      "Live as of September 30, 2026. 650+ verified organizations (including CrowdStrike, Palo Alto Networks, Wiz) receive Argon with defensive cybersecurity capabilities unlocked.",
  },
  {
    stage: "Wave 2: Early Access Developers (Next)",
    status: "next",
    audience: "Paid Gemini API Customers & Google AI Ultra Subscribers",
    description:
      "Rolling out to active enterprise API accounts and Google AI Ultra tier users once pre-release US government voluntary safety reviews are finalized.",
  },
  {
    stage: "Wave 3: General Commercial Availability",
    status: "future",
    audience: "Global Developers, Google Cloud Vertex AI & Workspace",
    description:
      "Broad deployment across Vertex AI, AI Studio, and consumer web interfaces. Introductory $2/$10 pricing converts to standard $4/$20 pricing.",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Gemini 4 Argon and when was it announced?",
    answer:
      "Gemini 4 Argon is Google DeepMind's next-generation frontier artificial intelligence model, officially announced on September 30, 2026 by Koray Kavukcuoglu (SVP of DeepMind and Chief AI Architect). Built to sustain deep reasoning across complex, long-horizon workflows, Argon excels in real-world software engineering, enterprise legal/financial knowledge work, and autonomous cybersecurity defense.",
  },
  {
    question: "What makes the 1 Million Output Token limit so significant?",
    answer:
      "Traditional frontier models (such as GPT-6 Astra and Claude Opus 5.5) cap a single generated response at 128,000 tokens (earlier Gemini models topped out at 64,000). Argon increases the output ceiling by over 7.8x to a full 1,000,000 tokens. This allows the model to produce massive software migrations, complete multi-hundred-page research analyses, and deep monolithic reasoning trajectories in a single unbroken pass without pagination or lost state.",
  },
  {
    question:
      "How does Gemini 4 Argon compare to GPT-6 Astra and Claude Opus 5.5?",
    answer:
      "Argon leads outright on 12 of 18 major industry benchmarks: it is #1 on DeepSWE v1.1 (77.9% for long-horizon coding), the Vals Index (68.9% for GDP-weighted knowledge work), Zapier AutomationBench (51.3%), Harvey Legal Agent (19.6%), and LVBench video understanding (91.7%). However, GPT-6 Astra retains leads on specialized puzzle coding (FrontierSWE v2 65.5%) and computer-use GUI automation (OSWorld 2.0 72.6%), while Claude Opus 5.5 remains dominant on deep CLI shell automation (Terminal-Bench 4.0 66.4%).",
  },
  {
    question: "What is the pricing for Gemini 4 Argon?",
    answer:
      "Argon launches with an aggressive introductory rate of $2.00 per million input tokens and $10.00 per million output tokens (exactly half of Claude Opus 5.5 and one-fifth of GPT-6 Astra). In addition, cached input tokens receive a 95% discount, costing just $0.10 per million tokens. After the introductory phase concludes, standard rates will be $4.00 per 1M input tokens and $20.00 per 1M output tokens.",
  },
  {
    question: "What is the Fairwind Program and who can use Argon today?",
    answer:
      "The Fairwind Program is Google's vetted defensive cybersecurity initiative with over 650 participating enterprise defense partners (including CrowdStrike and Palo Alto Networks). In this initial phase, verified cyber defenders and Google internal teams receive Argon without cyber guardrails to find, validate, and patch critical zero-day software vulnerabilities. General public developer access will follow via paid API keys and Google AI Ultra subscriptions.",
  },
  {
    question:
      "What real-world engineering results has Google demonstrated with Argon?",
    answer:
      "Internally at Google, Argon has migrated over 800,000 lines of C/C++ in the Fuchsia OS Zircon kernel into memory-safe Rust. In Google's open-source libgav1 video decoder, Argon agents refactored 32,000 lines of SIMD assembly/Rust through iterative profile-guided compiler experiments, delivering a 2.7x execution speedup while preserving bit-exact video rendering.",
  },
  {
    question: "Is there a free tier for Gemini 4 Argon?",
    answer:
      "No. There is no free tier announced for Argon. Public commercial availability will start with paid Gemini API developer projects and Google AI Ultra subscribers.",
  },
];

export const sources: { label: string; description: string; url: string }[] = [
  {
    label: "Google Blog — Official Announcement",
    description:
      "Gemini 4 Argon: our next era of frontier intelligence by Koray Kavukcuoglu",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
  },
  {
    label: "The Verge — Launch Coverage",
    description:
      "Google announces Gemini 4 and rolls out to trusted cyber defenders",
    url: "https://www.theverge.com/tech/1002980/google-gemini-4-argon",
  },
  {
    label: "SiliconANGLE — Deep Dive",
    description:
      "Google's new frontier AI model Gemini 4 Argon goes to cybersecurity defenders first",
    url: "https://siliconangle.com/2026/09/30/googles-new-frontier-ai-model-gemini-4-argon-goes-to-cybersecurity-defenders-first/",
  },
  {
    label: "MarkTechPost — Technical Breakdown",
    description:
      "Google DeepMind Unveils Gemini 4 Argon with 1M Output Tokens for Coding & Cyber Defense",
    url: "https://www.marktechpost.com/2026/09/30/google-deepmind-unveils-gemini-4-argon-with-1m-output-tokens-for-coding-knowledge-work-and-cyber-defense/",
  },
  {
    label: "9to5Google — Announcement Summary",
    description: "Google announces Gemini 4 Argon as its new frontier model",
    url: "https://9to5google.com/2026/09/30/gemini-4-argon-announcement/",
  },
];
