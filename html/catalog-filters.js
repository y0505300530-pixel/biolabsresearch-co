/* catalog-filters.js — homepage Popular grid toolbar (v2.98)
   Progressive enhancement: client-filter existing .product-card nodes.
   Does not rewrite cart-vial / mg-picker / prices-sync. */
(function () {
  var toolbar = document.getElementById("catalogToolbar");
  var grid = document.getElementById("products-grid");
  if (!toolbar || !grid) return;

  var searchEl = document.getElementById("catalogSearch");
  var catEl = document.getElementById("catalogFilterCategory");
  var strEl = document.getElementById("catalogFilterStrength");
  var availEl = document.getElementById("catalogFilterAvail");
  var docsEl = document.getElementById("catalogFilterDocs");
  var sortEl = document.getElementById("catalogSort");
  var statusEl = document.getElementById("catalogFilterStatus");
  var resetEl = document.getElementById("catalogFilterReset");
  var emptyEl = document.getElementById("catalogEmpty");

  var applying = false;
  var TRUST =
    '<p class="product-card-trust"><span>COA on request</span>' +
    '<span class="product-card-trust-sep" aria-hidden="true">·</span>' +
    "<span>Lot docs</span></p>";

  function cards() {
    return Array.prototype.slice.call(grid.querySelectorAll(":scope > .product-card"));
  }

  function text(el) {
    return ((el && el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/mg/g, "mg");
  }

  function strengthKey(label) {
    var n = String(label || "").toLowerCase().replace(/\s+/g, "");
    var m = n.match(/(\d+(?:\.\d+)?)(mg|ml)/);
    return m ? m[1] + m[2] : n;
  }

  function priceOf(card) {
    var n = parseFloat(card.getAttribute("data-price") || "");
    if (isFinite(n)) return n;
    var el = card.querySelector(".product-card-price");
    var p = parseFloat(String(text(el)).replace(/[^0-9.]/g, ""));
    return isFinite(p) ? p : 0;
  }

  function stampCard(card, idx) {
    if (!card.hasAttribute("data-catalog-i")) {
      card.setAttribute("data-catalog-i", String(idx));
    }
    var atc = card.querySelector(".product-card-atc");
    var nameEl = card.querySelector(".product-card-name");
    var media = card.querySelector(".product-card-media");
    var href = (nameEl && nameEl.getAttribute("href")) || (media && media.getAttribute("data-href")) || "";
    if (!card.getAttribute("data-name") && nameEl) {
      card.setAttribute("data-name", text(nameEl));
    }
    if (!card.getAttribute("data-slug") && atc) {
      card.setAttribute("data-slug", atc.getAttribute("data-slug") || "");
    }
    if (!card.getAttribute("data-price")) {
      card.setAttribute("data-price", String(priceOf(card)));
    }
    if (!card.getAttribute("data-docs")) {
      card.setAttribute("data-docs", "on-request");
    }
    var badge = card.querySelector(".product-card-badge:not(.product-card-badge-spacer)");
    if (badge && text(badge) && !card.getAttribute("data-badge")) {
      card.setAttribute("data-badge", text(badge));
    }

    var body = card.querySelector(".product-card-body");
    if (!body) return;

    if (!body.querySelector(".product-card-cat") && nameEl) {
      var cat = card.getAttribute("data-category") || "";
      var catElN = document.createElement("p");
      catElN.className = "product-card-cat" + (cat ? "" : " product-card-cat-spacer");
      if (!cat) catElN.setAttribute("aria-hidden", "true");
      catElN.textContent = cat || "\u00a0";
      body.insertBefore(catElN, nameEl);
    }

    if (!body.querySelector(".product-card-trust")) {
      var row = body.querySelector(".product-card-row");
      var wrap = document.createElement("div");
      wrap.innerHTML = TRUST;
      var trust = wrap.firstChild;
      if (row && row.parentNode) row.parentNode.insertBefore(trust, row.nextSibling);
      else body.appendChild(trust);
    }

    var atcBtn = body.querySelector(".product-card-atc");
    if (atcBtn && !body.querySelector(".product-card-actions")) {
      var actions = document.createElement("div");
      actions.className = "product-card-actions";
      var view = document.createElement("a");
      view.className = "product-card-view";
      view.href = href || "#";
      view.textContent = "View details";
      var parent = atcBtn.parentNode;
      if (parent && parent.classList.contains("product-card-row")) {
        parent.removeChild(atcBtn);
        parent.parentNode.insertBefore(actions, parent.nextSibling);
      } else {
        parent.insertBefore(actions, atcBtn);
      }
      actions.appendChild(view);
      actions.appendChild(atcBtn);
    }
  }

  function enhance() {
    cards().forEach(stampCard);
  }

  function uniqueSorted(arr) {
    var seen = {};
    var out = [];
    arr.forEach(function (v) {
      if (!v || seen[v]) return;
      seen[v] = 1;
      out.push(v);
    });
    out.sort(function (a, b) {
      return String(a).localeCompare(String(b), undefined, { numeric: true });
    });
    return out;
  }

  function fillSelect(sel, placeholder, values, keep) {
    if (!sel) return;
    var cur = keep || sel.value || "";
    sel.innerHTML = "";
    var o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = placeholder;
    sel.appendChild(o0);
    values.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v.value;
      o.textContent = v.label;
      sel.appendChild(o);
    });
    if (cur) {
      var ok = Array.prototype.some.call(sel.options, function (o) {
        return o.value === cur;
      });
      if (ok) sel.value = cur;
    }
  }

  function populate() {
    var list = cards();
    var cats = uniqueSorted(
      list.map(function (c) {
        return c.getAttribute("data-category") || "";
      }).filter(Boolean)
    );
    fillSelect(
      catEl,
      "Categories",
      cats.map(function (c) {
        return { value: c, label: c };
      }),
      catEl && catEl.value
    );

    var strengths = [];
    list.forEach(function (c) {
      Array.prototype.forEach.call(c.querySelectorAll(".product-card-mg"), function (chip) {
        var label = text(chip);
        var key = strengthKey(chip.getAttribute("data-mg") || label);
        if (key) strengths.push(key + "\t" + (label || key));
      });
    });
    var seenS = {};
    var sOpts = [];
    uniqueSorted(strengths).forEach(function (pair) {
      var parts = pair.split("\t");
      var key = parts[0];
      if (seenS[key]) return;
      seenS[key] = 1;
      sOpts.push({ value: key, label: parts[1] || key });
    });
    sOpts.sort(function (a, b) {
      var na = parseFloat(a.value) || 0;
      var nb = parseFloat(b.value) || 0;
      if (na !== nb) return na - nb;
      return a.label.localeCompare(b.label);
    });
    fillSelect(strEl, "Strengths", sOpts, strEl && strEl.value);

    var hasIn = list.some(function (c) {
      return (c.getAttribute("data-stock") || "") === "in";
    });
    var hasOut = list.some(function (c) {
      return (c.getAttribute("data-stock") || "") === "out";
    });
    var avail = [];
    if (hasIn) avail.push({ value: "in", label: "Available" });
    if (hasOut) avail.push({ value: "out", label: "Unavailable" });
    fillSelect(availEl, "Availability", avail, availEl && availEl.value);
    if (!avail.length && availEl) {
      availEl.disabled = true;
      availEl.setAttribute("title", "No availability field on these cards");
    } else if (availEl) {
      availEl.disabled = false;
      availEl.removeAttribute("title");
    }
  }

  function activeFilters() {
    return !!(
      (searchEl && searchEl.value.trim()) ||
      (catEl && catEl.value) ||
      (strEl && strEl.value) ||
      (availEl && availEl.value) ||
      (docsEl && docsEl.value) ||
      (sortEl && sortEl.value && sortEl.value !== "featured")
    );
  }

  function apply() {
    applying = true;
    try {
    enhance();
    var q = searchEl ? searchEl.value.trim().toLowerCase() : "";
    var cat = catEl ? catEl.value : "";
    var str = strEl ? strEl.value : "";
    var avail = availEl ? availEl.value : "";
    var docs = docsEl ? docsEl.value : "";
    var sort = sortEl ? sortEl.value : "featured";
    var list = cards();
    var shown = 0;

    list.forEach(function (card) {
      var hay = (
        (card.getAttribute("data-name") || "") +
        " " +
        (card.getAttribute("data-slug") || "") +
        " " +
        (card.getAttribute("data-category") || "") +
        " " +
        text(card.querySelector(".product-card-tagline"))
      ).toLowerCase();
      var ok = true;
      if (q && hay.indexOf(q) === -1) ok = false;
      if (ok && cat && (card.getAttribute("data-category") || "") !== cat) ok = false;
      if (ok && str) {
        var hit = false;
        Array.prototype.forEach.call(card.querySelectorAll(".product-card-mg"), function (chip) {
          if (strengthKey(chip.getAttribute("data-mg") || text(chip)) === str) hit = true;
        });
        if (!hit) ok = false;
      }
      if (ok && avail && (card.getAttribute("data-stock") || "") !== avail) ok = false;
      /* Documentation is a stub: every listing is lot-docs on request. No per-SKU file flag. */
      if (ok && docs && (card.getAttribute("data-docs") || "on-request") !== docs) ok = false;
      card.classList.toggle("is-catalog-hidden", !ok);
      if (ok) shown += 1;
    });

    var filtering = activeFilters();
    document.documentElement.classList.toggle("catalog-filtered", filtering);
    if (resetEl) resetEl.hidden = !filtering;
    if (emptyEl) emptyEl.hidden = shown !== 0;
    if (statusEl) {
      statusEl.textContent = filtering
        ? shown + " of " + list.length + " compounds"
        : "";
    }

    if (sort && sort !== "featured") {
      list.sort(function (a, b) {
        if (sort === "price-asc") return priceOf(a) - priceOf(b);
        if (sort === "price-desc") return priceOf(b) - priceOf(a);
        if (sort === "name") {
          return (a.getAttribute("data-name") || "").localeCompare(
            b.getAttribute("data-name") || "",
            undefined,
            { sensitivity: "base" }
          );
        }
        if (sort === "new") {
          var an = /new/i.test(a.getAttribute("data-badge") || "") ? 0 : 1;
          var bn = /new/i.test(b.getAttribute("data-badge") || "") ? 0 : 1;
          if (an !== bn) return an - bn;
          return Number(a.getAttribute("data-catalog-i") || 0) - Number(b.getAttribute("data-catalog-i") || 0);
        }
        return 0;
      });
      list.forEach(function (c) {
        grid.appendChild(c);
      });
    } else {
      list
        .slice()
        .sort(function (a, b) {
          return Number(a.getAttribute("data-catalog-i") || 0) - Number(b.getAttribute("data-catalog-i") || 0);
        })
        .forEach(function (c) {
          grid.appendChild(c);
        });
    }
    } finally {
      applying = false;
    }
  }

  function reset() {
    if (searchEl) searchEl.value = "";
    if (catEl) catEl.value = "";
    if (strEl) strEl.value = "";
    if (availEl) availEl.value = "";
    if (docsEl) docsEl.value = "";
    if (sortEl) sortEl.value = "featured";
    apply();
  }

  function bind() {
    ["input", "change"].forEach(function (ev) {
      if (searchEl) searchEl.addEventListener(ev, apply);
    });
    [catEl, strEl, availEl, docsEl, sortEl].forEach(function (el) {
      if (el) el.addEventListener("change", apply);
    });
    if (resetEl) resetEl.addEventListener("click", reset);
  }

  if (!grid.__catalogMediaNav) {
    grid.__catalogMediaNav = 1;
    grid.addEventListener("click", function (e) {
      var media = e.target && e.target.closest && e.target.closest(".product-card-media[data-href]");
      if (!media) return;
      if (e.target.closest("a, button")) return;
      var href = media.getAttribute("data-href");
      if (href) window.location.href = href;
    });
  }

  function boot() {
    enhance();
    populate();
    bind();
    apply();
    if (!grid.__catalogFilterObs) {
      grid.__catalogFilterObs = 1;
      var t = null;
      new MutationObserver(function () {
        if (applying) return;
        clearTimeout(t);
        t = setTimeout(function () {
          if (applying) return;
          enhance();
          populate();
          apply();
        }, 60);
      }).observe(grid, { childList: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
