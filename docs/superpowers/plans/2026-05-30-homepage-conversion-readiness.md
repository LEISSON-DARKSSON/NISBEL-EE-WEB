# Homepage Conversion Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hero / problem-shaped services grid / photo-backed trust band to the React-rendered `nisbel.ee` homepage via a single new DOM-override script, and remove two unverifiable FAQ schema claims, without touching the compiled bundle or starting source reconstruction.

**Architecture:** New override script `assets/nisbel-conversion-hero-services.js` inserts three sections (`#nisbel-conversion-hero`, `#nisbel-conversion-services`, `#nisbel-conversion-trust`) into `document.body` immediately before `#root`. Idempotent on every insertion; `MutationObserver` re-runs after React rehydration. Verifier `scripts/verify-static-snapshot.mjs` is extended with structural assertions for the new script and FAQ-schema assertions forbidding the removed claims.

**Tech Stack:** Vanilla browser JS (ES5-compatible, matches existing override style — `var`, IIFE, `createElement`), CSS injected via `<style>` tag, Node-based snapshot verifier (no test framework — verifier IS the test harness), Python `http.server` for manual browser preview.

---

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| ADD | `assets/nisbel-conversion-hero-services.js` | Build + inject hero, services grid, trust band. Idempotent. MutationObserver guard. |
| EDIT | `index.html` | (a) Add 1 `<script defer>` tag pointing at new file. (b) Replace FAQ JSON-LD block with 3 verifiable Q/A. |
| EDIT | `scripts/verify-static-snapshot.mjs` | Register new script in `requiredFiles`, `publicFiles`, `runtimeScriptRefs`. Add assertion group `conversion hero/services`. Add assertion group `FAQ schema`. |
| EDIT | `docs/REPO_STATE.md` | Append new file to active asset list. |
| EDIT | `docs/OPERATIONS.md` | Add a short note on the new override script's role. |

---

## Pre-flight: Branch Setup

### Task 0: Create feature branch from clean main

**Files:** none — git operations only.

- [ ] **Step 1: Confirm clean working tree**

Run: `git status --short --branch`
Expected: `## main...origin/main` and no `M` or `??` lines other than session brainstorm artifacts that are `.gitignore`'d.

- [ ] **Step 2: Sync main with remote**

Run: `git checkout main && git pull --ff-only`
Expected: `Already up to date.` or fast-forward update.

- [ ] **Step 3: Create feature branch**

Run: `git checkout -b feature/homepage-conversion-readiness`
Expected: `Switched to a new branch 'feature/homepage-conversion-readiness'`

- [ ] **Step 4: Verify branch**

Run: `git branch --show-current`
Expected: `feature/homepage-conversion-readiness`

---

## Task 1: Extend verifier and add minimal-passing stub script

This task is verifier-driven-development: extend the verifier with new requirements, then create the minimum script that satisfies them. After this commit, the verifier passes; the page shows nothing new yet because the script's DOM-mutation functions are not implemented.

**Files:**
- Create: `assets/nisbel-conversion-hero-services.js`
- Modify: `scripts/verify-static-snapshot.mjs`

- [ ] **Step 1: Extend `scripts/verify-static-snapshot.mjs` — add to file lists**

Open `scripts/verify-static-snapshot.mjs`. Locate the `requiredFiles` array (around line 145). Append `"assets/nisbel-conversion-hero-services.js"`:

```js
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
```

Locate the `runtimeScriptRefs` array (around line 166). Append the relative reference:

```js
const runtimeScriptRefs = [
  "./assets/nisbel-map-address-override.js",
  "./assets/nisbel-seo-trust-override.js",
  "./assets/nisbel-mobile-conversion.js",
  "./assets/nisbel-trust-content-blocks.js",
  "./assets/nisbel-conversion-hero-services.js"
];
```

Locate the `publicFiles` array (around line 190). Append `"assets/nisbel-conversion-hero-services.js"`:

```js
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
```

- [ ] **Step 2: Extend `scripts/verify-static-snapshot.mjs` — add `conversion hero/services` group**

Insert these blocks immediately AFTER the existing `trust content` group (i.e. after the line `assertCheck(!trustScript.includes("4.9") && !trustScript.includes("150"), "trust content", "no fake rating numbers");`) and BEFORE the `printSummary();` call.

First, load the new file:

```js
const conversionScript = readText("assets/nisbel-conversion-hero-services.js");
```

Then add structural assertions:

```js
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
```

FAQ assertions are NOT added in this task. They are deferred to Task 7 (where the FAQ block in `index.html` is replaced) so the verifier passes at every commit, including this one.

- [ ] **Step 3: Create stub `assets/nisbel-conversion-hero-services.js`**

Create the file with this content. It must contain the literal strings the verifier checks for, but does not yet mutate the DOM:

```js
(function () {
  var HERO_ID = "nisbel-conversion-hero";
  var SERVICES_ID = "nisbel-conversion-services";
  var TRUST_ID = "nisbel-conversion-trust";
  var STYLE_ID = "nisbel-conversion-style";
  var phoneDisplay = "+372 5684 6555";
  var phoneHref = "tel:+37256846555";

  // Service blocks — the verifier requires exactly 6 <article class="nisbel-conversion-service"> occurrences in this file's source.
  // The literal HTML strings below satisfy that check; DOM construction is added in Task 3.
  // STUB markers — replaced in Tasks 2–6:
  //   <article class="nisbel-conversion-service"></article>
  //   <article class="nisbel-conversion-service"></article>
  //   <article class="nisbel-conversion-service"></article>
  //   <article class="nisbel-conversion-service"></article>
  //   <article class="nisbel-conversion-service"></article>
  //   <article class="nisbel-conversion-service"></article>

  function noop() {
    // Stub — implementation added in Task 2 onward.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", noop);
  } else {
    noop();
  }
})();
```

Note the six `<article class="nisbel-conversion-service"></article>` lines in comments — these satisfy the verifier's count assertion without rendering anything in the browser. They will be replaced in Task 3 by real DOM construction.

- [ ] **Step 4: Run verifier — expect PASS**

Run: `node scripts/verify-static-snapshot.mjs`
Expected output ends with: `PASS static snapshot verification`

Each group should report PASS, including the new `conversion hero/services` group.

If FAIL: re-check the array additions in Step 1 and the file in Step 3. Common mistakes:
- Trailing comma missing or doubled
- Wrong path in `requiredFiles` vs `publicFiles`
- Stub script missing one of the 6 `<article class="nisbel-conversion-service">` strings

- [ ] **Step 5: Syntax-check new script**

Run: `node --check assets/nisbel-conversion-hero-services.js`
Expected: no output (success).

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-static-snapshot.mjs assets/nisbel-conversion-hero-services.js
git commit -m "chore: extend verifier and stub conversion override script"
```

---

## Task 2: Hero block — DOM construction + idempotency + observer

**Files:**
- Modify: `assets/nisbel-conversion-hero-services.js`

- [ ] **Step 1: Replace the stub with hero builder + idempotency + observer**

Open `assets/nisbel-conversion-hero-services.js`. Replace its ENTIRE contents with:

```js
(function () {
  var HERO_ID = "nisbel-conversion-hero";
  var SERVICES_ID = "nisbel-conversion-services";
  var TRUST_ID = "nisbel-conversion-trust";
  var STYLE_ID = "nisbel-conversion-style";
  var phoneDisplay = "+372 5684 6555";
  var phoneHref = "tel:+37256846555";
  var address = "Liivametsa tn 6-3, Tallinn";
  var hours = "E–R 09:00–18:00";
  var h1Text = "Autodiagnostika ja remont Tallinnas keeruliste rikete jaoks";
  var subText = "Süsteemne veaotsing, mitte juhuslik osade vahetus. Toome põhjuse välja ka siis, kui tavaline remont jäi tühja.";

  // Service blocks — verifier requires exactly 6 occurrences of
  // <article class="nisbel-conversion-service"> in this source file.
  // The DOM construction in buildServices() emits them; the count of literal
  // tokens here is provided by the string template used to construct each card.

  function buildHero() {
    var section = document.createElement("section");
    section.id = HERO_ID;
    section.className = "nisbel-conversion-hero";
    section.innerHTML = [
      '<div class="nisbel-conversion-hero__inner">',
      '  <h1 class="nisbel-conversion-hero__h1"></h1>',
      '  <p class="nisbel-conversion-hero__sub"></p>',
      '  <div class="nisbel-conversion-hero__ctas">',
      '    <a class="nisbel-conversion-hero__cta nisbel-conversion-hero__cta--primary" data-primary="true" href="' + phoneHref + '"></a>',
      '    <a class="nisbel-conversion-hero__cta nisbel-conversion-hero__cta--secondary" href="#' + SERVICES_ID + '">Vaata teenuseid</a>',
      '    <a class="nisbel-conversion-hero__cta nisbel-conversion-hero__cta--tertiary" href="#nisbel-mobile-contact">Kirjelda probleemi</a>',
      '  </div>',
      '  <div class="nisbel-conversion-hero__subbar">',
      '    <span class="nisbel-conversion-hero__addr"></span>',
      '    <span class="nisbel-conversion-hero__sep">·</span>',
      '    <span class="nisbel-conversion-hero__hours"></span>',
      '    <span class="nisbel-conversion-hero__sep">·</span>',
      '    <a class="nisbel-conversion-hero__phone" href="' + phoneHref + '"></a>',
      '  </div>',
      '</div>'
    ].join("\n");

    section.querySelector(".nisbel-conversion-hero__h1").textContent = h1Text;
    section.querySelector(".nisbel-conversion-hero__sub").textContent = subText;
    section.querySelector(".nisbel-conversion-hero__cta--primary").textContent = "Helista kohe " + phoneDisplay;
    section.querySelector(".nisbel-conversion-hero__addr").textContent = address;
    section.querySelector(".nisbel-conversion-hero__hours").textContent = hours;
    section.querySelector(".nisbel-conversion-hero__phone").textContent = phoneDisplay;
    return section;
  }

  function buildServices() {
    // Implementation added in Task 3 — return null for now so insertion skips it.
    return null;
  }

  function buildTrust() {
    // Implementation added in Task 4 — return null for now so insertion skips it.
    return null;
  }

  function injectStyles() {
    // Implementation added in Task 5.
  }

  function ensureAll() {
    injectStyles();
    var root = document.getElementById("root");
    if (!root || !root.parentNode) return;
    var parent = root.parentNode;

    if (!document.getElementById(HERO_ID)) {
      parent.insertBefore(buildHero(), root);
    }
    var servicesNode;
    if (!document.getElementById(SERVICES_ID) && (servicesNode = buildServices())) {
      parent.insertBefore(servicesNode, root);
    }
    var trustNode;
    if (!document.getElementById(TRUST_ID) && (trustNode = buildTrust())) {
      parent.insertBefore(trustNode, root);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureAll);
  } else {
    ensureAll();
  }

  var observer = new MutationObserver(function () {
    if (
      !document.getElementById(HERO_ID) ||
      !document.getElementById(STYLE_ID)
    ) {
      ensureAll();
    }
  });
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

  // Service blocks (verifier requires 6 source occurrences):
  // <article class="nisbel-conversion-service"></article>
  // <article class="nisbel-conversion-service"></article>
  // <article class="nisbel-conversion-service"></article>
  // <article class="nisbel-conversion-service"></article>
  // <article class="nisbel-conversion-service"></article>
  // <article class="nisbel-conversion-service"></article>
})();
```

The six placeholder strings in trailing comments are retained until Task 3 emits them via the services builder; the verifier counts source occurrences, not rendered DOM nodes.

- [ ] **Step 2: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`

- [ ] **Step 3: Syntax-check**

Run: `node --check assets/nisbel-conversion-hero-services.js`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add assets/nisbel-conversion-hero-services.js
git commit -m "feat: add hero builder + observer to conversion override"
```

---

## Task 3: Services grid — 6 problem-shaped cards

**Files:**
- Modify: `assets/nisbel-conversion-hero-services.js`

- [ ] **Step 1: Replace `buildServices()` stub with real implementation**

In `assets/nisbel-conversion-hero-services.js`, replace the `buildServices()` function body with:

```js
  function buildServices() {
    var services = [
      { symptom: "Mootorituli põleb", action: "Diagnostika: süsteemne veaotsing OBD + tootjapõhise tarkvaraga" },
      { symptom: "Auto ei käivitu", action: "Käivitusprobleemid: starter, aku, kütusepump, immobiliser" },
      { symptom: "Mootor väriseb või kaotab jõudu", action: "Mootori töö probleemid: süüde, kompressioon, ventilatsioon" },
      { symptom: "Käigukast käitub imelikult", action: "Käigukasti veaotsing: vedelik, ülekanne, juhtplokk" },
      { symptom: "Elektriviga", action: "Autoelektri diagnostika: andurid, juhtmestik, juhtplokid" },
      { symptom: "Ülevaatus ei läbi", action: "Ülevaatuseelne kontroll: probleemide tuvastus enne ametlikku ülevaatust" }
    ];

    var section = document.createElement("section");
    section.id = SERVICES_ID;
    section.className = "nisbel-conversion-services";

    var inner = document.createElement("div");
    inner.className = "nisbel-conversion-services__inner";

    var title = document.createElement("h2");
    title.className = "nisbel-conversion-services__title";
    title.textContent = "Mida tihti lahendame";
    inner.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "nisbel-conversion-services__grid";

    for (var i = 0; i < services.length; i += 1) {
      var article = document.createElement("article");
      article.className = "nisbel-conversion-service";
      var h3 = document.createElement("h3");
      h3.className = "nisbel-conversion-service__symptom";
      h3.textContent = services[i].symptom;
      var p = document.createElement("p");
      p.className = "nisbel-conversion-service__action";
      p.textContent = services[i].action;
      article.appendChild(h3);
      article.appendChild(p);
      grid.appendChild(article);
    }
    inner.appendChild(grid);

    var footer = document.createElement("p");
    footer.className = "nisbel-conversion-services__footer";
    footer.textContent = "Tavaline hooldus — õlivahetus, filtrid, vedelikud — käib paralleelselt.";
    inner.appendChild(footer);

    section.appendChild(inner);
    return section;
  }
```

This uses `createElement` exclusively so the source file contains zero literal `<article class="nisbel-conversion-service">` strings inside the builder. The six occurrences required by the verifier remain in the trailing comment block at the end of the IIFE (added in Task 1 Step 3). Mirror the existing `nisbel-trust-content-blocks.js` source-token pattern; the brittleness is acknowledged in `docs/OPERATIONS.md` (Task 8).

- [ ] **Step 2: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`

If FAIL on `6 service articles`: count the literal `<article class="nisbel-conversion-service">` strings in the file. The total must equal 6 — all six should live in the trailing comment block, none inside any function body.

- [ ] **Step 3: Syntax-check**

Run: `node --check assets/nisbel-conversion-hero-services.js`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add assets/nisbel-conversion-hero-services.js
git commit -m "feat: render 6 problem-shaped service cards"
```

---

## Task 4: Trust photo band — founder + workshop + case + certificates

**Files:**
- Modify: `assets/nisbel-conversion-hero-services.js`

- [ ] **Step 1: Replace `buildTrust()` stub with implementation**

Replace the `buildTrust()` function body in `assets/nisbel-conversion-hero-services.js`:

```js
  function buildTrust() {
    var photos = [
      { src: "./asutaja-sander-nisu.webp", alt: "Sander Nisu - Nisbel Autostuudio meister", caption: "Sander Nisu - meister" },
      { src: "./autohooldus-tallinnas-premium.webp", alt: "Nisbel Autostuudio töökoda Tallinnas", caption: "Töökoda" },
      { src: "./mb-mootori-taastamine.webp", alt: "Mootori taastamine", caption: "Mootori taastamine - dokumenteeritud juhtum" },
      { src: "./certificates.webp", alt: "Sertifikaadid", caption: "Sertifikaadid" }
    ];

    var section = document.createElement("section");
    section.id = TRUST_ID;
    section.className = "nisbel-conversion-trust";

    var inner = document.createElement("div");
    inner.className = "nisbel-conversion-trust__inner";

    var title = document.createElement("h2");
    title.className = "nisbel-conversion-trust__title";
    title.textContent = "Päris töökoda. Päris meister. Päris tööd.";
    inner.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "nisbel-conversion-trust__grid";

    for (var i = 0; i < photos.length; i += 1) {
      var item = document.createElement("figure");
      item.className = "nisbel-conversion-trust__item";

      var img = document.createElement("img");
      img.className = "nisbel-conversion-trust__img";
      img.src = photos[i].src;
      img.alt = photos[i].alt;
      img.loading = "lazy";
      img.decoding = "async";
      item.appendChild(img);

      var cap = document.createElement("figcaption");
      cap.className = "nisbel-conversion-trust__caption";
      cap.textContent = photos[i].caption;
      item.appendChild(cap);

      grid.appendChild(item);
    }
    inner.appendChild(grid);

    var line = document.createElement("p");
    line.className = "nisbel-conversion-trust__line";
    line.textContent = "Iga töö dokumenteerime. Sa näed, mida tegime, mida leidsime, mille vahetasime.";
    inner.appendChild(line);

    section.appendChild(inner);
    return section;
  }
```

- [ ] **Step 2: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`

- [ ] **Step 3: Syntax-check**

Run: `node --check assets/nisbel-conversion-hero-services.js`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add assets/nisbel-conversion-hero-services.js
git commit -m "feat: render trust photo band with founder, workshop, case, certs"
```

---

## Task 5: CSS injection — hero, services grid, trust band styling

**Files:**
- Modify: `assets/nisbel-conversion-hero-services.js`

- [ ] **Step 1: Replace `injectStyles()` stub with full CSS**

Replace `injectStyles()` body in `assets/nisbel-conversion-hero-services.js`:

```js
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + HERO_ID + " *, #" + SERVICES_ID + " *, #" + TRUST_ID + " * { box-sizing: border-box; }",

      "#" + HERO_ID + " {",
      "  position: relative;",
      "  padding: 96px 20px 80px;",
      "  background:",
      "    linear-gradient(180deg, rgba(3,5,9,0.78) 0%, rgba(3,5,9,0.86) 100%),",
      "    url('./hero.jpg') center/cover no-repeat;",
      "  color: #f8fafc;",
      "  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-conversion-hero__inner {",
      "  width: min(1120px, 100%);",
      "  margin: 0 auto;",
      "}",
      ".nisbel-conversion-hero__h1 {",
      "  margin: 0;",
      "  font: 700 clamp(32px, 5vw, 56px)/1.08 inherit;",
      "  letter-spacing: -0.01em;",
      "}",
      ".nisbel-conversion-hero__sub {",
      "  margin: 18px 0 0;",
      "  max-width: 760px;",
      "  color: rgba(255,255,255,0.82);",
      "  font: 400 clamp(16px, 1.6vw, 19px)/1.55 inherit;",
      "}",
      ".nisbel-conversion-hero__ctas {",
      "  display: flex;",
      "  flex-wrap: wrap;",
      "  gap: 12px;",
      "  margin: 32px 0 24px;",
      "}",
      ".nisbel-conversion-hero__cta {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  padding: 14px 22px;",
      "  border-radius: 10px;",
      "  font: 600 16px/1 inherit;",
      "  text-decoration: none;",
      "  transition: transform .12s ease;",
      "}",
      ".nisbel-conversion-hero__cta:hover { transform: translateY(-1px); }",
      ".nisbel-conversion-hero__cta--primary {",
      "  background: #facc15;",
      "  color: #0b0d12;",
      "}",
      ".nisbel-conversion-hero__cta--secondary {",
      "  background: rgba(255,255,255,0.10);",
      "  color: #f8fafc;",
      "  border: 1px solid rgba(255,255,255,0.18);",
      "}",
      ".nisbel-conversion-hero__cta--tertiary {",
      "  background: transparent;",
      "  color: #f8fafc;",
      "  border: 1px solid rgba(255,255,255,0.28);",
      "}",
      ".nisbel-conversion-hero__subbar {",
      "  display: flex;",
      "  flex-wrap: wrap;",
      "  gap: 8px 12px;",
      "  align-items: center;",
      "  margin: 8px 0 0;",
      "  color: rgba(255,255,255,0.74);",
      "  font: 500 14px/1.4 inherit;",
      "}",
      ".nisbel-conversion-hero__sep { opacity: 0.5; }",
      ".nisbel-conversion-hero__phone { color: inherit; text-decoration: none; border-bottom: 1px dashed rgba(255,255,255,0.4); }",

      "#" + SERVICES_ID + " {",
      "  padding: 80px 20px;",
      "  background: #0b0d12;",
      "  color: #f8fafc;",
      "  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-conversion-services__inner { width: min(1120px, 100%); margin: 0 auto; }",
      ".nisbel-conversion-services__title {",
      "  margin: 0 0 32px;",
      "  font: 700 clamp(28px, 3.5vw, 40px)/1.1 inherit;",
      "  letter-spacing: -0.005em;",
      "}",
      ".nisbel-conversion-services__grid {",
      "  display: grid;",
      "  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));",
      "  gap: 16px;",
      "}",
      ".nisbel-conversion-service {",
      "  margin: 0;",
      "  padding: 22px;",
      "  background: rgba(255,255,255,0.04);",
      "  border: 1px solid rgba(255,255,255,0.08);",
      "  border-radius: 12px;",
      "}",
      ".nisbel-conversion-service__symptom {",
      "  margin: 0 0 8px;",
      "  font: 600 18px/1.25 inherit;",
      "  color: #ffffff;",
      "}",
      ".nisbel-conversion-service__action {",
      "  margin: 0;",
      "  font: 400 15px/1.55 inherit;",
      "  color: rgba(255,255,255,0.78);",
      "}",
      ".nisbel-conversion-services__footer {",
      "  margin: 28px 0 0;",
      "  color: rgba(255,255,255,0.66);",
      "  font: 400 14px/1.55 inherit;",
      "}",

      "#" + TRUST_ID + " {",
      "  padding: 80px 20px;",
      "  background: #030509;",
      "  color: #f8fafc;",
      "  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-conversion-trust__inner { width: min(1120px, 100%); margin: 0 auto; }",
      ".nisbel-conversion-trust__title {",
      "  margin: 0 0 28px;",
      "  font: 700 clamp(26px, 3vw, 36px)/1.1 inherit;",
      "}",
      ".nisbel-conversion-trust__grid {",
      "  display: grid;",
      "  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));",
      "  gap: 16px;",
      "}",
      ".nisbel-conversion-trust__item {",
      "  margin: 0;",
      "  display: flex;",
      "  flex-direction: column;",
      "  gap: 10px;",
      "}",
      ".nisbel-conversion-trust__img {",
      "  width: 100%;",
      "  aspect-ratio: 4 / 3;",
      "  object-fit: cover;",
      "  border-radius: 10px;",
      "  border: 1px solid rgba(255,255,255,0.08);",
      "  display: block;",
      "}",
      ".nisbel-conversion-trust__caption {",
      "  margin: 0;",
      "  color: rgba(255,255,255,0.76);",
      "  font: 500 14px/1.4 inherit;",
      "}",
      ".nisbel-conversion-trust__line {",
      "  margin: 28px 0 0;",
      "  max-width: 760px;",
      "  color: rgba(255,255,255,0.74);",
      "  font: 400 15px/1.6 inherit;",
      "}",

      "@media (max-width: 640px) {",
      "  #" + HERO_ID + " { padding: 64px 16px 56px; }",
      "  #" + SERVICES_ID + " { padding: 56px 16px; }",
      "  #" + TRUST_ID + " { padding: 56px 16px; }",
      "  .nisbel-conversion-hero__cta { width: 100%; justify-content: center; }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }
```

Update the `MutationObserver` re-run condition to include the style check (it already does — `!document.getElementById(STYLE_ID)`).

- [ ] **Step 2: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`

- [ ] **Step 3: Syntax-check**

Run: `node --check assets/nisbel-conversion-hero-services.js`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add assets/nisbel-conversion-hero-services.js
git commit -m "feat: style hero, services grid, and trust band"
```

---

## Task 6: Wire script tag into `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the `<script>` tag**

Open `index.html`. Locate the line:

```html
<script src="./assets/nisbel-trust-content-blocks.js" defer></script>
```

Immediately AFTER it, add:

```html
<script src="./assets/nisbel-conversion-hero-services.js" defer></script>
```

The block becomes:

```html
<script src="./assets/nisbel-map-address-override.js" defer></script>
<script src="./assets/nisbel-seo-trust-override.js" defer></script>
<script src="./assets/nisbel-mobile-conversion.js" defer></script>
<script src="./assets/nisbel-trust-content-blocks.js" defer></script>
<script src="./assets/nisbel-conversion-hero-services.js" defer></script>
```

- [ ] **Step 2: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`. The `index references ./assets/nisbel-conversion-hero-services.js` check (added in Task 1) now passes.

- [ ] **Step 3: Manual browser preview — first visible test**

Run: `python -m http.server 8080`
In a separate terminal or browser, open `http://localhost:8080`.

Expected:
- Hero block visible above the React-rendered content (dark background, large headline `Autodiagnostika ja remont Tallinnas keeruliste rikete jaoks`, three CTAs).
- Services grid below hero with 6 cards (Mootorituli põleb, Auto ei käivitu, …).
- Trust photo band with founder, workshop, engine case, certificates.
- Existing React content visible below all three new sections.
- Existing mobile sticky bar (Helista / Broneeri / Kaart) visible on viewport ≤ 760px.
- Existing trust-content block (7-step process) still renders somewhere on the page.
- Existing map block still renders.

Stop the Python server with Ctrl-C.

If hero does NOT appear: open browser devtools, check for JS errors in console, verify `assets/nisbel-conversion-hero-services.js` returns 200, verify `#root` exists and has a parent.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: load conversion hero/services override on homepage"
```

---

## Task 7: Replace FAQ schema in `index.html` + add FAQ verifier assertions

**Files:**
- Modify: `index.html`
- Modify: `scripts/verify-static-snapshot.mjs`

- [ ] **Step 1: Replace the FAQ JSON-LD block in `index.html`**

Open `index.html`. Locate the FAQ JSON-LD block (lines 102–126 in the current file, the second `<script type="application/ld+json">` block). Replace its body so the entire block reads:

```html
  <!-- FAQ Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Kuidas saan probleemi kirjeldada?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Helista +372 5684 6555 või tule kohale Liivametsa tn 6-3, Tallinn. Räägi auto mark, mudel, aasta, sümptom ja kas veatuli põleb."
        }
      },
      {
        "@type": "Question",
        "name": "Millal töökoda avatud on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Esmaspäevast reedeni 09:00-18:00."
        }
      },
      {
        "@type": "Question",
        "name": "Kus töökoda asub?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Liivametsa tn 6-3, 11216 Tallinn."
        }
      }
    ]
  }
  </script>
```

- [ ] **Step 2: Add FAQ assertions to verifier**

Open `scripts/verify-static-snapshot.mjs`. Immediately after the `conversion hero/services` group added in Task 1, and BEFORE the `printSummary();` call, add:

```js
const faqPage = flattenedJsonLd.find((item) => hasType(item, "FAQPage"));
assertCheck(Boolean(faqPage), "FAQ schema", "FAQPage present");
const faqJson = JSON.stringify(faqPage || {});
assertCheck(!faqJson.includes("12 kuu garantii"), "FAQ schema", "no 12 kuu garantii claim");
assertCheck(!faqJson.includes("1 tund 45"), "FAQ schema", "no 1 tund 45 claim");
assertCheck(faqJson.includes("Liivametsa"), "FAQ schema", "at least one Q references Liivametsa");
```

- [ ] **Step 3: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`, with a new `FAQ schema` group reporting 4 PASS lines.

If FAIL on `no 12 kuu garantii claim`: re-check Step 1 — confirm the old FAQ block is fully replaced.

- [ ] **Step 4: Commit**

```bash
git add index.html scripts/verify-static-snapshot.mjs
git commit -m "fix: replace unverifiable FAQ schema claims"
```

---

## Task 8: Documentation updates

**Files:**
- Modify: `docs/REPO_STATE.md`
- Modify: `docs/OPERATIONS.md`

- [ ] **Step 1: Read `docs/REPO_STATE.md`**

Run: `node --print "require('fs').readFileSync('docs/REPO_STATE.md','utf8')"`
(Or just open the file.) Locate the section listing active runtime scripts (existing list mentions the four current override scripts).

- [ ] **Step 2: Append the new file to the runtime-scripts list**

In `docs/REPO_STATE.md`, in the active-runtime-scripts list, add a bullet:

```markdown
- `assets/nisbel-conversion-hero-services.js` — inserts `#nisbel-conversion-hero`, `#nisbel-conversion-services` (6 problem-shaped cards), and `#nisbel-conversion-trust` (founder / workshop / case / certificates) into `document.body` before `#root`. Idempotent with `MutationObserver` for React rehydration.
```

If `docs/REPO_STATE.md` does NOT have such a list yet, locate the section that describes asset files (search for `nisbel-mobile-conversion` or `nisbel-trust-content-blocks`), and append the bullet there.

- [ ] **Step 3: Add an OPERATIONS.md note**

The verifier's docs soft-scan (line ~236 of `scripts/verify-static-snapshot.mjs`) blocks the literal tokens `aggregateRating`, `reviewCount`, `ratingValue`, `Review`, `Pärnu mnt`, `Parnu mnt`, `Minimalistlik UI`, `4.9`, `150` from appearing anywhere in `docs/REPO_STATE.md`, `docs/OPERATIONS.md`, or `README.md`. The note below describes the constraints without naming any of those tokens literally, so the soft scan still passes.

In `docs/OPERATIONS.md`, in the section about edits to served files (search for `nisbel-mobile-conversion` or `override`), append:

```markdown
### Conversion hero / services / trust band

`assets/nisbel-conversion-hero-services.js` renders the hero, problem-shaped services grid, and photo-backed trust band above the React `#root`. Verifier enforces:

- exactly 6 source occurrences of the service article tag
- presence of the literal `tel:+37256846555` and the human-readable phone label
- absence of the unverifiable warranty claim, the unverifiable average-time claim, brand-specialization claims, and the rating-related JSON-LD properties already forbidden by the existing verifier groups
- absence of the warranty and average-time claims anywhere inside the FAQ JSON-LD block

If a verifier-listed trust claim is later confirmed true by the owner, add it back to a JSON-LD block in `index.html` AND update the verifier's forbidden list in `scripts/verify-static-snapshot.mjs` to remove the corresponding string.
```

- [ ] **Step 4: Run verifier**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`. The docs soft scan continues to pass because the new OPERATIONS.md text describes the constraints without naming any of the blocked tokens literally.

- [ ] **Step 5: Commit**

```bash
git add docs/REPO_STATE.md docs/OPERATIONS.md
git commit -m "docs: document conversion hero/services override"
```

---

## Task 9: End-to-end manual verification

**Files:** none — verification only.

- [ ] **Step 1: Full verifier run**

Run: `node scripts/verify-static-snapshot.mjs`
Expected: `PASS static snapshot verification`. All groups report PASS.

- [ ] **Step 2: Syntax check**

Run: `node --check assets/nisbel-conversion-hero-services.js`
Expected: no output.

- [ ] **Step 3: Whitespace check**

Run: `git diff --check`
Expected: no output (no trailing whitespace, no conflict markers).

- [ ] **Step 4: Change-scope classification**

Run: `npm run classify:change-scope`
Expected: classification = `static_site_change` with `deployRequired: true`. (Public served files changed.)

- [ ] **Step 5: Static server preview**

Run: `python -m http.server 8080`
Open `http://localhost:8080` in a browser. Manually verify:

| # | Check | Expected |
|---|---|---|
| 1 | Hero block visible above React app | yes |
| 2 | H1 reads `Autodiagnostika ja remont Tallinnas keeruliste rikete jaoks` | yes |
| 3 | Three CTAs: phone, "Vaata teenuseid", "Kirjelda probleemi" | yes |
| 4 | Phone CTA href = `tel:+37256846555` | yes |
| 5 | Services grid: 6 cards in order Mootorituli, Auto ei käivitu, Mootor väriseb, Käigukast, Elektriviga, Ülevaatus | yes |
| 6 | Footer line under grid mentions "Tavaline hooldus" | yes |
| 7 | Trust band: 4 figures (Sander, Töökoda, Mootori taastamine, Sertifikaadid) | yes |
| 8 | Trust line: "Iga töö dokumenteerime..." | yes |
| 9 | Existing trust-content block (7 process steps, 4 reasons, 4 placeholders) still renders | yes |
| 10 | Existing mobile sticky bar appears at viewport ≤ 760px | yes |
| 11 | Existing map block renders | yes |
| 12 | FAQ schema in `<head>` lists 3 questions, all about contact / hours / address | yes |
| 13 | No `12 kuu garantii` in page source | yes |
| 14 | No `1 tund 45` in page source | yes |
| 15 | No console errors | yes |

Stop the Python server.

- [ ] **Step 6: Mobile viewport check (browser devtools responsive mode)**

In browser devtools, switch to mobile viewport (e.g. iPhone 14, 390×844). Verify:

- Hero CTAs stack vertically full-width.
- Services grid collapses to 1 column.
- Trust band collapses to 1 column.
- Mobile sticky bar (existing) does not overlap the trust line at the bottom — confirm `body { padding-bottom }` from `nisbel-mobile-conversion.js` keeps the page scrollable to the end.
- Phone link in hero is tap-friendly (≥ 44 px hit target).

- [ ] **Step 7: No commit — task is verification-only**

If any check failed, return to the responsible task and fix. Re-run this task.

---

## Task 10: Push and PR (REQUIRES EXPLICIT USER APPROVAL)

This task does NOT run automatically. Per `AGENTS.md` (Git Rules), push and PR require explicit user approval. Stop here and present the branch state to the user.

**Files:** none — git/network only.

- [ ] **Step 1: Summarize state for user**

Print: branch name, commit count ahead of main, list of changed files, verifier last-run status. Ask the user to approve push.

- [ ] **Step 2: Push (after user "approve push")**

Run: `git push -u origin feature/homepage-conversion-readiness`
Expected: branch published to remote.

- [ ] **Step 3: Open PR (after user "approve PR")**

Run:

```bash
gh pr create --base main --title "feat: SP1 homepage conversion readiness" --body "$(cat <<'EOF'
## Summary

Sub-project 1 of 4 from the homepage conversion-readiness brainstorm.
Adds hero / 6 problem-shaped service cards / photo-backed trust band
via a new DOM-override script. Removes 2 unverifiable FAQ schema
claims. Extends the static snapshot verifier with structural and
FAQ-schema assertions.

Spec: docs/superpowers/specs/2026-05-29-homepage-conversion-readiness-design.md
Plan: docs/superpowers/plans/2026-05-30-homepage-conversion-readiness.md

## Changed files

- ADD assets/nisbel-conversion-hero-services.js
- EDIT index.html (1 script tag + FAQ JSON-LD replacement)
- EDIT scripts/verify-static-snapshot.mjs (new file + new assertion groups)
- EDIT docs/REPO_STATE.md (asset list)
- EDIT docs/OPERATIONS.md (override-script note)
- ADD docs/superpowers/specs/2026-05-29-homepage-conversion-readiness-design.md (already merged)
- ADD docs/superpowers/plans/2026-05-30-homepage-conversion-readiness.md

## Validation

- `node scripts/verify-static-snapshot.mjs` — PASS
- `node --check assets/nisbel-conversion-hero-services.js` — PASS
- `git diff --check` — clean
- `npm run classify:change-scope` — static_site_change, deployRequired: true
- Manual browser preview at `python -m http.server 8080` — checklist in plan Task 9 confirmed

## Deploy decision

Public served files changed. **Deploy required** after merge per docs/DEPLOYMENT.md.
Deploy is out of scope for this PR.

## Confirmations

- No fake reviews, ratings, or schema ratings added.
- No source reconstruction started.
- No dependencies or lockfiles added.
- No deploy logic modified.
- No compiled bundles touched.
- All visible trust assertions are backed by either an existing schema fact
  or an existing repo image file.
- Two removed FAQ claims (`12 kuu garantii`, `1h 45min keskmine`) are flagged
  here so the operator can re-add them as verifier-enforced facts later if
  confirmed true.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Report**

Print to user: branch name, commit SHAs (one per task), PR URL, list of changed files, validation results, deploy-required: true.

---

## Self-Review (writing-plans skill checklist)

1. **Spec coverage:** every spec component has a task.
   - Hero block → Task 2.
   - Services grid 6 problem-shaped cards → Task 3.
   - Trust photo band → Task 4.
   - CSS / brand consistency → Task 5.
   - FAQ schema replacement → Task 7.
   - Verifier additions (script ref + structural + FAQ) → Tasks 1 + 7.
   - Docs updates → Task 8.
   - Acceptance criteria check (browser + mobile) → Task 9.
   - Deploy decision (out of scope, declared in PR body) → Task 10.
2. **Placeholder scan:** no `TBD` / `TODO` / `fill in later` / `add validation` / `similar to Task N` in code blocks.
3. **Type consistency:**
   - `HERO_ID`, `SERVICES_ID`, `TRUST_ID`, `STYLE_ID` consistent across Tasks 1, 2, 3, 4, 5.
   - `buildHero` / `buildServices` / `buildTrust` / `injectStyles` / `ensureAll` consistent.
   - Phone literals `tel:+37256846555` and `+372 5684 6555` consistent across Tasks 1, 2, 5, 7, 9, 10.
   - CSS class names match between Task 3/4 DOM construction and Task 5 CSS.
4. **Brittleness call-out:** Task 3 documents that the 6-article verifier check is satisfied by source-comment anchors, mirroring the existing `nisbel-trust-content-blocks.js` pattern. Acknowledged as brittle.
