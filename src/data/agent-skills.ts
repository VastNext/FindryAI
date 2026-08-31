export interface AgentSkill {
  name: string;
  link: string;
  shortDescriptions: string[];
}

export interface AgentSkillGroup {
  mainCategory: string;
  slug: string;
  items: AgentSkill[];
}

export const agentSkillGroups: AgentSkillGroup[] = [
  {
    "mainCategory": "Agent Harness",
    "slug": "agent-harness",
    "items": [
      {
        "name": "Oh My Pi",
        "link": "https://github.com/can1357/oh-my-pi/",
        "shortDescriptions": [
          "A terminal coding Agent with the full IDE wired in."
        ]
      },
      {
        "name": "Goose",
        "link": "https://github.com/aaif-goose/goose/",
        "shortDescriptions": [
          "Local-first general-purpose AI Agent for desktop and CLI."
        ]
      },
      {
        "name": "DeepSeek Harness",
        "link": "https://github.com/deepseek-ai/deepseek-harness/",
        "shortDescriptions": [
          "Plugin-driven open-source Agent Harness where everything is a plugin."
        ]
      },
      {
        "name": "Reasonix",
        "link": "https://github.com/esengine/deepseek-reasonix/",
        "shortDescriptions": [
          "Multi-interface AI coding Agent compatible with any model"
        ]
      },
      {
        "name": "OpenWork",
        "link": "https://github.com/different-ai/openwork/",
        "shortDescriptions": [
          "Open-source Claude Cowork alternative for sharing AI workflows across tools and teams."
        ]
      },
      {
        "name": "Kiro Crew",
        "link": "https://github.com/kirodotdev/kirocrew/",
        "shortDescriptions": [
          "A self-improving Agent workspace that persists across sessions."
        ]
      },
      {
        "name": "Odysseus",
        "link": "https://github.com/pewdiepie-archdaemon/odysseus/",
        "shortDescriptions": [
          "Local-first all-in-one self-hosted AI Agent workspace."
        ]
      },
      {
        "name": "Kimi Code CLI",
        "link": "https://github.com/moonshotai/kimi-code/",
        "shortDescriptions": [
          "Single-binary Kimi coding Agent in your terminal"
        ]
      },
      {
        "name": "MiMo Code",
        "link": "https://github.com/xiaomimimo/mimo-code/",
        "shortDescriptions": [
          "Terminal-native coding where models and Agents co-evolve"
        ]
      },
      {
        "name": "Agentic Plugin Marketplace",
        "link": "https://github.com/wshobson/agents/",
        "shortDescriptions": [
          "Write once, generate native Agent plugins for every harness."
        ]
      },
      {
        "name": "Orca",
        "link": "https://github.com/stablyai/orca/",
        "shortDescriptions": [
          "Runs and compares multiple coding Agents in parallel worktrees."
        ]
      },
      {
        "name": "LibreChat",
        "link": "https://github.com/danny-avila/librechat/",
        "shortDescriptions": [
          "Open-source self-hosted platform unifying multiple AI models."
        ]
      },
      {
        "name": "Aider",
        "link": "https://github.com/aider-ai/aider/",
        "shortDescriptions": [
          "AI pair programming in your terminal with auto Git commits."
        ]
      },
      {
        "name": "Flowise",
        "link": "https://github.com/flowiseai/flowise/",
        "shortDescriptions": [
          "Build AI Agents and workflows visually by drag-and-drop"
        ]
      },
      {
        "name": "Cline",
        "link": "https://github.com/cline/cline/",
        "shortDescriptions": [
          "Open-source coding Agent across IDE and terminal."
        ]
      },
      {
        "name": "Oh My OpenAgent",
        "link": "https://github.com/code-yeongyu/oh-my-openagent/",
        "shortDescriptions": [
          "Orchestrates a team of Agents to tame complex codebases."
        ]
      },
      {
        "name": "Open Interpreter",
        "link": "https://github.com/openinterpreter/open-interpreter/",
        "shortDescriptions": [
          "Turns low-cost models into a code-running terminal Agent."
        ]
      },
      {
        "name": "DeerFlow",
        "link": "https://github.com/bytedance/deer-flow/",
        "shortDescriptions": [
          "Open-source super Agent orchestrating skills, sandboxes and memory."
        ]
      },
      {
        "name": "Pi",
        "link": "https://github.com/earendil-works/pi/",
        "shortDescriptions": [
          "Self-extensible multi-provider coding Agent harness."
        ]
      },
      {
        "name": "OpenHands (Agent Canvas)",
        "link": "https://github.com/all-hands-ai/openhands/",
        "shortDescriptions": [
          "Self-hosted control center orchestrating multiple coding Agents."
        ]
      },
      {
        "name": "Gemini CLI",
        "link": "https://github.com/google-gemini/gemini-cli/",
        "shortDescriptions": [
          "Open-source AI Agent that brings Gemini into your terminal."
        ]
      },
      {
        "name": "Dify",
        "link": "https://github.com/langgenius/dify/",
        "shortDescriptions": [
          "Visually build LLM apps with built-in RAG and Agent."
        ]
      },
      {
        "name": "Langflow",
        "link": "https://github.com/langflow-ai/langflow/",
        "shortDescriptions": [
          "Visually build and deploy AI Agents and workflows."
        ]
      },
      {
        "name": "Ollama",
        "link": "https://github.com/ollama/ollama/",
        "shortDescriptions": [
          "Run open-source LLMs locally with one command."
        ]
      },
      {
        "name": "LobeHub",
        "link": "https://github.com/lobehub/lobehub/",
        "shortDescriptions": [
          "Hire and schedule your AI team, with Agents running 24/7."
        ]
      },
      {
        "name": "OpenClaw",
        "link": "https://github.com/openclaw/openclaw/",
        "shortDescriptions": [
          "Local-first personal AI Agent that truly gets things done across 29 chat apps."
        ]
      },
      {
        "name": "Codex",
        "link": "https://github.com/openai/codex/",
        "shortDescriptions": [
          "OpenAI's coding Agent, from terminal to cloud."
        ]
      },
      {
        "name": "Multica",
        "link": "https://github.com/multica-ai/multica/",
        "shortDescriptions": [
          "Turns coding Agents into teammates you can assign tasks to."
        ]
      },
      {
        "name": "OpenCode",
        "link": "https://github.com/anomalyco/opencode/",
        "shortDescriptions": [
          "Open source terminal coding Agent supporting 75+ model providers."
        ]
      },
      {
        "name": "Hermes Agent",
        "link": "https://github.com/NousResearch/hermes-agent/",
        "shortDescriptions": [
          "An always-on Agent living in every chat app you use."
        ]
      },
      {
        "name": "Paperclip",
        "link": "https://github.com/paperclipai/paperclip/",
        "shortDescriptions": [
          "Run AI Agents like employees, with org charts and budgets."
        ]
      },
      {
        "name": "Claude Cowork",
        "link": "https://claude.com/product/cowork/",
        "shortDescriptions": [
          "Just state the goal; Claude runs the whole job across your tools."
        ]
      },
      {
        "name": "Nanobot",
        "link": "https://github.com/HKUDS/nanobot/",
        "shortDescriptions": [
          "A self-hosted personal Agent runtime with persistent memory."
        ]
      },
      {
        "name": "Manus Computer",
        "link": "https://manus.im/desktop/",
        "shortDescriptions": [
          "A desktop Agent that runs on your own computer, operating local files and workflows."
        ]
      },
      {
        "name": "Perplexity Computer",
        "link": "https://www.perplexity.ai/computer/new/",
        "shortDescriptions": [
          "A multi-model Agent that operates real software to finish long tasks."
        ]
      },
      {
        "name": "Kimi Claw",
        "link": "https://www.kimi.com/bot/",
        "shortDescriptions": [
          "One-click cloud OpenClaw, a 24/7 Agent with long-term memory."
        ]
      },
      {
        "name": "WorkBuddy",
        "link": "https://www.codebuddy.cn/work/",
        "shortDescriptions": [
          "AI-native desktop workspace where multiple Agents run office tasks in parallel."
        ]
      },
      {
        "name": "Genspark Claw",
        "link": "https://www.genspark.ai/claw/",
        "shortDescriptions": [
          "An AI employee with its own cloud computer, working 24/7 from your chat apps."
        ]
      }
    ]
  },
  {
    "mainCategory": "Vibe Coding",
    "slug": "vibe-coding",
    "items": [
      {
        "name": "Ponytail",
        "link": "https://github.com/DietrichGebert/ponytail/",
        "shortDescriptions": [
          "Makes coding Agents write less code, reusing before creating."
        ]
      },
      {
        "name": "Taskmaster",
        "link": "https://github.com/eyaltoledano/claude-task-master/",
        "shortDescriptions": [
          "Turns PRDs into structured tasks that drive AI coding"
        ]
      },
      {
        "name": "GitNexus",
        "link": "https://github.com/abhigyanpatwari/gitnexus/",
        "shortDescriptions": [
          "Builds a client-side code knowledge graph so Agents grasp the whole codebase."
        ]
      },
      {
        "name": "CodeGraph",
        "link": "https://github.com/colbymchenry/codegraph/",
        "shortDescriptions": [
          "Pre-indexed code knowledge graph that lets coding Agents grasp the codebase in one call."
        ]
      },
      {
        "name": "Agent Skills",
        "link": "https://github.com/addyosmani/agent-skills/",
        "shortDescriptions": [
          "Injects senior engineering practices into every phase of AI coding."
        ]
      },
      {
        "name": "Plannotator",
        "link": "https://github.com/backnotprop/plannotator/",
        "shortDescriptions": [
          "Annotate and review Agent plans before they execute."
        ]
      },
      {
        "name": "Understand Anything",
        "link": "https://github.com/Lum1104/Understand-Anything/",
        "shortDescriptions": [
          "Turns any codebase into an interactive knowledge graph."
        ]
      },
      {
        "name": "Skills For Real Engineers",
        "link": "https://github.com/mattpocock/skills/",
        "shortDescriptions": [
          "Engineering-fundamentals Skills that keep you in control of the Agent."
        ]
      },
      {
        "name": "Make Interfaces Feel Better",
        "link": "https://github.com/jakubkrehel/make-interfaces-feel-better/",
        "shortDescriptions": [
          "Polishes UI details until the interface feels right."
        ]
      },
      {
        "name": "Waza",
        "link": "https://github.com/tw93/Waza/",
        "shortDescriptions": [
          "Eight sharp Skills that turn engineering habits into commands."
        ]
      },
      {
        "name": "graphify",
        "link": "https://github.com/safishamsi/graphify/",
        "shortDescriptions": [
          "Turns codebases into fully local, queryable knowledge graphs."
        ]
      },
      {
        "name": "Compound Engineering",
        "link": "https://github.com/EveryInc/compound-engineering-plugin/",
        "shortDescriptions": [
          "31 skills that turn every coding session into compounding leverage."
        ]
      },
      {
        "name": "Spec Kit",
        "link": "https://github.com/github/spec-kit/",
        "shortDescriptions": [
          "Spec-driven development, write the spec before the code."
        ]
      },
      {
        "name": "OpenSpec",
        "link": "https://github.com/Fission-AI/OpenSpec/",
        "shortDescriptions": [
          "Spec-driven development that aligns you and AI before any code."
        ]
      },
      {
        "name": "AI Website Cloner Template",
        "link": "https://github.com/JCodesMore/ai-website-cloner-template/",
        "shortDescriptions": [
          "One command turns any URL into a clean Next.js codebase."
        ]
      },
      {
        "name": "gstack",
        "link": "https://github.com/garrytan/gstack/",
        "shortDescriptions": [
          "Garry Tan's 23-command software factory turns Claude Code into a full engineering team."
        ]
      },
      {
        "name": "Superpowers",
        "link": "https://github.com/obra/superpowers/",
        "shortDescriptions": [
          "A full software development methodology for coding Agents, built on composable Skills."
        ]
      },
      {
        "name": "MiniMax Skills",
        "link": "https://github.com/MiniMax-AI/skills/",
        "shortDescriptions": [
          "Production-grade dev Skills powered by MiniMax multimodal APIs."
        ]
      }
    ]
  },
  {
    "mainCategory": "Agent Boost",
    "slug": "agent-boost",
    "items": [
      {
        "name": "Context Mode",
        "link": "https://github.com/mksglu/context-mode/",
        "shortDescriptions": [
          "Sandboxes tool output to save 98% of the Agent's context."
        ]
      },
      {
        "name": "Old Coder",
        "link": "https://github.com/amazingang/old-coder/",
        "shortDescriptions": [
          "Trust AI code via evidence reports, not line-by-line review."
        ]
      },
      {
        "name": "I Have ADHD",
        "link": "https://github.com/ayghri/i-have-adhd/",
        "shortDescriptions": [
          "Reformats Agent replies to be direct and action-first."
        ]
      },
      {
        "name": "Loopy",
        "link": "https://github.com/forward-future/loop-library/",
        "shortDescriptions": [
          "Distills repeated work into reusable Agent loops."
        ]
      },
      {
        "name": "Council of High Intelligence",
        "link": "https://github.com/0xnyk/council-of-high-intelligence/",
        "shortDescriptions": [
          "Multiple AI personas debate to crack high-stakes decisions."
        ]
      },
      {
        "name": "Loop Engineering",
        "link": "https://github.com/cobusgreyling/loop-engineering/",
        "shortDescriptions": [
          "Design reusable loops to orchestrate AI coding Agents."
        ]
      },
      {
        "name": "PUA Skill",
        "link": "https://github.com/tanweai/pua/",
        "shortDescriptions": [
          "Pressures the Coding Agent to exhaust every fix and never quit."
        ]
      },
      {
        "name": "Headroom",
        "link": "https://github.com/chopratejas/headroom/",
        "shortDescriptions": [
          "Compresses agent context, same answers at a fraction of the tokens."
        ]
      },
      {
        "name": "Caveman",
        "link": "https://github.com/juliusbrussee/caveman/",
        "shortDescriptions": [
          "Compresses Agent output to save tokens without losing brains."
        ]
      },
      {
        "name": "ECC",
        "link": "https://github.com/affaan-m/ecc/",
        "shortDescriptions": [
          "Cross-harness Agent workflow OS that persists learned patterns"
        ]
      }
    ]
  },
  {
    "mainCategory": "Skill Workshop",
    "slug": "skill-workshop",
    "items": [
      {
        "name": "Skill Recorder",
        "link": "https://github.com/microsoft/skill-recorder/",
        "shortDescriptions": [
          "Records your screen work into reusable Agent Skills."
        ]
      },
      {
        "name": "Skills Best Practices",
        "link": "https://github.com/mgechev/skills-best-practices/",
        "shortDescriptions": [
          "Best-practice playbook for building professional Agent Skills."
        ]
      },
      {
        "name": "Book to Skill",
        "link": "https://github.com/virgiliojr94/book-to-skill/",
        "shortDescriptions": [
          "Distills books into on-demand Agent Skills, saving tokens."
        ]
      },
      {
        "name": "Agent Skill Creator",
        "link": "https://github.com/francyjglisboa/agent-skill-creator/",
        "shortDescriptions": [
          "Turns workflows into cross-platform Agent Skills."
        ]
      },
      {
        "name": "dot-skill",
        "link": "https://github.com/titanwings/colleague-skill/",
        "shortDescriptions": [
          "Distills anyone's persona and skills into an interactive AI Agent."
        ]
      },
      {
        "name": "Skills",
        "link": "https://github.com/vercel-labs/skills/",
        "shortDescriptions": [
          "One CLI to install and manage Skills across 75+ AI Agents."
        ]
      },
      {
        "name": "Nuwa Skill",
        "link": "https://github.com/alchaincyf/nuwa-skill/",
        "shortDescriptions": [
          "Distills how notable minds think into runnable Agent Skills."
        ]
      },
      {
        "name": "Teammate Skill",
        "link": "https://github.com/LeoYeAI/teammate-skill/",
        "shortDescriptions": [
          "Turns a departing teammate's expertise and style into a reusable Skill."
        ]
      },
      {
        "name": "Cangjie Skill",
        "link": "https://github.com/kangarooking/cangjie-skill/",
        "shortDescriptions": [
          "Distills books, videos and podcasts into executable Agent Skills."
        ]
      },
      {
        "name": "Writing Great Skills",
        "link": "https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills/",
        "shortDescriptions": [
          "A design framework for writing predictable Agent Skills."
        ]
      },
      {
        "name": "Darwin Skill",
        "link": "https://github.com/alchaincyf/darwin-skill/",
        "shortDescriptions": [
          "Lets Agent Skills evolve themselves, scores only go up."
        ]
      },
      {
        "name": "Yao Meta Skill",
        "link": "https://github.com/yaojingang/yao-meta-skill/",
        "shortDescriptions": [
          "Full-lifecycle engineering system for Agent Skills: build, evaluate, package, govern."
        ]
      },
      {
        "name": "Dao · Skill",
        "link": "https://github.com/gnipbao/dao-skill/",
        "shortDescriptions": [
          "Refines vague needs into evolvable Agent Skills with Daoist wisdom."
        ]
      },
      {
        "name": "Skills Hub",
        "link": "https://github.com/qufei1993/skills-hub/",
        "shortDescriptions": [
          "Install skills once, sync to all AI coding tools."
        ]
      }
    ]
  },
  {
    "mainCategory": "PPT & Presentations",
    "slug": "ppt-presentations",
    "items": [
      {
        "name": "Open Kimi PPT Skill",
        "link": "https://github.com/binaryify/open-kimi-ppt-skill/",
        "shortDescriptions": [
          "Reverse-engineers Kimi Slides, letting Agents ship editable PPT."
        ]
      },
      {
        "name": "Beautiful HTML Templates",
        "link": "https://github.com/zarazhangrui/beautiful-html-templates/",
        "shortDescriptions": [
          "34 curated HTML deck templates for Agents to build slides."
        ]
      },
      {
        "name": "Gorden Super PPT Skills",
        "link": "https://github.com/gordensun/gordensuperpptskills/",
        "shortDescriptions": [
          "Generates lavish image slides and converts them into editable PPTX."
        ]
      },
      {
        "name": "HTML PPT Studio",
        "link": "https://github.com/lewislulu/html-ppt-skill/tree/main/",
        "shortDescriptions": [
          "Build pro HTML decks with ready-made themes, layouts and effects"
        ]
      },
      {
        "name": "Dashi PPT Skill",
        "link": "https://github.com/chuspeeism/dashi-ppt-skill/",
        "shortDescriptions": [
          "Turns documents into browser-editable decks, exports to PPTX."
        ]
      },
      {
        "name": "open-slide",
        "link": "https://github.com/1weiho/open-slide/",
        "shortDescriptions": [
          "Agent-native slide framework, from a sentence to a React deck."
        ]
      },
      {
        "name": "PPT Master",
        "link": "https://github.com/hugohe3/ppt-master/",
        "shortDescriptions": [
          "Turns documents into fully editable native PowerPoint decks."
        ]
      },
      {
        "name": "Magazine Web PPT",
        "link": "https://github.com/op7418/guizang-ppt-skill/",
        "shortDescriptions": [
          "Turns ideas into single-file HTML decks with magazine and Swiss design systems."
        ]
      },
      {
        "name": "Frontend Slides",
        "link": "https://github.com/zarazhangrui/frontend-slides/",
        "shortDescriptions": [
          "Turns ideas or PPTs into single-file HTML decks."
        ]
      },
      {
        "name": "PPT Design Skill",
        "link": "https://github.com/sunchaokun/ppt-design-skill/",
        "shortDescriptions": [
          "Design-driven generation of professional editable PPTX."
        ]
      }
    ]
  },
  {
    "mainCategory": "Design & UI",
    "slug": "design-ui",
    "items": [
      {
        "name": "Craft Skills",
        "link": "https://github.com/zseven-w/craft-skills/",
        "shortDescriptions": [
          "Evaluation-driven Skills for creative design."
        ]
      },
      {
        "name": "Dembrandt",
        "link": "https://github.com/dembrandt/dembrandt/",
        "shortDescriptions": [
          "Extracts any website's design system into tokens in seconds."
        ]
      },
      {
        "name": "Motion Design Skill",
        "link": "https://github.com/lottiefiles/motion-design-skill/",
        "shortDescriptions": [
          "Teaches Agents the philosophy and craft of UI motion design."
        ]
      },
      {
        "name": "IP as Logo",
        "link": "https://github.com/s1dashu/ip-as-logo-skill/",
        "shortDescriptions": [
          "Turns IP characters into minimalist mascot logos."
        ]
      },
      {
        "name": "ReadyDesign Skill",
        "link": "https://github.com/zethrise/readydesign-skill/",
        "shortDescriptions": [
          "Forces Agents to build UIs from official component libraries."
        ]
      },
      {
        "name": "Photo Relic Editorial",
        "link": "https://github.com/wnby/photo-relic-editorial/",
        "shortDescriptions": [
          "Turns photos into Eastern printmaking art, real on top and stylized below"
        ]
      },
      {
        "name": "Mengto Skills",
        "link": "https://github.com/mengto/skills/",
        "shortDescriptions": [
          "Design and web-building Skill library for AI Agents."
        ]
      },
      {
        "name": "GC Minimal Zine Poster",
        "link": "https://github.com/liamgvchi/gc-minimal-zine-poster/",
        "shortDescriptions": [
          "Turns any idea into minimal editorial zine posters."
        ]
      },
      {
        "name": "img2threejs",
        "link": "https://github.com/img2threejs/img2threejs/",
        "shortDescriptions": [
          "Reconstructs reference images into animation-ready Three.js code models."
        ]
      },
      {
        "name": "Gathered Scenes Zine",
        "link": "https://github.com/zeejay0/gathered-scenes-zine-skill/",
        "shortDescriptions": [
          "Distills photos into paper-textured collage zine posters."
        ]
      },
      {
        "name": "Transitions.dev",
        "link": "https://github.com/jakubantalik/transitions.dev/",
        "shortDescriptions": [
          "Reusable CSS transitions library, applied by Agents in one click."
        ]
      },
      {
        "name": "Scroll World",
        "link": "https://github.com/oso95/scroll-world/",
        "shortDescriptions": [
          "Scroll to fly through AI-generated immersive 3D landing pages."
        ]
      },
      {
        "name": "ECommerce Details Image Generator",
        "link": "https://github.com/liangdabiao/ecom-details-image/",
        "shortDescriptions": [
          "One product photo into a full e-commerce visual suite"
        ]
      },
      {
        "name": "Beautify GitHub README",
        "link": "https://github.com/oil-oil/beautify-github-readme/",
        "shortDescriptions": [
          "Crafts professional visual README homepages for GitHub repos."
        ]
      },
      {
        "name": "Claude Design System Prompt",
        "link": "https://github.com/trystan-sa/claude-design-system-prompt/",
        "shortDescriptions": [
          "System prompt that turns any LLM into an accessibility-aware design collaborator, resisting AI-slop."
        ]
      },
      {
        "name": "Better Interface Skills",
        "link": "https://github.com/jakubkrehel/skills/",
        "shortDescriptions": [
          "A suite of Agent Skills to polish every facet of your interface."
        ]
      },
      {
        "name": "DESIGN.md",
        "link": "https://github.com/google-labs-code/design.md/",
        "shortDescriptions": [
          "A format that lets Agents read and apply design systems consistently."
        ]
      },
      {
        "name": "Awesome Design.md",
        "link": "https://github.com/voltagent/awesome-design-md/",
        "shortDescriptions": [
          "Brand DESIGN.md files for Agents to replicate consistent UI"
        ]
      },
      {
        "name": "UI UX Pro Max Skill",
        "link": "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/",
        "shortDescriptions": [
          "AI reasoning generates complete UI/UX design systems."
        ]
      },
      {
        "name": "Hallmark",
        "link": "https://github.com/nutlope/hallmark/",
        "shortDescriptions": [
          "Generates website UI that doesn't look AI-made."
        ]
      },
      {
        "name": "Skills For Design Engineers",
        "link": "https://github.com/emilkowalski/skills/",
        "shortDescriptions": [
          "Injects seasoned motion design judgment into AI-built UI."
        ]
      },
      {
        "name": "Huashu Design",
        "link": "https://github.com/alchaincyf/huashu-design/",
        "shortDescriptions": [
          "One sentence turns into clickable prototypes, decks and animations."
        ]
      },
      {
        "name": "Web Shader Extractor",
        "link": "https://github.com/lixiaolin94/skills/tree/main/web-shader-extractor/",
        "shortDescriptions": [
          "Extracts webpage WebGL and shader effects into editable local projects."
        ]
      },
      {
        "name": "Claude Design",
        "link": "https://claude.com/plugins/design/",
        "shortDescriptions": [
          "Official Anthropic plugin covering design review, UX writing, accessibility audits and handoff."
        ]
      },
      {
        "name": "baoyu-design",
        "link": "https://github.com/JimLiu/baoyu-design/",
        "shortDescriptions": [
          "Runs Claude Design locally, turning any coding Agent into a design studio."
        ]
      },
      {
        "name": "Garden Skills",
        "link": "https://github.com/ConardLi/garden-skills/",
        "shortDescriptions": [
          "Production-grade Agent Skills for design, video, image and articles."
        ]
      },
      {
        "name": "Frontend Design Skill",
        "link": "https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md/",
        "shortDescriptions": [
          "Breaks AI's templated look, makes UI distinctive."
        ]
      },
      {
        "name": "Open Design",
        "link": "https://github.com/nexu-io/open-design/",
        "shortDescriptions": [
          "Turns coding Agents into brand-grade design engines."
        ]
      },
      {
        "name": "Naksha",
        "link": "https://github.com/Adityaraj0421/naksha-studio/",
        "shortDescriptions": [
          "A 26-specialist virtual design team living in your code editor."
        ]
      },
      {
        "name": "Taste Skill",
        "link": "https://github.com/Leonxlnx/taste-skill/",
        "shortDescriptions": [
          "Gives AI-generated frontends real design taste."
        ]
      },
      {
        "name": "Kami",
        "link": "https://github.com/tw93/kami/",
        "shortDescriptions": [
          "A document design system that makes Agent output print-ready."
        ]
      },
      {
        "name": "design-dna",
        "link": "https://github.com/zanwei/design-dna/",
        "shortDescriptions": [
          "Extracts a UI's design DNA into JSON, then rebuilds new interfaces from it."
        ]
      },
      {
        "name": "nano-banana-pro-prompts-recommend-skill",
        "link": "https://github.com/YouMind-OpenLab/nano-banana-pro-prompts-recommend-skill/",
        "shortDescriptions": [
          "Semantic search across 10,000+ Nano Banana Pro prompts with sample previews."
        ]
      },
      {
        "name": "Impeccable",
        "link": "https://github.com/pbakaus/impeccable/",
        "shortDescriptions": [
          "A design language for AI coding Agents that kills AI slop."
        ]
      },
      {
        "name": "Refactoring UI Skill",
        "link": "https://github.com/s0xdk/refactoring-ui-skill/",
        "shortDescriptions": [
          "Codifies Refactoring UI rules into pro-grade design decisions"
        ]
      },
      {
        "name": "Monocolor Editorial Print",
        "link": "https://github.com/yanliudesign/mono-color-skill/",
        "shortDescriptions": [
          "Limited-ink print aesthetics for editorial posters and zines."
        ]
      }
    ]
  },
  {
    "mainCategory": "Video & Animation",
    "slug": "video-animation",
    "items": [
      {
        "name": "Director",
        "link": "https://github.com/s1dashu/director/",
        "shortDescriptions": [
          "Directs end-to-end video production from concept to final cut."
        ]
      },
      {
        "name": "Oil Motion",
        "link": "https://github.com/oil-oil/oil-motion/",
        "shortDescriptions": [
          "Turns AI video into scroll-driven interactive web animations"
        ]
      },
      {
        "name": "Animated Voiceover",
        "link": "https://github.com/s1dashu/animated-voiceover/",
        "shortDescriptions": [
          "Turns knowledge concepts into style-consistent animated explainer videos."
        ]
      },
      {
        "name": "Video ShotCraft",
        "link": "https://github.com/Vincentwei1021/video-shotcraft/",
        "shortDescriptions": [
          "Turns your Agent into a studio for cinematic product videos."
        ]
      },
      {
        "name": "Novel Characters",
        "link": "https://github.com/eternityspring/shuohao-skills/",
        "shortDescriptions": [
          "Turns novels into complete character bibles."
        ]
      },
      {
        "name": "Img2Three.js",
        "link": "https://github.com/hoainho/img2threejs/",
        "shortDescriptions": [
          "Rebuilds a photo into an animation-ready procedural Three.js model."
        ]
      },
      {
        "name": "MiniMax H3 Skills",
        "link": "https://github.com/minimax-ai/minimax-h3/tree/main/skills/",
        "shortDescriptions": [
          "Structured prompts driving H3 multi-style video generation."
        ]
      },
      {
        "name": "JZSub",
        "link": "https://github.com/pengchujin/jzsub/",
        "shortDescriptions": [
          "Downloads videos and burns in bilingual subtitles."
        ]
      },
      {
        "name": "Seedance 2.0 Skill OS",
        "link": "https://github.com/emily2040/seedance-2.0/",
        "shortDescriptions": [
          "Direct Seedance 2.0 video like a filmmaker, not a prompter."
        ]
      },
      {
        "name": "Claude Video",
        "link": "https://github.com/bradautomates/claude-video/",
        "shortDescriptions": [
          "Lets Claude truly watch videos via frames and transcript."
        ]
      },
      {
        "name": "Video Use",
        "link": "https://github.com/browser-use/video-use/",
        "shortDescriptions": [
          "Lets Agents edit raw footage into finished video via natural language."
        ]
      },
      {
        "name": "HyperFrames",
        "link": "https://github.com/heygen-com/hyperframes/",
        "shortDescriptions": [
          "Write HTML, render deterministic video, built for Agents"
        ]
      },
      {
        "name": "OpenMontage",
        "link": "https://github.com/calesthio/openmontage/",
        "shortDescriptions": [
          "Agent turns coding assistants into a video studio with real footage."
        ]
      },
      {
        "name": "Gbro Collage B-roll",
        "link": "https://github.com/pyang5166/gbro-collage-broll/",
        "shortDescriptions": [
          "Turns voiceover scripts into halftone paper-collage B-roll."
        ]
      },
      {
        "name": "BaoCut",
        "link": "https://github.com/jimliu/baocut/",
        "shortDescriptions": [
          "Transcribe, subtitle and cut video by talking to your Agent."
        ]
      },
      {
        "name": "Remotion",
        "link": "https://github.com/remotion-dev/skills/",
        "shortDescriptions": [
          "Official Remotion skills that let Agents code and render videos with React."
        ]
      },
      {
        "name": "Text-to-Lottie",
        "link": "https://github.com/diffusionstudio/lottie/",
        "shortDescriptions": [
          "Turns text prompts into production-ready Lottie animations, with live preview."
        ]
      },
      {
        "name": "html-video",
        "link": "https://github.com/nexu-io/html-video/",
        "shortDescriptions": [
          "Turns HTML into MP4 videos locally, driven by your Agent."
        ]
      },
      {
        "name": "GSAP AI Skills",
        "link": "https://github.com/greensock/gsap-skills/",
        "shortDescriptions": [
          "Official GSAP skills that teach Agents to write correct animation code."
        ]
      },
      {
        "name": "Promo BGM",
        "link": "https://github.com/whyubel1eve/promo-bgm-skill/",
        "shortDescriptions": [
          "Code-synthesized royalty-free BGM aligned to your video cuts."
        ]
      },
      {
        "name": "RN Human Motion Extractor",
        "link": "https://github.com/pluviobyte/rnskill/tree/main/skills/rn-human-motion-extractor/",
        "shortDescriptions": [
          "Extracts anonymized body and hand motion from video into reusable animation data."
        ]
      }
    ]
  },
  {
    "mainCategory": "Writing & Copy",
    "slug": "writing-copy",
    "items": [
      {
        "name": "Rainman Translate Book",
        "link": "https://github.com/deusyu/translate-book/",
        "shortDescriptions": [
          "Parallel Agents translate whole books, consistent terms multi-format output"
        ]
      },
      {
        "name": "Human Writing",
        "link": "https://github.com/kkkkhazix/human-writing/",
        "shortDescriptions": [
          "Strips AI tone so writing reads like a real person."
        ]
      },
      {
        "name": "Resume Skills for Claude Code",
        "link": "https://github.com/paramchoudhary/resumeskills/",
        "shortDescriptions": [
          "20 Skills to optimize resumes and land jobs."
        ]
      },
      {
        "name": "Hook Generator",
        "link": "https://github.com/charlie947/social-media-skills/tree/main/skills/hook-generator/",
        "shortDescriptions": [
          "Instantly generates six punchy LinkedIn hooks."
        ]
      },
      {
        "name": "No AI Slop",
        "link": "https://github.com/petergyang/no-ai-slop/",
        "shortDescriptions": [
          "Strips AI writing tics while keeping your real voice."
        ]
      },
      {
        "name": "Stop Slop",
        "link": "https://github.com/hardikpandya/stop-slop/",
        "shortDescriptions": [
          "Strips AI tells from prose for human-sounding writing."
        ]
      },
      {
        "name": "Humanizer",
        "link": "https://github.com/blader/humanizer/",
        "shortDescriptions": [
          "Strips AI writing tells so text reads human."
        ]
      },
      {
        "name": "Internal Comms",
        "link": "https://github.com/anthropics/skills/tree/main/skills/internal-comms/",
        "shortDescriptions": [
          "Writes internal updates in your company's templates and tone."
        ]
      },
      {
        "name": "avoid-ai-writing",
        "link": "https://github.com/conorbronsdon/avoid-ai-writing/",
        "shortDescriptions": [
          "Detects and rewrites AI-isms to make writing sound human."
        ]
      },
      {
        "name": "baoyu-skills",
        "link": "https://github.com/JimLiu/baoyu-skills/",
        "shortDescriptions": [
          "20+ content creation Skills, install only what you need."
        ]
      },
      {
        "name": "Sepia",
        "link": "https://github.com/nanako0129/sepia/",
        "shortDescriptions": [
          "Removes AI writing traces at the structural level."
        ]
      }
    ]
  },
  {
    "mainCategory": "Documents & Sheets",
    "slug": "documents-sheets",
    "items": [
      {
        "name": "Watermarks Remover",
        "link": "https://github.com/guillaumemeyer/watermarks-remover/",
        "shortDescriptions": [
          "Strips AI watermarks and metadata from text and files."
        ]
      },
      {
        "name": "KY Markdown Rebuilder",
        "link": "https://github.com/kyriecheungyep/ky-markdown-rebuilder/",
        "shortDescriptions": [
          "Rebuilds complex documents into page-aligned Markdown."
        ]
      },
      {
        "name": "LaTeX Document Skill",
        "link": "https://github.com/ndpvt-web/latex-document-skill/",
        "shortDescriptions": [
          "Turns plain English into publication-ready LaTeX PDFs."
        ]
      },
      {
        "name": "Huashu MD-HTML",
        "link": "https://github.com/alchaincyf/huashu-md-html/",
        "shortDescriptions": [
          "Markdown as source, publish-grade HTML and DOCX in one step."
        ]
      },
      {
        "name": "OfficeCLI",
        "link": "https://github.com/iofficeai/officecli/",
        "shortDescriptions": [
          "Lets Agents create and edit Word Excel PowerPoint files."
        ]
      },
      {
        "name": "effective-html",
        "link": "https://github.com/plannotator/effective-html/",
        "shortDescriptions": [
          "Turns Agent output into elegant single-file HTML deliverables."
        ]
      },
      {
        "name": "SenseNova-Skills",
        "link": "https://github.com/OpenSenseNova/SenseNova-Skills/",
        "shortDescriptions": [
          "SenseNova-powered office Skills spanning slides, data, and research."
        ]
      },
      {
        "name": "HTML Anything",
        "link": "https://github.com/nexu-io/html-anything/",
        "shortDescriptions": [
          "Turns local coding Agents into an HTML deliverable factory."
        ]
      },
      {
        "name": "MarkItDown",
        "link": "https://github.com/microsoft/markitdown/",
        "shortDescriptions": [
          "Converts any document into LLM-ready Markdown."
        ]
      },
      {
        "name": "QMD",
        "link": "https://github.com/tobi/qmd/",
        "shortDescriptions": [
          "A fully local hybrid search engine for your Markdown knowledge base."
        ]
      }
    ]
  },
  {
    "mainCategory": "Diagrams & Charts",
    "slug": "diagrams-charts",
    "items": [
      {
        "name": "Pretty-Mermaid Skills",
        "link": "https://github.com/imxv/pretty-mermaid-skills/",
        "shortDescriptions": [
          "Renders Mermaid code into beautifully themed diagrams."
        ]
      },
      {
        "name": "Chart Visualization Skills (AntV)",
        "link": "https://github.com/antvis/chart-visualization-skills/",
        "shortDescriptions": [
          "Turns data into pro charts, powered by the AntV ecosystem"
        ]
      },
      {
        "name": "Tufte Skill",
        "link": "https://github.com/aref-vc/tufte-claude-skill/",
        "shortDescriptions": [
          "Redesigns charts by Tufte principles for minimal high-density visuals."
        ]
      },
      {
        "name": "Lieflat Charts",
        "link": "https://github.com/larashero3-dotcom/lieflat-charts/",
        "shortDescriptions": [
          "Turns data into editorial-quality interactive charts."
        ]
      },
      {
        "name": "Draw.io Skill",
        "link": "https://github.com/agents365-ai/drawio-skill/",
        "shortDescriptions": [
          "Turns natural language, code and schemas into pro draw.io diagrams."
        ]
      },
      {
        "name": "Visual Explainer",
        "link": "https://github.com/nicobailon/visual-explainer/",
        "shortDescriptions": [
          "Turns terminal output into visual HTML pages and slides."
        ]
      },
      {
        "name": "Draw.io Scientific Illustrator",
        "link": "https://github.com/icebird1998/drawio-scientific-illustrator/",
        "shortDescriptions": [
          "Lets Agents draw scientific figures live on the draw.io canvas."
        ]
      },
      {
        "name": "CAD Skills",
        "link": "https://github.com/earthtojake/text-to-cad/",
        "shortDescriptions": [
          "Generates and manages CAD models and robotics files from natural language."
        ]
      },
      {
        "name": "GiMi Illustration",
        "link": "https://github.com/GiMi-Xiaomi/gimi-illustration-skill/",
        "shortDescriptions": [
          "Turns articles into hand-drawn illustrations with a consistent IP character."
        ]
      },
      {
        "name": "Archify",
        "link": "https://github.com/tt-a1i/archify/",
        "shortDescriptions": [
          "Turns plain descriptions into interactive architecture diagrams."
        ]
      },
      {
        "name": "Diagram Design",
        "link": "https://github.com/cathrynlavery/diagram-design/",
        "shortDescriptions": [
          "Generates editorial-grade diagrams in 27 types with your own brand style."
        ]
      },
      {
        "name": "Architecture Diagram Generator",
        "link": "https://github.com/Cocoon-AI/architecture-diagram-generator/",
        "shortDescriptions": [
          "Turns a plain-text description into a shareable architecture diagram."
        ]
      },
      {
        "name": "fireworks-tech-graph",
        "link": "https://github.com/yizhiyanhua-ai/fireworks-tech-graph/",
        "shortDescriptions": [
          "Turns plain descriptions into production-grade technical diagrams."
        ]
      }
    ]
  },
  {
    "mainCategory": "Marketing & Growth",
    "slug": "marketing-growth",
    "items": [
      {
        "name": "RN Skills",
        "link": "https://github.com/pluviobyte/rnskill/",
        "shortDescriptions": [
          "Full-stack new-media content production Skill collection"
        ]
      },
      {
        "name": "TikTok Agent Skills",
        "link": "https://github.com/aronhy/tiktok-agent-skills/",
        "shortDescriptions": [
          "Automates TikTok Shop selection, growth, lead gen and ads end-to-end."
        ]
      },
      {
        "name": "OpenSEO",
        "link": "https://github.com/every-app/open-seo/",
        "shortDescriptions": [
          "Open-source SEO platform, a Semrush and Ahrefs alternative"
        ]
      },
      {
        "name": "Codex First Customer Finder Skill",
        "link": "https://github.com/kappaemme-git/codex-first-customer-finder-skill/",
        "shortDescriptions": [
          "Turns a startup URL into an evidence-backed shortlist of first customers with outreach drafts."
        ]
      },
      {
        "name": "Claude SEO",
        "link": "https://github.com/agricidaniel/claude-seo/",
        "shortDescriptions": [
          "Multi-Agent parallel SEO audits with falsifiable fixes"
        ]
      },
      {
        "name": "Yao GEO Skills",
        "link": "https://github.com/yaojingang/yao-geo-skills/",
        "shortDescriptions": [
          "21 Skills covering the full GEO workflow, delivering client-ready reports."
        ]
      },
      {
        "name": "SEO Machine",
        "link": "https://github.com/TheCraigHewitt/seomachine/",
        "shortDescriptions": [
          "From keyword research to publishing, a full-stack SEO long-form content workspace."
        ]
      },
      {
        "name": "seo-audit-skill",
        "link": "https://github.com/JeffLi1993/seo-audit-skill/",
        "shortDescriptions": [
          "One URL in, a full SEO audit report out."
        ]
      },
      {
        "name": "Claude Ads",
        "link": "https://github.com/AgriciDaniel/claude-ads/",
        "shortDescriptions": [
          "Audits, plans and monitors paid media across 12 ad channels."
        ]
      },
      {
        "name": "Marketing Skills for AI Agents",
        "link": "https://github.com/coreyhaines31/marketingskills/",
        "shortDescriptions": [
          "60+ marketing Skills that turn any Agent into a growth expert."
        ]
      }
    ]
  },
  {
    "mainCategory": "Product & Business",
    "slug": "product-business",
    "items": [
      {
        "name": "OPC Skills",
        "link": "https://github.com/resciencelab/opc-skills/",
        "shortDescriptions": [
          "AI Agent Skills for solopreneurs and one-person companies."
        ]
      },
      {
        "name": "Startup Skill",
        "link": "https://github.com/ferdinandobons/startup-skill/",
        "shortDescriptions": [
          "Delivers consultant-grade startup strategy, validation and pitches via Agents."
        ]
      },
      {
        "name": "Product Teardown Skill",
        "link": "https://github.com/yanliudesign/product-teardown-skill/",
        "shortDescriptions": [
          "Reverse-engineers any product as a system into bilingual reports."
        ]
      },
      {
        "name": "Shopify Admin Skills",
        "link": "https://github.com/40rty-ai/shopify-admin-skills/",
        "shortDescriptions": [
          "Agent Skills and routines to run your Shopify store."
        ]
      },
      {
        "name": "Vibe Check",
        "link": "https://github.com/texasbedouin/vibe-check/",
        "shortDescriptions": [
          "Turns vague ideas into buildable product blueprints before coding."
        ]
      },
      {
        "name": "DBSkill",
        "link": "https://github.com/dontbesilent2025/dbskill/",
        "shortDescriptions": [
          "Distills real-world business experience into on-call diagnosis Skills."
        ]
      },
      {
        "name": "PM Skills Marketplace",
        "link": "https://github.com/phuryn/pm-skills/",
        "shortDescriptions": [
          "100+ product management Skills covering discovery to growth."
        ]
      },
      {
        "name": "The Minimalist Entrepreneur",
        "link": "https://github.com/slavingia/skills/",
        "shortDescriptions": [
          "Ten Skills that walk founders from community to sustainable growth."
        ]
      },
      {
        "name": "Product Manager Skills",
        "link": "https://github.com/deanpeters/Product-Manager-Skills/",
        "shortDescriptions": [
          "70 battle-tested PM methodologies, ready as Agent Skills."
        ]
      },
      {
        "name": "MakerSkills",
        "link": "https://github.com/coreyhaines31/makerskills/",
        "shortDescriptions": [
          "Agent Skills bundle for founders, covering decisions, research and ops."
        ]
      },
      {
        "name": "PM-Skills",
        "link": "https://github.com/product-on-purpose/pm-skills/",
        "shortDescriptions": [
          "68 PM skills covering the full product lifecycle for AI agents"
        ]
      }
    ]
  },
  {
    "mainCategory": "Research & Learning",
    "slug": "research-learning",
    "items": [
      {
        "name": "ELI5",
        "link": "https://github.com/anthropics/claude-plugins-community/tree/main/eli5/",
        "shortDescriptions": [
          "Explains any topic like you're five with visual HTML."
        ]
      },
      {
        "name": "Claude Scholar",
        "link": "https://github.com/galaxy-dawn/claude-scholar/",
        "shortDescriptions": [
          "A research Agent spanning the full academic workflow."
        ]
      },
      {
        "name": "Paper Craft Skills",
        "link": "https://github.com/zsyggg/paper-craft-skills/",
        "shortDescriptions": [
          "Turns papers into figures, decks and deep-dive articles."
        ]
      },
      {
        "name": "Yao Expert Skill",
        "link": "https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-expert-skill/",
        "shortDescriptions": [
          "Turns any field into a structured expert learning package."
        ]
      },
      {
        "name": "Hyperresearch",
        "link": "https://github.com/jordan-gibbs/hyperresearch/",
        "shortDescriptions": [
          "Deep research Agent that fact-checks sources into traceable reports."
        ]
      },
      {
        "name": "Perplexity MCP Server",
        "link": "https://github.com/perplexityai/modelcontextprotocol/",
        "shortDescriptions": [
          "Gives Agents real-time Perplexity web search and research."
        ]
      },
      {
        "name": "Supervisor Skills",
        "link": "https://github.com/hkustdial/supervisor-skills/",
        "shortDescriptions": [
          "Turns a mentor's research experience into callable Agent Skills."
        ]
      },
      {
        "name": "Codebase to Course",
        "link": "https://github.com/zarazhangrui/codebase-to-course/",
        "shortDescriptions": [
          "Turns any codebase into an interactive learning course."
        ]
      },
      {
        "name": "Anything to NotebookLM",
        "link": "https://github.com/joeseesun/qiaomu-anything-to-notebooklm/",
        "shortDescriptions": [
          "Feeds any content, even paywalled, into NotebookLM"
        ]
      },
      {
        "name": "Research Paper Writing Skills",
        "link": "https://github.com/master-cai/research-paper-writing-skills/",
        "shortDescriptions": [
          "Section-by-section academic paper polishing with reviewer-perspective self-review."
        ]
      },
      {
        "name": "ARS-Codex",
        "link": "https://github.com/imbad0202/academic-research-skills-codex/",
        "shortDescriptions": [
          "End-to-end academic research skills from literature review to peer review."
        ]
      },
      {
        "name": "NotebookLM-py",
        "link": "https://github.com/teng-lin/notebooklm-py/",
        "shortDescriptions": [
          "Full programmatic NotebookLM control via Python, CLI, and Agents."
        ]
      },
      {
        "name": "DeepTutor",
        "link": "https://github.com/hkuds/deeptutor/",
        "shortDescriptions": [
          "Agent-native, one engine across all learning scenarios"
        ]
      },
      {
        "name": "Scientific Agent Skills",
        "link": "https://github.com/k-dense-ai/scientific-agent-skills/",
        "shortDescriptions": [
          "158 skills that turn Agents into biomedical research assistants."
        ]
      },
      {
        "name": "Nature Skills",
        "link": "https://github.com/yuan1z0825/nature-skills/",
        "shortDescriptions": [
          "Full-cycle research Skills for Nature-grade, ready-to-use outputs."
        ]
      },
      {
        "name": "Teach",
        "link": "https://github.com/mattpocock/skills/tree/main/skills/productivity/teach/",
        "shortDescriptions": [
          "Turns your Agent into a stateful multi-session personal tutor."
        ]
      },
      {
        "name": "Academic Research Skills",
        "link": "https://github.com/Imbad0202/academic-research-skills/",
        "shortDescriptions": [
          "Multi-Agent pipeline covering research, writing, peer review and revision."
        ]
      },
      {
        "name": "AI Research Skills Library",
        "link": "https://github.com/Orchestra-Research/AI-Research-SKILLs/",
        "shortDescriptions": [
          "98 skills letting Agents run AI research end to end."
        ]
      },
      {
        "name": "last30days",
        "link": "https://github.com/mvanhorn/last30days-skill/",
        "shortDescriptions": [
          "Agent-led search across social platforms, ranked by real engagement."
        ]
      }
    ]
  },
  {
    "mainCategory": "Web & Automation",
    "slug": "web-automation",
    "items": [
      {
        "name": "Ego Lite",
        "link": "https://github.com/citrolabs/ego-lite/",
        "shortDescriptions": [
          "The fastest browser for AI Agents, sharing your logged-in state without disturbing you."
        ]
      },
      {
        "name": "Peekaboo",
        "link": "https://github.com/openclaw/peekaboo/",
        "shortDescriptions": [
          "Lets AI Agents see the screen and control macOS."
        ]
      },
      {
        "name": "n8n-MCP",
        "link": "https://github.com/czlonkowski/n8n-mcp/",
        "shortDescriptions": [
          "Lets AI build n8n workflows accurately."
        ]
      },
      {
        "name": "Browser Use",
        "link": "https://github.com/browser-use/browser-use/",
        "shortDescriptions": [
          "Lets AI Agents autonomously control browsers to get tasks done."
        ]
      },
      {
        "name": "n8n",
        "link": "https://github.com/n8n-io/n8n/",
        "shortDescriptions": [
          "Visually build AI Agents and automation workflows."
        ]
      },
      {
        "name": "Skyvern",
        "link": "https://github.com/Skyvern-AI/skyvern/",
        "shortDescriptions": [
          "Vision LLM Agents that automate browser workflows without brittle selectors."
        ]
      },
      {
        "name": "OpenConnector",
        "link": "https://github.com/oomol-lab/open-connector/",
        "shortDescriptions": [
          "Auth gateway letting Agents reach 1,000+ SaaS apps without touching credentials."
        ]
      },
      {
        "name": "BrowserAct",
        "link": "https://github.com/browser-act/skills/",
        "shortDescriptions": [
          "Stealth browsers that let Agents break through any blocking"
        ]
      },
      {
        "name": "Browserbase",
        "link": "https://browse.sh/",
        "shortDescriptions": [
          "A browser CLI for agents with 500+ open web skills."
        ]
      },
      {
        "name": "Kimi WebBridge",
        "link": "https://www.kimi.com/features/webbridge/",
        "shortDescriptions": [
          "Lets Agents drive your own browser, all local."
        ]
      },
      {
        "name": "AnySearch",
        "link": "https://github.com/anysearch-ai/anysearch-skill/",
        "shortDescriptions": [
          "One-call API key, giving Agents real-time web and vertical search."
        ]
      },
      {
        "name": "Apify Agent Skills",
        "link": "https://github.com/apify/agent-skills/",
        "shortDescriptions": [
          "Gives Agents 30,000+ Apify Actors for scraping any site."
        ]
      },
      {
        "name": "Midscene Skills",
        "link": "https://github.com/web-infra-dev/midscene/",
        "shortDescriptions": [
          "Vision-driven UI automation in natural language, across all platforms."
        ]
      },
      {
        "name": "Obscura",
        "link": "https://github.com/h4ckf0r0day/obscura/",
        "shortDescriptions": [
          "Rust headless browser, 30 MB replaces Chrome."
        ]
      },
      {
        "name": "Browser Harness",
        "link": "https://github.com/browser-use/browser-harness/",
        "shortDescriptions": [
          "Self-healing browser harness that lets Agents write their own missing skills."
        ]
      },
      {
        "name": "Lightpanda Browser",
        "link": "https://github.com/lightpanda-io/browser/",
        "shortDescriptions": [
          "A headless browser built from scratch for AI Agents, 9x faster than Chrome."
        ]
      },
      {
        "name": "AutoCLI",
        "link": "https://github.com/nashsu/AutoCLI/",
        "shortDescriptions": [
          "One command to fetch data from any website, 55+ sites built in."
        ]
      },
      {
        "name": "page-agent",
        "link": "https://github.com/alibaba/page-agent/",
        "shortDescriptions": [
          "One script gives any web page its own GUI Agent."
        ]
      },
      {
        "name": "Agent Browser",
        "link": "https://github.com/vercel-labs/agent-browser/",
        "shortDescriptions": [
          "A blazing-fast Rust browser automation CLI built for AI Agents."
        ]
      },
      {
        "name": "OpenCLI",
        "link": "https://github.com/jackwener/opencli/",
        "shortDescriptions": [
          "Turns any website into a CLI, letting Agents operate your logged-in Chrome."
        ]
      },
      {
        "name": "Agent-Reach",
        "link": "https://github.com/Panniantong/Agent-Reach/",
        "shortDescriptions": [
          "One CLI that lets your Agent read and search the whole internet."
        ]
      },
      {
        "name": "Web-Access",
        "link": "https://github.com/eze-is/web-access/",
        "shortDescriptions": [
          "Gives Agents a real browser with smart tool routing."
        ]
      },
      {
        "name": "Scrapling",
        "link": "https://github.com/D4Vinci/Scrapling/",
        "shortDescriptions": [
          "Adaptive scraping framework that survives site changes and anti-bot walls."
        ]
      },
      {
        "name": "Stagehand",
        "link": "https://github.com/browserbase/stagehand/",
        "shortDescriptions": [
          "The SDK for browser agents, natural language replaces brittle selectors."
        ]
      }
    ]
  },
  {
    "mainCategory": "Code Review & Security",
    "slug": "code-review-security",
    "items": [
      {
        "name": "Security Review",
        "link": "https://github.com/github/awesome-copilot/blob/main/skills/security-review/SKILL.md/",
        "shortDescriptions": [
          "AI reasons like a researcher to hunt code vulnerabilities."
        ]
      },
      {
        "name": "Code Review Skill",
        "link": "https://github.com/awesome-skills/code-review-skill/",
        "shortDescriptions": [
          "Structured expert code review across 20+ languages and frameworks."
        ]
      },
      {
        "name": "Open Code Review",
        "link": "https://github.com/alibaba/open-code-review/",
        "shortDescriptions": [
          "Hybrid-architecture AI code review with precise line-level positioning."
        ]
      },
      {
        "name": "Codex Security",
        "link": "https://github.com/openai/codex-security/",
        "shortDescriptions": [
          "AI scans and fixes code security vulnerabilities."
        ]
      },
      {
        "name": "Yao Websecurity Skill",
        "link": "https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-websecurity-skill/",
        "shortDescriptions": [
          "Structured authorized web security review with 275 built-in checks"
        ]
      },
      {
        "name": "Security Audit Skill",
        "link": "https://github.com/cloudflare/security-audit-skill/",
        "shortDescriptions": [
          "Multi-Agent parallel audit, reports only exploitable vulnerabilities."
        ]
      },
      {
        "name": "Claude Code /security-review",
        "link": "https://github.com/anthropics/claude-code-security-review/blob/main/.claude/commands/security-review.md/",
        "shortDescriptions": [
          "Scans branch diffs for high-confidence security vulnerabilities before merge."
        ]
      },
      {
        "name": "Improve",
        "link": "https://github.com/shadcn/improve/",
        "shortDescriptions": [
          "Audits any codebase and writes executable plans for Agents."
        ]
      },
      {
        "name": "Codex Plugin for Claude Code",
        "link": "https://github.com/openai/codex-plugin-cc/",
        "shortDescriptions": [
          "Call Codex inside Claude Code to review code and delegate tasks."
        ]
      },
      {
        "name": "Strix",
        "link": "https://github.com/usestrix/strix/",
        "shortDescriptions": [
          "Autonomous AI Agents that pentest and validate real vulnerabilities."
        ]
      },
      {
        "name": "SkillSpector",
        "link": "https://github.com/NVIDIA/skillspector/",
        "shortDescriptions": [
          "Scans Agent Skills for risks before you install them."
        ]
      },
      {
        "name": "SlowMist Agent Security Skill",
        "link": "https://github.com/slowmist/slowmist-agent-security/",
        "shortDescriptions": [
          "Zero-trust security review for every input an Agent touches."
        ]
      }
    ]
  },
  {
    "mainCategory": "Memory & Knowledge",
    "slug": "memory-knowledge",
    "items": [
      {
        "name": "Obsidian Second Brain",
        "link": "https://github.com/eugeniughelbur/obsidian-second-brain/",
        "shortDescriptions": [
          "Turns your Obsidian vault into an Agent's persistent memory."
        ]
      },
      {
        "name": "NotebookLM Claude Code Skill",
        "link": "https://github.com/pleaseprompto/notebooklm-skill/",
        "shortDescriptions": [
          "Lets Claude query NotebookLM for source-grounded answers."
        ]
      },
      {
        "name": "Letta",
        "link": "https://github.com/letta-ai/letta/",
        "shortDescriptions": [
          "Build stateful AI agents that remember and self-improve."
        ]
      },
      {
        "name": "Supermemory",
        "link": "https://github.com/supermemoryai/supermemory/",
        "shortDescriptions": [
          "Blazing-fast, local-first memory and context engine for AI."
        ]
      },
      {
        "name": "OpenHuman",
        "link": "https://github.com/tinyhumansai/openhuman/",
        "shortDescriptions": [
          "Local-first personal AI super-intelligence uniting memory, orchestration and research."
        ]
      },
      {
        "name": "Obsidian Skills",
        "link": "https://github.com/kepano/obsidian-skills/",
        "shortDescriptions": [
          "Lets Agents read and write Obsidian notes and vaults."
        ]
      },
      {
        "name": "Context7",
        "link": "https://github.com/upstash/context7/",
        "shortDescriptions": [
          "Injects up-to-date version-specific docs into AI coding, killing API hallucinations."
        ]
      },
      {
        "name": "agentmemory",
        "link": "https://github.com/rohitg00/agentmemory/",
        "shortDescriptions": [
          "Cross-session persistent memory for coding Agents, 92% fewer tokens."
        ]
      },
      {
        "name": "MemPalace",
        "link": "https://github.com/milla-jovovich/mempalace/",
        "shortDescriptions": [
          "Local-first AI memory palace, benchmark-topping recall."
        ]
      },
      {
        "name": "Claude-Mem",
        "link": "https://github.com/thedotmack/claude-mem/",
        "shortDescriptions": [
          "Cross-device memory layer that lets any Agent pick up where it left off."
        ]
      },
      {
        "name": "Planning with files",
        "link": "https://github.com/othmanadi/planning-with-files/",
        "shortDescriptions": [
          "Markdown files as the Agent's on-disk working memory, so plans survive across sessions."
        ]
      },
      {
        "name": "Mem0",
        "link": "https://github.com/mem0ai/mem0/",
        "shortDescriptions": [
          "Drop-in long-term memory layer for AI Agents."
        ]
      },
      {
        "name": "MemU",
        "link": "https://github.com/NevaMind-AI/memU/",
        "shortDescriptions": [
          "Agentic memory that self-organizes, letting AI truly remember you."
        ]
      },
      {
        "name": "OpenViking",
        "link": "https://github.com/volcengine/OpenViking/",
        "shortDescriptions": [
          "A self-evolving context database unifying Agent memory, knowledge and skills."
        ]
      }
    ]
  },
  {
    "mainCategory": "Official Skills",
    "slug": "official-skills",
    "items": [
      {
        "name": "Awesome GitHub Copilot",
        "link": "https://github.com/github/awesome-copilot/",
        "shortDescriptions": [
          "Community-curated Copilot Agents and Skills library."
        ]
      },
      {
        "name": "MATLAB Agentic Toolkit",
        "link": "https://github.com/matlab/matlab-agentic-toolkit/",
        "shortDescriptions": [
          "Makes Agents master MATLAB development and debugging."
        ]
      },
      {
        "name": "Modern Web Guidance",
        "link": "https://github.com/googlechrome/modern-web-guidance/",
        "shortDescriptions": [
          "Steers coding Agents toward modern web platform patterns."
        ]
      },
      {
        "name": "Agent Skills for WordPress",
        "link": "https://github.com/wordpress/agent-skills/",
        "shortDescriptions": [
          "Teaches AI Agents to build WordPress the right way."
        ]
      },
      {
        "name": "Gemini API Skills",
        "link": "https://github.com/google-gemini/gemini-skills/",
        "shortDescriptions": [
          "Google's official Skills that help Agents write correct Gemini API code."
        ]
      },
      {
        "name": "Claude for Legal",
        "link": "https://github.com/anthropics/claude-for-legal/",
        "shortDescriptions": [
          "Anthropic's official legal-workflow Agent and Skill suite."
        ]
      },
      {
        "name": "Google Agent Skills",
        "link": "https://github.com/google/skills/",
        "shortDescriptions": [
          "Official Agent Skills spanning Google Cloud's full stack"
        ]
      },
      {
        "name": "Lark CLI",
        "link": "https://github.com/larksuite/cli/",
        "shortDescriptions": [
          "Official CLI letting Agents operate the whole Lark ecosystem"
        ]
      },
      {
        "name": "Knowledge Work Plugins",
        "link": "https://github.com/anthropics/knowledge-work-plugins/",
        "shortDescriptions": [
          "Anthropic's official plugins turn Claude into a specialist for each role."
        ]
      },
      {
        "name": "Vercel Agent Skills",
        "link": "https://github.com/vercel-labs/agent-skills/",
        "shortDescriptions": [
          "Vercel's official Skill pack mastering web dev best practices."
        ]
      },
      {
        "name": "Claude for Financial Services",
        "link": "https://github.com/anthropics/financial-services/",
        "shortDescriptions": [
          "Official Agents and skills covering the full financial services workflow."
        ]
      }
    ]
  }
];
