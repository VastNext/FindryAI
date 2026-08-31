export interface AgentSkill {
  name: string;
  link: string;
  shortDescriptions: string[];
}

export interface AgentSkillGroup {
  mainCategory: string;
  remixIcon: string;
  slug: string;
  items: AgentSkill[];
}

export const agentSkillGroups: AgentSkillGroup[] = [
  {
    mainCategory: "Agent Harness",
    remixIcon: "RiTerminalBoxLine",
    slug: "agent-harness",
    items: [
      {
        name: "Oh My Pi",
        link: "https://github.com/can1357/oh-my-pi/",
        shortDescriptions: ["深度集成IDE的终端编码Agent"],
      },
      {
        name: "Goose",
        link: "https://github.com/aaif-goose/goose/",
        shortDescriptions: ["本地运行的通用型AI Agent，兼容多模型与MCP"],
      },
      {
        name: "DeepSeek Harness",
        link: "https://github.com/deepseek-ai/deepseek-harness/",
        shortDescriptions: ["一切皆插件的开源Agent Harness"],
      },
      {
        name: "Reasonix",
        link: "https://github.com/esengine/deepseek-reasonix/",
        shortDescriptions: ["多端接入的AI编码Agent，兼容任意模型"],
      },
      {
        name: "OpenWork",
        link: "https://github.com/different-ai/openwork/",
        shortDescriptions: ["开源Claude Cowork替代品，跨工具团队共享AI工作流"],
      },
      {
        name: "Kiro Crew",
        link: "https://github.com/kirodotdev/kirocrew/",
        shortDescriptions: ["跨会话持久运行的自进化Agent工作空间"],
      },
      {
        name: "Odysseus",
        link: "https://github.com/pewdiepie-archdaemon/odysseus/",
        shortDescriptions: ["本地优先的一体化自托管AI Agent工作空间"],
      },
      {
        name: "Kimi Code CLI",
        link: "https://github.com/moonshotai/kimi-code/",
        shortDescriptions: ["单二进制启动的Kimi终端编码Agent"],
      },
      {
        name: "MiMo Code",
        link: "https://github.com/xiaomimimo/mimo-code/",
        shortDescriptions: ["终端原生AI编码,模型与Agent共同进化"],
      },
      {
        name: "Agentic Plugin Marketplace",
        link: "https://github.com/wshobson/agents/",
        shortDescriptions: ["一次编写多端生成原生Agent插件"],
      },
      {
        name: "Orca",
        link: "https://github.com/stablyai/orca/",
        shortDescriptions: ["并行调度多个coding Agent对比择优合并"],
      },
      {
        name: "LibreChat",
        link: "https://github.com/danny-avila/librechat/",
        shortDescriptions: ["开源自托管，一站聚合多家AI大模型"],
      },
      {
        name: "Aider",
        link: "https://github.com/aider-ai/aider/",
        shortDescriptions: ["终端里的AI结对编程，自动提交Git"],
      },
      {
        name: "Flowise",
        link: "https://github.com/flowiseai/flowise/",
        shortDescriptions: ["拖拽式可视化构建AI Agent与工作流"],
      },
      {
        name: "Cline",
        link: "https://github.com/cline/cline/",
        shortDescriptions: ["开源编码Agent,贯通IDE与终端"],
      },
      {
        name: "Oh My OpenAgent",
        link: "https://github.com/code-yeongyu/oh-my-openagent/",
        shortDescriptions: ["编排多Agent组队，驾驭复杂代码库"],
      },
      {
        name: "Open Interpreter",
        link: "https://github.com/openinterpreter/open-interpreter/",
        shortDescriptions: ["让低成本模型也能执行代码的终端Coding Agent"],
      },
      {
        name: "DeerFlow",
        link: "https://github.com/bytedance/deer-flow/",
        shortDescriptions: ["开源Super Agent，融合技能沙箱与记忆"],
      },
      {
        name: "Pi",
        link: "https://github.com/earendil-works/pi/",
        shortDescriptions: ["跨模型自扩展的编码Agent运行框架"],
      },
      {
        name: "OpenHands (Agent Canvas)",
        link: "https://github.com/all-hands-ai/openhands/",
        shortDescriptions: ["自托管编码Agent控制中心，统一编排多Agent"],
      },
      {
        name: "Gemini CLI",
        link: "https://github.com/google-gemini/gemini-cli/",
        shortDescriptions: ["把Gemini带进终端的开源AI Agent"],
      },
      {
        name: "Dify",
        link: "https://github.com/langgenius/dify/",
        shortDescriptions: ["可视化搭建LLM应用,内置RAG与Agent"],
      },
      {
        name: "Langflow",
        link: "https://github.com/langflow-ai/langflow/",
        shortDescriptions: ["可视化拖拽搭建并部署AI Agent与工作流"],
      },
      {
        name: "Ollama",
        link: "https://github.com/ollama/ollama/",
        shortDescriptions: ["本地一键运行开源LLM"],
      },
      {
        name: "LobeHub",
        link: "https://github.com/lobehub/lobehub/",
        shortDescriptions: ["雇佣与调度你的AI团队，Agent全天候干活"],
      },
      {
        name: "OpenClaw",
        link: "https://github.com/openclaw/openclaw/",
        shortDescriptions: ["本地运行的私人Agent，真正替你把事办成"],
      },
      {
        name: "Codex",
        link: "https://github.com/openai/codex/",
        shortDescriptions: ["OpenAI官方编程Agent，从终端直通云端"],
      },
      {
        name: "Multica",
        link: "https://github.com/multica-ai/multica/",
        shortDescriptions: ["把编程Agent变成可派活的团队成员"],
      },
      {
        name: "OpenCode",
        link: "https://github.com/anomalyco/opencode/",
        shortDescriptions: ["开源终端编程Agent，兼容75+模型"],
      },
      {
        name: "Hermes Agent",
        link: "https://github.com/NousResearch/hermes-agent/",
        shortDescriptions: ["常驻各大聊天工具的全能Agent"],
      },
      {
        name: "Paperclip",
        link: "https://github.com/paperclipai/paperclip/",
        shortDescriptions: ["像管员工一样管Agent，组织架构与预算齐全"],
      },
      {
        name: "Claude Cowork",
        link: "https://claude.com/product/cowork/",
        shortDescriptions: ["只说目标，Claude跨工具自主干完整活"],
      },
      {
        name: "Nanobot",
        link: "https://github.com/HKUDS/nanobot/",
        shortDescriptions: ["完全自托管的个人Agent运行时，长期记忆常驻"],
      },
      {
        name: "Manus Computer",
        link: "https://manus.im/desktop/",
        shortDescriptions: [
          "跑在你电脑上的桌面Agent，直接操作本地文件与工作流",
        ],
      },
      {
        name: "Perplexity Computer",
        link: "https://www.perplexity.ai/computer/new/",
        shortDescriptions: ["多模型协同的Agent，像人一样操作软件干完活"],
      },
      {
        name: "Kimi Claw",
        link: "https://www.kimi.com/bot/",
        shortDescriptions: ["一键云端托管OpenClaw，7×24小时长记忆Agent"],
      },
      {
        name: "WorkBuddy",
        link: "https://www.codebuddy.cn/work/",
        shortDescriptions: ["多Agent并行操作电脑，直接交付办公成果"],
      },
      {
        name: "Genspark Claw",
        link: "https://www.genspark.ai/claw/",
        shortDescriptions: ["自带云电脑的AI员工，聊天软件里随时派活"],
      },
    ],
  },
  {
    mainCategory: "Vibe Coding",
    remixIcon: "RiCodeBoxFill",
    slug: "vibe-coding",
    items: [
      {
        name: "Ponytail",
        link: "https://github.com/DietrichGebert/ponytail/",
        shortDescriptions: ["让编码Agent少写代码，能复用就不新建"],
      },
      {
        name: "Taskmaster",
        link: "https://github.com/eyaltoledano/claude-task-master/",
        shortDescriptions: ["把PRD拆成结构化任务驱动AI编码"],
      },
      {
        name: "GitNexus",
        link: "https://github.com/abhigyanpatwari/gitnexus/",
        shortDescriptions: ["客户端构建代码知识图谱，让Agent吃透整个代码库"],
      },
      {
        name: "CodeGraph",
        link: "https://github.com/colbymchenry/codegraph/",
        shortDescriptions: [
          "预索引代码知识图谱，让编码Agent一次调用读懂代码库",
        ],
      },
      {
        name: "Agent Skills",
        link: "https://github.com/addyosmani/agent-skills/",
        shortDescriptions: ["把资深工程实践注入AI编码全流程"],
      },
      {
        name: "Plannotator",
        link: "https://github.com/backnotprop/plannotator/",
        shortDescriptions: ["执行前批注Agent计划与代码"],
      },
      {
        name: "Understand Anything",
        link: "https://github.com/Lum1104/Understand-Anything/",
        shortDescriptions: ["把任意代码库变成可交互知识图谱"],
      },
      {
        name: "Skills For Real Engineers",
        link: "https://github.com/mattpocock/skills/",
        shortDescriptions: ["工程化Skill套件，让Agent听你的"],
      },
      {
        name: "Make Interfaces Feel Better",
        link: "https://github.com/jakubkrehel/make-interfaces-feel-better/",
        shortDescriptions: ["打磨动效与排版细节，让界面质感更高级"],
      },
      {
        name: "Waza",
        link: "https://github.com/tw93/Waza/",
        shortDescriptions: ["八个精炼Skill，把工程习惯变成指令"],
      },
      {
        name: "graphify",
        link: "https://github.com/safishamsi/graphify/",
        shortDescriptions: ["把代码库变成可查询的本地知识图谱"],
      },
      {
        name: "Compound Engineering",
        link: "https://github.com/EveryInc/compound-engineering-plugin/",
        shortDescriptions: ["31个技能让每次开发经验持续复利"],
      },
      {
        name: "Spec Kit",
        link: "https://github.com/github/spec-kit/",
        shortDescriptions: ["规范驱动开发，先写规格再写代码"],
      },
      {
        name: "OpenSpec",
        link: "https://github.com/Fission-AI/OpenSpec/",
        shortDescriptions: ["先对齐规格再写码的AI协作开发框架"],
      },
      {
        name: "AI Website Cloner Template",
        link: "https://github.com/JCodesMore/ai-website-cloner-template/",
        shortDescriptions: ["一条命令把任意网站还原成干净的Next.js代码"],
      },
      {
        name: "gstack",
        link: "https://github.com/garrytan/gstack/",
        shortDescriptions: ["23个命令把Claude Code变成一支完整工程团队"],
      },
      {
        name: "Superpowers",
        link: "https://github.com/obra/superpowers/",
        shortDescriptions: ["给编程Agent装上一整套可组合的开发方法论"],
      },
      {
        name: "MiniMax Skills",
        link: "https://github.com/MiniMax-AI/skills/",
        shortDescriptions: ["生产级开发Skill合集，深度调用MiniMax多模态能力"],
      },
    ],
  },
  {
    mainCategory: "Agent 辅助",
    remixIcon: "RiMagicFill",
    slug: "agent-boost",
    items: [
      {
        name: "Context Mode",
        link: "https://github.com/mksglu/context-mode/",
        shortDescriptions: ["隔离工具输出为Agent节省98%上下文"],
      },
      {
        name: "老码农",
        link: "https://github.com/amazingang/old-coder/",
        shortDescriptions: ["用证据报告替代逐行审查AI代码"],
      },
      {
        name: "I Have ADHD",
        link: "https://github.com/ayghri/i-have-adhd/",
        shortDescriptions: ["把Agent回复改造成直给行动的精简风格"],
      },
      {
        name: "Loopy",
        link: "https://github.com/forward-future/loop-library/",
        shortDescriptions: ["把重复工作沉淀为可复用Agent Loop"],
      },
      {
        name: "高智议会",
        link: "https://github.com/0xnyk/council-of-high-intelligence/",
        shortDescriptions: ["多AI人格对抗议事，破解高风险决策"],
      },
      {
        name: "Loop Engineering",
        link: "https://github.com/cobusgreyling/loop-engineering/",
        shortDescriptions: ["设计可复用loop编排AI编码Agent"],
      },
      {
        name: "PUA Skill",
        link: "https://github.com/tanweai/pua/",
        shortDescriptions: ["绩效话术施压，逼Coding Agent穷尽解法不摆烂"],
      },
      {
        name: "Headroom",
        link: "https://github.com/chopratejas/headroom/",
        shortDescriptions: ["为Agent压缩上下文，token最高省95%答案不变"],
      },
      {
        name: "Caveman",
        link: "https://github.com/juliusbrussee/caveman/",
        shortDescriptions: ["精简Agent啰嗦输出，省token不减脑力"],
      },
      {
        name: "ECC",
        link: "https://github.com/affaan-m/ecc/",
        shortDescriptions: ["跨harness的Agent工作流操作系统，持久沉淀经验"],
      },
    ],
  },
  {
    mainCategory: "技能工坊",
    remixIcon: "RiToolsFill",
    slug: "skill-workshop",
    items: [
      {
        name: "Skill Recorder",
        link: "https://github.com/microsoft/skill-recorder/",
        shortDescriptions: ["录屏操作一键蒸馏为可复用Agent Skill"],
      },
      {
        name: "Skills Best Practices",
        link: "https://github.com/mgechev/skills-best-practices/",
        shortDescriptions: ["打造专业级Agent Skill的最佳实践指南"],
      },
      {
        name: "Book to Skill",
        link: "https://github.com/virgiliojr94/book-to-skill/",
        shortDescriptions: ["把书籍蒸馏为按需加载的Agent Skill省token"],
      },
      {
        name: "Agent Skill Creator",
        link: "https://github.com/francyjglisboa/agent-skill-creator/",
        shortDescriptions: ["把工作流生成可跨平台部署的Agent Skill"],
      },
      {
        name: "同事.skill",
        link: "https://github.com/titanwings/colleague-skill/",
        shortDescriptions: ["把任何人的个性与技能蒸馏为可交互AI Agent"],
      },
      {
        name: "Skills",
        link: "https://github.com/vercel-labs/skills/",
        shortDescriptions: ["一行命令为75+ AI Agent安装管理Skill"],
      },
      {
        name: "女娲Skill",
        link: "https://github.com/alchaincyf/nuwa-skill/",
        shortDescriptions: ["把名人思维蒸馏为可运行Agent Skill"],
      },
      {
        name: "Teammate Skill",
        link: "https://github.com/LeoYeAI/teammate-skill/",
        shortDescriptions: ["把离职同事的经验与风格固化为可复用Skill"],
      },
      {
        name: "仓颉技能",
        link: "https://github.com/kangarooking/cangjie-skill/",
        shortDescriptions: ["把书籍视频播客蒸馏成可执行Agent Skill"],
      },
      {
        name: "Writing Great Skills",
        link: "https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills/",
        shortDescriptions: ["以确定性为核心，教你写出可预测的Agent Skill"],
      },
      {
        name: "Darwin Skill",
        link: "https://github.com/alchaincyf/darwin-skill/",
        shortDescriptions: ["让Agent Skill自我进化，分数只升不降"],
      },
      {
        name: "Yao Meta Skill",
        link: "https://github.com/yaojingang/yao-meta-skill/",
        shortDescriptions: [
          "Agent Skill全生命周期工程化，从生成到评测到跨平台打包",
        ],
      },
      {
        name: "道 · Skill",
        link: "https://github.com/gnipbao/dao-skill/",
        shortDescriptions: ["用道家心法把需求炼成可进化的Agent Skill"],
      },
    ],
  },
  {
    mainCategory: "PPT与演示",
    remixIcon: "RiPresentationFill",
    slug: "ppt-presentation",
    items: [
      {
        name: "Open Kimi PPT Skill",
        link: "https://github.com/binaryify/open-kimi-ppt-skill/",
        shortDescriptions: ["逆向Kimi Slides，让Agent直出可编辑PPT"],
      },
      {
        name: "Beautiful HTML Templates",
        link: "https://github.com/zarazhangrui/beautiful-html-templates/",
        shortDescriptions: ["34套精美HTML模板助Agent生成专业幻灯片"],
      },
      {
        name: "Gorden Super PPT Skills",
        link: "https://github.com/gordensun/gordensuperpptskills/",
        shortDescriptions: ["生成精美图片PPT并转为可编辑PPTX"],
      },
      {
        name: "HTML PPT Studio",
        link: "https://github.com/lewislulu/html-ppt-skill/tree/main/",
        shortDescriptions: ["用HTML打造专业演示，主题布局动效开箱即用"],
      },
      {
        name: "Dashi PPT Skill",
        link: "https://github.com/chuspeeism/dashi-ppt-skill/",
        shortDescriptions: ["文档一键成稿，浏览器直改可导出PPTX"],
      },
      {
        name: "open-slide",
        link: "https://github.com/1weiho/open-slide/",
        shortDescriptions: ["Agent原生演示框架，一句话生成React幻灯片"],
      },
      {
        name: "PPT Master",
        link: "https://github.com/hugohe3/ppt-master/",
        shortDescriptions: ["把文档变成可编辑的原生PPT"],
      },
      {
        name: "Magazine Web PPT",
        link: "https://github.com/op7418/guizang-ppt-skill/",
        shortDescriptions: ["一键生成单文件HTML翻页PPT，杂志与瑞士双设计体系"],
      },
      {
        name: "Frontend Slides",
        link: "https://github.com/zarazhangrui/frontend-slides/",
        shortDescriptions: ["一句话或PPT变成单文件HTML演示"],
      },
    ],
  },
  {
    mainCategory: "设计与界面",
    remixIcon: "RiColorFilterAiFill",
    slug: "design-ui",
    items: [
      {
        name: "Craft Skills",
        link: "https://github.com/zseven-w/craft-skills/",
        shortDescriptions: ["评测驱动的创意设计Skill合集"],
      },
      {
        name: "Dembrandt",
        link: "https://github.com/dembrandt/dembrandt/",
        shortDescriptions: ["秒级提取任意网站设计系统Token"],
      },
      {
        name: "Motion Design Skill",
        link: "https://github.com/lottiefiles/motion-design-skill/",
        shortDescriptions: ["让Agent精通界面动效设计的哲学与手法"],
      },
      {
        name: "IP as Logo",
        link: "https://github.com/s1dashu/ip-as-logo-skill/",
        shortDescriptions: ["把IP角色变成极简吉祥物Logo"],
      },
      {
        name: "ReadyDesign Skill",
        link: "https://github.com/zethrise/readydesign-skill/",
        shortDescriptions: ["强制Agent用官方组件库构建真实UI"],
      },
      {
        name: "纸上留影",
        link: "https://github.com/wnby/photo-relic-editorial/",
        shortDescriptions: ["把照片转为上实下艺的东方版画"],
      },
      {
        name: "Mengto Skills",
        link: "https://github.com/mengto/skills/",
        shortDescriptions: ["面向AI Agent的设计与网页构建技能库"],
      },
      {
        name: "GC Minimal Zine Poster",
        link: "https://github.com/liamgvchi/gc-minimal-zine-poster/",
        shortDescriptions: ["把任意主题生成极简杂志风编辑海报"],
      },
      {
        name: "img2threejs",
        link: "https://github.com/img2threejs/img2threejs/",
        shortDescriptions: ["把参考图重建为可动画的Three.js代码模型"],
      },
      {
        name: "拾景zine",
        link: "https://github.com/zeejay0/gathered-scenes-zine-skill/",
        shortDescriptions: ["把照片炼成纸感拼贴zine海报"],
      },
      {
        name: "Transitions.dev",
        link: "https://github.com/jakubantalik/transitions.dev/",
        shortDescriptions: ["可复用CSS过渡动画集合，Agent一键应用"],
      },
      {
        name: "Scroll World",
        link: "https://github.com/oso95/scroll-world/",
        shortDescriptions: ["滚动飞越AI生成的沉浸式3D落地页"],
      },
      {
        name: "ECommerce Details Image Generator",
        link: "https://github.com/liangdabiao/ecom-details-image/",
        shortDescriptions: ["一张产品图生成全套电商营销视觉"],
      },
      {
        name: "Beautify GitHub README",
        link: "https://github.com/oil-oil/beautify-github-readme/",
        shortDescriptions: ["为GitHub项目打造专业视觉化README主页"],
      },
      {
        name: "Claude Design System Prompt",
        link: "https://github.com/trystan-sa/claude-design-system-prompt/",
        shortDescriptions: ["系统提示词把LLM变成有品味的设计搭档，拒绝AI味"],
      },
      {
        name: "Better Interface Skills",
        link: "https://github.com/jakubkrehel/skills/",
        shortDescriptions: ["一套Agent Skill全维度打磨界面设计"],
      },
      {
        name: "DESIGN.md",
        link: "https://github.com/google-labs-code/design.md/",
        shortDescriptions: ["让Agent读懂并一致应用设计系统的格式规范"],
      },
      {
        name: "Awesome Design.md",
        link: "https://github.com/voltagent/awesome-design-md/",
        shortDescriptions: ["品牌DESIGN.md让Agent复刻一致UI风格"],
      },
      {
        name: "UI UX Pro Max Skill",
        link: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/",
        shortDescriptions: ["AI推理秒级生成完整UI/UX设计系统"],
      },
      {
        name: "Hallmark",
        link: "https://github.com/nutlope/hallmark/",
        shortDescriptions: ["让AI生成的网页设计摆脱一眼AI味"],
      },
      {
        name: "Skills For Design Engineers",
        link: "https://github.com/emilkowalski/skills/",
        shortDescriptions: ["把资深动效设计品味注入AI界面"],
      },
      {
        name: "Huashu Design",
        link: "https://github.com/alchaincyf/huashu-design/",
        shortDescriptions: ["一句话产出可点击原型、幻灯片与动画"],
      },
      {
        name: "Web Shader Extractor",
        link: "https://github.com/lixiaolin94/skills/tree/main/web-shader-extractor/",
        shortDescriptions: ["扒下网页WebGL特效，还原为可改的本地项目"],
      },
      {
        name: "Claude Design",
        link: "https://claude.com/plugins/design/",
        shortDescriptions: ["Anthropic官方设计插件，评审到交付全流程提速"],
      },
      {
        name: "baoyu-design",
        link: "https://github.com/JimLiu/baoyu-design/",
        shortDescriptions: ["把Claude Design搬到本地，任意Agent即设计工作室"],
      },
      {
        name: "Garden Skills",
        link: "https://github.com/ConardLi/garden-skills/",
        shortDescriptions: ["生产级Agent Skill合集，专治AI作品粗糙"],
      },
      {
        name: "Frontend Design Skill",
        link: "https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md/",
        shortDescriptions: ["摆脱AI模板感，做有个性的界面"],
      },
      {
        name: "Open Design",
        link: "https://github.com/nexu-io/open-design/",
        shortDescriptions: ["让编码Agent变成品牌级设计引擎"],
      },
      {
        name: "Naksha",
        link: "https://github.com/Adityaraj0421/naksha-studio/",
        shortDescriptions: ["26位设计专家组成的虚拟设计团队，直接驻扎编辑器"],
      },
      {
        name: "Taste Skill",
        link: "https://github.com/Leonxlnx/taste-skill/",
        shortDescriptions: ["给AI生成的前端界面注入设计品味"],
      },
      {
        name: "Kami",
        link: "https://github.com/tw93/kami/",
        shortDescriptions: ["文档设计系统，让Agent产出即成品"],
      },
      {
        name: "design-dna",
        link: "https://github.com/zanwei/design-dna/",
        shortDescriptions: ["提取界面设计基因为JSON，复刻同款视觉"],
      },
      {
        name: "nano-banana-pro-prompts-recommend-skill",
        link: "https://github.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill/",
        shortDescriptions: ["万级Nano Banana Pro提示词库，语义搜索带图预览"],
      },
      {
        name: "Impeccable",
        link: "https://github.com/pbakaus/impeccable/",
        shortDescriptions: ["给AI编程Agent的设计语言，终结千篇一律的AI味界面"],
      },
      {
        name: "Refactoring UI 技能",
        link: "https://github.com/s0xdk/refactoring-ui-skill/",
        shortDescriptions: ["把Refactoring UI法则内化为专业设计决策"],
      },
    ],
  },
  {
    mainCategory: "视频与动画",
    remixIcon: "RiMovieAiFill",
    slug: "video-animation",
    items: [
      {
        name: "Director",
        link: "https://github.com/s1dashu/director/",
        shortDescriptions: ["多模式工作流端到端导演视频，从创意到成片"],
      },
      {
        name: "Oil Motion",
        link: "https://github.com/oil-oil/oil-motion/",
        shortDescriptions: ["把AI视频变成随交互驱动的网页动画"],
      },
      {
        name: "Animated Voiceover",
        link: "https://github.com/s1dashu/animated-voiceover/",
        shortDescriptions: ["把知识概念转成风格一致的动画解说视频"],
      },
      {
        name: "Video ShotCraft",
        link: "https://github.com/Vincentwei1021/video-shotcraft/",
        shortDescriptions: ["让Agent变身电影级产品视频工作室"],
      },
      {
        name: "小说角色",
        link: "https://github.com/eternityspring/shuohao-skills/",
        shortDescriptions: ["把小说自动拆解为完整角色设定集"],
      },
      {
        name: "Img2Three.js",
        link: "https://github.com/hoainho/img2threejs/",
        shortDescriptions: ["把单张图重建为可动画的程序化Three.js模型"],
      },
      {
        name: "MiniMax H3 技能包",
        link: "https://github.com/minimax-ai/minimax-h3/tree/main/skills/",
        shortDescriptions: ["结构化提示词驱动H3多风格视频生成"],
      },
      {
        name: "JZSub",
        link: "https://github.com/pengchujin/jzsub/",
        shortDescriptions: ["多平台视频下载并烧录双语字幕"],
      },
      {
        name: "Seedance 2.0 Skill OS",
        link: "https://github.com/emily2040/seedance-2.0/",
        shortDescriptions: ["以导演思维驾驭Seedance 2.0出片"],
      },
      {
        name: "Claude Video",
        link: "https://github.com/bradautomates/claude-video/",
        shortDescriptions: ["让Claude基于画面与语音真正看懂视频"],
      },
      {
        name: "Video Use",
        link: "https://github.com/browser-use/video-use/",
        shortDescriptions: ["让Agent用自然语言把原始素材剪成成片"],
      },
      {
        name: "HyperFrames",
        link: "https://github.com/heygen-com/hyperframes/",
        shortDescriptions: ["写HTML渲染视频，专为Agent打造"],
      },
      {
        name: "OpenMontage",
        link: "https://github.com/calesthio/openmontage/",
        shortDescriptions: ["让Agent用真实素材端到端产出视频"],
      },
      {
        name: "Gbro Collage B-roll",
        link: "https://github.com/pyang5166/gbro-collage-broll/",
        shortDescriptions: ["一句口播文案生成半调纸艺拼贴B-roll"],
      },
      {
        name: "BaoCut",
        link: "https://github.com/jimliu/baocut/",
        shortDescriptions: ["一句话指挥Agent转写字幕并剪好视频"],
      },
      {
        name: "Remotion",
        link: "https://github.com/remotion-dev/skills/",
        shortDescriptions: ["官方技能包，让Agent用React写代码渲染视频"],
      },
      {
        name: "Text-to-Lottie",
        link: "https://github.com/diffusionstudio/lottie/",
        shortDescriptions: ["一句话生成可上线的Lottie动画，实时预览"],
      },
      {
        name: "html-video",
        link: "https://github.com/nexu-io/html-video/",
        shortDescriptions: ["本地把HTML渲染成MP4，Agent全程驱动"],
      },
      {
        name: "GSAP AI Skills",
        link: "https://github.com/greensock/gsap-skills/",
        shortDescriptions: ["GSAP官方技能，教会Agent写对动画代码"],
      },
      {
        name: "Promo BGM",
        link: "https://github.com/whyubel1eve/promo-bgm-skill/",
        shortDescriptions: ["纯代码合成免版权配乐，自动对齐视频剪辑点"],
      },
      {
        name: "人体动作提取器",
        link: "https://github.com/pluviobyte/rnskill/tree/main/skills/rn-human-motion-extractor/",
        shortDescriptions: ["从视频提取匿名人体与手部动作转为可复用动画数据"],
      },
    ],
  },
  {
    mainCategory: "写作与文案",
    remixIcon: "RiQuillPenAiFill",
    slug: "writing-copy",
    items: [
      {
        name: "Rainman Translate Book",
        link: "https://github.com/deusyu/translate-book/",
        shortDescriptions: ["多Agent并行翻译整本书，术语一致多格式输出"],
      },
      {
        name: "活人感写作",
        link: "https://github.com/kkkkhazix/human-writing/",
        shortDescriptions: ["让AI中文写作摆脱AI腔像真人"],
      },
      {
        name: "Resume Skills for Claude Code",
        link: "https://github.com/paramchoudhary/resumeskills/",
        shortDescriptions: ["20个Skill优化简历助你拿下offer"],
      },
      {
        name: "钩子生成器",
        link: "https://github.com/charlie947/social-media-skills/tree/main/skills/hook-generator/",
        shortDescriptions: ["六种角度秒出LinkedIn吸睛钩子"],
      },
      {
        name: "No AI Slop",
        link: "https://github.com/petergyang/no-ai-slop/",
        shortDescriptions: ["去除AI写作腔，保留你的真实文风"],
      },
      {
        name: "Stop Slop",
        link: "https://github.com/hardikpandya/stop-slop/",
        shortDescriptions: ["清除AI写作腔调，让文字回归人味"],
      },
      {
        name: "Humanizer",
        link: "https://github.com/blader/humanizer/",
        shortDescriptions: ["抹除AI写作痕迹让文字读起来像真人"],
      },
      {
        name: "内部沟通",
        link: "https://github.com/anthropics/skills/tree/main/skills/internal-comms/",
        shortDescriptions: ["按公司规范撰写各类内部沟通"],
      },
      {
        name: "avoid-ai-writing",
        link: "https://github.com/conorbronsdon/avoid-ai-writing/",
        shortDescriptions: ["识别并改写AI腔，让文字回归人味"],
      },
      {
        name: "baoyu-skills",
        link: "https://github.com/JimLiu/baoyu-skills/",
        shortDescriptions: ["20+内容创作Skill合集，按需取用"],
      },
    ],
  },
  {
    mainCategory: "文档与表格",
    remixIcon: "RiFileEditFill",
    slug: "documents-sheets",
    items: [
      {
        name: "Watermarks Remover",
        link: "https://github.com/guillaumemeyer/watermarks-remover/",
        shortDescriptions: ["剥离文本与文件中的AI水印和元数据"],
      },
      {
        name: "KY Markdown Rebuilder",
        link: "https://github.com/kyriecheungyep/ky-markdown-rebuilder/",
        shortDescriptions: ["把复杂文档重建为版面对齐的Markdown"],
      },
      {
        name: "LaTeX Document Skill",
        link: "https://github.com/ndpvt-web/latex-document-skill/",
        shortDescriptions: ["一句话生成出版级LaTeX文档"],
      },
      {
        name: "花叔 MD-HTML",
        link: "https://github.com/alchaincyf/huashu-md-html/",
        shortDescriptions: ["以Markdown为源码，一键产出出版级HTML与DOCX"],
      },
      {
        name: "OfficeCLI",
        link: "https://github.com/iofficeai/officecli/",
        shortDescriptions: ["让Agent直接创建与编辑Word Excel PPT"],
      },
      {
        name: "effective-html",
        link: "https://github.com/plannotator/effective-html/",
        shortDescriptions: ["让Agent产出精美的单文件HTML交付物"],
      },
      {
        name: "SenseNova-Skills",
        link: "https://github.com/OpenSenseNova/SenseNova-Skills/",
        shortDescriptions: ["商汤官方办公Skill集，成图表演示与深度研究一站式"],
      },
      {
        name: "HTML Anything",
        link: "https://github.com/nexu-io/html-anything/",
        shortDescriptions: ["调度本地Agent把万物变成可发布HTML"],
      },
      {
        name: "MarkItDown",
        link: "https://github.com/microsoft/markitdown/",
        shortDescriptions: ["万象文档一键转为LLM友好的Markdown"],
      },
      {
        name: "QMD",
        link: "https://github.com/tobi/qmd/",
        shortDescriptions: ["全本地混合检索，让Markdown笔记秒变知识库"],
      },
    ],
  },
  {
    mainCategory: "图表与图解",
    remixIcon: "RiFundsFill",
    slug: "diagrams-illustration",
    items: [
      {
        name: "Pretty-Mermaid Skills",
        link: "https://github.com/imxv/pretty-mermaid-skills/",
        shortDescriptions: ["把Mermaid代码渲染成精美主题图表"],
      },
      {
        name: "Chart Visualization Skills (AntV)",
        link: "https://github.com/antvis/chart-visualization-skills/",
        shortDescriptions: ["数据智能转专业图表，深度集成AntV生态"],
      },
      {
        name: "Tufte Skill",
        link: "https://github.com/aref-vc/tufte-claude-skill/",
        shortDescriptions: ["遵循Tufte原则打造极简高信息量图表"],
      },
      {
        name: "Lieflat Charts",
        link: "https://github.com/larashero3-dotcom/lieflat-charts/",
        shortDescriptions: ["把数据变成编辑级质感的可交互图表"],
      },
      {
        name: "Draw.io Skill",
        link: "https://github.com/agents365-ai/drawio-skill/",
        shortDescriptions: ["自然语言与代码秒变专业draw.io图表"],
      },
      {
        name: "Visual Explainer",
        link: "https://github.com/nicobailon/visual-explainer/",
        shortDescriptions: ["把终端输出变成可视化HTML与幻灯片"],
      },
      {
        name: "Draw.io 科研绘图",
        link: "https://github.com/icebird1998/drawio-scientific-illustrator/",
        shortDescriptions: ["驱动Agent实时操控draw.io画布绘制科研插图"],
      },
      {
        name: "CAD Skills",
        link: "https://github.com/earthtojake/text-to-cad/",
        shortDescriptions: ["自然语言生成CAD模型与机器人文件"],
      },
      {
        name: "GiMi Illustration",
        link: "https://github.com/GiMi-Xiaomi/gimi-illustration-skill/",
        shortDescriptions: ["一键把文章变成风格统一的手绘配图"],
      },
      {
        name: "Archify",
        link: "https://github.com/tt-a1i/archify/",
        shortDescriptions: ["一句话描述生成可交互架构图"],
      },
      {
        name: "Diagram Design",
        link: "https://github.com/cathrynlavery/diagram-design/",
        shortDescriptions: ["27种图表一键生成，自动套用你的品牌风格"],
      },
      {
        name: "Architecture Diagram Generator",
        link: "https://github.com/Cocoon-AI/architecture-diagram-generator/",
        shortDescriptions: ["一句话描述直出可分享的系统架构图"],
      },
      {
        name: "fireworks-tech-graph",
        link: "https://github.com/yizhiyanhua-ai/fireworks-tech-graph/",
        shortDescriptions: ["一句话生成生产级技术架构图"],
      },
    ],
  },
  {
    mainCategory: "营销与增长",
    remixIcon: "RiAdvertisementFill",
    slug: "marketing-growth",
    items: [
      {
        name: "RN Skills",
        link: "https://github.com/pluviobyte/rnskill/",
        shortDescriptions: ["新媒体内容生产全流程Skill全集"],
      },
      {
        name: "TikTok Agent Skills",
        link: "https://github.com/aronhy/tiktok-agent-skills/",
        shortDescriptions: ["一句话打通TikTok Shop选品增长获客投放"],
      },
      {
        name: "OpenSEO",
        link: "https://github.com/every-app/open-seo/",
        shortDescriptions: ["开源SEO平台，替代Semrush与Ahrefs"],
      },
      {
        name: "Codex 首批客户挖掘 Skill",
        link: "https://github.com/kappaemme-git/codex-first-customer-finder-skill/",
        shortDescriptions: ["用公开信号锁定首批客户并生成外联文案"],
      },
      {
        name: "Claude SEO",
        link: "https://github.com/agricidaniel/claude-seo/",
        shortDescriptions: ["多Agent并行审计网站SEO,建议均可验证"],
      },
      {
        name: "Yao GEO Skills",
        link: "https://github.com/yaojingang/yao-geo-skills/",
        shortDescriptions: ["21个Skill覆盖GEO全流程，直接产出交付级报告"],
      },
      {
        name: "SEO Machine",
        link: "https://github.com/TheCraigHewitt/seomachine/",
        shortDescriptions: ["从选词到发布，打通SEO长文内容全流程"],
      },
      {
        name: "seo-audit-skill",
        link: "https://github.com/JeffLi1993/seo-audit-skill/",
        shortDescriptions: ["输入网址即产出可执行SEO审计报告"],
      },
      {
        name: "Claude Ads",
        link: "https://github.com/AgriciDaniel/claude-ads/",
        shortDescriptions: ["打通12大广告渠道的投放审计与优化中枢"],
      },
      {
        name: "Marketing Skills for AI Agents",
        link: "https://github.com/coreyhaines31/marketingskills/",
        shortDescriptions: ["60+营销Skill，让Agent秒变增长专家"],
      },
    ],
  },
  {
    mainCategory: "产品与商业",
    remixIcon: "RiShoppingBag4Fill",
    slug: "product-business",
    items: [
      {
        name: "OPC Skills",
        link: "https://github.com/resciencelab/opc-skills/",
        shortDescriptions: ["为独立开发者打造的一人公司AI Agent技能集"],
      },
      {
        name: "Startup Skill",
        link: "https://github.com/ferdinandobons/startup-skill/",
        shortDescriptions: ["用Agent产出咨询级创业策略验证与融资路演"],
      },
      {
        name: "产品拆解技能",
        link: "https://github.com/yanliudesign/product-teardown-skill/",
        shortDescriptions: ["系统化拆解产品自动生成双语分析报告"],
      },
      {
        name: "Shopify Admin Skills",
        link: "https://github.com/40rty-ai/shopify-admin-skills/",
        shortDescriptions: ["用Agent技能与定时例程运营Shopify店铺"],
      },
      {
        name: "Vibe Check",
        link: "https://github.com/texasbedouin/vibe-check/",
        shortDescriptions: ["把模糊想法打磨成可落地的产品蓝图"],
      },
      {
        name: "DBSkill",
        link: "https://github.com/dontbesilent2025/dbskill/",
        shortDescriptions: ["把实战商业经验蒸馏成随叫随到的诊断Skill"],
      },
      {
        name: "PM Skills Marketplace",
        link: "https://github.com/phuryn/pm-skills/",
        shortDescriptions: ["百余个产品管理Skill，覆盖需求探索到增长全流程"],
      },
      {
        name: "The Minimalist Entrepreneur",
        link: "https://github.com/slavingia/skills/",
        shortDescriptions: ["十个Skill陪你从社区起步走到可持续增长"],
      },
      {
        name: "Product Manager Skills",
        link: "https://github.com/deanpeters/Product-Manager-Skills/",
        shortDescriptions: ["70套实战产品方法论，装进Agent Skill"],
      },
      {
        name: "MakerSkills",
        link: "https://github.com/coreyhaines31/makerskills/",
        shortDescriptions: ["面向独立创业者的Agent技能集，覆盖决策研究与运营"],
      },
    ],
  },
  {
    mainCategory: "研究与学习",
    remixIcon: "RiGraduationCapFill",
    slug: "research-learning",
    items: [
      {
        name: "ELI5",
        link: "https://github.com/anthropics/claude-plugins-community/tree/main/eli5/",
        shortDescriptions: ["用大图和大白话把任何话题讲到五岁能懂"],
      },
      {
        name: "Claude Scholar",
        link: "https://github.com/galaxy-dawn/claude-scholar/",
        shortDescriptions: ["贯穿选题到发表的科研全流程Agent"],
      },
      {
        name: "Paper Craft Skills",
        link: "https://github.com/zsyggg/paper-craft-skills/",
        shortDescriptions: ["把论文变成配图、幻灯片与深度解读"],
      },
      {
        name: "Yao Expert Skill",
        link: "https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-expert-skill/",
        shortDescriptions: ["把任意领域变成结构化专家学习包"],
      },
      {
        name: "Hyperresearch",
        link: "https://github.com/jordan-gibbs/hyperresearch/",
        shortDescriptions: ["深度研究Agent，核查来源产出可溯源报告"],
      },
      {
        name: "Perplexity MCP Server",
        link: "https://github.com/perplexityai/modelcontextprotocol/",
        shortDescriptions: ["为Agent接入Perplexity实时联网搜索与研究"],
      },
      {
        name: "Supervisor Skills",
        link: "https://github.com/hkustdial/supervisor-skills/",
        shortDescriptions: ["把导师科研经验蒸馏为可调用Agent Skill"],
      },
      {
        name: "Codebase to Course",
        link: "https://github.com/zarazhangrui/codebase-to-course/",
        shortDescriptions: ["把代码库变成可交互教学课程"],
      },
      {
        name: "Anything to NotebookLM",
        link: "https://github.com/joeseesun/qiaomu-anything-to-notebooklm/",
        shortDescriptions: ["任意内容一键喂进NotebookLM，付费墙也能破"],
      },
      {
        name: "科研论文写作技能",
        link: "https://github.com/master-cai/research-paper-writing-skills/",
        shortDescriptions: ["分章节精修学术论文，内置审稿人视角自审"],
      },
      {
        name: "ARS-Codex",
        link: "https://github.com/imbad0202/academic-research-skills-codex/",
        shortDescriptions: ["覆盖文献综述到论文评审的学术研究全流程"],
      },
      {
        name: "NotebookLM-py",
        link: "https://github.com/teng-lin/notebooklm-py/",
        shortDescriptions: ["用Python和Agent全量操控NotebookLM"],
      },
      {
        name: "DeepTutor",
        link: "https://github.com/hkuds/deeptutor/",
        shortDescriptions: ["Agent原生，一个引擎贯通所有学习场景"],
      },
      {
        name: "科学Agent Skills",
        link: "https://github.com/k-dense-ai/scientific-agent-skills/",
        shortDescriptions: ["158个Skill让Agent胜任生物医药科研"],
      },
      {
        name: "Nature Skills",
        link: "https://github.com/yuan1z0825/nature-skills/",
        shortDescriptions: ["科研全流程Skill集，产出可直用成果"],
      },
      {
        name: "Teach",
        link: "https://github.com/mattpocock/skills/tree/main/skills/productivity/teach/",
        shortDescriptions: ["把Agent变成跨会话进阶的私人导师"],
      },
      {
        name: "Academic Research Skills",
        link: "https://github.com/Imbad0202/academic-research-skills/",
        shortDescriptions: ["多Agent协作，打通调研写作到同行评审全流程"],
      },
      {
        name: "AI Research Skills Library",
        link: "https://github.com/Orchestra-Research/AI-Research-SKILLs/",
        shortDescriptions: ["98个Skill让Agent独立跑完AI科研全流程"],
      },
      {
        name: "last30days",
        link: "https://github.com/mvanhorn/last30days-skill/",
        shortDescriptions: ["全网社交平台搜索，按真实热度排序"],
      },
    ],
  },
  {
    mainCategory: "网页与自动化",
    remixIcon: "RiChromeFill",
    slug: "web-automation",
    items: [
      {
        name: "Ego Lite",
        link: "https://github.com/citrolabs/ego-lite/",
        shortDescriptions: ["为AI Agent打造的浏览器,共享登录态互不打扰"],
      },
      {
        name: "Peekaboo",
        link: "https://github.com/openclaw/peekaboo/",
        shortDescriptions: ["让Agent看懂屏幕并自动操控macOS"],
      },
      {
        name: "n8n-MCP",
        link: "https://github.com/czlonkowski/n8n-mcp/",
        shortDescriptions: ["让AI精准搭建n8n自动化工作流"],
      },
      {
        name: "Browser Use",
        link: "https://github.com/browser-use/browser-use/",
        shortDescriptions: ["让AI Agent自主操控浏览器完成网页任务"],
      },
      {
        name: "n8n",
        link: "https://github.com/n8n-io/n8n/",
        shortDescriptions: ["可视化搭建AI Agent与自动化工作流"],
      },
      {
        name: "Skyvern",
        link: "https://github.com/Skyvern-AI/skyvern/",
        shortDescriptions: ["视觉LLM驱动的浏览器自动化，页面改版也不怕"],
      },
      {
        name: "OpenConnector",
        link: "https://github.com/oomol-lab/open-connector/",
        shortDescriptions: ["凭证不出域，让Agent直连千款SaaS"],
      },
      {
        name: "BrowserAct",
        link: "https://github.com/browser-act/skills/",
        shortDescriptions: ["让Agent畅通无阻的反封锁浏览器"],
      },
      {
        name: "Browserbase",
        link: "https://browse.sh/",
        shortDescriptions: ["面向Agent的浏览器CLI，内置500+网站技能"],
      },
      {
        name: "Kimi WebBridge",
        link: "https://www.kimi.com/features/webbridge/",
        shortDescriptions: ["让Agent接管你的浏览器，全程本地运行"],
      },
      {
        name: "AnySearch",
        link: "https://github.com/anysearch-ai/anysearch-skill/",
        shortDescriptions: ["一次调用拿到密钥，为Agent接入实时全网搜索"],
      },
      {
        name: "Apify Agent Skills",
        link: "https://github.com/apify/agent-skills/",
        shortDescriptions: ["让Agent直接调用三万个Apify Actor抓取全网数据"],
      },
      {
        name: "Midscene Skills",
        link: "https://github.com/web-infra-dev/midscene/",
        shortDescriptions: ["自然语言驱动的视觉UI自动化，全平台通用"],
      },
      {
        name: "Obscura",
        link: "https://github.com/h4ckf0r0day/obscura/",
        shortDescriptions: ["Rust极简无头浏览器，30MB替代Chrome"],
      },
      {
        name: "Browser Harness",
        link: "https://github.com/browser-use/browser-harness/",
        shortDescriptions: ["自我进化的浏览器操控，Agent边跑边补技能"],
      },
      {
        name: "Lightpanda Browser",
        link: "https://github.com/lightpanda-io/browser/",
        shortDescriptions: ["为AI Agent重写的无头浏览器，比Chrome快9倍"],
      },
      {
        name: "AutoCLI",
        link: "https://github.com/nashsu/AutoCLI/",
        shortDescriptions: ["一条命令抓取任意网站数据，内置55+站点"],
      },
      {
        name: "page-agent",
        link: "https://github.com/alibaba/page-agent/",
        shortDescriptions: ["一行脚本让任意网页拥有自己的GUI Agent"],
      },
      {
        name: "Agent Browser",
        link: "https://github.com/vercel-labs/agent-browser/",
        shortDescriptions: ["为AI Agent而生的极速Rust浏览器自动化CLI"],
      },
      {
        name: "OpenCLI",
        link: "https://github.com/jackwener/opencli/",
        shortDescriptions: ["把任意网站变成CLI，让Agent直接操作已登录浏览器"],
      },
      {
        name: "MediaCrawler",
        link: "https://github.com/NanmiCoder/MediaCrawler/",
        shortDescriptions: ["一站采集七大主流社媒公开数据"],
      },
      {
        name: "Agent-Reach",
        link: "https://github.com/Panniantong/Agent-Reach/",
        shortDescriptions: ["一条命令让Agent读遍全网主流平台"],
      },
      {
        name: "Web-Access",
        link: "https://github.com/eze-is/web-access/",
        shortDescriptions: ["让Agent接管真实浏览器，智能调度上网工具"],
      },
      {
        name: "Scrapling",
        link: "https://github.com/D4Vinci/Scrapling/",
        shortDescriptions: ["自适应爬虫框架，抗改版又能突破反爬"],
      },
      {
        name: "Stagehand",
        link: "https://github.com/browserbase/stagehand/",
        shortDescriptions: ["浏览器Agent的SDK，用自然语言取代易碎选择器"],
      },
    ],
  },
  {
    mainCategory: "代码审查与安全",
    remixIcon: "RiShieldFlashLine",
    slug: "code-review-security",
    items: [
      {
        name: "Security Review",
        link: "https://github.com/github/awesome-copilot/blob/main/skills/security-review/SKILL.md/",
        shortDescriptions: ["像安全研究员一样推理挖掘代码漏洞"],
      },
      {
        name: "Code Review Skill",
        link: "https://github.com/awesome-skills/code-review-skill/",
        shortDescriptions: ["覆盖20+语言框架的专家级结构化代码审查"],
      },
      {
        name: "Open Code Review",
        link: "https://github.com/alibaba/open-code-review/",
        shortDescriptions: ["混合架构AI代码审查，精准行级定位"],
      },
      {
        name: "Codex Security",
        link: "https://github.com/openai/codex-security/",
        shortDescriptions: ["AI扫描并修复代码安全漏洞"],
      },
      {
        name: "Yao Websecurity Skill",
        link: "https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-websecurity-skill/",
        shortDescriptions: ["结构化授权Web安全审查，内置275项检测"],
      },
      {
        name: "Security Audit Skill",
        link: "https://github.com/cloudflare/security-audit-skill/",
        shortDescriptions: ["多Agent并行审计只报可利用漏洞"],
      },
      {
        name: "Claude Code /security-review",
        link: "https://github.com/anthropics/claude-code-security-review/blob/main/.claude/commands/security-review.md/",
        shortDescriptions: ["合并前扫描代码diff只揪高危安全漏洞"],
      },
      {
        name: "Improve",
        link: "https://github.com/shadcn/improve/",
        shortDescriptions: ["审计代码库，为Agent产出可执行计划"],
      },
      {
        name: "Codex Plugin for Claude Code",
        link: "https://github.com/openai/codex-plugin-cc/",
        shortDescriptions: ["在Claude Code中调用Codex审查代码、委派任务"],
      },
      {
        name: "Strix",
        link: "https://github.com/usestrix/strix/",
        shortDescriptions: ["AI Agent自主渗透测试并验证真实漏洞"],
      },
      {
        name: "SkillSpector",
        link: "https://github.com/NVIDIA/skillspector/",
        shortDescriptions: ["安装前先扫描Agent Skill的安全风险"],
      },
      {
        name: "SlowMist Agent Security Skill",
        link: "https://github.com/slowmist/slowmist-agent-security/",
        shortDescriptions: ["零信任审查Agent接触的每一个外部输入"],
      },
    ],
  },
  {
    mainCategory: "记忆与知识库",
    remixIcon: "RiDatabase2Fill",
    slug: "memory-knowledge",
    items: [
      {
        name: "Obsidian 第二大脑",
        link: "https://github.com/eugeniughelbur/obsidian-second-brain/",
        shortDescriptions: ["把Obsidian库变成Agent的持久记忆"],
      },
      {
        name: "NotebookLM Claude Code Skill",
        link: "https://github.com/pleaseprompto/notebooklm-skill/",
        shortDescriptions: ["让Claude直连NotebookLM检索文档溯源答案"],
      },
      {
        name: "Letta",
        link: "https://github.com/letta-ai/letta/",
        shortDescriptions: ["打造有记忆能自我进化的有状态Agent"],
      },
      {
        name: "Supermemory",
        link: "https://github.com/supermemoryai/supermemory/",
        shortDescriptions: ["极速可本地运行的AI记忆与上下文引擎"],
      },
      {
        name: "OpenHuman",
        link: "https://github.com/tinyhumansai/openhuman/",
        shortDescriptions: ["本地优先的个人AI超级智能，融合记忆编排与调研"],
      },
      {
        name: "Obsidian 技能",
        link: "https://github.com/kepano/obsidian-skills/",
        shortDescriptions: ["让Agent读写Obsidian笔记与知识库"],
      },
      {
        name: "Context7",
        link: "https://github.com/upstash/context7/",
        shortDescriptions: ["为AI编码注入最新版本文档，杜绝API幻觉"],
      },
      {
        name: "agentmemory",
        link: "https://github.com/rohitg00/agentmemory/",
        shortDescriptions: ["给编程Agent跨会话记忆，省92% token"],
      },
      {
        name: "MemPalace",
        link: "https://github.com/milla-jovovich/mempalace/",
        shortDescriptions: ["本地记忆宫殿，检索召回率跑分领先"],
      },
      {
        name: "Claude-Mem",
        link: "https://github.com/thedotmack/claude-mem/",
        shortDescriptions: ["跨设备Agent记忆层，随时接续上下文"],
      },
      {
        name: "Planning with files",
        link: "https://github.com/othmanadi/planning-with-files/",
        shortDescriptions: [
          "用Markdown文件做Agent的磁盘工作记忆，计划跨会话不丢失",
        ],
      },
      {
        name: "Mem0",
        link: "https://github.com/mem0ai/mem0/",
        shortDescriptions: ["给AI Agent即插即用的长期记忆层"],
      },
      {
        name: "MemU",
        link: "https://github.com/NevaMind-AI/memU/",
        shortDescriptions: ["自组织的Agent记忆层，让AI真正记住你"],
      },
      {
        name: "OpenViking",
        link: "https://github.com/volcengine/OpenViking/",
        shortDescriptions: ["自进化上下文数据库，统一Agent记忆知识与技能"],
      },
    ],
  },
  {
    mainCategory: "常见官方技能",
    remixIcon: "RiShakeHandsFill",
    slug: "official-skills",
    items: [
      {
        name: "Awesome GitHub Copilot",
        link: "https://github.com/github/awesome-copilot/",
        shortDescriptions: ["社区共建的Copilot Agent与Skill定制资源库"],
      },
      {
        name: "MATLAB Agentic Toolkit",
        link: "https://github.com/matlab/matlab-agentic-toolkit/",
        shortDescriptions: ["让Agent精通MATLAB开发与调试"],
      },
      {
        name: "Modern Web Guidance",
        link: "https://github.com/googlechrome/modern-web-guidance/",
        shortDescriptions: ["引导编码Agent用现代Web平台写法，告别过时套路"],
      },
      {
        name: "Agent Skills for WordPress",
        link: "https://github.com/wordpress/agent-skills/",
        shortDescriptions: ["教AI Agent以正确方式开发WordPress"],
      },
      {
        name: "Gemini API 技能包",
        link: "https://github.com/google-gemini/gemini-skills/",
        shortDescriptions: ["官方技能包，让Agent写对Gemini API"],
      },
      {
        name: "Claude for Legal",
        link: "https://github.com/anthropics/claude-for-legal/",
        shortDescriptions: ["Claude官方法律工作流Agent与Skill套件"],
      },
      {
        name: "Google Agent Skills",
        link: "https://github.com/google/skills/",
        shortDescriptions: ["Google官方Agent Skill覆盖全线云产品"],
      },
      {
        name: "飞书 CLI",
        link: "https://github.com/larksuite/cli/",
        shortDescriptions: ["官方CLI让Agent操控飞书全生态"],
      },
      {
        name: "Knowledge Work Plugins",
        link: "https://github.com/anthropics/knowledge-work-plugins/",
        shortDescriptions: ["官方插件把Claude变成各岗位专家"],
      },
      {
        name: "Vercel Agent Skills",
        link: "https://github.com/vercel-labs/agent-skills/",
        shortDescriptions: ["Vercel官方技能包，精通Web开发最佳实践"],
      },
      {
        name: "Claude for Financial Services",
        link: "https://github.com/anthropics/financial-services/",
        shortDescriptions: ["覆盖金融业全流程的官方Agent技能包"],
      },
    ],
  },
];

export const totalAgentSkillsCount = agentSkillGroups.reduce(
  (acc, group) => acc + group.items.length,
  0,
);
