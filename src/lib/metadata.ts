import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

/**
 * Construct the metadata object for the current page (in docs/guides)
 */
export function constructMetadata({
  title,
  description = siteConfig.description,
  canonicalUrl,
  image = siteConfig.image,
  noIndex = false,
}: {
  title?: Metadata["title"];
  description?: string;
  canonicalUrl?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const socialTitle = getSocialTitle(title);
  return {
    title,
    description,
    keywords: siteConfig.keywords,
    creator: siteConfig.author,
    authors: [
      {
        name: siteConfig.author,
      },
    ],
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: socialTitle,
      description,
      siteName: siteConfig.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
      site: siteConfig.url,
      creator: siteConfig.author,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: true,
      },
    }),
  };
}

function getSocialTitle(title: Metadata["title"]): string {
  if (typeof title === "string") {
    return title;
  }
  if (title && "absolute" in title) {
    return title.absolute;
  }
  if (title && "default" in title) {
    return title.default;
  }
  return siteConfig.name;
}
