/* v2.99 PDP split + Overview/Specs/Docs tabs.
   Rearranges existing markup; does not rewrite cart, mg-picker, or pack math.
   Marketing lock: RUO / lot docs on request / COA on request; no stars, IN STOCK,
   SHIPS TODAY, invented HPLC, or fake PDF downloads. */
(function () {
  var CSS_ID = 'pdp-split-css';
  var TRUST = '<li>Research use only</li><li>Lot docs on request</li><li>COA on request</li>';
  var BOUND = false;
  var BUSY = false;

  function onPdp() {
    return /\/products\//.test(location.pathname);
  }
  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    var s = document.createElement('style');
    s.id = CSS_ID;
    s.textContent = [
      '#product-container .pdp-split .qty-upsell-span,',
      '#product-container .pdp-split .semax-qty-span{grid-column:auto!important;width:100%;max-width:100%}',
      '@media(max-width:900px){',
      '#product-container .pdp-split > .product-img-section{order:1!important;position:static!important;margin-top:0!important}',
      '#product-container .pdp-split > .pdp-buy-col{order:2!important}',
      '}',
      '@media(min-width:901px){',
      '#product-container .pdp-split{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}',
      '#product-container .pdp-split > .product-img-section{grid-column:1!important;order:0!important;position:sticky!important;top:88px!important}',
      '#product-container .pdp-split > .pdp-buy-col{grid-column:2!important;order:0!important}',
      '}',
      'html.qty-upsell-on .pdp-split .price-row{display:flex!important}',
      '#product-container .pdp-split .qty-cta-btn::after,',
      '#product-container .pdp-split .semax-qty-cta-btn::after{content:none!important}',
      '.pdp-docs-wrap,.pdp-expect-wrap,.pdp-review,[class*="pdp-in-stock"],.product-img-section .nl-photo-badge,',
      '#product-container .pdp-split .pdp-ship-note,#product-container .pdp-split .pdp-atc-note{display:none!important}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }
  function move(el, dest) {
    if (!el || !dest) return;
    if (el.parentNode !== dest) dest.appendChild(el);
  }
  function labelAtc(btn) {
    if (!btn) return;
    var t = String(btn.textContent || '').replace(/\s+/g, ' ').trim();
    if (!t || /added/i.test(t)) return;
    btn.textContent = 'ADD TO CART';
  }
  function relabelPackHeads(buy) {
    if (!buy) return;
    buy.querySelectorAll('.qty-title, .semax-qty-title').forEach(function (el) {
      var t = String(el.textContent || '');
      if (/strength/i.test(t)) el.textContent = 'Strength';
      else if (/quantity|qty/i.test(t)) el.textContent = 'Quantity';
    });
  }
  function styleCrumbs() {
    var bc = document.querySelector('.breadcrumb');
    if (!bc || bc.getAttribute('data-pdp-crumb') === '1') return;
    bc.setAttribute('data-pdp-crumb', '1');
    var links = bc.querySelectorAll('a');
    if (links[0]) {
      links[0].textContent = 'Home';
      links[0].setAttribute('href', '/');
    }
    if (links[1]) {
      links[1].textContent = 'Catalog';
      links[1].setAttribute('href', '/#catalog');
    }
  }
  function ensureTrust(buy) {
    if (!buy) return;
    var row = buy.querySelector('.pdp-trust-row');
    if (!row) {
      row = document.createElement('ul');
      row.className = 'pdp-trust-row';
      row.setAttribute('aria-label', 'Listing facts');
    }
    row.innerHTML = TRUST;
    var cta = buy.querySelector('.qty-cta, .semax-qty-cta');
    if (cta && cta.parentNode) {
      if (row.previousElementSibling !== cta) cta.insertAdjacentElement('afterend', row);
    } else if (!buy.contains(row)) {
      buy.appendChild(row);
    }
  }
  function placePacks(hero, buy) {
    var packs = hero.querySelector('#qtyUpsell, .qty-upsell-span, .semax-qty-span');
    if (!packs || !buy) return packs;
    if (packs.parentNode !== buy) {
      var price = buy.querySelector('.price-section');
      var sticky = buy.querySelector('#pdpStickyBuy, .pdp-sticky-buy');
      if (price && price.parentNode === buy) price.insertAdjacentElement('afterend', packs);
      else if (sticky) buy.insertBefore(packs, sticky);
      else buy.appendChild(packs);
    }
    return packs;
  }
  function placeUnitPrice(buy) {
    if (!buy) return;
    var row = buy.querySelector('.price-row');
    if (!row) return;
    var hook = buy.querySelector('.product-purity-row') || buy.querySelector('.product-subtitle') || buy.querySelector('.product-title');
    if (hook) hook.insertAdjacentElement('afterend', row);
  }
  function placeSpecStrip(buy, specs) {
    var strip = document.querySelector('#product-container .spec-strip');
    if (!strip || !buy) return;
    var trust = buy.querySelector('.pdp-trust-row');
    if (strip.parentNode !== buy) {
      if (trust) trust.insertAdjacentElement('afterend', strip);
      else buy.appendChild(strip);
    }
    if (specs && !specs.querySelector('.spec-strip')) {
      specs.appendChild(strip.cloneNode(true));
    }
  }
  function ensureTabs(box, hero) {
    var tabs = box.querySelector('#pdpTabs');
    if (tabs) {
      if (tabs.previousElementSibling !== hero) hero.insertAdjacentElement('afterend', tabs);
      return tabs;
    }
    tabs = document.createElement('section');
    tabs.className = 'pdp-tabs';
    tabs.id = 'pdpTabs';
    tabs.innerHTML =
      '<div class="pdp-tablist" role="tablist" aria-label="Research compound details">' +
        '<button type="button" class="pdp-tab is-active" role="tab" id="pdpTabOverview" aria-controls="pdpPanelOverview" aria-selected="true">Overview</button>' +
        '<button type="button" class="pdp-tab" role="tab" id="pdpTabSpecs" aria-controls="pdpPanelSpecs" aria-selected="false">Specs</button>' +
        '<button type="button" class="pdp-tab" role="tab" id="pdpTabDocs" aria-controls="pdpPanelDocs" aria-selected="false">Docs</button>' +
      '</div>' +
      '<div class="pdp-tabpanel is-active" role="tabpanel" id="pdpPanelOverview" aria-labelledby="pdpTabOverview"></div>' +
      '<div class="pdp-tabpanel" role="tabpanel" id="pdpPanelSpecs" aria-labelledby="pdpTabSpecs" hidden></div>' +
      '<div class="pdp-tabpanel" role="tabpanel" id="pdpPanelDocs" aria-labelledby="pdpTabDocs" hidden></div>';
    hero.insertAdjacentElement('afterend', tabs);
    return tabs;
  }
  function overviewExtras() {
    return ''
      + '<div class="pdp-overview-grid">'
      + '<article><p class="pdp-og-kicker">Documentation</p><h3>Lot docs on request</h3><p>Lot identity belongs on the matching lot file when issued. This page does not invent a lot number.</p></article>'
      + '<article><p class="pdp-og-kicker">Certificate</p><h3>COA on request</h3><p>Inquire for the certificate of analysis. No purity % is invented on this page.</p></article>'
      + '<article><p class="pdp-og-kicker">Use</p><h3>Research use only</h3><p>Laboratory research reagent. Not a medicine and not for human consumption.</p></article>'
      + '<article><p class="pdp-og-kicker">Records</p><h3>Traceable lots</h3><p>Lot-specific records sit on the COA when a file is issued.</p></article>'
      + '</div>'
      + '<p class="pdp-ruo-banner">Research use only. Not for human consumption. Not a medicine.</p>';
  }
  function docsHtml() {
    return '<div class="pdp-docs-request" data-pdp-placeholder="1">'
      + '<p>Lot documentation and the certificate of analysis are available on request for this research compound. Inquire for the matching lot file. This page does not host a downloadable certificate unless a real lot file exists.</p>'
      + '</div>';
  }
  function adopt(box, hero, buy, tabs) {
    var overview = document.getElementById('pdpPanelOverview');
    var specs = document.getElementById('pdpPanelSpecs');
    var docs = document.getElementById('pdpPanelDocs');
    if (!overview || !specs || !docs) return;

    box.querySelectorAll('.pdp-docs-wrap, .pdp-review').forEach(function (el) { el.remove(); });

    var desc = buy.querySelector('.product-desc-text');
    if (desc && !overview.querySelector('.product-desc-lead')) {
      var lead = desc.cloneNode(true);
      lead.classList.add('product-desc-lead');
      overview.insertBefore(lead, overview.firstChild);
    }
    if (!overview.querySelector('.pdp-overview-grid')) {
      var wrap = document.createElement('div');
      wrap.innerHTML = overviewExtras();
      while (wrap.firstChild) overview.appendChild(wrap.firstChild);
    }
    var expect = box.querySelector('.pdp-expect-wrap');
    if (expect) expect.remove();

    box.querySelectorAll('.spec-note, .storage-box').forEach(function (el) {
      if (overview.contains(el) || docs.contains(el) || buy.contains(el)) return;
      move(el, specs);
    });
    placeSpecStrip(buy, specs);
    if (!specs.querySelector('.spec-strip') && !specs.querySelector('.spec-note')) {
      specs.innerHTML = '<p class="spec-note">Public identifiers for this research compound appear on the listing when published. Lot results live on the COA when issued. No purity % is invented on this page.</p>';
    }

    buy.querySelectorAll('.btn-coa-secondary').forEach(function (btn) { move(btn, docs); });
    hero.querySelectorAll('.qty-upsell-span .btn-coa-secondary, .semax-qty-span .btn-coa-secondary').forEach(function (btn) {
      move(btn, docs);
    });
    var priceNote = buy.querySelector('.price-note');
    if (priceNote) move(priceNote, docs);
    if (!docs.querySelector('.btn-coa-secondary') && !docs.querySelector('.pdp-docs-request')) {
      docs.insertAdjacentHTML('afterbegin', docsHtml());
    }
  }
  function bindTabs() {
    if (BOUND) return;
    BOUND = true;
    document.addEventListener('click', function (e) {
      var tab = e.target && e.target.closest && e.target.closest('.pdp-tab');
      if (!tab || !tab.closest('#pdpTabs')) return;
      e.preventDefault();
      var tabs = document.getElementById('pdpTabs');
      if (!tabs) return;
      var id = tab.getAttribute('aria-controls');
      tabs.querySelectorAll('.pdp-tab').forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      tabs.querySelectorAll('.pdp-tabpanel').forEach(function (p) {
        var on = p.id === id;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('hidden');
        else p.setAttribute('hidden', '');
      });
    });
  }
  function enhance() {
    if (!onPdp() || BUSY) return;
    var box = document.getElementById('product-container');
    if (!box) return;
    var hero = box.querySelector('.product-hero');
    if (!hero) return;
    BUSY = true;
    try {
      document.body.classList.add('product-page');
      document.documentElement.classList.add('product-page');
      hero.classList.add('pdp-split', 'product-page');
      styleCrumbs();
      var buy = hero.querySelector('.pdp-buy-col');
      if (!buy) return;
      var packs = placePacks(hero, buy);
      placeUnitPrice(buy, packs);
      buy.querySelectorAll('.price-section').forEach(function (el) {
        el.style.display = 'none';
      });
      ensureTrust(buy);
      relabelPackHeads(buy);
      labelAtc(document.getElementById('qtyAtc'));
      labelAtc(document.getElementById('semaxQtyAtc'));
      var tabs = ensureTabs(box, hero);
      adopt(box, hero, buy, tabs);
    } finally {
      BUSY = false;
    }
  }
  function observe() {
    var box = document.getElementById('product-container');
    if (!box || box.__pdpSplitObs) return;
    if (typeof MutationObserver !== 'function') return;
    var t = null;
    var obs = new MutationObserver(function () {
      if (BUSY) return;
      if (t) clearTimeout(t);
      t = setTimeout(enhance, 0);
    });
    obs.observe(box, { childList: true, subtree: true });
    box.__pdpSplitObs = 1;
  }

  window.pdpSplitEnhance = enhance;

  if (!onPdp()) return;
  injectCss();
  bindTabs();
  [0, 60, 220, 700, 1400, 2200].forEach(function (ms) {
    setTimeout(enhance, ms);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { observe(); enhance(); });
  } else {
    observe();
    enhance();
  }
})();
