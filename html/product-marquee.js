/* Pairs well at the bench — infinite product rail for PDP (RUO-safe) */
(function () {
  var EXCLUDE_ALWAYS = { "research-solvent": 1 };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function currentSlug() {
    var rail = document.getElementById("productRail");
    if (rail && rail.getAttribute("data-exclude-slug")) {
      return String(rail.getAttribute("data-exclude-slug") || "");
    }
    var m = location.pathname.match(/\/products\/([^\/\.]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function strengthLine(p) {
    var s = p.strengths;
    if (Array.isArray(s) && s.length) return String(s[0]);
    if (typeof s === "string" && s) return s;
    return "";
  }

  function normMg(mg) {
    return String(mg == null ? "" : mg).replace(/\s+/g, "").toLowerCase();
  }

  /* The rail printed p.price beside strengths[0], and in this catalog p.price is the price of the LAST strength:
     the blend read "5mg · $125" while 5 mg costs $62. The record is already in hand here — no second load. */
  function strengthPrice(p, mg) {
    var base = typeof p.price === "number" ? p.price : parseFloat(p.price) || 0;
    var sp = p && p.strength_prices;
    if (!sp || !mg) return base;
    var v = null;
    if (Array.isArray(sp)) {
      sp.forEach(function (e) { if (e && normMg(e.mg || e.strength || e.label) === normMg(mg)) v = e.price; });
    } else {
      Object.keys(sp).forEach(function (k) { if (normMg(k) === normMg(mg)) v = sp[k]; });
    }
    var n = parseFloat(v);
    return isFinite(n) ? n : base;
  }

  function categoryLabel(p) {
    var c = String(p.category || "").trim();
    return c ? c.toUpperCase() : "RESEARCH COMPOUND";
  }

  function isInStock(p) {
    var stock = String(p.stock_status || "").trim();
    if (!stock) return null;
    if (/out\s*of\s*stock|sold\s*out|unavailable/i.test(stock)) return false;
    if (/in\s*stock|available/i.test(stock)) return true;
    return null;
  }

  function vialImg(item){ if(item&&(item.gift||item.slug==='research-solvent')) return '/media/research-solvent.svg'; var slug=productSlug(item); var mg=((item&&item.mg)||'').toString().split(' ').join('').toLowerCase(); if(mg){ return '/media/vial-'+slug+'-'+mg+'.png?v=155'; } return '/media/vial-'+slug+'.png?v=155'; }

  /* The page's own addToCart knows nothing about strengths, so the line it just wrote says only "$62".
     Name the strength the card showed; a line that already names one is left alone. */
  function stampLast(slug, mg, price) {
    try {
      var read = window.getCart || window._readCartLS;
      var c = typeof read === "function" ? read() : null;
      if (!Array.isArray(c) || !c.length) return;
      for (var i = c.length - 1; i >= 0; i--) {
        var it = c[i];
        if (!it || it.gift) continue;
        if (String(it.slug || "") !== String(slug || "")) continue;
        if (it.mg) continue;
        it.mg = mg;
        it.price = price;
        if (typeof window.saveCart === "function") {
          try { window.saveCart(c); } catch (e) { if (typeof window._writeCartLS === "function") window._writeCartLS(c); }
        } else if (typeof window._writeCartLS === "function") {
          window._writeCartLS(c);
        }
        if (typeof window.updateBadge === "function") window.updateBadge();
        if (typeof window.renderCart === "function") window.renderCart();
        return;
      }
    } catch (e) {}
  }

  function addItem(name, price, imageUrl, slug, mg) {
    /* data-* attributes are strings, and a string price reached orders.json as "125" */
    var n = parseFloat(price);
    price = isFinite(n) ? n : 0;
    if (typeof window.addToCart === "function") {
      window.addToCart(name, price, imageUrl, slug);
      if (mg) stampLast(slug, mg, price);
      return;
    }
    var getCart = window.getCart || function () {
      try { return JSON.parse(localStorage.getItem("biofirst_cart") || "[]"); } catch (e) { return []; }
    };
    var saveCart = window.saveCart || function (c) {
      localStorage.setItem("biofirst_cart", JSON.stringify(c));
    };
    var cart = getCart();
    var existing = cart.find(function (i) {
      if (i && i.gift) return false;
      if (mg && i && i.mg && normMg(i.mg) !== normMg(mg)) return false;   /* another strength is another line */
      return i.name === name || (slug && i.slug === slug);
    });
    if (existing) { existing.qty = (existing.qty || 1) + 1; if (mg && !existing.mg) { existing.mg = mg; existing.price = price; } }
    else {
      var line = { name: name, price: price, qty: 1, slug: slug || "", imageUrl: imageUrl || "" };
      if (mg) line.mg = mg;
      cart.push(line);
    }
    saveCart(cart);
    if (typeof window.updateBadge === "function") window.updateBadge();
    else {
      var el = document.getElementById("cartCount") || document.querySelector(".cart-count");
      if (el) el.textContent = cart.reduce(function (a, i) { return a + (i.qty || 0); }, 0);
    }
    var drawer = document.getElementById("cartDrawer");
    if (drawer && !drawer.classList.contains("open") && typeof window.toggleCart === "function") {
      window.toggleCart();
    }
  }

  function card(p) {
    var img = vialImg(p);
    var href = "/products/" + encodeURIComponent(p.slug) + ".html";
    var mg = strengthLine(p);
    var price = strengthPrice(p, mg);
    var stockState = isInStock(p);
    var stockHtml = "";
    if (stockState === true) {
      stockHtml = '<span class="pr-card-stock"><span class="pr-card-stock-dot" aria-hidden="true"></span>In stock</span>';
    } else if (stockState === false) {
      stockHtml = '<span class="pr-card-stock pr-card-stock-out">Out of stock</span>';
    }
    return (
      '<article class="pr-card">' +
        '<a class="pr-card-media" href="' + href + '">' +
          '<img src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="320" height="320">' +
        "</a>" +
        stockHtml +
        '<p class="pr-card-cat">' + esc(categoryLabel(p)) + "</p>" +
        '<a class="pr-card-name" href="' + href + '">' + esc(p.name) + "</a>" +
        (mg
          ? '<p class="pr-card-spec">' + esc(mg) + " · Lot docs on request</p>"
          : '<p class="pr-card-spec">Lot docs on request</p>') +
        '<p class="pr-card-price">$' + price.toFixed(0) + "</p>" +
        '<div class="pr-card-actions">' +
          '<a class="pr-card-view" href="' + href + '">View</a>' +
          '<button type="button" class="pr-card-atc" data-name="' + esc(p.name) + '" data-price="' + esc(price) + '" data-img="' + esc(img) + '" data-slug="' + esc(p.slug) + '"' + (mg ? ' data-mg="' + esc(mg) + '"' : '') + '>ADD TO CART</button>' +
        "</div>" +
      "</article>"
    );
  }

  function wire(root) {
    root.querySelectorAll(".pr-card-atc").forEach(function (btn) {
      if (btn._wired) return;
      btn._wired = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        addItem(
          btn.getAttribute("data-name"),
          btn.getAttribute("data-price"),
          btn.getAttribute("data-img"),
          btn.getAttribute("data-slug"),
          btn.getAttribute("data-mg")
        );
      });
    });
  }

  function mount(rail, products) {
    var exclude = currentSlug();
    var list = (products || []).filter(function (p) {
      if (!p || p.is_active === false) return false;
      var slug = String(p.slug || "");
      if (EXCLUDE_ALWAYS[slug]) return false;
      if (exclude && slug === exclude) return false;
      if (parseFloat(p.price) === 0) return false;
      return true;
    });
    if (!list.length) {
      rail.hidden = true;
      return;
    }
    var html = list.map(card).join("");
    rail.hidden = false;
    rail.innerHTML =
      '<div class="pr-head">' +
        '<h2 class="pr-title">Pairs well at the bench</h2>' +
      "</div>" +
      '<div class="pr-viewport" aria-label="All research compounds">' +
        '<div class="pr-track">' +
          '<div class="pr-group">' + html + "</div>" +
          '<div class="pr-group" aria-hidden="true">' + html + "</div>" +
        "</div>" +
      "</div>";
    wire(rail);
    var track = rail.querySelector(".pr-track");
    if (track) {
      track.style.setProperty("--pr-duration", Math.max(14, list.length * 1.55) + "s");
    }
  }

  function boot() {
    var rail = document.getElementById("productRail");
    if (!rail) return;
    fetch("/api/products")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = Array.isArray(d) ? d : d.products || d.items || [];
        try { localStorage.setItem("bl_products_cache", JSON.stringify(items)); } catch (e) {}
        mount(rail, items);
      })
      .catch(function () {
        try {
          var cached = localStorage.getItem("bl_products_cache");
          if (cached) mount(rail, JSON.parse(cached));
        } catch (e) {}
      });
  }

  var booted = false;
  function tryBoot() {
    if (booted) return;
    if (!document.getElementById("productRail")) return;
    booted = true;
    boot();
  }

  function waitForRail() {
    tryBoot();
    if (booted) return;
    if (window.MutationObserver) {
      var obs = new MutationObserver(function () {
        tryBoot();
        if (booted) obs.disconnect();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () { try { obs.disconnect(); } catch (e) {} }, 30000);
    } else {
      var tries = 0;
      var t = setInterval(function () {
        tries++;
        tryBoot();
        if (booted || tries > 200) clearInterval(t);
      }, 100);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", waitForRail);
  else waitForRail();
})();
