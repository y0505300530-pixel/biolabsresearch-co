/*! checkout-abandon.js v1 — CRM abandoned-checkout capture (site tip v2.99e).
   POST https://crm.biolabsresearch.co/api/checkout/abandon
   First-party RUO / Quote lead only. Never card / PAN / CVV / last4 / paymentMethod.
   Silent 204 on success / soft-drop. Failures never break quote or charge. */
(function (root) {
  'use strict';

  var ENDPOINT = 'https://crm.biolabsresearch.co/api/checkout/abandon';
  var SESSION_KEY = 'blr_abandon_session';
  var LAST_KEY = 'blr_abandon_last';
  var THROTTLE_MS = 25000;
  var EMAIL_DEBOUNCE_MS = 800;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var FORBIDDEN = /^(card|pan|cvv|cvc|expiry|expir|last4|ccnumber|cardnumber|paymentmethod|number)$/i;

  var stopped = false;
  var hideBurst = false;
  var emailTimer = null;
  var lastStage = 'contact';
  var shippingArmed = false;

  function uuid() {
    try {
      if (root.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    } catch (e) {}
    try {
      var a = new Uint8Array(16);
      (root.crypto || crypto).getRandomValues(a);
      a[6] = (a[6] & 0x0f) | 0x40;
      a[8] = (a[8] & 0x3f) | 0x80;
      var hex = [];
      for (var i = 0; i < 16; i++) hex.push(('0' + a[i].toString(16)).slice(-2));
      return hex.slice(0, 4).join('') + '-' + hex.slice(4, 6).join('') + '-' +
        hex.slice(6, 8).join('') + '-' + hex.slice(8, 10).join('') + '-' + hex.slice(10).join('');
    } catch (e2) {
      return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 14);
    }
  }

  function sessionId() {
    var id = '';
    try {
      id = (root.sessionStorage && sessionStorage.getItem(SESSION_KEY)) || '';
    } catch (e) { id = ''; }
    if (!id || id.indexOf('bl-sess-') !== 0) {
      id = 'bl-sess-' + uuid();
      try { if (root.sessionStorage) sessionStorage.setItem(SESSION_KEY, id); } catch (e2) {}
    }
    return id;
  }

  function money(n) {
    var quote = root && root.BLRCheckoutQuote;
    var charge = root && root.BLRCheckoutCharge;
    if (quote && typeof quote.money === 'function') return quote.money(n);
    if (charge && typeof charge.money === 'function') return charge.money(n);
    var x = Number(n);
    if (!isFinite(x) || x < 0) x = 0;
    return x.toFixed(2);
  }

  function readCart() {
    try {
      var raw = (root.localStorage && (localStorage.getItem('biolabs_cart') || localStorage.getItem('biofirst_cart'))) || '[]';
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function buildItems() {
    var cart = readCart();
    var quote = root && root.BLRCheckoutQuote;
    var charge = root && root.BLRCheckoutCharge;
    if (quote && typeof quote.buildItems === 'function') return quote.buildItems(cart);
    if (charge && typeof charge.buildItems === 'function') return charge.buildItems(cart);
    return [];
  }

  function field(id) {
    var el = root.document && document.getElementById(id);
    return el ? String(el.value || '').replace(/^\s+|\s+$/g, '') : '';
  }

  function customer() {
    var raw = {
      firstName: field('firstName'),
      lastName: field('lastName'),
      email: field('email'),
      phone: field('phone'),
      address1: field('address1'),
      address2: field('address2'),
      city: field('city'),
      state: field('state'),
      zip: field('zip'),
      country: field('country')
    };
    var quote = root && root.BLRCheckoutQuote;
    var charge = root && root.BLRCheckoutCharge;
    if (quote && typeof quote.customerPayload === 'function') return quote.customerPayload(raw);
    if (charge && typeof charge.customerPayload === 'function') {
      var shared = charge.customerPayload(raw);
      return {
        first_name: shared.first_name,
        last_name: shared.last_name,
        email: shared.email,
        phone: shared.phone,
        address: shared.address,
        city: shared.city,
        state: shared.state,
        zip: shared.zip,
        country: shared.country
      };
    }
    return {
      first_name: raw.firstName,
      last_name: raw.lastName,
      email: raw.email,
      phone: raw.phone
    };
  }

  function coupon() {
    var c = field('couponCode');
    if (!c) {
      try {
        c = (root.localStorage && (localStorage.getItem('biolabs_coupon') || localStorage.getItem('biofirst_coupon'))) || '';
      } catch (e) { c = ''; }
    }
    return String(c || '').replace(/^\s+|\s+$/g, '');
  }

  function emailOk(addr) {
    var e = String(addr == null ? field('email') : addr).replace(/^\s+|\s+$/g, '');
    return EMAIL_RE.test(e);
  }

  function currentStage() {
    if (shippingArmed) return 'shipping';
    if (field('address1') || field('city') || field('zip')) return 'shipping';
    return lastStage || 'contact';
  }

  function subtotal() {
    var cart = readCart();
    var sum = 0;
    for (var i = 0; i < cart.length; i++) {
      var row = cart[i] || {};
      sum += (Number(row.price) || 0) * (parseInt(row.qty, 10) || 1);
    }
    return money(sum);
  }

  function stripForbidden(value, key) {
    if (key && FORBIDDEN.test(String(key))) return undefined;
    if (value == null) return value;
    if (Array.isArray(value)) {
      var arr = [];
      for (var i = 0; i < value.length; i++) arr.push(stripForbidden(value[i], ''));
      return arr;
    }
    if (typeof value === 'object') {
      var out = {};
      for (var k in value) {
        if (!Object.prototype.hasOwnProperty.call(value, k)) continue;
        if (FORBIDDEN.test(k)) continue;
        out[k] = stripForbidden(value[k], k);
      }
      return out;
    }
    return value;
  }

  function payload(stage) {
    var body = {
      session_id: sessionId(),
      stage: stage || currentStage(),
      customer: customer(),
      items: buildItems(),
      subtotal: subtotal(),
      timestamp: new Date().toISOString()
    };
    var code = coupon();
    if (code) body.coupon = code;
    return stripForbidden(body, '');
  }

  function lastSentAt() {
    try {
      return parseInt((root.sessionStorage && sessionStorage.getItem(LAST_KEY)) || '0', 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function markSent() {
    try {
      if (root.sessionStorage) sessionStorage.setItem(LAST_KEY, String(Date.now()));
    } catch (e) {}
  }

  function throttled() {
    return (Date.now() - lastSentAt()) < THROTTLE_MS;
  }

  function postFetch(body) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'omit'
    }).then(function () { return true; }).catch(function () { return false; });
  }

  function postBeacon(body) {
    try {
      if (root.navigator && typeof navigator.sendBeacon === 'function') {
        var blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
        return !!navigator.sendBeacon(ENDPOINT, blob);
      }
    } catch (e) {}
    postFetch(body);
    return true;
  }

  function capture(stage, opts) {
    opts = opts || {};
    try {
      if (stopped) return;
      if (!emailOk()) return;
      var useBeacon = !!opts.beacon;
      if (!useBeacon && !opts.force && throttled()) return;
      var st = stage || currentStage();
      lastStage = st;
      var body = payload(st);
      if (!body || !body.session_id || !body.customer || !emailOk(body.customer.email)) return;
      if (useBeacon) postBeacon(body);
      else postFetch(body);
      markSent();
    } catch (e) {}
  }

  function advanceShipping() {
    try {
      shippingArmed = true;
      lastStage = 'shipping';
      capture('shipping', { force: false });
    } catch (e) {}
  }

  function onHide() {
    try {
      if (stopped || hideBurst) return;
      hideBurst = true;
      capture(currentStage(), { beacon: true, force: true });
      setTimeout(function () { hideBurst = false; }, 1500);
    } catch (e) {}
  }

  function bind() {
    try {
      var email = document.getElementById('email');
      if (email) {
        email.addEventListener('blur', function () {
          try {
            if (emailTimer) clearTimeout(emailTimer);
            emailTimer = setTimeout(function () {
              emailTimer = null;
              if (emailOk()) {
                lastStage = lastStage === 'shipping' ? 'shipping' : 'contact';
                capture(lastStage === 'shipping' ? 'shipping' : 'contact');
              }
            }, EMAIL_DEBOUNCE_MS);
          } catch (e) {}
        });
      }
      var ship = document.getElementById('shippingAddressCard');
      if (ship) {
        ship.addEventListener('focusin', function () {
          try {
            shippingArmed = true;
            lastStage = 'shipping';
            capture('shipping');
          } catch (e) {}
        });
      }
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') onHide();
      });
      root.addEventListener('pagehide', onHide);
    } catch (e) {}
  }

  function stop() {
    stopped = true;
    try { if (emailTimer) clearTimeout(emailTimer); } catch (e) {}
  }

  function attachSessionId(body) {
    try {
      if (!body || typeof body !== 'object') return body;
      body.session_id = sessionId();
    } catch (e) {}
    return body;
  }

  var api = {
    ENDPOINT: ENDPOINT,
    sessionId: sessionId,
    capture: capture,
    advanceShipping: advanceShipping,
    attachSessionId: attachSessionId,
    stop: stop,
    money: money,
    buildItems: buildItems
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.BLRCheckoutAbandon = api;

  if (root.document) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bind);
    } else {
      bind();
    }
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
