import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Projects</p>
        <h1 className="mt-3 font-[Trebuchet_MS] text-4xl font-semibold">What I have built so far</h1>
      </section>
      <div className="grid gap-6">
        {projects.map((project) => (
          <article key={project.name} className="rounded-[1.75rem] border border-[var(--border)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-[Trebuchet_MS] text-2xl font-semibold">{project.name}</h2>
              <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm text-[var(--accent-strong)]">{project.status}</span>
            </div>
            <p className="mb-4 text-[var(--muted)]">{project.summary}</p>
            <p className="text-sm text-[var(--muted)]">{project.stack.join(" · ")}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
