export default function ContactPage() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Contact</p>
        <h1 className="mt-3 font-[Trebuchet_MS] text-4xl font-semibold">Let&apos;s talk about frontend work, growth, and good product details.</h1>
      </section>
      <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8 text-[var(--muted)]">
        <p className="mb-4">Email: hello@example.dev</p>
        <p className="mb-4">GitHub: github.com/your-handle</p>
        <p>LinkedIn: linkedin.com/in/your-handle</p>
      </section>
    </div>
  );
}
