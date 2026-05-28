import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "output", "change-scope.json");

const knownCompiledBundles = new Set([
  "assets/index-8f1a9bbc.js",
  "assets/vendor-fe05aed2.js",
  "assets/router-f3b8204e.js",
  "assets/ui-de6032b5.js",
  "assets/email-8e28982d.js",
  "assets/index-d1f664ce.css"
]);

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
  const args = base
    ? ["diff", "--name-only", `${base}..${head || "HEAD"}`]
    : ["diff", "--name-only", "--cached"];

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

function isDocsFile(filePath) {
  return /^docs\/.+\.md$/i.test(filePath) || /^README\.md$/i.test(filePath);
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
  if (knownCompiledBundles.has(filePath)) {
    return true;
  }
  if (/\.map$/i.test(filePath)) {
    return true;
  }
  return /^assets\/.+-[a-f0-9]{8,}\.(?:js|css)$/i.test(filePath);
}

function isScriptFile(filePath) {
  return /^scripts\/.+\.(?:mjs|cjs|js)$/i.test(filePath);
}

function isWorkflowFile(filePath) {
  return /^\.github\/workflows\/.+\.ya?ml$/i.test(filePath);
}

function isDependencyFile(filePath) {
  return /(^|\/)(package\.json|package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|yarn\.lock|bun\.lockb?|\.npmrc)$/i.test(filePath);
}

function isConfigFile(filePath) {
  return /^(AGENTS\.md|\.gitignore|\.gitattributes|\.env\.example)$/i.test(filePath)
    || /^\.codex\//i.test(filePath)
    || /^\.github\/(?!workflows\/)/i.test(filePath);
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

function allFilesMatch(changedFiles, predicate) {
  return changedFiles.length > 0 && changedFiles.every(predicate);
}

function buildReasons(flags, changedFiles) {
  const reasons = [];

  if (changedFiles.length === 0) {
    reasons.push("No changed files were provided or detected.");
  }
  if (flags.docsChanged) {
    reasons.push("Documentation files changed.");
  }
  if (flags.publicServedFilesChanged) {
    reasons.push("Public served files changed, so a live deploy is required after approval.");
  }
  if (flags.compiledBundlesChanged) {
    reasons.push("Compiled bundle or source map files changed.");
  }
  if (flags.scriptsChanged) {
    reasons.push("Repository scripts changed.");
  }
  if (flags.workflowChanged) {
    reasons.push("GitHub workflow files changed.");
  }
  if (flags.deployLogicChanged) {
    reasons.push("Workflow content appears deploy-related.");
  }
  if (flags.dependencyFilesChanged) {
    reasons.push("Package or dependency governance files changed.");
  }
  if (flags.configChanged) {
    reasons.push("Repository configuration files changed.");
  }

  return reasons;
}

function classifyChangeScope(flags, changedFiles) {
  if (changedFiles.length === 0) {
    return "mixed";
  }

  if (flags.publicServedFilesChanged && allFilesMatch(changedFiles, isPublicServedFile)) {
    return "static_site_change";
  }

  if (flags.dependencyFilesChanged && allFilesMatch(changedFiles, isDependencyFile)) {
    return "dependency_change";
  }

  if (flags.workflowChanged && allFilesMatch(changedFiles, isWorkflowFile)) {
    return "ci_workflow";
  }

  if (flags.docsChanged && allFilesMatch(changedFiles, isDocsFile)) {
    return "docs_only";
  }

  const isGovernanceToolingFile = (filePath) => (
    isDocsFile(filePath)
    || isScriptFile(filePath)
    || isConfigFile(filePath)
  );

  if (allFilesMatch(changedFiles, isGovernanceToolingFile)) {
    return "governance_tooling";
  }

  if (flags.dependencyFilesChanged) {
    return "dependency_change";
  }

  if (flags.publicServedFilesChanged) {
    return "mixed";
  }

  if (flags.workflowChanged) {
    return "ci_workflow";
  }

  if (flags.scriptsChanged || flags.configChanged) {
    return "governance_tooling";
  }

  return "mixed";
}

function buildReport(changedFiles) {
  const flags = {
    docsChanged: changedFiles.some(isDocsFile),
    publicServedFilesChanged: changedFiles.some(isPublicServedFile),
    compiledBundlesChanged: changedFiles.some(isCompiledBundle),
    scriptsChanged: changedFiles.some(isScriptFile),
    workflowChanged: changedFiles.some(isWorkflowFile),
    deployLogicChanged: changedFiles.some(workflowLooksDeployRelated),
    dependencyFilesChanged: changedFiles.some(isDependencyFile),
    configChanged: changedFiles.some(isConfigFile)
  };

  const changeScope = classifyChangeScope(flags, changedFiles);
  const deployRequired = flags.publicServedFilesChanged;

  return {
    status: "pass",
    changedFiles,
    changeScope,
    deployRequired,
    ...flags,
    reasons: buildReasons(flags, changedFiles)
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

console.log(`change scope: ${report.changeScope}`);
console.log(`deploy required: ${report.deployRequired ? "true" : "false"}`);
console.log(`changed files: ${report.changedFiles.length}`);
for (const reason of report.reasons) {
  console.log(`- ${reason}`);
}
console.log(`wrote ${path.relative(repoRoot, outputPath).replace(/\\/g, "/")}`);
