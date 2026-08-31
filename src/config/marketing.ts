import type { MarketingConfig } from "@/types";

export const marketingConfig: MarketingConfig = {
  menus: [
    {
      title: "Home",
      href: "/",
      icon: "home",
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
