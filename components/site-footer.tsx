export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border)] px-2 py-6 text-sm text-[var(--muted)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>Built with Next.js, Markdown, GitHub login, and GitHub Discussions.</p>
        <p>Designed for a junior developer portfolio that can grow into a stronger content platform.</p>
      </div>
    </footer>
  );
}
