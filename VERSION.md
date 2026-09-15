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
