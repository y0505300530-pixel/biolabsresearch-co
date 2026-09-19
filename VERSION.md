# biolabsresearch.co — Version 3.00a

Released 2026-09-19.

Codename: qa-meta-css-align

## Highlights

- **Homepage meta:** Replaced the 196-character description with the QA draft (158 chars, ≤159): *BioLabs Research supplies research-use-only (RUO) compounds with lot documentation on request. Browse our catalog and request COAs. Not for human consumption.* Same string on `name="description"`, `og:description`, and `twitter:description`. No invented counts, no dosing.
- **CSS cache-bust:** Catalog (`/research-peptides`) and all `html/products/*.html` PDPs now load `biolabs_style.css?v=407`. Homepage was already 407. Did not bump past 407. Checkout, family hubs, quote, and G3-R naming/content untouched.
- **Tip stack:** Hotfix on live **v3.00** (`release-3-00`, `5f180ae5`) over **v2.99g1** / g / f1 / f / e3 / e2 / e1 / e / Quote **v2.99d**. Sitewide footer + meta + `version.json` stamped **v3.00a**.

---

# biolabsresearch.co — Version 3.00

Released 2026-09-19.

Codename: release-3-00

## Highlights

- **Quote mode + abandon:** Checkout CTA is **Request a Quote**. Browser POSTs (no card fields) to CRM `/api/checkout/quote` with camelCase `idempotencyKey`. Abandoned checkout POSTs `/api/checkout/abandon` (204 silent). Charge path retained unused while `paymentsEnabled:false`.
- **G3-R:** Public catalog name is **G3-R** only (`/products/g3-r`). Old retatrutide / r3ta / reta paths 301.
- **Mobile catalog:** 2-col compact grid through 320px, plus g1 category/filter flicker fix (visibility toggle only; no DOM reorder unless sort changes). CSS cache stays `biolabs_style.css?v=407`.
- **SEO L1:** Compare matrix, PDP FAQ + FAQPage, Product+Offer / Organization / BreadcrumbList JSON-LD.
- **Family hubs + COA:** `/families/` + four family spokes. PDP Download / View lot COA only when `coa_pdf_url` is a real PDF; otherwise Request lot COA (fail-closed).
- **Tip stack:** Release stamp on live **v2.99g1** (`catalog-filter-flicker-fix`, `9f145ea0`) over **v2.99g** hubs/COA / **v2.99f1** 2-col / **v2.99f** SEO L1 / **v2.99e3** / e2 / **v2.99e1** G3-R / abandon **v2.99e** / Quote **v2.99d**. Sitewide footer + meta + `version.json` stamped **v3.00**. No product, checkout, or CSS behavior change in this tip.

---

# biolabsresearch.co — Version 2.99g1

Released 2026-09-19.

Codename: catalog-filter-flicker-fix

## Highlights

- **Homepage catalog flicker:** Category / search / strength / availability / docs changes only toggle `.is-catalog-hidden`, the empty state, and `html.catalog-filtered`. `apply()` no longer `appendChild`s every card when sort order is unchanged.
- **Observer race:** `applying` stays true across a `requestAnimationFrame`, and the `#products-grid` MutationObserver is disconnected during `apply()` then reconnected after paint. Stops the ~60ms second enhance/populate/apply that rebuilt the grid and tripped `catalog-mg.js` chip `innerHTML`.
- **Unchanged:** Categories stay client-side on the homepage grid — not wired to `/families`. Quote, G3-R, hubs, and `coa-pdp.js` not touched. CSS cache stays `biolabs_style.css?v=407`.
- **Tip stack:** Sits on live **v2.99g** (`hub-spoke-dynamic-coa`, `f4438915`) over **v2.99f1** catalog-mobile-2col / **v2.99f** SEO L1 / **v2.99e3** / e2 / **v2.99e1** G3-R / abandon **v2.99e** / Quote **v2.99d**. Sitewide footer + meta + `version.json` stamped **v2.99g1**. Shared `cart-vial.js`, `mg-picker.js`, `prices-sync.js`, `catalog-mg.js` not rewritten.

---

# biolabsresearch.co — Version 2.99g

Released 2026-09-19.

Codename: hub-spoke-dynamic-coa

## Highlights

- **Family hubs:** `/families/` plus `/families/recovery`, `/families/ghrp-ghrh`, `/families/copper-skin`, `/families/mitochondrial`. Titles are “{Family} research compounds” with an RUO line. Seed examples are BPC-157, TB-500, GHK-Cu, NAD+, Tesamorelin / Ipamorelin, MOTS-c — **not** GLP-1, Retatrutide, Semaglutide, Tirzepatide, or G3-R.
- **Hub index:** `/research-peptides` stays as the public research-compounds index (no 404). It links the four families.
- **Spoke crumbs:** Product pages in a family show Home › {Family} research compounds › SKU, plus a contextual link back to the hub (`html/coa-pdp.js`).
- **COA SoT:** PDP **Download COA** / **View lot COA** only when `/api/products` returns a real `coa_pdf_url` PDF. Optional `coa_lot` switches the label to View lot COA. Otherwise **Request lot COA** inquiry. No Authentic / invented-file button. JSON-LD `DigitalDocument` only when that URL exists.
- **CRM:** Required API field documented in `docs/CRM-COA-API.md`. Live catalog does not yet emit the keys — storefront fails closed to inquiry.
- **Tip stack:** Rebased onto **v2.99f1** (`catalog-mobile-2col-compact`, `9669cc28`) over **v2.99f** SEO L1 / **v2.99e3** mobile-catalog / **v2.99e2** / **v2.99e1** G3-R / abandoned-checkout **v2.99e** / Quote **v2.99d** / c2 FAQ. Sitewide footer + meta + `version.json` stamped **v2.99g**.
- **Preserved from f1:** mobile catalog 2-col + compact toolbar, `biolabs_style.css?v=407`. Preserved from f: 24 new compare pages, PDP FAQ + FAQPage, Organization + BreadcrumbList JSON-LD, f sitemap compares. Quote + abandon scripts untouched.
- **Unchanged:** Abandoned-checkout capture, Quote CTA, charge path retained unused, robots Allow list, IndexNow key, G3-R public name / `/products/g3-r`. Shared `cart-vial.js`, `mg-picker.js`, `prices-sync.js` not rewritten. `pdp-split.js` only respects family crumbs (commit note). `pdp-story.js` Docs copy aligned.

---

# biolabsresearch.co — Version 2.99f1

Released 2026-09-19.

Codename: catalog-mobile-2col-compact

## Highlights

- **Mobile catalog 2×2 (Yehuda):** Homepage `.catalog-grid` stays **2 columns through 320px**. Soft-QA at 320 / 375 / 390 must show 2 columns × 2 rows (4 products visible), not a single narrow column and not 99×640 skyscraper cards.
- **Root cause:** `@media (max-width: 380px) { .catalog-grid { 1fr } }` plus a tall toolbar (search + stacked filters) and FAB `padding-bottom: 72–84px` / 64px right gutter made cards צר ארוך.
- **Fix:** 1-col rule removed. End-of-file SoT forces 2-col at ≤800 / ≤390 / ≤380. Toolbar filters are a **2×2** select grid (Documentation hidden on mobile). Cards: hide tagline / trust / View details; clamp name to 2 lines; chips nowrap; compact ATC nowrap; kill FAB card pad; 12px section gutters so cards are not ~99px wide.
- **Cache:** `html/index.html` loads `biolabs_style.css?v=407`.
- **Unchanged:** Hero, Quote / G3-R / abandon / f SEO (compares, PDP FAQ). Sits on live **v2.99f** (`fef725c1` seo-level1-compare-faq) over **v2.99e3** / e2 / e1 / e / Quote **v2.99d**. Sitewide footer + meta + `version.json` stamped **v2.99f1**.
- **ELITE Soft-QA:** formal PASS lock on `9669cc28`. Hub-spoke **g** ships next.

---

# biolabsresearch.co — Version 2.99f

Released 2026-09-19.

Codename: seo-level1-compare-faq

## Highlights

- **Compare matrix**: 24 new `/compare/<x>-vs-<y>` pages from the live `/api/products` catalog (21 SKUs). G3-R naming on new pages. Existing 11 compare HTML files left content-untouched (sitewide stamp only).
- **Neutral lab tables only**: identity, CAS, form, listed strengths, lot/COA-on-request. No which-one, no protocol, no prices written into the new tables.
- **PDP FAQ**: 5 questions on every live product page — storage, form/solubility docs, COA/lot docs, purity, shipping. No dosing, inject, or how-to-use copy.
- **JSON-LD**: Product+Offer kept on PDPs; FAQPage on PDP FAQ and new compares; Organization sitewide (`org-jsonld.js` + inline on PDPs/new compares); BreadcrumbList on PDPs and new compares. AggregateRating not added (no visible PDP numeric rating).
- **Sitemap**: new compare URLs added. G3-R CTAs on new pages point at `/products/g3-r` (e1 public slug).
- **Tip stack**: Rebased onto latest **main** at **v2.99e3** (`05d81983` mobile-catalog-search + ATC clip) over **v2.99e2** / **v2.99e1** G3-R / abandoned-checkout **v2.99e** / Quote **v2.99d** / c2 FAQ. Sitewide footer + meta + `version.json` stamped **v2.99f**. Prefer main for checkout/abandon/G3-R/mobile catalog CSS. PR #25 (g) not merged.

---

# biolabsresearch.co — Version 2.99e3

Released 2026-09-19.

Codename: mobile-catalog-search

## Highlights

- **Mobile catalog search:** Kill `flex: 1 1 240px` on `.catalog-search` when the toolbar is column. Pin the search icon to the 44px input. Screen-reader label stays clipped.
- **ATC clip @320:** Product-card actions / ATC / Inquire `nowrap` at 13px so “ADD TO CART” is not clipped to “ADD TO CA”.
- CSS only in `html/biolabs_style.css` (v2.99e3 block after v2.99e2). Home cache-bust `biolabs_style.css?v=405`.
- **Unchanged:** Homepage hero, checkout, FAQ SEO, G3-R. Sits on live **v2.99e2** (`96341d9b`) over **v2.99e1** G3-R / **v2.99e** abandon.

---

# biolabsresearch.co — Version 2.99e1

Released 2026-09-19.

Codename: g3-r-public-rename

## Highlights

- **G3-R public name (Yehuda lock):** Catalog display name is **G3-R** only. PDP URL is `/products/g3-r`. Gold-band text on live GLOW-chrome is **G3-R** (`vial-g3-r.png` / `.webp` + 10/20/50). No public Retatrutide / R3TA / Reta on band, alt, or URL.
- **Redirects:** Old `/products/retatrutide`, `/products/r3ta`, `/products/reta` and compare/blog/media variants **301** to the G3-R slug. Do not resurrect `html/products/retatrutide.html`.
- **Alt:** After mg-picker / strength chip the live DOM alt stays `G3-R {dose} research vial`.
- **Tip stack:** Sits on locked **v2.99e** (`abandoned-checkout`, Soft-QA PASS at `671f9e27`) over Quote **v2.99d** / c2 FAQ / AI-crawler Allow / IndexNow. Sitewide footer + meta + `version.json` stamped **v2.99e1** for Soft-QA Gate 0.
- **Unchanged:** Abandoned-checkout capture, Quote CTA, charge path retained unused, robots Allow list, IndexNow key. f (`#26`) and g (`#25`) are not in this tip.
- **Infra after live:** Deploy nginx 301s. CRM / products-api: slug `g3-r`, name `G3-R`, `image_url` `/media/vial-g3-r.webp?v=184`.

---

# biolabsresearch.co — Version 2.99e

Released 2026-09-19.

Codename: abandoned-checkout

## Highlights

- **Abandoned checkout:** First-party RUO / Quote lead capture. Browser POSTs `https://crm.biolabsresearch.co/api/checkout/abandon` (no card / PAN / CVV / last4). CRM returns silent **204** or **400** if card fields are present.
- **Capture SoT:** (a) contact → shipping advance, (b) email blur debounce ~800ms when the address is valid, (c) `pagehide` / `visibilitychange` → hidden via `sendBeacon`.
- **Session:** `session_id` is a `bl-sess-` + UUID in `sessionStorage`. Same id is sent on Quote submit (`/api/checkout/quote`) and on charge if payments are re-enabled. Throttle 25s upsert. Failures are silent and never break quote/charge.
- **Tip stack:** Live **v2.99d** (`checkout-quote`, PR #21, Soft-QA PASS at `105a5266`) sits on **v2.99c2** (`reconstitution-faq`, PR #24) over **v2.99c** (`calculator-seo-finish`, PR #19). This ship is **v2.99e**. Sitewide footer + meta + `version.json` stamped **v2.99e**. G3-R public rename ships as **v2.99e1**.
- New module `html/checkout-abandon.js?v=1`. Quote prefers `BLRCheckoutAbandon.sessionId()` then `blr_session_id`. Shared `cart-vial.js` not rewritten. Homepage hero / Popular catalog / PDP split SoT untouched. c2 FAQ / short-URL base kept.
- **IndexNow (Yehuda lock):** same key as d (`d265cfed-378b-45a0-9b56-3c05c205f805`). **After this tip is live**, run `scripts/indexnow-ping.sh` (or the curl under v2.99d). Do not block abandon capture on the ping.
- **AI crawlers:** Keep the d Allow list (GPTBot / ClaudeBot / Google-Extended / Bytespider / CCBot / anthropic-ai / PerplexityBot / Applebot-Extended + Googlebot / Bingbot).

---

# biolabsresearch.co — Version 2.99d

Released 2026-09-19.

Codename: checkout-quote

## Highlights

- **Quote mode (primary):** Checkout CTA is **Request a Quote**. Submit POSTs `https://crm.biolabsresearch.co/api/checkout/quote` with camelCase `idempotencyKey` (`BL-QUOTE-<stable-id>`), amount, currency, customer, items, optional notes. **No card fields.**
- **Success copy (Marketing lock):** `We'll send your quote within one business day.` Shown after `ok===true`. CRM also returns `quoteId`.
- **GA4:** keep `checkout_start`. On successful quote fire `generate_lead`. Do **not** fire `checkout_complete` while payments are off (`paymentsEnabled:false`).
- **Charge retained:** `html/checkout-charge.js` and `submitCardCharge()` stay in the tree. Card / crypto UX is hidden and unused. Do not delete the charge path.
- **Tip stack:** Sits on live **v2.99c2** (`reconstitution-faq`, PR #24) over **v2.99c** (`calculator-seo-finish`, PR #19). Checkout footer + `version.json` stamped **v2.99d**. Does not take a new letter beyond d.
- **Parallel (no new letter) — G3-R public name:** Display name **G3-R** only; URL `/products/g3-r`; gold-band text **G3-R** on live GLOW-chrome (`vial-g3-r.png` / `.webp` + 10/20/50). Old `/products/retatrutide`, `/products/r3ta`, `/products/reta` and compare/blog/media variants 301 here. Alt after mg-picker: `G3-R {dose} research vial`. Folded into v2.99d rather than stealing a stamp.
- New module `html/checkout-quote.js?v=2`. Quote POST also sends `session_id` (sessionStorage uuid, key `blr_session_id`) so CRM abandon can join the later v2.99e beacon. Full abandon capture is **not** this tip.
- **AI crawlers (Marketing lock):** `html/robots.txt` explicitly `Allow: /` for GPTBot, ClaudeBot, Google-Extended, Bytespider, CCBot, anthropic-ai, PerplexityBot, Applebot-Extended, plus Googlebot and Bingbot. Do **not** `Disallow: /` for them. `/api/` stays closed except `/api/products`.
- **IndexNow:** key `d265cfed-378b-45a0-9b56-3c05c205f805` at webroot `html/indexnow-key.txt` and official `html/d265cfed-378b-45a0-9b56-3c05c205f805.txt`. After deploy, ping new/changed URLs (or the sitemap) with `scripts/indexnow-ping.sh`. Curl:
  ```
  curl -X POST https://api.indexnow.org/indexnow \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d '{"host":"biolabsresearch.co","key":"d265cfed-378b-45a0-9b56-3c05c205f805","keyLocation":"https://biolabsresearch.co/d265cfed-378b-45a0-9b56-3c05c205f805.txt","urlList":["https://biolabsresearch.co/sitemap.xml"]}'
  ```
- Shared `cart-vial.js` not rewritten. Homepage hero / Popular catalog / PDP split SoT untouched. c2 FAQ / short-URL base kept.

---

# biolabsresearch.co — Version 2.99c2

Released 2026-09-19.

Codename: reconstitution-faq

## Highlights

- **Reconstitution FAQ**: `/tools/reconstitution` now has the same FAQ block as dilution + unit-converter — concentration math, diluent volume, mg/mL, and what the helper does **not** do (no dose, syringe, injection, or human/veterinary use). Laboratory research calculations only; RUO / not medical advice.
- **CTAs unchanged**: Request catalog (`/#catalog`) + Inquire (`/contact`). No Buy.
- **Short URLs** (ELITE soft-note): nginx snapshot + static stubs 301 `/dilution` and `/unit-converter` → `/tools/dilution` and `/tools/unit-converter`.
- **Unchanged**: Calculator arithmetic; Quote / Abandon not in this tip. Card path remains the v2.99b CRM UMG authorize hook.
- **Parallel (no new letter) — G3-R public name**: Display name **G3-R** only; URL `/products/g3-r`; gold-band text **G3-R**; old retatrutide/r3ta/reta paths 301. Folded into v2.99c2 rather than a new stamp.

---

# biolabsresearch.co — Version 2.99c

Released 2026-09-19.

Codename: calculator-seo-finish

## Highlights

- **Red 1**: Blog + compare bacteriostatic vs sterile water — usage-scenario table removed; neutral lab comparison only; third-person body; RUO above the fold. Banned phrases (`which one does your` / `your protocol` / `you’ll open` / `open the vial`) zero on those URLs. Titles/H1/canonical unchanged.
- **Red 3**: Homepage hero trust — COA on request · Research use only · Crypto & card payment options. No invented customer or review counts; no hard SKU digit in the hero strip. PDP stars left alone.
- **Calculator CTAs**: `/tools/reconstitution`, `/tools/dilution`, `/tools/unit-converter` carry primary **Request catalog** (`/#catalog`) and **Inquire** (`/contact`) buttons — navy `#0d2137` / gold / cream `#F2EFE9`. No green. No Buy now.
- **Unit converter**: RUO framing; mg ↔ mcg ↔ ng kept; mg→IU FAQ and math use only a **declared** mass-per-IU factor (never a compound-specific invented factor).
- **Dilution**: FAQ for mg/mL laboratory concentration math (C1V1 = C2V2). Research calculations only — not medical advice.
- **Tools hub**: Top grid is 01 Reconstitution / 02 Dilution / 03 Unit converter (compound comparison stays below).
- **Unchanged**: Homepage hero / Popular catalog / PDP split. Calculator arithmetic and existing GA (`reconstitution_calc`, `dilution_calc`, `tool_inquire`) kept. Card path remains CRM UMG authorize from v2.99b.
- Tools CSS query `biolabs_style.css?v=404` (page-local styles; shared stylesheet not rewritten).
- **Parallel tip (no new letter) — G3-R public name**: The former Retatrutide / R3TA listing is **G3-R** only. URL `/products/g3-r`; old paths `/products/retatrutide`, `/products/r3ta`, `/products/reta` 301 here. Alt / OG: `G3-R {dose} research vial`. Does not take the v2.99c letter from calculator-seo-finish. Quote remains v2.99d.
- **G3-R visual lock**: Live GLOW-chrome vial (`vial-g3-r.png` / `.webp`, 10/20/50) gold-band text is **G3-R** (unified gold cap / BIO LABS chrome from the GLOW-70 master). Qty packs and search/blog thumbs match. Tip stays **v2.99c** (folded with calculator-seo-finish).

---

# biolabsresearch.co — Version 2.99b

Released 2026-09-17.

Codename: umg-checkout-hook

## Highlights

- **Checkout card**: Replace the card simulation with `POST https://crm.biolabsresearch.co/api/checkout/charge` (CRM storefront charge SoT). Crypto USDT/USDC path unchanged.
- **Authorize gate**: Success UI and GA `checkout_complete` fire only when the charge body has `ok===true`. Decline (often HTTP 402) shows a clear error; no cascade copy.
- **PCI hygiene**: Full PAN/CVV never written to console, `localStorage`, or storefront `/api/*`. Last four + CRM order id only. `idempotencyKey` camelCase (plus `extOrderId` alias); never `idempotency_key`.
- **Copy**: Remove “Simulation only — your card is not charged”. CTA **Place order**. RUO footer kept. Navy `#0d2137` / gold / `#F2EFE9`. Homepage hero / Popular catalog / PDP split SoT untouched.
- New module `html/checkout-charge.js?v=3`. Shared `cart-vial.js` not rewritten.

---

# biolabsresearch.co — Version 2.99a

Released 2026-09-17.

Codename: related-stock-hide-fab-clear

## Highlights

- **Related cards**: Remove In stock / Out of stock badges from Pairs-well / related product cards. Marketing lock: no IN STOCK unless API-true; Yehuda: do not invent stock. Badge markup removed from `product-marquee.js` (shared script, required) + CSS hide.
- **FAB clear-zone**: Restore v2.98o standard @320–390 — icon-only 48px corner FAB; home hero CTAs, catalog View details/ATC, tools `.tr-wrap`/`.tr-cards` clear of the dock. Beats `html body .hero + .catalog-section` padding-right:24px that overrode 2.98o.
- **Unchanged**: PDP split / trust / Overview|Specs|Docs from v2.99. Homepage hero + Popular catalog design locked (hero in-stock pill stays). Science/terms FAB hidden; COA Close above sticky nav (2.98l/o).
- CSS `biolabs_style.css?v=403`. Navy `#0d2137` / gold / `#F2EFE9` only.

---

# biolabsresearch.co — Version 2.99

Released 2026-09-17.

Codename: pdp-institutional-split

## Highlights

- **PDP split**: Every catalog product page uses an institutional two-column layout — vial photo left (square 1:1, `#F2EFE9`, `object-fit: contain`), buy panel right. No thumbnail strip.
- **Buy panel**: Product name → strength (mg) → 1/2/3 bottle packs (existing `qty-upsell.js` math) → unit price → **ADD TO CART**. Cart/ATC/pack pricing unchanged.
- **Trust row** under CTA: **Research use only · Lot docs on request · COA on request**. No HPLC invented, no stars, review counts, In stock, or Ships today.
- **Tabs**: Overview | Specs | Docs only. Docs is inquire / Request lot COA (no fake PDF / HPLC / MS downloads). Overview feature grid is RUO-safe.
- **Chrome**: Yehuda split structure with navy `#0d2137` / gold / `#F2EFE9`. No thumbnail strip. No IN STOCK on PDP media.
- **Mobile**: photo stacked above buy; 44px tap targets; ATC full-width; floating View cart does not cover ATC.
- **qty-upsell.js**: packs mount inside `.pdp-buy-col` (no full-width span). Commit note: shared script touched only for layout mount.
- CSS `biolabs_style.css?v=402`. Homepage hero + Popular catalog cards not restyled.
- **Keeps v2.98o**: FAB clear-zones (home/catalog/tools), `#coa-modal` z-index above sticky nav, science/terms FAB hide.

---

# biolabsresearch.co — Version 2.98

Released 2026-09-17.

Codename: catalog-filters-card-layout

## Highlights

- **Popular grid**: competitor-style toolbar (search + Categories / Strengths / Availability / Documentation + Sort) above existing SKUs.
- **Cards**: cream `#F2EFE9` canvas, white rounded cards, navy/gold chrome; dual CTAs **View details** + **ADD TO CART**.
- **Trust microcopy**: **COA on request** · **Lot docs**. No Lot matched, IN STOCK, SHIPS TODAY, or stars on cards. Hero in-stock pill unchanged.
- **Filters**: wired from card/API category, strength chips, `stock_status`. Documentation is a stub (lot docs on request; no per-SKU file flag / no invented counts).
- CSS `biolabs_style.css?v=385`. Hero + Popular header copy locked.

---

# biolabsresearch.co — Version 2.95

Released 2026-09-17.

Codename: lab-calculators-reconstitution-dilution

## Highlights

- **NEW** `/tools/reconstitution` — vial amount (mg) + diluent volume (mL) → concentration; optional aliquot mass. Client-side only.
- **Upgrade** `/tools/dilution` — unique C1V1 = C2V2 + serial fold helper (no longer a twin of reconstitution math).
- **SEO**: both pages `index,follow` with unique title/meta. `/tools/solution-dilution` 301 → reconstitution (same former math). `/tools/units` stays 301 → unit-converter (SEO #22 thin alias; not dilution).
- **Copy lock**: RUO near results; CTAs Request catalog / Inquire; no dosing or Buy language.
- **GA4** (after Cookie Accept via `blrTrack`): `reconstitution_calc`, `dilution_calc`, optional `tool_inquire`.

---

# biolabsresearch.co — Version 2.94

Released 2026-09-16.

Codename: sitewide-qty-upsell-packs

## Highlights

- **Qty packs**: Sitewide 1/2/3 bottle packs on every catalog PDP (Semax-style strength → qty).
- **Math**: Pack units `U / round(U×89/99) / round(U×79/99)` from live strength list prices.
- **Chrome**: RUO/catalog only — qty · pack; no consumer save/deal language.
- **version.json**: Synced to 2.94 (meta/footer already stamped; clears ELITE soft-note vs 2.90).

---

# biolabsresearch.co — Version 2.80

Released 2026-09-16.

Codename: promo-chrome-strip

## Highlights

- **Promo bar**: Permanently empty `#promoStack` on products/blog/tools/shipping/science/etc. — match home (hidden + comment only). No visible “25% off / INSIDER25 / ends in”.
- **PDPs**: Stop SSR struck `.price-original` and JS `origHtml` strike + `price-launch-note` when no active promo (`ACTIVE_PROMO = false` / `origHtml = ''`).
- **promo-bar.js**: Keep noop stub so cached script tags do not 404.
- **ATC / prices**: Unchanged. v2.79 catalog cover + Popular research compounds kept.

---

# biolabsresearch.co — Version 2.79

Released 2026-09-16.

Codename: catalog-cover-marketing-header

## Highlights

- **Images**: Catalog / product cards / Pairs / cart use `object-fit: cover` again (Yehuda reverted home contain). Remove v2.78 catalog contain overrides. PDP mains stay `contain`.
- **Catalog header (Marketing SoT)**: Title **Popular research compounds**; short RUO supporting sentence; **View all compounds** link; lot docs available on request (not implying every SKU has a live file).
- **ATC**: Keep ADD TO CART.

---

# biolabsresearch.co — Version 2.75

Released 2026-09-15.

Codename: agegate-brand-unify

## Highlights

- **Age-gate**: Standardize ALL pages with `#tcOverlay` to full PDP modal (logo SVG, long RUO text, three checks with `tc-check-text`, Enter + hint + © foot)
- **Age-gate**: Fix short homepage/blog/static modals; fix divergent `curcumin-phytosome` + `checkout` markup
- **Brand**: Replace visible/meta/title/JSON-LD `Bio Labs Research` → `BioLabs Research` (vial art unchanged)
- Keep existing gate JS behavior (no autofocus on first checkbox)

---

# biolabsresearch.co — Version 2.72

Released 2026-09-15.

Codename: rsay-ftc-strip-verified-dist

## Highlights

- **FTC / Marketing**: Remove ✓ Verified reviewer badges from “What researchers say” cards
- **FTC / Marketing**: Remove star distribution bars (92/6/1/1/0) under aggregate rating
- **Keep**: olive stars, 4.9/5, carousel names/quotes (review-count line later removed in 2.99c)
- CSS `biolabs_style.css?v=360`

---

# biolabsresearch.co — Version 2.68

Released 2026-09-15.

Codename: claim-lot-docs-accurate

## Highlights

- **Compliance**: Replace “Twenty research compounds with lot documentation available on request” with issued-lot wording
- **Home**: Hero H1 → lot COA on request; COA card no universal vial→COA map; Lot stat “when issued” (not “matched”)
- **Shipping**: Step title “Confirmed lot identity” (COA/SDS available when required)
- science.html meta already accurate — no every-compound lot-docs claim

---

# biolabsresearch.co — Version 2.67

Released 2026-09-15.

Codename: seo-rank-22-p0-p1

## Highlights

- **P0 SEO**: `/tools/units` nginx 301 → `/tools/unit-converter` (was try_files); dilution/units HTML `noindex,follow` + canonical to live tools
- **P0 stubs**: curcumin-phytosome-identity `noindex,follow`; `/products/product` `noindex,nofollow`; `blog.html` `noindex,follow`; `/product` canonical → `/research-peptides` (keep noindex)
- **P1**: `og:image` + `twitter:image` on all 11 `/compare/*` + tools pages missing them (`/media/og-preview.jpg?v=2`)

---

# biolabsresearch.co — Version 2.64

Released 2026-09-15.

Codename: dose-chips-44

## Highlights

- **Mobile dose/strength chips ≥44×44px** tap targets under `max-width: 800px` (covers ≤768)
- Selectors: `.product-card-mg`, `.size-btn`, `.mg-picker .mg-btn` / `.mg-picker button`, `.size-chip`, `.dose-chip` (aliases on catalog + PDP amount pills)
- Padding 10×14 so labels still fit; desktop look unchanged; researchers-say carousel untouched
- CSS `biolabs_style.css?v=357`; age-gate + cart untouched

## v2.94c — 2026-09-17
- Hero trust strip under CTAs (4.8★ / 12k+ reviews / 65k+ customers / Same-day dispatch)
- Replaces former nl-ruo line; RUO kept elsewhere

## v2.94d — 2026-09-17
- Revert unsubstantiated hero social-proof strip (Marketing/ELITE FTC flag)
- Restore RUO disclaimer under hero CTAs

## v2.94e — 2026-09-17
- Hero trust SoT then: compound count + invented customer count + Lot docs on request (superseded in 2.99c)

## v2.94f — 2026-09-17
- Unhide hero trust SoT (CSS override of v1.25 display:none)

## v2.96 — 2026-09-17
- Hero split redesign (brand colors, our vial, Lot docs badge)
- Strip unverified carousel star proof

## v2.97a — 2026-09-17
- Restore homepage tools h2 to **Plan your order before you buy**
- Drop C1V1 dilution from tools lead; keep dilution calculator card

## v2.97c — 2026-09-17
- Restore tools h2 to **Laboratory research calculations** (Yehuda SoT)
- Restore C1V1 dilution in tools lead; remove Plan your order

## v2.97d — 2026-09-17
- Remove only **Compound comparison (04)** card from `/tools` top grid (Yehuda red circle)
- Leave Compare research compounds section untouched

## v2.97e — 2026-09-17
- Remove only the hero feature that claimed testing availability without a lot file
- Keep Lot docs / HPLC / Traceable

## v2.97f — 2026-09-17
- Remove only hero vial **Lot docs** photo badge (`nl-photo-badge`)
- Keep trust Lot docs on request + Lot-specific documentation feat

## v2.97g — 2026-09-17
- Add only small **in stock** pill (green dot) upper-left on hero vial photo

## v2.98a — 2026-09-17
- Fix catalog ATC + View details clicks (actions z-index/pointer-events)
- Kill card hover translateY shake

## v2.98b — 2026-09-17
- Remove only Popular `<p class="catalog-ruo">Research use only</p>`

## v2.98c — 2026-09-17
- Stabilize View details hover (color only; no layout jump)

## v2.98d — 2026-09-17
- Restore Popular **Research use only** under title in gold

## v2.98e — 2026-09-17
- Mobile floating View cart: bottom-right + catalog padding (no overlap on first-row cards)

## v2.98f — 2026-09-17
- Catalog card bottom clear-zone + icon-only floating View cart (no CTA overlap @320–414)

## v2.98g — 2026-09-17
- Sitewide FAB clear-zone; COA modal overflow @320; cart close above nav

## v2.98h — 2026-09-17
- Hide FAB on science/terms; COA modal no overflow @320

## v2.98i — 2026-09-17
- COA modal mobile: fix overflow + visible Download PDF

## v2.98j — 2026-09-17
- Fix #coa-request-modal overflow @320 (Request lot COA form)

## v2.98k — 2026-09-17
- Force-stack COA request name fields; kill @320 horizontal scroll
- PDP footer/meta synced sitewide to 2.98k (ELITE version gate)

## v2.98l — 2026-09-17
- Raise COA modals above sticky nav (ELITE Close FAIL)

## v2.98m — 2026-09-17
- Restore FAB clear-zone: icon FAB + right gutter + catalog CTA padding (ELITE FAIL)

## v2.98n — 2026-09-17
- Tools FAB clear-zone for .tr-cards (Soft-QA FAIL on /tools)

## v2.98o — 2026-09-17
- Home primary CTA / catalog FAB clear-zone without touching tools
