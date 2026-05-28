import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "output", "doc-only-closeout.json");

const allowedPatterns = ["docs/**/*.md"];

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseArgs(argv) {
  const options = {
    base: "",
    head: "HEAD",
    files: [],
    stdin: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--base") {
      options.base = argv[index + 1] || "";
      index += 1;
    } else if (arg === "--head") {
      options.head = argv[index + 1] || "HEAD";
      index += 1;
    } else if (arg === "--file") {
      options.files.push(argv[index + 1] || "");
      index += 1;
    } else if (arg === "--files") {
      options.files.push(...(argv[index + 1] || "").split(/[,\n]/));
      index += 1;
    } else if (arg === "--stdin") {
      options.stdin = true;
    } else {
      options.files.push(arg);
    }
  }

  return options;
}

function readStdinFiles() {
  try {
    if (process.stdin.isTTY) {
      return [];
    }
    return readFileSync(0, "utf8").split(/\r?\n/);
  } catch {
    return [];
  }
}

function gitDiffNameOnly(base, head) {
  const range = base ? `${base}..${head || "HEAD"}` : "--cached";
  const args = base ? ["diff", "--name-only", range] : ["diff", "--name-only", range];
  const output = execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return output.split(/\r?\n/);
}

function getChangedFiles(options) {
  const explicitFiles = options.stdin ? [...options.files, ...readStdinFiles()] : options.files;
  if (explicitFiles.length > 0) {
    return unique(explicitFiles.map(normalizePath));
  }

  return unique(gitDiffNameOnly(options.base, options.head).map(normalizePath));
}

function isDocsMarkdown(filePath) {
  return /^docs\/.+\.md$/i.test(filePath);
}

function isPublicServedFile(filePath) {
  if (/^(index\.html|sitemap\.xml|robots\.txt)$/i.test(filePath)) {
    return true;
  }
  if (/^(assets|pictures)\//i.test(filePath)) {
    return true;
  }
  return /^[^/]+\.(?:html|xml|txt|jpg|jpeg|png|webp|gif|svg|ico|css|js)$/i.test(filePath);
}

function isCompiledBundle(filePath) {
  const knownCompiled = new Set([
    "assets/index-8f1a9bbc.js",
    "assets/vendor-fe05aed2.js",
    "assets/router-f3b8204e.js",
    "assets/ui-de6032b5.js",
    "assets/email-8e28982d.js",
    "assets/index-d1f664ce.css"
  ]);

  if (knownCompiled.has(filePath)) {
    return true;
  }

  if (/\.map$/i.test(filePath)) {
    return true;
  }

  return /^assets\/.+-[a-f0-9]{8,}\.(?:js|css)$/i.test(filePath);
}

function isWorkflowFile(filePath) {
  return /^\.github\/workflows\/.+\.ya?ml$/i.test(filePath);
}

function workflowLooksDeployRelated(filePath) {
  if (!isWorkflowFile(filePath)) {
    return false;
  }

  const absolutePath = path.join(repoRoot, filePath);
  let text = "";
  try {
    text = readFileSync(absolutePath, "utf8");
  } catch {
    text = "";
  }

  return /(deploy|ftp|ftps|sftp|scp|rsync|upload|secret|password|server)/i.test(`${filePath}\n${text}`);
}

function isDependencyFile(filePath) {
  return /(^|\/)(package\.json|package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|yarn\.lock|bun\.lockb?|\.npmrc)$/i.test(filePath);
}

function addMatch(matches, file, reason, matchedPattern) {
  matches.push({ file, reason, matchedPattern });
}

function buildReport(changedFiles) {
  const disallowedMatches = [];
  let publicServedFilesChanged = false;
  let compiledBundlesChanged = false;
  let deployLogicChanged = false;
  let dependencyFilesChanged = false;

  for (const file of changedFiles) {
    if (!isDocsMarkdown(file)) {
      addMatch(disallowedMatches, file, "outside allowed docs-only scope", allowedPatterns.join(", "));
    }

    if (isPublicServedFile(file)) {
      publicServedFilesChanged = true;
      addMatch(disallowedMatches, file, "public served file changed", "public served paths");
    }

    if (isCompiledBundle(file)) {
      compiledBundlesChanged = true;
      addMatch(disallowedMatches, file, "compiled bundle or source map changed", "compiled assets");
    }

    if (workflowLooksDeployRelated(file)) {
      deployLogicChanged = true;
      addMatch(disallowedMatches, file, "deploy workflow logic changed", ".github/workflows deploy logic");
    }

    if (isDependencyFile(file)) {
      dependencyFilesChanged = true;
      addMatch(disallowedMatches, file, "dependency or package file changed", "package/dependency files");
    }
  }

  const status = disallowedMatches.length === 0 ? "pass" : "fail";

  return {
    status,
    changedFiles,
    allowedPatterns,
    disallowedMatches,
    publicServedFilesChanged,
    compiledBundlesChanged,
    deployLogicChanged,
    dependencyFilesChanged
  };
}

function writeReport(report) {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

const options = parseArgs(process.argv.slice(2));
const changedFiles = getChangedFiles(options);
const report = buildReport(changedFiles);
writeReport(report);

console.log(`doc-only closeout status: ${report.status.toUpperCase()}`);
console.log(`changed files: ${report.changedFiles.length}`);
if (report.disallowedMatches.length) {
  for (const match of report.disallowedMatches) {
    console.log(`- ${match.file}: ${match.reason}`);
  }
}
console.log(`wrote ${path.relative(repoRoot, outputPath).replace(/\\/g, "/")}`);

if (report.status !== "pass") {
  process.exitCode = 1;
}
