import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";
import { getGitHubDiscussionConfig, getSiteUrl } from "@/lib/env";

export async function GET() {
  const discussions = getGitHubDiscussionConfig();

  return NextResponse.json({
    ok: true,
    postCount: getAllPosts().length,
    siteUrl: getSiteUrl(),
    discussionsConfigured: discussions.configured,
    missingDiscussionEnv: discussions.configured ? [] : discussions.missing
  });
}
