#!/usr/bin/env python3
"""Fail if any two site pages share the same title or the same description."""
from __future__ import annotations

import html
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_ROOT = ROOT / "html"

SKIP_FILES = {
    HTML_ROOT / "google831c5ec309d38eb5.html",
    HTML_ROOT / "admin.html",
}


def iter_pages():
    for p in sorted(HTML_ROOT.rglob("*.html")):
        if any(part.startswith("_") or part.endswith(".bak") or "bak" in part for part in p.parts):
            continue
        if p in SKIP_FILES:
            continue
        if "_base44-brief" in p.parts:
            continue
        yield p


def extract(tag_name_or_meta, text: str, kind: str) -> str:
    if kind == "title":
        m = re.search(r"<title\b[^>]*>(.*?)</title>", text, flags=re.I | re.S)
        return html.unescape(re.sub(r"\s+", " ", m.group(1)).strip()) if m else ""
    if kind == "description":
        m = re.search(
            r'<meta\b(?=[^>]*\bname=["\']description["\'])[^>]*>',
            text,
            flags=re.I,
        )
        if not m:
            return ""
        cm = re.search(r'\bcontent=("([^"]*)"|\'([^\']*)\')', m.group(0), flags=re.I)
        if not cm:
            return ""
        val = cm.group(2) if cm.group(2) is not None else cm.group(3)
        return html.unescape(val.strip())
    return ""


def main() -> int:
    titles = defaultdict(list)
    descs = defaultdict(list)
    missing = []
    pages = list(iter_pages())
    for p in pages:
        text = p.read_text(encoding="utf-8", errors="replace")
        t = extract(None, text, "title")
        d = extract(None, text, "description")
        rel = str(p.relative_to(ROOT))
        if not t:
            missing.append(f"{rel}: missing title")
        if not d:
            missing.append(f"{rel}: missing description")
        titles[t].append(rel)
        descs[d].append(rel)

    dups = []
    for t, files in titles.items():
        if t and len(files) > 1:
            dups.append(f"TITLE shared by {files}: {t!r}")
    for d, files in descs.items():
        if d and len(files) > 1:
            dups.append(f"DESCRIPTION shared by {files}: {d!r}")

    print(f"checked {len(pages)} HTML pages")
    if missing or dups:
        for line in missing + dups:
            print("FAIL", line)
        return 1
    print("OK: all titles unique, all descriptions unique")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
