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
