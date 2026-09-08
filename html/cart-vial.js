/* cart vial + compact add-more pinned at bottom, horizontal scroll */
(function(){
  if (document.getElementById('cart-addmore-css')) return;
  var s = document.createElement('style');
  s.id = 'cart-addmore-css';
  s.textContent = [
    '/* Stage4 cart-close tap */',
    '.cart-close{min-width:44px !important;min-height:44px !important;width:44px !important;height:44px !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;padding:0 !important}',
    '.cart-drawer{height:100dvh !important;max-height:100dvh !important;overflow:hidden !important;display:flex !important;flex-direction:column !important}',
    '.cart-drawer .cart-items{flex:1 1 0% !important;min-height:0 !important;overflow-y:auto !important;-webkit-overflow-scrolling:touch}',
    /* P0 scroll: drawer + items flex so .cart-items is the vertical scroller */
    '.cart-drawer{height:100dvh !important;max-height:100dvh !important;min-height:0 !important;overflow:hidden !important;display:flex !important;flex-direction:column !important}',
    '.cart-drawer .cart-items{flex:1 1 0% !important;min-height:0 !important;overflow-y:auto !important;overflow-x:hidden !important;overscroll-behavior:contain !important;-webkit-overflow-scrolling:touch;padding:16px 20px 28px !important;position:relative !important;z-index:1 !important}',
    '#cartAddMore,.cart-addmore-slot{flex:0 0 auto !important;position:relative !important;background:#fff !important;z-index:2 !important;border-top:1px solid #E6E0D6;max-width:100%;overflow:hidden !important;max-height:150px !important;flex-shrink:0 !important}',
    '#cartAddMore:empty,.cart-addmore-slot:empty{display:none}',
    '.cart-addmore{margin:0;padding:8px 0 2px;border:0}',
    '.cart-addmore-title{text-align:center;font-size:12px;font-weight:800;margin:0 0 6px;padding:0 16px;color:#1a3a2a}',
    '.cart-addmore-track{display:flex !important;flex-wrap:nowrap !important;gap:6px !important;overflow-x:scroll !important;overflow-y:hidden !important;-webkit-overflow-scrolling:touch;touch-action:pan-x;overscroll-behavior:contain !important;padding:0 16px 8px;scrollbar-width:thin}',
    'body.cart-open{overflow:hidden !important}',
    'body.cart-open .promo-stack,body.cart-open #promoStack{display:none!important;height:0!important;min-height:0!important;max-height:0!important;overflow:hidden!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important;border:0!important}',
    '.cart-header,.cart-footer,#cartProgress{flex:0 0 auto !important}',
    '.cart-header{padding:18px 20px 12px !important;padding-top:max(28px, calc(env(safe-area-inset-top) + 12px)) !important;overflow:visible !important}',
    '.cart-title{font-size:20px !important;font-weight:800 !important;line-height:1.2 !important;padding-top:2px !important}',
    '.cart-note,.cart-footer .cart-note{display:none !important;height:0 !important;margin:0 !important;padding:0 !important;overflow:hidden !important}',
    '.cart-footer{padding:10px 16px 14px !important}',

    /* Yehuda cart footer: hide Subtotal forever; footer perk is the unlock line */
    '.cart-subtotal{display:none !important;height:0 !important;margin:0 !important;padding:0 !important;overflow:hidden !important;border:0 !important}',
    '#cartProgress .cp-unlocked{display:none !important;height:0 !important;margin:0 !important;padding:0 !important;overflow:hidden !important}',
    '.cart-inquiry-perk{display:flex !important;align-items:center !important;gap:10px !important;min-height:44px !important;margin:12px 0 14px !important;padding:12px 14px !important;border-radius:12px !important;background:#F7F1E4 !important;border:1px solid #E2D3B3 !important;color:#7A5520 !important;white-space:nowrap !important;overflow:visible !important;position:relative !important;z-index:3 !important;box-shadow:none !important}',
    '.cart-inquiry-perk-icon{flex:0 0 auto !important;color:#7A5520 !important;display:block !important;width:16px !important;height:16px !important}',
    '.cart-inquiry-perk-text{flex:1 1 auto !important;font-size:14.5px !important;font-weight:600 !important;line-height:1.2 !important;color:#7A5520 !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important}',

    '.cart-footer .btn-continue{margin-top:8px !important}',
    '.cart-drawer{z-index:10050 !important}',
    '.cart-overlay.open,#cartOverlay.open{z-index:10040 !important;display:block !important;opacity:1 !important;pointer-events:auto !important}',
    /* ELITE: 44×44 tap targets for remove / qty inside the drawer (was 28px) */
    '.cart-drawer .ci-remove,.cart-drawer .cart-item-remove,.cart-drawer .ci-qty button,.cart-drawer .ci-qty-btn,.cart-drawer .cart-item-qty button{min-width:44px !important;min-height:44px !important;width:44px !important;height:44px !important;max-height:none !important;flex:0 0 44px !important;box-sizing:border-box !important;padding:0 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important}',
    '.cart-addcard{flex:0 0 88px !important;width:88px !important;min-width:88px !important;max-width:88px !important;box-sizing:border-box !important;background:#f3f7f4 !important;border-radius:14px !important;padding:0 0 8px !important;text-align:center !important;display:flex !important;flex-direction:column !important;align-items:center !important;gap:3px !important;overflow:visible !important}',
    '.cart-addcard a{display:block !important;width:100% !important;line-height:0 !important}',
    '.cart-addcard img,.cart-addmore .cart-addcard img{width:100% !important;height:52px !important;max-width:none !important;max-height:none !important;object-fit:cover !important;object-position:center 38% !important;background:#f3f7f4 !important;border-radius:0 !important}',
    '.cart-addcard-name{font-size:10px !important;font-weight:700 !important;line-height:1.15 !important;color:#1F1F1F !important;min-height:22px;padding:0 4px}',
    '.cart-addcard-price{font-size:12px !important;font-weight:800 !important;color:#2a9a7a !important}',
    '.cart-addcard-btn{background:#fff !important;color:#111 !important;border:1.5px solid #111 !important;border-radius:999px !important;padding:3px 10px !important;font-size:10px !important;font-weight:700 !important;cursor:pointer}',
    '.cart-addmore-row,.cart-addmore-all,.cart-addmore-btn,.cart-addmore-info{display:none !important}',
    /* compact Inquiry rewards while cart open */
    '#cartProgress.on{padding:10px 14px 12px !important}',
    '#cartProgress .cp-msg{font-size:12px !important;margin:0 0 6px !important;line-height:1.25 !important}',
    '#cartProgress .cp-kicker{font-size:10px !important;margin:0 0 2px !important}',
    '#cartProgress .cp-track{height:8px !important;margin:8px 4px 28px !important}',
    '#cartProgress .cp-unlocked{display:block !important;margin:18px 0 0 !important;padding:8px 10px !important;font-size:12.5px !important;font-weight:700 !important;line-height:1.35 !important;border-radius:10px !important;background:#fff !important;border:1px solid #d9cbae !important;position:relative !important;z-index:1 !important;clear:both !important}',
    '.ci-mg{font-weight:600;color:#6b6254;font-size:0.85em}'
  ].join('');
  (document.head || document.documentElement).appendChild(s);
})();

function _readCartLS(){
  try {
    var a = JSON.parse(localStorage.getItem('biolabs_cart')||'null');
    if (Array.isArray(a) && a.length) return a;
    /* an empty array in the main key means the visitor emptied the cart, not that there is no data:
       lifting the legacy mirror here used to put the deleted item straight back (measured 2026-09-07) */
    if (Array.isArray(a)) return a;
    var b = JSON.parse(localStorage.getItem('biofirst_cart')||'null');
    if (Array.isArray(b) && b.length) {
      try { localStorage.setItem('biolabs_cart', JSON.stringify(b)); } catch(e){}
      return b;
    }
    return Array.isArray(a) ? a : (Array.isArray(b) ? b : []);
  } catch(e){ return []; }
}

function _sanitizeCart(c){
  if (!Array.isArray(c)) return [];
  var out = [];
  var sawGift = false;
  c.forEach(function(i){
    if (!i) return;
    var q = parseInt(i.qty, 10);
    if (!isFinite(q) || q <= 0) return; /* drop dead lines — never persist -99 */
    if (i.gift || i.slug === 'research-solvent') {
      if (sawGift) return;
      sawGift = true;
      i.qty = Math.max(1, q); /* Yehuda: BAC may be >1 */
      i.gift = true;
      i.slug = 'research-solvent';
      if (!i.imageUrl || String(i.imageUrl).indexOf('.svg') !== -1) i.imageUrl = '/media/research-solvent.png?v=2';
    } else {
      i.qty = q;
      /* every Add path in the shop ends here, so the strength is recovered in one place instead of six */
      _blrFillMg(i);
    }
    out.push(i);
  });
  return out;
}

/* Catalog for the whole storefront, read once (2026-09-08). Outside the product page nothing knew more about a
   product than its `price`, and in this catalog `price` belongs to the LAST strength while the card shows the
   first one — so a line could carry a price the customer was never shown and no word about which vial to ship.
   Whatever needs a strength asks these three helpers, so the page keeps one request and one answer for all of
   its modules. Until the answer arrives every helper returns null: guessing from stale data is what we fix. */
(function(){
  var BY_SLUG = null;

  function key(mg){ return String(mg == null ? '' : mg).replace(/\s+/g, '').toLowerCase(); }
  function num(v){ var n = parseFloat(v); return isFinite(n) ? n : null; }

  /* the catalog writes strengths as {'10mg':69} and as [{mg:'10mg',price:69}], and the solvent spells
     the same strength '10mL' in `strengths` and '10ml' in the price table */
  function table(src){
    var out = {};
    if (!src) return out;
    if (Array.isArray(src)) {
      src.forEach(function(e){ if (e) out[key(e.mg || e.strength || e.label)] = (e.price !== undefined ? e.price : e.original); });
    } else {
      Object.keys(src).forEach(function(k){ out[key(k)] = src[k]; });
    }
    return out;
  }

  function entry(p, mg){
    if (!p || mg == null || mg === '') return null;
    var price = num(table(p.strength_prices)[key(mg)]);
    var original = num(table(p.strength_originals)[key(mg)]);
    if (price === null) {
      /* One strength and no price table: the product's own price is all anyone ever had, and it can only mean
         that one strength. With several strengths `p.price` belongs to the LAST of them, so answering with it
         would put "5 mg" next to the 10 mg price — the very thing this file was opened to stop. */
      if ((p.strengths || []).length > 1) return null;
      if (key(mg) !== key((p.strengths || [])[0])) return null;
      price = num(p.price);
      original = num(p.original_price);
      if (price === null) return null;
    }
    return { mg: String(mg), price: price, original: original };
  }

  window.blrCatalogProduct = function(slug){
    if (!BY_SLUG || !slug) return null;
    return BY_SLUG[String(slug)] || null;
  };

  window.blrDefaultStrength = function(slug){
    var p = window.blrCatalogProduct(slug);
    var list = p && p.strengths;
    if (!p || !Array.isArray(list) || !list.length) return null;
    return entry(p, list[0]);
  };

  window.blrStrengthByPrice = function(slug, price){
    var p = window.blrCatalogProduct(slug);
    var want = num(price);
    if (!p || want === null) return null;
    var prices = table(p.strength_prices);
    var list = (Array.isArray(p.strengths) && p.strengths.length) ? p.strengths : Object.keys(prices);
    for (var i = 0; i < list.length; i++) {
      var got = num(prices[key(list[i])]);
      if (got !== null && Math.abs(got - want) < 0.005) return entry(p, list[i]);
    }
    return null;
  };

  /* the price of one named strength, for a line that already says which vial it is */
  window.blrStrengthFor = function(slug, mg){
    return entry(window.blrCatalogProduct(slug), mg);
  };

  /* No strength has this exact price. Name the closest one and let the caller keep the price it had: see
     the note over _blrFillMg for why moving the price here would be the expensive mistake. */
  window.blrStrengthNearestPrice = function(slug, price){
    var p = window.blrCatalogProduct(slug);
    var want = num(price);
    if (!p || want === null) return null;
    var list = (Array.isArray(p.strengths) && p.strengths.length) ? p.strengths : Object.keys(table(p.strength_prices));
    var best = null, bestGap = null;
    for (var i = 0; i < list.length; i++) {
      var e = entry(p, list[i]);
      if (!e) continue;
      var gap = Math.abs(e.price - want);
      if (bestGap === null || gap < bestGap) { best = e; bestGap = gap; }
    }
    return best;
  };

  function adopt(items){
    var map = {};
    (items || []).forEach(function(p){ if (p && p.slug) map[String(p.slug)] = p; });
    BY_SLUG = map;
    try { _blrNormalizeStoredCart(); } catch(e){}
  }

  try {
    fetch('/api/products', { credentials: 'same-origin' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){ adopt(Array.isArray(d) ? d : (d && (d.products || d.items)) || []); })
      .catch(function(){});
  } catch(e){}
})();

function _blrPrettyMg(mg){
  return String(mg == null ? '' : mg).replace(/\s+/g, '').replace(/(mcg|mg|ml|g)$/i, ' $1');
}

/* A line that names no strength is an order nobody can pick: the price alone does not say which vial.
   The strength is read back from the price the line already carries. When no strength has that price the
   nearest one is named and the price is LEFT ALONE: the catalog is edited by hand, and on the day a price
   moves every saved line would otherwise stop matching and quietly become the cheapest strength — a 10 mg
   order shipped as 5 mg for half the money, with the server's own price check agreeing. Keeping the price
   the visitor saw means the gap reaches `priceCheck`, which flags `price_mismatch` for staff to look at. */
function _blrFillMg(i){
  if (!i || i.gift || i.slug === 'research-solvent') return;
  var n = parseFloat(i.price);
  if (isFinite(n) && i.price !== n) i.price = n;   /* '125' off a data-attribute is not a price anyone can sum */
  var slug = productSlug(i);
  if (!slug) return;
  if (i.mg) {
    /* it already says which vial; all that can be wrong is the struck-through price beside it */
    var known = (typeof window.blrStrengthFor === 'function') ? window.blrStrengthFor(slug, i.mg) : null;
    if (known && known.original !== null && known.original !== undefined && known.original > i.price) i.original_price = known.original;
    return;
  }
  if (typeof window.blrStrengthByPrice !== 'function') return;
  var s = window.blrStrengthByPrice(slug, i.price);
  if (!s && typeof window.blrStrengthNearestPrice === 'function') s = window.blrStrengthNearestPrice(slug, i.price);
  if (!s) return;
  i.mg = s.mg;
  /* the drawer's struck-through price comes from a hard-coded map of `original_price`, which is the LAST
     strength's: a 5 mg line showed "$34" beside "$85". Carry this strength's own old price with the line. */
  if (s.original !== null && s.original !== undefined && s.original > i.price) i.original_price = s.original;
}

/* The visitor's cart may predate the catalog by weeks, and nothing rewrites it until the next Add:
   stamp it once when the answer is in hand, and only write when something actually changed. */
function _blrNormalizeStoredCart(){
  var c = _readCartLS();
  if (!Array.isArray(c) || !c.length) return;
  var before = JSON.stringify(c);
  var out = _sanitizeCart(c);
  if (JSON.stringify(out) === before) return;
  if (typeof window.saveCart === 'function') {
    try { window.saveCart(out); } catch(e){ _writeCartLS(out); }
  } else {
    _writeCartLS(out);
  }
  /* checkout.html parses the cart once into its own `cart` and sends THAT array with the order. Writing
     storage alone would leave the page ordering the un-stamped copy whenever the catalog answered after
     the page had loaded — the visitor arriving straight on /checkout from an abandoned-cart e-mail. */
  if (typeof cart !== 'undefined' && Array.isArray(cart)) cart = out;
  if (typeof updateBadge === 'function') { try { updateBadge(); } catch(e){} }
  if (typeof renderCart === 'function') { try { renderCart(); } catch(e){} }
  /* on checkout the total lives in renderSummary, and a line whose price just changed must not stay in it */
  if (typeof renderSummary === 'function') { try { renderSummary(); } catch(e){} }
}

/* stage 3: shop events for Customer.io — cart_updated / checkout_started.
   Contract: .scratch/shop-stage3/contract_events.md §3, §4.
   Nothing but reads until localStorage holds a track token: no token, no request. */
var _trackCartTouch = (function(){
  var TOKEN_KEY = 'biolabs_track';    /* written by email-capture.js from /api/subscribe */
  var HASH_KEY  = 'biolabs_track_h';  /* cart already reported */
  var CO_KEY    = 'biolabs_track_co'; /* last checkout_started, ms */
  var CE_KEY    = 'biolabs_track_ce'; /* address already sent to /api/checkout-identify */
  var CART_URL  = 'https://biolabsresearch.co/checkout';
  var DEBOUNCE_MS = 5000;
  var CHECKOUT_EVERY_MS = 1800000;    /* 30 min */
  var MAX_ITEMS = 30;
  var MAX_NAME = 80;
  var POLL_MS = 5000;
  var timer = null;
  var poll = null;        /* checkout only: interval id of the cart-hash poll */
  var pollWired = false;
  var lastIdent = '';     /* address already sent from this page */

  function read(k){ try { return localStorage.getItem(k) || ''; } catch(e){ return ''; } }
  function write(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
  function token(){ var t = read(TOKEN_KEY); return (typeof t === 'string') ? t : ''; }

  /* read the cart back from storage: the page keeps its own copy and may filter it further */
  function payload(){
    var c = _readCartLS();
    if (!Array.isArray(c)) return null;
    var items = [], total = 0, count = 0, i;
    for (i = 0; i < c.length; i++) {
      var it = c[i];
      if (!it) continue;
      var q = parseInt(it.qty, 10);
      if (!isFinite(q) || q <= 0) continue;
      var price = parseFloat(it.price);
      if (!isFinite(price) || price < 0) price = 0;
      total += price * q;
      count += q;
      if (items.length < MAX_ITEMS) {
        var line = { slug: productSlug(it), name: String(it.name || ''), qty: q, price: price };
        if (it.mg) line.mg = String(it.mg);
        items.push(line);
      }
    }
    if (!items.length) return null;
    return { items: items, total: Math.round(total * 100) / 100, item_count: count, cart_url: CART_URL };
  }

  /* djb2 over slug|mg|qty|price of every line: the same cart written again sends nothing */
  function hash(p){
    var s = '', i;
    for (i = 0; i < p.items.length; i++) {
      s += p.items[i].slug + '|' + (p.items[i].mg || '') + '|' + p.items[i].qty + '|' + p.items[i].price + ';';
    }
    s += p.item_count + '|' + p.total;
    var h = 5381;
    for (i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return String(h) + '.' + s.length;
  }

  function send(name, p){
    var t = token();
    if (!t || !p) return;
    try {
      fetch('/api/track', {
        method: 'POST',
        credentials: 'omit',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t, event: name, data: p })
      }).catch(function(){});
    } catch(e){}
  }

  function flush(){
    timer = null;
    report();
  }

  /* cart_updated for whatever is in storage now, unless that cart was reported already */
  function report(){
    var t = token();
    if (!t) return;
    var p = payload();
    if (!p) {
      /* the cart has just been emptied. The server keeps the number of items as a profile
         attribute and the abandonment campaign filters its trigger on it, so an empty cart
         has to be reported once as well — otherwise this person stays "has a cart" for good.
         Only for the person whose cart was reported from this browser, though: HASH_KEY carries the
         tail of the token it was written under, and after a second signup here it belongs to someone
         else, who never had a cart to empty. */
      var seen = read(HASH_KEY);
      if (!seen || seen.slice(-12) !== t.slice(-12)) return;
      p = { items: [], total: 0, item_count: 0, cart_url: CART_URL };
    }
    /* the token is part of the key: after a second signup from the same browser the same cart
       must be reported once more, now under the new person (contract §4) */
    var h = hash(p) + '|' + t.slice(-12);
    if (h === read(HASH_KEY)) return;
    write(HASH_KEY, h);
    send('cart_updated', p);
  }

  /* one event per 5s series. The timer is not restarted on every write on purpose:
     clampGifts() rewrites the cart ~40 times right after load, and a restarting
     debounce would push every event past the moment the visitor clicks away. */
  function touch(){
    if (!token()) return;
    if (timer) return;
    timer = setTimeout(flush, DEBOUNCE_MS);
  }

  function onCheckout(){
    return /\/checkout(\.html)?$/i.test(String(location.pathname || ''));
  }

  function checkoutStarted(){
    if (!token()) return;
    if (!onCheckout()) return;
    var p = payload();
    if (!p) return;
    var now = Date.now();
    var last = parseInt(read(CO_KEY), 10);
    if (isFinite(last) && now >= last && (now - last) < CHECKOUT_EVERY_MS) return;
    write(CO_KEY, String(now));
    send('checkout_started', p);
  }

  /* checkout.html writes localStorage on its own (checkout.html:574, :579), past both
     hooks in this file, so a quantity change there never reaches touch(). Poll the cart
     hash on that page only, and only once a token exists; report() keeps the same dedup. */
  function startPoll(){
    if (poll || !onCheckout() || !token()) return;
    poll = setInterval(report, POLL_MS);
    if (!pollWired) {
      pollWired = true;
      try { window.addEventListener('pagehide', stopPoll); } catch(e){}
    }
  }
  function stopPoll(){
    if (!poll) return;
    clearInterval(poll);
    poll = null;
  }

  /* address typed into the checkout form, contract_events.md §3.1: identify before the
     order is sent, so an abandoned checkout can still be mailed. Nothing blocks the form. */
  function validEmail(e){
    return e.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  /* token is base64url(email) + '.' + hmac — the address it was issued for */
  function tokenEmail(t){
    var head = String(t || '').split('.')[0];
    if (!head) return '';
    try {
      var b = head.replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      return String(atob(b)).trim().toLowerCase();
    } catch(e){ return ''; }
  }

  function emailInput(){
    var el = document.getElementById('email');
    if (el && el.tagName === 'INPUT') return el;
    var all, i;
    try { all = document.querySelectorAll('input[type=email]'); } catch(e){ return null; }
    for (i = 0; i < all.length; i++) {
      if (all[i].offsetParent || all[i].getClientRects().length) return all[i];
    }
    return null;
  }

  function firstNameValue(){
    var el = document.getElementById('firstName');
    var v = (el && el.value) ? String(el.value).trim() : '';
    return v ? v.slice(0, MAX_NAME) : '';
  }

  function identify(email, first, key){
    var b = { email: email, page: String(location.href || '') };
    if (first) b.firstName = first;
    try {
      fetch('/api/checkout-identify', {
        method: 'POST',
        credentials: 'omit',
        keepalive: true,   /* blur often means the visitor is already leaving the field */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b)
      }).then(function(r){
        if (!r || !r.ok) return null;
        /* only once the server has taken the address: after a 500, a dropped connection or a 429 the
           visitor must get another try, and this key outlives the page */
        if (key) write(CE_KEY, key);
        return r.json();
      }).then(function(body){
        var t = body && body.track_token;
        if (typeof t !== 'string' || !t) return;
        write(TOKEN_KEY, t);
        checkoutStarted();  /* skipped on load: there was no token then */
        startPoll();
      }).catch(function(){});
    } catch(e){}
  }

  function maybeIdentify(){
    var el = emailInput();
    if (!el) return;
    var raw = String(el.value || '').trim();
    if (!validEmail(raw)) return;
    var em = raw.toLowerCase();
    if (em === lastIdent || em === read(CE_KEY)) return;
    var t = token();
    if (t && tokenEmail(t) === em) return;   /* this address already has a token */
    lastIdent = em;
    identify(raw, firstNameValue(), em);
  }

  function wireCheckoutEmail(){
    if (!onCheckout()) return;
    var el = emailInput();
    if (!el || el._blTrackWired) return;
    el._blTrackWired = true;
    el.addEventListener('blur', maybeIdentify);
    el.addEventListener('change', maybeIdentify);
  }

  function boot(){
    try { checkoutStarted(); } catch(e){}
    try { wireCheckoutEmail(); } catch(e){}
    try { startPoll(); } catch(e){}
  }

  try {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  } catch(e){}

  return touch;
})();

function _writeCartLS(c){
  c = _sanitizeCart(c);
  try { localStorage.setItem('biolabs_cart', JSON.stringify(c)); } catch(e){}
  try { localStorage.setItem('biofirst_cart', JSON.stringify(c)); } catch(e){}
  try { _trackCartTouch(); } catch(e){}
  return c;
}

function _baseCartName(name){
  return String(name||'').replace(/\s*\([^)]*mg[^)]*\)\s*$/i,'').trim();
}
function _sameCartProduct(item, slug, name){
  if (!item || item.gift) return false;
  if (slug && item.slug && item.slug === slug) return true;
  var a = _baseCartName(item.name).toLowerCase();
  var b = _baseCartName(name).toLowerCase();
  return !!(a && b && a === b);
}
function productSlug(item){
  var slug = (item && item.slug) ? String(item.slug) : '';
  if (!slug && item && item.name) {
    var n = String(item.name).toLowerCase().replace(/\s*\(.*\)\s*$/,'').trim();
    var map = {'bpc-157 / tb-500 blend':'bpc-157-tb-500-blend','bpc-157':'bpc-157','nad+':'nad-plus','aod-9604':'aod-9604','curcumin phytosome':'curcumin-phytosome','tesamorelin / ipamorelin':'tesamorelin-ipamorelin','glow 70':'glow-70','epithalon':'epithalon','ghk-cu':'ghk-cu','mots-c':'mots-c','kpv':'kpv','semax':'semax','kisspeptin-10':'kisspeptin-10','thymosin alpha-1':'thymosin-alpha-1','tb-500':'tb-500','retatrutide':'retatrutide','r3ta':'retatrutide'};
    slug = map[n] || n.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  return slug;
}
function productUrl(item){
  if (item && item.gift) return '#';
  var slug = (typeof item === 'string') ? item : productSlug(item);
  if (!slug || slug==='research-solvent') return '#';
  return '/products/' + slug + '.html';
}
function vialImg(item){
  if (item && (item.gift || item.slug === 'research-solvent')) return '/media/research-solvent.png?v=2';
  var slug = productSlug(item);
  return '/media/vial-'+(slug)+'.png?v=155';
}
var CART_SUGGEST = [
  {slug:'bpc-157', name:'BPC-157', price:89},
  {slug:'tb-500', name:'TB-500', price:99},
  {slug:'bpc-157-tb-500-blend', name:'BPC-157 / TB-500 Blend', price:125},
  {slug:'nad-plus', name:'NAD+', price:99},
  {slug:'ghk-cu', name:'GHK-Cu', price:69},
  {slug:'aod-9604', name:'AOD-9604', price:85},
  {slug:'glow-70', name:'GLOW 70', price:139},
  {slug:'epithalon', name:'Epithalon', price:79},
  {slug:'mots-c', name:'MOTS-c', price:95},
  {slug:'kpv', name:'KPV', price:79},
  {slug:'semax', name:'Semax', price:89},
  {slug:'kisspeptin-10', name:'Kisspeptin-10', price:99},
  {slug:'thymosin-alpha-1', name:'Thymosin Alpha-1', price:109},
  {slug:'tesamorelin-ipamorelin', name:'Tesamorelin / Ipamorelin', price:119},
  {slug:'curcumin-phytosome', name:'Curcumin Phytosome', price:109},
  {slug:'retatrutide', name:'R3TA', price:139}
];
function addMoreHtml(cart){
  cart = cart || [];
  var have = {};
  cart.forEach(function(i){
    have[(i.slug||'')]=1;
    have[_baseCartName(i.name).toLowerCase()]=1;
  });
  var list = CART_SUGGEST.filter(function(p){ return !have[p.slug] && !have[p.name.toLowerCase()]; });
  if (!list.length) return '';
  var html = '<div class="cart-addmore"><div class="cart-addmore-title">Add to this order</div><div class="cart-addmore-track">';
  list.forEach(function(p){
    /* the card printed the catalog's `price`, which here is the LAST strength: the drawer offered "BPC-157 $89"
       and dropped a 10 mg vial in the cart while every other surface showed 5 mg for $44 */
    var d = (typeof window.blrDefaultStrength === 'function') ? window.blrDefaultStrength(p.slug) : null;
    var price = d ? d.price : p.price;
    /* unlike the name and the slug above, this string comes from the API and lands in an onclick attribute:
       a quote in it would end the attribute early. Strengths are digits and letters, so keep only those. */
    var mgSafe = d ? String(d.mg).replace(/[^0-9A-Za-z. ]/g, '') : '';
    var mgArg = mgSafe ? ',\'' + mgSafe + '\'' : '';
    html += '<div class="cart-addcard">' +
      '<a href="/products/' + p.slug + '.html"><img src="/media/vial-' + p.slug + '.png?v=155" alt="' + p.name + '" width="84" height="64"></a>' +
      '<div class="cart-addcard-name">' + p.name + '</div>' +
      '<div class="cart-addcard-price">' + (mgSafe ? _blrPrettyMg(mgSafe) + ' · ' : '') + '$' + price + '</div>' +
      '<button type="button" class="cart-addcard-btn" onclick="addSuggest(\'' + p.slug + '\',\'' + p.name.replace(/'/g,'') + '\',' + price + mgArg + ')">Add to inquiry</button>' +
    '</div>';
  });
  html += '</div></div>';
  return html;
}
function mountAddMore(cart){
  var html = (cart && cart.length && typeof addMoreHtml === 'function') ? addMoreHtml(cart) : '';
  var slot = document.getElementById('cartAddMore');
  if (!slot) {
    var drawer = document.getElementById('cartDrawer');
    var items = document.getElementById('cartItems');
    if (drawer && items) {
      slot = document.createElement('div');
      slot.id = 'cartAddMore';
      slot.className = 'cart-addmore-slot';
      if (items.nextSibling) drawer.insertBefore(slot, items.nextSibling);
      else drawer.appendChild(slot);
    }
  }
  if (slot) {
    slot.innerHTML = html;
    slot.style.display = html ? 'block' : 'none';
  }
  return ''; /* never concatenate into #cartItems */
}

/* sanitize every saveCart / getCart */
(function(){
  var n=0;
  function hook(){
    if (typeof window.saveCart === 'function' && !window.saveCart.__sanitize) {
      var orig = window.saveCart;
      window.saveCart = function(c){
        if (typeof c === 'undefined' && typeof cart !== 'undefined') c = cart;
        c = _sanitizeCart(Array.isArray(c) ? c : []);
        if (typeof cart !== 'undefined') cart = c;
        try { return orig.call(this, c); } catch(e) {
          try { return orig.call(this); } catch(e2){ _writeCartLS(c); }
        } finally {
          /* stage 3: the page's own saveCart writes storage directly, hook it here too */
          try { _trackCartTouch(); } catch(e3){}
        }
      };
      window.saveCart.__sanitize = true;
    }
    if (typeof window.getCart === 'function' && !window.getCart.__sanitize) {
      var og = window.getCart;
      window.getCart = function(){
        var c = [];
        try { c = og.apply(this, arguments) || []; } catch(e){ c = _readCartLS(); }
        c = _sanitizeCart(c);
        if (typeof cart !== 'undefined') cart = c;
        return c;
      };
      window.getCart.__sanitize = true;
    }
    if (++n < 50) setTimeout(hook, 100);
  }
  hook();
})();

function _paintBadgeFromCart(c){
  try {
    var n = (c||[]).reduce(function(a,i){ var q=parseInt(i&&i.qty,10)||0; return a + Math.max(0,q); }, 0);
    var el = document.getElementById('cartCount') || document.querySelector('.cart-count');
    if (el) el.textContent = String(n);
  } catch(e){}
}
function _blrOtherStrengthInCart(slug, mg){
  if (!slug || !mg) return false;
  var c = (typeof getCart === 'function') ? getCart() : _readCartLS();
  if (!Array.isArray(c)) return false;
  var k = String(mg).replace(/\s+/g,'').toLowerCase();
  return c.some(function(i){
    return i && !i.gift && String(i.slug || '') === String(slug) && i.mg &&
      String(i.mg).replace(/\s+/g,'').toLowerCase() !== k;
  });
}
/* two strengths of one compound are two lines: merging them would silently reprice one of them.
   A line written before the catalog was known carries no strength — it still merges, as it always did. */
function _sameCartLine(item, slug, name, mg){
  if (!_sameCartProduct(item, slug, name)) return false;
  if (!mg || !item.mg) return true;
  return String(item.mg).replace(/\s+/g,'').toLowerCase() === String(mg).replace(/\s+/g,'').toLowerCase();
}
/* `mg` is optional on purpose: the generator's pages and older copies of the drawer still call this with three
   arguments, and that call has to keep working exactly as before. */
function addSuggest(slug, name, price, mg){
  name = _baseCartName(name) || name;
  var _p = parseFloat(price);
  if (isFinite(_p)) price = _p;
  if (typeof getCart === 'function') {
    var c = getCart();
    var ex = c.find(function(i){ return _sameCartLine(i, slug, name, mg); });
    if (ex) { ex.qty += 1; ex.name = _baseCartName(ex.name) || name; if (slug) ex.slug = slug; if (mg && !ex.mg) ex.mg = mg; }
    else c.push({name:name, price:price, qty:1, slug:slug, mg:(mg || undefined), imageUrl:'/media/vial-'+(slug)+'.png?v=155'});
    if (typeof saveCart === 'function') {
      try { saveCart(c); } catch (e) { try { saveCart(); } catch(e2){} }
    } else {
      _writeCartLS(c);
    }
    if (typeof updateBadge === 'function') updateBadge();
    else _paintBadgeFromCart(c);
    if (typeof renderCart === 'function') renderCart();
    if (typeof renderSummary === 'function') renderSummary();
    return;
  }
  if (typeof cart !== 'undefined') {
    var ex2 = cart.find(function(i){ return _sameCartLine(i, slug, name, mg); });
    if (ex2) { ex2.qty += 1; ex2.name = _baseCartName(ex2.name) || name; if (slug) ex2.slug = slug; if (mg && !ex2.mg) ex2.mg = mg; }
    else cart.push({name:name, price:price, qty:1, slug:slug, mg:(mg || undefined), imageUrl:'/media/vial-'+(slug)+'.png?v=155'});
    if (typeof saveCart === 'function') saveCart();
    else _writeCartLS(cart);
    if (typeof updateBadge === 'function') updateBadge();
    else _paintBadgeFromCart(cart);
    if (typeof renderCart === 'function') renderCart();
    if (typeof renderSummary === 'function') renderSummary();
  }
}

/* Two strengths of one compound are now two cart lines wherever the shop offers them, and the drawer's own
   updateQty(name, delta) picks the FIRST line with that name: minus on the 10 mg row moved the 5 mg row, and
   the cross removed the wrong vial. The name cannot tell them apart — the row that was clicked can, because
   the drawer prints one .cart-item per line in cart order. Only the ambiguous case is taken over; with one
   line of that name the page's own function runs untouched, exactly as before. */
(function(){
  var lastRow = null;
  document.addEventListener('click', function(e){
    var t = e.target;
    lastRow = (t && t.closest) ? t.closest('#cartItems .cart-item') : null;
  }, true);

  function rowIndex(){
    if (!lastRow || !lastRow.parentNode) return -1;
    var rows = lastRow.parentNode.querySelectorAll(':scope > .cart-item');
    for (var i = 0; i < rows.length; i++) if (rows[i] === lastRow) return i;
    return -1;
  }

  function twins(c, name){
    var base = _baseCartName(name).toLowerCase();
    var n = 0;
    for (var i = 0; i < c.length; i++) {
      var it = c[i];
      if (it && !it.gift && _baseCartName(it.name).toLowerCase() === base) n++;
    }
    return n;
  }

  function apply(idx, delta){
    var c = (typeof getCart === 'function') ? getCart() : _readCartLS();
    if (!Array.isArray(c)) return false;
    var item = c[idx];
    if (!item) return false;
    if (item.gift || item.slug === 'research-solvent') { item.qty = 1; }
    else {
      var d = parseInt(delta, 10) || 0;
      var q = parseInt(item.qty, 10) || 0;
      if (d <= -99 || q + d <= 0) c = c.filter(function(x){ return x !== item; });
      else item.qty = q + d;
    }
    c = c.filter(function(x){ return x && (parseInt(x.qty, 10) || 0) > 0; });
    if (typeof saveCart === 'function') { try { saveCart(c); } catch(e){ _writeCartLS(c); } }
    else _writeCartLS(c);
    if (typeof cart !== 'undefined' && Array.isArray(cart)) cart = c;
    if (typeof updateBadge === 'function') { try { updateBadge(); } catch(e){} }
    if (typeof renderCart === 'function') { try { renderCart(); } catch(e){} }
    if (typeof renderSummary === 'function') { try { renderSummary(); } catch(e){} }
    return true;
  }

  var tries = 0;
  function hook(){
    var fn = window.updateQty;
    if (typeof fn === 'function' && !fn.__blrRowAware) {
      var orig = fn;
      var wrapped = function(name, delta){
        try {
          var c = (typeof getCart === 'function') ? getCart() : _readCartLS();
          if (Array.isArray(c) && twins(c, name) > 1) {
            var idx = rowIndex();
            /* the row must still hold the line the click was about */
            if (idx >= 0 && c[idx] && _baseCartName(c[idx].name).toLowerCase() === _baseCartName(name).toLowerCase()) {
              if (apply(idx, delta)) return;
            }
          }
        } catch(e){}
        return orig.apply(this, arguments);
      };
      wrapped.__blrRowAware = 1;
      window.updateQty = wrapped;
    }
    if (++tries < 60) setTimeout(hook, 100);
  }
  hook();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
})();

/* gold cart burst: short on every Add, big at 2 and 3 unique lines. no VIP copy. */
(function(){
  var lastX = 0, lastY = 0;
  document.addEventListener('click', function(e){
    lastX = e.clientX; lastY = e.clientY;
  }, true);

  function lines(){
    try {
      if (typeof cart !== 'undefined' && Array.isArray(cart)) return cart.length;
      var c = _readCartLS();
      return Array.isArray(c) ? c.length : 0;
    } catch (e) { return 0; }
  }

  function layer(){
    var el = document.getElementById('cartBurstLayer');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'cartBurstLayer';
    el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden';
    document.body.appendChild(el);
    return el;
  }

  function spark(x, y, big){
    var n = big ? 36 : 14;
    var hold = layer();
    var originX = x || (window.innerWidth - 48);
    var originY = y || 28;
    if (!x && lastX) { originX = lastX; originY = lastY; }
    for (var i = 0; i < n; i++){
      var d = document.createElement('span');
      var ang = (Math.PI * 2 * i) / n + (Math.random() * 0.4);
      var dist = (big ? 90 : 46) + Math.random() * (big ? 80 : 36);
      var size = (big ? 7 : 5) + Math.random() * (big ? 7 : 4);
      d.style.cssText = 'position:absolute;left:'+originX+'px;top:'+originY+'px;width:'+size+'px;height:'+size+'px;margin:'+(-size/2)+'px 0 0 '+(-size/2)+'px;border-radius:50%;background:#F2D191;box-shadow:0 0 10px rgba(242,209,145,.9);opacity:1;transform:translate(0,0) scale(1);transition:transform .55s cubic-bezier(.12,.7,.22,1),opacity .55s linear';
      hold.appendChild(d);
      (function(node, dx, dy, delay){
        setTimeout(function(){
          node.style.transform = 'translate('+dx+'px,'+dy+'px) scale(0.2)';
          node.style.opacity = '0';
        }, delay);
        setTimeout(function(){ if (node.parentNode) node.parentNode.removeChild(node); }, 700 + delay);
      })(d, Math.cos(ang)*dist, Math.sin(ang)*dist, i % 3 * 20);
    }
    if (big){
      var ring = document.createElement('span');
      ring.style.cssText = 'position:absolute;left:'+originX+'px;top:'+originY+'px;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid #F2D191;border-radius:50%;opacity:.95;transform:scale(.4);transition:transform .6s ease-out,opacity .6s linear';
      hold.appendChild(ring);
      setTimeout(function(){ ring.style.transform='scale(7)'; ring.style.opacity='0'; }, 20);
      setTimeout(function(){ if (ring.parentNode) ring.parentNode.removeChild(ring); }, 720);
    }
  }

  window.cartGoldBurst = function(kind){
    spark(lastX, lastY, kind === 'big');
  };

  function afterAdd(before){
    var n = lines();
    var big = (n === 2 && before < 2) || (n === 3 && before < 3);
    spark(lastX, lastY, big);
  }

  function wrap(name){
    var fn = window[name];
    if (typeof fn !== 'function' || fn.__goldBurst) return false;
    var orig = fn;
    var wrapped = function(){
      var before = lines();
      var delta = (name === 'updateQty' && arguments.length > 1) ? arguments[1] : 1;
      var r = orig.apply(this, arguments);
      if (name === 'updateQty' && delta <= 0) return r;
      afterAdd(before);
      return r;
    };
    wrapped.__goldBurst = true;
    window[name] = wrapped;
    return true;
  }

  var tries = 0;
  function hook(){
    wrap('addToCart');
    wrap('addToCartTemplate');
    wrap('addSuggest');
    wrap('updateQty');
    tries++;
    if (tries < 40) setTimeout(hook, 120);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();

/* cart volume progress — $100 / $250 / $375 / $500, Marketing copy, no Fluid */
(function(){
  var TIERS = [
    { at: 100, prize: '5% off this inquiry + research solvent' },
    { at: 250, prize: '10% off this inquiry' },
    { at: 375, prize: 'Priority cold-chain packing' },
    { at: 500, prize: '15% off this inquiry' }
  ];
  var lastTier = -1;

  var GIFT = {id:'17',name:'Research solvent (BAC water)',price:0,qty:1,slug:'research-solvent',gift:true,mg:'10mL',badge:'Gift',note:'Laboratory use only',imageUrl:'/media/research-solvent.png?v=2'};
  var giftLock = false;
  function readCart(){
    try {
      if (typeof cart !== 'undefined' && Array.isArray(cart) && cart.length) return cart.slice();
      var ls = _readCartLS();
      return Array.isArray(ls) ? ls : [];
    } catch(e){ return []; }
  }
  function syncGifts(){
    window.__syncGifts = syncGifts;
    if (giftLock) return;
    var c = readCart();
    var merch = 0;
    c.forEach(function(i){ if(!i.gift) merch += (parseFloat(i.price)||0)*(i.qty||1); });
    var has = c.some(function(i){ return i.slug==='research-solvent' || i.gift; });
    var want = merch >= 100;
    if (want === has) return;
    giftLock = true;
    if (want) { var g=Object.assign({},GIFT,{qty:1}); c=c.filter(function(i){return !(i.gift||i.slug==='research-solvent');}); c.push(g); }
    else c = c.filter(function(i){ return !(i.gift || i.slug==='research-solvent'); });
    /* assign memory FIRST so any re-entrant renderCart sees the synced gift state */
    if (typeof cart !== 'undefined') cart = c;
    try { _writeCartLS(c); } catch(e){}
    if (typeof saveCart === 'function') {
      try { saveCart(c); } catch(e) { try { saveCart(); } catch(e2){} }
    }
    giftLock = false;
  }

  function css(){
    if (document.getElementById('cart-progress-css')) return;
    var s = document.createElement('style');
    s.id = 'cart-progress-css';
    s.textContent = [
      '#cartProgress{display:none;margin:0;padding:10px 14px 18px;background:linear-gradient(180deg,#FBF6EA 0%,#F4EFE4 100%);border-bottom:1px solid #eadfca;flex:0 0 auto;overflow:visible}',
      '#cartProgress.on{display:block}',
      '.cp-kicker{font-size:10px;font-weight:800;letter-spacing:.12em;color:#0d2137;margin:0 0 2px;text-transform:uppercase}',
      '.cp-msg{font-size:12px;font-weight:700;color:#0d2137;line-height:1.25;margin:0 0 6px}',
      '.cp-msg em{font-style:normal;color:#9A6D2A}',
      '.cp-track{position:relative;height:8px;border-radius:999px;background:#e6dcc8;overflow:visible;margin:8px 4px 28px}',
      '.cp-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#E8C57A,#F2D191 40%,#C9A46A);width:0;transition:width .45s cubic-bezier(.2,.7,.2,1);box-shadow:0 0 12px rgba(242,209,145,.55)}',
      '.cp-ticks{position:absolute;inset:0;pointer-events:none}',
      '.cp-tick{position:absolute;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#fff;border:2px solid #c9b48a;box-sizing:border-box;transition:background .2s,border-color .2s,transform .2s}',
      '.cp-tick.on{background:#0d2137;border-color:#0d2137;transform:scale(1.08)}',
      '.cp-tick .lbl{position:absolute;top:16px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:#6b6254;white-space:nowrap}',
      '.cp-tick.on .lbl{color:#0d2137}',
      '.cp-unlocked{margin:18px 0 0;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid #d9cbae;font-size:12.5px;font-weight:700;line-height:1.35;color:#0d2137;clear:both;position:relative;z-index:1}',
      '.cp-unlocked span{display:block;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9A6D2A;margin:0 0 2px}'
    ].join('');
    (document.head||document.documentElement).appendChild(s);
  }

  function cartTotal(){
    var c = [];
    try {
      if (typeof cart !== 'undefined' && Array.isArray(cart)) c = cart;
      else c = _readCartLS();
    } catch(e){ c = []; }
    return c.reduce(function(a,i){ if(i&&i.gift) return a; return a + (parseFloat(i.price)||0) * (i.qty||1); }, 0);
  }

  function state(total){
    var unlocked = null, next = null, idx = -1;
    for (var i=0;i<TIERS.length;i++){
      if (total >= TIERS[i].at){ unlocked = TIERS[i]; idx = i; }
      else { next = TIERS[i]; break; }
    }
    var pct = Math.min(100, (total / 500) * 100);
    var msg;
    if (next){
      var need = Math.max(0, Math.ceil(next.at - total));
      msg = 'Add $' + need + ' more for ' + next.prize;
    } else {
      msg = '15% off this inquiry unlocked';
    }
    return { total: total, pct: pct, unlocked: unlocked, next: next, idx: idx, msg: msg };
  }

  function ensure(){
    var drawer = document.getElementById('cartDrawer');
    if (!drawer) return null;
    var el = document.getElementById('cartProgress');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'cartProgress';
    var header = drawer.querySelector('.cart-header');
    if (header && header.nextSibling) drawer.insertBefore(el, header.nextSibling);
    else drawer.insertBefore(el, drawer.firstChild);
    return el;
  }

  function paint(){
    syncGifts();
    css();
    var el = ensure();
    if (!el) return;
    var st = state(cartTotal());
    if (st.total <= 0){
      el.className = '';
      el.innerHTML = '';
      lastTier = -1;
      try { localStorage.removeItem('biofirst_volume'); } catch(e){}
      return;
    }
    el.className = 'on';
    var ticks = TIERS.map(function(t,i){
      var left = (t.at / 500) * 100;
      return '<span class="cp-tick'+(st.total>=t.at?' on':'')+'" style="left:'+left+'%"><span class="lbl">$'+t.at+'</span></span>';
    }).join('');
    var unlockedLine = '';
    if (st.unlocked){
      unlockedLine = ''; /* footer perk owns unlock copy */
    }
    el.innerHTML =
      '<p class="cp-kicker">Inquiry rewards</p>'+
      '<p class="cp-msg">'+st.msg.replace(/(\$\d+)/g,'<em>$1</em>')+'</p>'+
      '<div class="cp-track"><div class="cp-fill" style="width:'+st.pct+'%"></div><div class="cp-ticks">'+ticks+'</div></div>'+
      unlockedLine;
    try {
      localStorage.setItem('biofirst_volume', JSON.stringify({
        total: Math.round(st.total*100)/100,
        prize: st.unlocked ? st.unlocked.prize : null,
        at: st.unlocked ? st.unlocked.at : 0
      }));
    } catch(e){}
    if (st.idx > lastTier && lastTier !== -1 && window.cartGoldBurst){
      window.cartGoldBurst('big');
    }
    lastTier = st.idx;
  }

  function wrapRender(){
    if (typeof renderCart === 'function' && !renderCart.__progress){
      var orig = renderCart;
      var wrapped = function(){
        var r = orig.apply(this, arguments);
        paint();
        return r;
      };
      wrapped.__progress = true;
      window.renderCart = wrapped;
    }
    paint();
  }
  var n = 0;
  function hook(){
    wrapRender();
    n++;
    if (n < 40) setTimeout(hook, 120);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();


/* paint cart badge on every page; legal pages have no drawer so cart goes to checkout */
(function(){
  function qty(){
    try {
      var c = _readCartLS();
      return (c||[]).reduce(function(a,i){ var q=parseInt(i&&i.qty,10)||0; return a + Math.max(0,q); }, 0);
    } catch(e){ return 0; }
  }
  function paint(){
    var el = document.getElementById('cartCount');
    if (el) el.textContent = String(qty());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
  window.addEventListener('storage', paint);
  if (typeof window.toggleCart !== 'function') {
    window.toggleCart = function(){ window.location.href = '/checkout'; };
  }
  window.toggleMenu = function toggleMenu(){
  var m = document.getElementById('navMenu');
  var o = document.getElementById('navOverlay');
  if (!m && !o) return;
  var open = m ? !m.classList.contains('open') : (o ? !o.classList.contains('open') : false);
  if (m) m.classList.toggle('open', open);
  if (o) o.classList.toggle('open', open);
  try { document.body.style.overflow = open ? 'hidden' : ''; } catch(e){}
};
})();

/* delegated Add — works on SSR cards + API cards, mobile safe */
(function(){
  if (window.__atcDelegated) return;
  window.__atcDelegated = true;
  document.addEventListener('click', function(e){
    var btn = e.target && e.target.closest && e.target.closest('.product-card-atc');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var name = btn.getAttribute('data-name') || '';
    var price = btn.getAttribute('data-price') || '0';
    var img = btn.getAttribute('data-img') || '';
    var slug = btn.getAttribute('data-slug') || '';
    var mg = btn.getAttribute('data-mg') || '';
    /* the page's addToCart matches a line by slug alone: adding 10 mg on top of a 5 mg line kept one line at
       the 5 mg price and the second vial disappeared. Only that collision is taken over here — the drawer is
       opened the same way afterwards; every other Add stays with the page's own function. */
    if (mg && _blrOtherStrengthInCart(slug, mg)) {
      addSuggest(slug, name, price, mg);
      var d = document.getElementById('cartDrawer');
      if (d && !d.classList.contains('open') && typeof window.toggleCart === 'function') window.toggleCart();
      return;
    }
    if (typeof window.addToCart === 'function') {
      window.addToCart(name, price, img, slug);
    }
  }, false);
})();

/* ELITE: click overlay/backdrop (outside the drawer panel) closes cart. X already works.
   Close-only so an existing inline onclick="toggleCart()" cannot double-toggle the drawer back open. */
(function(){
  if (window.__cartOverlayCloseWired) return;
  window.__cartOverlayCloseWired = true;
  function isOverlay(el){
    if (!el) return false;
    if (el.id === 'cartOverlay') return true;
    return !!(el.classList && el.classList.contains('cart-overlay'));
  }
  function closeCart(){
    var d = document.getElementById('cartDrawer');
    var o = document.getElementById('cartOverlay') || document.querySelector('.cart-overlay');
    if (d && d.classList.contains('open')) d.classList.remove('open');
    if (o && o.classList.contains('open')) o.classList.remove('open');
    try {
      document.body.classList.remove('cart-open');
      document.body.style.overflow = '';
    } catch(e){}
  }
  function onOverlayClick(e){
    var t = e.target;
    if (!isOverlay(t)) return;
    e.preventDefault();
    e.stopPropagation();
    closeCart();
  }
  function bindOverlay(el){
    if (!el || el.__cartOverlayClose) return;
    el.__cartOverlayClose = true;
    try { el.onclick = null; } catch(e){}
    el.removeAttribute('onclick');
    el.addEventListener('click', onOverlayClick, true);
  }
  function wire(){
    bindOverlay(document.getElementById('cartOverlay'));
    var all = document.querySelectorAll('.cart-overlay');
    for (var i = 0; i < all.length; i++) bindOverlay(all[i]);
  }
  document.addEventListener('click', onOverlayClick, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
  var n = 0;
  (function tick(){ wire(); if (++n < 40) setTimeout(tick, 100); })();
})();

/* ELITE P0: lock body scroll while cart open + hide promo ticker */
(function(){
  function setPromoHidden(hide){
    var nodes = document.querySelectorAll('.promo-stack, #promoStack');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (hide) {
        el.setAttribute('data-cart-hidden', '1');
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('height', '0', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      } else if (el.getAttribute('data-cart-hidden') === '1') {
        el.removeAttribute('data-cart-hidden');
        el.style.removeProperty('display');
        el.style.removeProperty('height');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
        el.style.removeProperty('pointer-events');
      }
    }
  }
  function syncBody(){
    if (!document.body) return;
    var d = document.getElementById('cartDrawer');
    var open = !!(d && d.classList.contains('open'));
    document.body.classList.toggle('cart-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    setPromoHidden(open);
  }
  function wrapToggle(){
    if (typeof window.toggleCart !== 'function' || window.toggleCart.__bodyLock) return false;
    var orig = window.toggleCart;
    window.toggleCart = function(){
      var r = orig.apply(this, arguments);
      syncBody();
      return r;
    };
    window.toggleCart.__bodyLock = true;
    return true;
  }
  function watchDrawer(){
    var d = document.getElementById('cartDrawer');
    if (!d || d.__promoHideObs) return !!d;
    var obs = new MutationObserver(function(){ syncBody(); });
    obs.observe(d, { attributes: true, attributeFilter: ['class'] });
    d.__promoHideObs = true;
    return true;
  }
  var n=0; (function hook(){
    wrapToggle();
    watchDrawer();
    syncBody();
    if(++n<80) setTimeout(hook,100);
  })();
})();

/* Gift solvent: force qty 1, block +/- */
(function(){
    function clampGifts(){
    try {
      if (typeof cart === 'undefined' || !Array.isArray(cart)) {
        var ls = _sanitizeCart(_readCartLS());
        _writeCartLS(ls);
        return;
      }
      cart = _sanitizeCart(cart);
      var merch = 0;
      cart.forEach(function(i){ if(!i.gift && i.slug!=='research-solvent') merch += (parseFloat(i.price)||0)*(i.qty||1); });
      var has = cart.some(function(i){ return i.gift || i.slug==='research-solvent'; });
      if (merch >= 100 && !has) {
        cart.push(Object.assign({}, {id:'17',name:'Research solvent (BAC water)',price:0,qty:1,slug:'research-solvent',gift:true,mg:'10mL',badge:'Gift',note:'Laboratory use only',imageUrl:'/media/research-solvent.png?v=2'}));
      }
      if (merch < 100 && has) {
        cart = cart.filter(function(i){ return !(i.gift || i.slug==='research-solvent'); });
      }
      cart.forEach(function(i){
        if (i && (i.gift || i.slug==='research-solvent')) {
          var q = parseInt(i.qty,10); if (!isFinite(q) || q < 1) i.qty = 1; else i.qty = q;
          if (!i.imageUrl || String(i.imageUrl).indexOf('.svg')!==-1) i.imageUrl='/media/research-solvent.png?v=2';
        }
      });
      if (typeof saveCart === 'function') {
        try { saveCart(cart); } catch(e) { try { saveCart(); } catch(e2){} }
      } else {
        _writeCartLS(cart);
      }
    } catch(e){}
  }
  function wrapUpdate(){
    if (typeof window.updateQty !== 'function' || window.updateQty.__giftQtyLock) return false;
    var orig = window.updateQty;
    window.updateQty = function(name, delta){
      try {
        var d = parseInt(delta, 10);
        if (!isFinite(d)) d = 0;
        var item = null;
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
          item = cart.find(function(i){
            return i && (i.gift || i.slug==='research-solvent') && (
              i.name===name || (typeof _sameCartProduct==='function' && _sameCartProduct(i, 'research-solvent', name))
            );
          });
        }
        if (item) {
          if (d <= -99) {
            item.qty = Math.max(0, (parseInt(item.qty,10)||1) - 1);
            if (item.qty <= 0) cart = cart.filter(function(i){ return i !== item; });
            cart = _sanitizeCart(cart);
            if (typeof saveCart === 'function') { try { saveCart(cart); } catch(e){} }
            else { _writeCartLS(cart); }
            clampGifts();
            if (typeof renderCart === 'function') renderCart();
            return;
          }
          if (d > 0) {
            item.qty = (parseInt(item.qty,10)||1) + d;
            if (typeof saveCart === 'function') { try { saveCart(_sanitizeCart(cart)); } catch(e){} }
            else { _writeCartLS(cart); }
            if (typeof renderCart === 'function') renderCart();
            return;
          }
          item.qty = Math.max(0, (parseInt(item.qty,10)||1) + d);
          if (item.qty <= 0) cart = cart.filter(function(i){ return i !== item; });
          cart = _sanitizeCart(cart);
          if (typeof saveCart === 'function') { try { saveCart(cart); } catch(e){} }
          else { _writeCartLS(cart); }
          clampGifts();
          if (typeof renderCart === 'function') renderCart();
          return;
        }
        /* never apply -99 as arithmetic into storage without sanitize after */
      } catch(e){}
      var r = orig.apply(this, arguments);
      try {
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
          cart = _sanitizeCart(cart);
          if (typeof saveCart === 'function') { try { saveCart(cart); } catch(e){ _writeCartLS(cart); } }
          else _writeCartLS(cart);
        } else {
          _writeCartLS(_sanitizeCart(_readCartLS()));
        }
      } catch(e2){}
      clampGifts();
      return r;
    };
    window.updateQty.__giftQtyLock = true;
    return true;
  }
  function wrapRender(){
    if (typeof window.renderCart !== 'function' || window.renderCart.__giftQtyLock) return false;
    var orig = window.renderCart;
    window.renderCart = function(){
      clampGifts();
      return orig.apply(this, arguments);
    };
    window.renderCart.__giftQtyLock = true;
    return true;
  }
  var n=0; (function hook(){ wrapUpdate(); wrapRender(); clampGifts(); if(++n<40) setTimeout(hook,120); })();
})();

/* ELITE: syncGifts before every renderCart so BAC drops immediately under $100 */
(function(){
  function runSync(){
    try {
      if (typeof window.__syncGifts === 'function') window.__syncGifts();
      else if (typeof syncGifts === 'function') syncGifts();
    } catch(e){}
  }
  var n=0;
  function hook(){
    if (typeof window.renderCart === 'function' && !window.renderCart.__syncGiftsFirst) {
      var orig = window.renderCart;
      window.renderCart = function(){
        runSync();
        if (typeof cart !== 'undefined' && Array.isArray(cart) && typeof _sanitizeCart === 'function') {
          cart = _sanitizeCart(cart);
        }
        return orig.apply(this, arguments);
      };
      window.renderCart.__syncGiftsFirst = true;
    }
    if (++n < 60) setTimeout(hook, 80);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();


/* CRM: gift lock also wraps updateQtyByIndex */
(function(){
  function wrapIdx(){
    if (typeof window.updateQtyByIndex !== 'function' || window.updateQtyByIndex.__giftQtyLock) return false;
    var orig = window.updateQtyByIndex;
    window.updateQtyByIndex = function(idx, delta){
      return orig.apply(this, arguments);
    };
    window.updateQtyByIndex.__giftQtyLock = true;
    return true;
  }
  var n=0; (function hook(){ wrapIdx(); if(++n<50) setTimeout(hook,100); })();
})();

/* Coupon on the checkout page (2026-09-07): the field has no Apply button, and the page cannot say what a code does —
   the discount is worked out by products-api (coupon table and volume ladder both live there). This asks the server
   and prints its answer under the field. No rule is repeated here on purpose: the percentage, the amount and the
   wording all come from the response, so a new code or a changed tier needs no second edit in the browser.
   The Apply button itself is the generator's job; this is dressing over it, like the cart repair above. */
(function(){
  var API = '/api/coupon-quote';
  var DEBOUNCE_MS = 500;
  var field = null, note = null, wrapped = false, timer = null, seq = 0, lastSent = '';

  function items(){
    var c = (typeof cart !== 'undefined' && Array.isArray(cart)) ? cart : _readCartLS();
    if (!Array.isArray(c)) return [];
    return c.slice(0, 50).map(function(i){
      return { slug: (i && i.slug) || undefined, name: (i && i.name) || undefined, mg: (i && i.mg) || undefined,
               qty: parseInt(i && i.qty, 10) || 1, price: Number(i && i.price) || 0 };
    });
  }
  function shipping(){
    try { if (typeof getShippingCost === 'function') return Number(getShippingCost()) || 0; } catch(e){}
    return 0;
  }
  function line(){
    if (note && note.parentNode) return note;
    /* the page now ships its own #couponNote next to the Apply button; creating a second one would leave the
       answer in a node nobody styled and, on a page with both, print it twice */
    var own = document.getElementById('couponNote');
    if (own) {
      note = own;
      if (!note.getAttribute('aria-live')) note.setAttribute('aria-live', 'polite');
      return note;
    }
    if (!field) return null;
    note = document.createElement('div');
    note.id = 'couponNote';
    note.setAttribute('aria-live', 'polite');
    note.style.cssText = 'margin-top:6px;font-size:12px;line-height:1.5;min-height:16px';
    (field.parentNode || field).appendChild(note);
    return note;
  }
  function show(text, tone){
    var el = line();
    if (!el) return;
    el.textContent = text || '';
    el.style.color = tone === 'ok' ? '#1d5c3a' : (tone === 'bad' ? '#8a4b2a' : '#4a6358');
  }
  function render(q){
    if (!q || q.ok !== true) { show('Could not check the code right now.', 'muted'); return; }
    /* the server could not price every line, or its figure disagrees with the cart the page shows:
       the amount it returns would be a promise nobody can keep, so we name no amount at all */
    if ((q.unknown_items && q.unknown_items.length) || q.price_mismatch === true) {
      show('Your total will be confirmed by our team.', 'muted'); return;
    }
    var byCode = String(q.discount_source || '').indexOf('coupon:') === 0;
    if (byCode) { show('Code applied — ' + q.discount_pct + '% off. Due $' + q.total_due + '.', 'ok'); return; }
    /* recognised, but the code gives nothing here — a bigger volume discount, or nothing to discount */
    if (q.recognized) {
      if (Number(q.discount_pct) > 0) { show('Volume discount ' + q.discount_pct + '% applies — due $' + q.total_due + '.', 'ok'); return; }
      show('This code gives nothing on this cart.', 'bad'); return;
    }
    /* the ladder can still be running: saying only "not recognised" would contradict the total the customer pays */
    if (Number(q.discount_pct) > 0) { show('Code not recognised. Volume discount ' + q.discount_pct + '% applies — due $' + q.total_due + '.', 'bad'); return; }
    show('Code not recognised.', 'bad');
  }
  function ask(){
    if (!field) return;
    var code = String(field.value || '').trim();
    var list = items();
    if (!code || !list.length) { show('', 'muted'); lastSent = ''; return; }
    var body = JSON.stringify({ coupon: code.slice(0, 40), items: list, shippingCost: shipping() });
    if (body === lastSent) return;              /* same question, same answer: do not ask twice */
    lastSent = body;
    var mine = ++seq;
    show('Checking…', 'muted');
    try {
      fetch(API, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: body })
        .then(function(r){ return r.json().catch(function(){ return null; }); })
        .then(function(j){ if (!j || j.ok !== true) lastSent = ''; if (mine === seq) render(j); })
        .catch(function(){ if (mine === seq) { lastSent = ''; show('Could not check the code right now.', 'muted'); } });
    } catch(e){ lastSent = ''; show('Could not check the code right now.', 'muted'); }
  }
  function schedule(){ clearTimeout(timer); timer = setTimeout(ask, DEBOUNCE_MS); }
  /* Apply means "answer me now": the half-second wait and the "same question, same answer" guard both make
     a press look ignored, and the visitor presses again. Delegated because the button belongs to the page —
     it may be rendered after this file runs, and on most pages it is not there at all. */
  function applyNow(){
    clearTimeout(timer);
    lastSent = '';
    if (!field) wire();
    ask();
  }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('#applyCoupon');
    if (!b) return;
    if (e.preventDefault) e.preventDefault();
    applyNow();
  }, false);

  function wire(){
    if (!field) {
      field = document.getElementById('couponCode');
      if (field) {
        field.addEventListener('input', function(){ lastSent = ''; schedule(); });
        field.addEventListener('change', function(){ lastSent = ''; schedule(); });
        schedule();                              /* the field may already hold a code from localStorage */
      }
    }
    /* cart edits and the shipping radios both go through the page's renderSummary — recount after it */
    if (!wrapped && typeof window.renderSummary === 'function') {
      if (window.renderSummary.__couponQuote) { wrapped = true; }
      else {
        var orig = window.renderSummary;
        var w = function(){ var r = orig.apply(this, arguments); try { schedule(); } catch(e){} return r; };
        w.__couponQuote = true;
        window.renderSummary = w;
        wrapped = true;
      }
    }
    return !!field && wrapped;
  }
  if (document.getElementById('couponCode') || document.readyState !== 'loading') wire();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  var n = 0;
  (function tick(){ if (!wire() && ++n < 60) setTimeout(tick, 100); })();
})();


/* a11y wave1 2026-09-08: cart drawer Escape + dialog + focus */
(function(){
  if (window.__cartA11yWave1) return;
  window.__cartA11yWave1 = true;
  var lastFocus = null;

  function drawer(){ return document.getElementById('cartDrawer'); }
  function overlay(){ return document.getElementById('cartOverlay') || document.querySelector('.cart-overlay'); }
  function isOpen(){
    var d = drawer();
    return !!(d && d.classList.contains('open'));
  }
  function closeBtn(d){
    return (d && (d.querySelector('.cart-close') || d.querySelector('[data-cart-close]'))) || null;
  }
  function ensureDialogAttrs(){
    var d = drawer();
    if (!d) return;
    if (!d.getAttribute('role')) d.setAttribute('role', 'dialog');
    if (!d.getAttribute('aria-modal')) d.setAttribute('aria-modal', 'true');
    if (!d.getAttribute('aria-label') && !d.getAttribute('aria-labelledby')) {
      d.setAttribute('aria-label', 'Shopping cart');
    }
    var btn = closeBtn(d);
    if (btn) {
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Close cart');
      if (!btn.getAttribute('type')) btn.setAttribute('type', 'button');
    }
  }
  function closeCartOnly(){
    var d = drawer();
    var o = overlay();
    if (d && d.classList.contains('open')) d.classList.remove('open');
    if (o && o.classList.contains('open')) o.classList.remove('open');
    try {
      document.body.classList.remove('cart-open');
      document.body.style.overflow = '';
    } catch(e){}
    try {
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    } catch(e){}
  }
  function onOpen(){
    ensureDialogAttrs();
    try { lastFocus = document.activeElement; } catch(e){ lastFocus = null; }
    var d = drawer();
    var btn = closeBtn(d);
    if (btn && typeof btn.focus === 'function') {
      try { btn.focus(); } catch(e){}
    } else if (d && typeof d.focus === 'function') {
      if (!d.hasAttribute('tabindex')) d.setAttribute('tabindex', '-1');
      try { d.focus(); } catch(e){}
    }
  }
  function sync(){
    ensureDialogAttrs();
    if (isOpen()) onOpen();
  }
  function wrapToggle(){
    if (typeof window.toggleCart !== 'function' || window.toggleCart.__a11yWave1) return false;
    var orig = window.toggleCart;
    window.toggleCart = function(){
      var was = isOpen();
      var r = orig.apply(this, arguments);
      ensureDialogAttrs();
      if (!was && isOpen()) onOpen();
      return r;
    };
    window.toggleCart.__a11yWave1 = true;
    return true;
  }
  document.addEventListener('keydown', function(e){
    if (!e) return;
    var key = e.key || e.code;
    if (key !== 'Escape' && key !== 'Esc' && e.keyCode !== 27) return;
    if (!isOpen()) return;
    e.preventDefault();
    e.stopPropagation();
    closeCartOnly();
  }, true);
  var n = 0;
  (function hook(){
    wrapToggle();
    ensureDialogAttrs();
    if (++n < 50) setTimeout(hook, 100);
  })();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
})();

