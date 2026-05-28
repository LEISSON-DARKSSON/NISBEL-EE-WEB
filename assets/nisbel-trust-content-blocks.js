(function () {
  var BLOCK_ID = "nisbel-trust-content";
  var STYLE_ID = "nisbel-trust-content-style";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".nisbel-trust-content {",
      "  position: relative;",
      "  z-index: 1;",
      "  padding: 72px 20px;",
      "  background: #05070f;",
      "  color: #f8fafc;",
      "  border-top: 1px solid rgba(255, 255, 255, 0.08);",
      "  border-bottom: 1px solid rgba(255, 255, 255, 0.08);",
      "}",
      ".nisbel-trust-content * { box-sizing: border-box; }",
      ".nisbel-trust-inner {",
      "  width: min(1120px, 100%);",
      "  margin: 0 auto;",
      "}",
      ".nisbel-trust-eyebrow {",
      "  margin: 0 0 12px;",
      "  color: rgba(255, 255, 255, 0.62);",
      "  font: 700 12px/1.2 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "  letter-spacing: 0;",
      "  text-transform: uppercase;",
      "}",
      ".nisbel-trust-content h2 {",
      "  margin: 0;",
      "  color: #ffffff;",
      "  font: 600 48px/1.04 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "  letter-spacing: 0;",
      "}",
      ".nisbel-trust-content h3 {",
      "  margin: 0;",
      "  color: #ffffff;",
      "  font: 600 18px/1.25 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "  letter-spacing: 0;",
      "}",
      ".nisbel-trust-lede {",
      "  max-width: 760px;",
      "  margin: 18px 0 0;",
      "  color: rgba(255, 255, 255, 0.72);",
      "  font: 400 16px/1.7 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-chips {",
      "  display: flex;",
      "  flex-wrap: wrap;",
      "  gap: 10px;",
      "  padding: 0;",
      "  margin: 28px 0 0;",
      "  list-style: none;",
      "}",
      ".nisbel-trust-chip {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  min-height: 42px;",
      "  padding: 10px 14px;",
      "  border: 1px solid rgba(255, 255, 255, 0.16);",
      "  border-radius: 999px;",
      "  background: rgba(255, 255, 255, 0.06);",
      "  color: rgba(255, 255, 255, 0.9);",
      "  font: 500 14px/1.25 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-grid {",
      "  display: grid;",
      "  gap: 18px;",
      "  margin-top: 34px;",
      "}",
      ".nisbel-trust-process {",
      "  grid-template-columns: repeat(7, minmax(0, 1fr));",
      "  counter-reset: nisbel-process;",
      "}",
      ".nisbel-trust-process-step {",
      "  min-height: 156px;",
      "  padding: 18px 16px;",
      "  border: 1px solid rgba(255, 255, 255, 0.12);",
      "  border-radius: 8px;",
      "  background: rgba(255, 255, 255, 0.045);",
      "}",
      ".nisbel-trust-process-step::before {",
      "  counter-increment: nisbel-process;",
      "  content: counter(nisbel-process, decimal-leading-zero);",
      "  display: block;",
      "  margin-bottom: 22px;",
      "  color: rgba(255, 255, 255, 0.48);",
      "  font: 600 12px/1 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-process-step span {",
      "  display: block;",
      "  color: #ffffff;",
      "  font: 600 15px/1.32 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-section {",
      "  margin-top: 68px;",
      "}",
      ".nisbel-trust-section-header {",
      "  display: grid;",
      "  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);",
      "  gap: 32px;",
      "  align-items: end;",
      "}",
      ".nisbel-trust-section-header p {",
      "  margin: 0;",
      "  color: rgba(255, 255, 255, 0.68);",
      "  font: 400 15px/1.7 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-reasons {",
      "  grid-template-columns: repeat(4, minmax(0, 1fr));",
      "}",
      ".nisbel-trust-reason,",
      ".nisbel-trust-placeholder {",
      "  padding: 22px;",
      "  border: 1px solid rgba(255, 255, 255, 0.12);",
      "  border-radius: 8px;",
      "  background: rgba(255, 255, 255, 0.045);",
      "}",
      ".nisbel-trust-reason p,",
      ".nisbel-trust-placeholder p {",
      "  margin: 12px 0 0;",
      "  color: rgba(255, 255, 255, 0.68);",
      "  font: 400 14px/1.62 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-placeholders {",
      "  grid-template-columns: repeat(4, minmax(0, 1fr));",
      "}",
      ".nisbel-trust-placeholder strong {",
      "  display: block;",
      "  color: #ffffff;",
      "  font: 600 15px/1.35 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      ".nisbel-trust-note {",
      "  margin: 18px 0 0;",
      "  color: rgba(255, 255, 255, 0.58);",
      "  font: 400 14px/1.7 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "}",
      "@media (max-width: 1060px) {",
      "  .nisbel-trust-process,",
      "  .nisbel-trust-reasons,",
      "  .nisbel-trust-placeholders { grid-template-columns: repeat(2, minmax(0, 1fr)); }",
      "}",
      "@media (max-width: 760px) {",
      "  .nisbel-trust-content { padding: 54px 18px calc(70px + env(safe-area-inset-bottom)); }",
      "  .nisbel-trust-content h2 { font-size: 32px; }",
      "  .nisbel-trust-section { margin-top: 54px; }",
      "  .nisbel-trust-section-header { grid-template-columns: 1fr; gap: 14px; }",
      "  .nisbel-trust-process,",
      "  .nisbel-trust-reasons,",
      "  .nisbel-trust-placeholders { grid-template-columns: 1fr; }",
      "  .nisbel-trust-process-step { min-height: auto; }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function createTrustContent() {
    var wrapper = document.createElement("section");
    wrapper.id = BLOCK_ID;
    wrapper.className = "nisbel-trust-content";
    wrapper.setAttribute("aria-labelledby", "nisbel-trust-heading");

    wrapper.innerHTML = [
      '<div class="nisbel-trust-inner">',
      '<p class="nisbel-trust-eyebrow">Usalduse alus</p>',
      '<h2 id="nisbel-trust-heading">Selge protsess enne suurt otsust.</h2>',
      '<p class="nisbel-trust-lede">Nisbel sobib kliendile, kes tahab enne suuremat tööd aru saada, mis on leitud, millised on valikud ja mida tasub edasi teha.</p>',
      '<ul class="nisbel-trust-chips" aria-label="Nisbel Autostuudio usalduspunktid">',
      '<li class="nisbel-trust-chip">Läbipaistev tööprotsess</li>',
      '<li class="nisbel-trust-chip">Fotod ja selgitused töö käigus</li>',
      '<li class="nisbel-trust-chip">Selge hinnang enne suuremat remonti</li>',
      '<li class="nisbel-trust-chip">Tallinn / Liivametsa tn 6-3</li>',
      '</ul>',
      '<div class="nisbel-trust-section">',
      '<div class="nisbel-trust-section-header">',
      '<h2>Kuidas töö käib</h2>',
      '<p>Alustame sümptomist ja kokkuleppest. Suurem töö läheb edasi alles siis, kui leiud, võimalused ja töömaht on läbi räägitud.</p>',
      '</div>',
      '<ol class="nisbel-trust-grid nisbel-trust-process" aria-label="Nisbel Autostuudio tööprotsess">',
      '<li class="nisbel-trust-process-step"><span>Kirjeldad probleemi</span></li>',
      '<li class="nisbel-trust-process-step"><span>Fikseerime auto seisukorra</span></li>',
      '<li class="nisbel-trust-process-step"><span>Teeme esmase diagnostika</span></li>',
      '<li class="nisbel-trust-process-step"><span>Selgitame leiud ja võimalused</span></li>',
      '<li class="nisbel-trust-process-step"><span>Lepime töömahu kokku</span></li>',
      '<li class="nisbel-trust-process-step"><span>Teeme töö ja kontrolli</span></li>',
      '<li class="nisbel-trust-process-step"><span>Anname üle kokkuvõtte</span></li>',
      '</ol>',
      '<p class="nisbel-trust-note">Võimalusel jagame töö käigus fotosid ja selgitusi. Kui viga vajab pikemat jälgimist, ütleme seda enne lisatööde alustamist.</p>',
      '</div>',
      '<div class="nisbel-trust-section">',
      '<div class="nisbel-trust-section-header">',
      '<h2>Miks kliendid valivad Nisbeli</h2>',
      '<p>Fookus on olukordadel, kus klient vajab rahulikku selgitust, selget järgmist sammu ja hoolikat käsitlust.</p>',
      '</div>',
      '<div class="nisbel-trust-grid nisbel-trust-reasons">',
      '<article class="nisbel-trust-reason"><h3>Viga ei ole ilmne</h3><p>Kui sümptom tuleb ja kaob või veakood ei räägi kogu lugu, alustame põhjusest, mitte juhuslikust detailivahetusest.</p></article>',
      '<article class="nisbel-trust-reason"><h3>Tahad enne otsust selgust</h3><p>Enne suuremat tööd selgitame, mida leidsime, millised on variandid ja mis vajab kokkulepet.</p></article>',
      '<article class="nisbel-trust-reason"><h3>Auto vajab hoolikat käsitlust</h3><p>Sobib kliendile, kes ootab puhtust, läbipaistvust ja rahulikku selgitust.</p></article>',
      '<article class="nisbel-trust-reason"><h3>Asukoht ja kontakt peavad olema selged</h3><p>Liivametsa tn 6-3, Tallinn. Mobiilis on helistamine, broneerimine ja kaart ühe puudutuse kaugusel.</p></article>',
      '</div>',
      '</div>',
      '<div class="nisbel-trust-section">',
      '<div class="nisbel-trust-section-header">',
      '<h2>Juhtumiuuringud lisamisel</h2>',
      '<p>Siia lisame edaspidi päris tööde põhjal juhtumiuuringud: probleem, diagnostika, otsus, tehtud töö ja tulemus.</p>',
      '</div>',
      '<div class="nisbel-trust-grid nisbel-trust-placeholders" aria-label="Tulevaste juhtumiuuringute formaadi näidis">',
      '<div class="nisbel-trust-placeholder"><strong>Näidisstruktuur</strong><p>Probleem, sümptomid ja esmane taust.</p></div>',
      '<div class="nisbel-trust-placeholder"><strong>Päris juhtum lisamisel</strong><p>Lisame ainult tegeliku töö põhjal kinnitatud info.</p></div>',
      '<div class="nisbel-trust-placeholder"><strong>Fotod lisamisel</strong><p>Fotod lisatakse siis, kui need on töö ja kliendi loaga kasutatavad.</p></div>',
      '<div class="nisbel-trust-placeholder"><strong>Tulemus lisatakse pärast kinnitatud juhtumit</strong><p>Siin ei kasutata väljamõeldud tulemusi ega klienditsitaate.</p></div>',
      '</div>',
      '</div>',
      '</div>'
    ].join("");

    return wrapper;
  }

  function findInsertionPoint() {
    return (
      document.querySelector("#studio") ||
      document.querySelector("#top main section") ||
      document.querySelector("#teenused") ||
      document.querySelector("#root > *")
    );
  }

  function applyTrustContent() {
    if (!document.body) {
      return;
    }

    ensureStyles();

    if (document.getElementById(BLOCK_ID)) {
      return;
    }

    var block = createTrustContent();
    var anchor = findInsertionPoint();

    if (anchor && anchor.parentNode) {
      anchor.insertAdjacentElement("afterend", block);
      return;
    }

    var root = document.getElementById("root");
    if (root) {
      root.appendChild(block);
    } else {
      document.body.appendChild(block);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTrustContent, { once: true });
  } else {
    applyTrustContent();
  }

  new MutationObserver(function () {
    if (!document.getElementById(BLOCK_ID)) {
      applyTrustContent();
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
