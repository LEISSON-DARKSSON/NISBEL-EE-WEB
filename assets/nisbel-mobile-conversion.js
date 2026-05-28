(function () {
  var phoneDisplay = "+372 5684 6555";
  var phoneHref = "tel:+37256846555";
  var bookingHref = "/#kontakt";
  var mapHref = "https://share.google/0mviOSKwb9QdGUHxH";
  var address = "Liivametsa tn 6-3, 11216 Tallinn";
  var hours = "E-R 09:00-18:00";

  function ensureStyles() {
    if (document.getElementById("nisbel-mobile-conversion-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "nisbel-mobile-conversion-style";
    style.textContent = [
      "@media (max-width: 760px) {",
      "  body { padding-bottom: calc(84px + env(safe-area-inset-bottom)); }",
      "  .nisbel-mobile-actions {",
      "    position: fixed;",
      "    left: 0;",
      "    right: 0;",
      "    bottom: 0;",
      "    z-index: 9999;",
      "    display: grid;",
      "    grid-template-columns: repeat(3, minmax(0, 1fr));",
      "    gap: 1px;",
      "    padding: 8px 10px calc(8px + env(safe-area-inset-bottom));",
      "    background: rgba(3, 5, 9, 0.96);",
      "    border-top: 1px solid rgba(255, 255, 255, 0.14);",
      "    box-shadow: 0 -16px 40px rgba(0, 0, 0, 0.42);",
      "    backdrop-filter: blur(16px);",
      "  }",
      "  .nisbel-mobile-actions a {",
      "    min-height: 52px;",
      "    display: inline-flex;",
      "    align-items: center;",
      "    justify-content: center;",
      "    border-radius: 8px;",
      "    color: #ffffff;",
      "    text-decoration: none;",
      "    font: 600 13px/1.1 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "    letter-spacing: 0;",
      "    background: rgba(255, 255, 255, 0.08);",
      "    border: 1px solid rgba(255, 255, 255, 0.12);",
      "  }",
      "  .nisbel-mobile-actions a[data-primary='true'] {",
      "    color: #05070f;",
      "    background: #ffffff;",
      "    border-color: #ffffff;",
      "  }",
      "  .nisbel-mobile-contact {",
      "    display: block;",
      "    padding: 28px 20px;",
      "    background: #05070f;",
      "    border-top: 1px solid rgba(255, 255, 255, 0.1);",
      "    border-bottom: 1px solid rgba(255, 255, 255, 0.1);",
      "    color: #ffffff;",
      "  }",
      "  .nisbel-mobile-contact h2 {",
      "    margin: 0 0 16px;",
      "    color: #ffffff;",
      "    font: 600 20px/1.2 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "    letter-spacing: 0;",
      "  }",
      "  .nisbel-mobile-contact dl {",
      "    display: grid;",
      "    grid-template-columns: 92px minmax(0, 1fr);",
      "    gap: 12px 14px;",
      "    margin: 0;",
      "  }",
      "  .nisbel-mobile-contact dt {",
      "    color: rgba(255, 255, 255, 0.58);",
      "    font: 500 13px/1.35 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "  }",
      "  .nisbel-mobile-contact dd {",
      "    margin: 0;",
      "    color: #ffffff;",
      "    font: 500 14px/1.35 Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
      "  }",
      "  .nisbel-mobile-contact a {",
      "    color: #ffffff;",
      "    text-decoration: underline;",
      "    text-underline-offset: 3px;",
      "  }",
      "}",
      "@media (min-width: 761px) {",
      "  .nisbel-mobile-actions,",
      "  .nisbel-mobile-contact { display: none !important; }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function ensureActionBar() {
    if (document.querySelector(".nisbel-mobile-actions")) {
      return;
    }

    var nav = document.createElement("nav");
    nav.className = "nisbel-mobile-actions";
    nav.setAttribute("aria-label", "Kiired kontaktitegevused");
    nav.innerHTML =
      '<a href="' + phoneHref + '" aria-label="Helista Nisbel Autostuudiosse">Helista</a>' +
      '<a href="' + bookingHref + '" data-primary="true" aria-label="Broneeri diagnostika aeg">Broneeri</a>' +
      '<a href="' + mapHref + '" target="_blank" rel="noopener noreferrer" aria-label="Ava Nisbel Autostuudio kaart">Kaart</a>';
    document.body.appendChild(nav);
  }

  function ensureContactSummary() {
    if (document.getElementById("nisbel-mobile-contact")) {
      return;
    }

    var section = document.createElement("section");
    section.id = "nisbel-mobile-contact";
    section.className = "nisbel-mobile-contact";
    section.setAttribute("aria-label", "Nisbel Autostuudio kontaktinfo");
    section.innerHTML =
      "<h2>Kontakt</h2>" +
      "<dl>" +
      "<dt>Telefon</dt><dd><a href=\"" + phoneHref + "\">" + phoneDisplay + "</a></dd>" +
      "<dt>Aadress</dt><dd>" + address + "</dd>" +
      "<dt>Avatud</dt><dd>" + hours + "</dd>" +
      "<dt>Kaart</dt><dd><a href=\"" + mapHref + "\" target=\"_blank\" rel=\"noopener noreferrer\">Google Maps</a></dd>" +
      "</dl>";

    var target = document.querySelector("#location-map") || document.querySelector("#kontakt") || document.querySelector("#contact");
    if (target && target.parentNode) {
      target.parentNode.insertBefore(section, target);
    } else {
      document.body.appendChild(section);
    }
  }

  function normalizeCtaCopy(root) {
    root.querySelectorAll("a, button").forEach(function (el) {
      var text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (text === "Broneeri aeg") {
        el.textContent = "Broneeri diagnostika aeg";
        el.setAttribute("aria-label", "Broneeri diagnostika aeg");
      }
    });
  }

  function applyMobileConversion() {
    if (!document.body) {
      return;
    }

    ensureStyles();
    ensureActionBar();
    ensureContactSummary();
    normalizeCtaCopy(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyMobileConversion, { once: true });
  } else {
    applyMobileConversion();
  }

  new MutationObserver(applyMobileConversion).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
