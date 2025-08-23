export type SiteConfig = {
  name: string;
  description: string;
  url: string; // canonical base URL without trailing slash
  ogImage: string; // path or absolute URL
  keywords?: string[];
  authors?: { name: string; url?: string }[];
  links?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
};

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteConfig: SiteConfig = {
  name: "Spamsense",
  description: "Real‑time call protection and analytics to block spam and stay productive.",
  url: baseUrl,
  ogImage: "/android-chrome-512x512.png",
  keywords: [
    "spam",
    "call protection",
    "analytics",
    "telephony",
    "fraud detection",
  ],
  authors: [{ name: "Spamsense" }],
  links: {
    github: "https://github.com/",
    website: baseUrl,
  },
};

export function absoluteUrl(path: string): string {
  try {
    // If already absolute, return as-is
    const u = new URL(path);
    return u.toString();
  } catch {
    return `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}

