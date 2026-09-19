# QA Audit Report: BioLabs Research Live Checkout (v3.00)

**Target Site:** `https://biolabsresearch.co`  
**Audit Date:** Saturday, September 19, 2026  
**Audit Scope:** Live verification of Quote Mode, Abandoned Checkout Capture, and Old Charge Path Gating  
**Methodology:** Read-only analysis using `curl` and static source inspection (no form submissions or POST requests performed)

---

## Executive Summary

| Check # | Requirement / Subject | Result | Key Findings |
| :--- | :--- | :--- | :--- |
| **Check 1** | Live Checkout Page & Payment-Related Inputs | **PASS** | `checkout.html` 301 redirects to `/checkout`. Main CTA is "Request a Quote". Card inputs exist in DOM but are `disabled`, `tabindex="-1"`, and hidden inside `#paymentChargeUi[hidden]`. |
| **Check 2** | Quote Submission Script (`checkout-quote.js`) | **PASS** | POSTs to `https://crm.biolabsresearch.co/api/checkout/quote`. Uses camelCase `idempotencyKey` prefixed with `BL-QUOTE-`. Captures customer and item details; performs client-side validation. No payment/card data processed. |
| **Check 3** | Abandoned Checkout Script (`checkout-abandon.js`) | **PASS** | POSTs to `https://crm.biolabsresearch.co/api/checkout/abandon`. Captures partial contact/shipping info using `session_id` (`bl-sess-...`). Silent on response. Rate-limiting: `THROTTLE_MS = 25000`, `EMAIL_DEBOUNCE_MS = 800`. Strips card keys. |
| **Check 4** | Old Charge Path Retained & Gated | **PASS** | `checkout-charge.js` exists but is unreachable. Hardcoded `PAYMENTS_ENABLED = false` forces `placeOrder()` into `submitQuoteRequest()`. Card UI container `#paymentChargeUi` is hidden. No visible element triggers a charge. |
| **Check 5** | Abandon Script Include on `/checkout` Page | **PASS** | `<script src="/checkout-abandon.js?v=1"></script>` is present in the `<head>` of the live checkout page. |

---

## Detailed Audit Findings

### Check 1: Live Checkout Page & Payment-Related Inputs
* **URL Tested:** `https://biolabsresearch.co/checkout` (and `https://biolabsresearch.co/checkout.html`)
* **HTTP Redirect Verification:**
  `https://biolabsresearch.co/checkout.html` returns `HTTP/1.1 301 Moved Permanently` with `Location: https://biolabsresearch.co/checkout`.
* **Submit CTA Text:**
  The main action button explicitly displays **"Request a Quote"**:
  ```html
  <button class="btn-submit" id="placeOrderBtn" type="button" onclick="placeOrder()">
    <span id="submitBtnText">Request a Quote</span>
    <div class="spinner" id="submitSpinner"></div>
  </button>
  ```
  Accompanying microcopy text:
  ```html
  <span id="ctaMicrocopyText">Inquiry only · RUO catalog · no card charge</span>
  ```
* **Payment-Related Inputs in HTML:**
  The card input fields exist in the HTML markup within `<div class="card-input-area visible" id="cardInputArea">`:
  ```html
  <input type="text" id="cardName" autocomplete="off" placeholder="Name as shown on card" maxlength="80" disabled tabindex="-1">
  <input type="text" id="cardNumber" autocomplete="off" inputmode="numeric" placeholder="Card number" maxlength="24" disabled tabindex="-1">
  <input type="text" id="cardExpiry" autocomplete="off" inputmode="numeric" placeholder="MM/YY" maxlength="5" disabled tabindex="-1">
  <input type="password" id="cardCvc" autocomplete="off" inputmode="numeric" placeholder="123" maxlength="4" disabled tabindex="-1">
  ```
* **Input Attributes & Visibility Analysis:**
  - All four payment inputs (`cardName`, `cardNumber`, `cardExpiry`, `cardCvc`) have `disabled` and `tabindex="-1"` attributes hardcoded.
  - All four inputs have `autocomplete="off"`. No standard credit card autocomplete attributes (`cc-number`, `card-number`, `cvc`, `cc-csc`) are present.
  - The parent element `#paymentChargeUi` has the HTML `hidden` attribute, which CSS targets with `#paymentChargeUi[hidden]{display:none!important}`.

---

### Check 2: Quote Submission Script (`checkout-quote.js`)
* **Asset Location:** `https://biolabsresearch.co/checkout-quote.js` (Note: `/html/checkout-quote.js` returns 404; site references root path `/checkout-quote.js?v=2`).
* **POST Target:** `https://crm.biolabsresearch.co/api/checkout/quote`
* **Idempotency Key:** Generated with camelCase property `idempotencyKey` and value format `BL-QUOTE-<stable-id>`.
* **Key Evidence Lines (5-10 Key Lines Quoted):**
  ```javascript
  var ENDPOINT = 'https://crm.biolabsresearch.co/api/checkout/quote';
  
  // Idempotency Key Generation
  rec = { fp: fp, key: 'BL-QUOTE-' + newStableId() };
  
  // Request Body Construction
  var body = {
    idempotencyKey: key,
    amount: amount,
    currency: 'USD',
    customer: customer,
    items: items
  };
  
  // Validation Checks
  if (!items.length) {
    return Promise.resolve({ ok: false, validation: true, message: 'Your cart is empty. Please add products first.' });
  }
  if (!customer.email || !customer.first_name || !customer.last_name || !customer.address) {
    return Promise.resolve({ ok: false, validation: true, message: 'Please complete the required contact and shipping fields.' });
  }
  ```
* **Fields Captured:**
  - `customer`: `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `state`, `zip`, `country`
  - `items`: array of objects containing `sku`, `name`, `qty`, `amount`
  - `amount`, `currency` (`USD`), `notes`, `session_id`

---

### Check 3: Abandoned Checkout Script (`checkout-abandon.js`)
* **Asset Location:** `https://biolabsresearch.co/checkout-abandon.js` (Root path referenced as `/checkout-abandon.js?v=1`).
* **POST Target:** `https://crm.biolabsresearch.co/api/checkout/abandon`
* **Partial Fill Capture:** Captures `firstName`, `lastName`, `email`, `phone`, `address1`, `address2`, `city`, `state`, `zip`, `country`, cart items, and coupon. Triggers on email input `blur` or shipping section `focusin`, as well as `visibilitychange` (page hide/unload).
* **Session ID Management:**
  ```javascript
  var SESSION_KEY = 'blr_abandon_session';
  function sessionId() {
    var id = '';
    try { id = (root.sessionStorage && sessionStorage.getItem(SESSION_KEY)) || ''; } catch (e) {}
    if (!id || id.indexOf('bl-sess-') !== 0) {
      id = 'bl-sess-' + uuid();
      try { if (root.sessionStorage) sessionStorage.setItem(SESSION_KEY, id); } catch (e2) {}
    }
    return id;
  }
  ```
* **Silent Response Handling (204 / Soft Drop):**
  ```javascript
  function postFetch(body) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'omit'
    }).then(function () { return true; }).catch(function () { return false; });
  }
  ```
* **Rate-Limit & Debounce Constants:**
  - `THROTTLE_MS = 25000` (25-second throttle between non-forced capture calls)
  - `EMAIL_DEBOUNCE_MS = 800` (800ms debounce delay on email blur)
  - Sensitive Field Protection: `FORBIDDEN = /^(card|pan|cvv|cvc|expiry|expir|last4|ccnumber|cardnumber|paymentmethod|number)$/i;`

---

### Check 4: Old Charge Path & Flag Gating (`checkout-charge.js`)
* **Asset Location:** `https://biolabsresearch.co/checkout-charge.js` (Referenced as `/checkout-charge.js?v=4`).
* **POST Target in Script:** `https://crm.biolabsresearch.co/api/checkout/charge`
* **Gating Verification in Page Logic:**
  1. Flag Definition:
     ```javascript
     var PAYMENTS_ENABLED = false;
     ```
  2. Main Submit Router (`placeOrder`):
     ```javascript
     function placeOrder() {
       showChargeError('');
       if (!cart.length) { alert('Your cart is empty. Please add products first.'); return; }
       if (!validate()) return;
       if (!PAYMENTS_ENABLED) {
         submitQuoteRequest();
         return;
       }
       if (selectedPaymentMethod === 'crypto') { openCryptoModal(); return; }
       if (!validateCardFields()) return;
       submitCardCharge();
     }
     ```
  3. UI Hidden: `#paymentChargeUi` element has attribute `hidden`, styled via `#paymentChargeUi[hidden]{display:none!important}`.
* **Conclusion:** The `/api/checkout/charge` endpoint and `submitCardCharge()` function are completely unreachable from the live UI while `PAYMENTS_ENABLED = false`. No visible element can trigger a card charge.

---

### Check 5: Abandon Script Inclusion
* **Verification:** Checked HTML source of `https://biolabsresearch.co/checkout`.
* **Script Tag Found:**
  ```html
  <script src="/checkout-abandon.js?v=1"></script>
  ```
* **Inclusion Location:** Included directly in the `<head>` of `/checkout`.

---

## Final Audit Status
**ALL CHECKS PASSED (5 / 5)**  
BioLabs Research v3.00 live checkout is correctly operating in **Quote Mode** with active **Abandoned Checkout Capture**, and all legacy credit card charge paths are disabled and gated behind `PAYMENTS_ENABLED = false`.
