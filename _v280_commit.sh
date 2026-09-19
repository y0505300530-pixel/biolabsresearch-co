#!/bin/bash
set -e
cd /var/www/biofirst

python3 - <<'PY'
import urllib.request, re, hashlib
from pathlib import Path
for url, slug in [
  ('https://biolabsresearch.co/products/bpc-157','bpc-157'),
  ('https://biolabsresearch.co/products/nad-plus','nad-plus'),
]:
  req=urllib.request.Request(url, headers={'Cache-Control':'no-cache','Pragma':'no-cache','User-Agent':'v280-verify'})
  t=urllib.request.urlopen(req, timeout=30).read().decode('utf-8','replace')
  naked=re.sub(r'<!--[\s\S]*?-->','',t)
  disk=Path(f'html/products/{slug}.html').read_bytes()
  print(slug, 'live_bytes', len(t),
        'INSIDER25', 'INSIDER25' in naked,
        'launch-note', 'price-launch-note' in naked,
        'ssr-orig', bool(re.search(r'<span class="price-original">', naked)),
        'ATC', t.count('ADD TO CART'),
        'disk_sha256', hashlib.sha256(disk).hexdigest(),
        'live_has_2.80', '2.80' in t,
        'promo_empty', 'promo ended' in t)
  assert 'INSIDER25' not in naked
  assert 'price-launch-note' not in naked
  assert not re.search(r'<span class="price-original">', naked)
  assert t.count('ADD TO CART') >= 1
print('LIVE VERIFY OK')
PY

git add -u html/ version.json VERSION.md
git add _ship_v280_promo_strip.py
# also stage checkout if modified after first add
git add html/checkout.html html/version.json

git status -sb | head -20
git diff --cached --stat | tail -20

git commit -m "v2.80: strip expired INSIDER25 promo chrome sitewide + PDP strike"

git push origin main
echo EXIT:$?
git log -1 --format='%H %s'
git status -sb | head -8
