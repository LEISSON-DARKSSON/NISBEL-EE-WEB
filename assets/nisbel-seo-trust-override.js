(function () {
  var GOOD_TITLE = "Autohooldus ja diagnostika Tallinnas | Nisbel Autostuudio";
  var GOOD_DESCRIPTION = "Nisbel Autostuudio Tallinnas aitab autohoolduse, diagnostika ja detailingu puhul. Läbipaistev tööprotsess, põhjalik probleemilahendus ja selge kontakt.";
  var GOOD_IMAGE = "https://nisbel.ee/autohooldus-tallinnas-premium.jpg";
  var metaValues = [
    ["name", "description", GOOD_DESCRIPTION],
    ["property", "og:title", GOOD_TITLE],
    ["property", "og:description", "Nisbel Autostuudio aitab autohoolduse, diagnostika ja detailingu puhul. Töökoja aadress: Liivametsa tn 6-3, Tallinn."],
    ["property", "og:image", GOOD_IMAGE],
    ["property", "twitter:title", GOOD_TITLE],
    ["property", "twitter:description", "Nisbel Autostuudio aitab autohoolduse, diagnostika ja detailingu puhul. Töökoja aadress: Liivametsa tn 6-3, Tallinn."],
    ["property", "twitter:image", GOOD_IMAGE]
  ];

  function applyTitle() {
    if (document.title !== GOOD_TITLE) {
      document.title = GOOD_TITLE;
    }

    var titleNode = document.querySelector("head > title");
    if (titleNode && titleNode.textContent !== GOOD_TITLE) {
      titleNode.textContent = GOOD_TITLE;
    }
  }

  function applyMeta() {
    metaValues.forEach(function (entry) {
      var attr = entry[0];
      var key = entry[1];
      var value = entry[2];
      var selector = "meta[" + attr + "='" + key + "']";
      var node = document.querySelector(selector);

      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attr, key);
        document.head.appendChild(node);
      }

      if (node.getAttribute("content") !== value) {
        node.setAttribute("content", value);
      }
    });
  }

  function applySeoTrustOverrides() {
    applyTitle();
    applyMeta();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySeoTrustOverrides, { once: true });
  } else {
    applySeoTrustOverrides();
  }

  new MutationObserver(applySeoTrustOverrides).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
