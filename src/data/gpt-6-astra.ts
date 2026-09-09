import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  FlaskConical,
  Layers,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";

export const gpt6Astra = {
  name: "GPT-6 Astra",
  modelId: "gpt-6-astra",
  releaseDate: "September 3, 2026",
  tagline: "The Future Is Here",
  // official homepage to navigate users to
  officialUrl: "https://openai.com/index/gpt-6-astra/",
  chatgptUrl: "https://chatgpt.com",
  developerUrl: "https://developers.openai.com",
  systemCardUrl: "https://deploymentsafety.openai.com/gpt-6-astra",
  safetyUrl: "https://openai.com/index/path-to-astra/",
  arcPrizeUrl: "https://arcprize.org/blog/astra",
  // meta description — promises something the visitor can act on
  description:
    "GPT-6 Astra is live on ChatGPT and the OpenAI API. See how to get access in minutes, what it costs, and what its AGI-level benchmark results mean for your work.",
  heroSubtitle:
    "OpenAI's most intelligent and aligned model yet — welcomed by many as the opening of the AGI era. It matches human experts on frontier benchmarks, operates computers like people do, and writes production-grade software.",
};

export const heroStats: { value: string; label: string }[] = [
  { value: "99.9%", label: "ARC-AGI-3 (SOTA)" },
  { value: "1.05M", label: "token context window" },
  { value: "72.6%", label: "OSWorld 2.0 computer use" },
  { value: "96.0%", label: "GPQA Diamond" },
];

export const agiTakes: {
  quote: string;
  author: string;
  role: string;
}[] = [
  {
    quote: "The best model we've ever tested.",
    author: "Greg Kamradt",
    role: "ARC Prize Foundation",
  },
  {
    quote: "The story is: end of one era, start of another.",
    author: "Greg Burnham",
    role: "Epoch AI",
  },
  {
    quote: "A noticeable step-function change in frontier model capabilities.",
    author: "ARC Prize team",
    role: "on GPT-6 Astra's ARC-AGI-3 run",
  },
];

export const capabilities: {
  icon: LucideIcon;
  title: string;
  metric: string;
  description: string;
}[] = [
  {
    icon: MonitorSmartphone,
    title: "Computer use",
    metric: "OSWorld 2.0 · 72.6%",
    description:
      "Astra sees the screen and works like a person: filling forms, updating CRMs, running frontend QA and installing software — finishing OSWorld tasks in about 47% less time than GPT-5.6 Sol.",
  },
  {
    icon: Code2,
    title: "Best-in-class coding",
    metric: "SRE-Bench · 88.0%",
    description:
      "Described by OpenAI as the best software engineering model to date. A new Codex integration keeps searchable notes across context windows instead of compressing them away.",
  },
  {
    icon: FlaskConical,
    title: "Science & math",
    metric: "FrontierMath Tier 4 · 97.6%",
    description:
      "Astra helped establish a new bound of 186 for short prime gaps — improving a term in the mathematics that had stood unchanged for over 80 years.",
  },
  {
    icon: Layers,
    title: "Million-token memory",
    metric: "1,050,000-token context",
    description:
      "Reads entire codebases and book-length corpora in one pass, scoring 96.3% on MRCR v2 (8-needle) across 512K–1M-token evaluations.",
  },
  {
    icon: Bot,
    title: "Agentic workflows",
    metric: "Agents' Last Exam · 59.3%",
    description:
      "Plans and executes long professional tasks end to end. Partners report complex creative workflows completing with up to 20% fewer tokens than other frontier models.",
  },
  {
    icon: ShieldCheck,
    title: "Alignment & safety",
    metric: "0% scope violations",
    description:
      "On an impossible-task eval, Astra violated its scope 0% of the time vs 48% for GPT-5.6 Sol. During testing it discovered two real zero-days — and disclosed them to maintainers.",
  },
];

export const benchmarks: {
  name: string;
  astra: string;
  sol: string;
  other: string;
  otherLabel: string;
}[] = [
  {
    name: "ARC-AGI-3 (adapter harness)",
    astra: "99.9%",
    sol: "7.8%",
    other: "30.2%",
    otherLabel: "Claude Opus 5",
  },
  {
    name: "FrontierMath Tier 4",
    astra: "97.6%",
    sol: "83.0%",
    other: "—",
    otherLabel: "",
  },
  {
    name: "ExploitBench",
    astra: "100%",
    sol: "78.5%",
    other: "—",
    otherLabel: "",
  },
  {
    name: "SRE-Bench (single try)",
    astra: "88.0%",
    sol: "55.9%",
    other: "—",
    otherLabel: "",
  },
  {
    name: "Terminal-Bench 4.0",
    astra: "57.9%",
    sol: "—",
    other: "55.8%",
    otherLabel: "Fable 5.1",
  },
  {
    name: "GPQA Diamond",
    astra: "96.0%",
    sol: "94.6%",
    other: "—",
    otherLabel: "",
  },
  {
    name: "Agents' Last Exam",
    astra: "59.3%",
    sol: "—",
    other: "55.5%",
    otherLabel: "Claude Opus 5",
  },
];

export const specs: { label: string; value: string; note?: string }[] = [
  {
    label: "API model ID",
    value: "gpt-6-astra",
    note: "GPT-6 Astra Pro tier included with Pro / Business / Enterprise",
  },
  {
    label: "Context window",
    value: "1,050,000 tokens",
    note: "128,000 max output tokens",
  },
  {
    label: "Input / output",
    value: "Text + images → text",
    note: "Reasoning model with adjustable effort (low → max)",
  },
  {
    label: "Knowledge cutoff",
    value: "April 30, 2026",
  },
  {
    label: "API pricing",
    value: "$10 / $50 per 1M tokens",
    note: "Input / output up to 272K context · Batch & Flex −50% · Fast mode 2×",
  },
  {
    label: "Availability",
    value: "ChatGPT · API · Azure · AWS Bedrock",
    note: "Rolling out to Plus, Pro, Business and Enterprise plans",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is GPT-6 Astra?",
    answer:
      'GPT-6 Astra is OpenAI\'s flagship frontier model, released on September 3, 2026 as the successor to GPT-5.6 "Sol". It is a multimodal reasoning model (text and image input) with a 1.05M-token context window, and it currently holds state-of-the-art results across coding, computer-use and agentic benchmarks.',
  },
  {
    question: "Is GPT-6 Astra AGI?",
    answer:
      'It is the model that pushed the AGI debate into the mainstream — OpenAI positions it as "a new generation of intelligence", and on ARC-AGI-3 it beat the median human\'s action efficiency on 96% of levels, what ARC Prize calls "effectively reaching human parity on the benchmark". But ARC Prize itself is explicit: saturating a benchmark is not proof of AGI, and real-world open-endedness remains unsolved. The honest answer: it is the strongest step yet, and the debate is now live.',
  },
  {
    question: "How can I access GPT-6 Astra?",
    answer:
      "It is rolling out to ChatGPT Plus, Pro, Business and Enterprise plans over the coming days from September 3, 2026, and is available via the OpenAI API (model ID: gpt-6-astra), Microsoft Azure and AWS Bedrock. Enterprise access is off by default and must be enabled by administrators.",
  },
  {
    question: "How much does GPT-6 Astra cost?",
    answer:
      "It is included in existing ChatGPT subscription allowances, with extra usage available via credits. On the API, Astra costs $10 per million input tokens and $50 per million output tokens (up to 272K context; long-context requests bill at higher rates). Batch and Flex modes are half price, and Fast mode runs at up to 2× speed for 2× price.",
  },
  {
    question: "What can it actually do today?",
    answer:
      "Operate a computer — forms, CRM updates, research, document drafting, frontend QA and software troubleshooting; write and maintain production software (the best model for software engineering to date, per OpenAI); solve frontier math problems, including improving an 80-year-old bound in prime-gap theory; and analyze million-token corpora in a single pass. In safety testing it even discovered two previously unknown zero-days, which were responsibly disclosed.",
  },
];

export const sources: { label: string; description: string; url: string }[] = [
  {
    label: "OpenAI — GPT-6 Astra announcement",
    description: "The official homepage and launch post for GPT-6 Astra.",
    url: "https://openai.com/index/gpt-6-astra/",
  },
  {
    label: "OpenAI — Path to Astra",
    description:
      "Frontier safety update: critical capabilities and safeguards behind the launch.",
    url: "https://openai.com/index/path-to-astra/",
  },
  {
    label: "GPT-6 Astra system card",
    description:
      "Deployment safety hub: evaluations, limitations and monitoring notes.",
    url: "https://deploymentsafety.openai.com/gpt-6-astra",
  },
  {
    label: "ARC Prize — Astra on ARC-AGI-3",
    description:
      "Independent evaluation: human parity on action efficiency, harness details and cost.",
    url: "https://arcprize.org/blog/astra",
  },
  {
    label: "DataLearner — model card",
    description:
      "Full technical specifications: context, pricing tiers and modalities.",
    url: "https://www.datalearner.com/ai-models/pretrained-models/gpt-6-astra",
  },
  {
    label: "财联社 (Cailianshe) — 发布报道",
    description:
      'Chinese coverage: "OpenAI 发布地球最强大模型 GPT-6，宣告欢迎来到 AGI 时代".',
    url: "https://www.cls.cn/detail/2473745",
  },
];
