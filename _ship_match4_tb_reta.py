#!/usr/bin/env python3
"""v2.89 MATCH4 TB-500 + R3TA live vial swap after ELITE Soft-QA PASS. Run on biofirst server.

Marketing alts (locked):
  TB-500  -> 'TB-500 10 mg research vial'
  R3TA    -> 'Retatrutide 10 mg research vial'  (full product name; band stays R3TA)
"""
import os, re, json, shutil, hashlib, glob, datetime, subprocess, sys

ROOT = "/var/www/biofirst"
os.chdir(ROOT)
MEDIA = "html/media"
DRAFT = f"{MEDIA}/_drafts/text-only-20260916"
TS = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
BAK = f"{MEDIA}/_bak_match4_{TS}"

# (slug, marketing_display_for_alt, primary_mg)
# NOTE: retatrutide catalog/band name is R3TA; Marketing alt uses full 'Retatrutide'
MATCH4 = [
    ("tb-500", "TB-500", "10 mg"),
    ("retatrutide", "Retatrutide", "10 mg"),
]
BUST = "180"
VERSION = "2.89"

# Prior QA5 + GLOW + MATCH1 + MATCH2 + TA1 + MATCH4
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
for slug, _, _ in MATCH4:
    for path in sorted(glob.glob(f"{MEDIA}/vial-{slug}*")):
        if "/_bak_" in path or "/_drafts/" in path:
            continue
        base = os.path.basename(path)
        shutil.copy2(path, f"{BAK}/{base}")
        bak_files.append(base)
print(f"BACKUP {BAK} ({len(bak_files)} files):", ", ".join(bak_files))

# --- 2. copy drafts → masters + 10mg/5mg dosevars ---
copied = []
for slug, _, _ in MATCH4:
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

# --- 3. shared JS vial bust 179 → 180 ---
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
    newt = t.replace("?v=179", "?v=180")
    if newt == t:
        print("WARN no ?v=179 in", jf)
    with open(jf, "w") as f:
        f.write(newt)
    print("JS bust", jf)

# --- 4. index.html ---
with open("html/index.html") as f:
    idx = f.read()

idx = idx.replace("cart-vial.js?v=309", "cart-vial.js?v=310")
idx = idx.replace("search-overlay.js?v=35", "search-overlay.js?v=36")
idx = idx.replace("mg-picker.js?v=40", "mg-picker.js?v=41")
idx = idx.replace("mg-picker.js?v=41", "mg-picker.js?v=41")  # idempotent

# version stamps → 2.89
idx = re.sub(r'(<meta name="app-version" content=")[^"]+(")', rf'\g<1>{VERSION}\2', idx, count=1)
idx = re.sub(
    r'(<p class="site-version" data-site-version=")[^"]+(" style="[^"]*">)v[^<]+(</p>)',
    rf'\g<1>{VERSION}\2v{VERSION}\3',
    idx,
    count=1,
)

old_qa = "var _qa5 = { 'bpc-157-tb-500-blend':1, 'aod-9604':1, 'ghk-cu':1, 'ipamorelin':1, 'tesamorelin':1, 'glow-70':1, 'tesamorelin-ipamorelin':1, 'nad-plus':1, 'bpc-157':1, 'curcumin-phytosome':1, 'epithalon':1, 'mots-c':1, 'kpv':1, 'semax':1, 'kisspeptin-10':1, 'thymosin-alpha-1':1 };"
new_qa = "var _qa5 = { 'bpc-157-tb-500-blend':1, 'aod-9604':1, 'ghk-cu':1, 'ipamorelin':1, 'tesamorelin':1, 'glow-70':1, 'tesamorelin-ipamorelin':1, 'nad-plus':1, 'bpc-157':1, 'curcumin-phytosome':1, 'epithalon':1, 'mots-c':1, 'kpv':1, 'semax':1, 'kisspeptin-10':1, 'thymosin-alpha-1':1, 'tb-500':1, 'retatrutide':1 };"
if old_qa not in idx:
    raise SystemExit("index whitelist pattern not found")
idx = idx.replace(old_qa, new_qa)
idx = idx.replace(
    "var _bust = _qa5[p.slug] ? '?v=179' : '?v=175';",
    "var _bust = _qa5[p.slug] ? '?v=180' : '?v=175';",
)

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
    # R3TA catalog name is forced to 'R3TA' in PDP JS — Marketing alt MUST be hardcoded
    # full 'Retatrutide …' so we never fall through to doseAwareAlt(p) → 'R3TA …'
    force_hardcoded = slug == "retatrutide"

    with open(path) as f:
        t = f.read()

    # script cache tags on this PDP
    t = t.replace("cart-vial.js?v=309", "cart-vial.js?v=310")
    t = t.replace("search-overlay.js?v=35", "search-overlay.js?v=36")
    t = t.replace("pdp-story.js?v=44", "pdp-story.js?v=45")
    t = t.replace("mg-picker.js?v=40", "mg-picker.js?v=41")
    t = t.replace("mg-picker.js?v=41", "mg-picker.js?v=41")
    t = t.replace("product-marquee.js?v=48", "product-marquee.js?v=49")

    # version stamps
    t = re.sub(r'(<meta name="app-version" content=")[^"]+(")', rf'\g<1>{VERSION}\2', t, count=1)
    t = re.sub(
        r'(<p class="site-version" data-site-version=")[^"]+("[^>]*>)v[^<]+(</p>)',
        rf'\g<1>{VERSION}\2v{VERSION}\3',
        t,
        count=1,
    )

    # bust vial URLs for this slug → 180
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

    # static HTML main img alt
    t = re.sub(
        rf'(<div class="product-img-main">\s*<img src="/media/vial-{re.escape(slug)}\.webp\?v={BUST}" alt=")[^"]+(")',
        rf'\1{img_alt}\2',
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

    # imgAlt: Retatrutide MUST be hardcoded (p.name forced to R3TA in this PDP)
    if force_hardcoded:
        img_alt_line = f"var imgAlt = '{img_alt}';"
    else:
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
    # Soft-risk: ensure R3TA does NOT appear as Marketing alt
    bad_r3ta_alt = bool(re.search(r'alt="R3TA 10 mg research vial"', after)) or (
        "var imgAlt = 'R3TA" in after or 'var imgAlt = "R3TA' in after
    )
    print(
        f"PDP {slug}: imgAltExpr={after_alt!r} staticAlt={static_alt!r} "
        f"doseAware={has_da} goldRemain={has_gold} thumbsRemain={has_thumbs} badR3taAlt={bad_r3ta_alt}"
    )
    if static_alt != img_alt:
        raise SystemExit(f"static alt mismatch for {slug}: got {static_alt!r} want {img_alt!r}")
    if force_hardcoded and img_alt not in after_alt:
        raise SystemExit(f"imgAlt not hardcoded Marketing for {slug}: {after_alt!r}")
    if bad_r3ta_alt:
        raise SystemExit("R3TA leaked into Marketing alt — abort")
    return static_alt, after_alt

reports = {}
for slug, display, mg in MATCH4:
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
    ("cart-vial.js?v=309", "cart-vial.js?v=310"),
    ("search-overlay.js?v=35", "search-overlay.js?v=36"),
    ("pdp-story.js?v=44", "pdp-story.js?v=45"),
    ("mg-picker.js?v=40", "mg-picker.js?v=41"),
    ("product-marquee.js?v=48", "product-marquee.js?v=49"),
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
    if t != orig:
        with open(hf, "w") as f:
            f.write(t)
        tag_bumped += 1
print(f"script tags bumped in {tag_bumped} html files")

# --- 8. version.json ---
vj = {
    "version": VERSION,
    "released": "2026-09-16",
    "codename": "match4-tb500-r3ta-glow-chrome-180",
    "highlights": [
        "Live MATCH4 TB-500 + R3TA GLOW-chrome vials from ELITE Soft-QA PASS drafts",
        "Cache bust ?v=180; shared JS vial busts 179→180; Tirz/Sema held",
        "PDPs: Marketing alts TB-500 / Retatrutide (full name, not R3TA); no gold-crimp stomp; thumbs stripped",
    ],
    "appVersion": VERSION,
    "notes": [
        "Swap vial-tb-500 + vial-retatrutide (+ -10mg/-5mg dosevars) from text-only-20260916 drafts",
        "index.html: static cards + renderProducts whitelist (…+TA1+tb-500+retatrutide) → ?v=180",
        "Shared JS vial bust 179→180 (mg-picker/cart/search/pdp-story/marquee)",
        "TB-500 / R3TA PDPs: main/img/jsonld/productImageUrl → 180; strip thumbs; Marketing alts",
        "Retatrutide PDP imgAlt hardcoded 'Retatrutide 10 mg research vial' (catalog name R3TA; band stays R3TA)",
        "products-data.json image_url bust 180 for whitelist SKUs incl. tb-500 + retatrutide",
        "app-version/footer stamps 2.89; script cache tags bumped",
        "Soft-note (later): shared LOT BL-00009/NO.009 across vials — prefer unique LOT per SKU after full 20-SKU batch",
        "Soft-note: prior MATCH PDPs may still hardcode older bust in var img= while shared JS is 180",
    ],
}
with open("html/version.json", "w") as f:
    json.dump(vj, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("version.json written")

# --- verify ---
print("=== MD5 checks ===")
ok = True
for slug, _, _ in MATCH4:
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

for slug, display, mg in MATCH4:
    with open(f"html/products/{slug}.html") as f:
        t = f.read()
    want = f"{display} {mg} research vial"
    print(
        f"PDP {slug}: v=180={f'vial-{slug}.webp?v=180' in t} "
        f"thumbs_remain={'pdp-thumbs' in t} "
        f"gold_js_stomp={'gold crimp cap' in t and 'pdpMainImg' in t} "
        f"static_ok={want in t} "
        f"no_r3ta_mkt_alt={'alt=\"R3TA 10 mg research vial\"' not in t}"
    )

for jf in js_files:
    with open(jf) as f:
        jt = f.read()
    print(f"{jf}: has180={('?v=180' in jt)} has179={('?v=179' in jt)}")

print("SHIP_SCRIPT_DONE", "ok" if ok else "MD5_FAIL")
print("BAK_DIR", BAK)
for slug, (s, a) in reports.items():
    print(f"ALT {slug}: static={s!r} imgAltExpr={a}")
