# Decision Log

Append-only record for reusable technical decisions.

## Decision
- Context: The repository needed stronger AI-agent workflow guidance and safer validation without making every task heavy and verbose.
- Options: Keep AGENTS.md minimal; adopt a strict always-structured workflow; use a scoped workflow that becomes strict only for non-trivial tasks.
- Chosen: Use a scoped workflow with planning, comparison, self-review, and logs required only for non-trivial work.
- Why: It preserves decision quality and traceability while avoiding token waste and process overhead on small edits.
- Trade-offs: The definition of non-trivial still needs judgment, but the document now narrows it enough to be practical.

## Decision
- Context: The project lacked fast local checks for content correctness and repository readiness.
- Options: Rely on runtime failures; add heavyweight tooling; add lightweight repo-native scripts.
- Chosen: Add lightweight Node-based scripts for content validation and project diagnostics.
- Why: They run without introducing new dependencies and catch common failures early for both humans and agents.
- Trade-offs: The checks are intentionally narrow and do not replace full runtime or integration coverage.

## Decision
- Context: The repository structure was small enough to navigate manually, but AI-agent work still depended on rediscovering which files owned each feature flow.
- Options: Leave orientation implicit in the folder tree; fully reorganize into feature folders; add a lightweight repo map and point existing docs to it.
- Chosen: Add a lightweight repo map document and use it as the primary orientation layer for non-trivial changes.
- Why: It lowers agent exploration cost without paying the churn of a structural refactor.
- Trade-offs: The map must stay current as flows expand, or it becomes stale documentation.

## Decision
- Context: Post frontmatter rules were duplicated between runtime parsing and the validation script, which made AI edits more error-prone.
- Options: Keep duplicate logic and sync manually; share only field names; move the full schema into one shared module.
- Chosen: Move the frontmatter schema into a shared TypeScript module and have both runtime loading and content validation consume it.
- Why: A single source of truth reduces drift and makes future schema changes smaller and safer.
- Trade-offs: The validation script now depends on Node's type-stripping support when importing the shared TypeScript module.

## Decision
- Context: The first shared-schema implementation introduced a Node module warning during content validation.
- Options: Accept the warning; switch the whole repository to package-level ESM; move the shared schema to an `.mts` module with explicit ESM semantics.
- Chosen: Rename the shared schema module to `.mts` and update both runtime and validation imports.
- Why: It removes the warning without changing repository-wide module behavior.
- Trade-offs: The project now uses a less common TypeScript module extension for this shared file.
