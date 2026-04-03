import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { z } from "zod";

const postsDirectory = path.join(process.cwd(), "content", "posts");

const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  coverImage: z.string().optional(),
  discussionId: z.string().optional()
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type PostSummary = PostFrontmatter & {
  readingTime: string;
  excerpt: string;
  url: string;
};

export type Post = PostSummary & {
  content: string;
};

function getPostFilenames() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

function parsePostFile(filename: string) {
  const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = postFrontmatterSchema.parse(data);
  const stats = readingTime(content);

  return {
    frontmatter,
    content,
    excerpt: content.replace(/\s+/g, " ").trim().slice(0, 180),
    readingTime: stats.text
  };
}

export function getAllPosts(): PostSummary[] {
  return getPostFilenames()
    .map((filename) => parsePostFile(filename))
    .filter(({ frontmatter }) => frontmatter.published)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
    .map(({ frontmatter, excerpt, readingTime }) => ({
      ...frontmatter,
      excerpt,
      readingTime,
      tags: frontmatter.tags.map((tag) => tag.trim().toLowerCase()),
      url: `/blog/${frontmatter.slug}`
    }));
}

export function getAllTags() {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags))).sort();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filename = getPostFilenames().find((file) => file.replace(/\.md$/, "") === slug);

  if (!filename) {
    return null;
  }

  const { frontmatter, content, excerpt, readingTime } = parsePostFile(filename);

  if (!frontmatter.published) {
    return null;
  }

  const rendered = await remark().use(gfm).use(html).process(content);

  return {
    ...frontmatter,
    tags: frontmatter.tags.map((tag) => tag.trim().toLowerCase()),
    excerpt,
    readingTime,
    url: `/blog/${frontmatter.slug}`,
    content: rendered.toString()
  };
}

export function getRelatedPosts(slug: string, limit = 3) {
  const posts = getAllPosts();
  const current = posts.find((post) => post.slug === slug);

  if (!current) {
    return [];
  }

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score:
        post.tags.filter((tag) => current.tags.includes(tag)).length * 3 +
        (post.summary.includes(current.tags[0] ?? "") ? 1 : 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post, score }) => ({
      ...post,
      recommendationReason:
        score > 0 ? "Shared tags and topic overlap" : "Recent post from the same author",
      recommendationScore: score
    }));
}
