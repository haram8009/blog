import { getGitHubDiscussionConfig } from "@/lib/env";

const GITHUB_API_URL = "https://api.github.com/graphql";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export type DiscussionComment = {
  id: string;
  bodyHtml: string;
  createdAt: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
};

export type DiscussionThread = {
  id: string;
  number: number;
  title: string;
  url: string;
  comments: DiscussionComment[];
};

type DiscussionNode = {
  id: string;
  number: number;
  title: string;
  url: string;
  comments: {
    nodes: Array<{
      id: string;
      bodyHTML: string;
      createdAt: string;
      author: {
        login: string;
        avatarUrl: string;
        url: string;
      } | null;
    }>;
  };
};

function getRepoEnv() {
  const config = getGitHubDiscussionConfig();

  if (!config.configured) {
    return null;
  }

  return config;
}

async function githubGraphQL<T>(query: string, variables: Record<string, unknown>, token: string) {
  const response = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Unknown GitHub API error");
  }

  return payload.data as T;
}

function normalizeDiscussion(node: DiscussionNode): DiscussionThread {
  return {
    id: node.id,
    number: node.number,
    title: node.title,
    url: node.url,
    comments: node.comments.nodes
      .filter((comment) => Boolean(comment.author))
      .map((comment) => ({
        id: comment.id,
        bodyHtml: comment.bodyHTML,
        createdAt: comment.createdAt,
        author: {
          login: comment.author!.login,
          avatarUrl: comment.author!.avatarUrl,
          url: comment.author!.url
        }
      }))
  };
}

export async function getDiscussionForPost(slug: string, title: string, discussionId?: string) {
  const env = getRepoEnv();

  if (!env) {
    return null;
  }

  if (discussionId) {
    const data = await githubGraphQL<{ node: DiscussionNode | null }>(
      `
        query DiscussionById($id: ID!) {
          node(id: $id) {
            ... on Discussion {
              id
              number
              title
              url
              comments(first: 20) {
                nodes {
                  id
                  bodyHTML
                  createdAt
                  author {
                    login
                    avatarUrl
                    url
                  }
                }
              }
            }
          }
        }
      `,
      { id: discussionId },
      env.token
    );

    return data.node ? normalizeDiscussion(data.node) : null;
  }

  const data = await githubGraphQL<{
    repository: {
      discussions: {
        nodes: DiscussionNode[];
      };
    };
  }>(
    `
      query FindDiscussion($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 30, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              id
              number
              title
              url
              comments(first: 20) {
                nodes {
                  id
                  bodyHTML
                  createdAt
                  author {
                    login
                    avatarUrl
                    url
                  }
                }
              }
            }
          }
        }
      }
    `,
    { owner: env.owner, repo: env.repo },
    env.token
  );

  const stableTitle = `Post: ${slug}`;
  const matched =
    data.repository.discussions.nodes.find((node) => node.title === stableTitle) ??
    data.repository.discussions.nodes.find((node) => node.title === title);

  return matched ? normalizeDiscussion(matched) : null;
}

export async function ensureDiscussionForPost(slug: string, title: string, discussionId?: string) {
  const existing = await getDiscussionForPost(slug, title, discussionId);

  if (existing) {
    return existing;
  }

  const env = getRepoEnv();

  if (!env) {
    return null;
  }

  const data = await githubGraphQL<{
    createDiscussion: {
      discussion: DiscussionNode;
    };
  }>(
    `
      mutation CreateDiscussion($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
        createDiscussion(
          input: {
            repositoryId: $repositoryId
            categoryId: $categoryId
            title: $title
            body: $body
          }
        ) {
          discussion {
            id
            number
            title
            url
            comments(first: 20) {
              nodes {
                id
                bodyHTML
                createdAt
                author {
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }
      }
    `,
    {
      repositoryId: await getRepositoryId(env.owner, env.repo, env.token),
      categoryId: env.categoryId,
      title: `Post: ${slug}`,
      body: `Comments thread for "${title}".`
    },
    env.token
  );

  return normalizeDiscussion(data.createDiscussion.discussion);
}

async function getRepositoryId(owner: string, repo: string, token: string) {
  const data = await githubGraphQL<{
    repository: {
      id: string;
    };
  }>(
    `
      query RepositoryId($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          id
        }
      }
    `,
    { owner, repo },
    token
  );

  return data.repository.id;
}

export async function addDiscussionComment(discussionId: string, body: string, token: string) {
  return githubGraphQL<{
    addDiscussionComment: {
      comment: {
        id: string;
      };
    };
  }>(
    `
      mutation AddDiscussionComment($discussionId: ID!, $body: String!) {
        addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
          comment {
            id
          }
        }
      }
    `,
    { discussionId, body },
    token
  );
}
