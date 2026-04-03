import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAllPosts } from "@/lib/content";
import { addDiscussionComment, ensureDiscussionForPost, getDiscussionForPost } from "@/lib/github-discussions";

const commentPayloadSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().optional(),
  body: z.string().trim().min(1).max(5000)
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "You must sign in with GitHub to comment." }, { status: 401 });
  }

  const parsed = commentPayloadSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Missing post slug or comment body." }, { status: 400 });
  }

  const payload = parsed.data;

  const post = getAllPosts().find((item) => item.slug === payload.slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  try {
    const discussion = await ensureDiscussionForPost(post.slug, post.title, post.discussionId);

    if (!discussion) {
      return NextResponse.json({ error: "GitHub Discussions is not configured yet." }, { status: 503 });
    }

    await addDiscussionComment(discussion.id, payload.body, session.user.accessToken);
    const updated = await getDiscussionForPost(post.slug, post.title, discussion.id);

    return NextResponse.json({ discussion: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to post comment." },
      { status: 500 }
    );
  }
}
