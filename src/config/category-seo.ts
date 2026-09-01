export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryHighlight {
  title: string;
  description: string;
  href?: string;
  icon?: string;
}

export interface RelatedCategory {
  name: string;
  slug: string;
}

export interface CategorySeoDetail {
  seoTitle: string;
  seoDescription: string;
  badge?: string;
  h1: string;
  subtitle: string;
  intro: string[];
  highlights?: CategoryHighlight[];
  faqs?: CategoryFaq[];
  relatedCategories?: RelatedCategory[];
}

export const categorySeoConfig: Record<string, CategorySeoDetail> = {
  "data-tools": {
    seoTitle: "Best AI Data Analysis Tools (2026 Directory)",
    seoDescription:
      "Discover the best AI data analysis tools in 2026. Compare 100+ natural language data analysts (Julius AI, Akkio), AI spreadsheet agents (Sourcetable, Formula Bot), Text-to-SQL generators, and automated BI dashboards.",
    badge: "100+ Curated Data Tools",
    h1: "Best AI Data Analysis Tools (2026)",
    subtitle:
      "Transform raw data, spreadsheets, and databases into actionable business intelligence with top AI data analysis tools.",
    intro: [
      "Modern AI data analysis tools have revolutionized how developers, analysts, and business leaders extract insights from structured and unstructured data. Instead of spending hours writing complex SQL queries, manual Python scripts, or intricate Excel formulas, AI-native data platforms allow you to analyze datasets using everyday natural language.",
      "Whether you need automated spreadsheet cleaning, instant statistical modeling, real-time KPI dashboards, or natural language text-to-SQL query generation, our curated directory showcases the leading AI data platforms vetted for performance, accuracy, and workflow integration.",
    ],
    highlights: [
      {
        title: "AI Data Analysts & Modeling",
        href: "/tag/ai-data-analyst",
        description:
          "Conversational assistants like Julius AI and Akkio that clean data, execute statistical tests, and generate predictive models on demand.",
      },
      {
        title: "Smart Spreadsheet & Excel AI",
        href: "/tag/spreadsheet-ai",
        description:
          "Supercharge Google Sheets and Microsoft Excel with AI formula builders, automated cell extraction, and conversational tabular analysis (Sourcetable, Formula Bot).",
      },
      {
        title: "Text-to-SQL & Database Querying",
        href: "/tag/text-to-sql",
        description:
          "Convert plain English into optimized SQL and NoSQL queries to query warehouses directly without dedicated database engineering (AI2SQL, Text2SQL).",
      },
      {
        title: "AI BI & Dynamic Dashboards",
        href: "/tag/bi-dashboard",
        description:
          "Transform messy spreadsheets into beautiful, shareable charts, interactive web apps, and executive dashboards instantly (Onvo AI, ChartPixel, Graphy).",
      },
    ],
    faqs: [
      {
        question: "What are AI data analysis tools and how do they work?",
        answer:
          "AI data analysis tools are software applications powered by Large Language Models (LLMs) and machine learning algorithms that automate data preparation, statistical analysis, visualization, and reporting. Users can upload CSVs, Excel files, or connect live databases, then ask questions in natural language (e.g., 'What was our customer acquisition cost by channel last quarter?'). The AI translates the query into code (Python, R, or SQL), runs the computation, and returns charts and executive summaries.",
      },
      {
        question: "What are the best AI data analysis tools available in 2026?",
        answer:
          "Top AI data analysis tools include Julius AI (best overall for Python-based analysis and charting), Sourcetable (best AI-native spreadsheet), Obviously AI (best for no-code predictive machine learning), Akkio (best for agency marketing analytics), and AI2SQL (best for converting natural language into SQL database queries).",
      },
      {
        question:
          "Can AI tools replace traditional tools like Microsoft Excel or Tableau?",
        answer:
          "AI tools do not completely replace Excel or Tableau; rather, they augment them. AI dramatically accelerates the exploratory analysis and data-cleaning phases—tasks that previously took hours of manual formula creation or VLOOKUPs can now be completed in seconds. Many AI tools also integrate directly into Excel and Google Sheets as add-ons.",
      },
      {
        question: "Are there free AI tools for data analysis?",
        answer:
          "Yes. Platforms like Julius AI, Wolfram|Alpha, OSSInsight, Graphy, and Chat2CSV offer generous free tiers or open-source community versions that allow you to explore data, generate charts, and query datasets without an upfront subscription.",
      },
      {
        question:
          "How do I choose the right AI data analysis tool for my team?",
        answer:
          "Consider three main factors: 1) Your data format (spreadsheets, SQL databases, or unstructured PDFs); 2) Technical proficiency (no-code visual builders vs. code-capable Python/R environments); and 3) Compliance requirements (cloud-hosted vs. self-hosted enterprise solutions with strict privacy guarantees).",
      },
    ],
    relatedCategories: [
      { name: "Developer Tools", slug: "developer-tools" },
      { name: "Office Tools", slug: "office-tools" },
      { name: "Search & Research", slug: "search-and-research" },
      { name: "AI Chat", slug: "ai-chat" },
    ],
  },
  "ai-chat": {
    seoTitle: "Best AI Chat & Conversational Assistants (2026)",
    seoDescription:
      "Explore the most powerful AI chat assistants, multimodal LLMs, and conversational bots to boost productivity and automate customer interactions.",
    badge: "Top AI Chatbots",
    h1: "AI Chat & Conversational Assistants",
    subtitle:
      "Discover cutting-edge AI chat platforms, conversational agents, and LLM interfaces.",
    intro: [
      "AI chat applications provide intuitive conversational interfaces powered by state-of-the-art Large Language Models. From code debugging and document drafting to multilingual translation and customer support automation, find the perfect chat assistant for your workflow.",
    ],
    faqs: [
      {
        question: "What are the main use cases for AI chat tools?",
        answer:
          "AI chat tools are widely used for writing assistance, code generation, customer support automation, knowledge management, language learning, and brainstorming.",
      },
    ],
  },
  "developer-tools": {
    seoTitle: "Best AI Developer Tools & Coding Assistants (2026)",
    seoDescription:
      "Accelerate software engineering with AI coding assistants, code generation tools, automated testing, and developer infrastructure.",
    badge: "For Engineers",
    h1: "AI Developer Tools & Coding Assistants",
    subtitle:
      "Build, test, debug, and deploy software faster with next-generation AI coding tools.",
    intro: [
      "AI developer tools integrate directly into IDEs, terminal workflows, and CI/CD pipelines to autocomplete code, detect vulnerabilities, write unit tests, and refactor architectures in seconds.",
    ],
    faqs: [
      {
        question: "How do AI developer tools improve coding productivity?",
        answer:
          "AI developer tools reduce boilerplate code, accelerate debugging, automate documentation generation, and provide real-time architecture suggestions.",
      },
    ],
  },
};

export function getCategorySeo(
  slug: string,
  fallbackName?: string,
): CategorySeoDetail {
  if (categorySeoConfig[slug]) {
    return categorySeoConfig[slug];
  }

  const name =
    fallbackName ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    seoTitle: `Best ${name} AI Tools (2026 Directory)`,
    seoDescription: `Explore curated ${name} AI tools and software. Compare features, pricing, and alternatives to supercharge your workflow with Findry AI.`,
    h1: `${name} AI Tools`,
    subtitle: `Discover and compare top-rated ${name} AI tools vetted for quality and productivity.`,
    intro: [
      `Browse our comprehensive collection of ${name} AI tools designed to streamline your daily tasks, automate repetitive processes, and unlock new creative capabilities.`,
    ],
  };
}
