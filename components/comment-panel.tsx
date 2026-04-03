"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { formatDate } from "@/lib/utils";

type DiscussionComment = {
  id: string;
  bodyHtml: string;
  createdAt: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
};

type DiscussionState = {
  id: string;
  url: string;
  comments: DiscussionComment[];
};

async function readJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function CommentPanel({ slug, title }: { slug: string; title: string }) {
  const { data: session } = useSession();
  const [discussion, setDiscussion] = useState<DiscussionState | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string>("Loading comments...");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/discussions/${slug}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await readJsonSafely(response);

        if (!response.ok) {
          setStatus(data?.error ?? "Comments are temporarily unavailable.");
          return;
        }

        setDiscussion(data?.discussion ?? null);
        setStatus(
          data?.discussion
            ? ""
            : data?.discussionsConfigured
              ? "No comments yet."
              : "Comments are not configured."
        );
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setStatus("Comments are temporarily unavailable.");
        }
      });

    return () => {
      controller.abort();
    };
  }, [slug]);

  const submitComment = () => {
    if (!message.trim()) {
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug, title, body: message })
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        setStatus(data?.error ?? "Unable to post comment right now.");
        return;
      }

      setMessage("");
      setDiscussion(data?.discussion ?? null);
      setStatus("Comment posted.");
    });
  };

  return (
    <section className="border-t border-[var(--border)] pt-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Comments</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{discussion?.comments.length ?? 0}</p>
        </div>
        {discussion?.url ? (
          <a href={discussion.url} target="_blank" rel="noreferrer" className="text-sm text-[var(--muted)] underline underline-offset-4">
            GitHub
          </a>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            {session?.user ? session.user.name ?? "Signed in" : "GitHub login required"}
          </p>

          {session?.user ? (
            <div className="space-y-3">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={`Comment on "${title}"`}
                rows={6}
                className="min-h-36 w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--border-strong)]"
              />
              <button
                type="button"
                disabled={isPending}
                onClick={submitComment}
                className="button-secondary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => signIn("github")} className="button-secondary w-full">
              Sign in
            </button>
          )}

          {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
        </div>

        <div>
          {discussion?.comments.length ? (
            <div>
              {discussion.comments.map((comment) => (
                <article key={comment.id} className="border-t border-[var(--border)] py-5 first:border-t-0 first:pt-0">
                  <div className="mb-3 flex items-center gap-3">
                    <Image
                      src={comment.author.avatarUrl}
                      alt={comment.author.login}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <a href={comment.author.url} target="_blank" rel="noreferrer" className="text-sm font-semibold">
                        {comment.author.login}
                      </a>
                      <p className="text-sm text-[var(--muted)]">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
                </article>
              ))}
            </div>
          ) : (
            <div className="border-t border-[var(--border)] py-5 text-sm text-[var(--muted)]">No comments</div>
          )}
        </div>
      </div>
    </section>
  );
}
