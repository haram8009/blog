import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="surface-card rounded-[1.5rem] p-10 text-center">
      <p className="eyebrow">Project not found</p>
      <h1 className="hero-title mt-4">Project not found.</h1>
      <p className="mt-4 text-[var(--muted)]">Go back to the projects index.</p>
      <Link href="/projects" className="button-primary mt-6">
        Go to projects
      </Link>
    </div>
  );
}
