import { BlogSearch } from "@/components/blog-search";
import { getAllPosts, getAllTags } from "@/lib/content";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Blog</p>
        <h1 className="mt-3 font-[Trebuchet_MS] text-4xl font-semibold">Notes from building, debugging, and learning in public</h1>
        <p className="mt-4 max-w-3xl text-[var(--muted)]">
          Posts are written in Markdown, indexed by tags, and structured so a later recommendation system can suggest what to read next.
        </p>
      </section>
      <BlogSearch posts={posts} tags={tags} />
    </div>
  );
}
