import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const results = [];

function repoPath(filePath) {
  return path.join(repoRoot, filePath);
}

function readText(filePath) {
  return readFileSync(repoPath(filePath), "utf8");
}

function record(group, name, passed, details = "") {
  results.push({ group, name, passed, details });
}

function assertCheck(condition, group, name, details = "") {
  record(group, name, Boolean(condition), details);
}

function countOccurrences(text, needle) {
  if (!needle) {
    return 0;
  }

  let count = 0;
  let index = text.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(needle, index + needle.length);
  }
  return count;
}

function findForbiddenTerms(files, terms) {
  const matches = [];

  for (const file of files) {
    const text = readText(file);
    for (const term of terms) {
      if (text.includes(term)) {
        matches.push(`${file}: ${term}`);
      }
    }
  }

  return matches;
}

function parseJsonLdFromHtml(html) {
  const blocks = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = regex.exec(html);

  while (match) {
    blocks.push(JSON.parse(match[1].trim()));
    match = regex.exec(html);
  }

  return blocks;
}

function flattenJsonLd(value) {
  if (Array.isArray(value)) {
    return value.flatMap(flattenJsonLd);
  }

  if (value && typeof value === "object") {
    const nested = Array.isArray(value["@graph"]) ? value["@graph"].flatMap(flattenJsonLd) : [];
    return [value, ...nested];
  }

  return [];
}

function hasType(item, type) {
  const itemType = item && item["@type"];
  return itemType === type || (Array.isArray(itemType) && itemType.includes(type));
}

function xmlLooksWellFormed(xml) {
  const stack = [];
  const tagRegex = /<[^>]+>/g;
  let match = tagRegex.exec(xml);

  while (match) {
    const tag = match[0];
    match = tagRegex.exec(xml);

    if (
      tag.startsWith("<?") ||
      tag.startsWith("<!--") ||
      tag.startsWith("<!") ||
      tag.endsWith("/>")
    ) {
      continue;
    }

    if (tag.startsWith("</")) {
      const closingName = tag.slice(2, -1).trim();
      if (stack.pop() !== closingName) {
        return false;
      }
      continue;
    }

    const openName = tag.slice(1, -1).trim().split(/\s+/)[0];
    stack.push(openName);
  }

  return stack.length === 0;
}

function printSummary() {
  const groups = [...new Set(results.map((result) => result.group))];

  for (const group of groups) {
    console.log(`\n${group}`);
    for (const result of results.filter((item) => item.group === group)) {
      const prefix = result.passed ? "  PASS" : "  FAIL";
      const suffix = result.details ? ` - ${result.details}` : "";
      console.log(`${prefix} ${result.name}${suffix}`);
    }
  }

  const failures = results.filter((result) => !result.passed);
  if (failures.length) {
    console.log("\nFAIL static snapshot verification");
    for (const failure of failures) {
      const suffix = failure.details ? `: ${failure.details}` : "";
      console.log(`- ${failure.group} / ${failure.name}${suffix}`);
    }
    process.exitCode = 1;
  } else {
    console.log("\nPASS static snapshot verification");
  }
}

const requiredFiles = [
  "index.html",
  "sitemap.xml",
  "robots.txt",
  "assets/nisbel-map-address-override.js",
  "assets/nisbel-seo-trust-override.js",
  "assets/nisbel-mobile-conversion.js",
  "assets/nisbel-trust-content-blocks.js",
  "assets/nisbel-conversion-hero-services.js"
];

for (const file of requiredFiles) {
  assertCheck(existsSync(repoPath(file)), "files", file, existsSync(repoPath(file)) ? "" : "missing");
}

const indexHtml = readText("index.html");
const sitemapXml = readText("sitemap.xml");
const robotsTxt = readText("robots.txt");
const addressOverrideScript = readText("assets/nisbel-map-address-override.js");
const mobileScript = readText("assets/nisbel-mobile-conversion.js");
const trustScript = readText("assets/nisbel-trust-content-blocks.js");

const runtimeScriptRefs = [
  "./assets/nisbel-map-address-override.js",
  "./assets/nisbel-seo-trust-override.js",
  "./assets/nisbel-mobile-conversion.js",
  "./assets/nisbel-trust-content-blocks.js",
  "./assets/nisbel-conversion-hero-services.js"
];

for (const ref of runtimeScriptRefs) {
  assertCheck(indexHtml.includes(ref), "index references", ref);
}

const compiledAssetRefs = [
  "./assets/index-8f1a9bbc.js",
  "./assets/vendor-fe05aed2.js",
  "./assets/router-f3b8204e.js",
  "./assets/ui-de6032b5.js",
  "./assets/email-8e28982d.js",
  "./assets/index-d1f664ce.css"
];

for (const ref of compiledAssetRefs) {
  assertCheck(indexHtml.includes(ref), "index references", ref);
}

const publicFiles = [
  "index.html",
  "sitemap.xml",
  "robots.txt",
  "assets/nisbel-map-address-override.js",
  "assets/nisbel-seo-trust-override.js",
  "assets/nisbel-mobile-conversion.js",
  "assets/nisbel-trust-content-blocks.js",
  "assets/nisbel-conversion-hero-services.js"
];

const strictPublicForbiddenTerms = [
  "Minimalistlik UI",
  "aggregateRating",
  "reviewCount",
  "ratingValue",
  "\"@type\": \"Review\"",
  "\"@type\":\"Review\""
];

const publicMatches = findForbiddenTerms(publicFiles, strictPublicForbiddenTerms);
assertCheck(
  publicMatches.length === 0,
  "forbidden public terms",
  "strict served-file scan",
  publicMatches.join("; ")
);

const publicFilesExceptAddressOverride = publicFiles.filter(
  (file) => file !== "assets/nisbel-map-address-override.js"
);
const oldAddressMatches = findForbiddenTerms(publicFilesExceptAddressOverride, ["Pärnu mnt", "Parnu mnt"]);
assertCheck(
  oldAddressMatches.length === 0,
  "forbidden public terms",
  "old address outside replacement script",
  oldAddressMatches.join("; ")
);

assertCheck(addressOverrideScript.includes("Liivametsa tn 6-3"), "address override", "new address present");
assertCheck(
  addressOverrideScript.includes("Pärnu mnt") || addressOverrideScript.includes("Parnu mnt"),
  "address override",
  "old address replacement patterns present"
);

const docsFiles = ["docs/REPO_STATE.md", "docs/OPERATIONS.md", "README.md"];
const docsForbiddenTerms = [
  "Minimalistlik UI",
  "Pärnu mnt",
  "Parnu mnt",
  "aggregateRating",
  "reviewCount",
  "ratingValue",
  "\"@type\": \"Review\"",
  "\"@type\":\"Review\"",
  "4.9",
  "150"
];
const docsMatches = findForbiddenTerms(docsFiles, docsForbiddenTerms);
assertCheck(
  docsMatches.length === 0,
  "forbidden public terms",
  "docs soft scan",
  docsMatches.join("; ")
);

assertCheck(xmlLooksWellFormed(sitemapXml), "sitemap", "XML looks well formed");
assertCheck(sitemapXml.includes("<loc>https://nisbel.ee/</loc>"), "sitemap", "canonical loc present");
assertCheck(sitemapXml.includes("<lastmod>2026-05-28</lastmod>"), "sitemap", "lastmod 2026-05-28 present");
assertCheck(!sitemapXml.includes("#services"), "sitemap", "no #services fragment");
assertCheck(!sitemapXml.includes("#about"), "sitemap", "no #about fragment");
assertCheck(!sitemapXml.includes("#contact"), "sitemap", "no #contact fragment");
assertCheck(!sitemapXml.includes("<priority>"), "sitemap", "no priority");
assertCheck(!sitemapXml.includes("<changefreq>"), "sitemap", "no changefreq");

assertCheck(robotsTxt.includes("User-agent: *"), "robots", "User-agent");
assertCheck(robotsTxt.includes("Allow: /"), "robots", "Allow root");
assertCheck(robotsTxt.includes("Sitemap: https://nisbel.ee/sitemap.xml"), "robots", "Sitemap URL");

let jsonLdBlocks = [];
try {
  jsonLdBlocks = parseJsonLdFromHtml(indexHtml);
  record("JSON-LD", "all blocks parse", true, `${jsonLdBlocks.length} blocks`);
} catch (error) {
  record("JSON-LD", "all blocks parse", false, error.message);
}

const flattenedJsonLd = jsonLdBlocks.flatMap(flattenJsonLd);
const autoRepair = flattenedJsonLd.find((item) => hasType(item, "AutoRepair"));
assertCheck(Boolean(autoRepair), "JSON-LD", "AutoRepair object present");
assertCheck(Boolean(autoRepair) && !Object.prototype.hasOwnProperty.call(autoRepair, "aggregateRating"), "JSON-LD", "AutoRepair has no aggregateRating");
assertCheck(!flattenedJsonLd.some((item) => hasType(item, "Review")), "JSON-LD", "no Review object");
assertCheck(Boolean(autoRepair?.address?.streetAddress?.includes("Liivametsa tn 6-3")), "JSON-LD", "AutoRepair street address");
assertCheck(autoRepair?.address?.addressLocality === "Tallinn", "JSON-LD", "AutoRepair locality");
assertCheck(autoRepair?.address?.addressCountry === "EE", "JSON-LD", "AutoRepair country");
assertCheck(Boolean(autoRepair?.telephone), "JSON-LD", "AutoRepair telephone");
assertCheck(Boolean(autoRepair?.openingHours || autoRepair?.openingHoursSpecification), "JSON-LD", "AutoRepair opening hours");
assertCheck(Boolean(autoRepair?.hasMap), "JSON-LD", "AutoRepair hasMap");
assertCheck(Boolean(autoRepair?.areaServed), "JSON-LD", "AutoRepair areaServed");

const noscriptMatch = indexHtml.match(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/i);
const noscriptText = noscriptMatch ? noscriptMatch[1] : "";
assertCheck(Boolean(noscriptMatch), "noscript", "noscript block present");
assertCheck(noscriptText.includes("Liivametsa"), "noscript", "Liivametsa present");
assertCheck(noscriptText.includes("+372"), "noscript", "phone prefix present");

assertCheck(mobileScript.includes(".nisbel-mobile-actions"), "mobile conversion", "action bar selector");
assertCheck(
  mobileScript.includes("#nisbel-mobile-contact") || mobileScript.includes("nisbel-mobile-contact"),
  "mobile conversion",
  "contact selector"
);
assertCheck(mobileScript.includes("Helista"), "mobile conversion", "Helista label");
assertCheck(mobileScript.includes("Broneeri"), "mobile conversion", "Broneeri label");
assertCheck(mobileScript.includes("Kaart"), "mobile conversion", "Kaart label");
assertCheck(mobileScript.includes("position: fixed"), "mobile conversion", "fixed positioning");
assertCheck(mobileScript.includes("display: grid"), "mobile conversion", "grid display");
assertCheck(!mobileScript.includes("Pärnu mnt") && !mobileScript.includes("Parnu mnt"), "mobile conversion", "no old address");

assertCheck(trustScript.includes("nisbel-trust-content"), "trust content", "trust content selector");
assertCheck(countOccurrences(trustScript, '<li class="nisbel-trust-chip">') === 4, "trust content", "4 trust chips");
assertCheck(countOccurrences(trustScript, '<li class="nisbel-trust-process-step">') === 7, "trust content", "7 process steps");
assertCheck(countOccurrences(trustScript, '<article class="nisbel-trust-reason">') === 4, "trust content", "4 reason cards");
assertCheck(countOccurrences(trustScript, '<div class="nisbel-trust-placeholder">') === 4, "trust content", "4 placeholder cards");
assertCheck(!trustScript.includes("\"@type\": \"Review\"") && !trustScript.includes("\"@type\":\"Review\""), "trust content", "no Review schema");
assertCheck(!trustScript.includes("aggregateRating"), "trust content", "no aggregateRating");
assertCheck(!trustScript.includes("4.9") && !trustScript.includes("150"), "trust content", "no fake rating numbers");

const conversionScript = readText("assets/nisbel-conversion-hero-services.js");
assertCheck(conversionScript.includes("nisbel-conversion-hero"), "conversion hero/services", "hero id present");
assertCheck(conversionScript.includes("nisbel-conversion-services"), "conversion hero/services", "services id present");
assertCheck(conversionScript.includes("nisbel-conversion-trust"), "conversion hero/services", "trust id present");
assertCheck(conversionScript.includes("tel:+37256846555"), "conversion hero/services", "tel link present");
assertCheck(conversionScript.includes("+372 5684 6555"), "conversion hero/services", "phone label present");
assertCheck(
  countOccurrences(conversionScript, '<article class="nisbel-conversion-service">') === 6,
  "conversion hero/services",
  "6 service articles"
);

const conversionForbidden = [
  "Pärnu mnt",
  "Parnu mnt",
  "aggregateRating",
  "ratingValue",
  "12 kuu garantii",
  "1 tund 45",
  "Mercedes",
  "Bosch",
  "aastat kogemust"
];
for (const term of conversionForbidden) {
  assertCheck(!conversionScript.includes(term), "conversion hero/services", `no '${term}'`);
}

const faqPage = flattenedJsonLd.find((item) => hasType(item, "FAQPage"));
assertCheck(Boolean(faqPage), "FAQ schema", "FAQPage present");
const faqJson = JSON.stringify(faqPage || {});
assertCheck(!faqJson.includes("12 kuu garantii"), "FAQ schema", "no 12 kuu garantii claim");
assertCheck(!faqJson.includes("1 tund 45"), "FAQ schema", "no 1 tund 45 claim");
assertCheck(faqJson.includes("Liivametsa"), "FAQ schema", "at least one Q references Liivametsa");

printSummary();
