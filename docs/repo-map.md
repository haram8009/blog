# Repo Map

Fast orientation guide for humans and AI agents working in this repository.

## Primary Flows

### Content posts

- Source files: `content/posts/*.md`
- Runtime loading: `lib/content.ts`
- Validation: `scripts/validate-content.mjs`
- Rendering: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

Use this path for:

- adding or editing posts
- changing frontmatter requirements
- debugging missing or invalid post metadata

Notes:

- `slug` must match the markdown filename
- required frontmatter is enforced by the validation script
- published filtering happens in runtime content loading

### Comments and discussions

- Client UI: `components/comment-panel.tsx`
- Read discussion API: `app/api/discussions/[slug]/route.ts`
- Write comment API: `app/api/comments/route.ts`
- GitHub integration: `lib/github-discussions.ts`
- Env/config boundary: `lib/env.ts`

Use this path for:

- signed-in vs anonymous comment behavior
- GitHub Discussions fallback handling
- comment posting failures

Notes:

- comments must fail gracefully when GitHub Discussions env vars are missing
- for comment-flow changes, verify both anonymous and signed-in behavior

### Auth

- Auth options: `lib/auth.ts`
- Route handler: `app/api/auth/[...nextauth]/route.ts`
- Session provider: `components/providers.tsx`

Use this path for:

- GitHub login changes
- session availability in client components

### Site and metadata

- Shared site config: `lib/site.ts`, `lib/utils.ts`
- Layout shell: `app/layout.tsx`
- Home page: `app/page.tsx`
- Static metadata routes: `app/sitemap.ts`, `app/robots.ts`

Use this path for:

- metadata, URLs, and shared layout behavior
- site-wide navigation or footer changes

## Checks

Run before and after meaningful changes:

```bash
npm run check
npm run codex:doctor
```

What they cover:

- `npm run check`: content validation and TypeScript
- `npm run codex:doctor`: repository structure and setup warnings

If tooling is missing:

```bash
npm install
```

## Environment Boundaries

- Copy `.env.example` to `.env.local`
- Missing GitHub Discussions config should not break page rendering
- Missing auth config should be treated as an integration setup problem, not a reason to make the app dynamic by default

## Navigation Tips For Agents

- Start from the nearest flow above instead of scanning the whole repository.
- Treat `AGENTS.md` as workflow policy and this document as codebase orientation.
- When using shell commands with App Router dynamic segments, quote paths such as `'app/blog/[slug]/page.tsx'`.
