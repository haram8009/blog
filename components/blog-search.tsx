"use client";

import { useState } from "react";
import type { PostSummary } from "@/lib/content";
import { PostCard } from "@/components/post-card";

type BlogSearchProps = {
  posts: PostSummary[];
  tags: string[];
};

export function BlogSearch({ posts, tags }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const filtered = posts.filter((post) => {
    const matchesQuery =
      query.length === 0 ||
      `${post.title} ${post.summary} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase());
    const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);
    return matchesQuery && matchesTag;
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts, lessons, and debugging notes"
            className="w-full rounded-full border border-[var(--border)] bg-white px-5 py-3 outline-none ring-0"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`rounded-full px-4 py-2 text-sm ${selectedTag === "all" ? "bg-[var(--foreground)] text-white" : "border border-[var(--border)] bg-white text-[var(--muted)]"}`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-2 text-sm ${selectedTag === tag ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-white text-[var(--muted)]"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filtered.length > 0 ? (
        <div className="grid gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted)]">
          No posts match this search yet.
        </div>
      )}
    </div>
  );
}
