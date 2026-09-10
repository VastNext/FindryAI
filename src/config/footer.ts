import type { FooterConfig } from "@/types";

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Product",
      items: [
        { title: "Home", href: "/" },
        { title: "Category", href: "/category" },
        { title: "Tag", href: "/tag" },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Agent Skills", href: "/agent-skills" },
        { title: "AI Feed", href: "/ai-daily-feeds" },
        { title: "Face Swap GIF", href: "/face-swap-gif" },
        { title: "Pricing", href: "/pricing" },
        { title: "Submit", href: "/submit" },
        { title: "Studio", href: "/studio", external: true },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/about" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Sitemap", href: "/sitemap.xml" },
      ],
    },
  ],
};
