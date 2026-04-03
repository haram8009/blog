import Link from "next/link";
import { BlogSearch } from "@/components/blog-search";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getAllTags } from "@/lib/content";
import { projects } from "@/lib/projects";

export default function HomePage() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 3);
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className="space-y-8">
      <section className="grid gap-8 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_24px_80px_rgba(28,24,19,0.08)] md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[var(--accent-strong)]">Junior developer portfolio + blog</p>
          <h1 className="max-w-2xl font-[Trebuchet_MS] text-5xl font-semibold leading-tight">
            I build frontend projects, write down what I learn, and make my progress easy to evaluate.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">
            This site is designed to help recruiters and teammates quickly see how I think, what I have built,
            and how I turn small wins into repeatable engineering habits.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="rounded-full bg-[var(--accent)] px-5 py-3 font-[Trebuchet_MS] text-sm font-semibold text-white">
              Read the blog
            </Link>
            <Link href="/projects" className="rounded-full border border-[var(--border)] bg-white px-5 py-3 font-[Trebuchet_MS] text-sm font-semibold">
              See projects
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            "Practical learning notes after building real features",
            "Searchable writing archive with tags and future AI recommendations",
            "GitHub login plus GitHub Discussions comments for public conversations"
          ].map((item) => (
            <div key={item} className="rounded-[1.75rem] bg-white p-5">
              <p className="font-[Trebuchet_MS] font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featuredProjects.map((project) => (
          <article key={project.name} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="mb-2 text-sm uppercase tracking-[0.16em] text-[var(--muted)]">{project.status}</p>
            <h2 className="mb-3 font-[Trebuchet_MS] text-2xl font-semibold">{project.name}</h2>
            <p className="mb-4 text-[var(--muted)]">{project.summary}</p>
            <p className="text-sm text-[var(--muted)]">{project.stack.join(" · ")}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Latest writing</p>
            <h2 className="font-[Trebuchet_MS] text-3xl font-semibold">Posts that show how I learn</h2>
          </div>
          <Link href="/blog" className="font-[Trebuchet_MS] font-semibold text-[var(--accent-strong)]">
            See all posts
          </Link>
        </div>
        <div className="grid gap-6">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Browse the archive</p>
          <h2 className="font-[Trebuchet_MS] text-3xl font-semibold">Search by topic before AI recommendations land</h2>
        </div>
        <BlogSearch posts={posts} tags={getAllTags()} />
      </section>
    </div>
  );
}
