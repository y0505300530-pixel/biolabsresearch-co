#!/usr/bin/env python3
"""Stage 3: sitewide SoT for email, hours, shipping, RUO, CTAs, prices."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "html"
SKIP = {"admin.html", "google831c5ec309d38eb5.html"}
RUO = (
    "Not FDA approved. For research purposes only. Not intended for human consumption, "
    "self-administration, or therapeutic use. All products sold for in vitro and "
    "laboratory research use only."
)
HOURS = "8:00 AM – 9:00 PM ET"
# Brand email stays on biolabsresearch.co. Do not rewrite to biofirst.co.
# Until Yehuda locks admin@ vs info@biolabsresearch.co, leave existing addresses.

FAQ_SHIP = (
    "Confirmed inquiries are processed within 1–2 business days. Catalog fulfillment "
    "ships from the US. USPS Ground is 3–5 business days within the US. UPS 2nd Day Air "
    "is approximately 2 business days without a delivery guarantee. Temperature-sensitive "
    "lots may use cold-chain packing. International shipping is available on request "
    "after inquiry confirmation. Tracking is sent after dispatch."
)


def iter_files():
    for p in HTML.rglob("*"):
        if not p.is_file():
            continue
        if any(part.startswith("_") or "bak" in part.lower() for part in p.parts):
            continue
        if p.name in SKIP:
            continue
        if p.suffix not in {".html", ".js"}:
            continue
        yield p


def apply_text(text: str, rel: str) -> str:
    # Hours: exact string, drop weekday suffix
    text = text.replace("8:00 AM – 9:00 PM ET, Monday–Friday", HOURS)
    text = text.replace("8:00 AM – 9:00 PM ET, Monday-Friday", HOURS)

    # UI headings / CTAs
    text = text.replace("All Peptides", "All Compounds")
    text = text.replace("p.category||'Peptide'", "p.category||'Compound'")
    text = text.replace("p.category||\"Peptide\"", "p.category||\"Compound\"")
    text = text.replace("Add to cart", "Add to inquiry")
    text = text.replace("Add to Cart", "Add to inquiry")
    text = text.replace("Buy now", "Add to inquiry")
    text = text.replace("Buy Now", "Add to inquiry")

    # RUO notes on blog/tools: identical wording
    text = re.sub(
        r'(<div class="ruo-note">)(.*?)(</div>)',
        rf"\1{RUO}\3",
        text,
        flags=re.S,
    )
    text = text.replace(
        '<p class="tr-ruo">For laboratory research use only. Not for human or veterinary use.</p>',
        f'<p class="tr-ruo">{RUO}</p>',
    )
    return text


def main() -> int:
    changed = []
    for p in iter_files():
        old = p.read_text(encoding="utf-8")
        new = apply_text(old, str(p.relative_to(ROOT)))
        if new != old:
            p.write_text(new, encoding="utf-8")
            changed.append(str(p.relative_to(ROOT)))
    print(f"string-pass changed {len(changed)} files")
    for c in changed:
        print(" ", c)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
