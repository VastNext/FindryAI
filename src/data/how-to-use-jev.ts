import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  DollarSign,
  ExternalLink,
  Filter,
  Layers,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

export interface AccessRoute {
  id: string;
  name: string;
  category:
    | "direct_provider"
    | "gateway_aggregator"
    | "framework_orchestration";
  categoryLabel: string;
  authRequirement: string;
  pricingTerms: string;
  bestFor: string;
  consoleUrl: string;
  verifiedDate: string;
  notes?: string;
  isPromoActive?: boolean;
}

export interface ProductionRecipe {
  id: string;
  title: string;
  primitivesUsed: string;
  scenario: string;
  whyJevOverLlm: string;
  codeLanguage: "python" | "typescript";
  status: "verified_schema" | "illustrative_snippet";
  code: string;
  sampleInput: string;
  sampleOutput: string;
  thresholdTuning: string;
  limitations: string;
}

export const howToUseJevMeta = {
  title: "How to Use Jev AI: 7 Access Routes, Setup & 4 Production Recipes",
  description:
    "Complete developer guide to accessing and integrating TypeSafe Jev AI: 7 access routes compared, Python/TS setup in 10 minutes, and 4 production recipes.",
  lastUpdated: "2026-09-24",
  officialDocsUrl: "https://docs.typesafe.ai",
  officialConsoleUrl: "https://console.typesafe.ai",
  hubUrl: "/typesafe-jev",
};

export const accessRoutes: AccessRoute[] = [
  {
    id: "typesafe-direct",
    name: "TypeSafe Direct",
    category: "direct_provider",
    categoryLabel: "Official Direct API",
    authRequirement: "TypeSafe API Key (via console.typesafe.ai/settings/keys)",
    pricingTerms:
      "$0.042 / 1M input tokens, free output; new accounts get $5 credits",
    bestFor:
      "Production workloads demanding lowest latency (~100ms) and direct access to jev-1.13 / jev-latest.",
    consoleUrl: "https://console.typesafe.ai",
    verifiedDate: "2026-09-24",
    notes:
      "Currently early access with invite waitlist rolling out continuously.",
  },
  {
    id: "vercel-ai-gateway",
    name: "Vercel AI Gateway",
    category: "gateway_aggregator",
    categoryLabel: "Managed Cloud Gateway",
    authRequirement: "Vercel AI Gateway Key (model: typesafe-ai/jev)",
    pricingTerms:
      "Free until Sep 25; standard Vercel token billing applies afterward",
    bestFor:
      "Next.js & Edge applications deployed on Vercel wanting unified observability and edge caching.",
    consoleUrl: "https://vercel.com/ai-gateway/models/jev",
    verifiedDate: "2026-09-24",
    notes:
      "Promotional zero-cost trial closes September 25; ideal for immediate zero-friction evaluation.",
  },
  {
    id: "lovable-ai-gateway",
    name: "Lovable AI Gateway",
    category: "gateway_aggregator",
    categoryLabel: "Managed Cloud Gateway",
    authRequirement: "Lovable Platform Gateway Token",
    pricingTerms:
      "Free until Sep 27, 23:59 UTC; standard platform tier thereafter",
    bestFor:
      "Rapid prototyping and teams already building within Lovable visual harnesses.",
    consoleUrl: "https://lovable.dev",
    verifiedDate: "2026-09-24",
    notes:
      "Free window active until Sep 27, 23:59 UTC. Best for quick no-config trial runs.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    category: "gateway_aggregator",
    categoryLabel: "Unified Router",
    authRequirement:
      "OpenRouter API Key (model: typesafe/jev-latest or typesafe/jev-1.13)",
    pricingTerms:
      "Per-request gateway pricing (~$0.042/M input, 32K context window)",
    bestFor:
      "Multi-model A/B evaluation, automated benchmarking vs GPT/Claude judges, and centralized key management.",
    consoleUrl: "https://openrouter.ai/models?q=typesafe",
    verifiedDate: "2026-09-24",
    notes:
      "Check real-time rates at openrouter.ai/models as proxy pricing may adjust.",
  },
  {
    id: "requesty",
    name: "Requesty",
    category: "gateway_aggregator",
    categoryLabel: "Unified Router",
    authRequirement: "Requesty Gateway Key",
    pricingTerms:
      "Pass-through list price ($0.042/1M input) + analytics overhead",
    bestFor:
      "Enterprise logging, circuit breakers, fallback cascades to LLMs, and team usage tracking.",
    consoleUrl: "https://app.requesty.ai",
    verifiedDate: "2026-09-24",
    notes:
      "Ideal for teams requiring enterprise compliance and audit trails for automated decisions.",
  },
  {
    id: "litellm-proxy",
    name: "LiteLLM Proxy",
    category: "framework_orchestration",
    categoryLabel: "Self-Hosted Orchestration",
    authRequirement: "Own TypeSafe API Key (passed through self-hosted proxy)",
    pricingTerms:
      "Open-source software; pay only your direct TypeSafe upstream usage",
    bestFor:
      "Self-hosted infrastructure where internal microservices consume a unified OpenAI-compatible endpoint.",
    consoleUrl: "https://docs.litellm.ai",
    verifiedDate: "2026-09-24",
    notes:
      "Requires running a LiteLLM container with TYPESAFE_API_KEY injected in environment.",
  },
  {
    id: "pydantic-ai",
    name: "Pydantic AI",
    category: "framework_orchestration",
    categoryLabel: "Type-Safe Framework",
    authRequirement: "Own TypeSafe API Key (via TypeSafeModel provider)",
    pricingTerms:
      "Open-source library; calls TypeSafe API directly at list price",
    bestFor:
      "Python engineers wanting declarative question models, schema validation, and IDE auto-completion.",
    consoleUrl: "https://pydantic.dev/docs/ai/models/typesafe/",
    verifiedDate: "2026-09-24",
    notes:
      "Pairs Jev's discrete output space with Python's typing system for compile-time safety.",
  },
];

export const productionRecipes: ProductionRecipe[] = [
  {
    id: "support-ticket-triage",
    title: "Support Ticket 3-Way Triage (Dual Noul with Ambiguity Gate)",
    primitivesUsed: "Noul × 2 (Human Escalation & Repeat Contact)",
    scenario:
      "Enterprise customer support routing: Automatically separate urgent human escalation requests from automated bot-solvable queries, while flagging ambiguous borderline queries for tier-1 human review.",
    whyJevOverLlm:
      "Traditional LLMs take 2–4 seconds and frequently hallucinate department categories. Jev evaluates both boolean conditions in parallel (~100ms) with mathematically calibrated probability thresholds, costing $0.00004 per ticket.",
    codeLanguage: "python",
    status: "verified_schema",
    code: `import os
from typesafe_sdk import TypeSafeClient, Noul, NoulCriteria

# Define discrete evaluation criteria with explicit boundary definitions
SUPPORT_QUESTIONS = {
    "is_human_escalation": Noul(
        instructions="Is the customer explicitly demanding or requesting to speak with a human agent or supervisor?",
        criteria=NoulCriteria(
            true="Customer mentions speaking to a human, agent, person, manager, or representative",
            false="Customer asks general technical or billing questions without demanding human takeover",
        ),
    ),
    "is_repeat_contact": Noul(
        instructions="Has the customer indicated they previously reached out about this unresolved problem?",
        criteria=NoulCriteria(
            true="Explicitly mentions prior tickets, multiple attempts, or prolonged waiting on an ongoing issue",
            false="First-time inquiry or no indication of past interactions",
        ),
    ),
}

# Calibrated decision thresholds
CONFIDENCE_HIGH = 0.80
CONFIDENCE_LOW = 0.20

def route_support_ticket(message: str) -> dict:
    """Evaluates ticket state and dispatches deterministic routing instructions."""
    api_key = os.environ.get("TYPESAFE_API_KEY")
    with TypeSafeClient(api_key=api_key) as client:
        result = client.system_one(
            model="jev-latest",
            state=message,
            questions=SUPPORT_QUESTIONS
        )

    wants_human = result.answers["is_human_escalation"].noul
    is_repeat = result.answers["is_repeat_contact"].noul

    # Ambiguity Gate: If probability is uncertain (between 0.20 and 0.80), route to triage queue
    if CONFIDENCE_LOW < wants_human < CONFIDENCE_HIGH or CONFIDENCE_LOW < is_repeat < CONFIDENCE_HIGH:
        return {
            "route": "manual_triage_review",
            "reason": "Calibrated score falls in uncertainty band",
            "scores": {"wants_human": wants_human, "is_repeat": is_repeat}
        }

    priority = "p0_urgent" if is_repeat >= CONFIDENCE_HIGH else "p2_normal"
    target = "senior_human_queue" if wants_human >= CONFIDENCE_HIGH else "ai_automated_responder"

    return {
        "route": target,
        "priority": priority,
        "scores": {"wants_human": wants_human, "is_repeat": is_repeat}
    }`,
    sampleInput:
      '"I have messaged your team three times since Tuesday and my invoice is still wrong. Can someone please actually look at this?"',
    sampleOutput:
      '{"route": "senior_human_queue", "priority": "p0_urgent", "scores": {"wants_human": 0.99, "is_repeat": 0.96}}',
    thresholdTuning:
      "Raise CONFIDENCE_HIGH to 0.90 if human agent capacity is severely constrained. Lower CONFIDENCE_HIGH to 0.70 for VIP customer tiers where false negatives (missing an angry customer) are expensive.",
    limitations:
      "Jev does not synthesize the email reply itself. Use Jev strictly to route the workflow, then invoke GPT/Claude to draft the response if routed to the AI bot.",
  },
  {
    id: "rag-chunk-filtering",
    title: "High-Throughput RAG Chunk Filter (Speculative Chunk Pruning)",
    primitivesUsed: "Noul per retrieved passage (Parallel Batch Evaluation)",
    scenario:
      "Vector search returns Top-20 retrieved document chunks, but typically only 3–5 contain direct answers. Evaluate all 20 chunks in a single Jev batch call to drop irrelevant context before passing to expensive frontier models.",
    whyJevOverLlm:
      "Feeding 20 noisy chunks to GPT-4o burns ~8,000 input tokens and degrades answer quality (Needle-in-a-Haystack problem). Jev filters all chunks in 100ms for $0.0003, reducing downstream frontier token costs by 75%.",
    codeLanguage: "python",
    status: "verified_schema",
    code: `import os
from typing import List, Dict
from typesafe_sdk import TypeSafeClient, Noul

def filter_retrieved_chunks(user_query: str, retrieved_chunks: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Evaluates relevance of multiple retrieved passages in parallel."""
    # Build batch evaluation schema dynamically for each candidate chunk
    chunk_questions = {}
    for i, chunk in enumerate(retrieved_chunks):
        chunk_questions[f"chunk_{i}"] = Noul(
            instructions={
                "task": "Does this text passage contain specific, factual information necessary to answer the user query?",
                "query": user_query,
                "passage_excerpt": chunk["content"][:600],
            }
        )

    with TypeSafeClient(api_key=os.environ.get("TYPESAFE_API_KEY")) as client:
        # All candidate questions execute concurrently across parallel sampler heads
        response = client.system_one(
            model="jev-latest",
            state=f"Target Query: {user_query}",
            questions=chunk_questions
        )

    # Filter with conservative threshold (keep passage if probability > 0.35 to avoid false exclusions)
    filtered = []
    for i, chunk in enumerate(retrieved_chunks):
        ans = response.answers.get(f"chunk_{i}")
        if ans and ans.noul >= 0.35:
            filtered.append({**chunk, "relevance_prob": ans.noul})

    # Sort surviving passages by calibrated relevance score
    return sorted(filtered, key=lambda c: c["relevance_prob"], reverse=True)`,
    sampleInput:
      'Query: "What is the refund period for annual subscriptions?" with 15 candidate documentation chunks.',
    sampleOutput:
      "Kept 4 relevant chunks (probs: 0.94, 0.88, 0.72, 0.45), filtered out 11 noisy generic marketing paragraphs.",
    thresholdTuning:
      "Keep threshold between 0.30–0.40. In RAG pipelines, recall is prioritized over precision because downstream LLMs can ignore slight excess context, but cannot recover omitted facts.",
    limitations:
      "Do not use for questions requiring cross-document synthesis or arithmetic inference across multiple disparate chunks.",
  },
  {
    id: "multi-axis-severity-scoring",
    title: "Multi-Axis Defect & Escalation Scoring (Weighted Score Primitive)",
    primitivesUsed: "Score × 3 (Severity, Customer Frustration, Repro Quality)",
    scenario:
      "Automated bug reporting and developer ticket prioritization. Quantify impact across engineering severity, customer sentiment, and diagnostic quality using structured ordinal levels.",
    whyJevOverLlm:
      "Standard LLMs return arbitrary text labels (e.g. 'high', 'critical') with uncalibrated confidence. Jev's Score primitive outputs expected value means over descriptive situation arrays, enabling mathematical weighted scoring.",
    codeLanguage: "python",
    status: "verified_schema",
    code: `import os
from typesafe_sdk import TypeSafeClient, Score

BUG_EVALUATION_QUESTIONS = {
    "severity": Score(
        instructions="How severe is the technical defect described in the ticket?",
        criteria=[
            "Cosmetic issue; styling, typo, or minor misalignment without functional impairment",
            "Degraded performance or broken non-critical feature; clear workaround exists",
            "Blocking defect or data loss risk; core workflow impeded with no workaround",
        ],
    ),
    "frustration": Score(
        instructions="What is the emotional frustration level of the reporting customer?",
        criteria=[
            "Neutral, factual bug report with constructive diagnostic tone",
            "Annoyed or hindered, expressively seeking a prompt fix",
            "Extremely angry, mentioning account cancellation, legal escalation, or lost revenue",
        ],
    ),
    "report_quality": Score(
        instructions="How actionable is the bug report for an engineering reproduction?",
        criteria=[
            "Vague, no logs, steps, or environment provided",
            "Mentions error message or feature name, but missing reproduction steps",
            "Includes specific steps to reproduce and system environment details",
        ],
    ),
}

def calculate_ticket_priority(ticket_text: str) -> dict:
    with TypeSafeClient(api_key=os.environ.get("TYPESAFE_API_KEY")) as client:
        answers = client.system_one(
            model="jev-latest",
            state=ticket_text,
            questions=BUG_EVALUATION_QUESTIONS
        ).answers

    sev_score = answers["severity"].score          # [0.0 - 2.0]
    frust_score = answers["frustration"].score     # [0.0 - 2.0]
    quality_score = answers["report_quality"].score # [0.0 - 2.0]

    # Weighted calculation: 50% severity, 30% customer impact, 20% actionable clarity
    composite_index = (
        (sev_score / 2.0) * 0.50 +
        (frust_score / 2.0) * 0.30 +
        (quality_score / 2.0) * 0.20
    ) * 100.0

    return {
        "composite_priority": round(composite_index, 1),
        "tier": "Tier-1 Critical" if composite_index >= 70 else "Tier-2 Standard",
        "breakdown": {
            "severity": sev_score,
            "frustration": frust_score,
            "quality": quality_score
        }
    }`,
    sampleInput:
      '"Production checkout button returns 500 error on mobile Safari. We are losing transactions right now. Logs: POST /api/pay status 500."',
    sampleOutput:
      '{"composite_priority": 85.0, "tier": "Tier-1 Critical", "breakdown": {"severity": 1.95, "frustration": 1.45, "quality": 1.80}}',
    thresholdTuning:
      "Always inspect both the score and confidence. Low confidence indicates ambiguous state or conflicting information in the issue description.",
    limitations:
      "Criteria levels must be described scenarios, never numerical strings like ['0', '1', '2'] which convey no semantic meaning to the model.",
  },
  {
    id: "action-safety-guard",
    title: "AI Agent Irreversible Action Gate (Safety Guardrail)",
    primitivesUsed:
      "Noul (Irreversible Action Verification with Safe Failure Path)",
    scenario:
      "Autonomous agents operating browser or terminal tools: Verify whether a planned tool invocation causes irreversible external changes (payments, file deletion, email broadcast) before execution.",
    whyJevOverLlm:
      "Frontier LLM guardrails are prone to prompt injection and jailbreaks. Jev is mathematically constrained to binary decision projection without text generation, preventing prompt escape vulnerabilities.",
    codeLanguage: "python",
    status: "verified_schema",
    code: `import os
from typesafe_sdk import TypeSafeClient, Noul, NoulCriteria

ACTION_SAFETY_CHECK = {
    "is_hazardous_action": Noul(
        instructions="Would executing this planned tool call cause irreversible mutations, monetary loss, or data destruction?",
        criteria=NoulCriteria(
            true="Executes financial charge, deletes production files/databases, sends outward public communication, or modifies credential stores",
            false="Read-only query, local safe computation, formatting, or fully idempotent reversible update",
        ),
    )
}

def verify_agent_action(tool_call_payload: str) -> str:
    """Verifies whether an agent action can auto-execute or requires human-in-the-loop authorization."""
    with TypeSafeClient(api_key=os.environ.get("TYPESAFE_API_KEY")) as client:
        res = client.system_one(
            model="jev-latest",
            state=tool_call_payload,
            questions=ACTION_SAFETY_CHECK
        )

    risk_prob = res.answers["is_hazardous_action"].noul

    if risk_prob > 0.75:
        return "BLOCK_REQUIRE_HUMAN_CONFIRMATION"
    elif risk_prob < 0.25:
        return "ALLOW_EXECUTE_AUTOMATICALLY"
    else:
        # Ambiguous boundary: Fail closed to guarantee safety
        return "QUARANTINE_FOR_SAFETY_AUDIT"`,
    sampleInput:
      'tool: "stripe_charge_customer", payload: {"customer_id": "cus_9941", "amount_cents": 45000, "currency": "usd"}',
    sampleOutput:
      '"BLOCK_REQUIRE_HUMAN_CONFIRMATION" (calibrated probability: 0.98)',
    thresholdTuning:
      "In safety-critical workflows, set upper threshold to 0.60 to bias toward human authorization whenever in doubt.",
    limitations:
      "Jev operates on text state payloads. It cannot inspect visual screenshot state directly.",
  },
];

export const primitivesQuickRef = [
  {
    name: "Noul",
    type: "Boolean Calibrated Probability",
    signature:
      'Noul(instructions="...", criteria=NoulCriteria(true="...", false="..."))',
    returnValue: "ans.noul ∈ [0.0, 1.0]",
    criticalGotcha:
      "The float return value IS both the decision and the statistical certainty. There is no separate confidence field because calibrated probability inherently measures likelihood.",
  },
  {
    name: "Choice",
    type: "Categorical 1-of-N Label",
    signature:
      'Choice(instructions="...", criteria=["Option A", "Option B", ...])',
    returnValue:
      "{ choice: string, probabilities: Record<string, number>, confidence: number }",
    criticalGotcha:
      "Supports up to 255 discrete mutually-exclusive categories. Categories must be distinct with non-overlapping semantic boundaries.",
  },
  {
    name: "Score",
    type: "Continuous / Ordinal Calibration",
    signature:
      'Score(instructions="...", criteria=["Level 0 scenario", "Level 1 scenario", "Level 2 scenario"])',
    returnValue:
      "{ score: number, probabilities: number[], confidence: number }",
    criticalGotcha:
      "The score is the probability-weighted expected mean over ordinal levels. Always describe situational states rather than abstract numbers like ['0', '1', '2'].",
  },
];

export const howToUseJevFaqs = [
  {
    question: "Is TypeSafe Jev free to try, and how do I get started?",
    answer:
      "TypeSafe provides $5 in free credits for new verified accounts at console.typesafe.ai. Additionally, managed cloud providers like Vercel AI Gateway and Lovable offer early promotional access. For self-hosted and multi-model workflows, OpenRouter provides per-token routing without minimum commitments.",
  },
  {
    question: "What is the exact endpoint for TypeSafe Jev API calls?",
    answer:
      "The direct TypeSafe API endpoint is POST https://api.typesafe.ai/v1/systemone. The request schema requires top-level keys: state (unstructured input string), model (e.g. 'jev-latest' or 'jev-1.13.0'), and questions (a dictionary of typed Noul, Choice, or Score definitions).",
  },
  {
    question:
      "How does Jev differ from structured JSON outputs in GPT-4o or Claude 3.5?",
    answer:
      "GPT and Claude are autoregressive language models that generate text token-by-token over 1–4 seconds, which can suffer from latency variance, schema syntax errors, and hallucinated keys. Jev is a non-autoregressive System One model that projects state directly into discrete typed schemas in 70–500ms at $0.042/1M input tokens with free output tokens.",
  },
  {
    question: "Can I use Jev with LangChain, LlamaIndex, or Pydantic AI?",
    answer:
      "Yes. Official integration recipes exist for LangChain (custom decision harness), Pydantic AI (TypeSafeModel provider), and LiteLLM proxy pass-through. Jev acts as high-speed routing middleware before calling heavier LLMs in your pipeline.",
  },
  {
    question: "What are the hard technical limitations of Jev?",
    answer:
      "Jev has a 64k token context window (state + all questions combined) and a 32k limit on individual states. It is strictly text-based (no audio or vision multimodal support) and possesses no open-ended world knowledge synthesis; it evaluates statements strictly against the provided state.",
  },
  {
    question:
      "Where can I read the in-depth architectural and mathematical theory?",
    answer:
      "For a deep dive into RLCD training, speculative fan-out sampling, and Kahneman System One cognitive architecture, read our companion analysis at findryai.com/typesafe-jev.",
  },
];
