# SP2 — SEO Landing Pages Design

**Date:** 2026-05-30
**Scope:** Sub-project 2 of the homepage conversion-readiness decomposition. Addresses problem 7 (SEO maandumislehed).
**Status:** Autonomous-mode draft.

## Goal

Ship 5 static directory-style landing pages, each targeted at one customer search intent, each fully self-contained (no React, no override scripts), each indexable, with sitemap + JSON-LD + verifier coverage.

## In Scope (SP2)

- `autodiagnostika-tallinn/index.html` — broad diagnostics intent
- `autoelekter-tallinn/index.html` — auto electrical intent
- `mootorituli-poleb/index.html` — check-engine symptom intent
- `auto-ei-kaivitu/index.html` — no-start symptom intent
- `ulevaatuseelne-kontroll/index.html` — pre-inspection check intent
- Shared `assets/landing.css` for brand consistency without duplication
- Sitemap update: 5 new `<url>` entries + new `lastmod` 2026-05-30
- Verifier update: register pages, update sitemap lastmod, add `landing pages` assertion group
- REPO_STATE.md + OPERATIONS.md notes

## Out of Scope (SP2)

- Apache rewrite rules (directory URLs work via static directory indexing)
- Source reconstruction
- Form submission (deferred to SP3)
- Analytics events (deferred to SP4)
- Blog content (existing)
- Compiled bundle edits
- Deploy

## Architecture

- Each landing page = standalone `<directory>/index.html`. No `<div id="root">`, no React, no override scripts. Self-contained head + body + inline-or-shared CSS.
- Shared `assets/landing.css` keeps cross-page styling DRY without coupling to React.
- LocalBusiness JSON-LD repeated on every page (canonical entity + url pointing back to that page).
- Service JSON-LD per page (Service with provider = LocalBusiness, areaServed = Tallinn).
- Canonical URL on each page = own page (no canonical-to-homepage — these pages must rank independently).

## Page Template (per landing page)

Sections:

1. Head: charset, viewport, title, description, canonical, OG + Twitter, gtag, JSON-LD (LocalBusiness + Service), link to `assets/landing.css`.
2. Header: brand mark + phone tel-link + link back to `/`.
3. Hero: H1 (page-specific), sub (page-specific), primary CTA `tel:+37256846555`, secondary CTA back to `/`.
4. Symptoms / Triggers list.
5. What we check (technical detail list — bullet items only, no time/price claims).
6. Process (Kirjelda → Diagnostika → Kokkulepe → Töö).
7. Photo (relevant workshop image + alt).
8. Contact: address, map link, phone, hours.
9. Footer: link to homepage + 4 sibling landing pages.

Per-page content table (autonomous picks):

| Slug | H1 | Hero sub |
|---|---|---|
| autodiagnostika-tallinn | Autodiagnostika Tallinnas | Süsteemne veaotsing OBD-II + tootjapõhise tarkvaraga. Toome rikke põhjuse välja, mitte ei vaheta osi pimesi. |
| autoelekter-tallinn | Autoelektri diagnostika ja remont Tallinnas | Andurid, juhtmestik, juhtplokid, käivitussüsteem. Mõõtmine multimeetri ja ostsilloskoobiga, mitte arvamine. |
| mootorituli-poleb | Mootorituli põleb? Süsteemne veaotsing Nisbelis | OBD-II kood on alguspunkt, mitte vastus. Loeme koodid, valideerime andureid, kontrollime tegelikku põhjust enne osavahetust. |
| auto-ei-kaivitu | Auto ei käivitu? Käivitusprobleemide diagnostika Tallinnas | Starter, aku, kütusepump, süütesüsteem, immobiliser — kontrollime järjest, kuni põhjus on kindel. |
| ulevaatuseelne-kontroll | Ülevaatuseelne kontroll Tallinnas | Kontrollime samad sõlmed mis tehniline ülevaatus enne, kui sa sõidad ametliku kontrolli alla. Ebameeldivad üllatused tulevad meie boksis, mitte ülevaatusjaamas. |

## Trust / Claim Discipline

No invented facts. Allowed on landing pages:
- Address, phone, hours (verified from existing schema).
- Workshop photos (`autohooldus-tallinnas-premium.webp`, `asutaja-sander-nisu.webp`, `mb-mootori-taastamine.webp`).
- Sander Nisu name + role.
- Brand/methodology description (OBD-II, multimeeter, ostsilloskoop — generic tools, not brand-specialty claims).

Forbidden on landing pages (same verifier list as SP1):
- `12 kuu garantii`, `1 tund 45`, `Mercedes`, `Bosch`, `aastat kogemust`, `aggregateRating`, `ratingValue`, `Pärnu mnt`, `Parnu mnt`, `Minimalistlik UI`, `Review`.

## Verifier Additions

- `requiredFiles` += 5 new index.html paths and `assets/landing.css`.
- `publicFiles` += same 6.
- Sitemap check updates: `lastmod 2026-05-30`, adds 5 new `<loc>` assertions.
- New group `landing pages`:
  - each file contains its expected H1.
  - each file contains `tel:+37256846555`.
  - each file contains `Liivametsa tn 6-3`.
  - each file contains a LocalBusiness JSON-LD block.
  - each file does NOT contain forbidden terms.
  - shared CSS file contains the expected token markers (e.g., `.landing-hero`).

## Acceptance Criteria

- `node scripts/verify-static-snapshot.mjs` — PASS, including new `landing pages` group.
- Each landing page is reachable at its directory URL during local preview.
- Each H1 appears once and is unique per page.
- Sitemap lists all 6 URLs (`/`, plus 5 landing pages) with `lastmod 2026-05-30`.
- No forbidden terms anywhere.
- Page weight per landing page < 100 KB before images (shared CSS factored out).
- Mobile viewport: hero + primary CTA visible above fold.
