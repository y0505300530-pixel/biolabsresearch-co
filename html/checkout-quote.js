/*! checkout-quote.js v2 — CRM storefront quote SoT (site tip v2.99e on Quote v2.99d).
   POST https://crm.biolabsresearch.co/api/checkout/quote
   No card fields. Required: idempotencyKey (camelCase, BL-QUOTE-<stable-id>).
   Passes the same session_id as abandoned-checkout capture (prefer BLRCheckoutAbandon,
   else sessionStorage blr_session_id). Do not rotate session_id on submit.
   Charge path stays in checkout-charge.js and is unused while payments are off. */
(function (root) {
  'use strict';

  var ENDPOINT = 'https://crm.biolabsresearch.co/api/checkout/quote';
  var KEY_SLOT = 'blr_quote_idem';
  var SESSION_SLOT = 'blr_session_id';
  var SUCCESS_COPY = "We'll send your quote within one business day.";
  var ISO3 = {
    US: 'USA', USA: 'USA', GB: 'GBR', CA: 'CAN', AU: 'AUS', DE: 'DEU', FR: 'FRA',
    ES: 'ESP', IT: 'ITA', PL: 'POL', NL: 'NLD', BE: 'BEL', AT: 'AUT', CH: 'CHE',
    CZ: 'CZE', HU: 'HUN', RO: 'ROU', PT: 'PRT', SE: 'SWE', DK: 'DNK', NO: 'NOR',
    FI: 'FIN', GR: 'GRC', SK: 'SVK', HR: 'HRV', BG: 'BGR', LT: 'LTU', LV: 'LVA',
    EE: 'EST', SI: 'SVN', CY: 'CYP', MX: 'MEX', BR: 'BRA'
  };

  function money(n) {
    var x = Number(n);
    if (!isFinite(x) || x < 0) x = 0;
    return x.toFixed(2);
  }

  function countryForQuote(code) {
    var charge = root && root.BLRCheckoutCharge;
    if (charge && typeof charge.countryForCharge === 'function') {
      return charge.countryForCharge(code);
    }
    var c = String(code || '').trim().toUpperCase();
    if (!c || c === 'OTHER') return 'USA';
    return ISO3[c] || c;
  }

  function newUuid() {
    try {
      if (root.crypto && typeof root.crypto.randomUUID === 'function') return root.crypto.randomUUID();
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
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) {
        var r = Math.random() * 16 | 0;
        var v = ch === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

  function sessionId() {
    try {
      if (root.BLRCheckoutAbandon && typeof root.BLRCheckoutAbandon.sessionId === 'function') {
        var fromAbandon = root.BLRCheckoutAbandon.sessionId();
        if (fromAbandon) {
          try {
            if (root.sessionStorage) sessionStorage.setItem(SESSION_SLOT, fromAbandon);
          } catch (eSync) {}
          return fromAbandon;
        }
      }
    } catch (eAb) {}
    var id = '';
    try {
      id = String((root.sessionStorage && sessionStorage.getItem(SESSION_SLOT)) || '').replace(/^\s+|\s+$/g, '');
    } catch (e) {}
    if (!id) {
      id = newUuid();
      try {
        if (root.sessionStorage) sessionStorage.setItem(SESSION_SLOT, id);
      } catch (e2) {}
    }
    return id;
  }

  function newStableId() {
    var rnd = '';
    try {
      var a = new Uint8Array(16);
      (root.crypto || crypto).getRandomValues(a);
      for (var i = 0; i < a.length; i++) rnd += ('0' + a[i].toString(16)).slice(-2);
    } catch (e) {
      rnd = String(Date.now()) + Math.random().toString(36).slice(2, 12);
    }
    return Date.now().toString(36) + '-' + rnd;
  }

  function readStoredKey() {
    try {
      return JSON.parse((root.sessionStorage && sessionStorage.getItem(KEY_SLOT)) || 'null');
    } catch (e) {
      return null;
    }
  }

  function writeStoredKey(rec) {
    try {
      if (root.sessionStorage) sessionStorage.setItem(KEY_SLOT, JSON.stringify(rec));
    } catch (e) {}
  }

  function fingerprint(amount, email, items) {
    var charge = root && root.BLRCheckoutCharge;
    if (charge && typeof charge.fingerprint === 'function') {
      return charge.fingerprint(amount, email, items);
    }
    var parts = (items || []).map(function (i) {
      return [i.sku || '', i.qty, i.amount].join(':');
    });
    return [amount, String(email || '').toLowerCase(), parts.join('|')].join('#');
  }

  function idempotencyKey(fp, rotate) {
    var rec = readStoredKey();
    if (rotate || !rec || rec.fp !== fp || !rec.key) {
      rec = { fp: fp, key: 'BL-QUOTE-' + newStableId() };
      writeStoredKey(rec);
    }
    return rec.key;
  }

  function buildItems(cart) {
    var charge = root && root.BLRCheckoutCharge;
    if (charge && typeof charge.buildItems === 'function') {
      return charge.buildItems(cart);
    }
    return (cart || []).map(function (i) {
      var slug = String((i && (i.sku || i.slug)) || '').replace(/\.html$/i, '').replace(/^\s+|\s+$/g, '');
      var mg = String((i && i.mg) || '').replace(/\s+/g, '');
      var sku = slug || 'item';
      if (mg) sku += '-' + mg.toLowerCase();
      var qty = parseInt(i && i.qty, 10) || 1;
      return {
        sku: sku,
        name: String((i && i.name) || sku),
        qty: qty,
        amount: money(i && i.price)
      };
    });
  }

  function customerPayload(c) {
    var charge = root && root.BLRCheckoutCharge;
    if (charge && typeof charge.customerPayload === 'function') {
      var shared = charge.customerPayload(c);
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
    c = c || {};
    var line1 = String(c.address1 || '').replace(/^\s+|\s+$/g, '');
    var line2 = String(c.address2 || '').replace(/^\s+|\s+$/g, '');
    return {
      first_name: String(c.firstName || '').replace(/^\s+|\s+$/g, ''),
      last_name: String(c.lastName || '').replace(/^\s+|\s+$/g, ''),
      email: String(c.email || '').replace(/^\s+|\s+$/g, ''),
      phone: String(c.phone || '').replace(/^\s+|\s+$/g, ''),
      address: line2 ? line1 + ', ' + line2 : line1,
      city: String(c.city || '').replace(/^\s+|\s+$/g, ''),
      state: String(c.state || '').replace(/^\s+|\s+$/g, ''),
      zip: String(c.zip || '').replace(/^\s+|\s+$/g, ''),
      country: countryForQuote(c.country)
    };
  }

  function publicError() {
    return 'We could not send your quote request. Please try again.';
  }

  function quoteIdOf(data) {
    if (!data || typeof data !== 'object') return '';
    return String(data.quoteId || data.quote_id || data.id || '');
  }

  function quote(input) {
    input = input || {};
    var items = buildItems(input.cart);
    if (!items.length) {
      return Promise.resolve({ ok: false, validation: true, message: 'Your cart is empty. Please add products first.' });
    }

    var amount = money(input.amount);
    var customer = customerPayload(input.customer);
    if (!customer.email || !customer.first_name || !customer.last_name || !customer.address) {
      return Promise.resolve({ ok: false, validation: true, message: 'Please complete the required contact and shipping fields.' });
    }

    var fp = fingerprint(amount, customer.email, items);
    var key = idempotencyKey(fp, !!input.rotateKey);
    var body = {
      idempotencyKey: key,
      amount: amount,
      currency: 'USD',
      customer: customer,
      items: items
    };
    var notes = String(input.notes || '');
    if (notes) body.notes = notes;
    try {
      var sid = input.session_id;
      if (!sid) sid = sessionId();
      if (sid) body.session_id = String(sid);
    } catch (eSid) {}

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        var ok = !!(data && data.ok === true);
        if (!ok) {
          try { idempotencyKey(fp, true); } catch (e2) {}
        } else {
          try { if (root.sessionStorage) sessionStorage.removeItem(KEY_SLOT); } catch (e3) {}
        }
        return {
          ok: ok,
          status: res.status,
          quoteId: quoteIdOf(data),
          message: ok ? SUCCESS_COPY : publicError()
        };
      });
    }).catch(function () {
      return {
        ok: false,
        network: true,
        message: 'We could not reach the quote desk. Please try again.'
      };
    });
  }

  var api = {
    ENDPOINT: ENDPOINT,
    SUCCESS_COPY: SUCCESS_COPY,
    SESSION_SLOT: SESSION_SLOT,
    quote: quote,
    sessionId: sessionId,
    money: money,
    buildItems: buildItems,
    customerPayload: customerPayload,
    fingerprint: fingerprint,
    idempotencyKey: idempotencyKey
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.BLRCheckoutQuote = api;
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
