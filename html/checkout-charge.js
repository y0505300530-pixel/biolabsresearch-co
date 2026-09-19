/*! checkout-charge.js v3 — CRM storefront charge SoT (site tip v2.99c2).
   POST https://crm.biolabsresearch.co/api/checkout/charge
   Required: idempotencyKey (camelCase; extOrderId accepted as alias). Never idempotency_key.
   Never logs or stores full PAN/CVV. Idempotency is stable for one in-flight submit. */
(function (root) {
  'use strict';

  var ENDPOINT = 'https://crm.biolabsresearch.co/api/checkout/charge';
  var KEY_SLOT = 'blr_charge_idem';
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

  function digits(s) {
    return String(s == null ? '' : s).replace(/\D/g, '');
  }

  function last4(num) {
    var d = digits(num);
    return d.length >= 4 ? d.slice(-4) : '';
  }

  function countryForCharge(code) {
    var c = String(code || '').trim().toUpperCase();
    if (!c || c === 'OTHER') return 'USA';
    return ISO3[c] || c;
  }

  function parseExpiry(raw) {
    var m = String(raw || '').trim().match(/^(\d{1,2})\s*[\/-]?\s*(\d{2,4})$/);
    if (!m) return { month: '', year: '' };
    var monthNum = parseInt(m[1], 10);
    var month = monthNum < 10 ? '0' + monthNum : String(monthNum);
    var year = m[2];
    if (year.length === 4) year = year.slice(-2);
    return { month: month, year: year };
  }

  function newIdempotencyKey() {
    var rnd = '';
    try {
      var a = new Uint8Array(16);
      (root.crypto || crypto).getRandomValues(a);
      for (var i = 0; i < a.length; i++) rnd += ('0' + a[i].toString(16)).slice(-2);
    } catch (e) {
      rnd = String(Date.now()) + Math.random().toString(36).slice(2, 12);
    }
    return 'blr-' + Date.now().toString(36) + '-' + rnd;
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
    var parts = (items || []).map(function (i) {
      return [i.sku || '', i.qty, i.amount].join(':');
    });
    return [amount, String(email || '').toLowerCase(), parts.join('|')].join('#');
  }

  function idempotencyKey(fp, rotate) {
    var rec = readStoredKey();
    if (rotate || !rec || rec.fp !== fp || !rec.key) {
      rec = { fp: fp, key: newIdempotencyKey() };
      writeStoredKey(rec);
    }
    return rec.key;
  }

  function buildItems(cart) {
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

  function readCard(fields) {
    var exp = parseExpiry(fields && fields.expiry);
    return {
      name: String((fields && fields.name) || '').replace(/^\s+|\s+$/g, ''),
      number: digits(fields && fields.number),
      month: exp.month,
      year: exp.year,
      cvv: digits(fields && fields.cvv)
    };
  }

  function validateCard(card) {
    if (!card.name) return 'Please enter the name on the card.';
    if (card.number.length < 12 || card.number.length > 19) return 'Please enter a valid card number.';
    if (!/^(0[1-9]|1[0-2])$/.test(card.month) || !/^\d{2}$/.test(card.year)) {
      return 'Please enter expiry as MM/YY.';
    }
    if (card.cvv.length < 3 || card.cvv.length > 4) return 'Please enter the card security code.';
    return '';
  }

  function customerPayload(c) {
    c = c || {};
    var line1 = String(c.address1 || '').replace(/^\s+|\s+$/g, '');
    var line2 = String(c.address2 || '').replace(/^\s+|\s+$/g, '');
    return {
      first_name: String(c.firstName || '').replace(/^\s+|\s+$/g, ''),
      last_name: String(c.lastName || '').replace(/^\s+|\s+$/g, ''),
      email: String(c.email || '').replace(/^\s+|\s+$/g, ''),
      address: line2 ? line1 + ', ' + line2 : line1,
      country: countryForCharge(c.country),
      state: String(c.state || '').replace(/^\s+|\s+$/g, ''),
      city: String(c.city || '').replace(/^\s+|\s+$/g, ''),
      zip: String(c.zip || '').replace(/^\s+|\s+$/g, ''),
      phone: String(c.phone || '').replace(/^\s+|\s+$/g, ''),
      ip: '',
      birthday: ''
    };
  }

  function publicError(data) {
    if (data && data.exhausted) return 'This card cannot be used. Please try a different card.';
    if (data && data.hardDecline) return 'The card was declined. Please try a different card.';
    if (data && data.ok === false) return 'The card was declined. Check the details and try again.';
    return 'We could not authorize this card. Please try again.';
  }

  function orderPublicId(order) {
    if (!order || typeof order !== 'object') return '';
    return String(order.winningTxnId || order.id || order.ref || '');
  }

  function charge(input) {
    input = input || {};
    var card = readCard(input.card);
    var cardErr = validateCard(card);
    if (cardErr) {
      return Promise.resolve({
        ok: false,
        validation: true,
        message: cardErr,
        last4: last4(card.number)
      });
    }

    var items = buildItems(input.cart);
    if (!items.length) {
      return Promise.resolve({ ok: false, validation: true, message: 'Your cart is empty. Please add products first.' });
    }

    var amount = money(input.amount);
    var customer = customerPayload(input.customer);
    var fp = fingerprint(amount, customer.email, items);
    var key = idempotencyKey(fp, !!input.rotateKey);
    var body = {
      idempotencyKey: key,
      extOrderId: key,
      amount: amount,
      currency: 'USD',
      customer: customer,
      items: items,
      card: card,
      subscriptionStatus: 0,
      notes: String(input.notes || '')
    };

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        var ok = !!(data && data.ok === true);
        /* Completed HTTP answer: next click is a new attempt (new card / retry after decline).
           Network failures never reach here, so the same key stays retry-safe. */
        if (!ok) {
          try { idempotencyKey(fp, true); } catch (e2) {}
        } else {
          try { if (root.sessionStorage) sessionStorage.removeItem(KEY_SLOT); } catch (e3) {}
        }
        return {
          ok: ok,
          status: res.status,
          orderId: orderPublicId(data && data.order),
          last4: last4(card.number),
          hardDecline: !!(data && data.hardDecline),
          exhausted: !!(data && data.exhausted),
          message: ok ? '' : publicError(data)
        };
      });
    }).catch(function () {
      return {
        ok: false,
        network: true,
        last4: last4(card.number),
        message: 'We could not reach the payment service. Please try again.'
      };
    });
  }

  var api = {
    ENDPOINT: ENDPOINT,
    charge: charge,
    money: money,
    last4: last4,
    digits: digits,
    parseExpiry: parseExpiry,
    countryForCharge: countryForCharge,
    buildItems: buildItems,
    customerPayload: customerPayload,
    validateCardFields: function (fields) { return validateCard(readCard(fields)); },
    fingerprint: fingerprint,
    idempotencyKey: idempotencyKey
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.BLRCheckoutCharge = api;
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
