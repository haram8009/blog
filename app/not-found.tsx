import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">404</p>
      <h1 className="mt-3 font-[Trebuchet_MS] text-4xl font-semibold">This post does not exist yet.</h1>
      <p className="mt-4 text-[var(--muted)]">Try the blog index instead and browse the latest writing.</p>
      <Link href="/blog" className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 font-[Trebuchet_MS] text-sm font-semibold text-white">
        Go to blog
      </Link>
    </div>
  );
}
