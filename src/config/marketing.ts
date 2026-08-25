import type { MarketingConfig } from "@/types";

export const marketingConfig: MarketingConfig = {
  menus: [
    {
      title: "Search",
      href: "/search",
      icon: "search",
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
      title: "Pricing",
      href: "/pricing",
      icon: "pricing",
    },
    {
      title: "Password Generator",
      href: "/password-generator",
      icon: "passwordGenerator",
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
