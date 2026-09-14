#!/usr/bin/env python3
"""Yehuda SEO/a11y pack: unique meta, OG 1200x630, Product JSON-LD, alts, a11y on PDPs."""
from __future__ import annotations

import html as htmlmod
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "https://biolabsresearch.co"
OG = f"{HOST}/media/og-share.jpg"
SUFFIX = " — Bio Labs Research"

# First listed strength + its SoT price (catalog-mg.js FALLBACK / live /api/products).
# JSON-LD offers.price uses this (PDP default), not an invented figure.
PDPS = {
    "aod-9604": {
        "name": "AOD-9604",
        "mg": "5 mg",
        "price": 42,
        "image": f"{HOST}/media/vial-aod-9604.png?v=156",
        "sku": "aod-9604",
        "cas": ["221231-10-3"],
        "alt": "Clear glass research vial labeled AOD-9604 with a gold crimp cap",
        "desc": "AOD-9604 is listed as an hGH-fragment analog for laboratory inquiry in 5 mg and 10 mg vials. Lot papers on request. Research use only, not a medicine.",
    },
    "bpc-157": {
        "name": "BPC-157",
        "mg": "10 mg",
        "price": 88,
        "image": f"{HOST}/media/vial-bpc-157.png?v=156",
        "sku": "bpc-157",
        "cas": ["137525-51-0"],
        "alt": "Clear glass research vial labeled BPC-157 with a gold crimp cap",
        "desc": "BPC-157 is listed as a pentadecapeptide research reagent in 10 mg and 20 mg vials. Inquire for a lot; papers on request. Research use only, not a medicine.",
    },
    "bpc-157-tb-500-blend": {
        "name": "BPC-157 / TB-500 Blend",
        "mg": "20 mg",
        "price": 125,
        "image": f"{HOST}/media/vial-bpc-157-tb-500-blend.png?v=156",
        "sku": "bpc-157-tb-500-blend",
        "cas": ["137525-51-0", "885340-09-2"],
        "alt": "Clear glass research vial labeled BPC-157 / TB-500 Blend with a gold crimp cap",
        "desc": "BPC-157 / TB-500 Blend is a two-sequence laboratory listing at 20 mg. Amounts belong on the lot file. Inquire for papers. Research use only, not a medicine.",
    },
    "epithalon": {
        "name": "Epithalon",
        "mg": "10 mg",
        "price": 45,
        "image": f"{HOST}/media/vial-epithalon.png?v=155",
        "sku": "epithalon",
        "cas": ["307297-39-8"],
        "alt": "Clear glass research vial labeled Epithalon with a gold crimp cap",
        "desc": "Epithalon is listed as a tetrapeptide laboratory reagent in 10 mg and 50 mg vials. Lot papers on request. Research use only; no aging-treatment claim is made.",
    },
    "ghk-cu": {
        "name": "GHK-Cu",
        "mg": "100 mg",
        "price": 100,
        "image": f"{HOST}/media/vial-ghk-cu.png?v=155",
        "sku": "ghk-cu",
        "cas": ["89030-95-5"],
        "alt": "Clear glass research vial labeled GHK-Cu with a gold crimp cap",
        "desc": "GHK-Cu is listed as a copper-binding tripeptide research reagent at 100 mg. Lot papers on request. Research use only; this is not a cosmetic finished good.",
    },
    "glow-70": {
        "name": "GLOW 70",
        "mg": "70 mg",
        "price": 139,
        "image": f"{HOST}/media/vial-glow-70.png?v=158",
        "sku": "glow-70",
        "cas": [],
        "extra": [{"@type": "PropertyValue", "name": "Identity", "value": "Named catalog blend"}],
        "alt": "Clear glass research vial labeled GLOW 70 with a gold crimp cap",
        "desc": "GLOW 70 is a named catalog blend at 70 mg without a CAS number. Components belong on the lot COA. Inquire for papers. Research use only, not a medicine.",
    },
    "ipamorelin": {
        "name": "Ipamorelin",
        "mg": "10 mg",
        "price": 80,
        "image": f"{HOST}/media/vial-ipamorelin.png?v=161",
        "sku": "ipamorelin",
        "cas": ["67727-97-3"],
        "alt": "Clear glass research vial labeled Ipamorelin with a gold crimp cap",
        "desc": "Ipamorelin is listed as a pentapeptide laboratory reagent at 10 mg. Inquire for a lot; papers on request. Research use only, not a secretagogue medicine.",
    },
    "kisspeptin-10": {
        "name": "Kisspeptin-10",
        "mg": "10 mg",
        "price": 99,
        "image": f"{HOST}/media/vial-kisspeptin-10.png?v=155",
        "sku": "kisspeptin-10",
        "cas": ["374675-21-5"],
        "alt": "Clear glass research vial labeled Kisspeptin-10 with a gold crimp cap",
        "desc": "Kisspeptin-10 is listed as a KISS1 fragment laboratory reagent at 10 mg. Sequence belongs on the lot file. Inquire for papers. Research use only.",
    },
    "kpv": {
        "name": "KPV",
        "mg": "10 mg",
        "price": 79,
        "image": f"{HOST}/media/vial-kpv.png?v=155",
        "sku": "kpv",
        "cas": ["67727-97-3"],
        "alt": "Clear glass research vial labeled KPV with a gold crimp cap",
        "desc": "KPV is listed as an alpha-MSH fragment laboratory reagent at 10 mg. Lot papers on request. Research use only; not a topical, veterinary, or clinical product.",
    },
    "mots-c": {
        "name": "MOTS-c",
        "mg": "10 mg",
        "price": 95,
        "image": f"{HOST}/media/vial-mots-c.png?v=155",
        "sku": "mots-c",
        "cas": ["1627580-64-6"],
        "alt": "Clear glass research vial labeled MOTS-c with a gold crimp cap",
        "desc": "MOTS-c is listed as a mitochondrial-derived peptide reagent in 10 mg and 20 mg vials. Lot papers on request. Intended for in vitro laboratory work only.",
    },
    "nad-plus": {
        "name": "NAD+",
        "mg": "500 mg",
        "price": 99,
        "image": f"{HOST}/media/vial-nad-plus.png?v=156",
        "sku": "nad-plus",
        "cas": ["53-84-9"],
        "alt": "Clear glass research vial labeled NAD+ with a gold crimp cap",
        "desc": "NAD+ is listed as a biochemical reference standard in 500 mg and 1000 mg sizes. Lot papers on request. Research use only; this is not a dietary supplement.",
    },
    "retatrutide": {
        "name": "R3TA",
        "mg": "10 mg",
        "price": 85,
        "image": f"{HOST}/media/vial-retatrutide.png?v=155",
        "sku": "retatrutide",
        "cas": ["2381089-83-2"],
        "alt": "Clear glass research vial labeled R3TA with a gold crimp cap",
        "desc": "R3TA is listed as a laboratory research compound in 10 mg, 20 mg, and 50 mg vials. Lot papers on request. Investigational laboratory context only.",
    },
    "semaglutide": {
        "name": "Semaglutide",
        "mg": "5 mg",
        "price": 60,
        "image": f"{HOST}/media/vial-semaglutide.png?v=162",
        "sku": "semaglutide",
        "cas": ["910463-68-2"],
        "alt": "Clear glass research vial labeled Semaglutide with a gold crimp cap",
        "desc": "Semaglutide is listed as a laboratory research compound in 5 mg and 10 mg vials. Inquire for a lot; papers on request. Research use only, not for human use.",
    },
    "semax": {
        "name": "Semax",
        "mg": "10 mg",
        "price": 99,
        "image": f"{HOST}/media/vial-semax.png?v=157",
        "sku": "semax",
        "cas": ["80714-61-0"],
        "alt": "Clear glass research vial labeled Semax with a gold crimp cap",
        "desc": "Semax is listed as an ACTH fragment laboratory reagent in 10 mg and 30 mg vials. Lot papers on request. Research use only; not a registered drug label.",
    },
    "tb-500": {
        "name": "TB-500",
        "mg": "10 mg",
        "price": 105,
        "image": f"{HOST}/media/vial-tb-500.png?v=155",
        "sku": "tb-500",
        "cas": ["885340-09-2"],
        "alt": "Clear glass research vial labeled TB-500 with a gold crimp cap",
        "desc": "TB-500 is listed as a thymosin-beta-4 fragment reagent at 10 mg. Identity is the sequence on the lot COA. Inquire for papers. Research use only, not a medicine.",
    },
    "tesamorelin": {
        "name": "Tesamorelin",
        "mg": "10 mg",
        "price": 85,
        "image": f"{HOST}/media/vial-tesamorelin.png?v=161",
        "sku": "tesamorelin",
        "cas": ["218949-48-5"],  # PUB_IDS on the page (JSON-LD had MOTS-c CAS by mistake)
        "alt": "Clear glass research vial labeled Tesamorelin with a gold crimp cap",
        "desc": "Tesamorelin is listed as a GHRH analog laboratory reagent in 10 mg and 20 mg vials. Lot papers on request. Research use only, not a prescription medicine.",
    },
    "tesamorelin-ipamorelin": {
        "name": "Tesamorelin / Ipamorelin",
        "mg": "10 mg",
        "price": 119,
        "image": f"{HOST}/media/vial-tesamorelin-ipamorelin.png?v=156",
        "sku": "tesamorelin-ipamorelin",
        "cas": ["218949-48-5", "170851-70-4"],
        "alt": "Clear glass research vial labeled Tesamorelin / Ipamorelin with a gold crimp cap",
        "desc": "Tesamorelin / Ipamorelin is a two-compound laboratory blend at 10 mg. Two masses belong on the COA. Inquire for papers. Research use only, not a medicine.",
    },
    "thymosin-alpha-1": {
        "name": "Thymosin Alpha-1",
        "mg": "10 mg",
        "price": 109,
        "image": f"{HOST}/media/vial-thymosin-alpha-1.png?v=158",
        "sku": "thymosin-alpha-1",
        "cas": ["62304-98-7"],
        "alt": "Clear glass research vial labeled Thymosin Alpha-1 with a gold crimp cap",
        "desc": "Thymosin Alpha-1 is listed as a 28-residue N-acetyl peptide reagent at 10 mg. Lot papers on request. Research use only; do not confuse it with TB-500.",
    },
    "tirzepatide": {
        "name": "Tirzepatide",
        "mg": "10 mg",
        "price": 90,
        "image": f"{HOST}/media/vial-tirzepatide.png?v=161",
        "sku": "tirzepatide",
        "cas": ["2023788-19-2"],
        "alt": "Clear glass research vial labeled Tirzepatide with a gold crimp cap",
        "desc": "Tirzepatide is listed as a laboratory research compound at 10 mg. Inquire for a lot; papers on request. Research use only, not for human or veterinary use.",
    },
}

APPLY_SEO_FN = r'''  function applyProductSeo(p){
    var url = 'https://biolabsresearch.co/products/' + p.slug;
    var title = document.title;
    var descEl = document.querySelector('meta[name="description"]');
    var desc = descEl ? descEl.getAttribute('content') : (p.name + ' research reagent.');
    setCanonical(url);
    setMetaByProp('og:title', title);
    setMetaByProp('og:description', desc);
    /* Keep static 1200x630 og:image; do not overwrite from API vial URL */
    setMetaByProp('og:url', url);
    setMetaByProp('og:type', 'product');
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', title);
    setMetaByName('twitter:description', desc);
    var el = document.getElementById('product-jsonld');
    var data = {};
    try { if (el && el.textContent) data = JSON.parse(el.textContent); } catch (e) { data = {}; }
    data["@context"] = "https://schema.org";
    data["@type"] = "Product";
    if (!data.name) data.name = p.name;
    data.description = desc;
    data.url = url;
    if (!data.sku) data.sku = p.slug;
    if (!data.brand) data.brand = {"@type":"Brand","name":"Bio Labs Research"};
    var price = p.price;
    var sp = p.strength_prices || {};
    var st = p.strengths || [];
    if (st.length) {
      var k0 = String(st[0]).replace(/\s+/g,'').toLowerCase();
      Object.keys(sp).forEach(function(x){
        if (String(x).replace(/\s+/g,'').toLowerCase()===k0) price = sp[x];
      });
    }
    if (price != null && price !== '') {
      data.offers = data.offers && typeof data.offers === 'object' ? data.offers : {"@type":"Offer"};
      data.offers["@type"] = "Offer";
      data.offers.priceCurrency = "USD";
      data.offers.price = String(price);
      data.offers.url = url;
      var inStock = String(p.stock_status||'').toLowerCase().indexOf('in stock') !== -1 || p.is_active === true;
      if (p.stock_status || p.is_active === true || p.is_active === false) {
        data.offers.availability = inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
      }
    }
    setProductJsonLd(data);
  }'''


def esc(s: str) -> str:
    return htmlmod.escape(s, quote=True)


def title_for(rec: dict) -> str:
    return f"{rec['name']} {rec['mg']}{SUFFIX}"


def product_jsonld(slug: str, rec: dict) -> dict:
    extra = list(rec.get("extra") or [])
    for cas in rec.get("cas") or []:
        extra.append({"@type": "PropertyValue", "name": "CAS", "value": cas})
    data = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": rec["name"],
        "image": rec["image"],
        "description": rec["desc"],
        "sku": rec["sku"],
        "brand": {"@type": "Brand", "name": "Bio Labs Research"},
        "manufacturer": {"@type": "Organization", "name": "LEEDS MARKETING GROUP LTD"},
        "offers": {
            "@type": "Offer",
            "url": f"{HOST}/products/{slug}",
            "priceCurrency": "USD",
            "price": str(rec["price"]),
            "availability": "https://schema.org/InStock",
        },
        "url": f"{HOST}/products/{slug}",
    }
    if extra:
        data["additionalProperty"] = extra
    return data


def upsert_named_meta(doc: str, name: str, content: str) -> str:
    pat = re.compile(
        rf'<meta\b(?=[^>]*\bname=["\']{re.escape(name)}["\'])[^>]*>\s*',
        flags=re.I,
    )
    tag = f'<meta name="{name}" content="{esc(content)}">'
    if pat.search(doc):
        return pat.sub(tag + "\n", doc, count=1)
    return insert_before_head_close(doc, tag)


def upsert_prop_meta(doc: str, prop: str, content: str) -> str:
    pat = re.compile(
        rf'<meta\b(?=[^>]*\bproperty=["\']{re.escape(prop)}["\'])[^>]*>\s*',
        flags=re.I,
    )
    tag = f'<meta property="{prop}" content="{esc(content)}">'
    if pat.search(doc):
        return pat.sub(tag + "\n", doc, count=1)
    return insert_before_head_close(doc, tag)


def insert_before_head_close(doc: str, snippet: str) -> str:
    m = re.search(r"</head>", doc, flags=re.I)
    if not m:
        return doc + "\n" + snippet + "\n"
    return doc[: m.start()] + snippet + "\n" + doc[m.start() :]


def replace_title(doc: str, title: str) -> str:
    tag = f"<title>{esc(title)}</title>"
    return re.sub(r"<title\b[^>]*>.*?</title>", tag, doc, count=1, flags=re.I | re.S)


def replace_canonical(doc: str, url: str) -> str:
    pat = re.compile(r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>\s*', flags=re.I)
    tag = f'<link rel="canonical" href="{esc(url)}">'
    if pat.search(doc):
        return pat.sub(tag + "\n", doc, count=1)
    return insert_before_head_close(doc, tag)


def replace_product_jsonld(doc: str, payload: dict) -> str:
    tag = (
        '<script type="application/ld+json" id="product-jsonld">'
        + json.dumps(payload, ensure_ascii=False)
        + "</script>"
    )
    pat = re.compile(
        r'<script\b[^>]*id=["\']product-jsonld["\'][^>]*>.*?</script>',
        flags=re.I | re.S,
    )
    if pat.search(doc):
        return pat.sub(tag, doc, count=1)
    return insert_before_head_close(doc, tag)


def apply_head(doc: str, slug: str, rec: dict) -> str:
    title = title_for(rec)
    desc = rec["desc"]
    url = f"{HOST}/products/{slug}"
    doc = replace_title(doc, title)
    doc = upsert_named_meta(doc, "description", desc)
    doc = replace_canonical(doc, url)
    doc = upsert_prop_meta(doc, "og:title", title)
    doc = upsert_prop_meta(doc, "og:description", desc)
    doc = upsert_prop_meta(doc, "og:url", url)
    doc = upsert_prop_meta(doc, "og:type", "product")
    doc = upsert_prop_meta(doc, "og:site_name", "BioLabs Research")
    doc = upsert_prop_meta(doc, "og:image", OG)
    doc = upsert_prop_meta(doc, "og:image:width", "1200")
    doc = upsert_prop_meta(doc, "og:image:height", "630")
    doc = upsert_named_meta(doc, "twitter:card", "summary_large_image")
    doc = upsert_named_meta(doc, "twitter:title", title)
    doc = upsert_named_meta(doc, "twitter:description", desc)
    doc = upsert_named_meta(doc, "twitter:image", OG)
    doc = replace_product_jsonld(doc, product_jsonld(slug, rec))
    return doc


def fix_static_vial_alt(doc: str, rec: dict) -> tuple[str, int]:
    n = 0

    def repl(m):
        nonlocal n
        tag = m.group(0)
        if "vial-" not in tag:
            return tag
        alt_m = re.search(r'\balt=("([^"]*)"|\'([^\']*)\')', tag)
        old = ""
        if alt_m:
            old = alt_m.group(2) if alt_m.group(2) is not None else (alt_m.group(3) or "")
        new = rec["alt"]
        if old == new:
            return tag
        n += 1
        if alt_m:
            return re.sub(r'\balt=("([^"]*)"|\'([^\']*)\')', f'alt="{esc(new)}"', tag, count=1)
        return tag[:-1] + f' alt="{esc(new)}">'

    doc = re.sub(
        r'<img\b[^>]*src="[^"]*vial-[^"]*"[^>]*>',
        repl,
        doc,
        flags=re.I,
    )
    return doc, n


def fix_js_gallery_alts(doc: str, rec: dict) -> str:
    name = rec["name"]
    doc = doc.replace(
        """'<div class="product-img-main"><img id="pdpMainImg" src="'+img+'" alt="'+p.name+'"></div>'""",
        """'<div class="product-img-main"><img id="pdpMainImg" src="'+img+'" alt="'+p.name+' research vial with gold crimp cap"></div>'""",
    )
    # First thumb: front view (unique vs dose thumbs)
    doc = re.sub(
        r"""aria-label="Vial view"><img src="'\+img\+'" alt=""></button>""",
        f"""aria-label="Vial view"><img src="'+img+'" alt="{esc(name)} research vial, front view"></button>""",
        doc,
        count=1,
    )
    # Dose thumbs: unique alt from aria-label
    def thumb_repl(m):
        label = m.group(1)
        src = m.group(2)
        alt = f"{name} {label.replace(' vial', '')} research vial"
        return f'aria-label="{label}"><img src="{src}" alt="{esc(alt)}"></button>'

    doc = re.sub(
        r'aria-label="(\d+\s*mg vial)"><img src="([^"]+)" alt=""></button>',
        thumb_repl,
        doc,
    )
    return doc


def fix_qty_aria(doc: str) -> str:
    doc = doc.replace(
        """onclick="changePdpQty(-1)" style="background:none;border:none;width:44px;height:44px;font-size:18px;cursor:pointer;color:var(--ink)">\\u2212</button>""",
        """onclick="changePdpQty(-1)" aria-label="Decrease quantity" style="background:none;border:none;width:44px;height:44px;font-size:18px;cursor:pointer;color:var(--ink)">\\u2212</button>""",
    )
    doc = doc.replace(
        """onclick="changePdpQty(1)" style="background:none;border:none;width:44px;height:44px;font-size:18px;cursor:pointer;color:var(--ink)">+</button>""",
        """onclick="changePdpQty(1)" aria-label="Increase quantity" style="background:none;border:none;width:44px;height:44px;font-size:18px;cursor:pointer;color:var(--ink)">+</button>""",
    )
    return doc


def fix_headings(doc: str) -> str:
    doc = doc.replace(
        '<h3 style="font-family:Fraunces,serif;font-size:22px;margin-bottom:16px;color:#1F1F1F">Related Research Articles</h3>',
        '<h2 style="font-family:Fraunces,serif;font-size:22px;margin-bottom:16px;color:#1F1F1F">Related Research Articles</h2>',
    )
    doc = doc.replace(
        "'<div class=\"research-note\"><h3>What this listing is</h3>",
        "'<div class=\"research-note\"><h2>What this listing is</h2>",
    )
    doc = re.sub(
        r'(<div class="footer-col">\s*)<h4>',
        r"\1<h2>",
        doc,
    )
    doc = re.sub(
        r"(<div class=\"footer-col\">\s*)<h4>",
        r"\1<h2>",
        doc,
    )
    # Close footer column headings that were h4
    # Only replace h4 that sit in footer-col — already opened as h2; leftover </h4>
    doc = re.sub(
        r"(<div class=\"footer-col\">\s*<h2>[^<]+)</h4>",
        r"\1</h2>",
        doc,
    )
    doc = re.sub(
        r'(<div class="footer-col">\s*<h2>[^<]+)</h4>',
        r"\1</h2>",
        doc,
    )
    doc = doc.replace(".footer-col h4{", ".footer-col h2,.footer-col h4{")
    return doc


def fix_coa_form(doc: str) -> str:
    pairs = [
        ("First Name *", "coa-req-first"),
        ("Last Name *", "coa-req-last"),
        ("Email *", "coa-req-email"),
        ("Company / Institution", "coa-req-org"),
        ("Message", "coa-req-msg"),
    ]
    for label, fid in pairs:
        doc = doc.replace(
            f'<label style="font-family:var(--font-display);font-size:10px;font-weight:700;color:#0d2137;text-transform:uppercase;letter-spacing:0.8px">{label}</label>',
            f'<label for="{fid}" style="font-family:var(--font-display);font-size:10px;font-weight:700;color:#0d2137;text-transform:uppercase;letter-spacing:0.8px">{label}</label>',
        )
    doc = doc.replace(
        '<button onclick="closeCOARequest()" style="background:none;border:none;cursor:pointer;padding:4px;color:#4a6358;font-size:20px;line-height:1">&#x2715;</button>',
        '<button type="button" onclick="closeCOARequest()" aria-label="Close certificate request" style="background:none;border:none;cursor:pointer;min-width:44px;min-height:44px;padding:10px;color:#4a6358;font-size:20px;line-height:1">&#x2715;</button>',
    )
    return doc


def replace_apply_product_seo(doc: str) -> str:
    pat = re.compile(
        r"  function applyProductSeo\(p\)\{.*?\n  \}\n",
        flags=re.S,
    )
    if not pat.search(doc):
        return doc
    return pat.sub(lambda _m: APPLY_SEO_FN + "\n", doc, count=1)


def apply_pdp(path: Path, slug: str, rec: dict) -> tuple[str, int]:
    doc = path.read_text(encoding="utf-8")
    doc = apply_head(doc, slug, rec)
    doc, alt_n = fix_static_vial_alt(doc, rec)
    doc = fix_js_gallery_alts(doc, rec)
    doc = fix_qty_aria(doc)
    doc = fix_headings(doc)
    doc = fix_coa_form(doc)
    doc = replace_apply_product_seo(doc)
    doc = doc.replace("fetch('https://biolabsresearch.co/api/products')", "fetch('/api/products')")
    doc = doc.replace('fetch("https://biolabsresearch.co/api/products")', "fetch('/api/products')")
    doc = doc.replace("/biolabs_style.css?v=370", "/biolabs_style.css?v=371")
    return doc, alt_n


def validate_copy() -> list[str]:
    errs = []
    titles = {}
    descs = {}
    for slug, rec in PDPS.items():
        t = title_for(rec)
        d = rec["desc"]
        if len(t) > 60:
            errs.append(f"{slug}: title {len(t)} > 60: {t!r}")
        if not (140 <= len(d) <= 160):
            errs.append(f"{slug}: desc {len(d)} not in 140-160: {d!r}")
        if t in titles:
            errs.append(f"{slug}: duplicate title with {titles[t]}")
        titles[t] = slug
        if d in descs:
            errs.append(f"{slug}: duplicate desc with {descs[d]}")
        descs[d] = slug
        banned = ("weight-loss", "weight loss", "buy now", "buy ", "therapeutic", "dose ", "dosing")
        low = d.lower()
        for b in banned:
            if b in low:
                errs.append(f"{slug}: banned phrase {b!r} in description")
    return errs


def main() -> int:
    errs = validate_copy()
    if errs:
        print("COPY INVALID")
        for e in errs:
            print(" ", e)
        return 1
    alt_total = 0
    for slug, rec in sorted(PDPS.items()):
        fp = ROOT / "html" / "products" / f"{slug}.html"
        if not fp.exists():
            print("MISSING", slug)
            continue
        new, alt_n = apply_pdp(fp, slug, rec)
        fp.write_text(new, encoding="utf-8")
        alt_total += alt_n
        print(f"updated {slug} title={title_for(rec)!r} desc_len={len(rec['desc'])} static_alts={alt_n}")
    print(f"static vial alts changed: {alt_total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
