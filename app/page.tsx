import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/content";
import { projects } from "@/lib/projects";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 3);
  const featuredProjects = projects.filter((project) => project.featured);
  const topTags = getAllTags().slice(0, 5);

  return (
    <div className="space-y-12 pb-8">
      <section className="pt-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_220px] lg:items-end">
          <div>
            <p className="eyebrow">Notes</p>
            <h1 className="hero-title mt-4 max-w-4xl">Build logs, debugging, decisions.</h1>
          </div>
          <div className="flex gap-3 lg:justify-end">
            <Link href="/blog" className="button-secondary">
              Blog
            </Link>
            <Link href="/projects" className="button-secondary">
              Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_220px]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="section-title">Latest</h2>
            <Link href="/blog" className="text-sm text-[var(--muted)] underline underline-offset-4">
              All notes
            </Link>
          </div>

          <div>
            {latestPosts.map((post) => (
              <article key={post.slug} className="border-t border-[var(--border)] py-5 first:border-t-0 first:pt-0">
                <Link href={post.url} className="block">
                  <h3 className="card-title text-2xl font-semibold transition hover:underline hover:underline-offset-4">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatDate(post.date)} · {post.readingTime}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted-strong)]">
                    {post.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div>
            <p className="eyebrow">Topics</p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {topTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-strong)] transition hover:border-[var(--border-strong)]"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Projects</p>
            <div className="mt-3 space-y-2">
              {featuredProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="block text-sm text-[var(--muted-strong)] transition hover:text-[var(--foreground)]">
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
