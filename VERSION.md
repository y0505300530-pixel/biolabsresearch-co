# biolabsresearch.co — Version 2.99c

Released 2026-09-19.

Codename: calculator-seo-finish

## Highlights

- **Red 1**: Blog + compare bacteriostatic vs sterile water — usage-scenario table removed; neutral lab comparison only; third-person body; RUO above the fold. Banned phrases (`which one does your` / `your protocol` / `you’ll open` / `open the vial`) zero on those URLs. Titles/H1/canonical unchanged.
- **Red 3**: Homepage hero trust — no 45K+, no 1,200 reviews, no hard SKU count. Trust line is COA on request · Research use only · Crypto & card payment options. PDP stars left alone.
- **Calculator CTAs**: `/tools/reconstitution`, `/tools/dilution`, `/tools/unit-converter` carry primary **Request catalog** (`/#catalog`) and **Inquire** (`/contact`) buttons — navy `#0d2137` / gold / cream `#F2EFE9`. No green. No Buy now.
- **Unit converter**: RUO framing; mg ↔ mcg ↔ ng kept; mg→IU FAQ and math use only a **declared** mass-per-IU factor (never a compound-specific invented factor).
- **Dilution**: FAQ for mg/mL laboratory concentration math (C1V1 = C2V2). Research calculations only — not medical advice.
- **Tools hub**: Top grid is 01 Reconstitution / 02 Dilution / 03 Unit converter (compound comparison stays below).
- **Unchanged**: Homepage hero / Popular catalog / PDP split. Calculator arithmetic and existing GA (`reconstitution_calc`, `dilution_calc`, `tool_inquire`) kept. Card path remains CRM UMG authorize from v2.99b.
- Tools CSS query `biolabs_style.css?v=404` (page-local styles; shared stylesheet not rewritten).

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
- **Keep**: olive stars, 4.9/5, “Based on 1,200 reviews”, carousel names/quotes
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
- Hero trust SoT: 20 research compounds · 45K+ customers · Lot docs on request (no ★/reviews; no Same-day)

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
- Remove only hero feature **Third-party testing (where available)**
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
