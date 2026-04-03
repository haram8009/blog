import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card rounded-[1.5rem] p-10 text-center">
      <p className="eyebrow">404</p>
      <h1 className="hero-title mt-4">Post not found.</h1>
      <p className="mt-4 text-[var(--muted)]">Try the archive instead.</p>
      <Link href="/blog" className="button-primary mt-6">
        Go to blog
      </Link>
    </div>
  );
}
