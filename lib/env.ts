const DEFAULT_SITE_URL = "http://localhost:3000";

const discussionEnvKeys = [
  "GITHUB_OWNER",
  "GITHUB_REPO",
  "GITHUB_TOKEN",
  "GITHUB_DISCUSSION_CATEGORY_ID"
] as const;

type DiscussionEnvKey = (typeof discussionEnvKeys)[number];

export function getSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getGitHubDiscussionConfig() {
  const values = {
    GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_DISCUSSION_CATEGORY_ID: process.env.GITHUB_DISCUSSION_CATEGORY_ID
  } satisfies Record<DiscussionEnvKey, string | undefined>;

  const missing = discussionEnvKeys.filter((key) => !values[key]);

  if (missing.length > 0) {
    return {
      configured: false as const,
      missing
    };
  }

  return {
    configured: true as const,
    owner: values.GITHUB_OWNER!,
    repo: values.GITHUB_REPO!,
    token: values.GITHUB_TOKEN!,
    categoryId: values.GITHUB_DISCUSSION_CATEGORY_ID!
  };
}
