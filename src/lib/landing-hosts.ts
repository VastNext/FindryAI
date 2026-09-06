import { siteConfig } from "@/config/site";

// dedicated domains that serve the GPT-6 Astra landing page at the root
export const landingHosts = new Set([
  "gpt-6.findryai.com",
  "gpt-6-astra.findryai.com",
  "astra.findryai.com",
]);

// on landing hosts the root is the landing page itself, so "home" links
// (navbar logo, footer, etc.) must point back to the main site
export function homeHrefForHost(host?: string | null): string {
  return host && landingHosts.has(host.toLowerCase()) ? siteConfig.url : "/";
}
