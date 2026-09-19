/* v2.99g COA + family hub SoT.
   PDP Download / View lot COA only when /api/products.coa_pdf_url is a real PDF.
   Otherwise Request lot COA inquiry. No Authentic / invented-file buttons.
   JSON-LD DigitalDocument only when that URL exists.
   Spoke breadcrumbs: Home › {Family} research compounds › SKU.
   Does not rewrite cart-vial, mg-picker, prices-sync, or checkout. */
(function () {
  var FAMILIES = {
    recovery: {
      slug: 'recovery',
      title: 'Recovery research compounds',
      seeds: ['bpc-157', 'tb-500', 'bpc-157-tb-500-blend', 'thymosin-alpha-1']
    },
    'ghrp-ghrh': {
      slug: 'ghrp-ghrh',
      title: 'GHRP / GHRH research compounds',
      seeds: ['tesamorelin', 'ipamorelin', 'tesamorelin-ipamorelin']
    },
    'copper-skin': {
      slug: 'copper-skin',
      title: 'Copper-skin research compounds',
      seeds: ['ghk-cu', 'glow-70', 'kpv']
    },
    mitochondrial: {
      slug: 'mitochondrial',
      title: 'Mitochondrial research compounds',
      seeds: ['nad-plus', 'mots-c', 'epithalon']
    }
  };
  var SLUG_FAMILY = {};
  Object.keys(FAMILIES).forEach(function (k) {
    FAMILIES[k].seeds.forEach(function (s) { SLUG_FAMILY[s] = FAMILIES[k]; });
  });

  function pageSlug() {
    var path = (location.pathname || '').replace(/\/+$/, '');
    var slug = path.split('/').pop().replace(/\.html$/i, '');
    if (slug === 'wolverine-blend') slug = 'bpc-157-tb-500-blend';
    return slug;
  }
  function onPdp() {
    return /\/products\//.test(location.pathname || '');
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escJs(s) {
    return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
  function realCoaUrl(p) {
    if (!p) return '';
    var raw = p.coa_pdf_url != null ? p.coa_pdf_url : p.coaPdfUrl;
    if (typeof raw !== 'string') return '';
    var u = raw.trim();
    if (!u) return '';
    if (/^(none|null|undefined|n\/a|-)$/i.test(u)) return '';
    if (/\/coa\?/.test(u)) return '';
    if (!/\.pdf(\?|#|$)/i.test(u)) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (u.charAt(0) === '/') return u;
    return '';
  }
  function coaLot(p) {
    if (!p) return '';
    var lot = p.coa_lot != null ? p.coa_lot : p.coaLot;
    if (typeof lot !== 'string') return '';
    lot = lot.trim();
    if (!lot || /^(none|null|undefined|n\/a|-|see pdf)$/i.test(lot)) return '';
    return lot;
  }
  function isCoaControl(el) {
    if (!el || !el.tagName) return false;
    if (el.getAttribute('data-coa-sot') === '1') return true;
    var t = String(el.textContent || '').replace(/\s+/g, ' ').trim();
    if (/authentic/i.test(t)) return true;
    if (/coa|certificate of analysis/i.test(t)) return true;
    var href = el.getAttribute('href') || '';
    if (/\/coa(\?|$)/i.test(href) || /\.pdf(\?|#|$)/i.test(href)) return true;
    var oc = el.getAttribute('onclick') || '';
    if (/openCOA(Request|Modal)/i.test(oc)) return true;
    return false;
  }
  function buttonHtml(p) {
    var url = realCoaUrl(p);
    var lot = coaLot(p);
    var name = (p && p.name) ? p.name : 'this compound';
    if (url) {
      var label = lot ? 'View lot COA' : 'Download COA';
      return '<a class="btn-coa-secondary" data-coa-sot="1" data-coa-real="1" href="' + esc(url) + '" target="_blank" rel="noopener">' + label + '</a>';
    }
    return '<button type="button" class="btn-coa-secondary" data-coa-sot="1" data-coa-real="0" onclick="openCOARequest(\'' + escJs(name) + '\')">Request lot COA</button>';
  }
  function applyButtons(p) {
    var html = buttonHtml(p);
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var fresh = wrap.firstElementChild;
    if (!fresh) return;

    var nodes = document.querySelectorAll('.btn-coa-secondary, .btn-inquiry, .btn-authentic, [data-coa-authentic], a[href*="coa"], button[onclick*="COA"]');
    var targets = [];
    for (var i = 0; i < nodes.length; i++) {
      if (isCoaControl(nodes[i])) targets.push(nodes[i]);
    }
    if (!targets.length) {
      var docs = document.getElementById('pdpPanelDocs');
      var price = document.querySelector('.pdp-buy-col .price-section, .pdp-buy-col');
      var host = docs || price;
      if (host && !host.querySelector('[data-coa-sot="1"]')) host.insertAdjacentElement('afterbegin', fresh);
      return;
    }
    targets[0].replaceWith(fresh);
    for (var j = 1; j < targets.length; j++) {
      if (targets[j] && targets[j].parentNode) targets[j].parentNode.removeChild(targets[j]);
    }
  }
  function applyJsonLd(p) {
    var url = realCoaUrl(p);
    var lot = coaLot(p);
    var existing = document.getElementById('coa-jsonld');
    if (!url) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      var prod = document.getElementById('product-jsonld');
      if (prod) {
        try {
          var data = JSON.parse(prod.textContent || '{}');
          if (data && data.subjectOf) {
            delete data.subjectOf;
            prod.textContent = JSON.stringify(data);
          }
        } catch (e) {}
      }
      return;
    }
    var abs = url;
    if (url.charAt(0) === '/') abs = 'https://biolabsresearch.co' + url;
    var name = ((p && p.name) ? p.name + ' ' : '') + 'Certificate of Analysis' + (lot ? ' lot ' + lot : '');
    var doc = {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      name: name,
      encodingFormat: 'application/pdf',
      url: abs
    };
    if (lot) doc.identifier = lot;
    var el = existing;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'coa-jsonld';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(doc);
    var prodEl = document.getElementById('product-jsonld');
    if (prodEl) {
      try {
        var pdata = JSON.parse(prodEl.textContent || '{}');
        pdata.subjectOf = {
          '@type': 'DigitalDocument',
          name: name,
          encodingFormat: 'application/pdf',
          url: abs
        };
        prodEl.textContent = JSON.stringify(pdata);
      } catch (e2) {}
    }
  }
  function applyCrumbs(p) {
    var slug = (p && p.slug) || pageSlug();
    var fam = SLUG_FAMILY[slug];
    var bc = document.querySelector('.breadcrumb');
    if (!bc) return;
    var name = (p && p.name) || (document.getElementById('breadcrumb-name') && document.getElementById('breadcrumb-name').textContent) || slug;
    if (fam) {
      bc.setAttribute('data-family-crumb', '1');
      bc.setAttribute('data-pdp-crumb', '1');
      bc.innerHTML = '<a href="/">Home</a> › <a href="/families/' + fam.slug + '">' + esc(fam.title) + '</a> › <span id="breadcrumb-name">' + esc(name) + '</span>';
      var bcel = document.getElementById('breadcrumb-jsonld');
      if (bcel) {
        bcel.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biolabsresearch.co/' },
            { '@type': 'ListItem', position: 2, name: fam.title, item: 'https://biolabsresearch.co/families/' + fam.slug },
            { '@type': 'ListItem', position: 3, name: name, item: 'https://biolabsresearch.co/products/' + slug }
          ]
        });
      }
    }
  }
  function applyFamilyLink(p) {
    var slug = (p && p.slug) || pageSlug();
    var fam = SLUG_FAMILY[slug];
    var old = document.getElementById('pdp-family-ctx');
    if (!fam) {
      if (old && old.parentNode) old.parentNode.removeChild(old);
      return;
    }
    var html = 'This listing sits in <a href="/families/' + fam.slug + '">' + esc(fam.title) + '</a>. Browse the <a href="/families/">family index</a> or the <a href="/research-peptides">research compounds hub</a>. Research use only.';
    var el = old;
    if (!el) {
      el = document.createElement('p');
      el.id = 'pdp-family-ctx';
      el.className = 'pdp-family-ctx';
    }
    el.innerHTML = html;
    var overview = document.getElementById('pdpPanelOverview');
    var bc = document.querySelector('.breadcrumb');
    if (overview && !overview.contains(el)) overview.insertAdjacentElement('afterbegin', el);
    else if (!overview && bc && el.parentNode !== bc.parentNode) bc.insertAdjacentElement('afterend', el);
  }
  function applyTrust(p) {
    var url = realCoaUrl(p);
    document.querySelectorAll('.pdp-trust-row li').forEach(function (li) {
      var t = String(li.textContent || '');
      if (/coa/i.test(t)) li.textContent = url ? 'Lot COA available' : 'COA on request';
    });
  }
  function apply(p) {
    if (!onPdp()) return;
    applyButtons(p);
    applyJsonLd(p);
    applyCrumbs(p);
    applyFamilyLink(p);
    applyTrust(p);
  }
  function fromCache() {
    if (window._currentProduct) return window._currentProduct;
    try {
      var raw = localStorage.getItem('biolabs_products');
      var list = raw ? JSON.parse(raw) : [];
      var slug = pageSlug();
      for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].slug === slug) return list[i];
      }
    } catch (e) {}
    return { slug: pageSlug(), name: document.querySelector('.product-title') && document.querySelector('.product-title').textContent };
  }
  function run() {
    if (!onPdp()) return;
    apply(fromCache());
  }
  function load() {
    if (!onPdp()) return;
    fetch('/api/products')
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (products) {
        var slug = pageSlug();
        var p = null;
        (products || []).forEach(function (x) {
          if (x && x.slug === slug) p = x;
        });
        if (p) {
          window._currentProduct = p;
          apply(p);
        } else {
          run();
        }
      })
      .catch(function () { run(); });
  }

  function injectCss() {
    if (document.getElementById('coa-pdp-css')) return;
    var s = document.createElement('style');
    s.id = 'coa-pdp-css';
    s.textContent = '.pdp-family-ctx{font-size:14px;line-height:1.55;color:#5a5a5a;margin:0 0 16px;max-width:40rem}.pdp-family-ctx a{color:#0d0d0d;font-weight:600}';
    (document.head || document.documentElement).appendChild(s);
  }

  window.coaPdpApply = apply;
  window.BLR_FAMILIES = FAMILIES;

  if (!onPdp()) return;
  injectCss();
  [0, 80, 240, 800, 1600].forEach(function (ms) { setTimeout(run, ms); });
  load();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { run(); load(); });
  }
  var box = document.getElementById('product-container');
  if (box && typeof MutationObserver === 'function' && !box.__coaPdpObs) {
    var t = null;
    var obs = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(run, 20);
    });
    obs.observe(box, { childList: true, subtree: true });
    box.__coaPdpObs = 1;
  }
})();
