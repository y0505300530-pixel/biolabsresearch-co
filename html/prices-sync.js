/* Catalog prices win; a failed request leaves the rendered HTML price unchanged. */
(function () {
  var PRICES = {};
  var PRODUCTS = {};
  function canonSlug(s) {
    s = String(s || "").toLowerCase();
    if (s === "retatrutide" || s === "r3ta" || s === "reta") return "g3-r";
    return s;
  }
  function apply(map) {
    if (typeof CART_SUGGEST !== "undefined") {
      CART_SUGGEST.forEach(function (p) {
        if (map[p.slug] != null) p.price = map[p.slug];
      });
    }
    document.querySelectorAll("[data-slug]").forEach(function (el) {
      var slug = canonSlug(el.getAttribute("data-slug"));
      if (map[slug] == null) return;
      var price = map[slug];
      el.querySelectorAll(".price, .product-price, .catalog-price, .price-main, .ci-price, [data-price]").forEach(function (n) {
        if (n.hasAttribute("data-price")) n.setAttribute("data-price", String(price));
        var t = n.textContent || "";
        if (/\$\d/.test(t)) n.textContent = t.replace(/\$\d+(?:\.\d+)?/, "$" + price);
      });
    });
    var pdp = location.pathname.match(/\/products\/([^/.]+)/);
    var pdpSlug = pdp ? canonSlug(pdp[1]) : "";
    if (pdpSlug && map[pdpSlug] != null) {
      var price = map[pdpSlug];
      var p = PRODUCTS[pdpSlug], mg = String(window._pdpMg || "").replace(/\s+/g, "").toLowerCase();
      if (mg && p && p.strength_prices) {
        var sp = p.strength_prices;
        var entries = Array.isArray(sp) ? sp : Object.keys(sp).map(function (k) { return {mg:k, price:sp[k]}; });
        entries.forEach(function (e) {
          if (e && String(e.mg || e.strength || e.label || "").replace(/\s+/g, "").toLowerCase() === mg && e.price !== null && e.price !== '' && isFinite(Number(e.price))) price = Number(e.price);
        });
      }
      document.querySelectorAll("#current-price, .price-main, .product-price").forEach(function (n) {
        var t = n.textContent || "";
        if (/\$\d/.test(t) || n.id === "current-price") n.textContent = "$" + price;
      });
    }
  }
  fetch("/api/products")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      var items = Array.isArray(d) ? d : [];
      items.forEach(function (p) {
        if (p && p.slug && p.price != null && isFinite(Number(p.price))) {
          var cs = canonSlug(p.slug);
          PRICES[p.slug] = Number(p.price);
          PRICES[cs] = Number(p.price);
          PRODUCTS[p.slug] = p;
          PRODUCTS[cs] = p;
        }
      });
      apply(PRICES);
    })
    .catch(function () { apply(PRICES); });
})();
