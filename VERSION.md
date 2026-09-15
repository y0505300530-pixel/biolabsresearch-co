# biolabsresearch.co — Version 1.97

Released 2026-09-15.

## What this version improves

- Speed (mobile/social): trim promo ticker HTML from ~17 clones to 2; cap JS fillMarquee clones
- Defer head JS: cookie-consent, cart-vial, search-overlay (non-blocking parse)
- Hero video: preload=none, no autoplay attr (IO still plays when visible); mp4 before webm
- LCP preload: hero poster instead of unused blend webp
- nginx: gzip already on for CSS/JS/HTML; static cache headers unchanged (no brotli module yet)
