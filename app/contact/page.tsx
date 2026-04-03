export default function ContactPage() {
  return (
    <div className="grid gap-8 pb-8 xl:grid-cols-[220px_minmax(0,1fr)]">
      <section className="pt-4">
        <p className="eyebrow">Contact</p>
        <h1 className="hero-title mt-4 max-w-4xl">Get in touch.</h1>
      </section>

      <section className="max-w-3xl border-t border-[var(--border)] pt-6 text-[var(--muted-strong)]">
        <div className="space-y-4">
          <p>Email: hello@example.dev</p>
          <p>GitHub: github.com/your-handle</p>
          <p>LinkedIn: linkedin.com/in/your-handle</p>
        </div>
      </section>
    </div>
  );
}
