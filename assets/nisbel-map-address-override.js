(function () {
  var newAddressShort = "Liivametsa tn 6-3";
  var newAddressFull = "Liivametsa tn 6-3, 11216 Tallinn";
  var mapLink = "https://share.google/0mviOSKwb9QdGUHxH";
  var mapEmbed = "https://www.google.com/maps?q=Nisbel%20Autostuudio%2C%20Liivametsa%20tn%206-3%2C%2011216%20Tallinn&output=embed";

  var replacements = [
    ["Pärnu mnt 393, Tallinn", newAddressFull],
    ["Pärnu mnt 393", newAddressShort],
    ["Pärnu mnt. 393", newAddressShort],
    ["Parnu mnt 393, Tallinn", newAddressFull],
    ["Parnu mnt 393", newAddressShort],
    ["Pärnu mnt.+393,+10914+Tallinn", "Liivametsa+tn+6-3,+11216+Tallinn"],
    ["P%C3%A4rnu+mnt.+393,+10914+Tallinn", "Liivametsa+tn+6-3,+11216+Tallinn"]
  ];

  function replaceTextValue(value) {
    var next = value;
    replacements.forEach(function (pair) {
      next = next.split(pair[0]).join(pair[1]);
    });
    return next;
  }

  function replaceTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var next = replaceTextValue(node.nodeValue);
      if (next !== node.nodeValue) {
        node.nodeValue = next;
      }
    }
  }

  function updateMapLinks(root) {
    root.querySelectorAll("a[href*='google.com/maps'], a[href*='share.google']").forEach(function (anchor) {
      var label = anchor.textContent || "";
      var href = anchor.getAttribute("href") || "";
      if (
        label.indexOf("Liivametsa") !== -1 ||
        href.indexOf("Nisbel") !== -1 ||
        href.indexOf("P%C3%A4rnu") !== -1 ||
        href.indexOf("Pärnu") !== -1
      ) {
        anchor.setAttribute("href", mapLink);
        anchor.setAttribute("aria-label", newAddressFull);
      }
    });
  }

  function updateMapFrame(root) {
    var section = root.querySelector("#location-map");
    if (!section) {
      var contactSection = root.querySelector("#kontakt");
      if (contactSection) {
        section = document.createElement("section");
        section.id = "location-map";
        section.innerHTML =
          '<div>' +
          '<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
          "</div>";
        contactSection.insertAdjacentElement("afterend", section);
      }
    }

    if (!section) {
      return;
    }

    section.setAttribute("aria-label", "Nisbel Autostuudio kaart: " + newAddressFull);
    section.querySelectorAll("iframe").forEach(function (frame) {
      if (frame.getAttribute("src") !== mapEmbed) {
        frame.setAttribute("src", mapEmbed);
      }
      frame.setAttribute("title", "Nisbel Autostuudio asukoht: " + newAddressFull);
    });
  }

  function applyOverrides() {
    replaceTextNodes(document.body);
    updateMapLinks(document);
    updateMapFrame(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyOverrides, { once: true });
  } else {
    applyOverrides();
  }

  var observer = new MutationObserver(function () {
    applyOverrides();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
