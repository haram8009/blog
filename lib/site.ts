import { getSiteUrl } from "@/lib/env";

export const siteConfig = {
  name: "Jr.Dev Log",
  title: "Jr.Dev Log | Portfolio and blog for a growing developer",
  description:
    "A recruiter-friendly developer portfolio and blog focused on projects, learning notes, and practical engineering growth.",
  url: getSiteUrl(),
  author: "Haram",
  githubUrl: "https://github.com",
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" }
  ]
} as const;
