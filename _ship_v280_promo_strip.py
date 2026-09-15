#!/usr/bin/env python3
"""v2.80: strip expired INSIDER25 promo chrome sitewide + PDP strike/launch-note."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path("/var/www/biofirst")
HTML = ROOT / "html"
VER = HTML / "version.json"
VER_ROOT = ROOT / "version.json"
VERSION_MD = ROOT / "VERSION.md"
INDEX = HTML / "index.html"

BACKUP = HTML / "_bak_v280_promo_strip"
BACKUP.mkdir(exist_ok=True)

PROMO_EMPTY = (
    '<div class="promo-stack" id="promoStack" hidden style="display:none!important" aria-hidden="true">\n'
    "  <!-- promo ended: insider code / percent-off countdown removed -->\n"
    "</div>"
)

SKIP_PARTS = (".bak", "_bak_", "_site-bak", "node_modules")


def should_skip(path: Path) -> bool:
    s = str(path)
    return any(x in s for x in SKIP_PARTS)


def replace_promo_stack(text: str) -> tuple[str, bool]:
    """Replace #promoStack element (nested divs) with empty home-pattern shell."""
    m = re.search(
        r'<div\s+class="promo-stack"\s+id="promoStack"[^>]*>',
        text,
        flags=re.I,
    )
    if not m:
        # alternate attr order
        m = re.search(
            r'<div\s+id="promoStack"\s+class="promo-stack"[^>]*>',
            text,
            flags=re.I,
        )
    if not m:
        return text, False

    start = m.start()
    i = m.end()
    depth = 1
    n = len(text)
    while i < n and depth > 0:
        next_open = text.find("<div", i)
        next_close = text.find("</div>", i)
        if next_close < 0:
            break
        if next_open >= 0 and next_open < next_close:
            # only count real div opens (not </div>)
            # check it's <div ...> not something else
            depth += 1
            i = next_open + 4
        else:
            depth -= 1
            i = next_close + len("</div>")

    if depth != 0:
        # fallback: wipe INSIDER promo-group inners only
        text2, nsub = re.subn(
            r'<div class="promo-group">[\s\S]*?</div>',
            "",
            text,
            flags=re.I,
        )
        if nsub:
            return text2, True
        return text, False

    end = i
    # drop trailing blank lines after the block (keep one newline)
    while end < n and text[end] in " \t":
        end += 1
    if end < n and text[end] == "\n":
        end += 1

    new_text = text[:start] + PROMO_EMPTY + "\n" + text[end:]
    return new_text, True


def strip_ssr_price_original(text: str) -> tuple[str, int]:
    text2, n = re.subn(
        r'\s*<span class="price-original">\$[^<]*</span>',
        "",
        text,
    )
    return text2, n


def fix_pdp_orig_html(text: str) -> tuple[str, int]:
    """Kill origHtml strike + INSIDER launch note; leave no INSIDER25 string."""
    n = 0
    patterns = [
        # common two-line form
        (
            re.compile(
                r"\s*var origHtml = \(p\.original_price && parseFloat\(p\.original_price\) > parseFloat\(p\.price\)\)\s*"
                r"\? '<span class=\"price-compare\"><span class=\"price-original\">\$'\+p\.original_price\+'</span>"
                r"<span class=\"price-launch-note\">INSIDER25 · 25% off</span></span>' : '';",
                re.M,
            ),
            (
                "\n    var ACTIVE_PROMO = false; /* launch promo ended — no strike / launch note */\n"
                "    var origHtml = '';"
            ),
        ),
        # single-line variants
        (
            re.compile(
                r"var origHtml = \(p\.original_price && parseFloat\(p\.original_price\) > parseFloat\(p\.price\)\)\s*"
                r"\? '[^']*price-launch-note[^']*' : '';"
            ),
            (
                "var ACTIVE_PROMO = false; /* launch promo ended — no strike / launch note */\n"
                "    var origHtml = '';"
            ),
        ),
        (
            re.compile(
                r"var origHtml = \([^;]+\)\s*\? '[^']*INSIDER25[^']*' : '';"
            ),
            (
                "var ACTIVE_PROMO = false; /* launch promo ended — no strike / launch note */\n"
                "    var origHtml = '';"
            ),
        ),
    ]
    for rx, repl in patterns:
        text2, k = rx.subn(repl, text, count=1)
        if k:
            text = text2
            n += k
            break

    # If still has price-launch-note / INSIDER25 · in JS strings, neutralize
    if "price-launch-note" in text or "INSIDER25 ·" in text:
        text2, k = re.subn(
            r"<span class=\"price-launch-note\">[^<]*</span>",
            "",
            text,
        )
        n += k
        text = text2
        text2, k = re.subn(r"INSIDER25 · 25% off", "", text)
        n += k
        text = text2

    # Force ACTIVE_PROMO gate if someone left a conditional without it
    if "var origHtml =" in text and "ACTIVE_PROMO" not in text.split("var origHtml =")[0][-200:]:
        # already handled above usually
        pass

    return text, n


def stamp_version(text: str) -> str:
    text = text.replace('content="2.79"', 'content="2.80"')
    text = text.replace('content="2.78"', 'content="2.80"')
    text = text.replace('content="2.77"', 'content="2.80"')
    text = re.sub(r'(data-site-version=")2\.\d+(")', r"\g<1>2.80\2", text)
    text = re.sub(
        r'(class="site-version"[^>]*>)v2\.\d+(</p>)',
        r"\g<1>v2.80\2",
        text,
    )
    text = re.sub(r"(>v)2\.(?:7[789]|80)(</)", r"\g<1>2.80\2", text)
    # cache busts
    text = re.sub(r"biolabs_style\.css\?v=\d+", "biolabs_style.css?v=364", text)
    text = re.sub(r"promo-bar\.js\?v=\d+", "promo-bar.js?v=293", text)
    return text


def main() -> None:
    # backup key samples
    for rel in (
        "index.html",
        "products/bpc-157.html",
        "products/nad-plus.html",
        "science.html",
        "shipping.html",
        "promo-bar.js",
        "version.json",
    ):
        src = HTML / rel
        if src.exists():
            dest = BACKUP / rel.replace("/", "__")
            if not dest.exists():
                shutil.copy2(src, dest)
    print("Backups in", BACKUP)

    # Ensure promo-bar.js stays noop stub
    promo_js = HTML / "promo-bar.js"
    stub = (
        "/* INSIDER25 promo removed (Yehuda 2026-09-15). Keep file so cached <script src> does not 404. */\n"
        "(function(){\n"
        "  function kill(){\n"
        '    var nodes = document.querySelectorAll("#promoStack, .promo-stack, .promo-bar");\n'
        "    for (var i = 0; i < nodes.length; i++) {\n"
        "      var el = nodes[i];\n"
        '      el.style.display = "none";\n'
        '      el.setAttribute("hidden", "");\n'
        '      el.classList.add("promo-ended");\n'
        "      try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}\n"
        "    }\n"
        '    try { document.documentElement.classList.remove("has-promo"); } catch (e2) {}\n'
        "  }\n"
        '  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kill);\n'
        "  else kill();\n"
        "})();\n"
    )
    if promo_js.exists():
        cur = promo_js.read_text(encoding="utf-8", errors="replace")
        if "function kill" not in cur or "INSIDER25 promo + countdown" in cur[:120]:
            promo_js.write_text(stub, encoding="utf-8")
            print("promo-bar.js rewritten as noop stub")
        else:
            print("promo-bar.js already noop stub")

    stats = {
        "html_files": 0,
        "promo_emptied": 0,
        "ssr_strikes_removed": 0,
        "origHtml_fixed": 0,
        "stamped": 0,
        "insider_left_html": [],
    }

    for path in sorted(HTML.rglob("*.html")):
        if should_skip(path):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        orig = text
        stats["html_files"] += 1

        text2, did = replace_promo_stack(text)
        if did:
            text = text2
            stats["promo_emptied"] += 1

        # products: SSR + JS
        if "/products/" in str(path) or path.name == "product.html":
            text, n_ssr = strip_ssr_price_original(text)
            stats["ssr_strikes_removed"] += n_ssr
            text, n_js = fix_pdp_orig_html(text)
            stats["origHtml_fixed"] += n_js

        # Safety: any remaining live promo-group INSIDER markup
        if 'data-code="INSIDER25"' in text or "25% off — code" in text:
            text2, k = re.subn(
                r'<div class="promo-group">[\s\S]*?</div>',
                "",
                text,
            )
            text = text2
            if 'data-code="INSIDER25"' in text:
                text = text.replace('data-code="INSIDER25"', 'data-code=""')
                text = text.replace(">INSIDER25<", "><!--ended-->")
                text = re.sub(r"25% off — code", "<!-- ended -->", text)

        text = stamp_version(text)

        if text != orig:
            path.write_text(text, encoding="utf-8")
            stats["stamped"] += 1

        # track leftover INSIDER25 in non-bak html (PDPs must be clean)
        if "INSIDER25" in text:
            # allow only in HTML comments
            naked = re.sub(r"<!--[\s\S]*?-->", "", text)
            if "INSIDER25" in naked:
                stats["insider_left_html"].append(str(path.relative_to(HTML)))

    # version.json
    ver = {
        "version": "2.80",
        "released": "2026-09-16",
        "codename": "promo-chrome-strip",
        "highlights": [
            "Empty #promoStack / promo-bar INSIDER25 markup on all HTML (match home hidden empty shell)",
            "PDPs: no .price-original / .price-launch-note / INSIDER25 strike when promo inactive; origHtml gated off",
            "promo-bar.js remains noop stub (no 404); ATC and product prices unchanged",
        ],
    }
    VER.write_text(json.dumps(ver, indent=2) + "\n", encoding="utf-8")
    VER_ROOT.write_text(json.dumps(ver, indent=2) + "\n", encoding="utf-8")
    print("version.json -> 2.80")

    old_md = VERSION_MD.read_text(encoding="utf-8") if VERSION_MD.exists() else ""
    block = """# biolabsresearch.co — Version 2.80

Released 2026-09-16.

Codename: promo-chrome-strip

## Highlights

- **Promo bar**: Permanently empty `#promoStack` on products/blog/tools/shipping/science/etc. — match home (hidden + comment only). No visible “25% off / INSIDER25 / ends in”.
- **PDPs**: Stop SSR struck `.price-original` and JS `origHtml` strike + `price-launch-note` when no active promo (`ACTIVE_PROMO = false` / `origHtml = ''`).
- **promo-bar.js**: Keep noop stub so cached script tags do not 404.
- **ATC / prices**: Unchanged. v2.79 catalog cover + Popular research compounds kept.

---

"""
    VERSION_MD.write_text(block + old_md, encoding="utf-8")
    print("VERSION.md prepended")

    # Sanity
    bpc = (HTML / "products/bpc-157.html").read_text(encoding="utf-8")
    nad = (HTML / "products/nad-plus.html").read_text(encoding="utf-8")
    idx = INDEX.read_text(encoding="utf-8")

    assert "Popular research compounds" in idx, "do not rewind v2.79 header"
    assert "ADD TO CART" in bpc and "ADD TO CART" in nad
    assert "ADD TO CART" in idx
    assert 'content="2.80"' in idx or 'data-site-version="2.80"' in idx

    for name, doc in (("bpc", bpc), ("nad", nad)):
        naked = re.sub(r"<!--[\s\S]*?-->", "", doc)
        assert "INSIDER25" not in naked, f"{name} still has INSIDER25"
        assert "price-launch-note" not in naked, f"{name} still has price-launch-note"
        assert not re.search(r'<span class="price-original">', naked), f"{name} still has SSR price-original"
        assert 'id="promoStack"' in doc
        assert "25% off" not in naked
        # prices themselves still present
        assert "$88" in bpc or "$" in bpc

    # catalog-mg ACTIVE_PROMO still false
    cmg = (HTML / "catalog-mg.js").read_text(encoding="utf-8")
    assert "ACTIVE_PROMO = false" in cmg

    # promo-bar stub
    pb = promo_js.read_text(encoding="utf-8")
    assert "function kill" in pb
    assert "promo + countdown" not in pb

    print("STATS", json.dumps(stats, indent=2))
    if stats["insider_left_html"]:
        # Filter to only report pages that still have naked INSIDER25
        print("WARN naked INSIDER25 left in:", stats["insider_left_html"][:30])
    print("SANITY OK")


if __name__ == "__main__":
    main()
