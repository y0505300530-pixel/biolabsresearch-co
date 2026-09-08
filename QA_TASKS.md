# QA_TASKS.md

Open work on biolabsresearch.co, from the QA run of 2026-09-07 (57 pages, 11 device and browser
combinations, plus two visual reviews). Severity: **High** means a common device breaks the journey or
the customer is misled about price or product. **Medium** means it works, but awkwardly.

Owners: **pages** — whoever is editing the HTML and CSS. **infra** — Alejandro, the shared scripts,
nginx and the API. **decision** — needs the owner of the business to choose.

Mark what you finish: `done (owner, date)`. Do not delete rows; a closed row is the record that it
was closed.

## High

| # | Finding | Owner | Status |
|---|---|---|---|
| H1 | Plus, minus and remove in the cart drawer did nothing on 17 product pages: `updateQty` used an undeclared `cart` and called `saveCart()` with no argument, which writes an empty cart | pages | done (pages, 2026-09-08) |
| H2 | The discount code on checkout did nothing and the page could not say what a code was worth | infra | done (infra, 2026-09-07) |
| H3 | Five blog articles were up to four times wider than a phone screen | infra | done (infra, 2026-09-07) |
| H6 | The same product carried different prices depending on where you looked: "Pairs well at the bench" printed a 5 mg label with the 10 mg price, and the strikethrough on a product page did not follow the selected dose | infra | done (infra, 2026-09-08) |
| H7 | Items added from the cart suggestions, the product rail and the catalog cards carried no strength at all, so an order did not say which vial to ship | infra | done (infra, 2026-09-08) |

## Medium

| # | Finding | Owner | Status |
|---|---|---|---|
| M1 | The certificate viewer exists on product pages but no button opens it; the only visible control is *Request COA*, which opens a form | pages | open |
| M2 | FAQ answers print on top of the questions below them on a phone, six overlapping pairs | pages | open |
| M3 | The country selector on checkout has no label and no accessible name | pages | open |
| M4 | The menu button on the home page has no accessible name | pages | open |
| M5 | The contact page has no contact form, only an email address | decision | open |
| M6 | Pages missing from `sitemap.xml` | pages | done (pages, 2026-09-08; `/contact` added by infra the same day, 63 URLs) |
| M7 | The social preview image is a relative address on 16 product cards, so shared links show no image | pages | done (pages, 2026-09-08) |
| M8 | Product photos are served far larger than they are displayed, for example 1536 px shown at 163 px | pages | open |
| M9 | The page template is publicly reachable at `/products/product` and has no product behind it | pages | open |
| M10 | Nine colour-contrast failures at the level automated tools call serious | pages | partly done (pages, 2026-09-08) |
| M11 | No blog page carried the site footer, and 21 of them printed a leftover of an earlier edit as visible text | infra | done (infra, 2026-09-08) |
| M12 | The contact page was served with no stylesheet at all | pages | done (pages, 2026-09-08) |
| M13 | Visitors with "reduce motion" turned on see the promo bar as a static wall of repeated text on every page | pages | open |
| M14 | The header wordmark "Biolabs research" does not sit on the same baseline as the menu items. The header was changed four times on 7 and 8 September | pages | open |
| M15 | The support line in the footer is barely readable: `#4A4A4A` text on a `#161310` ground. It now appears on the blog pages too, because they gained the site footer | pages | open |
| M16 | The `support-status` dot in the footer stays empty everywhere except the home page: the script that fills it is inline in `index.html` | pages | open |
| M17 | On checkout, the plus and minus on the free BAC-water line call `saveCart()`, which does not exist on that page, so the click throws | pages | open |
| M18 | Four scripts each fetch `/api/products` on every page view: `cart-vial`, `mg-picker`, `prices-sync` and, on product pages, `product-marquee`. One shared request would do | infra | open |

## Needs a decision from the owner

| # | Question | Status |
|---|---|---|
| D1 | The home page card shows the price of the largest dose while the product page opens on the smallest, so the same product reads $69 on one page and $34 on the next. Show "from $34", or open the product page on the larger dose? | open |
| D2 | Review texts and author names on the site are invented | open |
| D3 | Leftovers of the old BioFirst brand and links to biofirst.co | open |
| D4 | The public GitHub repository holds `html.bak.*`, `docs/nginx-enabled.bak-telehealth-*` and `_base44-brief/`. Make the repository private, or remove those from it | open |
| D5 | One catalog card on the home page has a black background while the rest are cream (commit `a39cc7b`, "Catalog vial diversification"). Deliberate, but a single dark card among cream ones reads as a mistake to a visitor. Infra will not change it without a decision | open |
| D6 | The promo bar counts down to 2026-09-14 23:59:59 +03:00 (commit `8889211`), but the INSIDER25 code on the server has no end date at all: `COUPONS = { INSIDER25: 25 }` in the API. Either give the code the same end date on the server, or take the date off the bar. Needs deciding before 14 September | open |

## Not reproduced

Four items raised by the visual review did not survive a live check and should not be worked on: the
promo bar covering article headings on a small iPhone, a uniquely broken 404 page, the site menu
appearing instead of the cart, and the closed cart panel showing at the right edge. The first two came
from low-resolution thumbnails; the third was an artefact of the test tooling.
