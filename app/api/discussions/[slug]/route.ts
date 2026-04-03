import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";
import { getGitHubDiscussionConfig } from "@/lib/env";
import { getDiscussionForPost } from "@/lib/github-discussions";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = getAllPosts().find((item) => item.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const discussion = await getDiscussionForPost(post.slug, post.title, post.discussionId);
    return NextResponse.json({
      discussion,
      discussionsConfigured: getGitHubDiscussionConfig().configured
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load comments." },
      { status: 500 }
    );
  }
}
