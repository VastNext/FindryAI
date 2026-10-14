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
        { title: "Face Swap GIF", href: "/face-swap-gif" },
        { title: "TypeSafe Jev", href: "/typesafe-jev" },
        { title: "GPT-6 Astra", href: "/gpt-6-astra" },
        { title: "AutoDraw AI", href: "/item/autodraw" },
        {
          title: "ArtCraft Suite",
          href: "/blog/artcraft-open-source-adobe-alternatives",
        },
        { title: "PhotoCraft", href: "/item/photocraft" },
        { title: "VectorCraft", href: "/item/vectorcraft" },
        { title: "FilmCraft", href: "/item/filmcraft" },
        { title: "Gemini 4 Argon", href: "/gemini-4-argon" },
        { title: "Agent Skills", href: "/agent-skills" },
        { title: "AI Feed", href: "/ai-daily-feeds" },
        { title: "Face Swap Video", href: "/ai-face-swap-video" },
        { title: "Pricing", href: "/pricing" },
        { title: "Submit", href: "/submit" },
        { title: "Submission Guidelines", href: "/submission-guidelines" },
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
    {
      title: "Friends",
      items: [
        { title: "AISpotNav", href: "https://aispotnav.com", external: true },
      ],
    },
  ],
};
