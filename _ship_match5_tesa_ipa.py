#!/usr/bin/env python3
"""v2.90 MATCH5 Tesamorelin/Ipamorelin duo GLOW-chrome live after ELITE Soft-QA PASS.

Marketing alt (locked):
  Tesamorelin / Ipamorelin 10 mg research vial
Display name stays: Tesamorelin / Ipamorelin
"""
import os, re, json, shutil, hashlib, glob, datetime, subprocess, sys

ROOT = "/var/www/biofirst"
os.chdir(ROOT)
MEDIA = "html/media"
DRAFT = f"{MEDIA}/_drafts/text-only-20260916"
TS = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
BAK = f"{MEDIA}/_bak_match5_{TS}"

MATCH5 = [
    ("tesamorelin-ipamorelin", "Tesamorelin / Ipamorelin", "10 mg"),
]
BUST = "181"
VERSION = "2.90"

# Prior QA5 + GLOW + MATCH1..4 + MATCH5 (tesa-ipa already in list; keep all on 181)
WHITELIST = [
    "bpc-157-tb-500-blend", "aod-9604", "ghk-cu", "ipamorelin", "tesamorelin",
    "glow-70", "tesamorelin-ipamorelin", "nad-plus", "bpc-157", "curcumin-phytosome",
    "epithalon", "mots-c", "kpv", "semax", "kisspeptin-10", "thymosin-alpha-1",
    "tb-500", "retatrutide",
]

def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def sh(cmd):
    print("+", cmd)
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.stdout:
        print(r.stdout.rstrip())
    if r.stderr:
        print(r.stderr.rstrip(), file=sys.stderr)
    if r.returncode != 0:
        raise SystemExit(f"CMD FAIL ({r.returncode}): {cmd}")
    return r

# --- 0. baseline Tirz/Sema ---
tirz_before = md5(f"{MEDIA}/vial-tirzepatide.png")
sema_before = md5(f"{MEDIA}/vial-semaglutide.png")
print("TIRZ before", tirz_before)
print("SEMA before", sema_before)

# --- 1. backup ---
os.makedirs(BAK, exist_ok=True)
bak_files = []
for slug, _, _ in MATCH5:
    for path in sorted(glob.glob(f"{MEDIA}/vial-{slug}*")):
        if "/_bak_" in path or "/_drafts/" in path:
            continue
        base = os.path.basename(path)
        shutil.copy2(path, f"{BAK}/{base}")
        bak_files.append(base)
print(f"BACKUP {BAK} ({len(bak_files)} files):", ", ".join(bak_files))

# --- 2. copy drafts → masters + 10mg/5mg dosevars ---
copied = []
for slug, _, _ in MATCH5:
    for ext in ("png", "webp"):
        src = f"{DRAFT}/vial-{slug}.{ext}"
        if not os.path.isfile(src):
            raise SystemExit(f"missing draft {src}")
        dst = f"{MEDIA}/vial-{slug}.{ext}"
        shutil.copy2(src, dst)
        copied.append(dst)
        for dose in ("10mg", "5mg"):
            dv = f"{MEDIA}/vial-{slug}-{dose}.{ext}"
            if os.path.isfile(dv):
                shutil.copy2(src, dv)
                copied.append(dv)
print("COPIED", len(copied), "targets:", copied)

# --- 3. shared JS vial bust 180 → 181 ---
js_files = [
    "html/mg-picker.js",
    "html/cart-vial.js",
    "html/search-overlay.js",
    "html/pdp-story.js",
    "html/product-marquee.js",
]
for jf in js_files:
    with open(jf) as f:
        t = f.read()
    newt = t.replace("?v=180", "?v=181")
    if newt == t and "?v=181" in t:
        print("JS already 181", jf)
    elif newt == t:
        print("WARN no ?v=180/?v=181 in", jf)
    else:
        with open(jf, "w") as f:
            f.write(newt)
        print("JS bust", jf)

# --- 4. index.html ---
with open("html/index.html") as f:
    idx = f.read()

idx = idx.replace("cart-vial.js?v=310", "cart-vial.js?v=311")
idx = idx.replace("search-overlay.js?v=36", "search-overlay.js?v=37")
idx = idx.replace("mg-picker.js?v=42", "mg-picker.js?v=43")
idx = idx.replace("mg-picker.js?v=43", "mg-picker.js?v=43")  # idempotent

# version stamps → 2.90
idx = re.sub(r'(<meta name="app-version" content=")[^"]+(")', rf'\g<1>{VERSION}\2', idx, count=1)
idx = re.sub(
    r'(<p class="site-version" data-site-version=")[^"]+(" style="[^"]*">)v[^<]+(</p>)',
    rf'\g<1>{VERSION}\2v{VERSION}\3',
    idx,
    count=1,
)

# whitelist already has tesa-ipa + MATCH4; only bump bust 180→181
old_bust = "var _bust = _qa5[p.slug] ? '?v=180' : '?v=175';"
new_bust = "var _bust = _qa5[p.slug] ? '?v=181' : '?v=175';"
if old_bust in idx:
    idx = idx.replace(old_bust, new_bust)
elif new_bust in idx:
    print("index _bust already 181")
else:
    raise SystemExit("index _bust pattern not found")

# ensure whitelist still includes tesamorelin-ipamorelin (already does from prior)
qa_line = re.search(r"var _qa5 = \{[^}]+\};", idx)
if not qa_line:
    raise SystemExit("index whitelist not found")
if "tesamorelin-ipamorelin" not in qa_line.group(0):
    raise SystemExit("tesamorelin-ipamorelin missing from whitelist")
print("whitelist OK:", qa_line.group(0)[:120], "...")

for slug in WHITELIST:
    idx = re.sub(
        rf'(/media/vial-{re.escape(slug)}\.(?:webp|png))\?v=\d+',
        rf'\1?v={BUST}',
        idx,
    )

with open("html/index.html", "w") as f:
    f.write(idx)
print("index.html updated")

# --- 5. PDP updates ---
dose_aware_fn = '''  function doseAwareAlt(p) {
    var dose = "";
    if (p && p.strengths && p.strengths.length) {
      dose = String(p.strengths[0]).replace(/\\s+/g, "").replace(/mg$/i, "") + " mg";
    }
    /* Soft-QA: Marketing alt omits parenthetical brand; prefer primary dose */
    var base = (p && p.name ? String(p.name) : "").replace(/\\s*\\([^)]*\\)\\s*/g, " ").replace(/\\s+/g, " ").trim();
    if (!dose) dose = "10 mg";
    return dose ? (base + " " + dose + " research vial") : (base + " research vial");
  }

'''

def fix_pdp(slug, display_name, primary_mg):
    path = f"html/products/{slug}.html"
    img_alt = f"{display_name} {primary_mg} research vial"

    with open(path) as f:
        t = f.read()

    # script cache tags on this PDP
    t = t.replace("cart-vial.js?v=310", "cart-vial.js?v=311")
    t = t.replace("search-overlay.js?v=36", "search-overlay.js?v=37")
    t = t.replace("pdp-story.js?v=45", "pdp-story.js?v=46")
    t = t.replace("mg-picker.js?v=42", "mg-picker.js?v=43")
    t = t.replace("mg-picker.js?v=43", "mg-picker.js?v=43")
    t = t.replace("product-marquee.js?v=49", "product-marquee.js?v=50")

    # version stamps
    t = re.sub(r'(<meta name="app-version" content=")[^"]+(")', rf'\g<1>{VERSION}\2', t, count=1)
    t = re.sub(
        r'(<p class="site-version" data-site-version=")[^"]+("[^>]*>)v[^<]+(</p>)',
        rf'\g<1>{VERSION}\2v{VERSION}\3',
        t,
        count=1,
    )

    # bust vial URLs for this slug → 181
    t = re.sub(
        rf'(/(?:media/)?vial-{re.escape(slug)}\.(?:webp|png))\?v=\d+',
        rf'\1?v={BUST}',
        t,
    )
    t = re.sub(
        rf'(https://biolabsresearch\.co/media/vial-{re.escape(slug)}\.(?:webp|png))\?v=\d+',
        rf'\1?v={BUST}',
        t,
    )
    t = re.sub(
        r"(var productImageUrl = '/media/vial-' \+ slug \+ '\.png\?v=)\d+(')",
        rf"\g<1>{BUST}\2",
        t,
    )
    t = re.sub(
        rf"(var img = '/media/vial-{re.escape(slug)}\.webp\?v=)\d+(')",
        rf"\g<1>{BUST}\2",
        t,
    )
    t = re.sub(
        rf'(content="(?:https://biolabsresearch\.co)?/media/vial-{re.escape(slug)}\.(?:webp|png))\?v=\d+(")',
        rf'\1?v={BUST}\2',
        t,
    )

    # static HTML main img alt + bust (may still be old alt before rewrite)
    t = re.sub(
        rf'(<div class="product-img-main">\s*<img src="/media/vial-{re.escape(slug)}\.webp\?v={BUST}" alt=")[^"]+(")',
        rf'\1{img_alt}\2',
        t,
        count=1,
        flags=re.S,
    )
    # also catch if bust rewrite left alt but src not yet matching (fallback)
    t = re.sub(
        rf'(<div class="product-img-main">\s*<img src="/media/vial-{re.escape(slug)}\.webp\?v=)\d+(" alt=")[^"]+(")',
        rf'\g<1>{BUST}\g<2>{img_alt}\g<3>',
        t,
        count=1,
        flags=re.S,
    )

    # Inject doseAwareAlt if missing
    if "function doseAwareAlt" not in t:
        if "function renderProduct(p)" not in t:
            raise SystemExit(f"renderProduct not found for doseAwareAlt insert ({slug})")
        t = t.replace("function renderProduct(p)", dose_aware_fn + "  function renderProduct(p)", 1)

    # Replace gold-crimp JS alt stomp with imgAlt
    old_gold = "'<div class=\"product-img-main\"><img id=\"pdpMainImg\" src=\"'+img+'\" alt=\"'+p.name+' research vial with gold crimp cap\"></div>' +"
    new_main = "'<div class=\"product-img-main\"><img id=\"pdpMainImg\" src=\"'+img+'\" alt=\"'+imgAlt+'\"></div>' +"
    if old_gold in t:
        t = t.replace(old_gold, new_main, 1)
    elif new_main not in t and "alt=\"'+doseAwareAlt(p)+'\"" not in t:
        old_b = "'<div class=\"product-img-main\"><img id=\"pdpMainImg\" src=\"'+img+'\" alt=\"'+p.name+'\"></div>' +"
        if old_b in t:
            t = t.replace(old_b, new_main, 1)

    img_alt_line = f"var imgAlt = doseAwareAlt(p) || '{img_alt}';"

    if "var imgAlt =" not in t:
        t = t.replace(
            "document.getElementById('product-container').innerHTML =",
            img_alt_line + "\n    document.getElementById('product-container').innerHTML =",
            1,
        )
    else:
        t = re.sub(r"var imgAlt = [^\n]+;", img_alt_line, t, count=1)

    # Strip dose-variant thumbs block
    lines = t.splitlines(True)
    out = []
    skip = False
    removed = 0
    for line in lines:
        if "pdp-thumbs" in line and "'<" in line:
            skip = True
            removed += 1
            continue
        if skip:
            if "</div>' +" in line and "pdp-thumb" not in line:
                skip = False
                removed += 1
                continue
            if "pdp-thumb" in line or (skip and ("'<" in line or "'+" in line)):
                removed += 1
                continue
            if skip and "</div>" in line:
                skip = False
                removed += 1
                continue
            skip = False
        out.append(line)
    t = "".join(out)
    print(f"thumbs strip {slug} removed_lines~{removed}")

    with open(path, "w") as f:
        f.write(t)

    with open(path) as f:
        after = f.read()
    after_m = re.search(r"var imgAlt = ([^\n]+)", after)
    after_alt = after_m.group(1).strip() if after_m else "MISSING"
    static_m = re.search(
        rf'<img src="/media/vial-{re.escape(slug)}\.webp\?v={BUST}" alt="([^"]+)"',
        after,
    )
    static_alt = static_m.group(1) if static_m else "MISSING"
    has_gold = "gold crimp" in after and "pdpMainImg" in after
    has_thumbs = "pdp-thumbs" in after
    has_da = "function doseAwareAlt" in after
    print(
        f"PDP {slug}: imgAltExpr={after_alt!r} staticAlt={static_alt!r} "
        f"doseAware={has_da} goldRemain={has_gold} thumbsRemain={has_thumbs}"
    )
    if static_alt != img_alt:
        raise SystemExit(f"static alt mismatch for {slug}: got {static_alt!r} want {img_alt!r}")
    if has_gold:
        raise SystemExit(f"gold-crimp stomp remains on {slug}")
    if has_thumbs:
        raise SystemExit(f"pdp-thumbs remain on {slug}")
    return static_alt, after_alt

reports = {}
for slug, display, mg in MATCH5:
    reports[slug] = fix_pdp(slug, display, mg)

# --- 6. products-data.json (symlink target) ---
pd_path = "/var/www/mastersol/html/MSOLPEPTIDES/products-data.json"
with open(pd_path) as f:
    data = json.load(f)
items = data if isinstance(data, list) else data.get("products", data)
wl = set(WHITELIST)
updated = []
for it in items:
    slug = it.get("slug") or ""
    if slug in wl and it.get("image_url"):
        old = it["image_url"]
        it["image_url"] = re.sub(r"\?v=\d+", f"?v={BUST}", old)
        if "?v=" not in it["image_url"]:
            it["image_url"] = old.split("?")[0] + f"?v={BUST}"
        updated.append(f"{slug}: {old} -> {it['image_url']}")
with open(pd_path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("products-data updated:", len(updated))
for u in updated:
    print(" ", u)

# --- 7. sitewide script cache tags (exclude blog/compare) ---
replacements = [
    ("cart-vial.js?v=310", "cart-vial.js?v=311"),
    ("search-overlay.js?v=36", "search-overlay.js?v=37"),
    ("pdp-story.js?v=45", "pdp-story.js?v=46"),
    ("mg-picker.js?v=42", "mg-picker.js?v=43"),
    ("product-marquee.js?v=49", "product-marquee.js?v=50"),
]
html_files = []
for dirpath, dirnames, filenames in os.walk("html"):
    parts = dirpath.split(os.sep)
    if any(p in ("blog", "compare", "_bak", "_drafts") or p.startswith("_bak_") for p in parts):
        continue
    for fn in filenames:
        if fn.endswith(".html"):
            html_files.append(os.path.join(dirpath, fn))

tag_bumped = 0
for hf in html_files:
    with open(hf) as f:
        t = f.read()
    orig = t
    for a, b in replacements:
        t = t.replace(a, b)
    # also bump app-version / site-version on product/index pages that still lag
    # (index + this PDP already done; leave other pages alone unless MATCH4 did sitewide — MATCH4 did NOT bump all stamps)
    if t != orig:
        with open(hf, "w") as f:
            f.write(t)
        tag_bumped += 1
print(f"script tags bumped in {tag_bumped} html files")

# --- 8. version.json ---
vj = {
    "version": VERSION,
    "released": "2026-09-16",
    "codename": "match5-tesa-ipa-glow-chrome-181",
    "highlights": [
        "Live MATCH5 Tesamorelin/Ipamorelin duo GLOW-chrome vial from ELITE Soft-QA PASS draft",
        "Cache bust ?v=181; shared JS vial busts 180→181; Tirz/Sema held",
        "PDP: Marketing alt Tesamorelin / Ipamorelin 10 mg research vial; no gold-crimp stomp; thumbs stripped",
    ],
    "appVersion": VERSION,
    "notes": [
        "Swap vial-tesamorelin-ipamorelin (+ -10mg/-5mg dosevars) from text-only-20260916 drafts",
        "Band: TESA / IPA BLEND · 10 mg; display name stays Tesamorelin / Ipamorelin",
        "index.html: static card + renderProducts whitelist (prior MATCH SKUs + tesa-ipa) → ?v=181",
        "Shared JS vial bust 180→181 (mg-picker/cart/search/pdp-story/marquee)",
        "PDP: main/img/jsonld/productImageUrl → 181; strip thumbs; doseAwareAlt + Marketing alt",
        "mg-picker setImgs keeps Marketing alt after picker (display name == Marketing base)",
        "products-data.json image_url bust 181 for whitelist SKUs",
        "app-version/footer stamps 2.90; script cache tags bumped",
        "Soft-note: shared LOT BL-00009/NO.009 across vials — prefer unique LOT per SKU after full batch",
        "Soft-note: prior MATCH PDPs may still hardcode older bust in var img= while shared JS is 181",
    ],
}
with open("html/version.json", "w") as f:
    json.dump(vj, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("version.json written")

# --- verify ---
print("=== MD5 checks ===")
ok = True
for slug, _, _ in MATCH5:
    for ext in ("png", "webp"):
        d = md5(f"{DRAFT}/vial-{slug}.{ext}")
        l = md5(f"{MEDIA}/vial-{slug}.{ext}")
        match = "OK" if d == l else "FAIL"
        if d != l:
            ok = False
        print(f"  master {slug}.{ext}: draft={d} live={l} {match}")
        for dose in ("10mg", "5mg"):
            p = f"{MEDIA}/vial-{slug}-{dose}.{ext}"
            if os.path.isfile(p):
                m = md5(p)
                match = "OK" if m == d else "FAIL"
                if m != d:
                    ok = False
                print(f"  dosevar {slug}-{dose}.{ext}: {m} {match}")

tirz_after = md5(f"{MEDIA}/vial-tirzepatide.png")
sema_after = md5(f"{MEDIA}/vial-semaglutide.png")
print("TIRZ untouched", tirz_before == tirz_after, tirz_after)
print("SEMA untouched", sema_before == sema_after, sema_after)

for slug, display, mg in MATCH5:
    with open(f"html/products/{slug}.html") as f:
        t = f.read()
    want = f"{display} {mg} research vial"
    print(
        f"PDP {slug}: v=181={f'vial-{slug}.webp?v=181' in t} "
        f"thumbs_remain={'pdp-thumbs' in t} "
        f"gold_js_stomp={'gold crimp cap' in t and 'pdpMainImg' in t} "
        f"static_ok={want in t} "
        f"doseAware={'function doseAwareAlt' in t}"
    )

for jf in js_files:
    with open(jf) as f:
        jt = f.read()
    print(f"{jf}: has181={('?v=181' in jt)} has180={('?v=180' in jt)}")

# index static card verify
with open("html/index.html") as f:
    idx = f.read()
m = re.search(r'vial-tesamorelin-ipamorelin\.webp\?v=(\d+)"[^>]*alt="([^"]*)"', idx)
print("INDEX static:", m.groups() if m else "MISSING")
print("INDEX bust181:", "var _bust = _qa5[p.slug] ? '?v=181'" in idx)
print("INDEX version:", re.search(r'app-version" content="([^"]+)"', idx).group(1))

print("SHIP_SCRIPT_DONE", "ok" if ok else "MD5_FAIL")
print("BAK_DIR", BAK)
for slug, (s, a) in reports.items():
    print(f"ALT {slug}: static={s!r} imgAltExpr={a}")
