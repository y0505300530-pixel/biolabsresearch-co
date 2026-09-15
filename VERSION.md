# biolabsresearch.co — Version 2.61

Released 2026-09-15.

Codename: rsay-visible-autorun

## Highlights

- **Researchers say...** auto-run made reliably visible: SPEED 1.25 px/frame, scroll-behavior auto, snap disabled while moving
- Probe scrollLeft; if no-op (clipped overflow), fall back to `transform: translateX` marquee on `.rsay-track`
- Starts paused only for prefers-reduced-motion; pause on pointer/touch/wheel, resume after idle; never stuck paused on load
- Content unchanged: names + green initials, Marketing quotes, olive stars, **4.9/5 · 1,200**, no Example lab note / Verified
- CSS `biolabs_style.css?v=355`; age-gate + cart untouched
