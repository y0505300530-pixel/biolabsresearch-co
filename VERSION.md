# biolabsresearch.co — Version 2.63

Released 2026-09-15.

Codename: rsay-pause-after-drag + product-img-css

## Highlights

- **Researchers say...** stay paused after any pointer drag / wheel / touch interaction for the page load (no ~2s idle auto-resume). Auto-run still starts on load (unless prefers-reduced-motion). Marketing quotes/names/4.9 unchanged.
- **Product image CSS uniformity (Yehuda Part 2):** square 1:1 frames + background `#F2EFE9` on `.product-img-main` / `#pdpMainImg`, `.pdp-thumb`, `.product-card-media` / `.product-card-img`, `.pr-card-media`. PDP main: `object-fit: contain` + center. Cards / pairs rail: `object-fit: cover` + center. PNG asset normalize deferred (Part 1).
- CSS `biolabs_style.css?v=356`; age-gate + cart untouched
