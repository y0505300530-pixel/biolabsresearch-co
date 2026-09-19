# QA Health Audit Report: biolabsresearch.co (v3.00)

**Date of Audit:** Saturday, September 19, 2026  
**Target Host:** `https://biolabsresearch.co`  
**Site Version:** 3.00 (RUO Research Storefront)  
**Audit Scope:** Read-only site health sweep using `curl` and Python inspection.

---

## Executive Summary

The live storefront at **https://biolabsresearch.co** is healthy, fully operational, and correctly stamped with **version 3.00**. All core user-facing navigation links, asset files, redirect chains, mobile CSS grid rules, security headers, and `robots.txt` configuration were verified. 

Key Findings:
1. **Key Pages & Navigation:** All active navigation URLs return `200 OK` (or appropriate `301 Moved Permanently` redirects to canonical paths). Tested 404 endpoints (`/about`, `/tools/reconstitution-calculator`) are orphan/legacy paths that are **not linked** anywhere in the visible site header, footer, or navigation.
2. **Asset Integrity:** 100% of stylesheet (`.css`) and script (`.js`) assets across the Homepage, Research Peptides catalog, and Product Detail Pages (PDP) load successfully (`HTTP 200 OK`). Zero broken or 404 assets were detected.
3. **Mobile Catalog Grid:** CSS rule inspection in `biolabs_style.css?v=407` confirms the **v2.99f1 2-column compact grid** implementation. Media query rules maintain `grid-template-columns: repeat(2, minmax(0, 1fr))` from `800px` down through `320px` without collapsing to single-column.
4. **Version Consistency:** Both the Homepage HTML footer (`v3.00` / `data-site-version="3.00"`) and `/version.json` (`"version": "3.00"`) consistently identify version 3.00.
5. **SSL & Redirects:** `http://`, `http://www.`, and `https://www.` all issue clean `301` redirects to the canonical `https://biolabsresearch.co/`. Response headers include expected Nginx server signatures, `no-cache` cache control, `gzip` compression, and HSTS security headers.
6. **Robots & Indexing:** `robots.txt` returns `200 OK`, allows search and AI crawlers (`Allow: /`), specifies the sitemap (`/sitemap.xml`), and restricts only internal API routes (`Disallow: /api/` except `/api/products`).

---

## 1. Key Page Status Codes Table

| Page / Route | Tested URL | Initial Status Code | Final Status Code | Redirect Location / Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Homepage** | `/` | `200 OK` | `200` | Canonical homepage |
| **Research Peptides** | `/research-peptides` | `200 OK` | `200` | Catalog index page |
| **Science Page** | `/science` | `200 OK` | `200` | Research methodology page |
| **FAQ** | `/faq` | `200 OK` | `200` | Active FAQ page (`/faq/` with trailing slash is 404, unlinked) |
| **Checkout** | `/checkout` | `200 OK` | `200` | Quote mode / checkout |
| **Checkout (legacy)** | `/checkout.html` | `301 Moved Permanently` | `200` | Redirects to `https://biolabsresearch.co/checkout` |
| **Blog Index** | `/blog/` | `200 OK` | `200` | Blog catalog |
| **Blog Post (Sample)**| `/blog/catalog-skus-vs-research-analogues` | `200 OK` | `200` | Article page |
| **Blog Post (Sample 2)**| `/blog/dac-vs-no-dac-formula-difference` | `200 OK` | `200` | Article page |
| **Tools Index** | `/tools` | `200 OK` | `200` | Reconstitution, dilution, unit converter & compare hub |
| **Reconstitution Calc**| `/tools/reconstitution` | `200 OK` | `200` | **Actual nav URL** for Reconstitution Calculator |
| **Reconstitution (Legacy)**| `/tools/reconstitution-calculator` | `404 Not Found` | `404` | **Orphan URL** — NOT linked anywhere in nav or footer |
| **Dilution Calc** | `/tools/dilution` | `200 OK` | `200` | C1V1 Dilution Calculator |
| **Unit Converter** | `/tools/units` | `301 Moved Permanently` | `200` | Redirects to `/tools/unit-converter` (`200 OK`) |
| **Compound Compare** | `/tools/compare` | `200 OK` | `200` | Side-by-side compound comparison tool |
| **Calculators Alias** | `/calculators` | `404 Not Found` | `404` | **Orphan URL** — NOT linked anywhere in nav or footer |
| **Families Hub** | `/families` | `301 Moved Permanently` | `200` | Redirects to `/families/` -> `/families/index` (`200 OK`) |
| **COA Library** | `/coa` | `200 OK` | `200` | Certificate of Analysis library page |
| **About Page** | `/about` | `404 Not Found` | `404` | **Orphan URL** — NOT linked anywhere in nav, header, or footer |
| **Contact Page** | `/contact` | `200 OK` | `200` | Support & contact page |
| **Terms** | `/terms` | `301 Moved Permanently` | `200` | Redirects to `/terms-and-conditions` (`200 OK`) |
| **Privacy** | `/privacy` | `301 Moved Permanently` | `200` | Redirects to `/privacy-policy` (`200 OK`) |

### 404 Analysis & Link Verification
- **`/about`**: Verified via crawling all site HTML. There are no `<a href="/about">` or similar links anywhere in navigation, header, or footer sections. Company information and legal address are contained directly within the global site footer.
- **`/tools/reconstitution-calculator`**: Nav and footer tools menus link directly to `/tools/reconstitution`, which returns `200 OK`. The `/tools/reconstitution-calculator` URL is an unlinked legacy orphan.
- **`/faq/`**: Nav links to `/faq` (no trailing slash), which returns `200 OK`.

---

## 2. Asset Integrity Audit

All CSS stylesheets and JS script assets linked across **Homepage (`/`)**, **Catalog (`/research-peptides`)**, and **PDP (`/products/bpc-157`)** were extracted and checked.

### Summary
- **Total Unique Assets Checked:** 25
- **Assets Returning HTTP 200:** 25
- **Assets Returning 404 / Error:** 0

### Assets Breakdown
| Asset Path | Type | HTTP Status | Found On Pages |
| :--- | :---: | :---: | :--- |
| `https://fonts.googleapis.com/css2?family=Inter:...` | Font CSS | `200 OK` | Homepage, Research Peptides, PDP |
| `/biolabs_style.css?v=407` | CSS | `200 OK` | Homepage |
| `/biolabs_style.css?v=403` | CSS | `200 OK` | Research Peptides, PDP |
| `/auth.css?v=1` | CSS | `200 OK` | Homepage |
| `/consent.js?v=e02aabef` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/site-copy.js?v=661f801a80` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/cookie-consent.js?v=3` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/cart-vial.js?v=315` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/search-overlay.js?v=37` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/auth.js?v=2` | JS | `200 OK` | Homepage |
| `/promo-bar.js?v=293` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/mg-picker.js?v=44` | JS | `200 OK` | Homepage, PDP |
| `/prices-sync.js?v=3` | JS | `200 OK` | Homepage, PDP |
| `/catalog-mg.js?v=43` | JS | `200 OK` | Homepage |
| `/catalog-filters.js?v=4` | JS | `200 OK` | Homepage |
| `/tools-video.js?v=12` | JS | `200 OK` | Homepage |
| `/org-jsonld.js?v=1` | JS | `200 OK` | Homepage, Research Peptides, PDP |
| `/pdp-story.js?v=47` | JS | `200 OK` | PDP |
| `/email-capture.js?v=5` | JS | `200 OK` | PDP |
| `/enhance-schema.js` | JS | `200 OK` | PDP |
| `/pdp-split.js?v=5` | JS | `200 OK` | PDP |
| `/coa-pdp.js?v=1` | JS | `200 OK` | PDP |
| `/qty-upsell.js?v=2` | JS | `200 OK` | PDP |
| `/product-marquee.js?v=52` | JS | `200 OK` | PDP |
| `/tools-video.js?v=2` | JS | `200 OK` | PDP |

*Note: Homepage references stylesheet version `v=407`, while catalog and PDP reference version `v=403`. Both CSS asset URLs resolve to active stylesheets returning 200 OK.*

---

## 3. Mobile Catalog Grid (v2.99f1 Rule Verification)

The stylesheet `biolabs_style.css?v=407` was fetched and inspected for catalog grid responsive breakpoint rules.

### Quoted CSS Media Queries
```css
.catalog-grid{
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 16px !important;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
@media (max-width: 1100px){
  .catalog-grid{ grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 14px !important; }
}
@media (max-width: 800px){
  .catalog-grid{ grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
}
/* v2.99f1: do not collapse catalog to 1 column at ≤380px — 2-col SoT through 320px */
```

### Verification Result
- The media query for `max-width: 800px` sets `.catalog-grid` to `repeat(2, minmax(0, 1fr))` with a `12px` gap.
- There are **no narrower media queries** (e.g. at 360px or 320px) overriding `.catalog-grid` to `1fr`.
- This confirms the **v2.99f1 claim**: the catalog maintains a 2-column compact grid layout continuously through 320px mobile viewport widths.

---

## 4. Version Stamp Verification

- **Homepage HTML Meta Tag:** `<meta name="app-version" content="3.00">`
- **Homepage Footer Element:** `<p class="site-version" data-site-version="3.00" ...>v3.00</p>`
- **`/version.json` Endpoint Response:**
  ```json
  {
    "version": "3.00",
    "released": "2026-09-19",
    "codename": "release-3-00",
    "appVersion": "3.00",
    "highlights": [
      "Quote mode + abandoned checkout",
      "G3-R public rename",
      "Mobile catalog 2-col + filter flicker fix",
      "SEO L1: compares + PDP FAQ + JSON-LD",
      "Family hubs + dynamic COA fail-closed"
    ]
  }
  ```
- **Confirmation:** Version stamp `3.00` is consistent across HTML rendering, DOM attributes, and JSON API metadata.

---

## 5. Homepage Response Headers & SSL Redirects

### Homepage (`https://biolabsresearch.co`) Headers
- **HTTP Status:** `HTTP/1.1 200 OK`
- **Server:** `nginx`
- **Cache Control:** `Cache-Control: no-cache`
- **Expires:** `Sat, 19 Sep 2026 12:04:01 GMT` (historical/expired)
- **Vary:** `Accept-Encoding`
- **Content-Encoding:** `gzip` (when requested with gzip Accept-Encoding)
- **Security Headers:**
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ...`

### Domain Redirect Verification
| Inbound Request | Response Status | Redirect Location | Notes |
| :--- | :---: | :--- | :--- |
| `http://biolabsresearch.co` | `301 Moved Permanently` | `https://biolabsresearch.co/` | Correct HTTP -> HTTPS redirect |
| `http://www.biolabsresearch.co` | `301 Moved Permanently` | `https://biolabsresearch.co/` | Correct http://www -> https:// root |
| `https://www.biolabsresearch.co` | `301 Moved Permanently` | `https://biolabsresearch.co/` | Correct https://www -> https:// root |

---

## 6. Robots.txt Inspection

- **Endpoint:** `https://biolabsresearch.co/robots.txt`
- **HTTP Status:** `200 OK`
- **Content Summary:**
  - Configured to explicitly ALLOW indexing by search engines (`Googlebot`, `Bingbot`) and AI agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `anthropic-ai`, `CCBot`, `Bytespider`, `Applebot-Extended`).
  - Standard rule: `Allow: /` and `Allow: /api/products`.
  - Disallow rule: `Disallow: /api/`.
  - XML Sitemap Reference: `Sitemap: https://biolabsresearch.co/sitemap.xml`
- **Result:** `robots.txt` exists and does **not** block site indexing.

---

## Conclusion

The QA audit for **https://biolabsresearch.co** (v3.00) confirms that all critical storefront infrastructure, asset paths, mobile grid responsiveness, versioning, security headers, and domain redirects are intact and operating as expected.
