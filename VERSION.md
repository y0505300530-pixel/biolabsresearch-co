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
