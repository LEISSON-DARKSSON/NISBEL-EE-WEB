# Homepage Conversion Readiness — SP1 Design

**Date:** 2026-05-29
**Scope:** Sub-project 1 of 4 (SP1). Sub-projects SP2 (SEO landing pages), SP3 (contact request form), and SP4 (analytics events) are deferred to separate spec→plan cycles.
**Status:** Draft, awaiting user review.

## Goal

Improve nisbel.ee homepage conversion readiness — clearer hero, stronger CTAs, problem-shaped service blocks, photo-backed trust band, removal of unverifiable schema claims — without inventing facts, breaking CI, modifying the compiled React bundle, or starting source reconstruction.

## In Scope (SP1)

Problems 1, 2, 3, 4, 5, 6, 8 from the input analysis:

1. Hero message too abstract.
2. Primary CTA not strong enough.
3. Insufficient trust proof.
4. Service structure not customer-problem-shaped.
5. Contact block weak.
6. No clear "why us".
8. Mobile contact path must be immediate.

## Out of Scope (SP1)

- **SP2** — SEO landing pages (`/autodiagnostika-tallinn` etc.). React SPA + no source reconstruction means new routes need a separate decision (route shim vs static sibling `.html` files). Separate spec.
- **SP3** — Contact request form (`päringuvorm` + intake funnel). Requires submission target (mailto / Formspree / WhatsApp deep link / own backend). Separate spec.
- **SP4** — Analytics events (phone click, CTA click, map click, form submit). Cannot start until SP1/SP3 selectors exist. Separate spec.
- Compiled React bundle edits (`assets/index-8f1a9bbc.js`).
- Source reconstruction.
- New dependencies, lockfiles, package manager bootstrap.
- Deploy logic and FTPS workflow.
- Removal or refactor of the four existing override scripts.
- Edits to existing override-script structural elements that the verifier locks (e.g. the 7-step process, 4 reason cards, 4 placeholder cards).

## Architecture

Continue the existing DOM-override-JS pattern. The four existing scripts (`nisbel-map-address-override.js`, `nisbel-seo-trust-override.js`, `nisbel-mobile-conversion.js`, `nisbel-trust-content-blocks.js`) all wait for `DOMContentLoaded`, then idempotently mutate the React-rendered DOM and re-run via `MutationObserver` after rehydration. The verifier `scripts/verify-static-snapshot.mjs` enforces exact element counts inside existing scripts, so they cannot be structurally edited without breaking CI.

**Decision:** add ONE new override script — `assets/nisbel-conversion-hero-services.js` — that inserts the new hero, services, and trust-photo sections as greenfield blocks. Existing scripts remain untouched.

Additionally, `index.html` loses two unverifiable FAQ schema claims (12-month warranty, 1h 45min average time) and gains the new `<script>` tag. The verifier is extended with checks for the new script.

### Files Touched

| Action | Path | Reason |
|---|---|---|
| ADD | `assets/nisbel-conversion-hero-services.js` | New hero + services + trust photo band |
| EDIT | `index.html` | Add 1 `<script defer>` tag; replace FAQ schema (remove 12 kuu garantii + 1h 45min) |
| EDIT | `scripts/verify-static-snapshot.mjs` | Register new script in `requiredFiles`, `publicFiles`, `runtimeScriptRefs`; add structural assertions; add FAQ assertions forbidding the removed claims |
| EDIT | `docs/REPO_STATE.md` | Append new file to active asset list |
| EDIT | `docs/OPERATIONS.md` | Brief note on the new override script's responsibility |

## Components

### 1. Hero override block

- DOM id: `nisbel-conversion-hero`
- Inserted into `document.body` immediately before `#root` (so the hero renders above the React-rendered shell). Idempotency-guarded by `document.getElementById('nisbel-conversion-hero')` before insertion. Re-checked by `MutationObserver` after React rehydration.
- H1: `Autodiagnostika ja remont Tallinnas keeruliste rikete jaoks`
- Sub: `Süsteemne veaotsing, mitte juhuslik osade vahetus. Toome põhjuse välja ka siis, kui tavaline remont jäi tühja.`
- Primary CTA: `<a href="tel:+37256846555" data-primary="true">Helista kohe +372 5684 6555</a>`
- Secondary CTA: `<a href="#nisbel-conversion-services">Vaata teenuseid</a>`
- Tertiary CTA: `<a href="#nisbel-mobile-contact">Kirjelda probleemi</a>` (anchors to the existing mobile-conversion contact section)
- Sub-bar (visible on desktop, collapses on mobile): address `Liivametsa tn 6-3, Tallinn` · lahtiolekuajad `E–R 09:00–18:00` · phone tel-link
- Background: `hero.jpg` with dark overlay (consistent with existing `#030509` dark surface)

### 2. Services grid — problem-shaped

- DOM id: `nisbel-conversion-services`
- Section title: `Mida tihti lahendame`
- 6 cards, each: customer-symptom headline → what we do. Each card is `<article class="nisbel-conversion-service">`:

  | Symptom (headline) | Action (subtext) |
  |---|---|
  | Mootorituli põleb | Diagnostika: süsteemne veaotsing OBD + tootjapõhise tarkvaraga |
  | Auto ei käivitu | Käivitusprobleemid: starter, aku, kütusepump, immobiliser |
  | Mootor väriseb või kaotab jõudu | Mootori töö probleemid: süüde, kompressioon, ventilatsioon |
  | Käigukast käitub imelikult | Käigukasti veaotsing: vedelik, ülekanne, juhtplokk |
  | Elektriviga | Autoelektri diagnostika: andurid, juhtmestik, juhtplokid |
  | Ülevaatus ei läbi | Ülevaatuseelne kontroll: probleemide tuvastus enne ametlikku ülevaatust |

- Footer line under grid: `Tavaline hooldus — õlivahetus, filtrid, vedelikud — käib paralleelselt.`

### 3. Trust photo band

- DOM id: `nisbel-conversion-trust`
- Section title: `Päris töökoda. Päris meister. Päris tööd.`
- Founder photo: `asutaja-sander-nisu.webp`, alt = `Sander Nisu — Nisbel Autostuudio meister`, caption `Sander Nisu — meister`.
- Workshop photo: `autohooldus-tallinnas-premium.webp`, alt = `Nisbel Autostuudio töökoda Tallinnas`.
- Engine case photo: `mb-mootori-taastamine.webp`, alt = `Mootori taastamine`, caption `Mootori taastamine — dokumenteeritud juhtum`.
- Certificates strip: `certificates.webp`, alt = `Sertifikaadid`. No claim about which certifications — image visible only.
- Trust line under photos: `Iga töö dokumenteerime. Sa näed, mida tegime, mida leidsime, mille vahetasime.`
- Explicitly NOT included: ratings, review counts, customer count, years operating, brand specialization, certifications named in text, fabricated testimonials.

### 4. FAQ schema replacement (in index.html)

Existing FAQ block (`index.html` lines 102–126) replaced with three verifiable Q/A entries. All facts are already provable from elsewhere in the schema (LocalBusiness address, phone, openingHours):

```json
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
        "text": "Esmaspäevast reedeni 09:00–18:00."
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
```

### 5. Mobile

Existing `nisbel-mobile-conversion.js` already injects a sticky bottom action bar (Helista / Broneeri / Kaart) and a `#nisbel-mobile-contact` section. The new hero CTAs are visible above the fold on mobile; the existing sticky bar remains the always-visible mobile contact path. The new tertiary CTA anchors to `#nisbel-mobile-contact` so the existing contact section is the funnel landing for "Kirjelda probleemi". No changes to the existing mobile script.

## Data Flow

1. Browser loads `index.html`.
2. React bundle (`assets/index-8f1a9bbc.js`) hydrates `#root`.
3. Five override scripts run on `DOMContentLoaded` (defer order: address-override → seo-trust → mobile-conversion → trust-content-blocks → conversion-hero-services).
4. Each script checks for its own DOM id; inserts if missing. `MutationObserver` re-runs the check after React rehydration.
5. User clicks phone CTA → native dialler. Clicks "Vaata teenuseid" → smooth scroll to `#nisbel-conversion-services`. Clicks "Kirjelda probleemi" → smooth scroll to `#nisbel-mobile-contact` (existing).
6. No network calls beyond Google Maps embed (already in address-override) and gtag (already in index head).

## Error Handling and No-JS Fallback

- If the React bundle fails to load, the existing `<noscript>` block (lines 235–243 of `index.html`) still shows address, phone, hours.
- If the new override script fails to parse, the four existing override scripts and React still render normally. The static snapshot verifier blocks deploy of an unparseable script via `node --check`.
- Idempotency: every insertion is guarded by `document.getElementById('<id>')`. MutationObserver re-checks after rehydration.
- No try/catch wraps around DOM mutations — failures should surface in console for debugging, not be silently swallowed.

## Testing

### Manual

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. Verify:

- Hero block at top with H1, sub, three CTAs.
- Phone CTA opens dialler (test on mobile).
- Secondary CTA scrolls to services.
- Services grid renders 6 cards.
- Trust photo band renders founder, workshop, engine case, certificates strip.
- Existing trust-content block (7-step process, 4 reasons, 4 placeholders) still renders.
- Existing mobile sticky bar still renders on viewport ≤ 760px.
- Map block still renders.
- FAQ schema in head no longer contains "12 kuu garantii" or "1 tund 45".

### Automated

```bash
node scripts/verify-static-snapshot.mjs
node --check assets/nisbel-conversion-hero-services.js
git diff --check
```

All pass before commit.

### Verifier additions

The verifier is extended with:

- `requiredFiles` / `publicFiles` include `assets/nisbel-conversion-hero-services.js`.
- `runtimeScriptRefs` includes `./assets/nisbel-conversion-hero-services.js`.
- New group `conversion hero/services`:
  - script contains `nisbel-conversion-hero`, `nisbel-conversion-services`, `nisbel-conversion-trust`.
  - script contains `tel:+37256846555` and the literal phone `+372 5684 6555`.
  - script contains exactly 6 `<article class="nisbel-conversion-service">` occurrences.
  - script does NOT contain forbidden terms: `Pärnu mnt`, `Parnu mnt`, `aggregateRating`, `ratingValue`, `12 kuu garantii`, `1 tund 45`, `Mercedes`, `Bosch`, `aastat kogemust`. (Did not include generic words like `klienti` — risk of blocking legitimate copy.)
- New group `FAQ schema` (note: existing verifier does not check FAQ at all today — this adds first FAQ assertions):
  - FAQ block parses as JSON-LD `FAQPage`.
  - FAQ does NOT contain `12 kuu garantii`.
  - FAQ does NOT contain `1 tund 45`.
  - FAQ contains at least one question naming `Liivametsa`.

## Deploy Decision

Public served files change. `classify-change-scope.mjs` will mark `deployRequired: true`. PR body must declare deploy required after merge; deploy itself happens out of band per `docs/DEPLOYMENT.md` and `docs/OPERATIONS.md`. This spec does NOT cover the deploy step.

## Rejected Alternatives

1. **Edit the compiled React bundle.** Forbidden by `AGENTS.md`. Risk of silent breakage with no source map review.
2. **Source reconstruction first.** Out of scope; multi-week effort blocking all other work.
3. **Extend `nisbel-trust-content-blocks.js`.** Verifier locks exact counts (7 steps, 4 reasons, 4 placeholders, 4 chips). Adding service blocks here would either break those counts or require coupled verifier edits across two domains.
4. **Hero copy via meta-tag only.** Meta affects SEO snippets, not visible page; does not solve problem 1 for live visitors.
5. **Single mega-spec covering all 10 problems.** Already rejected during scope decomposition; SP2/3/4 split off.
6. **Inline analytics events into SP1.** Deferred to SP4 to keep SP1 reviewable in one sitting and to let SP4 pick selectors after SP1 lands.

## Acceptance Criteria

- `node scripts/verify-static-snapshot.mjs` passes.
- `node --check assets/nisbel-conversion-hero-services.js` passes.
- Hero, services grid (6 cards), trust photo band visible at `http://localhost:8080`.
- Existing mobile sticky bar, map block, address override, trust-content block, SEO meta override still render.
- No `12 kuu garantii`, `1 tund 45`, `Mercedes`, `Bosch`, `aastat kogemust`, `aggregateRating`, `ratingValue` anywhere in `index.html` or the new script.
- Founder name `Sander Nisu` appears exactly once on the homepage (caption under founder photo).
- All CTAs are clickable; phone uses `tel:+37256846555`.
- No new dependencies, no compiled bundle change, no deploy logic change, no FTPS upload.

## Confirmations (for PR body, when SP1 is implemented)

- No fake reviews, ratings, or schema-ratings added.
- No source reconstruction started.
- No dependencies or lockfiles added.
- No deploy logic modified.
- No compiled bundles touched.
- All trust assertions backed by either an existing schema fact or an existing repo file (photo).
- All removed schema claims (`12 kuu garantii`, `1 tund 45min`) flagged in PR body so the operator can re-add them as verifier-enforced facts later if confirmed true.
