import Link from "next/link";
import type { PostSummary } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_16px_40px_rgba(28,24,19,0.05)]">
      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            {tag}
          </span>
        ))}
      </div>
      <p className="mb-3 text-sm text-[var(--muted)]">
        {formatDate(post.date)} · {post.readingTime}
      </p>
      <h3 className="mb-3 font-[Trebuchet_MS] text-2xl font-semibold">{post.title}</h3>
      <p className="mb-5 text-[var(--muted)]">{post.summary}</p>
      <Link href={post.url} className="font-[Trebuchet_MS] font-semibold text-[var(--accent-strong)]">
        Read post
      </Link>
    </article>
  );
}
