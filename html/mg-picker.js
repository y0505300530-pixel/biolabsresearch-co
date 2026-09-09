/* Strengths from CRM API (placeholder until Yehuda edits). */
(function () {
  var STRENGTHS = {
    "bpc-157-tb-500-blend": ["5mg", "10mg"],
    "nad-plus": ["500mg"],
    "aod-9604": ["5mg", "10mg"],
    "curcumin-phytosome": ["500mg"],
    "tesamorelin-ipamorelin": ["5mg", "10mg"],
    "bpc-157": ["5mg", "10mg"],
    "glow-70": ["70mg"],
    "epithalon": ["5mg", "10mg"],
    "ghk-cu": ["5mg", "10mg"],
    "mots-c": ["5mg", "10mg"],
    "kpv": ["5mg", "10mg"],
    "semax": ["5mg", "10mg"],
    "kisspeptin-10": ["5mg", "10mg"],
    "thymosin-alpha-1": ["5mg", "10mg"],
    "tb-500": ["5mg", "10mg"],
    "retatrutide": ["10mg", "20mg"]
  };
  function slugFromPath() {
    var m = location.pathname.match(/\/products\/([^/.]+)/);
    return m ? m[1] : "";
  }
  function listFor(slug) {
    return STRENGTHS[slug] || ["10mg"];
  }
  function norm(mg) {
    return String(mg || "").replace(/\s+/g, "").toLowerCase();
  }
  function pretty(mg) {
    var n = norm(mg);
    return n.replace("mg", " mg");
  }
  function fileFor(slug) {
    return "/media/vial-" + slug + ".png?v=153";
  }
  function baseName(name) {
    return String(name || "").replace(/\s*\([^)]*mg[^)]*\)\s*$/i, "").trim();
  }
  var PRODUCT = null; /* this page's catalog record, kept from the read below — the page's own fetch may land later */
  function currentProduct(slug) {
    var p = window._currentProduct;
    if (p && p.slug === slug) return p;
    if (PRODUCT && PRODUCT.slug === slug) return PRODUCT;
    return null;
  }
  function originalForMg(p, mg) {
    var so = p && p.strength_originals;
    if (!so) return null;
    var entries = Array.isArray(so) ? so : Object.keys(so).map(function (k) { return { mg: k, price: so[k] }; });
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var v = e && (e.price !== undefined ? e.price : e.original);
      if (e && norm(e.mg || e.strength || e.label) === norm(mg) && v !== null && v !== '' && isFinite(Number(v))) return Number(v);
    }
    return null;
  }
  /* The struck-through price is printed once from original_price — the LAST strength — and never followed the
     picker: /products/ghk-cu opened at 5 mg showed $34 beside $85 and promised a 60 % discount that does not
     exist. When this strength has no old price, the element is hidden rather than left showing another one.
     The search stays inside the price block on purpose: `.was` is also the cart drawer's compare-at price. */
  function setOriginal(priceEl, slug, mg, price) {
    var p = currentProduct(slug);
    if (!p) return;
    var scope = (priceEl && priceEl.closest) ? priceEl.closest(".price-section, .price-row") : null;
    if (!scope && priceEl) scope = priceEl.parentNode;
    if (!scope) scope = document.querySelector(".price-section");
    if (!scope) return;
    var orig = originalForMg(p, mg);
    var shown = (price === null || price === undefined)
      ? parseFloat(String((priceEl && priceEl.textContent) || "").replace(/[^0-9.]/g, ""))
      : Number(price);
    var showOrig = !(orig === null || !isFinite(shown) || orig <= shown);
    scope.querySelectorAll(".price-original, .was, .price-old").forEach(function (el) {
      if (!showOrig) {
        el.style.display = "none";
      } else {
        el.textContent = "$" + orig;
        el.style.display = "";
      }
    });
    scope.querySelectorAll(".price-launch-note, .price-compare").forEach(function (el) {
      el.style.display = showOrig ? "" : "none";
    });
  }
  function priceForMg(slug, mg, fallback) {
    var p = currentProduct(slug);
    if (!p || !p.strength_prices) return fallback;
    var sp = p.strength_prices;
    var entries = Array.isArray(sp) ? sp : Object.keys(sp).map(function (k) { return { mg: k, price: sp[k] }; });
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (e && norm(e.mg || e.strength || e.label) === norm(mg) && e.price !== null && e.price !== '' && isFinite(Number(e.price))) return Number(e.price);
    }
    return fallback;
  }
  var MG = "";
  function syncStickyPrice(price) {
    /* CRM v1.29: sticky Add bar must track Amount, not catalog base */
    var sp = document.getElementById("pdpStickyPrice");
    if (!sp || price === null || price === undefined || !isFinite(Number(price))) return;
    sp.textContent = "$" + Number(price);
  }
  function setImgs(mg) {
    var slug = slugFromPath();
    if (!slug) return;
    var src = fileFor(slug);
    var priceEl = document.getElementById("current-price") || document.querySelector(".price-main");
    var selectedPrice = priceForMg(slug, mg, null);
    if (priceEl && selectedPrice !== null) {
      priceEl.textContent = "$" + selectedPrice;
      priceEl.classList.remove("price-flash");
      void priceEl.offsetWidth;
      priceEl.classList.add("price-flash");
    }
    syncStickyPrice(selectedPrice);
    setOriginal(priceEl, slug, mg, selectedPrice);
    document.querySelectorAll("img").forEach(function (img) {
      var s = img.getAttribute("src") || "";
      if (s.indexOf("vial-" + slug) !== -1) img.src = src;
    });
  }
  function hideNativeSize() {
    document.querySelectorAll(".size-options, .size-label").forEach(function (el) {
      el.style.display = "none";
      el.setAttribute("data-mg-hidden", "1");
    });
  }
  function mount() {
    if (!/\/products\//.test(location.pathname)) return;
    var slug = slugFromPath();
    if (!slug) return;
    var opts = listFor(slug);
    if (!MG) MG = opts[0];
    var host = document.getElementById("atc-btn");
    if (!host || !host.parentNode) return;
    hideNativeSize();
    var wrap = document.getElementById("mgPicker");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "mgPicker";
      wrap.className = "mg-picker";
      /* Prefer above the qty+ATC flex row so Amount sits with price */
      var row = host.parentNode;
      if (row && row.parentNode && (row.style.display === "flex" || (row.getAttribute("style")||"").indexOf("display:flex")!==-1)) {
        row.parentNode.insertBefore(wrap, row);
      } else {
        host.parentNode.insertBefore(wrap, host);
      }
      wrap.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-mg]");
        if (!b) return;
        e.preventDefault();
        e.stopPropagation();
        MG = b.getAttribute("data-mg");
        window._pdpMg = MG;
        wrap.querySelectorAll("button[data-mg]").forEach(function (x) {
          x.classList.toggle("on", x === b);
          x.classList.toggle("active", x === b);
        });
        setImgs(MG);
      });
    }
    wrap.innerHTML =
      '<span class="mg-picker-label">Amount</span>' +
      opts
        .map(function (mg, i) {
          var on = norm(mg) === norm(MG) || (!MG && i === 0);
          return (
            '<button type="button" class="mg-btn' +
            (on ? " active on" : "") +
            '" data-mg="' +
            mg +
            '">' +
            pretty(mg) +
            "</button>"
          );
        })
        .join("");
    window._pdpMg = MG;
    setImgs(MG);
  }
  function readCartArr() {
    if (typeof getCart === "function") {
      try { return getCart(); } catch (e) {}
    }
    if (typeof cart !== "undefined" && Array.isArray(cart)) return cart;
    try {
      return JSON.parse(localStorage.getItem("biolabs_cart") || localStorage.getItem("biofirst_cart") || "[]");
    } catch (e) {
      return [];
    }
  }
  function writeCartArr(c) {
    if (typeof saveCart === "function") {
      try { saveCart(c); return; } catch (e) { try { saveCart(); return; } catch (e2) {} }
    }
    if (typeof cart !== "undefined") cart = c;
    try { localStorage.setItem("biolabs_cart", JSON.stringify(c)); } catch (e) {}
  }
  /* Stamp mg ONLY after PDP Add — never from addSuggest / catalog */
  function stampPdpLine() {
    try {
      if (!/\/products\//.test(location.pathname)) return;
      var pdpSlug = slugFromPath();
      if (!pdpSlug) return;
      var mg = window._pdpMg || MG || listFor(pdpSlug)[0];
      var c = readCartArr();
      if (!c.length) return;
      /* prefer line matching this slug (last match) */
      var idx = -1;
      for (var i = c.length - 1; i >= 0; i--) {
        if (c[i] && !c[i].gift && (c[i].slug === pdpSlug || baseName(c[i].name).toLowerCase() === baseName(((document.querySelector(".product-title") || {}).textContent || "")).toLowerCase())) {
          idx = i;
          break;
        }
      }
      if (idx < 0) idx = c.length - 1;
      var last = c[idx];
      if (!last || last.gift) return;
      last.mg = mg;
      last.slug = pdpSlug;
      last.name = baseName(last.name) || last.name;
      last.imageUrl = fileFor(pdpSlug);
      writeCartArr(c);
      if (typeof cart !== "undefined") cart = c;
      if (typeof updateBadge === "function") updateBadge();
      if (typeof renderCart === "function") renderCart();
    } catch (e) {}
  }
  function patch() {
    if (typeof window.addToCartTemplate === "function" && !window.addToCartTemplate._mg) {
      var origT = window.addToCartTemplate;
      window.addToCartTemplate = function () {
        window._pdpMg = MG;
        /* Each strength is a separate cart line, priced from the current catalog when available. */
        try {
          var titleEl = document.querySelector(".product-title");
          var name = baseName((titleEl && titleEl.textContent) || "Product");
          var priceEl = document.getElementById("current-price") || document.querySelector(".price-main");
          var price = parseFloat((priceEl ? priceEl.textContent : "0").replace(/[^0-9.]/g, "")) || 0;
          var slug = slugFromPath();
          var mg = window._pdpMg || MG || listFor(slug)[0];
          var pdpQty = parseInt(document.getElementById("pdpQty") ? document.getElementById("pdpQty").textContent : "1", 10) || 1;
          var c = readCartArr();
          price = priceForMg(slug, mg, price);
          var ex = c.find(function (i) {
            return i && !i.gift && slug && i.slug === slug && norm(i.mg) === norm(mg);
          });
          if (ex) {
            ex.qty += pdpQty;
            ex.price = price;
            ex.name = name;
            ex.slug = slug;
            ex.mg = mg;
            ex.imageUrl = fileFor(slug);
          } else {
            c.push({ name: name, price: price, qty: pdpQty, slug: slug, mg: mg, imageUrl: fileFor(slug) });
          }
          writeCartArr(c);
          if (typeof cart !== "undefined") cart = c;
          if (typeof updateBadge === "function") updateBadge();
          var btn = document.getElementById("atc-btn");
          if (btn) {
            var o = btn.textContent;
            btn.textContent = "✓ Added!";
            btn.style.background = "#2a7a4a";
            setTimeout(function () { btn.textContent = o; btn.style.background = ""; }, 1800);
          }
          var _cd = document.getElementById("cartDrawer");
          if (_cd && !_cd.classList.contains("open") && typeof toggleCart === "function") toggleCart();
          else if (typeof renderCart === "function") renderCart();
          return;
        } catch (err) {
          var r = origT.apply(this, arguments);
          stampPdpLine();
          return r;
        }
      };
      window.addToCartTemplate._mg = 1;
    }
    /* Do NOT wrap addToCart (catalog) or addSuggest — no PDP mg stamp */
  }
  function applyApi(items) {
    if (!items || !items.length) return;
    items.forEach(function (p) {
      if (p && p.slug && p.strengths && p.strengths.length) STRENGTHS[p.slug] = p.strengths;
      if (p && p.slug && p.slug === slugFromPath()) PRODUCT = p;
    });
    var el = document.getElementById("mgPicker");
    if (el) el.remove();
    mount();
  }
  function boot() {
    if (!window.__pdpThumbsBound) {
      window.__pdpThumbsBound = 1;
      document.addEventListener("click", function (e) {
        var t = e.target && e.target.closest && e.target.closest(".pdp-thumb");
        if (!t) return;
        var full = t.getAttribute("data-full");
        var main = document.getElementById("pdpMainImg") || document.querySelector(".product-img-main img");
        if (!full || !main) return;
        main.src = full;
        var wrap = t.parentNode;
        if (wrap) wrap.querySelectorAll(".pdp-thumb").forEach(function (x) { x.classList.toggle("on", x === t); });
      });
    }
    mount();
    patch();
  }
  fetch("/api/products")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      var items = Array.isArray(d) ? d : (d && (d.products || d.items)) || [];
      applyApi(items);
    })
    .catch(function () {});
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})();
