export type Project = {
  slug: string;
  name: string;
  summary: string;
  problem: string;
  role: string;
  proof: string;
  highlights: string[];
  outcome: string;
  timeline: string;
  links: {
    label: string;
    href: string;
  }[];
  decisions: {
    title: string;
    detail: string;
  }[];
  stack: string[];
  status: "Live" | "In progress";
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "interview-notes-hub",
    name: "Interview Notes Hub",
    summary: "A searchable study notebook for frontend interview prep and debugging patterns.",
    problem: "Interview prep notes get noisy fast when search, topics, and revision history are treated as an afterthought.",
    role: "Planned the content structure, built the search-focused reading flow, and shaped the note model for quick review.",
    proof: "Shows how I turn a plain content archive into a tool with clearer navigation and stronger study ergonomics.",
    highlights: ["Content architecture", "Search UX", "Static-first thinking"],
    outcome: "The project turned a pile of prep notes into a navigable study surface with clearer retrieval paths and less review friction.",
    timeline: "2026",
    links: [
      { label: "Project repo", href: "#" },
      { label: "Notes archive", href: "#" }
    ],
    decisions: [
      {
        title: "Treating notes like product content, not raw markdown",
        detail: "The structure was designed around lookup speed and revision loops instead of simply publishing long pages."
      },
      {
        title: "Keeping the experience search-first",
        detail: "Search and topic grouping became the primary entry points because interview prep usually starts with a missing concept, not a desire to browse."
      },
      {
        title: "Favoring static delivery over dynamic complexity",
        detail: "The archive stays fast and maintainable by leaning on static generation and predictable content modeling."
      }
    ],
    stack: ["Next.js", "TypeScript", "MDX"],
    status: "Live",
    featured: true
  },
  {
    slug: "focus-timer",
    name: "Focus Timer",
    summary: "A lightweight productivity app built to learn state management and timing edge cases.",
    problem: "Small timer apps look simple until pause, reset, drift, and session transitions create inconsistent behavior.",
    role: "Implemented the timer flow, handled edge cases around state transitions, and tightened the interaction polish.",
    proof: "Demonstrates debugging discipline and willingness to treat tiny product details like real product work.",
    highlights: ["State transitions", "Timing edge cases", "Interaction polish"],
    outcome: "The build became a controlled environment for testing state transitions and interaction polish instead of a throwaway practice app.",
    timeline: "2026",
    links: [
      { label: "Prototype repo", href: "#" }
    ],
    decisions: [
      {
        title: "Modeling timer behavior around state transitions first",
        detail: "The implementation focused on start, pause, reset, and completion boundaries because those edges define whether the app feels dependable."
      },
      {
        title: "Using a compact surface area to practice QA discipline",
        detail: "A small product was useful because every rough edge stayed visible and easy to inspect."
      },
      {
        title: "Treating micro-interactions as product work",
        detail: "Labels, completion states, and reset affordances were refined so the app felt deliberate rather than merely functional."
      }
    ],
    stack: ["React", "CSS Modules", "Vite"],
    status: "In progress",
    featured: true
  },
  {
    slug: "design-qa-checklist",
    name: "Design QA Checklist",
    summary: "A tiny internal tool for tracking layout bugs and accessibility checks before release.",
    problem: "UI bugs often survive because design QA lives in scattered messages instead of a repeatable release workflow.",
    role: "Defined the checklist model, mapped release checks into the interface, and focused the tool on practical QA habits.",
    proof: "Shows product judgment around process design, not just visual implementation.",
    highlights: ["Release workflow", "Accessibility checks", "Internal tooling"],
    outcome: "The project framed design QA as a repeatable release habit instead of an ad hoc cleanup phase at the end.",
    timeline: "2026",
    links: [
      { label: "Internal concept", href: "#" }
    ],
    decisions: [
      {
        title: "Centering the workflow on release checks",
        detail: "The tool is organized around pre-ship review moments because that is where layout and accessibility issues are most costly."
      },
      {
        title: "Making the checklist opinionated",
        detail: "The point was not to capture every possible QA task but to reinforce the checks most likely to improve release quality."
      },
      {
        title: "Using internal tooling as a product judgment exercise",
        detail: "Even a tiny team-facing tool can demonstrate prioritization, language clarity, and process design."
      }
    ],
    stack: ["Next.js", "Prisma", "PostgreSQL"],
    status: "In progress",
    featured: false
  }
];

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug) ?? null;
}
