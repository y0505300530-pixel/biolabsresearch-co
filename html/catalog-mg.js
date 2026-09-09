/* catalog-mg.js — clickable catalog strength chips; update price + ATC */
(function () {
  var FALLBACK = {
    "bpc-157-tb-500-blend": {
      strengths: ["5mg", "10mg"],
      strength_prices: { "5mg": 62, "10mg": 125 },
      strength_originals: { "5mg": 78, "10mg": 155 },
      price: 125,
      original_price: 155
    },
    "nad-plus": {
      strengths: ["500mg"],
      strength_prices: { "500mg": 99 },
      strength_originals: { "500mg": 119 },
      price: 99,
      original_price: 119
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
      strengths: ["5mg", "10mg"],
      strength_prices: { "5mg": 60, "10mg": 119 },
      strength_originals: { "5mg": 72, "10mg": 145 },
      price: 119,
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
      strengths: ["10mg", "40mg"],
      strength_prices: { "10mg": 95, "40mg": 135 },
      strength_originals: { "10mg": 115, "40mg": 160 },
      price: 135,
      original_price: 160
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
      strengths: ["5mg", "10mg"],
      strength_prices: { "5mg": 50, "10mg": 99 },
      strength_originals: { "5mg": 60, "10mg": 119 },
      price: 99,
      original_price: 119
    },
    "retatrutide": {
      strengths: ["10mg", "20mg"],
      strength_prices: { "10mg": 70, "20mg": 139 },
      strength_originals: { "10mg": 84, "20mg": 169 },
      price: 139,
      original_price: 169
    }
  };

  function norm(s) {
    return String(s || "").replace(/\s+/g, "").toLowerCase();
  }
  function pretty(s) {
    return norm(s).replace(/(\d+)(mg|ml)/i, "$1 $2");
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }
  function parseMoney(t) {
    var n = parseFloat(String(t || "").replace(/[^0-9.]/g, ""));
    return isFinite(n) ? n : null;
  }
  function mgNum(s) {
    return parseFloat(String(s || "").replace(/[^\d.]/g, "")) || 0;
  }

  function mergeProduct(apiP, slug) {
    var fb = FALLBACK[slug] || {};
    var p = Object.assign({}, fb, apiP || {});
    p.slug = slug || p.slug;
    p.strengths = (apiP && apiP.strengths && apiP.strengths.length)
      ? apiP.strengths
      : (fb.strengths || []);
    p.strength_prices = Object.assign({}, fb.strength_prices || {}, (apiP && apiP.strength_prices) || {});
    p.strength_originals = Object.assign({}, fb.strength_originals || {}, (apiP && apiP.strength_originals) || {});
    if (p.price == null && fb.price != null) p.price = fb.price;
    if (p.original_price == null && fb.original_price != null) p.original_price = fb.original_price;
    return p;
  }

  function pricesFor(p) {
    var map = p.strength_prices || {};
    var origMap = p.strength_originals || {};
    var strengths = p.strengths || [];
    var out = {}, oout = {};
    if (!strengths.length) {
      Object.keys(map).forEach(function (k) { strengths.push(k); });
    }
    strengths.forEach(function (s) {
      var k = norm(s);
      var price = map[k] != null ? map[k] : map[s];
      if (price == null) price = p.price;
      var orig = origMap[k] != null ? origMap[k] : origMap[s];
      if (orig == null) orig = p.original_price;
      out[k] = Number(price);
      oout[k] = orig != null ? Number(orig) : null;
    });
    return { prices: out, originals: oout, strengths: strengths };
  }

  function pickDefault(card, pack) {
    var existing = card.getAttribute("data-selected-mg");
    if (existing && pack.prices[norm(existing)] != null) return norm(existing);

    var shown = parseMoney((card.querySelector(".product-card-price") || {}).textContent);
    var atc = card.querySelector(".product-card-atc");
    var atcPrice = atc ? parseMoney(atc.getAttribute("data-price")) : null;
    var target = shown != null ? shown : atcPrice;
    var strengths = pack.strengths || [];
    var i, k;

    if (target != null) {
      for (i = 0; i < strengths.length; i++) {
        k = norm(strengths[i]);
        if (Number(pack.prices[k]) === Number(target)) return k;
      }
    }

    // CRM v1.32: prefer LOWEST strength (matches PDP mg-picker default / From $)
    var best = null, bestN = Infinity;
    for (i = 0; i < strengths.length; i++) {
      k = norm(strengths[i]);
      var n = mgNum(strengths[i]);
      if (n > 0 && n < bestN) {
        bestN = n;
        best = k;
      }
    }
    if (best) return best;
    if (strengths.length) return norm(strengths[0]);
    return null;
  }

  function applyCard(card, p, selectedKey) {
    var pack = pricesFor(p);
    var strengths = pack.strengths || [];
    if (!strengths.length) return;
    if (!selectedKey || pack.prices[selectedKey] == null) {
      selectedKey = pickDefault(card, pack);
    }
    var price = pack.prices[selectedKey];
    var orig = pack.originals[selectedKey];
    if (price == null) price = p.price;

    var wrap = card.querySelector(".product-card-strengths");
    if (wrap) {
      wrap.innerHTML = strengths
        .map(function (s) {
          var k = norm(s);
          var on = k === selectedKey ? " on active" : "";
          var op = pack.originals[k];
          return (
            '<button type="button" class="product-card-mg' +
            on +
            '" data-mg="' +
            esc(k) +
            '" data-price="' +
            esc(pack.prices[k]) +
            '"' +
            (op != null ? ' data-original="' + esc(op) + '"' : "") +
            ">" +
            esc(pretty(s)) +
            "</button>"
          );
        })
        .join("");
    } else {
      Array.prototype.forEach.call(card.querySelectorAll(".product-card-mg"), function (btn) {
        var k = norm(btn.getAttribute("data-mg") || btn.textContent);
        btn.classList.toggle("on", k === selectedKey);
        btn.classList.toggle("active", k === selectedKey);
      });
    }

    var priceEl = card.querySelector(".product-card-price");
    var origEl = card.querySelector(".product-card-original");
    if (priceEl) priceEl.textContent = "$" + price;
    if (origEl) {
      if (orig != null && Number(orig) > Number(price)) {
        origEl.textContent = "$" + orig;
        origEl.style.display = "";
      } else {
        origEl.textContent = "";
        origEl.style.display = "none";
      }
    }

    var atc = card.querySelector(".product-card-atc");
    if (atc) {
      atc.setAttribute("data-price", String(price));
      atc.setAttribute("data-mg", selectedKey);
    }
    card.setAttribute("data-selected-mg", selectedKey);
  }

  var __mgApplying = false;

  function bind(card, p) {
    var pack = pricesFor(p);
    /* keep user selection across re-hydrate (MutationObserver used to snap back to 10mg) */
    var sel = card.getAttribute("data-selected-mg");
    __mgApplying = true;
    try {
      applyCard(card, p, sel || pickDefault(card, pack));
    } finally {
      __mgApplying = false;
    }
    if (card.__catalogMgBound) return;
    card.__catalogMgBound = 1;
    card.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest && e.target.closest(".product-card-mg");
      if (!btn || !card.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      var key = norm(btn.getAttribute("data-mg") || btn.textContent);
      __mgApplying = true;
      try {
        applyCard(card, p, key);
      } finally {
        setTimeout(function () { __mgApplying = false; }, 0);
      }
    });
  }

  function bySlug(products) {
    var m = {};
    (products || []).forEach(function (p) {
      if (p && p.slug) m[p.slug] = p;
    });
    return m;
  }

  function slugOf(card) {
    var atc = card.querySelector(".product-card-atc");
    return (
      (atc && atc.getAttribute("data-slug")) ||
      card.getAttribute("data-slug") ||
      ""
    );
  }

  function hydrate(products) {
    var map = bySlug(products);
    document.querySelectorAll(".product-card").forEach(function (card) {
      var slug = slugOf(card);
      if (!slug) return;
      var p = mergeProduct(map[slug], slug);
      if (!(p.strengths && p.strengths.length) && !(p.strength_prices && Object.keys(p.strength_prices).length)) {
        var chips = Array.prototype.map.call(card.querySelectorAll(".product-card-mg"), function (el) {
          return el.getAttribute("data-mg") || el.textContent;
        });
        if (chips.length) p.strengths = chips;
      }
      bind(card, p);
    });
  }

  function boot(products) {
    window.__catalogProducts = products;
    hydrate(products);
    var grid = document.querySelector("#catalog .products-grid, #products-grid, .products-grid, #productsGrid, #productGrid, #catalog, main");
    if (grid && !grid.__catalogMgObs) {
      grid.__catalogMgObs = 1;
      var t = null;
      new MutationObserver(function () {
        if (__mgApplying) return;
        clearTimeout(t);
        t = setTimeout(function () {
          if (__mgApplying) return;
          hydrate(window.__catalogProducts || products);
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
