# Docs Guide

This folder explains how the repository is planned, changed, and reviewed.

## What This Folder Is For

Use `docs/` for repository-facing documentation, not product content.

- `docs/repo-map.md`: fast orientation for humans and AI agents before non-trivial changes
- `docs/implementation-plan.md`: working plan or design notes for larger changes
- `docs/ai-logs/decision-log.md`: reusable technical decisions and trade-offs
- `docs/ai-logs/prompt-log.md`: prompt refinements worth keeping
- `docs/ai-logs/failure-log.md`: meaningful mistakes, fixes, and prevention rules
- `docs/ai-logs/work-summary.md`: concise append-only summary of meaningful completed tasks

## How This Repository Is Managed

The repository is intentionally lightweight.

- Product code lives in `app`, `components`, `lib`, and `content`
- Process documentation lives in `doc`
- Repository workflow policy lives in `AGENTS.md`
- Quick codebase entry points live in `docs/repo-map.md`

The goal is to keep changes small, reviewable, and verifiable.

## Working Rules

Before and after meaningful changes, run:

```bash
npm run check
npm run codex:doctor
```

These checks are used to keep both human and AI-assisted edits honest.

- `npm run check`: validates post content and runs TypeScript
- `npm run codex:doctor`: checks repository conventions and setup warnings

## Documentation Rules

- Keep docs concise and repository-specific
- Prefer append-only logs for decisions, failures, and work summaries
- Do not create speculative docs with no active workflow value
- If a document stops serving an active purpose, remove it instead of keeping stale structure

## For GitHub Readers

If you are browsing this repository on GitHub and want the fastest orientation path:

1. Read the main [README](../README.md)
2. Read [`AGENTS.md`](../AGENTS.md) for workflow policy
3. Read [`repo-map.md`](./repo-map.md) for feature ownership and entry points
4. Check `docs/ai-logs/` if you want decision history for non-trivial changes
