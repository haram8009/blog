# Failure Log

Append-only record for mistakes, fixes, and prevention rules.

## Failure / Correction
- Issue: `npm run check` initially failed because `tsc` was unavailable before dependencies were installed.
- Impact: Type validation could not run, so repository readiness was only partially verified.
- Fix: Installed dependencies, generated `package-lock.json`, and reran `npm run check` and `npm run build` successfully.
- Prevention rule: Run `npm install` before verification in fresh environments and let `codex:doctor` warn when `node_modules` is missing.
