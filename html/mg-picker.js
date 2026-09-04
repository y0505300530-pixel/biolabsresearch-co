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
  var V = "96";
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
  function fileFor(slug, mg) {
    // Always clean base vial art — mg lives in UI chips/picker, not baked stickers
    return "/media/vial-" + slug + ".webp?v=96";
  }
  var MG = "";
  function setImgs(mg) {
    var slug = slugFromPath();
    if (!slug) return;
    var src = fileFor(slug, mg);
    document.querySelectorAll("img").forEach(function (img) {
      var s = img.getAttribute("src") || "";
      if (s.indexOf("vial-" + slug) !== -1) img.src = src;
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
    var wrap = document.getElementById("mgPicker");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "mgPicker";
      wrap.className = "mg-picker";
      host.parentNode.insertBefore(wrap, host);
      wrap.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-mg]");
        if (!b) return;
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
            '<button type="button" class="size-btn' +
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
  function stampCart() {
    try {
      if (typeof cart !== "undefined" && cart.length) {
        var last = cart[cart.length - 1];
        var slug = last.slug || slugFromPath();
        last.mg = window._pdpMg || MG || listFor(slug)[0];
        if (slug) last.imageUrl = fileFor(slug, last.mg);
        if (typeof saveCart === "function") {
          try { saveCart(cart); } catch (e) { saveCart(); }
        }
        if (typeof renderCart === "function") renderCart();
      }
    } catch (e) {}
  }
  function patch() {
    if (typeof window.addToCartTemplate === "function" && !window.addToCartTemplate._mg) {
      var origT = window.addToCartTemplate;
      window.addToCartTemplate = function () {
        window._pdpMg = MG;
        var r = origT.apply(this, arguments);
        stampCart();
        return r;
      };
      window.addToCartTemplate._mg = 1;
    }
    if (typeof window.addToCart === "function" && !window.addToCart._mg) {
      var orig = window.addToCart;
      window.addToCart = function () {
        var r = orig.apply(this, arguments);
        if (!window._pdpMg) window._pdpMg = MG || "10mg";
        stampCart();
        return r;
      };
      window.addToCart._mg = 1;
    }
    if (typeof window.addSuggest === "function" && !window.addSuggest._mg) {
      var origS = window.addSuggest;
      window.addSuggest = function () {
        var r = origS.apply(this, arguments);
        window._pdpMg = window._pdpMg || "10mg";
        stampCart();
        return r;
      };
      window.addSuggest._mg = 1;
    }
  }
  function applyApi(items) {
    if (!items || !items.length) return;
    items.forEach(function (p) {
      if (p && p.slug && p.strengths && p.strengths.length) STRENGTHS[p.slug] = p.strengths;
    });
    var el = document.getElementById("mgPicker");
    if (el) el.remove();
    mount();
  }
  function boot() {
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
