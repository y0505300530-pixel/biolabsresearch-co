/* Catalog strength select: mark chip + update card price / ATC */
(function(){
  function norm(s){ return String(s||'').replace(/\s+/g,'').toLowerCase(); }
  function pretty(s){
    var n = norm(s);
    return n.replace(/(\d+)(mg)/i, '$1 mg');
  }
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

  function pricesFor(p){
    var map = p.strength_prices || {};
    var origMap = p.strength_originals || {};
    var strengths = p.strengths || [];
    if (!strengths.length) return {prices:{}, originals:{}};
    if (Object.keys(map).length) {
      var out={}, oout={};
      strengths.forEach(function(s){
        var k = norm(s);
        out[k] = map[k] != null ? map[k] : (map[s] != null ? map[s] : p.price);
        oout[k] = origMap[k] != null ? origMap[k] : (origMap[s] != null ? origMap[s] : p.original_price);
      });
      return {prices:out, originals:oout};
    }
    var nums = strengths.map(function(s){ return parseFloat(String(s).replace(/[^\d.]/g,''))||0; });
    var maxN = Math.max.apply(null, nums.concat([1]));
    var prices={}, originals={};
    strengths.forEach(function(s,i){
      var k = norm(s);
      var ratio = maxN ? (nums[i]/maxN) : 1;
      prices[k] = strengths.length===1 ? Number(p.price) : Math.max(1, Math.round(Number(p.price)*ratio));
      originals[k] = strengths.length===1 ? Number(p.original_price||p.price) : Math.max(prices[k], Math.round(Number(p.original_price||p.price)*ratio));
    });
    return {prices:prices, originals:originals};
  }

  function priceForKey(pack,k,p){ return pack.prices[k] != null ? pack.prices[k] : p.price; }
  function origForKey(pack,k,p){ return pack.originals[k] != null ? pack.originals[k] : p.original_price; }

  function applyCard(card, p, selectedKey){
    var pack = pricesFor(p);
    var strengths = p.strengths || [];
    if (!strengths.length) return;
    if (!selectedKey) selectedKey = norm(strengths[0]);
    var price = pack.prices[selectedKey];
    var orig = pack.originals[selectedKey];
    if (price == null) price = p.price;

    var wrap = card.querySelector('.product-card-strengths');
    if (wrap) {
      wrap.innerHTML = strengths.map(function(s){
        var k = norm(s);
        var on = k === selectedKey ? ' on' : '';
        return '<button type="button" class="product-card-mg'+on+'" data-mg="'+esc(k)+'" data-price="'+esc(priceForKey(pack,k,p))+'" data-original="'+esc(origForKey(pack,k,p))+'">'+esc(pretty(s))+'</button>';
      }).join('');
    }
    var priceEl = card.querySelector('.product-card-price');
    var origEl = card.querySelector('.product-card-original');
    if (priceEl) priceEl.textContent = '$' + price;
    if (origEl) {
      if (orig && Number(orig) > Number(price)) {
        origEl.textContent = '$' + orig;
        origEl.style.display = '';
      } else {
        origEl.textContent = '';
        origEl.style.display = 'none';
      }
    }
    var atc = card.querySelector('.product-card-atc');
    if (atc) {
      atc.setAttribute('data-price', String(price));
      atc.setAttribute('data-mg', selectedKey);
    }
    card.setAttribute('data-selected-mg', selectedKey);
  }

  function bind(card, p){
    applyCard(card, p, card.getAttribute('data-selected-mg') || norm((p.strengths||[])[0]));
    card.addEventListener('click', function(e){
      var btn = e.target && e.target.closest && e.target.closest('button.product-card-mg');
      if (!btn || !card.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      applyCard(card, p, btn.getAttribute('data-mg'));
    });
  }

  function bySlug(products){
    var m = {};
    (products||[]).forEach(function(p){ if (p && p.slug) m[p.slug]=p; });
    return m;
  }

  function hydrate(products){
    var map = bySlug(products);
    document.querySelectorAll('.product-card').forEach(function(card){
      var atc = card.querySelector('.product-card-atc');
      var slug = (atc && atc.getAttribute('data-slug')) || card.getAttribute('data-slug') || '';
      var p = map[slug];
      if (!p) {
        var priceTxt = (card.querySelector('.product-card-price')||{}).textContent||'';
        var origTxt = (card.querySelector('.product-card-original')||{}).textContent||'';
        var chips = Array.prototype.map.call(card.querySelectorAll('.product-card-mg'), function(el){ return el.textContent; });
        p = {
          slug: slug,
          price: parseFloat(String(priceTxt).replace(/[^0-9.]/g,''))||0,
          original_price: parseFloat(String(origTxt).replace(/[^0-9.]/g,''))||0,
          strengths: chips
        };
      }
      if (!card.__mgBound) { card.__mgBound = 1; bind(card, p); }
      else applyCard(card, p, card.getAttribute('data-selected-mg'));
    });
  }

  function boot(products){
    hydrate(products);
    var obs = new MutationObserver(function(){ hydrate(products); });
    var grid = document.querySelector('.products-grid, #productsGrid, #productGrid, main');
    if (grid) obs.observe(grid, {childList:true, subtree:true});
  }

  fetch('/api/products').then(function(r){ return r.ok ? r.json() : []; }).then(function(d){
    var items = Array.isArray(d) ? d : (d && (d.products||d.items)) || [];
    window.__catalogProducts = items;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot(items); });
    else boot(items);
  }).catch(function(){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot([]); });
    else boot([]);
  });

  var n=0;
  (function hook(){
    if (typeof window.renderProducts === 'function' && !window.renderProducts.__mg) {
      var orig = window.renderProducts;
      window.renderProducts = function(products){
        var r = orig.apply(this, arguments);
        setTimeout(function(){ hydrate(products || window.__catalogProducts || []); }, 0);
        return r;
      };
      window.renderProducts.__mg = 1;
    }
    if (++n < 40) setTimeout(hook, 100);
  })();
})();
