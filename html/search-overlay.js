/* Search overlay — command palette. GET /api/products, no research-solvent, Esc closes */
(function () {
  var API = "/api/products";
  var POPULAR = ["retatrutide", "bpc-157", "bpc-157-tb-500-blend", "nad-plus", "ghk-cu", "glow-70"];
  var cache = null;
  var open = false;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }
  function displayName(p) {
    if (p && p.slug === "retatrutide") return "R3TA";
    return (p && p.name) || "";
  }
  function stockLabel(p) {
    var s = String((p && p.stock_status) || "").trim();
    if (!s) return "";
    if (/out\s*of\s*stock|sold\s*out|unavailable/i.test(s)) return "Out of stock";
    if (/in\s*stock|available/i.test(s)) return "In stock";
    return "";
  }
  function hrefFor(p) {
    return "/products/" + encodeURIComponent(p.slug) + ".html";
  }
  function thumb(p) {
    var slug = (p && p.slug) ? String(p.slug) : "";
    if (!slug) return "";
    return "/media/vial-" + slug + ".webp?v=140";
  }
  function catalog(list) {
    return (list || []).filter(function (p) {
      return p && p.slug && p.slug !== "research-solvent" && p.is_active !== false;
    });
  }
  function popular(list) {
    var by = {};
    list.forEach(function (p) { by[p.slug] = p; });
    var out = [];
    POPULAR.forEach(function (s) { if (by[s]) out.push(by[s]); });
    if (out.length < 6) {
      list.forEach(function (p) {
        if (out.length >= 6) return;
        if (!POPULAR.some(function (s) { return s === p.slug; })) out.push(p);
      });
    }
    return out;
  }
  function match(list, q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return popular(list);
    return list.filter(function (p) {
      var blob = (displayName(p) + " " + (p.slug || "") + " " + (p.category || "") + " " + (p.tagline || "")).toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }

  function mount() {
    if (document.getElementById("searchOverlay")) return;
    var wrap = document.createElement("div");
    wrap.id = "searchOverlay";
    wrap.className = "so";
    wrap.setAttribute("hidden", "");
    wrap.innerHTML =
      '<div class="so-scrim" data-so-close="1"></div>' +
      '<div class="so-panel" role="dialog" aria-modal="true" aria-label="Search compounds">' +
        '<div class="so-head">' +
          '<svg class="so-search-ico" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16.2 16.2L20 20"/></svg>' +
          '<input class="so-input" id="soInput" type="search" placeholder="Search compounds…" autocomplete="off" spellcheck="false">' +
          '<kbd class="so-esc" data-so-close="1" title="Close">Esc</kbd>' +
        '</div>' +
        '<p class="so-kicker" id="soKicker">POPULAR</p>' +
        '<div class="so-list" id="soList"></div>' +
        '<div class="so-foot"><span>RESEARCH USE ONLY</span><span class="so-foot-right">Open compound →</span></div>' +
      "</div>";
    document.body.appendChild(wrap);
  }

  function render(items, querying) {
    var list = document.getElementById("soList");
    var kicker = document.getElementById("soKicker");
    if (!list) return;
    kicker.textContent = querying ? "RESULTS" : "POPULAR";
    if (!items.length) {
      list.innerHTML = '<p class="so-empty">No matching compounds.</p>';
      return;
    }
    list.innerHTML = items.map(function (p) {
      var price = Number(p.price);
      var priceTxt = isFinite(price) ? ("$" + price.toFixed(0)) : "";
      var cat = p.category || "Research compound";
      var stock = stockLabel(p);
      var sub = cat + (priceTxt ? (" · " + priceTxt) : "") + (stock ? (" · " + stock) : "");
      return (
        '<a class="so-row" href="' + esc(hrefFor(p)) + '">' +
          '<img class="so-thumb" src="' + esc(thumb(p)) + '" alt="" width="80" height="80" loading="lazy">' +
          '<span class="so-meta">' +
            '<span class="so-name">' + esc(displayName(p)) + "</span>" +
            '<span class="so-sub">' + esc(sub) + "</span>" +
          "</span>" +
          '<span class="so-go" aria-hidden="true">→</span>' +
        "</a>"
      );
    }).join("");
  }

  function load(cb) {
    if (cache) { cb(cache); return; }
    fetch(API)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        cache = catalog(Array.isArray(data) ? data : data.products || []);
        cb(cache);
      })
      .catch(function () { cb([]); });
  }

  function show() {
    mount();
    var el = document.getElementById("searchOverlay");
    el.removeAttribute("hidden");
    el.classList.add("on");
    open = true;
    document.body.style.overflow = "hidden";
    load(function (list) {
      var q = (document.getElementById("soInput") || {}).value || "";
      render(match(list, q), !!q.trim());
    });
    var input = document.getElementById("soInput");
    if (input) setTimeout(function () { input.focus(); input.select && input.select(); }, 20);
  }

  function hide() {
    var el = document.getElementById("searchOverlay");
    if (!el) return;
    el.classList.remove("on");
    el.setAttribute("hidden", "");
    open = false;
    document.body.style.overflow = "";
  }

  function onQuery() {
    var q = (document.getElementById("soInput") || {}).value || "";
    load(function (list) { render(match(list, q), !!q.trim()); });
  }

  function isSearchTrigger(el) {
    if (!el) return false;
    var a = el.closest && el.closest("a.nav-util, button.nav-util, [data-open-search]");
    if (!a) return false;
    var label = (a.getAttribute("aria-label") || a.textContent || "").toLowerCase();
    if (a.hasAttribute("data-open-search")) return true;
    if (label.indexOf("search") !== -1) return true;
    // first nav-util is search icon on home
    if (a.classList.contains("nav-util") && a.querySelector("circle") && a.querySelector("path")) return true;
    return false;
  }

  document.addEventListener("click", function (e) {
    if (isSearchTrigger(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      show();
      return;
    }
    if (e.target.closest && e.target.closest("[data-so-close]")) hide();
  }, true);

  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "soInput") onQuery();
  });

  document.addEventListener("keydown", function (e) {
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      show();
      return;
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      hide();
    }
  });
})();
