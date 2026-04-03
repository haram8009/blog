"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const stacks = Array.from(new Set(projects.flatMap((project) => project.stack))).slice(0, 8);
  const featuredProjects = projects.filter((project) => project.featured);
  const initialStack = searchParams.get("stack");
  const [selectedStack, setSelectedStack] = useState<string>(initialStack && stacks.includes(initialStack) ? initialStack : "all");

  useEffect(() => {
    setSelectedStack(initialStack && stacks.includes(initialStack) ? initialStack : "all");
  }, [initialStack, stacks]);

  const filteredProjects = useMemo(
    () => (selectedStack === "all" ? projects : projects.filter((project) => project.stack.includes(selectedStack))),
    [selectedStack]
  );

  const updateStack = (stack: string) => {
    setSelectedStack(stack);
    const params = new URLSearchParams(searchParams.toString());

    if (stack === "all") {
      params.delete("stack");
    } else {
      params.set("stack", stack);
    }

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-8 pb-8">
      <section className="pt-4">
        <p className="eyebrow">Projects</p>
        <h1 className="hero-title mt-4">Case studies</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {filteredProjects.length} projects{selectedStack !== "all" ? ` · ${selectedStack}` : ""}
        </p>
      </section>

      <section className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Featured</p>
            <div className="mt-3 space-y-2">
              {featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block text-sm text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Stack</p>
              {selectedStack !== "all" ? (
                <button
                  type="button"
                  onClick={() => updateStack("all")}
                  className="text-xs text-[var(--muted)] underline underline-offset-4"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateStack("all")}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  selectedStack === "all"
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                    : "border-[var(--border)] text-[var(--muted-strong)]"
                }`}
              >
                all
              </button>
              {stacks.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateStack(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    selectedStack === item
                      ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                      : "border-[var(--border)] text-[var(--muted-strong)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <article key={project.slug} className="border-t border-[var(--border)] py-6 first:border-t-0 first:pt-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted)]">
                      {project.status} · {project.timeline}
                    </p>
                    <h2 className="card-title mt-2 text-2xl font-semibold">{project.name}</h2>
                  </div>
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-strong)]">
                    {project.stack[0]}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-sm text-[var(--muted-strong)]">{project.summary}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
                  {project.highlights.map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>
                <Link href={`/projects/${project.slug}`} className="mt-4 inline-flex text-sm text-[var(--muted)] underline underline-offset-4">
                  View
                </Link>
              </article>
            ))
          ) : (
            <div className="border-t border-[var(--border)] py-5 text-sm text-[var(--muted)]">No projects</div>
          )}
        </div>
      </section>
    </div>
  );
}
