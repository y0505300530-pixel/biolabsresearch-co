# BioFirst launch security — 24 Aug 2026

## Applied
- nginx `/api/` is an allowlist: GET `/api/products`, POST `/api/notify-order`, POST `/api/contact`. Everything else 404.
- Rate limits: catalog 8 r/s, forms 8 r/m per IP.
- products-api now listens on 127.0.0.1 only (not the public interface).
- `/admin.html` localhost-only. `/.git` denied. `.env` / `.bak` denied.
- SSH: keys only, root without-password. fail2ban sshd. UFW 22/80/443 only.
- Checkout is inquiry only (no card fields).

## Still on Yehuda
- Namecheap: SPF / DKIM / DMARC for payments@ and info@ (phishing lookalikes).
- Rotate the hardcoded admin header secret in the old products-api and any admin UI that sends it. Do not paste the old value into chat.
- The CRM JSON files (orders, customers, messages) still live next to the Node process. Back them up off-box. Do not serve them from html/.
- No card PSP yet — inquiry spam is the fraud mode. Forms are rate-limited; watch mailbox.
- Shared droplet: other vhosts still exist. BioFirst no longer proxies their CRM paths.

## Do not
- Open `/api/` as a prefix again.
- Bind products-api to 0.0.0.0.
