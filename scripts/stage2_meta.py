"""Stage 2 unique title/description/canonical/OG map for biolabsresearch.co."""

SUFFIX = " — Bio Labs Research"
HOST = "https://biolabsresearch.co"

# vial PNGs that are ~1280x720 and <= ~300KB
OG_VIAL = {
    "bpc-157-tb-500-blend": f"{HOST}/media/vial-bpc-157-tb-500-blend.png",
    "curcumin-phytosome": f"{HOST}/media/vial-curcumin-phytosome.png",
    "epithalon": f"{HOST}/media/vial-epithalon.png",
    "ghk-cu": f"{HOST}/media/vial-ghk-cu.png",
    "glow-70": f"{HOST}/media/vial-glow-70.png",
    "kisspeptin-10": f"{HOST}/media/vial-kisspeptin-10.png",
    "kpv": f"{HOST}/media/vial-kpv.png",
    "mots-c": f"{HOST}/media/vial-mots-c.png",
    "nad-plus": f"{HOST}/media/vial-nad-plus.png",
    "retatrutide": f"{HOST}/media/vial-retatrutide.png",
    "semax": f"{HOST}/media/vial-semax.png",
    "tb-500": f"{HOST}/media/vial-tb-500.png",
    "tesamorelin-ipamorelin": f"{HOST}/media/vial-tesamorelin-ipamorelin.png",
    "thymosin-alpha-1": f"{HOST}/media/vial-thymosin-alpha-1.png",
}

# Catalog SoT prices from html/catalog-mg.js FALLBACK (default listed price).
PRICES = {
    "bpc-157-tb-500-blend": 125,
    "nad-plus": 99,
    "aod-9604": 85,
    "curcumin-phytosome": 109,
    "tesamorelin-ipamorelin": 119,
    "bpc-157": 89,
    "glow-70": 139,
    "epithalon": 79,
    "ghk-cu": 69,
    "mots-c": 95,
    "kpv": 79,
    "semax": 89,
    "kisspeptin-10": 99,
    "thymosin-alpha-1": 109,
    "tb-500": 99,
    "retatrutide": 139,
}

# path -> record
# topic: used as "<topic> — Bio Labs Research"
# description: 140-160 chars, unique complete sentence(s)
# canonical: absolute clean URL
# og_type: website | article | product
# og_image: absolute URL or None
# crumbs: list of (name, url) for deep pages, or None
# kind: product | article | page
# jsonld_name: optional product/article name

PAGES = {
    "html/index.html": {
        "topic": "Research Compound Catalog",
        "description": "Bio Labs Research lists laboratory compounds for inquiry only, with lot papers on request and US fulfillment after confirmation. Research use only.",
        "canonical": f"{HOST}/",
        "og_type": "website",
        "og_image": f"{HOST}/media/og-image.jpg",
        "crumbs": None,
        "kind": "page",
    },
    "html/404.html": {
        "topic": "Page Not Found",
        "description": "This address is not a listed catalog URL. Return to the compound index, science notes, or shipping policy. Inquiry-only storefront, research use only.",
        "canonical": f"{HOST}/404",
        "og_type": "website",
        "og_image": None,
        "crumbs": None,
        "kind": "page",
    },
    "html/faq.html": {
        "topic": "Catalog FAQ",
        "description": "Answers on research-use listings, lot certificates, inquiry checkout, and shipping windows from the shipping policy. No clinical advice is given.",
        "canonical": f"{HOST}/faq",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("FAQ", f"{HOST}/faq")],
        "kind": "page",
    },
    "html/contact.html": {
        "topic": "Contact the Lab Desk",
        "description": "Reach the catalog desk for SKU questions, lot paperwork, or shipment status. Support hours are published here. Research use only, inquiry-only storefront.",
        "canonical": f"{HOST}/contact",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Contact", f"{HOST}/contact")],
        "kind": "page",
    },
    "html/shipping.html": {
        "topic": "Shipping and Lead Times",
        "description": "Confirmed inquiries process in one to two business days, then USPS Ground in three to five US business days. Cold-chain packing is used when a lot needs it.",
        "canonical": f"{HOST}/shipping",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Shipping", f"{HOST}/shipping")],
        "kind": "page",
    },
    "html/returns.html": {
        "topic": "Returns and Refunds",
        "description": "Opened research lots cannot be returned. Unopened packs may be reviewed within 14 days. Report damage within 48 hours of delivery. Inquiry-only catalog.",
        "canonical": f"{HOST}/returns",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Returns", f"{HOST}/returns")],
        "kind": "page",
    },
    "html/privacy-policy.html": {
        "topic": "Privacy Policy",
        "description": "How inquiry names, emails, and ship-to details are used to answer catalog requests. We do not sell personal data. Operated by LEEDS MARKETING GROUP LTD.",
        "canonical": f"{HOST}/privacy-policy",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Privacy Policy", f"{HOST}/privacy-policy")],
        "kind": "page",
    },
    "html/terms-and-conditions.html": {
        "topic": "Terms and Conditions",
        "description": "Legal terms for research-use catalog inquiries, purchaser obligations, and lot identity. Listings are not medicines and are not for human or veterinary use.",
        "canonical": f"{HOST}/terms-and-conditions",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Terms", f"{HOST}/terms-and-conditions")],
        "kind": "page",
    },
    "html/science.html": {
        "topic": "How a Lot Is Specified",
        "description": "Public catalog identity versus lot results on a certificate of analysis. HPLC and mass data belong on the lot file when issued, not as invented statistics.",
        "canonical": f"{HOST}/science",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Science", f"{HOST}/science")],
        "kind": "page",
    },
    "html/coa.html": {
        "topic": "Certificate of Analysis",
        "description": "Hosted lot certificates for catalog SKUs when a real file exists in the COA library. Request a missing lot document through the inquiry desk. Research use only.",
        "canonical": f"{HOST}/coa",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("COA Library", f"{HOST}/coa")],
        "kind": "page",
    },
    "html/guide-reading-coa.html": {
        "topic": "How to Read a Lot COA",
        "description": "A laboratory walkthrough of HPLC traces, mass matches, and net content on a certificate of analysis. This guide does not invent purity percentages for any SKU.",
        "canonical": f"{HOST}/guide-reading-coa",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("How to read a COA", f"{HOST}/guide-reading-coa")],
        "kind": "page",
    },
    "html/checkout.html": {
        "topic": "Catalog Inquiry Form",
        "description": "Submit a research-use catalog inquiry. No payment is collected here. Lines stay tied to listed SKUs, and fulfillment follows the published shipping policy.",
        "canonical": f"{HOST}/checkout",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Inquiry", f"{HOST}/checkout")],
        "kind": "page",
    },
    "html/tools.html": {
        "topic": "Laboratory Research Tools",
        "description": "Client-side helpers for solution dilution, mass units, and side-by-side compound notes. Nothing here is a dosing guide. Research use only, no account required.",
        "canonical": f"{HOST}/tools",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Tools", f"{HOST}/tools")],
        "kind": "page",
    },
    "html/blog.html": {
        "topic": "Blog Redirect",
        "description": "This file only forwards browsers to the research notes index. Open the blog hub for identity articles and sourcing notes. Research use only.",
        "canonical": f"{HOST}/blog/",
        "og_type": "website",
        "og_image": None,
        "crumbs": None,
        "kind": "page",
    },
    "html/blog/index.html": {
        "topic": "Research Notes and Guides",
        "description": "Identity notes, COA reading, and catalog-scope articles for laboratory purchasers. Posts describe listed reagents and do not invent lot statistics.",
        "canonical": f"{HOST}/blog/",
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Blog", f"{HOST}/blog/")],
        "kind": "page",
    },
    "html/product.html": {
        "topic": "Legacy Compound Loader",
        "description": "Legacy loader kept for old bookmarks. Use a clean catalog SKU path for a listed research compound. Not a checkout page. Research use only listing.",
        "canonical": f"{HOST}/product",
        "og_type": "website",
        "og_image": None,
        "crumbs": None,
        "kind": "page",
    },
    "html/products/product.html": {
        "topic": "Fallback Compound Listing",
        "description": "Fallback template used when a SKU file is missing. Prefer a dedicated product path from the catalog. Research use only and sold by inquiry, not checkout.",
        "canonical": f"{HOST}/products/product",
        "og_type": "product",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Catalog", f"{HOST}/#catalog"), ("Listing", f"{HOST}/products/product")],
        "kind": "product",
        "jsonld_name": "Research compound listing",
    },
}

def _pdp(slug, topic, name, role, extra):
    price = PRICES[slug]
    desc = f"{name} is listed as {role}. Catalog price is USD {price}. {extra}"
    return {
        "topic": topic,
        "description": desc,
        "canonical": f"{HOST}/products/{slug}",
        "og_type": "product",
        "og_image": OG_VIAL.get(slug),
        "crumbs": [
            ("Home", f"{HOST}/"),
            ("Catalog", f"{HOST}/#catalog"),
            (name, f"{HOST}/products/{slug}"),
        ],
        "kind": "product",
        "jsonld_name": name,
        "slug": slug,
        "price": price,
    }

PAGES.update({
    "html/products/bpc-157.html": _pdp(
        "bpc-157", "BPC-157 Research Reagent", "BPC-157",
        "a pentadecapeptide laboratory reagent",
        "Lot papers on request. Research use only, not a medicine.",
    ),
    "html/products/tb-500.html": _pdp(
        "tb-500", "TB-500 Research Reagent", "TB-500",
        "a thymosin-beta-4 fragment listing",
        "Lot papers on request. Identity is the sequence on the lot COA.",
    ),
    "html/products/nad-plus.html": _pdp(
        "nad-plus", "NAD+ Laboratory Reagent", "NAD+",
        "a biochemical reference standard",
        "Lot papers on request. This is not a dietary supplement listing.",
    ),
    "html/products/ghk-cu.html": _pdp(
        "ghk-cu", "GHK-Cu Research Reagent", "GHK-Cu",
        "a copper-binding tripeptide listing",
        "Lot papers on request. This is not a cosmetic finished good.",
    ),
    "html/products/epithalon.html": _pdp(
        "epithalon", "Epithalon Research Reagent", "Epithalon",
        "a tetrapeptide laboratory listing",
        "Lot papers on request. No aging-treatment claim is made here.",
    ),
    "html/products/mots-c.html": _pdp(
        "mots-c", "MOTS-c Research Reagent", "MOTS-c",
        "a mitochondrial-derived peptide listing",
        "Lot papers on request. Intended for in vitro laboratory work only.",
    ),
    "html/products/kpv.html": _pdp(
        "kpv", "KPV Research Reagent", "KPV",
        "an alpha-MSH fragment laboratory listing",
        "Lot papers on request. Not a topical or veterinary product.",
    ),
    "html/products/semax.html": _pdp(
        "semax", "Semax Research Reagent", "Semax",
        "an ACTH fragment laboratory listing",
        "Lot papers on request. This page is not a registered drug label.",
    ),
    "html/products/kisspeptin-10.html": _pdp(
        "kisspeptin-10", "Kisspeptin-10 Reagent", "Kisspeptin-10",
        "a KISS1 fragment laboratory listing",
        "Lot papers on request. Sequence belongs on the lot file.",
    ),
    "html/products/thymosin-alpha-1.html": _pdp(
        "thymosin-alpha-1", "Thymosin Alpha-1 Reagent", "Thymosin Alpha-1",
        "a 28-residue N-acetyl peptide listing",
        "Lot papers on request. Do not confuse it with TB-500.",
    ),
    "html/products/aod-9604.html": _pdp(
        "aod-9604", "AOD-9604 Research Reagent", "AOD-9604",
        "an hGH-fragment analog listing",
        "Lot papers on request. Match the printed sequence on the vial.",
    ),
    "html/products/retatrutide.html": _pdp(
        "retatrutide", "R3TA Research Reagent", "R3TA",
        "a metabolic research compound listing",
        "Lot papers on request. Investigational laboratory context only.",
    ),
    "html/products/glow-70.html": _pdp(
        "glow-70", "GLOW 70 Catalog Blend", "GLOW 70",
        "a named catalog blend without a CAS number",
        "Lot papers on request. Components are on the lot COA.",
    ),
    "html/products/curcumin-phytosome.html": _pdp(
        "curcumin-phytosome", "Curcumin Phytosome Reagent", "Curcumin Phytosome",
        "a phospholipid curcumin complex, not a peptide",
        "Lot papers on request. Laboratory formulation only.",
    ),
    "html/products/tesamorelin-ipamorelin.html": _pdp(
        "tesamorelin-ipamorelin", "Tesamorelin Ipamorelin", "Tesamorelin / Ipamorelin",
        "a two-compound laboratory blend",
        "Lot papers on request. Two masses belong on the COA.",
    ),
    "html/products/bpc-157-tb-500-blend.html": _pdp(
        "bpc-157-tb-500-blend", "BPC-157 TB-500 Blend", "BPC-157 / TB-500 Blend",
        "a two-sequence laboratory blend",
        "Lot papers on request. Amounts belong on the lot file.",
    ),
})

def _tool(path, topic, canonical, desc):
    return {
        "topic": topic,
        "description": desc,
        "canonical": canonical,
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Tools", f"{HOST}/tools"), (topic, canonical)],
        "kind": "page",
    }

PAGES.update({
    "html/tools/dilution.html": _tool(
        "html/tools/dilution.html",
        "Solution Dilution Tool",
        f"{HOST}/tools/dilution",
        "Work out mg per mL from vial mass and solvent volume on your own machine. This helper is not a protocol and does not replace laboratory SOPs. Research use only.",
    ),
    "html/tools/solution-dilution.html": _tool(
        "html/tools/solution-dilution.html",
        "Dilution Calculator Page",
        f"{HOST}/tools/solution-dilution",
        "Alternate URL for the same client-side dilution math: mass divided by solvent volume. No account and no stored results. Research use only, not a dosing tool.",
    ),
    "html/tools/units.html": _tool(
        "html/tools/units.html",
        "Mass Unit Converter",
        f"{HOST}/tools/units",
        "Convert common laboratory mass units in the browser. Figures are arithmetic only and are not lot certificates or purity claims. Research use only.",
    ),
    "html/tools/unit-converter.html": _tool(
        "html/tools/unit-converter.html",
        "Unit Conversion Tool",
        f"{HOST}/tools/unit-converter",
        "Second path for the mass-unit helper used beside catalog vials. Output is not a specification. Keep conversions with your own lab notebook. Research use only.",
    ),
    "html/tools/compare.html": _tool(
        "html/tools/compare.html",
        "Compound Compare Tool",
        f"{HOST}/tools/compare",
        "Place two catalog names side by side for identity notes. This tool does not rank products or invent CAS data. Research use only, inquiry-only catalog.",
    ),
    "html/tools/compound-comparison.html": _tool(
        "html/tools/compound-comparison.html",
        "Side-by-Side Compounds",
        f"{HOST}/tools/compound-comparison",
        "Alias page for the comparison workspace. Use it to keep SKU names distinct while you read lot paperwork. Not a clinical comparison. Research use only.",
    ),
})

def _cmp(slug, topic, desc):
    url = f"{HOST}/compare/{slug}"
    return {
        "topic": topic,
        "description": desc,
        "canonical": url,
        "og_type": "website",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Compare", f"{HOST}/tools"), (topic, url)],
        "kind": "page",
    }

PAGES.update({
    "html/compare/bpc-157-vs-tb-500.html": _cmp(
        "bpc-157-vs-tb-500",
        "BPC-157 vs TB-500 Notes",
        "Identity notes that keep BPC-157 and the TB-500 fragment listing distinct. Sequences and masses belong on lot files. Research use only, no treatment claims.",
    ),
    "html/compare/ghk-cu-vs-bpc-157.html": _cmp(
        "ghk-cu-vs-bpc-157",
        "GHK-Cu vs BPC-157 Notes",
        "Side-by-side catalog identity for GHK-Cu and BPC-157. Different sequences, different listings. This page does not invent purity figures. Research use only.",
    ),
    "html/compare/cjc-1295-dac-vs-no-dac.html": _cmp(
        "cjc-1295-dac-vs-no-dac",
        "CJC-1295 DAC vs No DAC",
        "DAC and no-DAC formulas are different molecules. This note is educational and does not add those names as catalog SKUs here. Research use only.",
    ),
    "html/compare/ipamorelin-vs-sermorelin.html": _cmp(
        "ipamorelin-vs-sermorelin",
        "Ipamorelin vs Sermorelin",
        "A short identity comparison for two growth-hormone secretagogue names used in literature. Neither is sold from this page. Research use only.",
    ),
    "html/compare/semaglutide-vs-tirzepatide.html": _cmp(
        "semaglutide-vs-tirzepatide",
        "Semaglutide vs Tirzepatide",
        "Literature names placed side by side for laboratory readers. These are not catalog SKUs on this storefront. Research use only, no prescribing information.",
    ),
})

def _art(slug, topic, desc, headline):
    url = f"{HOST}/blog/{slug}"
    return {
        "topic": topic,
        "description": desc,
        "canonical": url,
        "og_type": "article",
        "og_image": None,
        "crumbs": [("Home", f"{HOST}/"), ("Blog", f"{HOST}/blog/"), (headline, url)],
        "kind": "article",
        "jsonld_name": headline,
    }

PAGES.update({
    "html/blog/what-is-bpc-157-research-overview.html": _art(
        "what-is-bpc-157-research-overview",
        "What Is BPC-157 Research",
        "A laboratory overview of BPC-157 as a listed pentadecapeptide reagent. The article does not invent HPLC area percent and is not a use protocol.",
        "What Is BPC-157? A Research Overview",
    ),
    "html/blog/ghk-cu-copper-peptide-research.html": _art(
        "ghk-cu-copper-peptide-research",
        "GHK-Cu Copper Peptide Notes",
        "Research-context notes on the GHK-Cu tripeptide listing. Cosmetic or clinical use is out of scope. Lot results stay on the certificate when one is issued.",
        "GHK-Cu Copper Peptide: Research Overview",
    ),
    "html/blog/tb-500-thymosin-beta-4-research.html": _art(
        "tb-500-thymosin-beta-4-research",
        "TB-500 Thymosin Notes",
        "How the TB-500 catalog name relates to thymosin-beta-4 fragment listings. Public CAS tables are not a substitute for the lot sequence. Research use only.",
        "TB-500 (Thymosin Beta-4) Research Overview",
    ),
    "html/blog/mots-c-mitochondrial-research-peptide.html": _art(
        "mots-c-mitochondrial-research-peptide",
        "MOTS-c Mitochondrial Notes",
        "Background on MOTS-c as a mitochondrial-derived peptide used in laboratory literature. This is not an exercise or treatment article. Research use only.",
        "MOTS-c: Mitochondrial Research Peptide Overview",
    ),
    "html/blog/nad-plus-research-applications.html": _art(
        "nad-plus-research-applications",
        "NAD+ Research Applications",
        "NAD+ as a biochemical reference standard versus consumer supplement marketing. The catalog listing is laboratory-only. No human-use directions are provided.",
        "NAD+ Research Applications: A Biochemical Overview",
    ),
    "html/blog/retatrutide-metabolic-research.html": _art(
        "retatrutide-metabolic-research",
        "R3TA Metabolic Research",
        "Laboratory-context notes on the R3TA (retatrutide) listing. Investigational literature is not a catalog claim of efficacy. Research use only, inquiry-only.",
        "R3TA (Retatrutide): Metabolic Research Overview",
    ),
    "html/blog/epithalon-aging-research-peptide.html": _art(
        "epithalon-aging-research-peptide",
        "Epithalon Aging Research",
        "A short research overview of the Epithalon tetrapeptide listing. Longevity headlines in the press are not product claims on this site. Research use only.",
        "Epithalon: Aging Research Overview",
    ),
    "html/blog/peptide-purity-and-coa-explained.html": _art(
        "peptide-purity-and-coa-explained",
        "Peptide Purity and COA",
        "Why a storefront page should not invent a purity percentage. HPLC area percent and net content belong on the lot certificate of analysis. Research use only.",
        "Peptide Purity and COA Explained",
    ),
    "html/blog/buying-research-peptides-online-guide-2026.html": _art(
        "buying-research-peptides-online-guide-2026",
        "Buying Research Compounds",
        "A 2026 sourcing note for laboratory purchasers: inquiry checkout, lot papers, and RUO labeling. It is not a shopping coupon page. Research use only.",
        "Buying Research Peptides Online: A 2026 Sourcing Guide",
    ),
    "html/blog/kpv-alpha-msh-11-13-identity.html": _art(
        "kpv-alpha-msh-11-13-identity",
        "KPV Identity as α-MSH 11–13",
        "KPV is the alpha-MSH 11–13 fragment, not the intact hormone. Public identifiers are not a lot assay. Ask for the certificate when you need numbers.",
        "KPV Is α-MSH 11–13, Not the Whole Hormone",
    ),
    "html/blog/melanotan-ii-identity.html": _art(
        "melanotan-ii-identity",
        "Melanotan II Identity Note",
        "Melanotan II is a cyclic analogue discussed in literature and is not a SKU on this catalog. The note exists so purchasers do not conflate names.",
        "Melanotan II Is a Cyclic α-MSH Analogue, Not a Catalog SKU",
    ),
    "html/blog/dac-vs-no-dac-formula-difference.html": _art(
        "dac-vs-no-dac-formula-difference",
        "DAC vs No-DAC Formulas",
        "Drug affinity complex versus no-DAC is a formula difference, not a size option. Those molecules are not listed as catalog SKUs here. Research use only.",
        "DAC vs no-DAC is a formula difference",
    ),
    "html/blog/tesamorelin-ipamorelin-blend-identity.html": _art(
        "tesamorelin-ipamorelin-blend-identity",
        "Tesamorelin Blend Identity",
        "One vial can carry two CAS numbers when two sequences are filled. This blend is not Egrifta and not a medicine. Lot masses belong on the COA.",
        "Tesamorelin / Ipamorelin: Two CAS Numbers on One Vial",
    ),
    "html/blog/glow-70-named-blend-identity.html": _art(
        "glow-70-named-blend-identity",
        "GLOW 70 Named Blend Note",
        "GLOW 70 is a catalog name, not a CAS registry number. This article does not invent a recipe. Identity is the lot certificate when a file is issued.",
        "GLOW 70 Is a Named Catalog Blend, Not a CAS Number",
    ),
    "html/blog/tb-500-vs-thymosin-beta-4-identity.html": _art(
        "tb-500-vs-thymosin-beta-4-identity",
        "TB-500 vs Thymosin β4",
        "TB-500 as a catalog name is not automatically intact thymosin beta-4. Read the sequence printed on the lot document. No invented HPLC percent.",
        "TB-500 vs Thymosin β4: Which Sequence Is on the Vial",
    ),
    "html/blog/semax-acth-4-7-pgp-identity.html": _art(
        "semax-acth-4-7-pgp-identity",
        "Semax ACTH Fragment ID",
        "Semax is ACTH(4–7)-PGP with sequence MEHFPGP in the public literature. This listing is not a nasal medicine. Lot identity is the observed mass on the COA.",
        "Semax Is ACTH(4–7)-PGP, Sequence MEHFPGP",
    ),
    "html/blog/cjc-1295-dac-vs-modified-grf-identity.html": _art(
        "cjc-1295-dac-vs-modified-grf-identity",
        "CJC-1295 DAC Identity",
        "CJC-1295 with DAC and without DAC are different molecules. Neither is added as a catalog SKU on this site. Research use only, no invented percentages.",
        "CJC-1295 With DAC and Without DAC Are Different Molecules",
    ),
    "html/blog/catalog-skus-vs-research-analogues.html": _art(
        "catalog-skus-vs-research-analogues",
        "Catalog SKUs vs Analogues",
        "A purchasing note: literature interest is not a cart line. Only listed cards can be inquired. Absence from the catalog is not a purity claim.",
        "Catalog SKUs vs research analogues",
    ),
    "html/blog/lot-coa-not-purity-percentage.html": _art(
        "lot-coa-not-purity-percentage",
        "Lot COA Not a Purity %",
        "A catalog card should not display an invented HPLC area percent. When numbers exist, they live on the lot certificate. Research use only, inquiry-only desk.",
        "Lot COA, not a purity percentage",
    ),
    "html/blog/bpc-157-tb-500-blend-identity.html": _art(
        "bpc-157-tb-500-blend-identity",
        "BPC-157 Blend Identity",
        "Two sequences in one SKU are not a third CAS number. Per-compound masses belong on the lot certificate. Research use only, no invented mix ratio on this page.",
        "BPC-157 / TB-500 Blend: Two Sequences, Two Masses",
    ),
    "html/blog/curcumin-phytosome-identity.html": _art(
        "curcumin-phytosome-identity",
        "Curcumin Phytosome Identity",
        "Curcumin phytosome is a phospholipid complex, not a peptide CAS. The listing is a laboratory formulation. Research use only, not a dietary supplement page.",
        "Curcumin Phytosome Is a Complex, Not a Peptide CAS",
    ),
    "html/blog/thymosin-alpha-1-thymalfasin-identity.html": _art(
        "thymosin-alpha-1-thymalfasin-identity",
        "Thymosin Alpha-1 Identity",
        "Thymosin alpha-1 is the 28-residue N-acetyl peptide, not TB-500. Keep the two catalog names separate when you request lot papers. Research use only.",
        "Thymosin Alpha-1 Is the 28-Residue N-Acetyl Peptide, Not TB-500",
    ),
    "html/blog/hplc-area-percent-vs-net-peptide-content.html": _art(
        "hplc-area-percent-vs-net-peptide-content",
        "HPLC Area vs Net Content",
        "HPLC area percent is not the same measurement as net peptide content. Both fields, when issued, belong on the lot COA. This article invents neither number.",
        "HPLC Area Percent Is Not Net Peptide Content",
    ),
    "html/blog/shipping-cold-chain-research-reagents.html": _art(
        "shipping-cold-chain-research-reagents",
        "Cold-Chain Shipping Notes",
        "How temperature-sensitive lots are packed after inquiry confirmation. Lead times follow the shipping policy: process in 1–2 business days. Research use only.",
        "Shipping cold-chain for research reagents",
    ),
    "html/blog/aod-9604-hgh-fragment-identity.html": _art(
        "aod-9604-hgh-fragment-identity",
        "AOD-9604 vs hGH Fragment",
        "AOD-9604 and hGH 177–191 are related names that still need the sequence on the vial paperwork. Do not assume they are interchangeable. Research use only.",
        "AOD-9604 vs hGH 177–191: Match the Sequence on the Vial",
    ),
    "html/blog/one-vial-two-cas-numbers.html": _art(
        "one-vial-two-cas-numbers",
        "One Vial Two CAS Numbers",
        "A blend vial can list two CAS numbers because two molecules are present. That is not a third compound. Check both masses on the lot certificate.",
        "One vial, two CAS numbers",
    ),
    "html/blog/kisspeptin-10-kiss1-fragment-identity.html": _art(
        "kisspeptin-10-kiss1-fragment-identity",
        "Kisspeptin-10 Identity",
        "Kisspeptin-10 is the C-terminal KISS1 decapeptide amide in the public literature. Lot identity is the observed mass and sequence on the COA when issued.",
        "Kisspeptin-10 Is the C-Terminal KISS1 Decapeptide Amide",
    ),
})


def title_for(rec):
    return rec["topic"] + SUFFIX


def validate():
    errors = []
    titles = {}
    descs = {}
    for path, rec in sorted(PAGES.items()):
        t = title_for(rec)
        d = rec["description"]
        if len(t) > 60:
            errors.append(f"{path}: title {len(t)} > 60: {t!r}")
        if not t.endswith(SUFFIX):
            errors.append(f"{path}: title missing suffix")
        if not (140 <= len(d) <= 160):
            errors.append(f"{path}: desc {len(d)} not in 140-160: {d!r}")
        if t in titles:
            errors.append(f"{path}: duplicate title with {titles[t]}")
        titles[t] = path
        if d in descs:
            errors.append(f"{path}: duplicate desc with {descs[d]}")
        descs[d] = path
        if rec["canonical"].endswith(".html") or "?" in rec["canonical"]:
            errors.append(f"{path}: dirty canonical {rec['canonical']}")
        if rec["og_type"] not in {"website", "article", "product"}:
            errors.append(f"{path}: bad og:type")
    return errors
