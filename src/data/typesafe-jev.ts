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
    "TypeSafe Jev 是由 OpenAI RLHF 联合发明人 Diogo Almeida 创立的 TypeSafe AI 推出的首个「系统一（System One）」前沿模型。专为程序决策设计，放弃自然语言生成，以 70-500ms 超低延迟输出强类型概率决策，输入仅 $0.042/1M Tokens，输出完全免费且绝不幻觉。",
  heroSubtitle:
    "专为自动化与软件架构打造的全新 AI 范式：无须等待逐字 Autoregressive 生成，输入任意非结构化状态，毫秒级并行输出具备严格数学置信度的 Typed Probabilistic Decisions。",
};

export const heroStats: { value: string; label: string; sublabel?: string }[] =
  [
    {
      value: "70–500ms",
      label: "端到端决策延迟",
      sublabel: "比生成式 LLM 快 40x–200x",
    },
    {
      value: "$0.042",
      label: "每百万输入 Tokens",
      sublabel: "单次决策约 $0.00004",
    },
    {
      value: "$0.00",
      label: "输出 Tokens 费用",
      sublabel: "并行采样，输出太便宜无需计费",
    },
    {
      value: "0 幻觉",
      label: "严格类型安全保证",
      sublabel: "不生成自由字符串，零类型错误",
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
    name: "Noul（布尔概率决策）",
    nameEn: "Noul (Boolean Probability)",
    typeDesc: "返回命题成立的校准概率 p(yes) ∈ [0, 1]",
    outputShape: "{ noul: boolean, probability: number, confidence: number }",
    description:
      "用于判断一个陈述是否为真（Yes/No）。经 RLCD 训练校准，概率具备真实数学统计意义，可根据设定的置信度阈值（如 0.85）进行安全阻断或放行。",
    exampleCode: `is_urgent: noul("Does the user request convey time-sensitive urgency?")`,
  },
  {
    icon: Filter,
    name: "Choice（分类与单选决策）",
    nameEn: "Choice (Categorical 1-of-N)",
    typeDesc: "从预定义的候选集合中选择最佳项（支持至 255 项）",
    outputShape:
      "{ choice: string, probabilities: Record<string, number>, confidence: number }",
    description:
      "单请求中并行评估所有选项概率分布。每个选项可附加语义判断准则（Criteria），输出不仅包含胜出标签，还附带各选项精确概率与整体判定置信度。",
    exampleCode: `department: choice("Which team should handle this?", {
  billing: "Payment, refunds, invoices",
  technical: "Bugs, outages, API errors",
  sales: "Pricing, upgrades, contracts"
})`,
  },
  {
    icon: Scale,
    name: "Score（序数与标量评估）",
    nameEn: "Score (Ordinal Level Rating)",
    typeDesc: "在有序分级体系中评分（2–10 阶分级或连续分数）",
    outputShape:
      "{ score: number, distribution: number[], confidence: number }",
    description:
      "用于风险评级、情绪分析、证据强度、内容质量等有序量化评估。不仅给出加权期望分数，还输出跨等级的完整离散概率分布与评估确信度。",
    exampleCode: `risk_level: score("Assess account risk level", [
  "Low: Normal consistent behavior",
  "Moderate: Unusual login location",
  "High: Password reset + multiple failed logins"
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
    title: "RLCD：校准决策强化学习",
    badge: "Reinforcement Learning for Calibrated Decisions",
    description:
      "不同于传统 RLHF 迎合人类偏好或生成连贯长文，RLCD 专门优化模型输出概率与真实世界结果的严格一致性。Jev 报告的 90% 置信度，在统计学上意味着千次调用中约 900 次真实准确，使程序可信赖置信门控。",
  },
  {
    icon: Zap,
    title: "非自回归并行采样架构",
    badge: "Non-Autoregressive Parallel Sampler",
    description:
      "传统 LLM 依赖逐字（Token-by-Token）顺序解码，一个 JSON 输出耗时 2-5 秒。Jev 彻底舍弃字符串生成，在单次前向传播中并行计算所有问题的概率分布，耗时仅 70ms-500ms。",
  },
  {
    icon: ShieldCheck,
    title: "放弃字符串生成的类型安全",
    badge: "Zero Hallucination & Zero Type Errors",
    description:
      "AI 幻觉与自由文本生成紧密相连。Jev 的输出空间在调用前由代码结构严格定义，模型只能在预定离散空间内投影概率，从根源上杜绝了畸形 JSON、多余字段、类型不匹配与工具参数胡编乱造。",
  },
  {
    icon: Layers,
    title: "投机性扇出（Speculative Fan-out）",
    badge: "Parallel Evaluation of Hundreds of Questions",
    description:
      "在单次请求中针对同一上下文传入 10 个甚至 100 个问题，耗时与 1 个问题几乎完全相同，且只需支付一次上下文 Token 费用。这彻底改变了传统链式问答的架构设计。",
  },
];

export const comparisonTable: {
  feature: string;
  traditionalLlm: string;
  typesafeJev: string;
  whyItMatters: string;
}[] = [
  {
    feature: "思考范式",
    traditionalLlm: "System 2（慢思考、长文本推理、对话）",
    typesafeJev: "System 1（快思考、直觉分类、结构化判定）",
    whyItMatters:
      "软件中 90% 的业务判断只需要 System 1，租用昂贵慢速的 System 2 是巨大的算力浪费",
  },
  {
    feature: "端到端延迟",
    traditionalLlm: "1,500ms – 6,000ms（受输出 Token 数拖累）",
    typesafeJev: "70ms – 500ms（典型 ~100ms，并行采样）",
    whyItMatters: "支持嵌入 API 网关、实时路由、交互式 UI 与毫秒级流水线",
  },
  {
    feature: "每百万输入费用",
    traditionalLlm: "$2.50 – $30.00 / 1M Tokens",
    typesafeJev: "$0.042 / 1M Tokens（降幅高达 60x–700x）",
    whyItMatters: "单次决策成本从数美分降至 $0.00004，真正实现高频自动化",
  },
  {
    feature: "输出 Token 计费",
    traditionalLlm: "$10.00 – $60.00 / 1M Tokens",
    typesafeJev: "$0.00（输出太便宜，官方不计费）",
    whyItMatters: "并发提问 50 个维度无需承担翻倍的输出 Token 膨胀",
  },
  {
    feature: "类型安全与幻觉",
    traditionalLlm: "概率性 JSON 格式损坏、非法字段、幻觉",
    typesafeJev: "严格类型约束，无字符串生成，0% 类型错误",
    whyItMatters: "可直接作为生产级 if-else 条件判断，无需重试与清洗包裹层",
  },
  {
    feature: "置信度可用性",
    traditionalLlm: "Logprobs 难以跨模型校准，多表现为过度自信",
    typesafeJev: "RLCD 深度校准的绝对置信度与概率分布",
    whyItMatters: "可直接设定 threshold = 0.85 构建可靠的自动化置信门控",
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
    title: "Speculative Fan-out（投机性并行扇出）",
    tagline: "一次传输上下文，并行回答所有潜在业务判定",
    scenario:
      "在工单受理或内容审核中，传统做法是按顺序调 5 次 LLM 分别判断紧急度、分类、情绪、违规项与合规性，耗时超 10 秒。",
    solution:
      "在 Jev 的单次请求中同时挂载 15+ 个 Noul/Choice/Score 问题，共享一份 50KB 文档，100ms 内一次性返回所有判定，成本仅 0.0004 美元。",
  },
  {
    icon: Network,
    number: "02",
    title: "Confidence-Gated Cascades（置信度分流瀑布）",
    tagline: "95% 确定性常规流程走 Jev，5% 模糊疑难交予 GPT/Claude",
    scenario:
      "高价值业务（如退款审批、欺诈检测）如果全量调用 GPT-5.6 或 Opus 5 成本极高且延迟大；如果全量自动化又有误判风险。",
    solution:
      "前置 Jev 做出判定：若 confidence >= 0.85，直接走程序自动化；若 confidence < 0.85，才回退（Fallback）激活重型 LLM 深度分析，综合节省 90% 成本。",
  },
  {
    icon: ShieldAlert,
    number: "03",
    title: "Agent AutoMode & Guardrails（智能体危险操作拦截门禁）",
    tagline: "在工具执行前注入毫秒级安全审计拦截器",
    scenario:
      "Coding Agent / Browser Agent 自主执行 rm -rf、数据库修改、扣款或发信等破坏性 Action 时容易失控脱轨。",
    solution:
      "LangChain / Claude Harness 的 AutoModeMiddleware 在执行工具前，由 Jev 毫秒级评估工具调用的风险等级与上下文匹配度，高危动作阻断并申请人工确认。",
  },
  {
    icon: Filter,
    number: "04",
    title: "Retrieve-Then-Judge in RAG（检索后精准过滤裁决）",
    tagline: "重型 LLM 上下文瘦身神器，低成本过滤相关性",
    scenario:
      "向量检索召回了 20 个文档块（Passages），若全部塞入 LLM 上下文，会导致数百毫秒 Token 消耗与 Context 污染。",
    solution:
      "用 Jev 对召回的 20 个 Passage 并行执行 Noul('Does this passage provide direct factual evidence for the query?')，仅将高置信度片段送入生成层。",
  },
  {
    icon: Activity,
    number: "05",
    title: "Composite Rubric Evaluation（多维复合量规打分）",
    tagline: "自动化合规审计、PR 代码审查、简历初筛与 SLA 监控",
    scenario:
      "需要对成千上万份客户对话、代码提交或销售录音进行多维度合规审计打分。",
    solution:
      "通过 Jev 设立 5-10 个 Score 维度（如礼貌度、解决效率、隐私合规、政策遵循），批量运行并行评分，生成细粒度雷达数据报告。",
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
    title: "TypeScript / Node.js 官方 SDK",
    language: "typescript",
    framework: "@typesafe-ai/sdk",
    code: `import { TypeSafeClient, choice, noul, score } from "@typesafe-ai/sdk";

const client = new TypeSafeClient({
  apiKey: process.env.TYPESAFE_API_KEY, // 或默认读取 env
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
    title: "Python 函数装饰器 @jev.fn",
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

# 像调用普通 Python 函数一样执行：
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
    title: "Pydantic AI 集成 (TypeSafeModel)",
    language: "python",
    framework: "pydantic-ai",
    code: `from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.typesafe import TypeSafeModel

class SecurityAudit(BaseModel):
    is_malicious: bool = Field(description="Is this shell command potentially dangerous?")
    risk_category: str = Field(description="Category of danger: file_deletion, credential_leak, safe")
    confidence_margin: float = Field(description="Internal model margin")

# 使用 Jev 作为高速分类决策代理
jev_model = TypeSafeModel("jev-latest")
guard_agent = Agent(jev_model, output_type=SecurityAudit)

result = guard_agent.run_sync("rm -rf /var/log/nginx/*")
print(result.data.is_malicious)  # True`,
  },
  {
    id: "langchain-middleware",
    title: "LangChain 模型路由与安全拦截中间件",
    language: "python",
    framework: "langchain-typesafe",
    code: `from langchain_typesafe import TypeSafeClassifier, ModelRouterMiddleware, ModelChoice
from langchain.agents import create_agent

# 1. 智能模型路由：简单任务用轻量模型，疑难任务才唤醒 GPT-5 / Opus
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

// 依托 Vercel AI Gateway，直接使用 typesafe-ai/jev
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
    title: "Cloudflare Workers AI 原生调用",
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
    name: "智能客户工单受理与定级",
    badge: "实时客服分流",
    state: {
      subject: "Urgent: Stripe webhook failing with 500 errors on checkout",
      customer_tier: "Enterprise ($20k/yr)",
      message:
        "All our customer payments are stuck in pending since 20 minutes ago. We are losing transactions right now. Need someone from integrations on call ASAP.",
    },
    questions: [
      {
        id: "urgency",
        label: "紧急度评估 (Noul)",
        type: "noul",
        result: true,
        probability: 0.985,
        confidence: 0.99,
        details: "明确提到正在损失交易且要求立即接入",
      },
      {
        id: "department",
        label: "归属部门分流 (Choice)",
        type: "choice",
        result: "technical_integrations",
        confidence: 0.96,
        details: "Webhook 500 报错与支付结账接口异常，直派技术集成组",
      },
      {
        id: "escalation_score",
        label: "升级必要性评级 (Score: 1-5)",
        type: "score",
        result: 5,
        confidence: 0.94,
        details: "企业级高客单客户 + 生产核心支付受阻，触发 P0 级告警",
      },
    ],
  },
  {
    id: "refund-review",
    name: "自动退款合规性与策略审计",
    badge: "电商与财务风控",
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
        label: "是否判定为重复扣款 (Noul)",
        type: "noul",
        result: true,
        probability: 0.994,
        confidence: 0.99,
        details: "相同金额且时间差仅 2 秒，完全吻合重复扣款特征",
      },
      {
        id: "policy_match",
        label: "退款政策匹配性 (Noul)",
        type: "noul",
        result: true,
        probability: 0.978,
        confidence: 0.98,
        details: "符合 10 秒内重复扣款无条件即时退款政策",
      },
      {
        id: "recommended_action",
        label: "决策建议 (Choice)",
        type: "choice",
        result: "auto_refund_second_charge",
        confidence: 0.98,
        details: "置信度 > 0.95，直接下发 Stripe Refund API，无需人工审核",
      },
    ],
  },
  {
    id: "agent-safety",
    name: "AI Agent 工具调用安全门禁",
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
        label: "高危不可逆操作拦截 (Noul)",
        type: "noul",
        result: true,
        probability: 0.999,
        confidence: 0.999,
        details: "DROP DATABASE 属于破坏性高危不可逆指令",
      },
      {
        id: "policy_action",
        label: "拦截策略动作 (Choice)",
        type: "choice",
        result: "block_and_require_human_approval",
        confidence: 0.99,
        details: "阻断自动执行，向 Slack 发送审批弹窗请求管理员确认",
      },
    ],
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "什么是 TypeSafe Jev？它与 ChatGPT / Claude 有何本质区别？",
    answer:
      "TypeSafe Jev 是由 OpenAI RLHF 联合发明人 Diogo Almeida 创立的 TypeSafe AI 推出的首个「系统一（System One）」前沿模型。传统 LLM（如 GPT-5、Claude 3.5）属于 System 2 模型，专为生成自然语言对话、代码长文而设计，通过逐字自回归计算，耗时数秒且存在幻觉与类型错误。而 Jev 彻底放弃生成自然语言字符串，专注于为软件提供强类型的离散概率决策（布尔值、分类、分级评分），单次推理仅需 70-500ms（比 LLM 快 40-200 倍），且输出 100% 具备类型安全、零幻觉。",
  },
  {
    question: "为什么说 Jev「绝不产生幻觉（Cannot Hallucinate）」？",
    answer:
      "AI 的幻觉通常源于自回归生成长文本时的自由漂移。Jev 不生成自由文本，其输出空间在调用前由开发者预设的 Schema（如预定义的枚举、分级或布尔准则）严格限定。Jev 的底层计算是对非结构化输入状态在离散决策空间上的概率密度投影，模型无法创造预设类型以外的任何内容，因此从数学和架构上消除了生成幻觉和非法类型格式。",
  },
  {
    question: "Jev 的名字来源与背景是什么？",
    answer:
      "Jev 命名致敬 19 世纪英国经济学家威廉·斯坦利·杰文斯（William Stanley Jevons），即著名的「杰文斯悖论（Jevons Paradox）」。在蒸汽机效率提升后，煤炭消耗不仅没有减少反而因各行各业的普及而呈指数级爆发。TypeSafe 坚信，当机器智能决策的成本与延迟下降两个数量级（从数美分/数秒降至微美分/毫秒）时，自动化智能决策的需求将被放大数千倍。",
  },
  {
    question: "什么是 RLCD（校准决策强化学习）？",
    answer:
      "RLCD（Reinforcement Learning for Calibrated Decisions）是 TypeSafe AI 自研的全新模型训练方法。传统 RLHF 关注文本的主观偏好和连贯性，而 RLCD 专门训练模型对决策结果给出精确校准的概率（Calibrated Probabilities）。这意味着模型给出的 0.85 概率具有真实的统计学意义，开发者可以直接根据置信度分数设定自动化业务门禁（如高于 0.90 自动放行，低于 0.90 降级人工或唤醒大模型）。",
  },
  {
    question: "什么是投机性扇出（Speculative Fan-out）？",
    answer:
      "因为 Jev 采用非自回归的并行采样架构，在同一批上下文（State）下，同时挂载 1 个问题和挂载 50 个问题的执行耗时几乎完全相同（均在 100ms 左右），且只需支付一次上下文 Token 费用。开发者可以在一次网络请求中将所有潜在的业务检查（违规检测、情绪评分、分类归属、意图识别）全部并行提问，彻底摆脱传统串行调用的延迟瓶颈。",
  },
  {
    question: "如何获取 TypeSafe Jev 的访问权限与 API Key？",
    answer:
      "主要有三种接入渠道：(1) 官方早鸟通道：访问 typesafe.ai 申请 Waitlist，审核通过后在 console.typesafe.ai 获取 API Key；(2) Vercel AI Gateway：直接通过模型标识 `typesafe-ai/jev` 与 Vercel AI SDK 7 的 `experimental_evaluate` 接口调用；(3) Cloudflare Workers AI：通过 `env.AI.run('typesafe/jev', ...)` 边缘计算即开即用。",
  },
  {
    question: "Jev 会取代 GPT-5 或 Claude 等重型前沿模型吗？",
    answer:
      "不会，它们是极其完美的互补关系（即「级联瀑布架构（Cascades）」）。在现代 Agent 和企业级系统中，90% 以上的决策（如工单分类、路由、意图分支、Passage 粗筛、安全审计）是常规高频的 System 1 任务，交给 Jev 以 100ms 和 $0.042/1M 代价处理；而剩下的 10% 开放式生成、复杂代码重构与哲学推理，才分流给 GPT 或 Claude，从而在保障系统高智能的同时降低 90% 以上的整体运营开销。",
  },
  {
    question: "Jev 支持哪些编程语言与开发框架？",
    answer:
      "Jev 拥有极其繁荣的生态支持：官方提供 TypeScript / Node.js SDK (`@typesafe-ai/sdk`)、Python 装饰器库 (`jev`，通过 `@jev.fn` 将函数签名直接编译为 Jev 查询)、Pydantic AI 官方驱动 (`TypeSafeModel`)、LangChain 官方扩展 (`langchain-typesafe`)、Vercel AI SDK 以及 Cloudflare Workers AI。",
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
    title: "TypeSafe 官方 API",
    badge: "Direct API",
    requirement: "Waitlist 申请或早期邀请 Key",
    steps: [
      "访问 console.typesafe.ai/settings/keys 创建 API Key",
      '配置环境变量 export TYPESAFE_API_KEY="sk-..."',
      "安装官方 SDK：npm i @typesafe-ai/sdk 或 pip install jev",
    ],
  },
  {
    icon: Zap,
    title: "Vercel AI Gateway",
    badge: "AI SDK 7+",
    requirement: "Vercel 账号与 Gateway 密钥",
    steps: [
      "升级 Vercel AI SDK 至 7.0.105+",
      "使用 model ID: typesafe-ai/jev",
      "通过 experimental_evaluate 函数进行标准化结构化求值",
    ],
  },
  {
    icon: Cpu,
    title: "Cloudflare Workers AI",
    badge: "Edge Native",
    requirement: "Cloudflare 开发者账号",
    steps: [
      "在 Workers 代码中绑定 AI: env.AI.run('typesafe/jev', ...)",
      "全球 300+ 边缘数据中心毫秒级直连",
      "支持 TypeScript 与 Python Worker 环境",
    ],
  },
  {
    icon: Bot,
    title: "LangChain & Pydantic AI",
    badge: "Agent Frameworks",
    requirement: "Python 3.10+",
    steps: [
      "pip install langchain-typesafe pydantic-ai",
      "引入 TypeSafeClassifier 或 ModelRouterMiddleware",
      "一键为现有 Agent 接入 AutoMode 安全门禁与分流路由",
    ],
  },
];

export const sources: { label: string; description: string; url: string }[] = [
  {
    label: "TypeSafe AI — 官方发布日志",
    description: "Introducing System One Models and Jev (Diogo Almeida 亲笔)",
    url: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
  },
  {
    label: "Cloudflare 开发者文档 — Jev 模型卡片",
    description:
      "Cloudflare AI Docs: Jev (typesafe) structured evaluation model",
    url: "https://developers.cloudflare.com/ai/models/typesafe/jev/",
  },
  {
    label: "Vercel AI Gateway — 模型规范与定价",
    description: "Vercel AI Gateway: typesafe-ai/jev model specifications",
    url: "https://vercel.com/ai-gateway/models/jev",
  },
  {
    label: "LangChain 官方博客 — 构建 Jev Harness",
    description:
      "What Is Jev? A Guide to TypeSafe AI's System One Model with LangChain",
    url: "https://www.langchain.com/blog/building-a-harness-with-jev",
  },
  {
    label: "Pydantic AI 文档 — TypeSafe 集成指南",
    description: "Pydantic AI: Running TypeSafeModel with Jev",
    url: "https://pydantic.dev/docs/ai/models/typesafe/",
  },
  {
    label: "InfoWorld 深度报道",
    description: "TypeSafe AI’s new models work with machines, not humans",
    url: "https://www.infoworld.com/article/4223468/typesafe-ais-new-models-work-with-machines-not-humans.html",
  },
  {
    label: "DEV Community 实践指南",
    description:
      "How to Use Jev: A practical guide to TypeSafe's System One model",
    url: "https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e",
  },
];
