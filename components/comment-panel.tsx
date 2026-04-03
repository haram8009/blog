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
              ? "No comments yet. Be the first to start the conversation."
              : "Comments are not configured for this deployment yet."
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
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Comments</p>
          <h2 className="font-[Trebuchet_MS] text-2xl font-semibold">Join the discussion</h2>
        </div>
        {discussion?.url ? (
          <a href={discussion.url} target="_blank" rel="noreferrer" className="font-[Trebuchet_MS] text-sm font-semibold text-[var(--accent-strong)]">
            Open in GitHub Discussions
          </a>
        ) : null}
      </div>

      <div className="mb-6 rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
        <p className="mb-3 text-sm text-[var(--muted)]">
          {session?.user ? `Signed in as ${session.user.name ?? "GitHub user"}` : "Sign in with GitHub to post a comment."}
        </p>
        {session?.user ? (
          <>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={`Share a thought about "${title}"`}
              rows={4}
              className="mb-3 w-full resize-none rounded-2xl border border-[var(--border)] p-4 outline-none"
            />
            <button
              type="button"
              disabled={isPending}
              onClick={submitComment}
              className="rounded-full bg-[var(--accent)] px-5 py-2 font-[Trebuchet_MS] text-sm font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Posting..." : "Post comment"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => signIn("github")}
            className="rounded-full bg-[var(--foreground)] px-5 py-2 font-[Trebuchet_MS] text-sm font-semibold text-white"
          >
            Sign in with GitHub
          </button>
        )}
      </div>

      {status ? <p className="mb-4 text-sm text-[var(--muted)]">{status}</p> : null}

      <div className="space-y-4">
        {discussion?.comments.map((comment) => (
          <article key={comment.id} className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={comment.author.avatarUrl}
                alt={comment.author.login}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <a href={comment.author.url} target="_blank" rel="noreferrer" className="font-[Trebuchet_MS] font-semibold">
                  {comment.author.login}
                </a>
                <p className="text-sm text-[var(--muted)]">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
          </article>
        ))}
      </div>
    </section>
  );
}
