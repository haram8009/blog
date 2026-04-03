# Dev Log

A `Next.js` portfolio blog for a junior developer with:

- Markdown-based posts
- GitHub login via `next-auth`
- GitHub Discussions-backed comments
- Search and tag filtering
- Recommendation-ready post metadata

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill in the GitHub OAuth and Discussions environment variables.
4. Run `npm run dev`.

## Recommended checks

- Run `npm run check` before opening or merging changes.
- Run `npm run codex:doctor` when setting up a fresh environment or before asking Codex to make larger edits.
- Read `AGENTS.md` for repository-specific workflow notes.
- Read `docs/README.md` to understand how this repository is documented and maintained.
- Read `docs/repo-map.md` for a fast codebase entry map before making multi-file changes.
- If `npm run check` fails with missing tooling such as `tsc`, run `npm install` first.

## Required environment variables

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_TOKEN`
- `GITHUB_DISCUSSION_CATEGORY_ID`
- `NEXT_PUBLIC_SITE_URL`

## Notes

- Posts live in `content/posts`.
- Each post uses frontmatter for metadata.
- If `GITHUB_TOKEN` or discussion configuration is missing, comments will render but API-backed discussion loading will fail gracefully.
- `npm run validate:content` verifies markdown frontmatter and catches slug/date/schema mistakes early.
- No lockfile is committed yet. Add one if you want reproducible installs across machines and agents.
