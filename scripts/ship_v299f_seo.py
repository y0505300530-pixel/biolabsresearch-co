#!/usr/bin/env python3
"""v2.99f SEO Level 1 — new compare pages, PDP FAQ+schema, sitemap, tip stamp.

Leaves the existing 11 /compare/*.html files byte-untouched.
Does not invent SKUs. Live catalog identities only. G3-R naming on new pages.
No prices written into new compare tables. No dosing / inject / how-to-use copy.
"""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path("/workspace")
HTML = ROOT / "html"
VERSION = "2.99f"
RELEASED = "2026-09-19"
CODENAME = "seo-level1-compare-faq"
ORIGIN = "https://biolabsresearch.co"

EXISTING_COMPARE_FILES = {
    "bacteriostatic-water-vs-sterile-water.html",
    "bpc-157-vs-tb-500.html",
    "cjc-1295-dac-vs-no-dac.html",
    "ghk-cu-vs-bpc-157.html",
    "ghk-cu-vs-epithalon.html",
    "ipamorelin-vs-sermorelin.html",
    "mots-c-vs-nad-plus.html",
    "semaglutide-vs-g3-r.html",
    "semaglutide-vs-tirzepatide.html",
    "tesamorelin-vs-ipamorelin.html",
    "tirzepatide-vs-g3-r.html",
}

# Public PDP file → catalog slug (API). G3-R listing file is g3-r.html (e1).
PDP_FILES = [
    "aod-9604.html",
    "bpc-157.html",
    "bpc-157-tb-500-blend.html",
    "curcumin-phytosome.html",
    "epithalon.html",
    "ghk-cu.html",
    "glow-70.html",
    "ipamorelin.html",
    "kisspeptin-10.html",
    "kpv.html",
    "mots-c.html",
    "nad-plus.html",
    "g3-r.html",
    "semaglutide.html",
    "semax.html",
    "tb-500.html",
    "tesamorelin.html",
    "tesamorelin-ipamorelin.html",
    "thymosin-alpha-1.html",
    "tirzepatide.html",
]

# Identity card used on new compares. PDP href is the live public file, not an invented path.
CATALOG = {
    "aod-9604": {
        "name": "AOD-9604",
        "pdp": "/products/aod-9604",
        "cas": "221231-10-3",
        "form": "Lyophilized peptide",
        "strengths": ["5mg", "10mg"],
        "note": "C-terminal hGH 177–191 fragment listing. Not intact GH and not a GHRH/GHRP secretagogue.",
        "cluster": "metabolic fragment",
    },
    "bpc-157": {
        "name": "BPC-157",
        "pdp": "/products/bpc-157",
        "cas": "137525-51-0",
        "form": "Lyophilized peptide",
        "strengths": ["10mg", "20mg"],
        "note": "Pentadecapeptide identity (GEPPPGKPADDAGLV) used in published cell and tissue signaling models.",
        "cluster": "signaling fragment",
    },
    "bpc-157-tb-500-blend": {
        "name": "BPC-157 / TB-500 Blend",
        "pdp": "/products/bpc-157-tb-500-blend",
        "cas": "137525-51-0 · 885340-09-2",
        "form": "Lyophilized blend",
        "strengths": ["20mg"],
        "note": "One vial listing two named identities. Per-compound mass belongs on the lot file when issued.",
        "cluster": "two-identity blend",
    },
    "epithalon": {
        "name": "Epithalon",
        "pdp": "/products/epithalon",
        "cas": "307297-39-8",
        "form": "Lyophilized peptide",
        "strengths": ["10mg", "50mg"],
        "note": "Tetrapeptide AEDG (also listed as epitalon) in pineal and telomerase-related laboratory literature.",
        "cluster": "tetrapeptide",
    },
    "g3-r": {
        "name": "G3-R",
        "pdp": "/products/g3-r",
        "cas": "2381089-83-2",
        "form": "Lyophilized peptide",
        "strengths": ["10mg", "20mg", "50mg"],
        "note": "Catalog listing for a published triple GIP / GLP-1 / glucagon receptor agonist used in incretin-pathway assays.",
        "cluster": "incretin agonist",
        "sku": "g3-r",
    },
    "ghk-cu": {
        "name": "GHK-Cu",
        "pdp": "/products/ghk-cu",
        "cas": "89030-95-5",
        "form": "Lyophilized peptide",
        "strengths": ["100mg"],
        "note": "Copper(II) complex of Gly-His-Lys. Matrix and copper-binding research listing — not a finished cosmetic.",
        "cluster": "copper tripeptide",
    },
    "glow-70": {
        "name": "GLOW 70",
        "pdp": "/products/glow-70",
        "cas": "Lot label / COA",
        "form": "Lyophilized named blend",
        "strengths": ["70mg"],
        "note": "Named catalog blend. This page does not invent a peptide recipe or ratio.",
        "cluster": "named blend",
    },
    "ipamorelin": {
        "name": "Ipamorelin",
        "pdp": "/products/ipamorelin",
        "cas": "170851-70-4",
        "form": "Lyophilized peptide",
        "strengths": ["10mg"],
        "note": "Selective GHS-R / GHRP analogue used in pituitary signaling research.",
        "cluster": "GHRP analogue",
    },
    "kisspeptin-10": {
        "name": "Kisspeptin-10",
        "pdp": "/products/kisspeptin-10",
        "cas": "374675-21-5",
        "form": "Lyophilized peptide",
        "strengths": ["10mg"],
        "note": "KISS1 fragment listing (YNWNSFGLRF-NH2) used in receptor-axis laboratory work.",
        "cluster": "neuropeptide fragment",
    },
    "kpv": {
        "name": "KPV",
        "pdp": "/products/kpv",
        "cas": "67727-97-3",
        "form": "Lyophilized peptide",
        "strengths": ["10mg"],
        "note": "Lys-Pro-Val, a C-terminal alpha-MSH fragment used in melanocortin-pathway models.",
        "cluster": "MSH fragment",
    },
    "mots-c": {
        "name": "MOTS-c",
        "pdp": "/products/mots-c",
        "cas": "1627580-64-6",
        "form": "Lyophilized peptide",
        "strengths": ["10mg", "20mg"],
        "note": "Mitochondrial ORF peptide (MRWQEMGYIFYPRKLR) used in metabolic-signaling models.",
        "cluster": "mitochondrial peptide",
    },
    "nad-plus": {
        "name": "NAD+",
        "pdp": "/products/nad-plus",
        "cas": "53-84-9",
        "form": "Lyophilized biochemical reference",
        "strengths": ["500mg", "1000mg"],
        "note": "Nicotinamide adenine dinucleotide cofactor for dehydrogenase and NAD-consuming enzyme assays. Not a supplement claim.",
        "cluster": "cofactor",
    },
    "semaglutide": {
        "name": "Semaglutide",
        "pdp": "/products/semaglutide",
        "cas": "910463-68-2",
        "form": "Lyophilized peptide",
        "strengths": ["5mg", "10mg"],
        "note": "GLP-1 analogue listing used in incretin-pathway laboratory models.",
        "cluster": "incretin agonist",
    },
    "semax": {
        "name": "Semax",
        "pdp": "/products/semax",
        "cas": "80714-61-0",
        "form": "Lyophilized peptide",
        "strengths": ["10mg", "30mg"],
        "note": "ACTH(4–10) analogue (MEHFPGP) used in CNS signaling models. Not a finished nootropic product.",
        "cluster": "ACTH analogue",
    },
    "tb-500": {
        "name": "TB-500",
        "pdp": "/products/tb-500",
        "cas": "885340-09-2",
        "form": "Lyophilized peptide",
        "strengths": ["10mg"],
        "note": "Thymosin-β4 fragment listing (commonly Ac-LKKTETQ). Not intact thymosin-β4.",
        "cluster": "Tβ4 fragment",
    },
    "tesamorelin": {
        "name": "Tesamorelin",
        "pdp": "/products/tesamorelin",
        "cas": "218949-48-5",
        "form": "Lyophilized peptide",
        "strengths": ["10mg", "20mg"],
        "note": "GHRH analogue used in GH-axis signaling research. Not a prescription listing.",
        "cluster": "GHRH analogue",
    },
    "tesamorelin-ipamorelin": {
        "name": "Tesamorelin / Ipamorelin",
        "pdp": "/products/tesamorelin-ipamorelin",
        "cas": "218949-48-5 · 170851-70-4",
        "form": "Lyophilized blend",
        "strengths": ["10mg"],
        "note": "Two-analogue vial (GHRH + GHRP). Two masses belong on the lot COA when issued.",
        "cluster": "two-identity blend",
    },
    "thymosin-alpha-1": {
        "name": "Thymosin Alpha-1",
        "pdp": "/products/thymosin-alpha-1",
        "cas": "62304-98-7",
        "form": "Lyophilized peptide",
        "strengths": ["10mg"],
        "note": "N-acetyl 28-residue thymic peptide used in immune-signaling literature. Distinct from TB-500.",
        "cluster": "thymic peptide",
    },
    "tirzepatide": {
        "name": "Tirzepatide",
        "pdp": "/products/tirzepatide",
        "cas": "2023788-19-2",
        "form": "Lyophilized peptide",
        "strengths": ["10mg"],
        "note": "Dual GIP/GLP-1 receptor agonist listing used in incretin-pathway research.",
        "cluster": "incretin agonist",
    },
}

# New pairs only. Existing 11 URLs are not recreated.
NEW_PAIRS = [
    ("bpc-157", "kpv"),
    ("tb-500", "kpv"),
    ("bpc-157", "glow-70"),
    ("ghk-cu", "glow-70"),
    ("kpv", "glow-70"),
    ("bpc-157", "bpc-157-tb-500-blend"),
    ("tb-500", "bpc-157-tb-500-blend"),
    ("ghk-cu", "kpv"),
    ("epithalon", "mots-c"),
    ("epithalon", "nad-plus"),
    ("thymosin-alpha-1", "kpv"),
    ("thymosin-alpha-1", "epithalon"),
    ("ghk-cu", "mots-c"),
    ("tesamorelin", "tesamorelin-ipamorelin"),
    ("ipamorelin", "tesamorelin-ipamorelin"),
    ("tesamorelin", "aod-9604"),
    ("ipamorelin", "kisspeptin-10"),
    ("g3-r", "aod-9604"),
    ("g3-r", "mots-c"),
    ("semaglutide", "aod-9604"),
    ("tirzepatide", "aod-9604"),
    ("semaglutide", "mots-c"),
    ("semax", "kisspeptin-10"),
    ("glow-70", "bpc-157-tb-500-blend"),
]


def fetch_live_slugs() -> set[str]:
    req = urllib.request.Request(
        ORIGIN + "/api/products",
        headers={"Accept": "application/json", "User-Agent": "biolabs-v299f-seo"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    items = data if isinstance(data, list) else data.get("products") or []
    slugs = {p.get("slug") for p in items if isinstance(p, dict) and p.get("slug")}
    names = {p.get("slug"): p.get("name") for p in items if isinstance(p, dict)}
    strengths = {p.get("slug"): p.get("strengths") for p in items if isinstance(p, dict)}
    return slugs, names, strengths


def assert_live_catalog(slugs: set[str], strengths: dict) -> None:
    needed = set()
    for a, b in NEW_PAIRS:
        needed.add("g3-r" if a == "g3-r" else a)
        needed.add("g3-r" if b == "g3-r" else b)
    # API uses g3-r; other keys match slugs.
    missing = {s for s in needed if s not in slugs and s != "g3-r"}
    if "g3-r" not in slugs:
        raise SystemExit("Live API is missing slug g3-r — refusing to invent it")
    if missing:
        raise SystemExit(f"Live API missing SKUs: {sorted(missing)}")
    for key, meta in CATALOG.items():
        api_slug = "g3-r" if key == "g3-r" else key
        live = strengths.get(api_slug) or []
        if live and list(meta["strengths"]) != list(live):
            # Prefer live strengths; do not invent extras.
            meta["strengths"] = list(live)


ORG_JSON = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORIGIN + "/#organization",
    "name": "BioLabs Research",
    "legalName": "LEEDS MARKETING GROUP LTD",
    "alternateName": ["BioLabs Research", "biolabsresearch.co"],
    "url": ORIGIN,
    "logo": {
        "@type": "ImageObject",
        "url": ORIGIN + "/biolabsresearch-logo.png",
        "width": 512,
        "height": 512,
    },
    "email": "admin@biolabsresearch.co",
    "description": "BioLabs Research supplies research-use-only (RUO) compounds for laboratory inquiry: lyophilized research reagents listed by catalog identity and vial strength, with lot documentation (COA) available on request. Products are for in vitro and analytical research only — not for human consumption, clinical use, or therapeutic claims.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "71-75 Shelton Street, Covent Garden",
        "addressLocality": "London",
        "postalCode": "WC2H 9JQ",
        "addressCountry": "GB",
    },
}


def ld(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def faq_items_for_pair(a: dict, b: dict) -> list[dict]:
    return [
        {
            "q": f"Are {a['name']} and {b['name']} the same catalog identity?",
            "a": (
                f"No. {a['name']} is listed as CAS {a['cas']} and {b['name']} as CAS {b['cas']}. "
                "Sequences, salt form, and fragment length are identity-critical. Confirm the lot label."
            ),
        },
        {
            "q": "What listed strengths appear in the catalog?",
            "a": (
                f"{a['name']} is listed at { ' · '.join(a['strengths']) }. "
                f"{b['name']} is listed at { ' · '.join(b['strengths']) }. "
                "Listed strengths are catalog sizes. Inquire for a lot."
            ),
        },
        {
            "q": "Where do lot and COA documents live?",
            "a": (
                "Lot COA, SDS, and related papers are available on request. "
                "Open the product page Request lot COA control or use Contact. "
                "This compare table does not invent HPLC or purity figures."
            ),
        },
        {
            "q": "Does this page name a laboratory method?",
            "a": (
                "No. The table is limited to catalog identity, public registry identifiers, listed form, and listed strengths. "
                "Method, solvent class, and handling belong on the lot papers and the institutional SOP."
            ),
        },
        {
            "q": "Are these listings for laboratory research only?",
            "a": (
                "Yes. Both SKUs are research-use-only reagents for in-vitro and analytical work. "
                "They are not medicines, supplements, or veterinary products."
            ),
        },
    ]


def pdp_faq_items(name: str, form: str, strengths: list[str]) -> list[dict]:
    strength_txt = " · ".join(strengths) if strengths else "the sizes printed on this page"
    form_txt = form or "the catalog form printed on this page"
    return [
        {
            "q": f"How is {name} stored as listed?",
            "a": (
                f"{name} is listed as a sealed research reagent ({form_txt}). "
                "Lot-specific storage temperature and light/moisture notes belong on the SDS or lot papers when issued. "
                "This page describes the as-shipped listing only."
            ),
        },
        {
            "q": "Where are form and solubility documents?",
            "a": (
                f"Catalog form for {name} is {form_txt}. "
                "Solvent class and solubility notes, when they exist, sit on the lot SDS or COA. "
                "This page does not publish a bench method."
            ),
        },
        {
            "q": "How do laboratories request a COA or lot file?",
            "a": (
                "Lot documentation is on request. Use Request lot COA on this page or Contact. "
                "A COA is only as strong as the method, wavelength, laboratory name, and lot ID printed on it."
            ),
        },
        {
            "q": f"What purity figure is published for {name}?",
            "a": (
                "No catalog-wide purity percentage is published here. "
                "Peak area and net peptide content live on the lot COA when a file is issued. "
                "See Science and the COA reading guide."
            ),
        },
        {
            "q": "How are confirmed inquiries shipped?",
            "a": (
                "Confirmed inquiries process in 1–2 business days. Catalog fulfillment ships from the US. "
                "USPS Ground is the default US service; temperature-sensitive lots may use cold-chain packing. "
                "See the Shipping page for carrier notes."
            ),
        },
    ]


def pair_slug(a_key: str, b_key: str) -> str:
    return f"{a_key}-vs-{b_key}"


def differ_copy(a: dict, b: dict) -> str:
    return (
        f"<p>{a['name']} ({a['cas']}) is catalogued as a {a['cluster']}: {a['note']}</p>\n"
        f"<p>{b['name']} ({b['cas']}) is catalogued as a {b['cluster']}: {b['note']}</p>\n"
        "<p>CAS, fragment length, and salt form are not interchangeable. "
        "Read the sequence or identity line printed for the lot. "
        "This table does not rank listings or name a study design.</p>"
    )


def index_footer() -> str:
    idx = (HTML / "index.html").read_text(encoding="utf-8")
    m = re.search(r'(<footer class="footer" id="site-footer">.*?</footer>)', idx, re.S)
    if not m:
        raise SystemExit("index.html site footer not found")
    foot = m.group(1)
    foot = re.sub(
        r'data-site-version="[^"]+"',
        f'data-site-version="{VERSION}"',
        foot,
    )
    foot = re.sub(r">v2\.[0-9]+[a-z]?<", f">v{VERSION}<", foot)
    return foot


FOOTER = None


def compare_html(a_key: str, b_key: str, also: list[tuple[str, str]]) -> str:
    a, b = CATALOG[a_key], CATALOG[b_key]
    slug = pair_slug(a_key, b_key)
    url = f"{ORIGIN}/compare/{slug}"
    title = f"{a['name']} vs {b['name']} for research — BioLabs Research"
    desc = (
        f"{a['name']} (CAS {a['cas']}) vs {b['name']} (CAS {b['cas']}): "
        "catalog identity, form, and listed strengths for research labs. RUO. Lot papers on request."
    )
    faqs = faq_items_for_pair(a, b)
    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "url": url,
        "mainEntity": [
            {
                "@type": "Question",
                "name": f["q"],
                "acceptedAnswer": {"@type": "Answer", "text": f["a"]},
            }
            for f in faqs
        ],
    }
    crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": ORIGIN + "/"},
            {"@type": "ListItem", "position": 2, "name": "Compare", "item": ORIGIN + "/tools/compare"},
            {"@type": "ListItem", "position": 3, "name": f"{a['name']} vs {b['name']}", "item": url},
        ],
    }
    faq_html = "\n".join(
        f'<details class="lab-faq-item"><summary>{esc(f["q"])}</summary>'
        f'<div class="lab-faq-a"><p>{esc(f["a"])}</p></div></details>'
        for f in faqs
    )
    also_html = []
    for x, y in also:
        if {x, y} == {a_key, b_key}:
            continue
        xa, xb = CATALOG[x], CATALOG[y]
        also_html.append(
            f'<a href="/compare/{pair_slug(x, y)}">{esc(xa["name"])} vs {esc(xb["name"])}</a>'
        )
        if len(also_html) >= 6:
            break
    also_html.append('<a href="/tools/compare">Compare selector</a>')
    also_html.append('<a href="/contact">Contact / inquire</a>')

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<script src="/cookie-consent.js?v=3" defer></script>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" type="image/x-icon" href="/favicon-b.ico?v=1">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-b-32.png?v=1">
<link rel="apple-touch-icon" href="/apple-touch-b.png?v=1">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/biolabs_style.css?v=403">
<script src="/cart-vial.js?v=314" defer></script>
<script src="/search-overlay.js?v=37" defer></script>

<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="BioLabs Research">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:image" content="{ORIGIN}/media/og-preview.jpg?v=2">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="{ORIGIN}/media/og-preview.jpg?v=2">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="robots" content="index,follow">

<style>
:root{{--cream:#F7F4EE;--ink:#0d0d0d;--gold:#9A6D2A;--white:#fff;--muted:#5a5a5a;--line:#e5dfd4}}
body{{background:var(--cream);color:var(--ink);margin:0;font-family:Inter,system-ui,sans-serif}}
.seo-wrap{{max-width:1100px;margin:0 auto;padding:48px 40px 100px}}
.seo-wrap.narrow{{max-width:860px}}
.seo-kicker{{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin:0 0 12px}}
.seo-wrap h1{{font-size:clamp(28px,3.6vw,42px);font-weight:800;letter-spacing:-.03em;line-height:1.15;margin:0 0 16px;color:var(--ink)}}
.seo-ruo{{margin:0 0 18px;padding:12px 14px;background:#F4EFE4;border-radius:8px;font-size:13px;color:#5a5a5a;border-left:3px solid var(--gold)}}
.seo-cta-row{{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:28px 0}}
.seo-cta{{display:block;text-align:center;padding:16px;border-radius:10px;background:var(--ink);color:#fff;text-decoration:none;font-weight:700}}
.seo-cta.alt{{background:var(--gold)}}
.seo-prose p,.seo-prose li{{font-size:15.5px;line-height:1.75;color:#3a3a3a;margin:0 0 14px}}
.seo-prose h2{{font-size:22px;margin:36px 0 14px;font-weight:700}}
.quick-table{{width:100%;border-collapse:collapse;margin:0;font-size:14px;background:#fff;border:1px solid var(--line);border-radius:10px}}
.quick-table th,.quick-table td{{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;white-space:normal;overflow-wrap:anywhere}}
.quick-table th{{background:#F4EFE4;color:var(--gold);font-size:11px;text-transform:uppercase;letter-spacing:.05em}}
.compare-table-scroller{{width:100%;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;margin:18px 0 28px;border-radius:10px}}
.lab-faq{{margin:28px 0 8px}}
.lab-faq-item{{border-bottom:1px solid var(--line);padding:12px 0}}
.lab-faq-item summary{{cursor:pointer;font-weight:700;font-size:16px;list-style:none;display:block}}
.lab-faq-item summary::-webkit-details-marker{{display:none}}
.lab-faq-a{{padding-top:10px;position:static}}
.lab-faq-a p{{margin:0}}
@media (max-width:860px){{
  .seo-wrap{{padding:32px 18px 72px;overflow-x:hidden}}
  .seo-cta-row{{grid-template-columns:1fr}}
  .quick-table{{font-size:13px}}
  .quick-table th,.quick-table td{{padding:8px 10px}}
}}
</style>

<script type="application/ld+json" id="organization-jsonld">{ld(ORG_JSON)}</script>
<script type="application/ld+json" id="faq-jsonld">{ld(faq_ld)}</script>
<script type="application/ld+json" id="breadcrumb-jsonld">{ld(crumbs)}</script>
<meta name="app-version" content="{VERSION}">
<meta name="google-site-verification" content="Xv1Ik8H9U7MtC7cq9epujNlazzwlMM9J2ZMqgQuRklU">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

<div class="promo-stack" id="promoStack" hidden style="display:none!important" aria-hidden="true"></div>

<nav class="nav">
<a href="/" class="nav-logo" aria-label="BioLabs Research"><span class="nav-logo-mark">B</span><span class="nav-logo-stack"><span class="nav-logo-text">iolabs research</span></span></a>
  <div class="nav-left">
    <a href="/#catalog">Catalog</a>
    <a href="/science">Science</a>
    <a href="/blog/">Blog</a>
    <a href="/shipping">Shipping</a>
  </div>
  <div class="nav-right">
    <div class="nav-links-right">
      <a href="/tools">Tools</a>
      <a href="/coa">COA Library</a>
    </div>
    <span class="nav-sep" aria-hidden="true">|</span>
    <button type="button" class="nav-util" data-open-search="1" aria-label="Search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16.2 16.2L20 20"/></svg></button>
    <button class="nav-cart" onclick="toggleCart()" type="button" aria-label="Cart"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.35"/><circle cx="17" cy="20" r="1.35"/><path d="M3 5h2l2.1 10.4A1.8 1.8 0 0 0 8.9 17h8.3a1.8 1.8 0 0 0 1.8-1.45L21 8H7"/></svg><span class="nav-cart-count" id="cartCount">0</span></button>
    <button class="nav-hamburger" onclick="toggleMenu()" type="button" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="nav-overlay" id="navOverlay" onclick="toggleMenu()"></div>
<div class="nav-menu" id="navMenu">
  <button type="button" class="nav-menu-close" onclick="toggleMenu()" aria-label="Close menu">✕</button>
  <a href="/#catalog" onclick="toggleMenu()">Catalog</a>
  <a href="/science" onclick="toggleMenu()">Science</a>
  <a href="/blog/" onclick="toggleMenu()">Blog</a>
  <a href="/shipping" onclick="toggleMenu()">Shipping</a>
  <a href="/tools" onclick="toggleMenu()">Tools</a>
  <a href="/tools/compare" onclick="toggleMenu()">Compare</a>
  <a href="/coa" onclick="toggleMenu()">COA Library</a>
  <a href="/contact" onclick="toggleMenu()">Contact</a>
  <a href="/terms-and-conditions" onclick="toggleMenu()">Terms</a>
  <a href="/privacy-policy" onclick="toggleMenu()">Privacy</a>
  <a href="/returns" onclick="toggleMenu()">Returns</a>
</div>

<main id="main" class="seo-wrap narrow seo-prose">
  <p class="seo-kicker">Research comparison</p>
  <h1>{esc(a['name'])} vs {esc(b['name'])} for research</h1>
  <p class="seo-ruo">For laboratory research use only. Not for human or veterinary use. No medical claims. Research reagents only — inquire for a lot.</p>
  <p>{esc(a['name'])} and {esc(b['name'])} are separate catalog listings. The table below is limited to public identity, listed form, and listed strengths from the live catalog. Inquire for a lot.</p>
  <h2>Laboratory identity table</h2>
  <div class="compare-table-scroller"><table class="quick-table">
    <thead><tr><th>Field</th><th>{esc(a['name'])}</th><th>{esc(b['name'])}</th></tr></thead>
    <tbody>
      <tr><th>Name</th><td><a href="{esc(a['pdp'])}">{esc(a['name'])}</a></td><td><a href="{esc(b['pdp'])}">{esc(b['name'])}</a></td></tr>
      <tr><th>CAS</th><td>{esc(a['cas'])}</td><td>{esc(b['cas'])}</td></tr>
      <tr><th>Form</th><td>{esc(a['form'])}</td><td>{esc(b['form'])}</td></tr>
      <tr><th>Listed strengths</th><td>{esc(' · '.join(a['strengths']))}</td><td>{esc(' · '.join(b['strengths']))}</td></tr>
      <tr><th>Catalog note</th><td>{esc(a['note'])}</td><td>{esc(b['note'])}</td></tr>
      <tr><th>Lot / COA</th><td>On request</td><td>On request</td></tr>
      <tr><th>RUO</th><td>Research use only</td><td>Research use only</td></tr>
    </tbody>
  </table></div>

  <h2>What differs at the molecular listing</h2>
  {differ_copy(a, b)}

  <div class="seo-cta-row">
    <a class="seo-cta" href="{esc(a['pdp'])}">{esc(a['name'])} — inquire →</a>
    <a class="seo-cta alt" href="{esc(b['pdp'])}">{esc(b['name'])} — inquire →</a>
  </div>

  <section class="lab-faq" id="faq" aria-labelledby="lab-faq-title">
    <h2 id="lab-faq-title">Catalog questions</h2>
    {faq_html}
  </section>

  <p>All discussion on this page is limited to chemical identity, public registry identifiers, and laboratory research framing. BioLabs Research lists reagents for in-vitro and analytical work only. Confirm listed strengths and any hosted COA PDFs on the product page or in the <a href="/coa">COA Library</a>. To request a lot, use <a href="/contact">Contact</a>.</p>
  <p>Reading: <a href="/blog/">blog</a>, <a href="/science">Science</a>, <a href="/guide-reading-coa">reading a COA</a>, <a href="/shipping">Shipping</a>.</p>
</main>

<section class="seo-also" aria-label="Other comparisons" style="margin:28px 18px 8px">
  <h2 style="font-size:1.05rem;margin:0 0 10px">Other comparisons</h2>
  <p style="display:flex;flex-wrap:wrap;gap:10px 16px;margin:0">
    {''.join(also_html)}
  </p>
</section>
{FOOTER}
<script src="/promo-bar.js?v=293"></script>
<script src="/org-jsonld.js?v=1"></script>
<script>
(function(){{
  try {{
    var slug = (location.pathname || '').replace(/^\\/compare\\//,'').replace(/\\/$/,'').replace(/\\.html$/,'');
    if (!slug || slug.indexOf('/') >= 0) return;
    if (typeof window.blrTrack === 'function') {{
      window.blrTrack('compare_view', {{ slug: slug, pair_id: slug }});
    }}
  }} catch (e) {{}}
}})();
</script>
<script>(function(){{function etNow(){{try{{var parts=new Intl.DateTimeFormat('en-US',{{timeZone:'America/New_York',weekday:'short',hour:'numeric',hour12:false,minute:'numeric'}}).formatToParts(new Date());var map={{}};parts.forEach(function(p){{map[p.type]=p.value;}});return{{dow:map.weekday,hour:parseInt(map.hour,10),minute:parseInt(map.minute,10)}};}}catch(e){{return null;}}}}function isOnline(t){{if(!t)return false;var days={{Mon:1,Tue:1,Wed:1,Thu:1,Fri:1,Sat:0,Sun:0}};if(!days[t.dow])return false;var mins=t.hour*60+(t.minute||0);return mins>=8*60&&mins<21*60;}}function paint(){{var t=etNow(),on=isOnline(t),nodes=document.querySelectorAll('[data-support-status]');for(var i=0;i<nodes.length;i++){{var el=nodes[i];el.className='support-status '+(on?'on':'off');el.innerHTML=on?'<span class="dot" aria-hidden="true"></span><span>Online now</span>':'<span class="dot" aria-hidden="true"></span><span>Offline — we reply within 12 hours</span>';}}}}paint();setInterval(paint,60000);}})();</script>
</body>
</html>
"""


def esc(s: str) -> str:
    return (
        str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


PDP_FAQ_CSS = """
<style id="pdp-lab-faq-css">
.pdp-lab-faq{max-width:860px;margin:40px auto 8px;padding:0 20px;box-sizing:border-box}
.pdp-lab-faq h2{font-family:Fraunces,Georgia,serif;font-size:22px;margin:0 0 12px;color:#1F1F1F}
.pdp-lab-faq-item{border-bottom:1px solid #E8E2D8;padding:12px 0}
.pdp-lab-faq-item summary{cursor:pointer;font-weight:700;font-size:16px;list-style:none;display:block;line-height:1.4}
.pdp-lab-faq-item summary::-webkit-details-marker{display:none}
.pdp-lab-faq-a{padding-top:10px;position:static;font-size:14.5px;line-height:1.65;color:#4A4A4A}
.pdp-lab-faq-a p{margin:0}
@media(max-width:390px){.pdp-lab-faq{padding:0 16px}}
</style>
"""


def pdp_display_name(path: Path) -> str:
    if path.name == "g3-r.html":
        return "G3-R"
    m = re.search(r'<h1 class="product-title">([^<]+)</h1>', path.read_text(encoding="utf-8"))
    if m:
        return m.group(1).strip()
    return path.stem.replace("-", " ").title()


def pdp_form_and_strengths(path: Path, slug: str) -> tuple[str, list[str]]:
    if slug == "g3-r" or path.name == "g3-r.html":
        meta = CATALOG["g3-r"]
        return meta["form"], list(meta["strengths"])
    key = path.stem
    meta = CATALOG.get(key)
    if meta:
        return meta["form"], list(meta["strengths"])
    if key == "curcumin-phytosome":
        return "Phospholipid-complexed research formulation", ["500mg"]
    return "Lyophilized research reagent", []


def inject_pdp(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if 'id="pdp-lab-faq"' in text:
        return
    slug = "g3-r" if path.name == "g3-r.html" else path.stem
    name = pdp_display_name(path)
    if path.name == "g3-r.html":
        name = "G3-R"
    form, strengths = pdp_form_and_strengths(path, slug)
    faqs = pdp_faq_items(name, form, strengths)
    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "url": f"{ORIGIN}/products/{path.stem}",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f["q"],
                "acceptedAnswer": {"@type": "Answer", "text": f["a"]},
            }
            for f in faqs
        ],
    }
    head_bits = (
        f'<script type="application/ld+json" id="organization-jsonld">{ld(ORG_JSON)}</script>\n'
        f'<script type="application/ld+json" id="faq-jsonld">{ld(faq_ld)}</script>\n'
    )
    if 'id="organization-jsonld"' not in text:
        text = text.replace("</head>", head_bits + "</head>", 1)
    elif 'id="faq-jsonld"' not in text:
        text = text.replace("</head>", f'<script type="application/ld+json" id="faq-jsonld">{ld(faq_ld)}</script>\n</head>', 1)

    faq_body = PDP_FAQ_CSS + (
        f'<section class="pdp-lab-faq" id="pdp-lab-faq" aria-labelledby="pdp-lab-faq-title">\n'
        f'<h2 id="pdp-lab-faq-title">Catalog questions</h2>\n'
    )
    for f in faqs:
        faq_body += (
            f'<details class="pdp-lab-faq-item"><summary>{esc(f["q"])}</summary>'
            f'<div class="pdp-lab-faq-a"><p>{esc(f["a"])}</p></div></details>\n'
        )
    faq_body += "</section>\n"

    marker = "<!-- FOOTER — matches homepage -->"
    if marker not in text:
        raise SystemExit(f"FAQ insert marker missing in {path}")
    text = text.replace(marker, faq_body + marker, 1)
    if 'org-jsonld.js' not in text:
        text = text.replace("</body>", '<script src="/org-jsonld.js?v=1"></script>\n</body>', 1)
    # Stamp tip on PDPs
    text = re.sub(r'(<meta name="app-version" content=")[^"]+(")', rf"\g<1>{VERSION}\2", text, count=1)
    text = re.sub(
        r'(data-site-version=")[^"]+(")',
        rf"\g<1>{VERSION}\2",
        text,
        count=1,
    )
    text = re.sub(
        r'(<p class="site-version"[^>]*>)v[0-9.]+[a-z]?(</p>)',
        rf"\g<1>v{VERSION}\2",
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8")


def update_sitemap(new_urls: list[str]) -> None:
    path = HTML / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    for url in new_urls:
        if url in text:
            continue
        entry = (
            f"  <url><loc>{url}</loc><lastmod>{RELEASED}</lastmod>"
            f"<changefreq>weekly</changefreq><priority>0.8</priority></url>\n"
        )
        text = text.replace("</urlset>", entry + "</urlset>")
    path.write_text(text, encoding="utf-8")


def update_compare_sot() -> None:
    path = HTML / "tools" / "compare-wave1-sot.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    existing_ids = {p.get("id") for p in data.get("wave1_pairs", [])}
    products = data.setdefault("products", {})
    # Display name for the live incretin SKU on the selector.
    products["g3-r"] = {
        "name": "G3-R",
        "cas": "2381089-83-2",
        "strengths": CATALOG["g3-r"]["strengths"],
        "form": CATALOG["g3-r"]["form"],
        "pdp": "/products/g3-r",
    }
    extra = {
        "aod-9604": CATALOG["aod-9604"],
        "kpv": CATALOG["kpv"],
        "glow-70": CATALOG["glow-70"],
        "bpc-157-tb-500-blend": CATALOG["bpc-157-tb-500-blend"],
        "thymosin-alpha-1": CATALOG["thymosin-alpha-1"],
        "kisspeptin-10": CATALOG["kisspeptin-10"],
        "semax": CATALOG["semax"],
    }
    for key, meta in extra.items():
        if key in products:
            continue
        products[key] = {
            "name": meta["name"],
            "cas": meta["cas"],
            "strengths": meta["strengths"],
            "form": meta["form"],
            "pdp": meta["pdp"],
        }
    sot_key = {
        "g3-r": "g3-r",
    }
    for a, b in NEW_PAIRS:
        pid = pair_slug(a, b)
        if pid in existing_ids:
            continue
        data["wave1_pairs"].append(
            {
                "id": pid,
                "a": sot_key.get(a, a),
                "b": sot_key.get(b, b),
                "path": f"/compare/{pid}",
            }
        )
        existing_ids.add(pid)
    data["version"] = "1.1-v2.99f"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


SKIP_STAMP = {
    "admin.html",
    "404.html",
    "checkout.html",
    "product.html",
    "google*.html",
} | EXISTING_COMPARE_FILES


def stamp_public_pages() -> None:
    for path in HTML.rglob("*.html"):
        rel = str(path.relative_to(HTML))
        if path.name in ("admin.html", "404.html", "product.html"):
            continue
        if "google" in path.name and "site-verification" in path.name:
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        if 'name="app-version"' in text:
            text = re.sub(
                r'(<meta name="app-version" content=")[^"]+(")',
                rf"\g<1>{VERSION}\2",
                text,
                count=1,
            )
        if "data-site-version=" in text:
            text = re.sub(
                r'(data-site-version=")[^"]+(")',
                rf"\g<1>{VERSION}\2",
                text,
            )
            text = re.sub(
                r'(<p class="site-version"[^>]*>)v[0-9.]+[a-z]?(</p>)',
                rf"\g<1>v{VERSION}\2",
                text,
            )
        if "org-jsonld.js" not in text and "</body>" in text:
            text = text.replace("</body>", '<script src="/org-jsonld.js?v=1"></script>\n</body>', 1)
        if text != orig:
            path.write_text(text, encoding="utf-8")


def write_version_files() -> None:
    payload = {
        "version": VERSION,
        "released": RELEASED,
        "codename": CODENAME,
        "appVersion": VERSION,
        "highlights": [
            "24 new /compare identity pages from live catalog SKUs (G3-R naming; existing 11 compares untouched)",
            "FAQ (storage, form/solubility docs, COA, purity, shipping) on every live PDP",
            "JSON-LD: Product+Offer kept; FAQPage on PDP FAQ + new compares; Organization sitewide; BreadcrumbList on PDPs/compares",
            "AggregateRating omitted — live PDPs do not render a numeric star rating (pdp-split hides review stars)",
            "sitemap.xml lists the new compare URLs",
        ],
    }
    (ROOT / "version.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    (HTML / "version.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    md = (ROOT / "VERSION.md").read_text(encoding="utf-8")
    block = f"""# biolabsresearch.co — Version {VERSION}

Released {RELEASED}.

Codename: {CODENAME}

## Highlights

- **Compare matrix**: 24 new `/compare/<x>-vs-<y>` pages from the live `/api/products` catalog (21 SKUs). G3-R naming on new pages. Existing 11 compare HTML files left untouched.
- **Neutral lab tables only**: identity, CAS, form, listed strengths, lot/COA-on-request. No which-one, no protocol, no prices written into the new tables.
- **PDP FAQ**: 5 questions on every live product page — storage, form/solubility docs, COA/lot docs, purity, shipping. No dosing, inject, or how-to-use copy.
- **JSON-LD**: Product+Offer kept on PDPs; FAQPage on PDP FAQ and new compares; Organization sitewide (`org-jsonld.js` + inline on PDPs/new compares); BreadcrumbList on PDPs and new compares. AggregateRating not added (no visible PDP numeric rating).
- **Sitemap**: new compare URLs added.
- **Tip stack**: Rebased onto **v2.99e1** (`g3-r-public-rename`) over abandoned-checkout **v2.99e** / Quote **v2.99d** / c2 FAQ.

---

"""
    if not md.startswith(f"# biolabsresearch.co — Version {VERSION}"):
        (ROOT / "VERSION.md").write_text(block + md, encoding="utf-8")


def patch_agents_and_qa() -> None:
    agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    agents = agents.replace(
        "Visible site tip is **v2.99c** (`calculator-seo-finish`).",
        "Visible site tip is **v2.99f** (`seo-level1-compare-faq`).",
    )
    (ROOT / "AGENTS.md").write_text(agents, encoding="utf-8")

    qa = (ROOT / "QA_TASKS.md").read_text(encoding="utf-8")
    row = (
        "| P3 | v2.99f Soft-QA (SEO Level 1): ≥20 new `/compare` URLs return 200 and are in sitemap.xml; "
        "all live PDPs have FAQ + FAQPage schema; Product+Offer and BreadcrumbList on PDPs; "
        "Organization present sitewide; new compares grep-clean on dosing/inject/how-to-use/Retatrutide; "
        "G3-R naming on new G3-R pages. Existing 11 compare HTML files untouched. Owner pages. | pages | open |\n"
    )
    if "v2.99f Soft-QA" not in qa:
        qa = qa.replace(
            "| P2 | v2.99c Soft-QA",
            row + "| P2 | v2.99c Soft-QA",
        )
        (ROOT / "QA_TASKS.md").write_text(qa, encoding="utf-8")


def main() -> None:
    global FOOTER
    slugs, names, strengths = fetch_live_slugs()
    print("live slugs", sorted(slugs))
    print("g3-r name", names.get("g3-r"))
    assert_live_catalog(slugs, strengths)
    FOOTER = index_footer()

    new_urls = []
    for a, b in NEW_PAIRS:
        slug = pair_slug(a, b)
        dest = HTML / "compare" / f"{slug}.html"
        if dest.name in EXISTING_COMPARE_FILES:
            raise SystemExit(f"Refusing to overwrite existing compare {dest.name}")
        dest.write_text(compare_html(a, b, NEW_PAIRS), encoding="utf-8")
        new_urls.append(f"{ORIGIN}/compare/{slug}")
        print("wrote", dest.name)

    for fname in PDP_FILES:
        inject_pdp(HTML / "products" / fname)
        print("pdp faq", fname)

    update_sitemap(new_urls)
    update_compare_sot()
    stamp_public_pages()
    write_version_files()
    patch_agents_and_qa()
    print("new compare count", len(new_urls))


if __name__ == "__main__":
    main()
