// BioLabs Research — Enhanced Product Schema
// Enhances existing Product JSON-LD with additional fields for better SEO
(function() {
  var el = document.getElementById('product-jsonld');
  if (!el) return;
  try {
    var data = JSON.parse(el.textContent);
    
    // Add category if not present
    if (!data.category) {
      var catEl = document.querySelector('[data-category]');
      if (catEl) data.category = catEl.getAttribute('data-category');
    }
    
    // Add SKU from product slug (from URL)
    if (!data.sku) {
      var path = window.location.pathname;
      var slug = path.split('/').pop().replace('.html', '');
      data.sku = 'BLR-' + slug.toUpperCase().replace(/-/g, '');
    }
    
    // Add brand URL
    if (data.brand && !data.brand.url) {
      data.brand.url = 'https://biolabsresearch.co';
    }
    
    // Add manufacturer
    if (!data.manufacturer) {
      data.manufacturer = {
        "@type": "Organization",
        "name": "LEEDS MARKETING GROUP LTD",
        "alternateName": "BioLabs Research"
      };
    }
    
    // Add offer details
    if (data.offers) {
      if (!data.offers.itemCondition) {
        data.offers.itemCondition = "https://schema.org/NewCondition";
      }
      if (!data.offers.priceValidUntil) {
        data.offers.priceValidUntil = "2026-12-31";
      }
      if (!data.offers.shippingDetails) {
        data.offers.shippingDetails = {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "US"
          }
        };
      }
      if (!data.offers.seller) {
        data.offers.seller = {
          "@type": "Organization",
          "name": "BioLabs Research"
        };
      }
    }
    
    // Add product ID (MPN)
    if (!data.mpn) {
      data.mpn = data.sku;
    }
    
    el.textContent = JSON.stringify(data);
  } catch(e) {}
})();
