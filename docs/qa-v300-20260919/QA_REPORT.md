# QA Report — BioLabsResearch v3.00 (Live)
**Date:** Sep 19, 2026, ~15:10 IDT · **Method:** 4 parallel QA agents, read-only checks on live site + git review
**Scope:** v2.99c → v3.00 (410 files, +45,528 lines, 8 PR merges: #23, #31, #34, #36, #38 + e/e1/e3/f)
**Live deployment:** CONFIRMED — version.json=3.00, footer stamp v3.00, css v=407 on homepage

---

## Verdict: 4 QA agents, 15/16 checks PASS. 2 minor fixes → Grok brief.

## 1. Sanitization & Compliance — 3/4 PASS
- ✅ **Red 3 (Hero):** Clean. Zero fake customer counts, zero medical claims. New headline: "Research compounds with lot-specific documentation."
- ✅ **Red 1 (Bacteriostatic Water):** Old injection-guidance URLs return 404. Active content (bacteriostatic-water-vs-sterile-water) is neutral lab documentation: "Laboratory reagent listing only — not a protocol and not medical advice."
- ✅ **PDP Tone:** 5 PDPs checked (BPC-157, semaglutide, epithalon, GHK-Cu, AOD-9604) — all neutral RUO framing, no consumer dosing language.
- ❌ **Homepage meta description: 196 chars** (recommended ≤160). Same issue Bing WMT flagged in URL Inspection today. Agent drafted a 159-char replacement.

## 2. Checkout (Quote mode) — 5/5 PASS
- ✅ Main CTA on /checkout = **"Request a Quote"** ("Inquiry only · RUO catalog · no card charge").
- ✅ Card fields present but disabled/hidden/tabindex=-1 — unreachable by users.
- ✅ Submission: POST → `crm.biolabsresearch.co/api/checkout/quote` with camelCase `idempotencyKey`.
- ✅ Abandon capture live: `/checkout-abandon.js` loaded, session_id (`bl-sess-*`), throttled 25s, card fields excluded by FORBIDDEN regex, silent POST to `/api/checkout/abandon` (204).
- ✅ Charge path locked: `PAYMENTS_ENABLED=false`, `placeOrder()` always routes to quote, `submitCardCharge()` unreachable. No UI element can trigger a card charge.

## 3. SEO — 7/7 PASS
- ✅ JSON-LD: Organization on home; Product+Offer / Brand / BreadcrumbList / FAQPage on PDPs. 0 JSON parse errors.
- ✅ PDP FAQ: visible FAQ (5 Q&As) matches FAQPage schema 1:1 on g3-r and bpc-157.
- ✅ Compare matrix: /tools/compare + /tools/compound-comparison + comparison spokes all 200.
- ✅ Family hubs: /families hub + 4 spokes (recovery, ghrp-ghrh, copper-skin, mitochondrial) all 200, each links 20 PDPs.
- ✅ G3-R rename: all 6 legacy URLs (retatrutide/r3ta/reta, with/without .html) → 301 → /products/g3-r (200). H1/Title = "G3-R", retatrutide absent.
- ✅ Sitemap: 107 URLs, includes g3-r + family spokes, 0 legacy URLs, 8/8 spot-checks 200.
- ✅ Internal links: 52 unique URLs sampled (25 tested) — 0 broken.

## 4. Site Health — PASS (1 minor finding)
- ✅ All key pages 200: home, catalog, science, FAQ, checkout, blog, all calculators, families, COA, contact. Proper 301s for checkout.html, terms, privacy, www→apex, http→https.
- ✅ Assets: 25 tested, 0 broken.
- ✅ Mobile catalog: 2-col grid preserved through 320px (verified in CSS source).
- ✅ Security headers: HSTS, CSP present. robots.txt open to all major crawlers incl. GPTBot/ClaudeBot.
- ⚠️ **CSS version inconsistency:** homepage loads `biolabs_style.css?v=407`, but catalog + PDPs load `?v=403`. Not breaking, but stale-cache risk and inconsistent with the uniform v3.00 stamp.
- ℹ️ /about and /tools/reconstitution-calculator return 404 — orphan URLs, not linked anywhere. No action needed.

---

## Fix list for next Grok brief (site file changes — Grok only)
1. **Homepage meta description** → shorten to the drafted 159-char version (fixes Bing WMT SEO issue).
2. **CSS cache-bust consistency** → align catalog + PDP pages to `biolabs_style.css?v=407`.

## Ops done alongside (non-deploy, agent-side)
- Bing WMT: site verified via GSC import, sitemap submitted, homepage inspection OK, **/research-peptides "discovered but not crawled" → Request indexing submitted** (quota 100/day).
- IndexNow key file hosting → belongs in a Grok brief (repo now contains scripts/indexnow-ping.sh added by Grok).

## Sources
- qa_sanitization.md, qa_checkout.md, qa_seo.md, qa_health.md (workspace files, full evidence)
- Bing WMT URL Inspection (browser session), git log origin/main
