#!/usr/bin/env python3
"""Wire qty-upsell.js onto every catalog PDP and bump cache stamps."""
from __future__ import annotations

from pathlib import Path

ROOT = Path("/workspace/html")
PDPS = [
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
    "retatrutide",
    "semaglutide",
    "semax",
    "tb-500",
    "tesamorelin",
    "tesamorelin-ipamorelin",
    "thymosin-alpha-1",
    "tirzepatide",
]
QTY_TAG = '<script src="/qty-upsell.js?v=1"></script>'
MG_RE = '<script src="/mg-picker.js?v=43"></script>'


def bump_cart_vial(text: str) -> str:
    return text.replace("/cart-vial.js?v=313", "/cart-vial.js?v=314")


def bump_site_stamp(text: str) -> str:
    text = text.replace('data-site-version="2.93"', 'data-site-version="2.94"')
    text = text.replace(">v2.93</p>", ">v2.94</p>")
    text = text.replace('content="2.93"', 'content="2.94"')
    return text


def ensure_qty_script(text: str) -> str:
    if "qty-upsell.js" in text:
        return text
    if MG_RE in text:
        return text.replace(MG_RE, MG_RE + "\n" + QTY_TAG)
    # curcumin / odd pages
    needle = '<script src="/mg-picker.js'
    idx = text.find(needle)
    if idx != -1:
        end = text.find("</script>", idx)
        if end != -1:
            end += len("</script>")
            return text[:end] + "\n" + QTY_TAG + text[end:]
    return text


def hook_render(text: str) -> str:
    old = "if (p) { window._currentProduct = p; renderProduct(p); } else renderNotFound();"
    new = "if (p) { window._currentProduct = p; renderProduct(p); if (window.qtyUpsellRefresh) window.qtyUpsellRefresh(); } else renderNotFound();"
    return text.replace(old, new)


def hook_semax_refresh(text: str) -> str:
    return text.replace(
        "if (typeof window.semaxQtyRefresh === 'function') window.semaxQtyRefresh();",
        "if (typeof window.qtyUpsellRefresh === 'function') window.qtyUpsellRefresh(); else if (typeof window.semaxQtyRefresh === 'function') window.semaxQtyRefresh();",
    )


SEMAX_PACK_START = "  /* 10 mg pack SoT (Yehuda): $99 / $178 / $237 → $99 / $89 / $79 each."
SEMAX_PACK_HELPERS = '''  window.getCart = function(){ return JSON.parse(localStorage.getItem('biolabs_cart')||localStorage.getItem('biofirst_cart')||'[]'); };
  window.saveCart = function(c){ localStorage.setItem('biolabs_cart', JSON.stringify(c)); };
  window.updateBadge = function(){
    var total = getCart().reduce(function(s,i){return s+i.qty;},0);
    var el = document.getElementById('cartCount') || document.querySelector('.cart-count');
    if(el) el.textContent = total;
  };
  window.addToCartTemplate = function(){
    var name = ((document.querySelector('.product-title')||{}).textContent||'Semax').trim();
    var cart = getCart();
    var slug = 'semax';
    var img = '/media/vial-semax.png?v=181';
    var pdpQty = parseInt(document.getElementById('pdpQty') ? document.getElementById('pdpQty').textContent : '2') || 2;
    var priceEl = document.getElementById('current-price')||document.querySelector('.price-main');
    var price = parseFloat((priceEl ? priceEl.textContent : '99').replace(/[^0-9.]/g,''))||99;
    var ex = cart.find(function(i){return i && i.slug===slug;});
    if(ex){ ex.qty += pdpQty; } else { cart.push({name:name,price:price,qty:pdpQty,slug:slug,mg:'10mg',imageUrl:img}); }
    saveCart(cart); updateBadge();
    var btn = document.getElementById('atc-btn');
    if(btn){ var o=btn.textContent; btn.textContent='✓ Added!'; btn.style.background='#2a7a4a'; setTimeout(function(){btn.textContent=o;btn.style.background='';},1800); }
    var _cd=document.getElementById('cartDrawer'); if(_cd && !_cd.classList.contains('open') && typeof toggleCart==='function') toggleCart();
  };
  document.addEventListener('DOMContentLoaded',function(){
    updateBadge();
    if (typeof renderCart === 'function') renderCart();
  });
  setTimeout(updateBadge,1500);
'''


def slim_semax_pack_js(text: str) -> str:
    """Drop page-scoped pack logic; shared qty-upsell.js owns add + paint."""
    start = text.find(SEMAX_PACK_START)
    if start == -1:
        return text
    # Keep the getCart block above PACK10 — replace from PACK comment through IIFE end
    # The IIFE starts with getCart just before PACK10. Find that script's IIFE close.
    # Walk back to window.getCart in this script.
    g = text.rfind("  window.getCart = function()", 0, start)
    if g == -1:
        return text
    end = text.find("})();\n</script>", start)
    if end == -1:
        return text
    end += len("})();\n")
    return text[:g] + SEMAX_PACK_HELPERS + text[end:]


def patch_pdp(slug: str) -> None:
    path = ROOT / "products" / f"{slug}.html"
    text = path.read_text(encoding="utf-8")
    orig = text
    text = bump_cart_vial(text)
    text = bump_site_stamp(text)
    text = ensure_qty_script(text)
    text = hook_render(text)
    if slug == "semax":
        text = hook_semax_refresh(text)
        text = slim_semax_pack_js(text)
        text = text.replace('data-site-version="2.93"', 'data-site-version="2.94"')
        text = text.replace(">v2.93</p>", ">v2.94</p>")
        text = text.replace('<meta name="app-version" content="2.93">', '<meta name="app-version" content="2.94">')
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("patched", path.relative_to(ROOT))
    else:
        print("unchanged", path.relative_to(ROOT))


def patch_all_html_cart_vial() -> None:
    n = 0
    for path in ROOT.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        new = bump_cart_vial(text)
        new = bump_site_stamp(new)
        if new != text:
            path.write_text(new, encoding="utf-8")
            n += 1
    print(f"cart-vial/site-stamp files: {n}")


def main() -> None:
    for slug in PDPS:
        patch_pdp(slug)
    patch_all_html_cart_vial()


if __name__ == "__main__":
    main()
