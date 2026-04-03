import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const expectedEnvKeys = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GITHUB_ID",
  "GITHUB_SECRET",
  "GITHUB_OWNER",
  "GITHUB_REPO",
  "GITHUB_TOKEN",
  "GITHUB_DISCUSSION_CATEGORY_ID",
  "NEXT_PUBLIC_SITE_URL"
];
const requiredScripts = ["dev", "build", "start", "typecheck", "validate:content", "check", "codex:doctor"];
const requiredFiles = ["README.md", "AGENTS.md", "package.json", "tsconfig.json", ".env.example"];
const warnings = [];
const errors = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

function requireFile(relativePath) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function warn(message) {
  warnings.push(message);
}

function error(message) {
  errors.push(message);
}

for (const file of requiredFiles) {
  requireFile(file);
}

const packageJson = readJson("package.json");
const envExamplePath = path.join(rootDir, ".env.example");
const envLines = fs.existsSync(envExamplePath)
  ? fs
      .readFileSync(envExamplePath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
  : [];

const envKeys = new Set(envLines.map((line) => line.split("=")[0]));

for (const key of expectedEnvKeys) {
  if (!envKeys.has(key)) {
    error(`.env.example is missing ${key}`);
  }
}

for (const scriptName of requiredScripts) {
  if (!packageJson.scripts?.[scriptName]) {
    error(`package.json is missing the "${scriptName}" script`);
  }
}

if (!fs.existsSync(path.join(rootDir, "package-lock.json"))) {
  warn("No lockfile found. Reproducible installs will be weaker until a lockfile is committed.");
}

if (!fs.existsSync(path.join(rootDir, "node_modules"))) {
  warn("node_modules is missing. Install dependencies before running typecheck or build commands.");
}

if (!fs.existsSync(path.join(rootDir, ".env.local"))) {
  warn(".env.local is missing. Runtime integrations will stay in graceful-fallback mode.");
}

if (!fs.existsSync(path.join(rootDir, "content", "posts"))) {
  error("content/posts directory is missing");
}

if (errors.length > 0) {
  console.error("Project check failed:");
  for (const item of errors) {
    console.error(`- ${item}`);
  }
  if (warnings.length > 0) {
    console.error("Warnings:");
    for (const item of warnings) {
      console.error(`- ${item}`);
    }
  }
  process.exit(1);
}

console.log("Project structure check passed.");

if (warnings.length > 0) {
  console.log("Warnings:");
  for (const item of warnings) {
    console.log(`- ${item}`);
  }
}
