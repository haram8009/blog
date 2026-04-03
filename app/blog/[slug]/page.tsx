import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentPanel } from "@/components/comment-panel";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { getRecommendationsForPost } from "@/lib/recommendations";
import { absoluteUrl, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Jr.Dev Log`,
    description: post.summary,
    alternates: {
      canonical: absoluteUrl(`/blog/${post.slug}`)
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article"
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recommendations = getRecommendationsForPost(post.slug);
  const allPosts = getAllPosts();
  const recommendedPosts = allPosts.filter((candidate) => recommendations.some((item) => item.slug === candidate.slug));
  const nextPost = recommendedPosts[0];

  return (
    <div className="space-y-12 pb-8">
      <section className="pt-4">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
          ← Back to archive
        </Link>

        <div className="mt-6 max-w-4xl">
          <h1 className="hero-title">{post.title}</h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {formatDate(post.date)} · {post.readingTime}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted-strong)]">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
          <div>
            <p className="eyebrow">Published</p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">{formatDate(post.date)}</p>
          </div>

          <div>
            <p className="eyebrow">Reading</p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">{post.readingTime}</p>
          </div>

          <div>
            <p className="eyebrow">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-strong)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {nextPost ? (
            <div>
              <p className="eyebrow">Next</p>
              <Link href={nextPost.url} className="mt-2 block text-sm text-[var(--muted-strong)] transition hover:text-[var(--foreground)]">
                {nextPost.title}
              </Link>
            </div>
          ) : null}
        </aside>

        <article className="min-w-0 border-t border-[var(--border)] pt-6 lg:border-t-0 lg:pt-0">
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </section>

      <section className="border-t border-[var(--border)] pt-8">
        <p className="eyebrow">Related</p>
        {recommendedPosts.length > 0 ? (
          <div className="mt-4">
            {recommendedPosts.map((candidate) => (
              <PostCard key={candidate.slug} post={candidate} variant="compact" />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">No related notes</p>
        )}
      </section>

      <CommentPanel slug={post.slug} title={post.title} />
    </div>
  );
}
