#!/usr/bin/env python3
"""Build {slug}-qty-{1,2,3}.webp/png from each SKU's live primary vial.

Canvas 1600×900, cream #F2EFE9 — same as Semax qty cards.
Does not overwrite Semax qty assets or vial masters.
"""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

MEDIA = Path("/workspace/html/media")
CREAM = (242, 239, 233)  # #F2EFE9
CANVAS = (1600, 900)
# Live primary vials (GLOW/chrome or current live art). Skip MATCH masters.
SLUGS = [
    "aod-9604",
    "bpc-157",
    "bpc-157-tb-500-blend",
    "curcumin-phytosome",
    "epithalon",
    "ghk-cu",
    "glow-70",
    "ipamorelin",
    "kisspeptin-10",
    "kpv",
    "mots-c",
    "nad-plus",
    "g3-r",
    "semaglutide",
    "tb-500",
    "tesamorelin",
    "tesamorelin-ipamorelin",
    "thymosin-alpha-1",
    "tirzepatide",
]
# Semax already has qty-1/2/3 — reuse, do not overwrite.


def load_vial(slug: str) -> Image.Image:
    for name in (f"vial-{slug}.png", f"vial-{slug}.webp"):
        path = MEDIA / name
        if path.exists():
            im = Image.open(path).convert("RGBA")
            return im
    raise FileNotFoundError(slug)


def is_bg(px, cream=CREAM, tol=22):
    r, g, b = px[:3]
    return abs(r - cream[0]) <= tol and abs(g - cream[1]) <= tol and abs(b - cream[2]) <= tol


def trim_vial(im: Image.Image) -> Image.Image:
    """Keep the vial + soft shadow; drop empty cream margins."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    # Sample corners to refine cream if the master isn't exactly #F2EFE9
    corners = [rgb.getpixel((0, 0)), rgb.getpixel((w - 1, 0)), rgb.getpixel((0, h - 1)), rgb.getpixel((w - 1, h - 1))]
    cream = tuple(int(sum(c[i] for c in corners) / 4) for i in range(3))
    pix = rgb.load()
    minx, miny, maxx, maxy = w, h, 0, 0
    step = 2
    for y in range(0, h, step):
        for x in range(0, w, step):
            if not is_bg(pix[x, y], cream, 28):
                if x < minx:
                    minx = x
                if y < miny:
                    miny = y
                if x > maxx:
                    maxx = x
                if y > maxy:
                    maxy = y
    if maxx <= minx or maxy <= miny:
        return im
    pad = int(min(w, h) * 0.03)
    minx = max(0, minx - pad)
    miny = max(0, miny - pad)
    maxx = min(w, maxx + pad)
    maxy = min(h, maxy + pad)
    return im.crop((minx, miny, maxx, maxy))


def fit_height(im: Image.Image, target_h: int) -> Image.Image:
    w, h = im.size
    if h <= 0:
        return im
    nw = max(1, int(round(w * (target_h / h))))
    return im.resize((nw, target_h), Image.Resampling.LANCZOS)


def compose(vial: Image.Image, n: int) -> Image.Image:
    canvas = Image.new("RGB", CANVAS, CREAM)
    # Leave headroom so caps don't clip; match Semax card framing.
    target_h = 780 if n < 3 else 700
    vial_n = fit_height(vial, target_h)
    vw, vh = vial_n.size
    gap = 36 if n == 2 else 20
    total_w = n * vw + (n - 1) * gap
    scale = 1.0
    max_w = CANVAS[0] - 80
    if total_w > max_w:
        scale = max_w / total_w
        vial_n = vial_n.resize((max(1, int(vw * scale)), max(1, int(vh * scale))), Image.Resampling.LANCZOS)
        vw, vh = vial_n.size
        total_w = n * vw + (n - 1) * gap
    x0 = (CANVAS[0] - total_w) // 2
    y0 = (CANVAS[1] - vh) // 2
    for i in range(n):
        x = x0 + i * (vw + gap)
        canvas.paste(vial_n, (x, y0), vial_n if vial_n.mode == "RGBA" else None)
    return canvas


def save_pair(im: Image.Image, slug: str, n: int) -> None:
    png = MEDIA / f"{slug}-qty-{n}.png"
    webp = MEDIA / f"{slug}-qty-{n}.webp"
    im.save(png, "PNG", optimize=True)
    im.save(webp, "WEBP", quality=86, method=6)
    print(f"wrote {png.name} {webp.name} {im.size}")


def main() -> None:
    for slug in SLUGS:
        vial = trim_vial(load_vial(slug))
        for n in (1, 2, 3):
            save_pair(compose(vial, n), slug, n)
    # Verify Semax assets left intact
    for n in (1, 2, 3):
        p = MEDIA / f"semax-qty-{n}.png"
        assert p.exists(), p
    print("ok: left semax-qty-* untouched")


if __name__ == "__main__":
    main()
