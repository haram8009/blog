# Junior Developer Blog Implementation Plan

## Overview

This project is a personal portfolio blog for a junior developer built with `Next.js`, `TypeScript`, and Markdown-based content.

The product goals are:

- Present the developer clearly to recruiters and teammates
- Publish learning notes and project writeups through a lightweight Git-based workflow
- Allow public readers to browse posts without login
- Allow authenticated GitHub users to leave comments
- Keep the content model simple now while preserving room for future AI-based reader recommendations

## Product Scope

### Core pages

- `Home`: intro, featured projects, latest posts, clear CTA
- `About`: developer background and goals
- `Projects`: portfolio entries with stack and status
- `Blog`: searchable post index with tag filtering
- `Post`: rendered Markdown article with comments and related-post surface
- `Contact`: simple contact points

### V1 included

- Markdown authoring in-repo
- GitHub OAuth login
- GitHub Discussions-backed comments
- Search and tag filtering on blog index
- SEO basics: metadata, canonical URLs, sitemap, robots

### Out of scope for v1

- Browser-based CMS
- Multi-author publishing
- Custom comment moderation tooling
- Analytics dashboards
- AI-generated writing or authoring assistant flows

## Technical Decisions

### App stack

- Framework: `Next.js` App Router
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- Deployment target: `Vercel`

### Content source

Posts are stored in `content/posts/*.md`.

Markdown remains the source of truth because:

- it is simple for a junior developer workflow
- it works naturally with Git and code review
- it avoids unnecessary CMS complexity in v1
- it does not block future AI recommendation features

### Authentication

- Auth provider: `GitHub` only
- Session handling: `next-auth`
- Anyone can read posts and comments
- Only signed-in GitHub users can post comments

### Comment system

- Backend: `GitHub Discussions`
- Each post is mapped to a stable Discussion thread
- UI should avoid raw GitHub API coupling by using normalized internal data shapes
- If GitHub Discussions is not configured, the UI should fail gracefully

## Content Model

Each Markdown post uses frontmatter with this schema:

```yaml
title: string
slug: string
date: string
summary: string
tags: string[]
published: boolean
coverImage: string | optional
discussionId: string | optional
```

Derived post metadata:

- `readingTime`
- `url`
- normalized `tags`
- `excerpt`

Project data should be typed separately from posts and used for homepage and project listings.

## Page-Level Behavior

### Home

- Show brief personal intro
- Show featured projects
- Show latest blog posts
- Reinforce the blog as proof of growth and engineering thinking

### Blog index

- Render all published posts
- Support text search across title, summary, and excerpt
- Support tag filtering
- Handle empty search/filter states cleanly

### Post detail

- Render Markdown content
- Show publish date and reading time
- Show tags
- Show public comments section
- Show recommendation-ready related posts area

## Auth and Comment Flow

### Read flow

1. User opens a blog post
2. Post content is available without login
3. Comments are loaded from GitHub Discussions through an internal API route
4. If no discussion exists or configuration is missing, the UI shows a safe fallback message

### Write flow

1. Anonymous user sees sign-in CTA
2. User signs in with GitHub
3. Comment form becomes available
4. Backend resolves or creates the matching Discussion thread
5. Comment is posted to GitHub Discussions
6. Updated comments are returned to the UI

## AI Recommendation Readiness

The future AI feature is `reader recommendations`, not AI writing assistance.

V1 should prepare for that by keeping clean metadata available:

- tags
- title
- summary
- date
- excerpt
- related topic information when useful

Important architectural rule:

- AI recommendation logic must stay separate from the content source
- Markdown should remain the authoring system even if recommendation logic later uses embeddings or an external service
- A future CMS migration should not require rewriting page-level recommendation UI

## SEO and Discoverability

The app should include:

- page metadata
- per-post metadata
- canonical URLs
- Open Graph basics
- sitemap generation
- robots configuration

Public posts must remain crawlable without requiring authentication.

## Environment Variables

The following configuration is required for local and deployed environments:

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GITHUB_ID=
GITHUB_SECRET=
GITHUB_OWNER=
GITHUB_REPO=
GITHUB_TOKEN=
GITHUB_DISCUSSION_CATEGORY_ID=
NEXT_PUBLIC_SITE_URL=
```

## Validation Checklist

- Markdown parsing works and frontmatter is validated
- Blog index routes and post routes generate correctly
- Search and tag filtering behave correctly
- GitHub sign-in/sign-out works
- Anonymous users cannot post comments
- Authenticated users can post comments
- Discussion resolution handles missing thread and API failure cases
- Mobile and desktop layouts remain usable
- Public pages stay accessible without login

## Notes for Future Iteration

- Add a browser-based CMS only if Markdown authoring becomes a bottleneck
- Add recommendation service boundaries before introducing AI dependencies
- Consider richer related-post ranking once there is enough content volume
- Add moderation or abuse controls only if public usage makes them necessary
