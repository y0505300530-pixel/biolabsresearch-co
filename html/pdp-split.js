/* v2.99 PDP split + Overview/Specs/Docs tabs.
   Rearranges existing markup; does not rewrite cart, mg-picker, or pack math. */
(function () {
  var CSS_ID = 'pdp-split-css';
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
      'html.qty-upsell-on .pdp-split .qty-upsell-span .price-row,',
      'html.qty-upsell-on .pdp-split .semax-qty-span .price-row{display:flex!important}',
      '#product-container .pdp-split .qty-cta-btn::after,',
      '#product-container .pdp-split .semax-qty-cta-btn::after{content:none!important}'
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
  function ensureTrust(buy) {
    if (!buy) return;
    if (buy.querySelector('.pdp-trust-row')) return;
    var row = document.createElement('ul');
    row.className = 'pdp-trust-row';
    row.setAttribute('aria-label', 'Listing facts');
    row.innerHTML = '<li>Lot docs on request</li><li>HPLC</li><li>Traceable</li>';
    var packs = buy.querySelector('#qtyUpsell, .qty-upsell-span, .semax-qty-span');
    var cta = buy.querySelector('.qty-cta, .semax-qty-cta, #atc-btn');
    if (packs) packs.appendChild(row);
    else if (cta && cta.parentNode) cta.insertAdjacentElement('afterend', row);
    else buy.appendChild(row);
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
  function placeUnitPrice(buy, packs) {
    if (!buy) return;
    var row = buy.querySelector('.price-row');
    var cta = (packs && packs.querySelector('.qty-cta, .semax-qty-cta')) || buy.querySelector('.qty-cta, .semax-qty-cta');
    if (row && cta && row.parentNode !== packs) {
      cta.parentNode.insertBefore(row, cta);
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
  function fillIfEmpty(panel, html) {
    if (!panel) return;
    if (panel.childElementCount) return;
    panel.innerHTML = html;
  }
  function adopt(box, hero, buy, tabs) {
    var overview = document.getElementById('pdpPanelOverview');
    var specs = document.getElementById('pdpPanelSpecs');
    var docs = document.getElementById('pdpPanelDocs');
    if (!overview || !specs || !docs) return;

    var desc = buy.querySelector('.product-desc-text');
    if (desc) move(desc, overview);
    var expect = box.querySelector('.pdp-expect-wrap');
    if (expect) move(expect, overview);
    var note = box.querySelector('.research-note');
    if (note) move(note, overview);
    fillIfEmpty(overview, '<p class="product-desc-text">Research compound listing. Research use only — not a medicine.</p>');

    box.querySelectorAll('.spec-strip, .spec-note, .storage-box').forEach(function (el) {
      if (overview.contains(el) || docs.contains(el) || specs.contains(el)) return;
      move(el, specs);
    });
    fillIfEmpty(specs, '<p class="spec-note">Public identifiers for this research compound appear on the listing when published. Lot results live on the COA when issued. No purity % is invented on this page.</p>');

    var docsWrap = box.querySelector('.pdp-docs-wrap');
    if (docsWrap && !docs.contains(docsWrap)) {
      docs.querySelectorAll('[data-pdp-placeholder]').forEach(function (n) { n.remove(); });
      move(docsWrap, docs);
    }
    buy.querySelectorAll('.btn-coa-secondary').forEach(function (btn) { move(btn, docs); });
    hero.querySelectorAll('.qty-upsell-span .btn-coa-secondary, .semax-qty-span .btn-coa-secondary').forEach(function (btn) {
      move(btn, docs);
    });
    var priceNote = buy.querySelector('.price-note');
    if (priceNote) move(priceNote, docs);
    fillIfEmpty(docs, '<p data-pdp-placeholder="1">Lot COA and SDS are available on request for this research compound.</p>');
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
      var buy = hero.querySelector('.pdp-buy-col');
      if (!buy) return;
      var packs = placePacks(hero, buy);
      placeUnitPrice(buy, packs);
      ensureTrust(buy);
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
