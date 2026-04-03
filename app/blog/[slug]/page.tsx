import type { Metadata } from "next";
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

  return (
    <div className="space-y-8">
      <article className="rounded-[2.5rem] border border-[var(--border)] bg-white p-8 shadow-[0_16px_60px_rgba(28,24,19,0.06)]">
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="max-w-3xl font-[Trebuchet_MS] text-4xl font-semibold">{post.title}</h1>
        <p className="mt-5 text-[var(--muted)]">
          {formatDate(post.date)} · {post.readingTime}
        </p>
        <div className="prose mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Future AI recommendation surface</p>
        <h2 className="mt-2 font-[Trebuchet_MS] text-2xl font-semibold">Read next</h2>
        <div className="mt-5 grid gap-6">
          {recommendedPosts.map((candidate) => (
            <PostCard key={candidate.slug} post={candidate} />
          ))}
        </div>
      </section>

      <CommentPanel slug={post.slug} title={post.title} />
    </div>
  );
}
