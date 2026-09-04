/* Pull list prices from same-origin CRM API; local fallback map. */
(function () {
  var PRICES = {
    "retatrutide": 139,
    "bpc-157": 89,
    "tb-500": 99,
    "bpc-157-tb-500-blend": 125,
    "glow-70": 139,
    "tesamorelin-ipamorelin": 119,
    "thymosin-alpha-1": 109,
    "nad-plus": 99,
    "mots-c": 95,
    "curcumin-phytosome": 109,
    "kisspeptin-10": 99,
    "semax": 89,
    "epithalon": 79,
    "ghk-cu": 69,
    "aod-9604": 85,
    "kpv": 79
  };
  function apply(map) {
    if (typeof CART_SUGGEST !== "undefined") {
      CART_SUGGEST.forEach(function (p) {
        if (map[p.slug] != null) p.price = map[p.slug];
      });
    }
    document.querySelectorAll("[data-slug]").forEach(function (el) {
      var slug = el.getAttribute("data-slug");
      if (map[slug] == null) return;
      var price = map[slug];
      el.querySelectorAll(".price, .product-price, .catalog-price, .price-main, .ci-price, [data-price]").forEach(function (n) {
        if (n.hasAttribute("data-price")) n.setAttribute("data-price", String(price));
        var t = n.textContent || "";
        if (/\$\d/.test(t)) n.textContent = t.replace(/\$\d+(?:\.\d+)?/, "$" + price);
      });
    });
    var pdp = location.pathname.match(/\/products\/([^/.]+)/);
    if (pdp && map[pdp[1]] != null) {
      var price = map[pdp[1]];
      document.querySelectorAll("#current-price, .price-main, .product-price").forEach(function (n) {
        var t = n.textContent || "";
        if (/\$\d/.test(t) || n.id === "current-price") n.textContent = "$" + price;
      });
    }
  }
  apply(PRICES);
  fetch("/api/products")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      var items = Array.isArray(d) ? d : [];
      items.forEach(function (p) {
        if (p && p.slug && p.price != null) PRICES[p.slug] = Number(p.price);
      });
      apply(PRICES);
    })
    .catch(function () {});
})();
