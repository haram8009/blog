import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ZodError } from "zod";
import {
  postFrontmatterSchema,
  requiredPostFrontmatterFields
} from "../lib/content-schema.mts";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "content", "posts");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function parseFrontmatter(raw, filename) {
  try {
    return matter(raw).data;
  } catch {
    throw new Error(`${filename}: missing or invalid frontmatter block`);
  }
}

function formatZodIssue(issue) {
  const pathLabel = issue.path.join(".");

  if (issue.code === "invalid_type" && issue.received === "undefined" && pathLabel) {
    return `missing required field "${pathLabel}"`;
  }

  if (pathLabel) {
    return `${pathLabel}: ${issue.message}`;
  }

  return issue.message;
}

if (!fs.existsSync(postsDir)) {
  fail("content/posts directory is missing");
} else {
  const filenames = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md")).sort();
  const seenSlugs = new Set();

  if (filenames.length === 0) {
    fail("content/posts does not contain any markdown posts");
  }

  for (const filename of filenames) {
    const fullPath = path.join(postsDir, filename);
    const raw = fs.readFileSync(fullPath, "utf8");

    try {
      const frontmatter = parseFrontmatter(raw, filename);
      const missingRequiredFields = requiredPostFrontmatterFields.filter(
        (field) => !(field in frontmatter)
      );

      for (const field of missingRequiredFields) {
        fail(`${filename}: missing required field "${field}"`);
      }

      const parsedFrontmatter = postFrontmatterSchema.parse(frontmatter);

      const expectedSlug = filename.replace(/\.md$/, "");

      if (parsedFrontmatter.slug !== expectedSlug) {
        fail(`${filename}: slug must match filename ("${expectedSlug}")`);
      }

      if (seenSlugs.has(parsedFrontmatter.slug)) {
        fail(`${filename}: duplicate slug "${parsedFrontmatter.slug}"`);
      }

      seenSlugs.add(parsedFrontmatter.slug);
    } catch (error) {
      if (error instanceof ZodError) {
        for (const issue of error.issues) {
          fail(`${filename}: ${formatZodIssue(issue)}`);
        }
        continue;
      }

      fail(error instanceof Error ? error.message : `${filename}: unable to parse frontmatter`);
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("Content validation passed.");
