# AGENTS.md — biolabsresearch.co

Static storefront for research peptides, research use only. There is no build step: the files under
`html/` are served as they are. Product data, prices, discounts and orders come from a Node API
mounted at `/api/`; nothing in this repo stores them.

The same files are also served on a second domain, `blrcommerce.io`.

## Layout

| Path | What it is |
|---|---|
| `html/index.html` | home page and catalog grid |
| `html/products/*.html` | 16 product pages, plus `product.html` — a template, not a public page |
| `html/blog/*.html` | 27 articles and `index.html` |
| `html/compare/`, `html/tools/` | comparison pages and calculators |
| `html/checkout.html` | order form; card path POSTs to CRM `/api/checkout/charge`; crypto still notifies `/api/notify-order` |
| `html/*.js` | shared scripts loaded by every page |
| `html/biolabs_style.css` | the only stylesheet |
| `html/sitemap.xml` | must list every public page |

## Shared scripts — do not rewrite

These are maintained by infra (Alejandro) and carry fixes the pages depend on. If you need different
behaviour, change the page. If a shared script really must change, say so in the commit message.

- `cart-vial.js` — cart storage, drawer, quantity controls, suggestions, coupon lookup, analytics events.
- `mg-picker.js` — the dosage picker on product pages and the prices it drives.
- `prices-sync.js` — replaces rendered prices with the catalog's.
- `email-capture.js` — subscribe box; writes the analytics token.
- `product-marquee.js` — the "Pairs well at the bench" rail.

The cookie banner (`consent.js`) is injected by nginx and is not in this repo. Do not add a second one.

## Rules

**Prices come from `/api/products`. Never from a list written into a page or a script.**
The catalog carries `price`, `original_price`, `strengths`, `strength_prices`, `strength_originals`.
For most products `strengths[0]` is the *smaller* dose while `price` is the price of the *largest* one.
So a card that prints a strength must print that strength's price from `strength_prices`, and a
strikethrough must come from `strength_originals`. Never put a 5 mg label next to the 10 mg price.
If a product has no `strength_originals`, show no strikethrough rather than the base one.

**Every cart line carries a strength.** An add button must pass `data-mg`, and the resulting line must
hold `mg` and the price of that dose, as a number. A line without a strength reaches the warehouse as
"which vial?" and the server cannot check the price against it.

**Call the API with relative paths** — `/api/products`, not `https://biolabsresearch.co/api/products`.
The site runs on two domains and an absolute address breaks the second one.

**Product pages: `updateQty` must declare its cart.** Every `products/*.html` needs
`var cart = getCart();` at the top of `updateQty` and must call `saveCart(cart)` with the argument.
Calling `saveCart()` with no argument writes an empty cart and wipes the visitor's basket.
After touching a product page, click plus, minus and remove in the drawer and confirm the count changes.

**Width.** `document.documentElement.scrollWidth` must not exceed `window.innerWidth` at 375 and 390 px.
Wide tables and long link text are the usual causes.

**Every page ends with the site footer**, the one in `index.html`, which carries the research-use-only line.

**`sitemap.xml` lists every public page.** Add a page, add its URL. Keep out `admin.html`, `404.html`,
`checkout.html`, the Google verification file and the `product` template.

**No account language.** There are no accounts, no login, no order tracking. Do not write "sign in",
"my account" or "track your order" anywhere.

**No invented facts.** No purity percentages, no fabricated reviews, no dosing or human-use advice.
Certificates are "on request" unless a real file exists.

**Science FAQ is filled from CRM.** Keep `id="faq"` on the FAQ section in `science.html`.
A script injects the live copy from `/api/site-copy`. If the id is removed, visitors see the old
hardcoded cards and edits in CRM Site texts do not appear.

## Card payments

**Owner decision (2026-09-17, v2.99b `umg-checkout-hook`):** The storefront card path POSTs
customer + card fields from the browser to the CRM sidecar
`https://crm.biolabsresearch.co/api/checkout/charge` (UMG authorize). The storefront does not call
`pay.umg.inc` and does not send PAN/CVV to storefront `/api/*`. Infra (Alejandro) reviews before
customers see live charges — see `QA_TASKS.md` P1.

**No card data on the storefront Node service.** Never add a field, script or route that sends a
full card number, expiry date or CVV to `/api/*` on this site, the Node service behind it, or a new
endpoint in this repo. Card details leave the browser only for the CRM charge URL above.

**Do not install or port the UMG WooCommerce plugin.** This site is not WordPress. Do not copy that
plugin's checkout script: it prints the card number and CVV to the browser console.

**No payment keys in the repo**: not in pages, scripts, commit messages or logs. Secret keys live in
the server environment, managed by infra.

**Keep only the last four digits** of the card and the provider's transaction ID with an order.
CVV is never stored or logged. Do not `console.log` charge request or response bodies (they can
contain PAN).

**The amount to charge** is the cart total sent to the CRM sidecar; CRM/UMG is the system of record
for authorize. Do not treat a redirect or callback alone as paid.

**Show only what works.** No Apple Pay or Google Pay logos unless the provider really takes those
payments. Success UI and GA `checkout_complete` fire only when the charge response has `ok===true`.
Do not show cascade / "trying another processor" copy.

**Before payment code goes live**, add a row to `QA_TASKS.md` with owner `infra`. An exception to
these rules needs a written decision by the business owner, recorded in this file.

## Working here

- Small commits with a readable prefix: `fix:`, `feat:`, `content:`, `Shop fix:` (infra).
- The working copy on the server is live. Check `git status` before you edit a file: if someone else
  has uncommitted changes in it, leave it alone and come back later.
- Never `git reset --hard`, `git clean` or `git stash` here.
- Open tasks with owners are in `QA_TASKS.md`. Mark what you finish.
