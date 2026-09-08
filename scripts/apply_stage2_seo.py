#!/usr/bin/env python3
"""Apply Stage 2 unique meta, canonical, OG, Twitter, and JSON-LD to site HTML."""
from __future__ import annotations

import html as htmlmod
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from stage2_meta import PAGES, title_for, validate, HOST  # noqa: E402

SKIP_PREFIXES = ("html/_base44-brief/",)
SKIP_FILES = {
    "html/google831c5ec309d38eb5.html",
    "html/admin.html",
}

ATTR_RE = re.compile(r'([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|\'([^\']*)\')')


def esc(s: str) -> str:
    return htmlmod.escape(s, quote=True)


def parse_attrs(tag: str) -> dict:
    out = {}
    for m in ATTR_RE.finditer(tag):
        key = m.group(1).lower()
        val = m.group(3) if m.group(3) is not None else m.group(4)
        out[key] = val
    return out


def replace_or_insert_title(doc: str, title: str) -> str:
    tag = f"<title>{esc(title)}</title>"
    if re.search(r"<title\b[^>]*>.*?</title>", doc, flags=re.I | re.S):
        return re.sub(r"<title\b[^>]*>.*?</title>", tag, doc, count=1, flags=re.I | re.S)
    return insert_before_head_close(doc, tag)


def insert_before_head_close(doc: str, snippet: str) -> str:
    m = re.search(r"</head>", doc, flags=re.I)
    if not m:
        return doc + "\n" + snippet + "\n"
    return doc[: m.start()] + snippet + "\n" + doc[m.start() :]


def upsert_named_meta(doc: str, name: str, content: str | None) -> str:
    pat = re.compile(
        rf'<meta\b(?=[^>]*\bname=["\']{re.escape(name)}["\'])[^>]*>\s*',
        flags=re.I,
    )
    if content is None:
        return pat.sub("", doc)
    tag = f'<meta name="{name}" content="{esc(content)}">'
    if pat.search(doc):
        return pat.sub(tag + "\n", doc, count=1)
    return insert_before_head_close(doc, tag)


def upsert_prop_meta(doc: str, prop: str, content: str | None) -> str:
    pat = re.compile(
        rf'<meta\b(?=[^>]*\bproperty=["\']{re.escape(prop)}["\'])[^>]*>\s*',
        flags=re.I,
    )
    if content is None:
        return pat.sub("", doc)
    tag = f'<meta property="{prop}" content="{esc(content)}">'
    if pat.search(doc):
        return pat.sub(tag + "\n", doc, count=1)
    return insert_before_head_close(doc, tag)


def upsert_canonical(doc: str, url: str) -> str:
    pat = re.compile(r'<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*>\s*', flags=re.I)
    tag = f'<link rel="canonical" href="{esc(url)}">'
    if pat.search(doc):
        return pat.sub(tag + "\n", doc, count=1)
    return insert_before_head_close(doc, tag)


def strip_og_image_family(doc: str) -> str:
    doc = re.sub(
        r'<meta\b(?=[^>]*\bproperty=["\']og:image(?::[^"\']*)?["\'])[^>]*>\s*',
        "",
        doc,
        flags=re.I,
    )
    doc = re.sub(
        r'<meta\b(?=[^>]*\bname=["\']twitter:image(?::[^"\']*)?["\'])[^>]*>\s*',
        "",
        doc,
        flags=re.I,
    )
    return doc


def breadcrumb_script(items: list[tuple[str, str]]) -> str:
    data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": name,
                "item": url,
            }
            for i, (name, url) in enumerate(items)
        ],
    }
    return (
        '<script type="application/ld+json" id="breadcrumb-jsonld">'
        + json.dumps(data, ensure_ascii=False)
        + "</script>"
    )


def replace_jsonld_block(doc: str, script_id: str, payload: dict) -> str:
    tag = (
        f'<script type="application/ld+json" id="{script_id}">'
        + json.dumps(payload, ensure_ascii=False)
        + "</script>"
    )
    pat = re.compile(
        rf'<script\b[^>]*id=["\']{re.escape(script_id)}["\'][^>]*>.*?</script>',
        flags=re.I | re.S,
    )
    if pat.search(doc):
        return pat.sub(tag, doc, count=1)
    return insert_before_head_close(doc, tag)


def update_existing_product_jsonld(doc: str, rec: dict, title: str) -> str:
    def repl(m):
        raw = m.group(2)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return m.group(0)
        if data.get("@type") != "Product" and not (
            isinstance(data.get("@graph"), list)
            and any(isinstance(x, dict) and x.get("@type") == "Product" for x in data["@graph"])
        ):
            return m.group(0)
        target = data
        if data.get("@type") != "Product" and isinstance(data.get("@graph"), list):
            for x in data["@graph"]:
                if isinstance(x, dict) and x.get("@type") == "Product":
                    target = x
                    break
        target["description"] = rec["description"]
        if rec.get("jsonld_name"):
            target["name"] = rec["jsonld_name"]
        target.setdefault("url", rec["canonical"])
        if rec.get("price") is not None:
            offers = target.setdefault("offers", {"@type": "Offer", "priceCurrency": "USD"})
            if isinstance(offers, dict):
                offers["price"] = str(rec["price"])
                offers["priceCurrency"] = "USD"
                offers["url"] = rec["canonical"]
        return m.group(1) + json.dumps(target if target is data else data, ensure_ascii=False) + m.group(3)

    pat = re.compile(
        r'(<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)',
        flags=re.I | re.S,
    )
    new_doc, n = pat.subn(repl, doc, count=3)
    if n:
        return new_doc
    payload = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": rec.get("jsonld_name") or rec["topic"],
        "description": rec["description"],
        "url": rec["canonical"],
        "offers": {
            "@type": "Offer",
            "url": rec["canonical"],
            "priceCurrency": "USD",
            "price": str(rec.get("price") or ""),
            "availability": "https://schema.org/InStock",
        },
    }
    if rec.get("og_image"):
        payload["image"] = rec["og_image"]
    return insert_before_head_close(doc, f'<script type="application/ld+json" id="product-jsonld">{json.dumps(payload, ensure_ascii=False)}</script>')


def update_existing_article_jsonld(doc: str, rec: dict) -> str:
    def repl(m):
        raw = m.group(2)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return m.group(0)
        if data.get("@type") != "Article":
            return m.group(0)
        data["headline"] = rec.get("jsonld_name") or rec["topic"]
        data["description"] = rec["description"]
        data["mainEntityOfPage"] = {"@type": "WebPage", "@id": rec["canonical"]}
        return m.group(1) + json.dumps(data, ensure_ascii=False) + m.group(3)

    pat = re.compile(
        r'(<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)',
        flags=re.I | re.S,
    )
    new_doc, n = pat.subn(repl, doc, count=4)
    if '@type":"Article"' in new_doc.replace(" ", "") or '"@type": "Article"' in new_doc:
        return new_doc
    payload = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": rec.get("jsonld_name") or rec["topic"],
        "description": rec["description"],
        "author": {"@type": "Organization", "name": "BioLabs Research"},
        "publisher": {"@type": "Organization", "name": "BioLabs Research"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": rec["canonical"]},
    }
    return insert_before_head_close(doc, f'<script type="application/ld+json" id="article-jsonld">{json.dumps(payload, ensure_ascii=False)}</script>')


def apply_jsonld(doc: str, rec: dict, title: str) -> str:
    kind = rec.get("kind")
    if kind == "product":
        doc = update_existing_product_jsonld(doc, rec, title)
    elif kind == "article":
        doc = update_existing_article_jsonld(doc, rec)
    crumbs = rec.get("crumbs")
    if crumbs:
        if re.search(r'id=["\']breadcrumb-jsonld["\']', doc, flags=re.I):
            doc = replace_jsonld_block(doc, "breadcrumb-jsonld", {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": i + 1, "name": n, "item": u}
                    for i, (n, u) in enumerate(crumbs)
                ],
            })
        elif '"BreadcrumbList"' not in doc:
            doc = insert_before_head_close(doc, breadcrumb_script(crumbs))
    return doc


def freeze_pdp_js_seo(doc: str) -> str:
    """Keep unique static title/description/OG; do not let PDP JS overwrite them."""
    doc = doc.replace(
        "    document.title = p.name + ' | BioLabs Research';\n",
        "    /* Stage 2: keep unique static document.title */\n",
    )
    # applyProductSeo title/desc/og image writes
    doc = re.sub(
        r"    var title = p\.name \+ ' \| BioLabs Research';\n"
        r"    var desc = \(p\.name \+ ' research reagent\. ' \+ \(p\.tagline \|\| ''\) \+ ' Third-party tested lot\. Catalog price USD ' \+ p\.price \+ '\.'\)\.replace\(/\\s\+/g,' '\)\.trim\(\);\n"
        r"    document\.title = title;\n"
        r"    setMetaByName\('description', desc\);\n",
        "    var title = document.title;\n"
        r"    var descEl = document.querySelector('meta[name=\"description\"]');\n"
        "    var desc = descEl ? descEl.getAttribute('content') : (p.name + ' research reagent.');\n",
        doc,
        count=1,
    )
    doc = re.sub(
        r"    setMetaByProp\('og:title', title\);\n"
        r"    setMetaByProp\('og:description', desc\);\n"
        r"    setMetaByProp\('og:image', p\.image_url \|\| '[^']+'\);\n",
        "    setMetaByProp('og:title', title);\n"
        "    setMetaByProp('og:description', desc);\n"
        "    /* Stage 2: do not invent or overwrite og:image from API */\n",
        doc,
        count=1,
    )
    doc = re.sub(
        r"    setMetaByName\('twitter:title', title\);\n"
        r"    setMetaByName\('twitter:description', desc\);\n"
        r"    setMetaByName\('twitter:image', p\.image_url \|\| '[^']+'\);\n",
        "    setMetaByName('twitter:title', title);\n"
        "    setMetaByName('twitter:description', desc);\n",
        doc,
        count=1,
    )
    return doc


VIAL_ALT = {
    "bpc-157": "Clear glass research vial labeled BPC-157 with a gold crimp cap",
    "tb-500": "Clear glass research vial labeled TB-500 with a gold crimp cap",
    "nad-plus": "Clear glass research vial labeled NAD+ with a gold crimp cap",
    "ghk-cu": "Clear glass research vial labeled GHK-Cu with a gold crimp cap",
    "epithalon": "Clear glass research vial labeled Epithalon with a gold crimp cap",
    "mots-c": "Clear glass research vial labeled MOTS-c with a gold crimp cap",
    "kpv": "Clear glass research vial labeled KPV with a gold crimp cap",
    "semax": "Clear glass research vial labeled Semax with a gold crimp cap",
    "kisspeptin-10": "Clear glass research vial labeled Kisspeptin-10 with a gold crimp cap",
    "thymosin-alpha-1": "Clear glass research vial labeled Thymosin Alpha-1 with a gold crimp cap",
    "aod-9604": "Clear glass research vial labeled AOD-9604 with a gold crimp cap",
    "retatrutide": "Clear glass research vial labeled R3TA with a gold crimp cap",
    "glow-70": "Clear glass research vial labeled GLOW 70 with a gold crimp cap",
    "curcumin-phytosome": "Clear glass research vial labeled Curcumin Phytosome with a gold crimp cap",
    "tesamorelin-ipamorelin": "Clear glass research vial labeled Tesamorelin / Ipamorelin with a gold crimp cap",
    "bpc-157-tb-500-blend": "Clear glass research vial labeled BPC-157 / TB-500 Blend with a gold crimp cap",
}


def looks_like_filename_alt(alt: str) -> bool:
    a = (alt or "").strip()
    if not a:
        return True
    if re.search(r"\.(png|jpe?g|webp|gif|svg)$", a, flags=re.I):
        return True
    if a.lower() in {"image", "img", "photo", "picture"}:
        return True
    return False


def describe_src(src: str, fallback: str) -> str:
    src = src.split("?")[0]
    name = Path(src).name
    stem = re.sub(r"-\d+$", "", Path(name).stem)
    for slug, alt in VIAL_ALT.items():
        if slug in stem:
            return alt
    if "coa-trace" in stem:
        return "HPLC chromatogram trace printed on a lot certificate"
    if "logo-b" in stem or "nav-b" in stem:
        return "Bio Labs Research letter-B mark"
    if "tile-shipping" in stem:
        return "Sealed research parcel prepared for tracked shipping"
    if "blog-topic" in src:
        label = stem.replace("-", " ").strip()
        return f"Research note illustration for {label}"
    if fallback:
        return fallback
    return f"Photograph related to {stem.replace('-', ' ')}"


def fix_image_alts(doc: str) -> str:
    def repl(m):
        tag = m.group(0)
        attrs = parse_attrs(tag)
        src = attrs.get("src") or ""
        cls = attrs.get("class") or ""
        if "pdp-review" in cls or "reviewer-" in src:
            return tag  # do not touch review widget images
        alt = attrs.get("alt")
        nearby = m.group(1) or ""
        span = re.search(r"<span[^>]*>(.*?)</span>", nearby, flags=re.I | re.S)
        heading = re.search(r"<h[1-6][^>]*>(.*?)</h[1-6]>", nearby, flags=re.I | re.S)
        fallback = ""
        if span:
            fallback = re.sub(r"<[^>]+>", "", span.group(1)).strip()
        elif heading:
            fallback = re.sub(r"<[^>]+>", "", heading.group(1)).strip()
        if alt is None:
            new_alt = describe_src(src, fallback)
        elif looks_like_filename_alt(alt) or (alt.strip() and len(alt.strip()) < 4 and fallback):
            new_alt = describe_src(src, fallback or alt)
        elif alt.strip() in VIAL_ALT or alt.strip() in {
            "BPC-157", "TB-500", "NAD+", "GHK-Cu", "Epithalon", "MOTS-c", "KPV",
            "Semax", "Kisspeptin-10", "Thymosin Alpha-1", "AOD-9604", "GLOW 70",
            "Curcumin Phytosome (Meriva)", "Tesamorelin / Ipamorelin",
            "BPC-157 / TB-500 Blend", "R3TA",
        }:
            new_alt = describe_src(src, alt.strip())
        else:
            return tag
        if "alt=" in tag:
            return re.sub(r'\balt=("([^"]*)"|\'([^\']*)\')', f'alt="{esc(new_alt)}"', tag, count=1)
        return tag[:-1] + f' alt="{esc(new_alt)}">'

    return re.sub(r"<img\b[^>]*>((?:(?!</a>|</div>).){0,240})", repl, doc, flags=re.I | re.S)


def apply_page(path: str, rec: dict, text: str) -> str:
    title = title_for(rec)
    text = replace_or_insert_title(text, title)
    text = upsert_named_meta(text, "description", rec["description"])
    text = upsert_canonical(text, rec["canonical"])
    text = upsert_prop_meta(text, "og:title", title)
    text = upsert_prop_meta(text, "og:description", rec["description"])
    text = upsert_prop_meta(text, "og:url", rec["canonical"])
    text = upsert_prop_meta(text, "og:type", rec["og_type"])
    text = upsert_prop_meta(text, "og:site_name", "BioLabs Research")
    text = upsert_named_meta(text, "twitter:card", "summary_large_image")
    text = upsert_named_meta(text, "twitter:title", title)
    text = upsert_named_meta(text, "twitter:description", rec["description"])
    if rec.get("og_image"):
        text = upsert_prop_meta(text, "og:image", rec["og_image"])
        text = upsert_named_meta(text, "twitter:image", rec["og_image"])
    else:
        text = strip_og_image_family(text)
    text = apply_jsonld(text, rec, title)
    if rec.get("kind") == "product" or path.startswith("html/products/"):
        text = freeze_pdp_js_seo(text)
    text = fix_image_alts(text)
    return text


def main() -> int:
    errs = validate()
    if errs:
        print("META MAP INVALID")
        for e in errs:
            print(" ", e)
        return 1
    changed = 0
    for rel, rec in sorted(PAGES.items()):
        fp = ROOT / rel
        if not fp.exists():
            print("MISSING", rel)
            continue
        old = fp.read_text(encoding="utf-8")
        new = apply_page(rel, rec, old)
        if new != old:
            fp.write_text(new, encoding="utf-8")
            changed += 1
            print("updated", rel)
        else:
            print("unchanged", rel)
    print(f"changed {changed}/{len(PAGES)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
