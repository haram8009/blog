import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "content", "posts");
const requiredFields = ["title", "slug", "date", "summary", "tags", "published"];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function parseFrontmatter(raw, filename) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error(`${filename}: missing frontmatter block`);
  }

  const lines = match[1].split("\n");
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    const fieldMatch = line.match(/^([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*)$/);

    if (!fieldMatch) {
      continue;
    }

    const [, key, rawValue] = fieldMatch;

    if (rawValue === "") {
      const items = [];
      let cursor = index + 1;

      while (cursor < lines.length) {
        const itemMatch = lines[cursor].match(/^\s*-\s+(.*)$/);

        if (!itemMatch) {
          break;
        }

        items.push(stripQuotes(itemMatch[1].trim()));
        cursor += 1;
      }

      data[key] = items;
      index = cursor - 1;
      continue;
    }

    data[key] = normalizeScalar(rawValue.trim());
  }

  return data;
}

function normalizeScalar(value) {
  const unquoted = stripQuotes(value);

  if (unquoted === "true") {
    return true;
  }

  if (unquoted === "false") {
    return false;
  }

  return unquoted;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
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

      for (const field of requiredFields) {
        if (!(field in frontmatter)) {
          fail(`${filename}: missing required field "${field}"`);
        }
      }

      if (typeof frontmatter.title !== "string" || frontmatter.title.trim() === "") {
        fail(`${filename}: title must be a non-empty string`);
      }

      if (typeof frontmatter.slug !== "string" || frontmatter.slug.trim() === "") {
        fail(`${filename}: slug must be a non-empty string`);
      }

      const expectedSlug = filename.replace(/\.md$/, "");

      if (frontmatter.slug !== expectedSlug) {
        fail(`${filename}: slug must match filename ("${expectedSlug}")`);
      }

      if (seenSlugs.has(frontmatter.slug)) {
        fail(`${filename}: duplicate slug "${frontmatter.slug}"`);
      }

      seenSlugs.add(frontmatter.slug);

      if (!isValidDateString(frontmatter.date)) {
        fail(`${filename}: date must use YYYY-MM-DD`);
      }

      if (typeof frontmatter.summary !== "string" || frontmatter.summary.trim() === "") {
        fail(`${filename}: summary must be a non-empty string`);
      }

      if (!Array.isArray(frontmatter.tags)) {
        fail(`${filename}: tags must be a list`);
      } else if (frontmatter.tags.some((tag) => typeof tag !== "string" || tag.trim() === "")) {
        fail(`${filename}: tags must contain only non-empty strings`);
      }

      if (typeof frontmatter.published !== "boolean") {
        fail(`${filename}: published must be true or false`);
      }
    } catch (error) {
      fail(error instanceof Error ? error.message : `${filename}: unable to parse frontmatter`);
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("Content validation passed.");
