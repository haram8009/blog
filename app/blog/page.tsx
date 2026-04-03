import { BlogSearch } from "@/components/blog-search";
import { getAllPosts, getAllTags } from "@/lib/content";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="space-y-8 pb-8">
      <section className="pt-4">
        <p className="eyebrow">Blog</p>
        <h1 className="hero-title mt-4">Notes</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {posts.length} posts · {tags.length} tags
        </p>
      </section>

      <BlogSearch posts={posts} tags={tags} />
    </div>
  );
}
