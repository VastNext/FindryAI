import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  DollarSign,
  FastForward,
  Filter,
  Flame,
  Layers,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";

export const typesafeJev = {
  name: "TypeSafe Jev",
  modelId: "typesafe-ai/jev",
  version: "jev-1.13.0 (alias: jev-latest)",
  releaseDate: "September 15, 2026",
  tagline: "The First System One Frontier Model",
  founder:
    "Diogo Almeida (Former OpenAI Researcher, Co-inventor of RLHF & InstructGPT)",
  funding: "$40M Seed led by DCVC",
  lastUpdated: "2026-09-24",
  changelog:
    "Updated with official benchmark figures (193.6x faster, 444.6x cheaper), refined etymology notes, and streamlined SERP meta specifications.",
  // Official URLs
  officialUrl: "https://typesafe.ai",
  consoleUrl: "https://console.typesafe.ai",
  blogUrl: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
  vercelGatewayUrl: "https://vercel.com/ai-gateway/models/jev",
  cloudflareDocsUrl:
    "https://developers.cloudflare.com/ai/models/typesafe/jev/",
  langchainDocsUrl:
    "https://www.langchain.com/blog/building-a-harness-with-jev",
  pydanticDocsUrl: "https://pydantic.dev/docs/ai/models/typesafe/",
  pypiUrl: "https://pypi.org/project/jev/",
  // Meta description & Hero
  description:
    "TypeSafe Jev AI deep dive: 193x faster, 444x cheaper System One decision model. $0.042/1M input tokens, free output, 70-500ms latency, zero hallucinations.",
  heroSubtitle:
    "A new paradigm for software automation: input unstructured state, get typed probabilistic decisions with mathematical confidence in milliseconds — without waiting for token-by-token autoregressive generation.",
};

export const heroStats: { value: string; label: string; sublabel?: string }[] =
  [
    {
      value: "70–500ms",
      label: "End-to-End Latency",
      sublabel: "193.6x faster on official benchmark (0.114s vs 8.566s)",
    },
    {
      value: "$0.042",
      label: "Per 1M Input Tokens",
      sublabel: "444.6x cheaper ($0.000081 vs $0.013880)",
    },
    {
      value: "$0.00",
      label: "Output Token Cost",
      sublabel: "Parallel sampling — output is free",
    },
    {
      value: "0 Hallucination",
      label: "Strict Type Safety",
      sublabel: "No string generation, zero type errors",
    },
  ];

export const corePrimitives: {
  icon: LucideIcon;
  name: string;
  nameEn: string;
  typeDesc: string;
  outputShape: string;
  description: string;
  exampleCode: string;
}[] = [
  {
    icon: CheckCircle2,
    name: "Noul",
    nameEn: "Boolean Probability",
    typeDesc: "Returns calibrated probability p(yes) ∈ [0, 1] for a statement",
    outputShape: "ans.noul ∈ [0.0, 1.0] (Calibrated probability float)",
    description:
      "Evaluates whether a statement is true (Yes/No). The return float IS both the decision and the statistical certainty without a detached confidence field. Trained with RLCD so probabilities reflect empirical ground-truth likelihood for strict threshold-gated branching.",
    exampleCode: `is_urgent: noul("Does the user request convey time-sensitive urgency?")`,
  },
  {
    icon: Filter,
    name: "Choice",
    nameEn: "Categorical 1-of-N",
    typeDesc:
      "Selects the best option from predefined labels (up to 255 options)",
    outputShape:
      "{ choice: string, probabilities: Record<string, number>, confidence: number }",
    description:
      "Evaluates categorical probabilities in parallel across candidate labels. Returns the selected choice, full probabilities dictionary, and overall confidence score.",
    exampleCode: `department: choice("Which team should handle this?", {
  billing: "Payments, invoices, refunds, charges",
  technical: "Bugs, outages, integrations, API errors",
  sales: "Pricing, upgrades, new enterprise contracts"
})`,
  },
  {
    icon: Scale,
    name: "Score",
    nameEn: "Ordinal Level Rating",
    typeDesc:
      "Rates inputs against ordered levels (2–10 discrete descriptive situations)",
    outputShape:
      "{ score: number, probabilities: number[], confidence: number }",
    description:
      "Used for severity grading, sentiment scoring, and defect triage. Returns the expected value mean alongside the discrete probabilities array across levels and a confidence metric.",
    exampleCode: `risk_level: score("Assess account security risk level", [
  "Low: Normal activity matching history",
  "Moderate: Unusual login location or new device",
  "High: Password reset combined with multiple failed logins"
])`,
  },
];

export const architectureInnovations: {
  icon: LucideIcon;
  title: string;
  badge: string;
  description: string;
}[] = [
  {
    icon: BrainCircuit,
    title: "RLCD: Reinforcement Learning for Calibrated Decisions",
    badge: "Mathematical Confidence Calibration",
    description:
      "Unlike standard RLHF which optimizes for human conversational preference or prose coherence, RLCD aligns the model's output probabilities directly with empirical ground-truth outcomes. An 85% confidence score from Jev reliably means 850 correct decisions out of 1,000 runs.",
  },
  {
    icon: Zap,
    title: "Non-Autoregressive Parallel Sampler",
    badge: "Zero Token-by-Token Overhead",
    description:
      "Traditional LLMs suffer from sequential autoregressive decoding, taking 2–5 seconds to stream JSON tokens. Jev drops text generation entirely, computing full probability distributions for dozens of questions in a single forward pass within 70ms–500ms.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Hallucination by Construction",
    badge: "Strict Compile-Time Type Safety",
    description:
      "Hallucination is intrinsically tied to open-ended string generation. Jev's output space is strictly constrained in advance by your schema. The model cannot produce unexpected keys, corrupted JSON, invalid types, or made-up tool arguments.",
  },
  {
    icon: Layers,
    title: "Speculative Fan-out",
    badge: "Evaluate 50+ Questions in 1 Request",
    description:
      "Evaluating 20 questions against the same state takes virtually the same time as evaluating a single question (~100ms) and pays input token fees only once. This completely overturns traditional serial LLM chaining.",
  },
];

export const comparisonTable: {
  feature: string;
  traditionalLlm: string;
  typesafeJev: string;
  whyItMatters: string;
}[] = [
  {
    feature: "Cognitive Paradigm",
    traditionalLlm: "System 2 (Slow, deliberate reasoning, chat, long prose)",
    typesafeJev:
      "System 1 (Fast, intuitive classification & structured decisions)",
    whyItMatters:
      "90% of software decisions are System 1 routing tasks; renting heavy System 2 models for them wastes massive latency & budget",
  },
  {
    feature: "End-to-End Latency",
    traditionalLlm:
      "1,500ms – 6,000ms (bottlenecked by output token generation)",
    typesafeJev: "70ms – 500ms (typically ~100ms with parallel sampling)",
    whyItMatters:
      "Enables real-time API middleware, synchronous UI flows, and tight agent loops",
  },
  {
    feature: "Input Pricing (per 1M Tokens)",
    traditionalLlm: "$2.50 – $30.00 / 1M Tokens",
    typesafeJev:
      "$0.042 / 1M Tokens (444.6x cheaper on official benchmark: $0.000081 vs $0.013880)",
    whyItMatters:
      "Drops per-decision cost down to fractions of a cent, unlocking high-frequency workflow automation",
  },
  {
    feature: "Output Token Pricing",
    traditionalLlm: "$10.00 – $60.00 / 1M Tokens",
    typesafeJev: "$0.00 (Output is too cheap to meter)",
    whyItMatters:
      "Asking 30 questions in one call incurs zero output token cost inflation",
  },
  {
    feature: "Type Safety & Hallucination",
    traditionalLlm:
      "Probabilistic JSON corruption, schema drift, hallucinated fields",
    typesafeJev: "Guaranteed compile-time types, zero hallucinations",
    whyItMatters:
      "Slots directly into standard code as reliable if/else decision logic without retry wrappers",
  },
  {
    feature: "Confidence Usability",
    traditionalLlm:
      "Raw logprobs are uncalibrated and tend to be overconfident",
    typesafeJev:
      "RLCD-calibrated probabilities with genuine statistical meaning",
    whyItMatters:
      "Allows setting hard numerical thresholds (e.g., confidence >= 0.85) for automated execution",
  },
];

export const designPatterns: {
  icon: LucideIcon;
  number: string;
  title: string;
  tagline: string;
  scenario: string;
  solution: string;
}[] = [
  {
    icon: FastForward,
    number: "01",
    title: "Speculative Fan-out",
    tagline:
      "Send context once, evaluate all potential business questions in parallel",
    scenario:
      "In support triage or moderation, traditional architectures make 5 sequential LLM calls to check urgency, category, sentiment, policy compliance, and spam, taking over 10 seconds.",
    solution:
      "Attach 15+ Noul/Choice/Score questions to a single Jev request. The 50KB state (~12,500 tokens) is sent once, evaluated in parallel, and returned in ~100ms for just ~$0.0005 (or ~$0.00004 for standard 800-token queries).",
  },
  {
    icon: Network,
    number: "02",
    title: "Confidence-Gated Cascades",
    tagline:
      "Handle 95% of routine decisions on Jev, route 5% ambiguity to frontier LLMs",
    scenario:
      "Running heavy models (GPT-5.6, Claude Opus 5) across all transactions creates prohibitive costs and latency, but purely rule-based automation risks false positives.",
    solution:
      "Front Jev as a gate: if confidence >= 0.85, execute automated action immediately. If confidence < 0.85, cascade to a heavy LLM for deep analysis, saving 90%+ total costs.",
  },
  {
    icon: ShieldAlert,
    number: "03",
    title: "Agent AutoMode & Guardrails",
    tagline: "Sub-100ms policy gate before executing destructive agent tools",
    scenario:
      "Autonomous coding or browser agents can run dangerous actions (e.g. file deletion, database modification, unauthorized billing) if left ungated.",
    solution:
      "LangChain or custom harness middleware calls Jev in 80ms before tool invocation to score risk and verify context, instantly blocking high-risk actions for human review.",
  },
  {
    icon: Filter,
    number: "04",
    title: "Retrieve-Then-Judge in RAG",
    tagline:
      "Drastically slim down LLM context windows by filtering retrieved passages",
    scenario:
      "Vector search returns 20 candidate chunks. Stuffing all chunks into generation prompts inflates token costs and dilutes model attention with irrelevant context.",
    solution:
      "Run Jev across the 20 passages in parallel with Noul('Does this passage contain direct factual evidence for the user query?'). Only pass high-confidence chunks to the generator.",
  },
  {
    icon: Activity,
    number: "05",
    title: "Composite Rubric Evaluation",
    tagline: "Automated compliance audits, code reviews, and resume screenings",
    scenario:
      "Auditing thousands of customer support transcripts or sales calls requires multi-dimensional quality scores against rigid compliance rubrics.",
    solution:
      "Define 5–10 Score and Noul criteria (politeness, issue resolution, PII compliance, policy adherence). Batch process records at scale with granular radar reporting.",
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
    id: "typescript-sdk",
    title: "TypeScript / Node.js Official SDK",
    language: "typescript",
    framework: "@typesafe-ai/sdk",
    code: `import { TypeSafeClient, choice, noul, score } from "@typesafe-ai/sdk";

const client = new TypeSafeClient({
  apiKey: process.env.TYPESAFE_API_KEY, // Defaults to env variable
});

const { answers, usage, model } = await client.systemOne({
  state: {
    ticket: {
      subject: "Double billed for invoice #INV-8821",
      message: "Hey, I saw two charges of $49 on my card today. Please fix this immediately!",
    },
    user_tier: "enterprise",
  },
  questions: {
    category: choice("What is the primary category of this ticket?", {
      billing: "Payment, double charges, invoices, subscription",
      technical: "System outages, API bugs, integrations",
      general: "General feedback or other inquiries",
    }),
    is_urgent: noul("Does the message demand immediate time-sensitive action?"),
    frustration_score: score("Rate customer frustration level", [
      "Calm & Informative",
      "Mildly frustrated",
      "Extremely angry / escalation risk",
    ]),
  },
});

console.log("Category:", answers.category.choice, "Confidence:", answers.category.confidence);
console.log("Is Urgent:", answers.is_urgent.noul, "Prob:", answers.is_urgent.probability);
console.log("Frustration:", answers.frustration_score.score);
// Latency: ~110ms | Cost: $0.00004 | Output Tokens: 0`,
  },
  {
    id: "python-decorator",
    title: "Python Function Decorator @jev.fn",
    language: "python",
    framework: "jev (PyPI)",
    code: `from typing import Literal
from pydantic import BaseModel, Field
import jev

class TriageResult(BaseModel):
    category: Literal["billing", "technical", "security", "sales"] = Field(
        description="Select the appropriate department to route this ticket"
    )
    is_urgent: bool = Field(
        description="Whether this ticket requires immediate on-call response"
    )
    priority_level: int = Field(
        ge=1, le=5,
        description="Priority scale from 1 (lowest) to 5 (critical blocker)"
    )

@jev.fn(model="jev-latest", bool_threshold=0.75)
def triage_ticket(ticket_text: str, user_plan: str) -> TriageResult:
    """Evaluate support ticket state:
    User Plan: {{ user_plan }}
    Content: {{ ticket_text }}
    """
    return triage_ticket.state()

# Invoke like standard Python code:
result = triage_ticket(
    ticket_text="Production database dropped connection, API returning 500s",
    user_plan="Enterprise"
)

print(result.category)       # "technical"
print(result.is_urgent)       # True
print(result.priority_level)  # 5`,
  },
  {
    id: "pydantic-ai",
    title: "Pydantic AI Integration (TypeSafeModel)",
    language: "python",
    framework: "pydantic-ai",
    code: `from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.typesafe import TypeSafeModel

class SecurityAudit(BaseModel):
    is_malicious: bool = Field(description="Is this shell command potentially dangerous?")
    risk_category: str = Field(description="Category: file_deletion, credential_leak, safe")
    confidence_margin: float = Field(description="Internal model margin")

# Use Jev as a high-speed structured decision agent
jev_model = TypeSafeModel("jev-latest")
guard_agent = Agent(jev_model, output_type=SecurityAudit)

result = guard_agent.run_sync("rm -rf /var/log/nginx/*")
print(result.data.is_malicious)  # True`,
  },
  {
    id: "langchain-middleware",
    title: "LangChain Model Routing & Guardrails Middleware",
    language: "python",
    framework: "langchain-typesafe",
    code: `from langchain_typesafe import TypeSafeClassifier, ModelRouterMiddleware, ModelChoice
from langchain.agents import create_agent

# Dynamic router: Route simple tasks to fast models, reserve Opus for hard cases
router = ModelRouterMiddleware(
    choices={
        "fast": ModelChoice(
            model="openai:gpt-5.6-luna",
            criteria="Direct lookup, simple extraction, localized file edits",
        ),
        "deep": ModelChoice(
            model="anthropic:claude-opus-5",
            criteria="Complex architecture design, tricky multi-file debugging",
        ),
    },
    instructions="Select the most cost-effective model suitable for the user task."
)

agent = create_agent(model="openai:gpt-5.6-luna", middleware=[router])`,
  },
  {
    id: "vercel-ai-sdk",
    title: "Vercel AI SDK 7 (experimental_evaluate)",
    language: "typescript",
    framework: "ai (Vercel AI SDK)",
    code: `import { experimental_evaluate as evaluate } from 'ai';

// Native evaluation with typesafe-ai/jev on Vercel AI Gateway
const result = await evaluate({
  model: 'typesafe-ai/jev',
  state: {
    order_id: 'ORD-9912',
    delivery_status: 'delivered',
    user_complaint: 'Package arrived with torn box and broken screen',
  },
  questions: {
    eligible_for_instant_refund: {
      type: 'boolean',
      instructions: 'Is the user eligible for an immediate return based on policy?',
    },
    action_item: {
      type: 'choice',
      instructions: 'What immediate action should the system take?',
      options: ['issue_refund', 'request_photos', 'transfer_to_agent'],
    },
  },
});

console.log(result.answers);`,
  },
  {
    id: "cloudflare-workers",
    title: "Cloudflare Workers AI Native Call",
    language: "typescript",
    framework: "Cloudflare Workers AI",
    code: `export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.AI.run('typesafe/jev', {
      state: 'Customer requested password reset from IP 198.51.100.44 (unknown country)',
      questions: {
        is_suspicious: {
          type: 'noul',
          instructions: 'Does this event represent anomalous account activity?',
        },
        action: {
          type: 'choice',
          instructions: 'Recommended immediate security response',
          criteria: {
            block_and_notify: 'Trigger 2FA challenge and send alert email',
            allow_silent: 'Safe to proceed with normal flow',
          },
        },
      },
    });

    return Response.json(response);
  },
};`,
  },
];

export const interactiveScenarios: {
  id: string;
  name: string;
  badge: string;
  state: Record<string, unknown>;
  questions: {
    id: string;
    label: string;
    type: "noul" | "choice" | "score";
    result: string | number | boolean;
    probability?: number;
    confidence: number;
    details?: string;
  }[];
}[] = [
  {
    id: "support-triage",
    name: "Customer Support Triage & SLA Routing",
    badge: "Real-Time Triage",
    state: {
      subject: "Urgent: Stripe webhook failing with 500 errors on checkout",
      customer_tier: "Enterprise ($20k/yr)",
      message:
        "All our customer payments are stuck in pending since 20 minutes ago. We are losing transactions right now. Need someone from integrations on call ASAP.",
    },
    questions: [
      {
        id: "urgency",
        label: "Urgency Assessment (Noul)",
        type: "noul",
        result: true,
        probability: 0.985,
        confidence: 0.99,
        details:
          "Explicit time-sensitivity, revenue loss mentioned, and on-call engineer requested",
      },
      {
        id: "department",
        label: "Department Routing (Choice)",
        type: "choice",
        result: "technical_integrations",
        confidence: 0.96,
        details:
          "Webhook 500 server errors and payment API failure routed to integrations engineering",
      },
      {
        id: "escalation_score",
        label: "Escalation Severity Rating (Score: 1–5)",
        type: "score",
        result: 5,
        confidence: 0.94,
        details:
          "Enterprise tier customer with critical revenue outage triggers automated P0 page",
      },
    ],
  },
  {
    id: "refund-review",
    name: "Automated Refund Policy & Duplicate Charge Audit",
    badge: "Fintech & E-Commerce",
    state: {
      order_id: "A-104",
      charges: [
        { amount: "$49.00", timestamp: "14:02:11", status: "captured" },
        { amount: "$49.00", timestamp: "14:02:13", status: "captured" },
      ],
      user_note:
        "I clicked checkout once but got billed twice within 2 seconds.",
      refund_policy:
        "Duplicate charges verified within 10 seconds of each other are automatically refundable.",
    },
    questions: [
      {
        id: "is_duplicate",
        label: "Is this a duplicate charge? (Noul)",
        type: "noul",
        result: true,
        probability: 0.994,
        confidence: 0.99,
        details:
          "Identical amounts within a 2-second timestamp window match duplicate charge pattern",
      },
      {
        id: "policy_match",
        label: "Complies with refund policy? (Noul)",
        type: "noul",
        result: true,
        probability: 0.978,
        confidence: 0.98,
        details:
          "Fully satisfies the 10-second duplicate transaction automated refund policy",
      },
      {
        id: "recommended_action",
        label: "Recommended System Action (Choice)",
        type: "choice",
        result: "auto_refund_second_charge",
        confidence: 0.98,
        details:
          "Confidence > 0.95 enables immediate Stripe Refund API dispatch without human review",
      },
    ],
  },
  {
    id: "agent-safety",
    name: "AI Agent Tool Invocation Guardrails",
    badge: "Agent Guardrails",
    state: {
      agent_id: "deploy-bot",
      proposed_tool: "bash_exec",
      arguments: "DROP DATABASE staging_demo_db CASCADE;",
      current_context:
        "User asked to clear out old test fixtures on staging server",
    },
    questions: [
      {
        id: "is_dangerous",
        label: "Destructive Action Check (Noul)",
        type: "noul",
        result: true,
        probability: 0.999,
        confidence: 0.999,
        details:
          "DROP DATABASE is a catastrophic irreversible data destruction command",
      },
      {
        id: "policy_action",
        label: "Enforcement Policy (Choice)",
        type: "choice",
        result: "block_and_require_human_approval",
        confidence: 0.99,
        details:
          "Blocks automated tool execution and triggers a Slack authorization prompt to the DevOps lead",
      },
    ],
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question:
      "What is TypeSafe Jev, and how does it differ from ChatGPT or Claude?",
    answer:
      "TypeSafe Jev is the first System One frontier model from TypeSafe AI, founded by former OpenAI researcher and RLHF co-inventor Diogo Almeida. Traditional LLMs (System 2 models like GPT-5, Claude 3.5) are built to generate natural language text and code token-by-token over several seconds, which can introduce hallucinations and schema syntax errors. In contrast, Jev completely abandons natural language text generation to output strictly typed probabilistic decisions (Booleans, Choices, Scores) in 70–500ms (40x–200x faster than LLMs) with compile-time type safety and zero hallucinations.",
  },
  {
    question: "Why is Jev mathematically incapable of hallucinating?",
    answer:
      "AI hallucinations arise from the open-ended nature of autoregressive sequence generation. Jev does not generate free-form text tokens. Its output space is strictly bounded prior to execution by the developer's schema (predefined choices, ordinal levels, or Boolean criteria). The underlying computation projects unstructured state onto a discrete decision space, making it impossible for the model to emit non-existent keys, malformed JSON, or hallucinated tool parameters.",
  },
  {
    question: "What is the origin of the names 'System One' and 'Jev'?",
    answer:
      "The 'System One' moniker originates from Daniel Kahneman's cognitive framework in 'Thinking, Fast and Slow', distinguishing fast, intuitive thinking (System 1) from slow, deliberate reasoning (System 2). While TypeSafe AI has not officially documented the etymology of 'Jev', the AI engineering community widely attributes it to 19th-century economist William Stanley Jevons, author of the Jevons Paradox: as the cost and latency of decision intelligence drops exponentially (from cents/seconds to microcents/milliseconds), the aggregate volume and demand for automated software decisions will multiply exponentially.",
  },
  {
    question: "What is RLCD (Reinforcement Learning for Calibrated Decisions)?",
    answer:
      "RLCD is TypeSafe AI's proprietary training method. Standard RLHF aligns models to subjective human conversational preferences. RLCD, however, directly trains the model's output probabilities to match empirical ground-truth outcomes. This means Jev's reported confidence scores have genuine statistical significance, allowing developers to safely implement automated confidence-gated logic (e.g., auto-executing when confidence >= 0.85 and escalating to humans when below).",
  },
  {
    question: "What is Speculative Fan-out?",
    answer:
      "Because of Jev's non-autoregressive parallel sampler architecture, evaluating 1 question versus 50 questions against the same state takes practically the same time (~100ms) and bills input tokens only once. Developers can evaluate all prospective business verifications (urgency, categorization, sentiment, policy compliance, security) in a single API round-trip without serial latency bottlenecks.",
  },
  {
    question: "How do I access TypeSafe Jev and obtain API keys?",
    answer:
      "Access is available through three official channels: (1) TypeSafe Official Console: Sign up for early access at typesafe.ai and create API keys at console.typesafe.ai; (2) Vercel AI Gateway: Direct access using model ID 'typesafe-ai/jev' with Vercel AI SDK 7's experimental_evaluate; (3) Cloudflare Workers AI: Instant edge execution via env.AI.run('typesafe/jev', ...).",
  },
  {
    question: "Will Jev replace frontier LLMs like GPT-5 or Claude Opus?",
    answer:
      "No. They are highly complementary in a cascade architecture. In production systems, over 90% of decisions (such as ticket triage, intent routing, RAG chunk filtering, and guardrail validation) are high-frequency System 1 tasks that Jev handles in 100ms for $0.042/1M tokens. The remaining 10% of open-ended synthesis, creative generation, and complex reasoning can be selectively routed to GPT or Claude, achieving frontier intelligence at a fraction of the cost.",
  },
  {
    question: "Which programming languages and frameworks support Jev?",
    answer:
      "Jev features broad ecosystem integrations: an official TypeScript/Node.js SDK (@typesafe-ai/sdk), a Python decorator package (jev on PyPI via @jev.fn), Pydantic AI (TypeSafeModel), LangChain (langchain-typesafe), Vercel AI SDK 7, and Cloudflare Workers AI.",
  },
];

export const accessRoutes: {
  icon: LucideIcon;
  title: string;
  badge: string;
  requirement: string;
  steps: string[];
}[] = [
  {
    icon: Terminal,
    title: "TypeSafe Official API",
    badge: "Direct API",
    requirement: "Waitlist approval or early access key",
    steps: [
      "Create an API key at console.typesafe.ai/settings/keys",
      'Set environment variable export TYPESAFE_API_KEY="sk-..."',
      "Install official SDK: npm i @typesafe-ai/sdk or pip install jev",
    ],
  },
  {
    icon: Zap,
    title: "Vercel AI Gateway",
    badge: "AI SDK 7+",
    requirement: "Vercel Account & Gateway Key",
    steps: [
      "Upgrade Vercel AI SDK to 7.0.105+",
      "Use Model ID: typesafe-ai/jev",
      "Call via experimental_evaluate for standardized structured queries",
    ],
  },
  {
    icon: Cpu,
    title: "Cloudflare Workers AI",
    badge: "Edge Native",
    requirement: "Cloudflare Developer Account",
    steps: [
      "Bind AI in worker script: env.AI.run('typesafe/jev', ...)",
      "Millisecond edge routing across 300+ global data centers",
      "Available in TypeScript and Python Workers runtimes",
    ],
  },
  {
    icon: Bot,
    title: "LangChain & Pydantic AI",
    badge: "Agent Frameworks",
    requirement: "Python 3.10+",
    steps: [
      "pip install langchain-typesafe pydantic-ai",
      "Import TypeSafeClassifier or ModelRouterMiddleware",
      "Integrate AutoMode security guardrails and dynamic model routing",
    ],
  },
];

export const sources: { label: string; description: string; url: string }[] = [
  {
    label: "TypeSafe AI — Launch Announcement",
    description: "Introducing System One Models and Jev by Diogo Almeida",
    url: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
  },
  {
    label: "Cloudflare Developer Docs — Jev Model Card",
    description:
      "Cloudflare AI Docs: Jev (typesafe) structured evaluation model",
    url: "https://developers.cloudflare.com/ai/models/typesafe/jev/",
  },
  {
    label: "Vercel AI Gateway — Model Specifications & Pricing",
    description: "Vercel AI Gateway: typesafe-ai/jev model specifications",
    url: "https://vercel.com/ai-gateway/models/jev",
  },
  {
    label: "LangChain Official Blog — Building with Jev",
    description:
      "What Is Jev? A Guide to TypeSafe AI's System One Model with LangChain",
    url: "https://www.langchain.com/blog/building-a-harness-with-jev",
  },
  {
    label: "Pydantic AI Docs — TypeSafe Integration Guide",
    description: "Pydantic AI: Running TypeSafeModel with Jev",
    url: "https://pydantic.dev/docs/ai/models/typesafe/",
  },
  {
    label: "InfoWorld In-Depth Feature",
    description: "TypeSafe AI’s new models work with machines, not humans",
    url: "https://www.infoworld.com/article/4223468/typesafe-ais-new-models-work-with-machines-not-humans.html",
  },
  {
    label: "DEV Community Practical Guide",
    description:
      "How to Use Jev: A practical guide to TypeSafe's System One model",
    url: "https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e",
  },
];
