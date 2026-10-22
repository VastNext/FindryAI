import { faqConfig } from "@/config/faq";
import { ChevronDownIcon } from "lucide-react";

/**
 * Native <details>/<summary> instead of a Radix Accordion: accordion content
 * only mounts when open, so the answers were absent from the server HTML
 * while the FAQPage JSON-LD advertised them. details/summary renders the
 * full answers server-side with zero JS and the same collapsed look.
 */
export function PricingFaq() {
  return (
    <div className="w-full">
      {faqConfig.items.map((faqItem) => (
        <details key={faqItem.id} className="group border-b border-border/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
            <div className="text-left w-full">{faqItem.question}</div>
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div
            className="pb-4 text-base text-muted-foreground whitespace-pre-wrap"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: answers may contain inline mailto links
            dangerouslySetInnerHTML={{ __html: faqItem.answer }}
          />
        </details>
      ))}
    </div>
  );
}
