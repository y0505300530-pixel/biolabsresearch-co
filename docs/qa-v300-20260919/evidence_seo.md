# QA Audit Report: BioLabs Research (v3.00)

**Site URL:** [https://biolabsresearch.co](https://biolabsresearch.co)  
**Audit Date:** September 19, 2026  
**Storefront Scope:** SEO L1 Validation & G3-R Rename Verification  
**Audit Methodology:** Read-only verification using `bash` and `curl` / `python` standard libraries.

---

## Executive Summary

| Check # | Audit Task | Status | Details / Key Metrics |
|---|---|---|---|
| **Check 1** | JSON-LD Structured Data | **PASS** | Validated Homepage + 2 PDPs (`/products/g3-r`, `/products/bpc-157`). All schemas parsed with 0 errors. Organization present on Home; Product, Offer, BreadcrumbList, FAQPage present on PDPs. |
| **Check 2** | PDP FAQ Section & Schema Alignment | **PASS** | Visible FAQ accordions exist on both PDPs and match 1:1 with embedded `FAQPage` JSON-LD schema (5 Q&As per PDP). |
| **Check 3** | Compare Matrix Page | **PASS** | `/tools/compare` exists (HTTP 200) and links to compound matrix comparison tools (`/tools/compound-comparison`) and comparison pages (`/compare/bpc-157-vs-tb-500`). |
| **Check 4** | Family Hubs & Spokes | **PASS** | `/families` hub loads (HTTP 200) and links to 4 distinct family spokes (`recovery`, `ghrp-ghrh`, `copper-skin`, `mitochondrial`). All 4 spokes return HTTP 200 and link to PDPs. |
| **Check 5** | G3-R Rename & 301 Redirects | **PASS** | All 6 legacy URLs (`/products/retatrutide`, `/products/retatrutide.html`, `/products/r3ta`, `/products/r3ta.html`, `/products/reta`, `/products/reta.html`) return HTTP 301 pointing to `/products/g3-r`. Target PDP returns HTTP 200 with H1 = "G3-R". |
| **Check 6** | XML Sitemap Verification | **PASS** | `sitemap.xml` contains 107 URLs. Includes `/products/g3-r` and all 4 family spokes. 0 legacy retatrutide/r3ta/reta URLs remain. 8/8 random spot-checked URLs return HTTP 200. |
| **Check 7** | Internal Links Sanity | **PASS** | Extracted 52 unique internal URLs from Homepage & Catalog. Tested 25 unique links: 0 broken links (0 x 404/5xx). |

---

## Detailed Check Findings

### Check 1: JSON-LD Structured Data Verification
- **Homepage (`https://biolabsresearch.co`)**:
  - **HTTP Status:** 200 OK
  - **JSON-LD Parse Errors:** 0
  - **Types Found:** `Organization`, `ImageObject`, `PostalAddress`, `WebSite`, `FAQPage`, `Question`, `Answer`, `ItemList`, `ListItem`
- **PDP 1 (`https://biolabsresearch.co/products/g3-r`)**:
  - **HTTP Status:** 200 OK
  - **JSON-LD Parse Errors:** 0
  - **Types Found:** `Product`, `Brand`, `Organization`, `Offer`, `PropertyValue`, `BreadcrumbList`, `ListItem`, `FAQPage`, `Question`, `Answer`, `ImageObject`, `PostalAddress`
- **PDP 2 (`https://biolabsresearch.co/products/bpc-157`)**:
  - **HTTP Status:** 200 OK
  - **JSON-LD Parse Errors:** 0
  - **Types Found:** `Product`, `Brand`, `Organization`, `Offer`, `PropertyValue`, `BreadcrumbList`, `ListItem`, `FAQPage`, `Question`, `Answer`, `ImageObject`, `PostalAddress`

### Check 2: PDP FAQ Section vs Schema Alignment
- **Visible FAQ Section:** Verified HTML contains visible FAQ content corresponding to question headings/elements.
- **Q&A Sample Alignment (`/products/g3-r`)**:
  1. *How is G3-R stored as listed?* (Matches visible text & schema)
  2. *Where are form and solubility documents?* (Matches visible text & schema)
  3. *How do laboratories request a COA or lot file?* (Matches visible text & schema)
  4. *What purity figure is published for G3-R?* (Matches visible text & schema)
  5. *How are confirmed inquiries shipped?* (Matches visible text & schema)
- **Q&A Sample Alignment (`/products/bpc-157`)**:
  - 5 Q&As present in schema matching visible PDP FAQ elements 1:1.

### Check 3: Compare Matrix Page
- **Hub Page:** `https://biolabsresearch.co/tools/compare` (HTTP 200 OK, H1: "Compare research compounds")
- **Comparison Tool:** `https://biolabsresearch.co/tools/compound-comparison` (HTTP 200 OK, H1: "Compound comparison")
- **Spoke Compare Page:** `https://biolabsresearch.co/compare/bpc-157-vs-tb-500` (HTTP 200 OK, H1: "BPC-157 vs TB-500 for research", lists 5 product PDP links)

### Check 4: Family Hub & Spokes
- **Hub URL:** `https://biolabsresearch.co/families` (Resolves/Redirects to `/families/index`, HTTP 200 OK)
- **Spokes List & Validation:**
  1. `https://biolabsresearch.co/families/recovery` — Status 200 OK — H1: "Recovery research compounds" — Contains 20 PDP links.
  2. `https://biolabsresearch.co/families/ghrp-ghrh` — Status 200 OK — H1: "GHRP / GHRH research compounds" — Contains 20 PDP links.
  3. `https://biolabsresearch.co/families/copper-skin` — Status 200 OK — H1: "Copper-skin research compounds" — Contains 20 PDP links.
  4. `https://biolabsresearch.co/families/mitochondrial` — Status 200 OK — H1: "Mitochondrial research compounds" — Contains 20 PDP links.

### Check 5: G3-R Rename & Legacy Redirects
- **Legacy Redirect Tests (Curl -I):**
  - `https://biolabsresearch.co/products/retatrutide` -> **301** -> Location: `https://biolabsresearch.co/products/g3-r`
  - `https://biolabsresearch.co/products/retatrutide.html` -> **301** -> Location: `https://biolabsresearch.co/products/g3-r`
  - `https://biolabsresearch.co/products/r3ta` -> **301** -> Location: `https://biolabsresearch.co/products/g3-r`
  - `https://biolabsresearch.co/products/r3ta.html` -> **301** -> Location: `https://biolabsresearch.co/products/g3-r`
  - `https://biolabsresearch.co/products/reta` -> **301** -> Location: `https://biolabsresearch.co/products/g3-r`
  - `https://biolabsresearch.co/products/reta.html` -> **301** -> Location: `https://biolabsresearch.co/products/g3-r`
- **Target PDP Validation (`/products/g3-r`)**:
  - **Status:** 200 OK
  - **H1 Element:** `G3-R`
  - **Title Tag:** `G3-R 10 mg — BioLabs Research`
  - **Legacy term "retatrutide" check:** Absent in H1 and Title.

### Check 6: XML Sitemap
- **Sitemap URL:** `https://biolabsresearch.co/sitemap.xml` (HTTP 200 OK)
- **Total URL Count:** 107 URLs
- **G3-R Inclusion:** `/products/g3-r` present
- **Family Spokes Inclusion:** All 4 family spoke URLs present
- **Legacy Term Check:** 0 old retatrutide / r3ta / reta URLs found in sitemap
- **Random Spot-Check (8 URLs):**
  1. `https://biolabsresearch.co/compare/ghk-cu-vs-epithalon` (200 OK)
  2. `https://biolabsresearch.co/contact` (200 OK)
  3. `https://biolabsresearch.co/families/recovery` (200 OK)
  4. `https://biolabsresearch.co/compare/thymosin-alpha-1-vs-epithalon` (200 OK)
  5. `https://biolabsresearch.co/blog/buying-research-peptides-online-guide-2026` (200 OK)
  6. `https://biolabsresearch.co/products/tesamorelin-ipamorelin` (200 OK)
  7. `https://biolabsresearch.co/products/g3-r` (200 OK)
  8. `https://biolabsresearch.co/products/aod-9604` (200 OK)

### Check 7: Internal Links Sanity
- **Total Unique Internal Links Discovered:** 52
- **Sampled Links Tested:** 25 unique internal links
- **Results:**
  - HTTP 200 OK: 25 links
  - Broken Links (404/5xx): 0 links
- **Sampled URLs tested:**
  - `https://biolabsresearch.co/`
  - `https://biolabsresearch.co/blog/`
  - `https://biolabsresearch.co/blog/buying-research-peptides-online-guide-2026`
  - `https://biolabsresearch.co/blog/catalog-skus-vs-research-analogues`
  - `https://biolabsresearch.co/blog/dac-vs-no-dac-formula-difference`
  - `https://biolabsresearch.co/blog/lot-coa-not-purity-percentage`
  - `https://biolabsresearch.co/blog/one-vial-two-cas-numbers`
  - `https://biolabsresearch.co/blog/peptide-purity-and-coa-explained`
  - `https://biolabsresearch.co/coa`
  - `https://biolabsresearch.co/compare/bpc-157-vs-tb-500`
  - `https://biolabsresearch.co/contact`
  - `https://biolabsresearch.co/cookie-policy`
  - `https://biolabsresearch.co/families/`
  - `https://biolabsresearch.co/families/copper-skin`
  - `https://biolabsresearch.co/families/ghrp-ghrh`
  - `https://biolabsresearch.co/families/mitochondrial`
  - `https://biolabsresearch.co/families/recovery`
  - `https://biolabsresearch.co/guide-reading-coa`
  - `https://biolabsresearch.co/media/coa/sample-coa.pdf`
  - `https://biolabsresearch.co/privacy-policy`
  - `https://biolabsresearch.co/products/aod-9604`
  - `https://biolabsresearch.co/products/bpc-157`
  - `https://biolabsresearch.co/products/bpc-157-tb-500-blend`
  - `https://biolabsresearch.co/products/curcumin-phytosome`
  - `https://biolabsresearch.co/products/epithalon`
