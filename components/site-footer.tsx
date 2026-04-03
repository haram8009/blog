export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] py-6 text-sm text-[var(--muted)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>{new Date().getFullYear()} Jr.Dev Log</p>
        <p>Next.js · Markdown · GitHub</p>
      </div>
    </footer>
  );
}
