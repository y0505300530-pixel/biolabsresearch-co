# biolabsresearch.co — Version 1.04

Released 2026-09-09.

## What this version improves

- Homepage hero: replace right-column product still with cinematic vial video (hero-cinematic mp4+webm+poster)
- Hero text column: align-items center + padding-top 72px
- Video: 16/9, radius 20px, gold border, object-fit cover, zero CLS
- IntersectionObserver play/pause; prefers-reduced-motion = poster only
- Mobile ≤640px: video above text, max-height 220px, CTAs 48px
- /media/video/ already Cache-Control immutable (nginx)
