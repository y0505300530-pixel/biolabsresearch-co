#!/usr/bin/env python3
"""v2.88 MATCH3 TA1 live vial swap after ELITE Soft-QA PASS. Run on biofirst server."""
import os, re, json, shutil, hashlib, glob, datetime, subprocess, sys

ROOT = "/var/www/biofirst"
os.chdir(ROOT)
MEDIA = "html/media"
DRAFT = f"{MEDIA}/_drafts/text-only-20260916"
TS = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
BAK = f"{MEDIA}/_bak_ta1_{TS}"

SLUG = "thymosin-alpha-1"
DISPLAY = "Thymosin Alpha-1"
PRIMARY_MG = "10 mg"
IMG_ALT = f"{DISPLAY} {PRIMARY_MG} research vial"
BUST = "179"

# Prior QA5 + GLOW + MATCH1 + MATCH2 + TA1
WHITELIST = [
    "bpc-157-tb-500-blend", "aod-9604", "ghk-cu", "ipamorelin", "tesamorelin",
    "glow-70", "tesamorelin-ipamorelin", "nad-plus", "bpc-157", "curcumin-phytosome",
    "epithalon", "mots-c", "kpv", "semax", "kisspeptin-10", "thymosin-alpha-1",
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
for path in sorted(glob.glob(f"{MEDIA}/vial-{SLUG}*")):
    if "/_bak_" in path or "/_drafts/" in path:
        continue
    base = os.path.basename(path)
    shutil.copy2(path, f"{BAK}/{base}")
    bak_files.append(base)
print(f"BACKUP {BAK} ({len(bak_files)} files):", ", ".join(bak_files))

# --- 2. copy drafts → masters + dosevars ---
copied = []
for ext in ("png", "webp"):
    src = f"{DRAFT}/vial-{SLUG}.{ext}"
    if not os.path.isfile(src):
        raise SystemExit(f"missing draft {src}")
    dst = f"{MEDIA}/vial-{SLUG}.{ext}"
    shutil.copy2(src, dst)
    copied.append(dst)
    for dose in ("10mg", "5mg"):
        dv = f"{MEDIA}/vial-{SLUG}-{dose}.{ext}"
        if os.path.isfile(dv):
            shutil.copy2(src, dv)
            copied.append(dv)
print("COPIED", len(copied), "targets:", copied)

# --- 3. shared JS vial bust 178 → 179 ---
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
    newt = t.replace("?v=178", "?v=179")
    if newt == t:
        print("WARN no ?v=178 in", jf)
    with open(jf, "w") as f:
        f.write(newt)
    print("JS bust", jf)

# --- 4. index.html ---
with open("html/index.html") as f:
    idx = f.read()

idx = idx.replace("cart-vial.js?v=308", "cart-vial.js?v=309")
idx = idx.replace("search-overlay.js?v=34", "search-overlay.js?v=35")
idx = idx.replace("mg-picker.js?v=38", "mg-picker.js?v=39")
idx = idx.replace("mg-picker.js?v=39", "mg-picker.js?v=40")  # if already 39 from prior replace path

# version stamps → 2.88
idx = re.sub(r'(<meta name="app-version" content=")[^"]+(")', r'\g<1>2.88\2', idx, count=1)
idx = re.sub(
    r'(<p class="site-version" data-site-version=")[^"]+(" style="[^"]*">)v[^<]+(</p>)',
    r'\g<1>2.88\2v2.88\3',
    idx,
    count=1,
)

old_qa = "var _qa5 = { 'bpc-157-tb-500-blend':1, 'aod-9604':1, 'ghk-cu':1, 'ipamorelin':1, 'tesamorelin':1, 'glow-70':1, 'tesamorelin-ipamorelin':1, 'nad-plus':1, 'bpc-157':1, 'curcumin-phytosome':1, 'epithalon':1, 'mots-c':1, 'kpv':1, 'semax':1, 'kisspeptin-10':1 };"
new_qa = "var _qa5 = { 'bpc-157-tb-500-blend':1, 'aod-9604':1, 'ghk-cu':1, 'ipamorelin':1, 'tesamorelin':1, 'glow-70':1, 'tesamorelin-ipamorelin':1, 'nad-plus':1, 'bpc-157':1, 'curcumin-phytosome':1, 'epithalon':1, 'mots-c':1, 'kpv':1, 'semax':1, 'kisspeptin-10':1, 'thymosin-alpha-1':1 };"
if old_qa not in idx:
    raise SystemExit("index whitelist pattern not found")
idx = idx.replace(old_qa, new_qa)
idx = idx.replace(
    "var _bust = _qa5[p.slug] ? '?v=178' : '?v=175';",
    "var _bust = _qa5[p.slug] ? '?v=179' : '?v=175';",
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

# --- 5. PDP thymosin-alpha-1 ---
path = f"html/products/{SLUG}.html"
with open(path) as f:
    t = f.read()

# script cache tags on this PDP
t = t.replace("cart-vial.js?v=308", "cart-vial.js?v=309")
t = t.replace("search-overlay.js?v=34", "search-overlay.js?v=35")
t = t.replace("pdp-story.js?v=43", "pdp-story.js?v=44")
t = t.replace("mg-picker.js?v=38", "mg-picker.js?v=39")
t = t.replace("mg-picker.js?v=39", "mg-picker.js?v=40")
t = t.replace("product-marquee.js?v=47", "product-marquee.js?v=48")

# version stamps
t = re.sub(r'(<meta name="app-version" content=")[^"]+(")', r'\g<1>2.88\2', t, count=1)
t = re.sub(
    r'(<p class="site-version" data-site-version=")[^"]+("[^>]*>)v[^<]+(</p>)',
    r'\g<1>2.88\2v2.88\3',
    t,
    count=1,
)

# bust vial URLs for this slug → 179
t = re.sub(
    rf'(/(?:media/)?vial-{re.escape(SLUG)}\.(?:webp|png))\?v=\d+',
    rf'\1?v={BUST}',
    t,
)
t = re.sub(
    rf'(https://biolabsresearch\.co/media/vial-{re.escape(SLUG)}\.(?:webp|png))\?v=\d+',
    rf'\1?v={BUST}',
    t,
)
t = re.sub(
    r"(var productImageUrl = '/media/vial-' \+ slug \+ '\.png\?v=)\d+(')",
    rf"\g<1>{BUST}\2",
    t,
)
t = re.sub(
    rf"(var img = '/media/vial-{re.escape(SLUG)}\.webp\?v=)\d+(')",
    rf"\g<1>{BUST}\2",
    t,
)
t = re.sub(
    rf'(content="(?:https://biolabsresearch\.co)?/media/vial-{re.escape(SLUG)}\.(?:webp|png))\?v=\d+(")',
    rf'\1?v={BUST}\2',
    t,
)

# static HTML main img alt + ensure ?v=179 already applied above
t = re.sub(
    rf'(<div class="product-img-main">\s*<img src="/media/vial-{re.escape(SLUG)}\.webp\?v={BUST}" alt=")[^"]+(")',
    rf'\1{IMG_ALT}\2',
    t,
    count=1,
    flags=re.S,
)

# Inject doseAwareAlt (curcumin-style parenthetical strip) if missing
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
if "function doseAwareAlt" not in t:
    # insert before function renderProduct
    if "function renderProduct(p)" not in t:
        raise SystemExit("renderProduct not found for doseAwareAlt insert")
    t = t.replace("function renderProduct(p)", dose_aware_fn + "  function renderProduct(p)", 1)

# Replace gold-crimp JS alt stomp with doseAwareAlt + hardcoded imgAlt fallback same string
old_gold = "'<div class=\"product-img-main\"><img id=\"pdpMainImg\" src=\"'+img+'\" alt=\"'+p.name+' research vial with gold crimp cap\"></div>' +"
new_main = "'<div class=\"product-img-main\"><img id=\"pdpMainImg\" src=\"'+img+'\" alt=\"'+imgAlt+'\"></div>' +"
if old_gold in t:
    t = t.replace(old_gold, new_main, 1)
elif new_main not in t and "alt=\"'+doseAwareAlt(p)+'\"" not in t:
    # try bare name pattern
    old_b = "'<div class=\"product-img-main\"><img id=\"pdpMainImg\" src=\"'+img+'\" alt=\"'+p.name+'\"></div>' +"
    if old_b in t:
        t = t.replace(old_b, new_main, 1)

# Ensure imgAlt hardcoded before innerHTML (MATCH2 mots-c style) — same string as static
if "var imgAlt =" not in t:
    t = t.replace(
        "document.getElementById('product-container').innerHTML =",
        f"var imgAlt = doseAwareAlt(p) || '{IMG_ALT}';\n    document.getElementById('product-container').innerHTML =",
        1,
    )
else:
    # normalize existing imgAlt
    t = re.sub(r"var imgAlt = '[^']*';", f"var imgAlt = doseAwareAlt(p) || '{IMG_ALT}';", t, count=1)

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
        # closing thumbs line like: '</div>' +
        if skip and "</div>" in line:
            skip = False
            removed += 1
            continue
        skip = False
    out.append(line)
t = "".join(out)
print(f"thumbs strip removed_lines~{removed}")

with open(path, "w") as f:
    f.write(t)

with open(path) as f:
    after = f.read()
after_m = re.search(r"var imgAlt = ([^\n]+)", after)
after_alt = after_m.group(1).strip() if after_m else "MISSING"
static_m = re.search(
    rf'<img src="/media/vial-{re.escape(SLUG)}\.webp\?v={BUST}" alt="([^"]+)"',
    after,
)
static_alt = static_m.group(1) if static_m else "MISSING"
has_gold = "gold crimp" in after and "pdpMainImg" in after
has_thumbs = "pdp-thumbs" in after
has_da = "function doseAwareAlt" in after
print(f"PDP {SLUG}: imgAltExpr={after_alt!r} staticAlt={static_alt!r} doseAware={has_da} goldRemain={has_gold} thumbsRemain={has_thumbs}")

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
# Order matters for mg-picker: bump 39→40 first, then 38→39 to avoid double-bump collisions... 
# Actually: replace higher first
replacements = [
    ("cart-vial.js?v=308", "cart-vial.js?v=309"),
    ("search-overlay.js?v=34", "search-overlay.js?v=35"),
    ("pdp-story.js?v=43", "pdp-story.js?v=44"),
    ("mg-picker.js?v=39", "mg-picker.js?v=40"),
    ("mg-picker.js?v=38", "mg-picker.js?v=40"),
    ("product-marquee.js?v=47", "product-marquee.js?v=48"),
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
    "version": "2.88",
    "released": "2026-09-16",
    "codename": "match3-ta1-glow-chrome-179",
    "highlights": [
        "Live MATCH3 TA1 GLOW-chrome vial (Thymosin Alpha-1) from ELITE Soft-QA PASS draft",
        "Cache bust ?v=179; shared JS vial busts 178→179; Tirz/Sema held",
        "PDP: doseAwareAlt / imgAlt Marketing alt (no gold-crimp stomp); dose thumbs stripped",
    ],
    "appVersion": "2.88",
    "notes": [
        "Swap vial-thymosin-alpha-1 (+ -10mg/-5mg dosevars) from text-only-20260916 drafts",
        "index.html: static cards + renderProducts whitelist (QA5+GLOW+TesaIpa+MATCH1+MATCH2+TA1) → ?v=179",
        "Shared JS vial bust 178→179 (mg-picker/cart/search/pdp-story/marquee)",
        "TA1 PDP: main/img/jsonld/productImageUrl → 179; strip dose-variant thumbs; doseAwareAlt+imgAlt",
        "products-data.json image_url bust 179 for whitelist SKUs incl. thymosin-alpha-1",
        "app-version/footer stamps 2.88; script cache tags bumped",
        "Soft-note (later): shared LOT BL-00009/NO.009 across vials — prefer unique LOT per SKU after full 20-SKU batch",
    ],
}
with open("html/version.json", "w") as f:
    json.dump(vj, f, indent=2, ensure_ascii=False)
    f.write("\n")
print("version.json written")

# --- verify ---
print("=== MD5 checks ===")
ok = True
for ext in ("png", "webp"):
    d = md5(f"{DRAFT}/vial-{SLUG}.{ext}")
    l = md5(f"{MEDIA}/vial-{SLUG}.{ext}")
    match = "OK" if d == l else "FAIL"
    if d != l:
        ok = False
    print(f"  master {SLUG}.{ext}: draft={d} live={l} {match}")
    for dose in ("10mg", "5mg"):
        p = f"{MEDIA}/vial-{SLUG}-{dose}.{ext}"
        if os.path.isfile(p):
            m = md5(p)
            match = "OK" if m == d else "FAIL"
            if m != d:
                ok = False
            print(f"  dosevar {SLUG}-{dose}.{ext}: {m} {match}")

tirz_after = md5(f"{MEDIA}/vial-tirzepatide.png")
sema_after = md5(f"{MEDIA}/vial-semaglutide.png")
print("TIRZ untouched", tirz_before == tirz_after, tirz_after)
print("SEMA untouched", sema_before == sema_after, sema_after)

with open(path) as f:
    t = f.read()
print(f"PDP v=179={f'vial-{SLUG}.webp?v=179' in t} thumbs_remain={'pdp-thumbs' in t} gold_js_stomp={'gold crimp cap' in t and 'pdpMainImg' in t}")

for jf in js_files:
    with open(jf) as f:
        jt = f.read()
    print(f"{jf}: has179={('?v=179' in jt)} has178={('?v=178' in jt)}")

print("SHIP_SCRIPT_DONE", "ok" if ok else "MD5_FAIL")
print("BAK_DIR", BAK)
print("STATIC_ALT", static_alt)
print("IMG_ALT_EXPR", after_alt)
