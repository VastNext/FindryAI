import type { MarketingConfig } from "@/types";

export const marketingConfig: MarketingConfig = {
  menus: [
    {
      title: "Home",
      href: "/",
      icon: "home",
    },
    {
      title: "Category",
      href: "/category",
      icon: "category",
    },
    {
      title: "Tag",
      href: "/tag",
      icon: "tag",
    },
    {
      title: "Agent Skills",
      href: "/agent-skills",
      icon: "sparkles",
    },
    {
      title: "Pricing",
      href: "/pricing",
      icon: "pricing",
    },
    {
      title: "Submit",
      href: "/submit",
      icon: "submit",
    },
    {
      title: "Studio",
      href: "/studio",
      icon: "studio",
      external: true,
    },
  ],
};
