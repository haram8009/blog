import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type PostCardProps = {
  post: PostSummary;
  variant?: "feed" | "compact";
};

export function PostCard({ post, variant = "feed" }: PostCardProps) {
  const isCompact = variant === "compact";

  return (
    <article className="group border-t border-[var(--border)] py-5 first:border-t-0 first:pt-0">
      <Link href={post.url} className="block">
        <h3
          className={`${isCompact ? "text-lg" : "text-2xl sm:text-[1.9rem]"} card-title font-semibold transition group-hover:underline group-hover:underline-offset-4`}
        >
          {post.title}
        </h3>
        {!isCompact ? <p className="mt-2 max-w-2xl text-sm text-[var(--muted-strong)]">{post.summary}</p> : null}
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
  );
}
