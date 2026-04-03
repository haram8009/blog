"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PostCard } from "@/components/post-card";
import type { PostSummary } from "@/lib/content";

type BlogSearchProps = {
  posts: PostSummary[];
  tags: string[];
};

export function BlogSearch({ posts, tags }: BlogSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialTag = searchParams.get("tag");
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>(initialTag && tags.includes(initialTag) ? initialTag : "all");

  const tagCounts = useMemo(
    () =>
      Object.fromEntries(tags.map((tag) => [tag, posts.filter((post) => post.tags.includes(tag)).length])),
    [posts, tags]
  );

  const filtered = posts.filter((post) => {
    const matchesQuery =
      query.length === 0 ||
      `${post.title} ${post.summary} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase());
    const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);

    return matchesQuery && matchesTag;
  });

  const topTags = tags.slice(0, 8);
  const latestTitles = posts.slice(0, 4);

  useEffect(() => {
    setSelectedTag(initialTag && tags.includes(initialTag) ? initialTag : "all");
  }, [initialTag, tags]);

  const updateTag = (tag: string) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(searchParams.toString());

    if (tag === "all") {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="block">
          <span className="sr-only">Search notes</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="input-shell"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateTag("all")}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selectedTag === "all"
                ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                : "border-[var(--border)] text-[var(--muted-strong)]"
            }`}
          >
            all
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => updateTag(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                selectedTag === tag
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                  : "border-[var(--border)] text-[var(--muted-strong)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <aside className="space-y-8 lg:sticky lg:top-6">
          <div>
            <p className="eyebrow">Results</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{filtered.length}</p>
          </div>

          <div>
            <p className="eyebrow">Topics</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => updateTag(tag)}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-strong)] transition hover:border-[var(--border-strong)]"
                >
                  {tag} <span className="text-[var(--muted)]">{tagCounts[tag]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Latest</p>
            <div className="mt-3 space-y-2">
              {latestTitles.map((post) => (
                <Link
                  key={post.slug}
                  href={post.url}
                  className="block text-sm text-[var(--muted-strong)] transition hover:text-[var(--foreground)]"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>

          {(query || selectedTag !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                updateTag("all");
              }}
              className="text-sm text-[var(--muted)] underline underline-offset-4"
            >
              Reset
            </button>
          )}
        </aside>

        <section>
          {filtered.length > 0 ? (
            <div>
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="border-t border-[var(--border)] py-5 text-sm text-[var(--muted)]">No results</div>
          )}
        </section>
      </div>
    </div>
  );
}
