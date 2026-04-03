export type Project = {
  name: string;
  summary: string;
  stack: string[];
  href: string;
  status: "Live" | "In progress";
  featured: boolean;
};

export const projects: Project[] = [
  {
    name: "Interview Notes Hub",
    summary: "A searchable study notebook for frontend interview prep and debugging patterns.",
    stack: ["Next.js", "TypeScript", "MDX"],
    href: "#",
    status: "Live",
    featured: true
  },
  {
    name: "Focus Timer",
    summary: "A lightweight productivity app built to learn state management and timing edge cases.",
    stack: ["React", "CSS Modules", "Vite"],
    href: "#",
    status: "In progress",
    featured: true
  },
  {
    name: "Design QA Checklist",
    summary: "A tiny internal tool for tracking layout bugs and accessibility checks before release.",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    href: "#",
    status: "In progress",
    featured: false
  }
];
