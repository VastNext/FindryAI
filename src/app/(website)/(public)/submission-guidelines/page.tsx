import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const revalidate = 172800; // 48 hours ISR cache

const canonicalUrl = `${siteConfig.url}/submission-guidelines`;

export const metadata = constructMetadata({
  title: "Submission Guidelines",
  description:
    "How to submit your AI tool to Findry AI and pass our five-step editorial review: availability, relevance, content depth, images, and categories.",
  canonicalUrl,
});

const eligibility = [
  "Your product is a live AI tool, AI application, agent skill, or high-quality productivity product.",
  "The website is publicly accessible and loads normally for any visitor.",
  "The listing accurately represents the product — name, link, description, and screenshots all match the real site.",
  "You submit each product only once and update existing submissions instead of creating duplicates.",
];

const reviewCriteria = [
  {
    title: "Website availability",
    summary:
      "The link must open for any visitor. We probe the URL during review and reject anything that is broken, parked, or deceptive.",
    points: [
      "Returns HTTP 200 in a regular browser, with no login wall hiding the product.",
      "Not a parked domain, under-construction placeholder, or redirect to an unrelated site.",
      "Not gambling, gray-market, spam, or a thin template site with no real product.",
    ],
  },
  {
    title: "Relevance to our directory",
    summary:
      "Findry AI is a curated AI tools directory. We list real products, not personal pages or content farms.",
    points: [
      "A real AI tool, AI-powered app, agent skill, or high-quality efficiency product.",
      "Not a pure personal homepage, unrelated blog, or copy-paste content farm.",
      "The product should already be usable by visitors — vaporware and pure waitlist pages are declined.",
    ],
  },
  {
    title: "Content depth",
    summary:
      "Description and introduction are what visitors read before clicking through. Weak or copied text is returned for revision.",
    points: [
      "Description: a meaningful product summary of at least 80 characters — never a copy of your page title (form limit: 256 characters).",
      "Introduction: structured content covering key features, use cases, and target users; at least 400 characters; Markdown supported (form limit: 4096 characters).",
      "The introduction must not repeat the description word for word.",
      "We never polish submissions for you — improve the copy yourself and resubmit.",
    ],
  },
  {
    title: "Visual quality",
    summary:
      "Icon and screenshot are shown across the directory. Blurry or tiny assets make the whole listing look untrustworthy.",
    points: [
      "Icon: square (1:1) PNG or JPEG, at least 128 × 128 px, max 1 MB, still crisp when displayed small.",
      "Screenshot: 16:9 PNG or JPEG, at least 1200 px wide, max 1 MB, showing the real product interface.",
      "No blurry, heavily cropped, placeholder, or text-only images.",
    ],
  },
  {
    title: "Category & tag accuracy",
    summary:
      "Categories and tags control where your product appears. Misfiled listings are corrected or rejected.",
    points: [
      "Choose from the categories and tags that already exist on Findry AI (at least one of each).",
      "They must match what the product actually does — for example, a video tool belongs under video categories, not audio.",
      "Keyword stuffing with unrelated tags will cause a rejection.",
    ],
  },
];

const reviewSteps = [
  {
    title: "Submit",
    description:
      "Fill in the submit form, upload icon and screenshot, and choose a plan. Free plans enter the editorial review queue.",
  },
  {
    title: "Review",
    description:
      "We check your site against the five criteria above, usually within 48 hours.",
  },
  {
    title: "Approved",
    description:
      "Your product goes live in the directory and you receive an approval email with a direct link to the listing.",
  },
  {
    title: "Rejected",
    description:
      "Your product is not published. You receive an email with the complete rejection reason, also visible in your dashboard. Fix the issues and click “Submit to Review” to re-enter the queue.",
  },
];

const commonRejectionReasons = [
  {
    reason: "The item is not good fit for our directory.",
    detail:
      "The site is unreachable, unrelated to AI or tools, parked, or low-quality.",
  },
  {
    reason: "The information of the item is not clear.",
    detail:
      "Description or introduction is too short, copied from the title, or lacks features and use cases.",
  },
  {
    reason: "The image of the item is not in good quality.",
    detail:
      "Screenshot is blurry, too small, cropped, or does not show the real product.",
  },
  {
    reason: "The icon of the item is not in good quality.",
    detail: "Icon is tiny, blurry, distorted, or not a clean square.",
  },
  {
    reason: "The backlink to our site is not provided.",
    detail:
      "A backlink or badge to Findry AI is optional but appreciated — it also helps prioritize your review.",
  },
  {
    reason: "Other reasons",
    detail:
      "A custom explanation is written specifically for your submission and sent in full by email.",
  },
];

const checklist = [
  "The site opens for anyone, without errors or redirects to unrelated pages.",
  "It is a real AI tool or high-quality productivity product.",
  "Description is at least 80 characters and not a copy of your page title.",
  "Introduction is at least 400 characters, structured, and different from the description.",
  "Icon is a clear square image of at least 128 px.",
  "Screenshot is a clear 16:9 image at least 1200 px wide.",
  "Categories and tags match what the product actually does.",
];

export default function SubmissionGuidelinesPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Submission Guidelines",
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <Container className="mt-8 pb-16">
      <JsonLd data={jsonLd} />
      <div className="w-full flex flex-col gap-16">
        <section className="w-full flex flex-col gap-8 justify-center">
          <HeaderSection
            labelAs="h1"
            label="Submission Guidelines"
            titleAs="h2"
            title="Submit a site that passes review"
            subtitle="Every submitted site passes a five-step editorial review. Read this page before submitting to avoid rejection."
          />
        </section>

        <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">What you can submit</h2>
          <ul className="list-disc space-y-3 pl-6 text-muted-foreground leading-relaxed">
            {eligibility.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">The five review criteria</h2>
          <p className="text-muted-foreground leading-relaxed">
            All five criteria must pass. If any one of them fails, the
            submission is returned for revision instead of being published.
          </p>
          <div className="flex flex-col gap-6">
            {reviewCriteria.map((criterion, index) => (
              <div
                key={criterion.title}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold">{criterion.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {criterion.summary}
                    </p>
                    <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground leading-relaxed">
                      {criterion.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">How review works</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {reviewSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="mb-2 text-sm font-semibold text-primary">
                  Step {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Common rejection reasons</h2>
          <div className="divide-y rounded-lg border bg-card shadow-sm">
            {commonRejectionReasons.map((item) => (
              <div key={item.reason} className="p-5">
                <p className="font-medium">{item.reason}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The rejection email always contains the complete reason for your
            submission. The same text is shown next to the red Rejected badge in
            your dashboard.
          </p>
        </section>

        <section className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Before you submit</h2>
          <ul className="list-disc space-y-3 pl-6 text-muted-foreground leading-relaxed">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-semibold">Ready to submit?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Still have questions? Contact{" "}
            <a
              className="underline text-primary"
              href={`mailto:${siteConfig.mail}`}
            >
              {siteConfig.mail}
            </a>
            .
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/submit">Submit your product</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </section>
      </div>
    </Container>
  );
}
