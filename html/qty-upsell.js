/* Sitewide quantity-upsell (v2.94). Two-step PDP: Choose strength (if multi-mg) then
   1/2/3 bottle packs. Pack units from the selected strength's list price U:
     1: U    2: round(U*89/99)    3: round(U*79/99)
   Same ratios as Semax 99→89 / 99→79. Prices come from /api/products only.
   mg-picker.js is hidden, not rewritten. Cart lines carry mg + pack_tiers.
   v2.99: mount packs inside .pdp-buy-col (right rail), not as a full-width grid span. */
(function () {
  var RATIO2 = 89 / 99;
  var RATIO3 = 79 / 99;
  var PACK_QTY = [1, 2, 3];
  var DEFAULT_QTY = 2;
  var ASSET_V = '183';
  var CSS_ID = 'qty-upsell-css';
  var PRODUCT = null;
  var MG = '';
  var QTY = DEFAULT_QTY;
  var BOUND = false;

  function slugFromPath() {
    var m = location.pathname.match(/\/products\/([^/.]+)/);
    var s = m ? m[1] : '';
    if (s === 'wolverine-blend') return 'bpc-157-tb-500-blend';
    return s;
  }
  function skipSlug(slug) {
    return !slug || slug === 'product' || slug === 'research-solvent';
  }
  function normMg(mg) {
    return String(mg == null ? '' : mg).replace(/\s+/g, '').toLowerCase();
  }
  function prettyMg(mg) {
    var n = normMg(mg);
    if (!n) return '';
    return n.replace(/(mcg|mg|ml|g)$/i, ' $1');
  }
  function currentProduct(slug) {
    var p = window._currentProduct;
    if (p && p.slug === slug) return p;
    if (PRODUCT && PRODUCT.slug === slug) return PRODUCT;
    return null;
  }
  function listStrengths(slug) {
    var p = currentProduct(slug);
    if (p && p.strengths && p.strengths.length) {
      return p.strengths.map(function (s) { return normMg(s); }).filter(Boolean);
    }
    var chips = document.querySelectorAll('.size-btn, #mgPicker button[data-mg]');
    var out = [];
    for (var i = 0; i < chips.length; i++) {
      var raw = chips[i].getAttribute('data-mg') || String(chips[i].textContent || '');
      var m = String(raw).match(/(\d+(?:\.\d+)?\s*(?:mcg|mg|ml|g))/i);
      if (m) {
        var key = normMg(m[1]);
        if (key && out.indexOf(key) === -1) out.push(key);
      }
    }
    return out;
  }
  function catalogUnitFor(slug, mg) {
    var want = normMg(mg);
    var p = currentProduct(slug);
    if (p && p.strength_prices) {
      var sp = p.strength_prices;
      if (Array.isArray(sp)) {
        for (var i = 0; i < sp.length; i++) {
          var e = sp[i];
          if (e && normMg(e.mg || e.strength || e.label) === want && isFinite(Number(e.price))) {
            return Number(e.price);
          }
        }
      } else {
        var keys = Object.keys(sp);
        for (var k = 0; k < keys.length; k++) {
          if (normMg(keys[k]) === want && isFinite(Number(sp[keys[k]]))) return Number(sp[keys[k]]);
        }
      }
    }
    var chip = document.querySelector('.size-btn[data-mg="' + want + '"], #mgPicker button[data-mg="' + want + '"]');
    if (!chip) {
      var buttons = document.querySelectorAll('.size-btn');
      for (var b = 0; b < buttons.length; b++) {
        if (normMg(buttons[b].textContent).indexOf(want) !== -1) { chip = buttons[b]; break; }
      }
    }
    if (chip) {
      var aria = String(chip.getAttribute('aria-label') || '');
      var lab = aria || String(chip.textContent || '');
      var pm = lab.match(/\$(\d+(?:\.\d+)?)/);
      if (pm) return Number(pm[1]);
    }
    var one = listStrengths(slug);
    if (one.length === 1 && want === one[0]) {
      var el = document.getElementById('current-price');
      var n = parseFloat(String(el && el.textContent || '').replace(/[^0-9.]/g, ''));
      if (isFinite(n) && n > 0) return n;
      if (p && isFinite(Number(p.price)) && Number(p.price) > 0) return Number(p.price);
    }
    /* Semax last-resort only — live catalog already verified these units. */
    if (slug === 'semax' && want === '10mg') return 99;
    if (slug === 'semax' && want === '30mg') return 119;
    return null;
  }
  function packTiersFor(slug, mg) {
    var u = catalogUnitFor(slug, mg);
    if (u == null || !isFinite(u) || u <= 0) return null;
    return {
      1: Math.round(u),
      2: Math.round(u * RATIO2),
      3: Math.round(u * RATIO3)
    };
  }
  function fileFor(slug) {
    return '/media/vial-' + slug + '.png?v=181';
  }
  function packImg(slug, q) {
    return {
      webp: '/media/' + slug + '-qty-' + q + '.webp?v=' + ASSET_V,
      png: '/media/' + slug + '-qty-' + q + '.png?v=' + ASSET_V
    };
  }
  function selectedQty() {
    var on = document.querySelector('#qtyPacks [aria-checked="true"], #semaxQtyPacks [aria-checked="true"]');
    var q = parseInt(on && on.getAttribute('data-qty'), 10);
    if (q === 1 || q === 2 || q === 3) return q;
    return QTY || DEFAULT_QTY;
  }
  function currentMg(slug) {
    var card = document.querySelector('#qtyStrength [aria-checked="true"], #semaxStrength [aria-checked="true"]');
    if (card && card.getAttribute('data-mg')) return normMg(card.getAttribute('data-mg'));
    if (window._pdpMg) return normMg(window._pdpMg);
    if (MG) return normMg(MG);
    var list = listStrengths(slug);
    return list[0] || '';
  }
  function injectCss() {
    if (document.getElementById(CSS_ID)) return;
    var s = document.createElement('style');
    s.id = CSS_ID;
    s.textContent = [
      '.qty-upsell-hero{min-width:0}',
      '.qty-upsell-span{min-width:0;max-width:100%;position:relative;z-index:2}',
      '.pdp-split .qty-upsell-span,.pdp-split .semax-qty-span{grid-column:auto!important}',
      '.qty-upsell-on #mgPicker,',
      '.qty-upsell-on .size-label,',
      '.qty-upsell-on .size-options,',
      '.qty-upsell-on .price-row,',
      '.qty-upsell-on .qty-legacy-row,',
      '.qty-upsell-hero.semax-qty-hero #mgPicker,',
      '.qty-upsell-hero.semax-qty-hero .semax-qty-price .size-label,',
      '.qty-upsell-hero.semax-qty-hero .semax-qty-price .size-options,',
      '.qty-upsell-hero.semax-qty-hero .semax-qty-unit-row{display:none!important}',
      '.qty-atc-clip{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
      '.qty-str-head,.qty-pack-head{margin:0 0 12px}',
      '.qty-title{font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:-.03em;color:var(--ink);margin:0 0 4px}',
      '.qty-sub{margin:0;font-size:14px;color:var(--ink-soft)}',
      '.qty-str-grid{display:grid;grid-template-columns:repeat(var(--qty-str-n,2),minmax(0,1fr));gap:10px;margin:0 0 22px;min-width:0}',
      '.qty-str-card{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;width:100%;min-width:0;min-height:72px;margin:0;padding:16px 44px 16px 16px;border:1.5px solid var(--border);border-radius:18px;background:#fff;color:var(--ink);cursor:pointer;text-align:left;font-family:var(--font-display);-webkit-appearance:none;appearance:none;box-sizing:border-box;transition:border-color .15s,box-shadow .15s}',
      '.qty-str-card:hover,.qty-pack-card:hover{border-color:#d4c4a8}',
      '.qty-str-card[aria-checked="true"],.qty-pack-card[aria-checked="true"]{border-color:#C4A36A;box-shadow:0 0 0 1px #C4A36A;background:#fff}',
      '.qty-str-card .qty-badge{top:10px;right:10px;left:auto}',
      '.qty-str-card .qty-radio{top:50%;right:12px;margin-top:-11px}',
      '.qty-str-mg{font-size:20px;font-weight:800;letter-spacing:-.03em;line-height:1.15}',
      '.qty-str-from{font-size:13px;font-weight:600;color:var(--ink-soft)}',
      '.qty-pack-grid{display:grid;grid-template-columns:1fr;gap:10px;margin:0 0 14px;min-width:0}',
      '.qty-pack-card{position:relative;display:flex;flex-direction:column;align-items:stretch;width:100%;min-width:0;min-height:44px;margin:0;padding:14px 12px 16px;border:1.5px solid var(--border);border-radius:18px;background:#fff;color:var(--ink);cursor:pointer;text-align:center;font-family:var(--font-display);-webkit-appearance:none;appearance:none;box-sizing:border-box;transition:border-color .15s,box-shadow .15s}',
      '.qty-badge{position:absolute;top:10px;left:10px;display:none;padding:3px 8px;border-radius:999px;background:#F2D191;color:#6B4A12;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}',
      '.qty-pack-card[aria-checked="true"] .qty-badge,.qty-str-card[aria-checked="true"] .qty-badge{display:inline-flex}',
      '.qty-radio{position:absolute;top:10px;right:10px;width:22px;height:22px;border-radius:50%;border:1.5px solid #c8c0b4;background:#fff;box-sizing:border-box}',
      '.qty-pack-card[aria-checked="true"] .qty-radio,.qty-str-card[aria-checked="true"] .qty-radio{border-color:#C4A36A;background:#C4A36A;box-shadow:inset 0 0 0 4px #fff}',
      '.qty-pack-card picture,.qty-pack-card img{display:block;width:100%;max-width:100%;height:auto;margin:18px auto 8px;object-fit:contain}',
      '.qty-pack-name{font-size:15px;font-weight:700;margin:4px 0 2px}',
      '.qty-pack-total{font-size:22px;font-weight:800;letter-spacing:-.03em;line-height:1.15;margin:0}',
      '.qty-pack-each{font-size:12px;color:var(--ink-soft);margin:4px 0 0}',
      '.qty-cta{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;margin:0 0 14px;padding:10px 14px 10px 18px;background:#111;color:#fff;border-radius:999px}',
      '.qty-cta-meta{font-size:14px;font-weight:600;min-width:0;flex:1 1 auto}',
      '.qty-cta-btn{flex:0 0 auto;min-height:44px;min-width:44px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:var(--font-display);display:inline-flex;align-items:center;gap:8px}',
      '.qty-cta-btn::after{content:"→";font-weight:500}',
      '.qty-cta-btn:focus-visible,.qty-pack-card:focus-visible,.qty-str-card:focus-visible{outline:2px solid #C4A36A;outline-offset:3px}',
      '@media(min-width:720px){',
      '.qty-pack-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}',
      '.qty-title{font-size:26px}',
      '.qty-str-grid{gap:12px}',
      '}',
      '@media(max-width:719px){',
      '.qty-cta{border-radius:16px;flex-wrap:wrap;padding:12px 14px}',
      '.qty-cta-btn{width:100%;justify-content:center}',
      '.qty-str-grid[data-str-n="3"]{grid-template-columns:1fr}',
      '}'
    ].join('');
    (document.head || document.documentElement).appendChild(s);
  }
  function hideLegacy() {
    document.documentElement.classList.add('qty-upsell-on');
    var atc = document.getElementById('atc-btn');
    if (atc) {
      var row = atc.parentNode;
      if (row && row !== document.body) {
        var hasQty = row.querySelector && row.querySelector('#pdpQty');
        if (hasQty || (row.getAttribute('style') || '').indexOf('display:flex') !== -1) {
          row.classList.add('qty-legacy-row');
        }
      }
      atc.classList.add('qty-atc-clip');
      atc.setAttribute('tabindex', '-1');
      atc.setAttribute('aria-hidden', 'true');
    }
  }
  function strengthHtml(slug, strengths, mg) {
    if (strengths.length < 2) return '';
    var cards = strengths.map(function (s) {
      var unit = catalogUnitFor(slug, s);
      var on = normMg(s) === normMg(mg);
      var from = (unit != null) ? ('from $' + unit + ' / bottle') : ('from-price for ' + prettyMg(s));
      var aria = prettyMg(s) + (unit != null ? (', from $' + unit + ' per bottle') : '');
      return (
        '<button type="button" class="qty-str-card" role="radio" aria-checked="' + (on ? 'true' : 'false') + '" data-mg="' + s + '" aria-label="' + aria + '">' +
          '<span class="qty-badge">Selected</span>' +
          '<span class="qty-radio" aria-hidden="true"></span>' +
          '<span class="qty-str-mg">' + prettyMg(s) + '</span>' +
          '<span class="qty-str-from" data-str-from>' + from + '</span>' +
        '</button>'
      );
    }).join('');
    return (
      '<div class="qty-str-head">' +
        '<h2 class="qty-title">1. Choose strength</h2>' +
        '<p class="qty-sub">' + strengths.map(prettyMg).join(' or ') + ' per bottle.</p>' +
      '</div>' +
      '<div class="qty-str-grid" id="qtyStrength" role="radiogroup" aria-label="Choose strength" data-str-n="' + strengths.length + '" style="--qty-str-n:' + strengths.length + '">' +
        cards +
      '</div>'
    );
  }
  function packCardsHtml(slug, mg, qty) {
    var label = prettyMg(mg);
    var tiers = packTiersFor(slug, mg);
    return PACK_QTY.map(function (q) {
      var unit = tiers ? tiers[q] : null;
      var total = (unit != null) ? unit * q : null;
      var img = packImg(slug, q);
      var on = q === qty;
      var name = q + ' × ' + label;
      var aria = name + (total != null ? (', $' + total + ' total, $' + unit + ' per bottle') : '');
      return (
        '<button type="button" class="qty-pack-card" role="radio" aria-checked="' + (on ? 'true' : 'false') + '" data-qty="' + q + '" aria-label="' + aria + '">' +
          '<span class="qty-badge">Selected</span>' +
          '<span class="qty-radio" aria-hidden="true"></span>' +
          '<picture>' +
            '<source type="image/webp" srcset="' + img.webp + '">' +
            '<img src="' + img.png + '" alt="" width="400" height="225" decoding="async">' +
          '</picture>' +
          '<span class="qty-pack-name" data-pack-name>' + name + '</span>' +
          '<span class="qty-pack-total" data-pack-total>' + (total != null ? ('$' + total) : '') + '</span>' +
          '<span class="qty-pack-each" data-pack-each>' + (unit != null ? ('$' + unit + ' per bottle') : '') + '</span>' +
        '</button>'
      );
    }).join('');
  }
  function injectMount(hero, slug) {
    var existing = document.getElementById('qtyUpsell');
    var strengths = listStrengths(slug);
    if (existing) {
      var have = existing.querySelectorAll('#qtyStrength [data-mg]').length;
      var want = strengths.length >= 2 ? strengths.length : 0;
      if (have === want) {
        placePacksInBuy(hero, existing);
        return existing;
      }
      existing.remove();
    }
    if (document.getElementById('semaxQtyPacks')) return null;
    if (!strengths.length) return null;
    if (!MG) MG = strengths[0];
    var qty = selectedQty();
    var multi = strengths.length > 1;
    var step = multi ? '2. Choose quantity' : 'Choose quantity';
    var span = document.createElement('div');
    span.id = 'qtyUpsell';
    span.className = 'qty-upsell-span';
    span.innerHTML =
      strengthHtml(slug, strengths, MG) +
      '<div class="qty-pack-head">' +
        '<h2 class="qty-title">' + step + '</h2>' +
        '<p class="qty-sub" id="qtySub">Each bottle is ' + prettyMg(MG) + '.</p>' +
      '</div>' +
      '<div class="qty-pack-grid" id="qtyPacks" role="radiogroup" aria-label="Choose quantity">' +
        packCardsHtml(slug, MG, qty) +
      '</div>' +
      (document.getElementById('pdpQty') ? '' : '<span id="pdpQty" hidden>' + qty + '</span>') +
      '<div class="qty-cta">' +
        '<span class="qty-cta-meta" id="qtyCtaMeta"></span>' +
        '<button type="button" class="qty-cta-btn" id="qtyAtc">ADD TO CART</button>' +
      '</div>';
    placePacksInBuy(hero, span);
    relocateNotes(span);
    if (typeof window.pdpSplitEnhance === 'function') window.pdpSplitEnhance();
    return span;
  }
  function placePacksInBuy(hero, span) {
    if (!hero || !span) return;
    var buy = hero.querySelector('.pdp-buy-col');
    var sticky = hero.querySelector('#pdpStickyBuy, .pdp-sticky-buy');
    if (buy) {
      if (span.parentNode !== buy) {
        var price = buy.querySelector('.price-section');
        var stickyInBuy = buy.querySelector('#pdpStickyBuy, .pdp-sticky-buy');
        if (price && price.parentNode === buy) price.insertAdjacentElement('afterend', span);
        else if (stickyInBuy) buy.insertBefore(span, stickyInBuy);
        else buy.appendChild(span);
      }
      return;
    }
    if (sticky) hero.insertBefore(span, sticky);
    else if (!span.parentNode) hero.appendChild(span);
  }
  function relocateNotes(span) {
    if (!span || span.querySelector('.pdp-ship-note')) return;
    var buy = document.querySelector('.pdp-buy-col');
    if (!buy) return;
    ['pdp-ship-note', 'pdp-atc-note'].forEach(function (cls) {
      var el = buy.querySelector('.' + cls);
      if (el) span.appendChild(el);
    });
    /* v2.99: COA stays for Docs tab — do not pull Request lot COA into the pack CTA */
  }
  function paint() {
    var slug = slugFromPath();
    if (skipSlug(slug)) return;
    var strengths = listStrengths(slug);
    if (!strengths.length) return;
    if (!MG || strengths.indexOf(normMg(MG)) === -1) MG = strengths[0];
    MG = normMg(MG);
    window._pdpMg = MG;
    QTY = selectedQty();
    var label = prettyMg(MG);
    var tiers = packTiersFor(slug, MG);
    var hero = document.querySelector('#product-container .product-hero');
    if (hero) {
      hero.classList.add('qty-upsell-hero');
      if (!hero.classList.contains('semax-qty-hero')) hero.classList.add('qty-upsell-hero');
    }
    hideLegacy();

    var strGrid = document.getElementById('qtyStrength') || document.getElementById('semaxStrength');
    if (strGrid && strengths.length > 1) {
      strGrid.setAttribute('data-str-n', String(strengths.length));
      strGrid.style.setProperty('--qty-str-n', String(strengths.length));
      var strCards = strGrid.querySelectorAll('[data-mg]');
      for (var s = 0; s < strCards.length; s++) {
        var smg = normMg(strCards[s].getAttribute('data-mg'));
        var sUnit = catalogUnitFor(slug, smg);
        var sOn = smg === MG;
        var fromEl = strCards[s].querySelector('[data-str-from], .semax-str-from, .qty-str-from');
        if (fromEl && sUnit != null) fromEl.textContent = 'from $' + sUnit + ' / bottle';
        strCards[s].setAttribute('aria-checked', sOn ? 'true' : 'false');
        strCards[s].setAttribute('aria-label', prettyMg(smg) + (sUnit != null ? (', from $' + sUnit + ' per bottle') : ''));
      }
    }

    var packGrid = document.getElementById('qtyPacks') || document.getElementById('semaxQtyPacks');
    if (packGrid) {
      var cards = packGrid.querySelectorAll('[data-qty]');
      for (var i = 0; i < cards.length; i++) {
        var q = parseInt(cards[i].getAttribute('data-qty'), 10) || 1;
        var unit = tiers && tiers[q] != null ? tiers[q] : null;
        var total = unit != null ? unit * q : null;
        var nameEl = cards[i].querySelector('[data-pack-name]');
        var totEl = cards[i].querySelector('[data-pack-total]');
        var eachEl = cards[i].querySelector('[data-pack-each]');
        if (nameEl) nameEl.textContent = q + ' × ' + label;
        if (totEl) totEl.textContent = total != null ? ('$' + total) : '';
        if (eachEl) eachEl.textContent = unit != null ? ('$' + unit + ' per bottle') : '';
        var on = q === QTY;
        cards[i].setAttribute('aria-checked', on ? 'true' : 'false');
        cards[i].setAttribute('aria-label', q + ' × ' + label + (total != null ? (', $' + total + ' total, $' + unit + ' per bottle') : ''));
      }
    }

    var sub = document.getElementById('qtySub') || document.getElementById('semaxQtySub');
    if (sub) sub.textContent = 'Each bottle is ' + label + '.';
    var pdpQty = document.getElementById('pdpQty');
    if (pdpQty) pdpQty.textContent = String(QTY);
    var packTotal = tiers && tiers[QTY] != null ? tiers[QTY] * QTY : null;
    var meta = document.getElementById('qtyCtaMeta') || document.getElementById('semaxQtyCtaMeta');
    if (meta) meta.textContent = packTotal != null ? (QTY + ' × ' + label + ' · $' + packTotal) : (QTY + ' × ' + label);
    var sticky = document.getElementById('pdpStickyPrice');
    if (sticky && packTotal != null) sticky.textContent = '$' + packTotal;
    var stickyLab = document.querySelector('#pdpStickyBuy .pdp-sticky-label');
    if (stickyLab) stickyLab.textContent = label;
    var priceEl = document.getElementById('current-price');
    var u = catalogUnitFor(slug, MG);
    if (priceEl && u != null) priceEl.textContent = '$' + u;
    window.qtyPackTiers = function () { return packTiersFor(slugFromPath(), currentMg(slugFromPath())); };
  }
  function chooseStrength(mg) {
    var slug = slugFromPath();
    var list = listStrengths(slug);
    mg = normMg(mg);
    if (list.indexOf(mg) === -1) mg = list[0] || mg;
    MG = mg;
    window._pdpMg = mg;
    var grid = document.getElementById('qtyStrength') || document.getElementById('semaxStrength');
    if (grid) {
      grid.querySelectorAll('[data-mg]').forEach(function (b) {
        b.setAttribute('aria-checked', normMg(b.getAttribute('data-mg')) === mg ? 'true' : 'false');
      });
    }
    document.querySelectorAll('#mgPicker button[data-mg]').forEach(function (b) {
      var on = normMg(b.getAttribute('data-mg')) === mg;
      b.classList.toggle('on', on);
      b.classList.toggle('active', on);
    });
    document.querySelectorAll('.size-btn').forEach(function (b) {
      b.classList.toggle('active', normMg(b.textContent).indexOf(mg) !== -1);
    });
    paint();
  }
  function chooseQty(q) {
    q = parseInt(q, 10);
    if (q !== 1 && q !== 2 && q !== 3) q = DEFAULT_QTY;
    QTY = q;
    var grid = document.getElementById('qtyPacks') || document.getElementById('semaxQtyPacks');
    if (grid) {
      grid.querySelectorAll('[data-qty]').forEach(function (b) {
        b.setAttribute('aria-checked', parseInt(b.getAttribute('data-qty'), 10) === q ? 'true' : 'false');
      });
    }
    paint();
  }
  function hookSave() {
    var cur = window.saveCart;
    if (typeof cur !== 'function' || cur.__qtyPack) return;
    window.saveCart = function (c) {
      if (typeof c === 'undefined' && typeof cart !== 'undefined') c = cart;
      if (Array.isArray(c)) {
        c.forEach(function (i) {
          if (!i || i.gift || !i.pack_tiers) return;
          var t = i.pack_tiers;
          if (typeof t === 'string') {
            try { t = JSON.parse(t); } catch (e) { return; }
          }
          if (!t || typeof t !== 'object') return;
          var q = parseInt(i.qty, 10) || 1;
          var unit = (q >= 3 && t[3] != null) ? t[3] : (q >= 2 && t[2] != null) ? t[2] : (t[1] != null ? t[1] : t['1']);
          var n = parseFloat(unit);
          if (isFinite(n) && n > 0) i.price = n;
        });
      }
      return cur.apply(this, arguments);
    };
    window.saveCart.__qtyPack = true;
  }
  function addPack() {
    var slug = slugFromPath();
    if (skipSlug(slug)) return;
    var nameEl = document.querySelector('.product-title');
    var name = ((nameEl && nameEl.textContent) || slug).replace(/\s+/g, ' ').trim();
    var mg = currentMg(slug);
    var qty = selectedQty();
    var tiers = packTiersFor(slug, mg);
    if (!mg || !tiers) return;
    var unitPrice = tiers[qty] != null ? tiers[qty] : tiers[1];
    hookSave();
    var cart = (typeof getCart === 'function') ? getCart() : [];
    if (!Array.isArray(cart)) cart = [];
    var ex = cart.find(function (i) {
      return i && !i.gift && i.slug === slug && normMg(i.mg) === normMg(mg);
    });
    if (ex) {
      ex.qty = (parseInt(ex.qty, 10) || 0) + qty;
      ex.pack_tiers = tiers;
      ex.pack_mg = mg;
      ex.mg = mg;
      ex.name = name;
      ex.slug = slug;
      var nq = parseInt(ex.qty, 10) || qty;
      ex.price = nq >= 3 ? tiers[3] : (nq >= 2 ? tiers[2] : tiers[1]);
      ex.imageUrl = fileFor(slug);
    } else {
      cart.push({
        name: name,
        price: unitPrice,
        qty: qty,
        slug: slug,
        mg: mg,
        pack_tiers: tiers,
        pack_mg: mg,
        imageUrl: fileFor(slug)
      });
    }
    saveCart(cart);
    if (typeof updateBadge === 'function') updateBadge();
    var btn = document.getElementById('qtyAtc') || document.getElementById('semaxQtyAtc') || document.getElementById('atc-btn');
    if (btn) {
      var o = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.background = '#0d2137';
      setTimeout(function () { btn.textContent = o; btn.style.background = ''; }, 1800);
    }
    var _cd = document.getElementById('cartDrawer');
    if (_cd && !_cd.classList.contains('open') && typeof toggleCart === 'function') toggleCart();
    else if (typeof renderCart === 'function') renderCart();
  }
  function installAdd() {
    window.addToCartTemplate = addPack;
    window.addToCartTemplate._mg = 1;
    window.addToCartTemplate.__qtyPack = 1;
    hookSave();
  }
  function bind() {
    if (BOUND) return;
    BOUND = true;
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest('#qtyAtc, #semaxQtyAtc, #pdpStickyBuy .pdp-sticky-atc');
      if (t) {
        e.preventDefault();
        e.stopImmediatePropagation();
        addPack();
        return;
      }
      var str = e.target && e.target.closest && e.target.closest('#qtyStrength [data-mg], #semaxStrength [data-mg], .qty-str-card[data-mg], .semax-str-card[data-mg]');
      if (str) {
        e.preventDefault();
        chooseStrength(str.getAttribute('data-mg'));
        return;
      }
      var card = e.target && e.target.closest && e.target.closest('#qtyPacks [data-qty], #semaxQtyPacks [data-qty], .qty-pack-card[data-qty], .semax-qty-card[data-qty]');
      if (card) {
        e.preventDefault();
        chooseQty(card.getAttribute('data-qty'));
      }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var strGrid = document.getElementById('qtyStrength') || document.getElementById('semaxStrength');
      if (strGrid && strGrid.contains(document.activeElement)) {
        e.preventDefault();
        var slug = slugFromPath();
        var list = listStrengths(slug);
        var idx = list.indexOf(currentMg(slug));
        if (idx < 0) idx = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = Math.min(list.length - 1, idx + 1);
        else idx = Math.max(0, idx - 1);
        var nextS = strGrid.querySelector('[data-mg="' + list[idx] + '"]');
        if (nextS) { nextS.focus(); chooseStrength(list[idx]); }
        return;
      }
      var grid = document.getElementById('qtyPacks') || document.getElementById('semaxQtyPacks');
      if (!grid || !grid.contains(document.activeElement)) return;
      e.preventDefault();
      var q = selectedQty();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') q = Math.min(3, q + 1);
      else q = Math.max(1, q - 1);
      var next = grid.querySelector('[data-qty="' + q + '"]');
      if (next) { next.focus(); chooseQty(q); }
    });
  }
  function mount() {
    if (!/\/products\//.test(location.pathname)) return;
    var slug = slugFromPath();
    if (skipSlug(slug)) return;
    injectCss();
    var hero = document.querySelector('#product-container .product-hero');
    if (!hero) return;
    if (!MG) {
      var list = listStrengths(slug);
      if (list.length) MG = list[0];
    }
    injectMount(hero, slug);
    hideLegacy();
    bind();
    installAdd();
    paint();
    if (typeof window.pdpSplitEnhance === 'function') window.pdpSplitEnhance();
  }
  function adoptApi(items) {
    if (!items || !items.length) return;
    var slug = slugFromPath();
    items.forEach(function (p) {
      if (p && p.slug === slug) PRODUCT = p;
    });
    if (PRODUCT) window._currentProduct = window._currentProduct || PRODUCT;
    mount();
    paint();
  }
  function observe() {
    var box = document.getElementById('product-container');
    if (!box || box.__qtyObs) return;
    if (typeof MutationObserver !== 'function') return;
    var t = null;
    var obs = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(mount, 0);
    });
    obs.observe(box, { childList: true, subtree: true });
    box.__qtyObs = 1;
  }

  window.qtyUpsellRefresh = function () { mount(); paint(); };
  window.qtyUpsellPackTiers = packTiersFor;
  window.semaxQtyRefresh = window.qtyUpsellRefresh;

  if (!/\/products\//.test(location.pathname) || skipSlug(slugFromPath())) return;

  injectCss();
  bind();
  installAdd();
  [0, 50, 200, 600, 1200, 2000].forEach(function (t) {
    setTimeout(function () { mount(); installAdd(); }, t);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { observe(); mount(); });
  } else {
    observe();
    mount();
  }
  fetch('/api/products', { credentials: 'same-origin' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      adoptApi(Array.isArray(d) ? d : (d && (d.products || d.items)) || []);
    })
    .catch(function () {});
})();
