/* v2.99f — sitewide Organization JSON-LD if the page did not already emit it. */
(function () {
  try {
    if (document.getElementById('organization-jsonld')) return;
    var nodes = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].textContent || '';
      if (t.indexOf('biolabsresearch.co/#organization') !== -1) return;
      if (/"@type"\s*:\s*"Organization"/.test(t) && t.indexOf('WebSite') === -1 && t.indexOf('Product') === -1 && t.indexOf('manufacturer') === -1) {
        return;
      }
    }
    var data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://biolabsresearch.co/#organization",
      "name": "BioLabs Research",
      "legalName": "LEEDS MARKETING GROUP LTD",
      "alternateName": ["BioLabs Research", "biolabsresearch.co"],
      "url": "https://biolabsresearch.co",
      "logo": {
        "@type": "ImageObject",
        "url": "https://biolabsresearch.co/biolabsresearch-logo.png",
        "width": 512,
        "height": 512
      },
      "email": "admin@biolabsresearch.co",
      "description": "BioLabs Research supplies research-use-only (RUO) compounds for laboratory inquiry: lyophilized research reagents listed by catalog identity and vial strength, with lot documentation (COA) available on request. Products are for in vitro and analytical research only — not for human consumption, clinical use, or therapeutic claims.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "71-75 Shelton Street, Covent Garden",
        "addressLocality": "London",
        "postalCode": "WC2H 9JQ",
        "addressCountry": "GB"
      }
    };
    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'organization-jsonld';
    el.textContent = JSON.stringify(data);
    (document.head || document.documentElement).appendChild(el);
  } catch (e) {}
})();
