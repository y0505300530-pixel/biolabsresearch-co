/* pdp story blocks - RUO, our catalog only */
(function(){
  var RELATED = {
    "bpc-157": ["tb-500","bpc-157-tb-500-blend","ghk-cu"],
    "tb-500": ["bpc-157","bpc-157-tb-500-blend","thymosin-alpha-1"],
    "bpc-157-tb-500-blend": ["bpc-157","tb-500","tesamorelin-ipamorelin"],
    "nad-plus": ["mots-c","aod-9604","epithalon"],
    "ghk-cu": ["bpc-157","kpv","glow-70"],
    "aod-9604": ["tesamorelin-ipamorelin","nad-plus","retatrutide"],
    "glow-70": ["ghk-cu","bpc-157","epithalon"],
    "epithalon": ["mots-c","nad-plus","ghk-cu"],
    "mots-c": ["nad-plus","epithalon","aod-9604"],
    "kpv": ["ghk-cu","semax","bpc-157"],
    "semax": ["kpv","kisspeptin-10","thymosin-alpha-1"],
    "kisspeptin-10": ["semax","tesamorelin-ipamorelin","kpv"],
    "thymosin-alpha-1": ["tb-500","epithalon","semax"],
    "tesamorelin-ipamorelin": ["aod-9604","bpc-157-tb-500-blend","kisspeptin-10"],
    "curcumin-phytosome": ["ghk-cu","nad-plus","epithalon"],
    "retatrutide": ["aod-9604","mots-c","nad-plus"]
  };
  var NAMES = {
    "bpc-157":"BPC-157","tb-500":"TB-500","bpc-157-tb-500-blend":"BPC-157 / TB-500 Blend",
    "nad-plus":"NAD+","ghk-cu":"GHK-Cu","aod-9604":"AOD-9604","glow-70":"GLOW 70",
    "epithalon":"Epithalon","mots-c":"MOTS-c","kpv":"KPV","semax":"Semax",
    "kisspeptin-10":"Kisspeptin-10","thymosin-alpha-1":"Thymosin Alpha-1",
    "tesamorelin-ipamorelin":"Tesamorelin / Ipamorelin","curcumin-phytosome":"Curcumin Phytosome",
    "retatrutide":"R3TA"
  };
  var STEPS = {
    "bpc-157": [
      ["The compound","Pentadecapeptide","GEPPPGKPADDAGLV. CAS 137525-51-0. A published gastric-derived fragment, not a wound protocol."],
      ["In the literature","Signaling models","Used in cell and tissue models of cytoprotection and angiogenesis signaling."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Peak area and net content sit on the lot COA when a file is issued."]
    ],
    "tb-500": [
      ["The compound","Tβ4 fragment listing","Catalog name for a thymosin-beta-4 fragment (commonly Ac-LKKTETQ). Fragment CAS is not intact Tβ4."],
      ["In the literature","Cytoskeleton models","Appears in actin-binding and cell-migration literature as a Tβ4 fragment listing."],
      ["This listing","Lyophilized reagent","Identity is the sequence on the lot COA when issued. No healing protocol on this page."]
    ],
    "bpc-157-tb-500-blend": [
      ["The compound","Two named peptides","BPC-157 (GEPPPGKPADDAGLV, CAS 137525-51-0) plus a TB-500 / Tβ4 fragment listing (commonly Ac-LKKTETQ)."],
      ["In the literature","Two research listings","Each compound is a published research peptide. Per-compound amounts belong on the lot document."],
      ["This listing","One blend SKU","One lyophilized vial. Ratio and fill weight are lot data, not guessed here."]
    ],
    "nad-plus": [
      ["The compound","NAD+ cofactor","Nicotinamide adenine dinucleotide, CAS 53-84-9. Formula C21H27N7O14P2."],
      ["In the literature","Enzyme assays","Published redox cofactor used in dehydrogenase and NAD-consuming enzyme assays."],
      ["This listing","Lyophilized reagent","Biochemical reference material. Not a supplement claim. Lot data on the COA when issued."]
    ],
    "ghk-cu": [
      ["The compound","GHK-Cu complex","Copper(II) complex of the tripeptide Gly-His-Lys. CAS 89030-95-5."],
      ["In the literature","Matrix models","Used in extracellular-matrix and copper-binding research. Not a cosmetic treatment."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Identity and content on the lot COA when a file is issued."]
    ],
    "aod-9604": [
      ["The compound","hGH 177–191 fragment","C-terminal fragment of human growth hormone. CAS 221231-10-3. Not intact GH."],
      ["In the literature","Lipid-metabolism models","Appears as a fragment listing in published lipid-metabolism research."],
      ["This listing","Lyophilized reagent","Research fragment only. Not growth-hormone replacement. Lot data on the COA when issued."]
    ],
    "glow-70": [
      ["The compound","Named blend SKU","GLOW 70 is a catalog name. This page does not invent a three-peptide recipe or a ratio."],
      ["In the literature","Label identity","Identity is the names printed on the vial and the lot COA when a file is issued."],
      ["This listing","Lyophilized reagent","Research blend in a BIO LABS vial. Not a cosmetic treatment."]
    ],
    "epithalon": [
      ["The compound","Tetrapeptide AEDG","Ala-Glu-Asp-Gly. CAS 307297-39-8. Also listed as epitalon."],
      ["In the literature","Pineal models","Appears in pineal and telomerase-related laboratory literature. Not an anti-aging drug."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Lot documentation on request."]
    ],
    "mots-c": [
      ["The compound","Mitochondrial peptide","MRWQEMGYIFYPRKLR. CAS 1627580-64-6. A mitochondrial open-reading-frame peptide."],
      ["In the literature","Metabolic signaling","Studied in metabolic signaling models. Not a metabolic drug."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Peak area and net content on the lot COA when issued."]
    ],
    "kpv": [
      ["The compound","Tripeptide KPV","Lys-Pro-Val, a C-terminal fragment of alpha-MSH. CAS 67747-97-3."],
      ["In the literature","Melanocortin pathway","Used in melanocortin-pathway research. Not an anti-inflammatory medicine."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Identity on the lot COA when a file is issued."]
    ],
    "semax": [
      ["The compound","Heptapeptide MEHFPGP","An ACTH(4-10) analogue. CAS 80714-61-0."],
      ["In the literature","CNS signaling","Appears in CNS signaling models in the literature. Not a nootropic product."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Lot documentation on request."]
    ],
    "kisspeptin-10": [
      ["The compound","Decapeptide ligand","YNWNSFGLRF-NH2, a published KISS1R ligand. CAS 374675-21-5."],
      ["In the literature","Receptor research","Used in reproductive-axis receptor research. Not a fertility treatment."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Identity on the lot COA when a file is issued."]
    ],
    "thymosin-alpha-1": [
      ["The compound","Thymic peptide","Acetylated 28-residue thymic peptide. CAS 62304-98-7."],
      ["In the literature","Immune signaling","Appears in immune-signaling literature. Not an immunotherapy."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Lot documentation on request."]
    ],
    "tesamorelin-ipamorelin": [
      ["The compound","Two named analogues","Tesamorelin (GHRH analogue, CAS 218949-48-5) and Ipamorelin (GHS-R agonist, CAS 170851-70-4)."],
      ["In the literature","GH-axis models","Used in GH-axis signaling research. Not a secretagogue therapy."],
      ["This listing","One blend SKU","Lyophilized research blend. Ratio and fill weight are lot data, not guessed here."]
    ],
    "curcumin-phytosome": [
      ["The compound","Curcumin phytosome","Diferuloylmethane, CAS 458-37-7, in a phospholipid phytosome research formulation."],
      ["In the literature","Polyphenol pathways","Used in laboratory studies of polyphenol pathways. Not a dietary supplement."],
      ["This listing","Research formulation","BIO LABS listing. This page does not claim a licensed clinical product."]
    ],
    "retatrutide": [
      ["The compound","Triple agonist","R3TA (retatrutide, LY3437943). Published agonist at GIP, GLP-1, and glucagon receptors. CAS 2381089-83-2."],
      ["In the literature","Incretin assays","Research reagent for incretin-pathway assays. Not a weight-loss product."],
      ["This listing","Lyophilized reagent","BIO LABS vial, research use only. Lot documentation on request."]
    ]
  };
  function expectBlock(slug, name){
    var steps = STEPS[slug] || [
      ["The compound", name, "Named research reagent. Public identity is on this page."],
      ["In the literature", "Laboratory use", "Used as a research listing. Not a medicine and no dose on this page."],
      ["This listing", "Lyophilized reagent", "BIO LABS vial, research use only. Lot data on the COA when a file is issued."]
    ];
    var lis = steps.map(function(s, i){
      return '<li><div class="pdp-step-card"><p class="pdp-step-when">'+s[0]+'</p><h3>'+s[1]+'</h3><p>'+s[2]+'</p></div><span class="pdp-step-num">'+(i+1)+'</span></li>';
    }).join("");
    return ''
      + '<div class="pdp-expect-wrap">'
      + '<div class="pdp-trustbar" aria-label="Listing facts">'
      + '<span>COA on request</span><i></i><span>Cold-chain dispatch</span><i></i><span>Research use only</span>'
      + '</div>'
      + '<div class="pdp-expect">'
      + '<div class="pdp-expect-visual">'
      + '<img class="pdp-body-sketch" src="/media/pdp-body-wire.webp?v=130" alt="">'
      + '</div>'
      + '<div class="pdp-expect-col">'
      + '<h2>What to expect</h2>'
      + '<ol class="pdp-steps">'+lis+'</ol>'
      + '</div></div></div>';
  }
  window.pdpStoryHtml = function(p){
    var slug = (p && p.slug) ? p.slug : "";
    var name = (p && p.name) ? p.name : (NAMES[slug]||"This reagent");
    var rel = RELATED[slug] || ["bpc-157","tb-500","nad-plus"];
    var PRICE = {"bpc-157":110,"tb-500":120,"bpc-157-tb-500-blend":185,"nad-plus":120,"ghk-cu":105,"aod-9604":95,"glow-70":180,"epithalon":125,"mots-c":140,"kpv":95,"semax":110,"kisspeptin-10":130,"thymosin-alpha-1":150,"tesamorelin-ipamorelin":155,"curcumin-phytosome":140,"retatrutide":195};
    var figHplc = '<svg class="pdp-doc-fig" viewBox="0 0 220 88" aria-hidden="true"><path d="M4 80 C18 78 28 74 36 70 C48 28 52 22 60 78 C72 76 88 72 96 68 C110 12 118 10 128 76 C150 74 170 70 216 80" fill="none" stroke="#c4a574" stroke-width="2.4" stroke-linecap="round"/></svg>';
    var figMs = '<svg class="pdp-doc-fig" viewBox="0 0 220 88" aria-hidden="true"><path d="M18 80 V52 M40 80 V36 M58 80 V70 M86 80 V18 M108 80 V58 M132 80 V42 M158 80 V28 M184 80 V64 M204 80 V50" fill="none" stroke="#c4a574" stroke-width="3.2" stroke-linecap="round"/></svg>';
    var figCoa = '<svg class="pdp-doc-fig" viewBox="0 0 220 88" aria-hidden="true"><rect x="58" y="8" width="104" height="72" rx="6" fill="#fff" stroke="#c4a574" stroke-width="1.6"/><path d="M74 28h72M74 40h72M74 52h48" stroke="#d9c7a2" stroke-width="3" stroke-linecap="round"/><circle cx="148" cy="62" r="10" fill="#c4a574"/></svg>';
    var also = rel.map(function(s){
      var pr = PRICE[s] ? '<span class="pdp-also-price">$'+PRICE[s]+'</span>' : '';
      return '<a class="pdp-also-card" href="/products/'+s+'">'
        + '<img src="/media/vial-'+s+'.webp?v=130" alt="'+NAMES[s]+'">'
        + '<strong>'+NAMES[s]+'</strong>'
        + pr
        + '<span class="pdp-also-view">View</span></a>';
    }).join("");
    var esc = String(name).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return ''
      + expectBlock(slug, name)
      + '<section class="pdp-docs-wrap">'
      + '<div class="pdp-docs-inner">'
      + '<h2>Lot documentation</h2>'
      + '<p class="pdp-lead">For this '+name+' vial. Identity is public here. Peak area, observed mass, and net content sit on the matching lot COA.</p>'
      + '<div class="pdp-docs">'
      + '<article><div class="pdp-doc-art">'+figHplc+'</div><h3>HPLC chromatogram</h3><p>The '+name+' lot trace. Main-peak area at the wavelength written on the COA, when a file exists.</p></article>'
      + '<article><div class="pdp-doc-art">'+figMs+'</div><h3>Mass spectrum</h3><p>Observed mass for this listing against the named compound. Lot data, not a homepage percentage.</p></article>'
      + '<article><div class="pdp-doc-art">'+figCoa+'</div><h3>Certificate of Analysis</h3><p>Lot number, date, laboratory, and method for this '+name+' vial.</p><button type="button" class="pdp-coa-btn" onclick="openCOARequest(\''+esc+'\')">Request this lot file</button></article>'
      + '</div></div></section>'
      ;
  };
})();
