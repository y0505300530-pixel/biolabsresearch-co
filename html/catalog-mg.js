/* catalog-mg.js — clickable catalog strength chips; update price + ATC */
(function () {
  var FALLBACK = {
    "bpc-157-tb-500-blend": {
      strengths: ["20mg"],
      strength_prices: { "20mg": 125 },
      strength_originals: { "20mg": 150 },
      price: 125,
      original_price: 150
    },
    "nad-plus": {
      strengths: ["500mg", "1000mg"],
      strength_prices: { "500mg": 99, "1000mg": 130 },
      strength_originals: { "500mg": 119, "1000mg": 155 },
      price: 130,
      original_price: 155
    },
    "aod-9604": {
      strengths: ["5mg", "10mg"],
      strength_prices: { "5mg": 42, "10mg": 85 },
      strength_originals: { "5mg": 52, "10mg": 105 },
      price: 85,
      original_price: 105
    },
    "curcumin-phytosome": {
      strengths: ["500mg"],
      strength_prices: { "500mg": 109 },
      strength_originals: { "500mg": 135 },
      price: 109,
      original_price: 135
    },
    "tesamorelin-ipamorelin": {
      strengths: ["5mg", "10mg", "15mg"],
      strength_prices: { "5mg": 60, "10mg": 119, "15mg": 120 },
      strength_originals: { "5mg": 72, "10mg": 145, "15mg": 145 },
      price: 120,
      original_price: 145
    },
    "bpc-157": {
      strengths: ["10mg", "20mg"],
      strength_prices: { "10mg": 88, "20mg": 105 },
      strength_originals: { "10mg": 105, "20mg": 125 },
    },
    "glow-70": {
      strengths: ["70mg"],
      strength_prices: { "70mg": 139 },
      strength_originals: { "70mg": 169 },
      price: 139,
      original_price: 169
    },
    "epithalon": {
      strengths: ["10mg", "50mg"],
      strength_prices: { "10mg": 45, "50mg": 120 },
      strength_originals: { "10mg": 55, "50mg": 145 },
      price: 120,
      original_price: 145
    },
    "ghk-cu": {
      strengths: ["100mg"],
      strength_prices: { "100mg": 100 },
      strength_originals: { "100mg": 120 },
      price: 100,
      original_price: 120
    },
    "mots-c": {
      strengths: ["10mg", "20mg"],
      strength_prices: { "10mg": 95, "20mg": 110 },
      strength_originals: { "10mg": 115, "20mg": 135 },
      price: 110,
      original_price: 135
    },
    "kpv": {
      strengths: ["10mg"],
      strength_prices: { "10mg": 79 },
      strength_originals: { "10mg": 95 },
      price: 79,
      original_price: 95
    },
    "semax": {
      strengths: ["10mg", "30mg"],
      strength_prices: { "10mg": 99, "30mg": 119 },
      strength_originals: { "10mg": 119, "30mg": 145 },
      price: 119,
      original_price: 145
    },
    "kisspeptin-10": {
      strengths: ["10mg"],
      strength_prices: { "10mg": 99 },
      strength_originals: { "10mg": 119 },
      price: 99,
      original_price: 119
    },
    "thymosin-alpha-1": {
      strengths: ["10mg"],
      strength_prices: { "10mg": 109 },
      strength_originals: { "10mg": 129 },
      price: 109,
      original_price: 129
    },
    "tb-500": {
      strengths: ["10mg"],
      strength_prices: { "10mg": 105 },
      strength_originals: { "10mg": 125 },
      price: 105,
      original_price: 125
    },
    "ipamorelin": {
      strengths: ["10mg"],
      strength_prices: { "10mg": 80 },
      strength_originals: { "10mg": 96 },
      price: 80,
      original_price: 96
    },
    "tesamorelin": {
      strengths: ["10mg", "20mg"],
      strength_prices: { "10mg": 85, "20mg": 130 },
      strength_originals: { "10mg": 105, "20mg": 155 },
      price: 130,
      original_price: 155
    },
    "tirzepatide": {
      strengths: ["10mg"],
      strength_prices: { "10mg": 90 },
      strength_originals: { "10mg": 110 },
      price: 90,
      original_price: 110
    },
    "semaglutide": {
      strengths: ["5mg", "10mg"],
      strength_prices: { "5mg": 60, "10mg": 90 },
      strength_originals: { "5mg": 75, "10mg": 110 },
      price: 90,
      original_price: 110
    },
    "retatrutide": {
      strengths: ["10mg", "20mg", "50mg"],
      strength_prices: { "10mg": 85, "20mg": 135, "50mg": 300 },
      strength_originals: { "10mg": 105, "20mg": 165, "50mg": 360 },
      price: 300,
      original_price: 360
    }, 80);
      }).observe(grid, { childList: true, subtree: true });
    }
  }

  function fallbackList() {
    return Object.keys(FALLBACK).map(function (slug) {
      return Object.assign({ slug: slug }, FALLBACK[slug]);
    });
  }

  function start(items) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { boot(items); });
    } else {
      boot(items);
    }
  }

  function loadProducts() {
    var urls = ["/api/products", "/products-data.json"];
    function next(i) {
      if (i >= urls.length) {
        start(fallbackList());
        return;
      }
      fetch(urls[i], { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (d) {
          var items = Array.isArray(d) ? d : (d && (d.products || d.items)) || [];
          if (!items.length) throw new Error("empty");
          start(items);
        })
        .catch(function () { next(i + 1); });
    }
    next(0);
  }
  loadProducts();

  var n = 0;
  (function hook() {
    if (typeof window.renderProducts === "function" && !window.renderProducts.__catalogMg) {
      var orig = window.renderProducts;
      window.renderProducts = function (products) {
        var r = orig.apply(this, arguments);
        var list = products || window.__catalogProducts || fallbackList();
        window.__catalogProducts = list;
        setTimeout(function () { hydrate(list); }, 0);
        return r;
      };
      window.renderProducts.__catalogMg = 1;
    }
    if (++n < 50) setTimeout(hook, 100);
  })();
})();
