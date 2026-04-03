export default function AboutPage() {
  return (
    <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">About</p>
        <h1 className="mt-3 font-[Trebuchet_MS] text-4xl font-semibold">Growing into a dependable frontend engineer.</h1>
      </section>
      <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8">
        <div className="space-y-5 text-[var(--muted)]">
          <p>
            I am a junior developer focused on frontend product work, clean UI implementation, and documenting what I learn while building.
          </p>
          <p>
            This site is part portfolio and part engineering journal. The goal is simple: show progress clearly, make my project decisions legible, and build a habit of shipping thoughtfully.
          </p>
          <p>
            Right now I care most about React, TypeScript, Next.js, accessibility, debugging workflows, and learning how small design details affect product quality.
          </p>
        </div>
      </section>
    </div>
  );
}
