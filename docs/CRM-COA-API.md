# CRM products-api — COA fields for storefront tip v2.99g

Storefront SoT: a PDP may show **Download COA** / **View lot COA** only when `/api/products` returns a real PDF URL. No file in this repo is invented. Live catalog (2026-09-19) does **not** yet emit these keys.

## Required (when a lot PDF exists)

| Field | Type | Rules |
|---|---|---|
| `coa_pdf_url` | string | HTTPS or same-origin path. Must end in `.pdf` (query string allowed). Empty / omitted / `null` = no download button. Do **not** send `/coa?q=…`, `#`, or a non-PDF. |

## Optional

| Field | Type | Rules |
|---|---|---|
| `coa_lot` | string | Lot label printed on the matching PDF. Omit rather than invent. When present, the PDP label is **View lot COA**. |

## Storefront behaviour

- `coa_pdf_url` present and valid → link opens that PDF; JSON-LD `DigitalDocument` is emitted.
- Field missing or invalid → **Request lot COA** inquiry only. No Authentic / broken viewer.
- Prices stay on existing catalog fields (`price`, `strengths`, `strength_prices`, `strength_originals`). Do not put prices in the COA object.

## Example product object (additive)

```json
{
  "slug": "bpc-157",
  "coa_pdf_url": "/media/coa/bpc-157-lot-ARC123.pdf",
  "coa_lot": "ARC123"
}
```

Owner: infra (CRM products-api). Storefront already reads the fields on every PDP via `html/coa-pdp.js`.
