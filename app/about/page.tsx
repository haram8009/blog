export default function AboutPage() {
  return (
    <div className="grid gap-8 pb-8 xl:grid-cols-[220px_minmax(0,1fr)]">
      <section className="pt-4">
        <p className="eyebrow">About</p>
        <h1 className="hero-title mt-4">Frontend engineer in progress.</h1>
      </section>

      <section className="max-w-3xl space-y-5 text-[var(--muted-strong)]">
        <p>I work on frontend products with a bias toward clarity, maintainability, and solid UI details.</p>
        <p>This site keeps the projects and notes from that work.</p>
        <p>Current focus: React, TypeScript, Next.js, accessibility, debugging.</p>
      </section>
    </div>
  );
}
