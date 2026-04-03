import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/utils";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export async function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.name} | Jr.Dev Log`,
    description: project.summary,
    alternates: {
      canonical: absoluteUrl(`/projects/${project.slug}`)
    },
    openGraph: {
      title: project.name,
      description: project.summary,
      url: absoluteUrl(`/projects/${project.slug}`),
      type: "article"
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-8">
      <section className="pt-4">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
          ← Back to projects
        </Link>

        <div className="mt-6 max-w-4xl">
          <h1 className="hero-title">{project.name}</h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {project.status} · {project.timeline}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted-strong)]">
            {project.stack.map((item) => (
              <Link
                key={item}
                href={`/projects?stack=${encodeURIComponent(item)}`}
                className="transition hover:text-[var(--foreground)] hover:underline hover:underline-offset-4"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
          <div>
            <p className="eyebrow">Summary</p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">{project.summary}</p>
          </div>

          <div>
            <p className="eyebrow">Links</p>
            <div className="mt-2 space-y-2">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-[var(--muted-strong)] underline underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-10">
          <section className="border-t border-[var(--border)] pt-6 lg:border-t-0 lg:pt-0">
            <p className="eyebrow">Problem</p>
            <p className="mt-3 max-w-3xl text-[var(--muted-strong)]">{project.problem}</p>
          </section>

          <section className="border-t border-[var(--border)] pt-6">
            <p className="eyebrow">Role</p>
            <p className="mt-3 max-w-3xl text-[var(--muted-strong)]">{project.role}</p>
          </section>

          <section className="border-t border-[var(--border)] pt-6">
            <p className="eyebrow">Decisions</p>
            <div className="mt-4 space-y-6">
              {project.decisions.map((decision) => (
                <article key={decision.title}>
                  <h2 className="card-title text-xl font-semibold">{decision.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted-strong)]">{decision.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-[var(--border)] pt-6">
            <p className="eyebrow">Outcome</p>
            <p className="mt-3 max-w-3xl text-[var(--muted-strong)]">{project.outcome}</p>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
              {project.highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
