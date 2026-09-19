#!/bin/sh
# After a live deploy, ping IndexNow with new/changed public URLs (or the sitemap).
# Key lives in the webroot (see html/indexnow-key.txt). Quote SoT is unrelated.
# Usage:
#   ./scripts/indexnow-ping.sh
#   ./scripts/indexnow-ping.sh https://biolabsresearch.co/science https://biolabsresearch.co/tools
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
KEY_POINTER="$ROOT/html/indexnow-key.txt"
HOST="biolabsresearch.co"
ENDPOINT="https://api.indexnow.org/indexnow"

if [ ! -f "$KEY_POINTER" ]; then
  echo "missing $KEY_POINTER" >&2
  exit 1
fi

KEY=$(tr -d '[:space:]' < "$KEY_POINTER")
KEY_FILE="$ROOT/html/${KEY}.txt"
if [ ! -f "$KEY_FILE" ]; then
  echo "missing official key file $KEY_FILE" >&2
  exit 1
fi
KEY_LOCATION="https://${HOST}/${KEY}.txt"

if [ "$#" -gt 0 ]; then
  URLS="$*"
else
  URLS=$(sed -n 's/.*<loc>\([^<]*\)<\/loc>.*/\1/p' "$ROOT/html/sitemap.xml")
  URLS="$URLS https://${HOST}/sitemap.xml"
fi

TMP=$(mktemp)
{
  printf '{'
  printf '"host":"%s",' "$HOST"
  printf '"key":"%s",' "$KEY"
  printf '"keyLocation":"%s",' "$KEY_LOCATION"
  printf '"urlList":['
  first=1
  for u in $URLS; do
    [ "$first" -eq 1 ] || printf ','
    printf '"%s"' "$u"
    first=0
  done
  printf ']}'
} > "$TMP"

echo "POST $ENDPOINT  ($KEY_LOCATION)"
curl -sS -m 30 -D - -o /tmp/indexnow-body.txt \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data-binary @"$TMP" \
  "$ENDPOINT" || true
echo
if [ -f /tmp/indexnow-body.txt ]; then
  cat /tmp/indexnow-body.txt
  echo
fi
rm -f "$TMP"
echo "Done. Expected HTTP 200 (accepted) or 202 (accepted for processing) after the key file is live."
