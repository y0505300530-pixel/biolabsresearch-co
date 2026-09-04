/* cart vial + compact add-more pinned at bottom, horizontal scroll */
(function(){
  if (document.getElementById('cart-addmore-css')) return;
  var s = document.createElement('style');
  s.id = 'cart-addmore-css';
  s.textContent = [
    '#cartAddMore,.cart-addmore-slot{flex:0 0 auto;background:#fff;border-top:1px solid #eee;max-width:100%;overflow:hidden}',
    '#cartAddMore:empty,.cart-addmore-slot:empty{display:none}',
    '.cart-addmore{margin:0;padding:12px 0 4px;border:0}',
    '.cart-addmore-title{text-align:center;font-size:15px;font-weight:800;margin:0 0 10px;padding:0 16px;color:#1a3a2a}',
    '.cart-addmore-track{display:flex !important;flex-wrap:nowrap !important;gap:8px !important;overflow-x:scroll !important;overflow-y:hidden !important;-webkit-overflow-scrolling:touch;touch-action:pan-x;overscroll-behavior-x:contain;padding:0 16px 14px;scrollbar-width:thin}',
    '.cart-addcard{flex:0 0 110px !important;width:110px !important;min-width:110px !important;max-width:110px !important;box-sizing:border-box !important;background:#f3f7f4 !important;border-radius:22px !important;padding:10px 8px 12px !important;text-align:center !important;display:flex !important;flex-direction:column !important;align-items:center !important;gap:6px !important}',
    '.cart-addcard{padding:0 0 12px !important;overflow:hidden !important}',
    '.cart-addcard a{display:block !important;width:100% !important;line-height:0 !important}',
    '.cart-addcard img,.cart-addmore .cart-addcard img{width:100% !important;height:96px !important;max-width:none !important;max-height:none !important;object-fit:cover !important;object-position:center 38% !important;background:#f3f7f4 !important;border-radius:0 !important}',
    '.cart-addcard-name{font-size:11px !important;font-weight:700 !important;line-height:1.2 !important;color:#1F1F1F !important;min-height:28px}',
    '.cart-addcard-price{font-size:16px !important;font-weight:800 !important;color:#2a9a7a !important}',
    '.cart-addcard-btn{background:#fff !important;color:#111 !important;border:1.5px solid #111 !important;border-radius:999px !important;padding:5px 16px !important;font-size:12px !important;font-weight:700 !important;cursor:pointer}',
    '.cart-addmore-row,.cart-addmore-all,.cart-addmore-btn,.cart-addmore-info{display:none !important}'
  ].join('');
  (document.head || document.documentElement).appendChild(s);
})();
function productSlug(item){
  var slug = (item && item.slug) ? String(item.slug) : '';
  if (!slug && item && item.name) {
    var n = String(item.name).toLowerCase().replace(/\s*\(.*\)\s*$/,'').trim();
    var map = {'bpc-157 / tb-500 blend':'bpc-157-tb-500-blend','bpc-157':'bpc-157','nad+':'nad-plus','aod-9604':'aod-9604','curcumin phytosome':'curcumin-phytosome','tesamorelin / ipamorelin':'tesamorelin-ipamorelin','glow 70':'glow-70','epithalon':'epithalon','ghk-cu':'ghk-cu','mots-c':'mots-c','kpv':'kpv','semax':'semax','kisspeptin-10':'kisspeptin-10','thymosin alpha-1':'thymosin-alpha-1','tb-500':'tb-500','retatrutide':'retatrutide','r3ta':'retatrutide'};
    slug = map[n] || n.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  return slug;
}
function productUrl(item){
  if (item && item.gift) return '#';
  var slug = (typeof item === 'string') ? item : productSlug(item);
  if (!slug || slug==='research-solvent') return '#';
  return '/products/' + slug + '.html';
}
function vialImg(item){ if(item&&(item.gift||item.slug==='research-solvent')) return '/media/research-solvent.svg'; var slug=productSlug(item); var mg=((item&&item.mg)||'').toString().split(' ').join('').toLowerCase(); if(mg){ return '/media/vial-'+slug+'-'+mg+'.webp?v=95'; } return '/media/vial-'+slug+'.webp?v=95'; }
var CART_SUGGEST = [
  {slug:'bpc-157', name:'BPC-157', price:89},
  {slug:'tb-500', name:'TB-500', price:99},
  {slug:'bpc-157-tb-500-blend', name:'BPC-157 / TB-500 Blend', price:125},
  {slug:'nad-plus', name:'NAD+', price:99},
  {slug:'ghk-cu', name:'GHK-Cu', price:69},
  {slug:'aod-9604', name:'AOD-9604', price:85},
  {slug:'glow-70', name:'GLOW 70', price:139},
  {slug:'epithalon', name:'Epithalon', price:79},
  {slug:'mots-c', name:'MOTS-c', price:95},
  {slug:'kpv', name:'KPV', price:79},
  {slug:'semax', name:'Semax', price:89},
  {slug:'kisspeptin-10', name:'Kisspeptin-10', price:99},
  {slug:'thymosin-alpha-1', name:'Thymosin Alpha-1', price:109},
  {slug:'tesamorelin-ipamorelin', name:'Tesamorelin / Ipamorelin', price:119},
  {slug:'curcumin-phytosome', name:'Curcumin Phytosome', price:109},
  {slug:'retatrutide', name:'R3TA', price:139}
];
function addMoreHtml(cart){
  cart = cart || [];
  var have = {};
  cart.forEach(function(i){ have[(i.slug||'')]=1; have[String(i.name||'').toLowerCase()]=1; });
  var list = CART_SUGGEST.filter(function(p){ return !have[p.slug] && !have[p.name.toLowerCase()]; });
  if (!list.length) return '';
  var html = '<div class="cart-addmore"><div class="cart-addmore-title">Add to this order</div><div class="cart-addmore-track">';
  list.forEach(function(p){
    html += '<div class="cart-addcard">' +
      '<a href="/products/' + p.slug + '.html"><img src="/media/vial-' + p.slug + '.webp?v=94" alt="' + p.name + '" width="110" height="96"></a>' +
      '<div class="cart-addcard-name">' + p.name + '</div>' +
      '<div class="cart-addcard-price">$' + p.price + '</div>' +
      '<button type="button" class="cart-addcard-btn" onclick="addSuggest(\'' + p.slug + '\',\'' + p.name.replace(/'/g,'') + '\',' + p.price + ')">Add</button>' +
    '</div>';
  });
  html += '</div></div>';
  return html;
}
function mountAddMore(cart){
  var html = (cart && cart.length) ? addMoreHtml(cart) : '';
  var slot = document.getElementById('cartAddMore');
  if (slot) {
    slot.innerHTML = html;
    slot.style.display = html ? 'block' : 'none';
    return '';
  }
  return html;
}
function addSuggest(slug, name, price){
  if (typeof getCart === 'function') {
    var c = getCart();
    var ex = c.find(function(i){ return i.slug===slug || i.name===name; });
    if (ex) ex.qty += 1;
    else c.push({name:name, price:price, qty:1, slug:slug, imageUrl:'/media/vial-'+slug+'.webp?v=94'});
    if (typeof saveCart === 'function') {
      try { saveCart(c); } catch (e) { saveCart(); }
    }
    if (typeof updateBadge === 'function') updateBadge();
    if (typeof renderCart === 'function') renderCart();
    if (typeof renderSummary === 'function') renderSummary();
    return;
  }
  if (typeof cart !== 'undefined') {
    var ex2 = cart.find(function(i){ return i.slug===slug || i.name===name; });
    if (ex2) ex2.qty += 1;
    else cart.push({name:name, price:price, qty:1, slug:slug, imageUrl:'/media/vial-'+slug+'.webp?v=94'});
    if (typeof saveCart === 'function') saveCart();
    if (typeof renderCart === 'function') renderCart();
    if (typeof renderSummary === 'function') renderSummary();
  }
}

/* gold cart burst: short on every Add, big at 2 and 3 unique lines. no VIP copy. */
(function(){
  var lastX = 0, lastY = 0;
  document.addEventListener('click', function(e){
    lastX = e.clientX; lastY = e.clientY;
  }, true);

  function lines(){
    try {
      if (typeof cart !== 'undefined' && Array.isArray(cart)) return cart.length;
      var c = JSON.parse(localStorage.getItem('biolabs_cart')||localStorage.getItem('biofirst_cart') || '[]');
      return Array.isArray(c) ? c.length : 0;
    } catch (e) { return 0; }
  }

  function layer(){
    var el = document.getElementById('cartBurstLayer');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'cartBurstLayer';
    el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden';
    document.body.appendChild(el);
    return el;
  }

  function spark(x, y, big){
    var n = big ? 36 : 14;
    var hold = layer();
    var originX = x || (window.innerWidth - 48);
    var originY = y || 28;
    if (!x && lastX) { originX = lastX; originY = lastY; }
    for (var i = 0; i < n; i++){
      var d = document.createElement('span');
      var ang = (Math.PI * 2 * i) / n + (Math.random() * 0.4);
      var dist = (big ? 90 : 46) + Math.random() * (big ? 80 : 36);
      var size = (big ? 7 : 5) + Math.random() * (big ? 7 : 4);
      d.style.cssText = 'position:absolute;left:'+originX+'px;top:'+originY+'px;width:'+size+'px;height:'+size+'px;margin:'+(-size/2)+'px 0 0 '+(-size/2)+'px;border-radius:50%;background:#F2D191;box-shadow:0 0 10px rgba(242,209,145,.9);opacity:1;transform:translate(0,0) scale(1);transition:transform .55s cubic-bezier(.12,.7,.22,1),opacity .55s linear';
      hold.appendChild(d);
      (function(node, dx, dy, delay){
        setTimeout(function(){
          node.style.transform = 'translate('+dx+'px,'+dy+'px) scale(0.2)';
          node.style.opacity = '0';
        }, delay);
        setTimeout(function(){ if (node.parentNode) node.parentNode.removeChild(node); }, 700 + delay);
      })(d, Math.cos(ang)*dist, Math.sin(ang)*dist, i % 3 * 20);
    }
    if (big){
      var ring = document.createElement('span');
      ring.style.cssText = 'position:absolute;left:'+originX+'px;top:'+originY+'px;width:18px;height:18px;margin:-9px 0 0 -9px;border:2px solid #F2D191;border-radius:50%;opacity:.95;transform:scale(.4);transition:transform .6s ease-out,opacity .6s linear';
      hold.appendChild(ring);
      setTimeout(function(){ ring.style.transform='scale(7)'; ring.style.opacity='0'; }, 20);
      setTimeout(function(){ if (ring.parentNode) ring.parentNode.removeChild(ring); }, 720);
    }
  }

  window.cartGoldBurst = function(kind){
    spark(lastX, lastY, kind === 'big');
  };

  function afterAdd(before){
    var n = lines();
    var big = (n === 2 && before < 2) || (n === 3 && before < 3);
    spark(lastX, lastY, big);
  }

  function wrap(name){
    var fn = window[name];
    if (typeof fn !== 'function' || fn.__goldBurst) return false;
    var orig = fn;
    var wrapped = function(){
      var before = lines();
      var delta = (name === 'updateQty' && arguments.length > 1) ? arguments[1] : 1;
      var r = orig.apply(this, arguments);
      if (name === 'updateQty' && delta <= 0) return r;
      afterAdd(before);
      return r;
    };
    wrapped.__goldBurst = true;
    window[name] = wrapped;
    return true;
  }

  var tries = 0;
  function hook(){
    wrap('addToCart');
    wrap('addToCartTemplate');
    wrap('addSuggest');
    wrap('updateQty');
    tries++;
    if (tries < 40) setTimeout(hook, 120);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();

/* cart volume progress — $100 / $250 / $375 / $500, Marketing copy, no Fluid */
(function(){
  var TIERS = [
    { at: 100, prize: '5% off this inquiry + research solvent' },
    { at: 250, prize: '10% off this inquiry' },
    { at: 375, prize: 'Priority cold-chain packing' },
    { at: 500, prize: '15% off this inquiry' }
  ];
  var lastTier = -1;

  var GIFT = {id:'17',name:'Research solvent (BAC water)',price:0,qty:1,slug:'research-solvent',gift:true,mg:'10mL',badge:'Gift',note:'Laboratory use only'};
  var giftLock = false;
  function readCart(){
    try {
      var ls = JSON.parse(localStorage.getItem('biolabs_cart')||localStorage.getItem('biofirst_cart')||'[]');
      if (Array.isArray(ls) && ls.length) return ls;
      if (typeof cart !== 'undefined' && Array.isArray(cart) && cart.length) return cart.slice();
      return Array.isArray(ls) ? ls : [];
    } catch(e){ return []; }
  }
  function syncGifts(){
    if (giftLock) return;
    var c = readCart();
    var merch = 0;
    c.forEach(function(i){ if(!i.gift) merch += (parseFloat(i.price)||0)*(i.qty||1); });
    var has = c.some(function(i){ return i.slug==='research-solvent' || i.gift; });
    var want = merch >= 100;
    if (want === has) return;
    giftLock = true;
    if (want) c.push(GIFT);
    else c = c.filter(function(i){ return !(i.gift || i.slug==='research-solvent'); });
    try { localStorage.setItem('biolabs_cart', JSON.stringify(c)); } catch(e){}
    if (typeof cart !== 'undefined') cart = c;
    if (typeof saveCart === 'function') {
      try { saveCart(c); } catch(e) { try { saveCart(); } catch(e2){} }
    }
    giftLock = false;
  }

  function css(){
    if (document.getElementById('cart-progress-css')) return;
    var s = document.createElement('style');
    s.id = 'cart-progress-css';
    s.textContent = [
      '#cartProgress{display:none;margin:0;padding:14px 18px 16px;background:linear-gradient(180deg,#FBF6EA 0%,#F4EFE4 100%);border-bottom:1px solid #eadfca}',
      '#cartProgress.on{display:block}',
      '.cp-kicker{font-size:11px;font-weight:800;letter-spacing:.12em;color:#0d2137;margin:0 0 6px;text-transform:uppercase}',
      '.cp-msg{font-size:14px;font-weight:700;color:#0d2137;line-height:1.3;margin:0 0 12px}',
      '.cp-msg em{font-style:normal;color:#9A6D2A}',
      '.cp-track{position:relative;height:10px;border-radius:999px;background:#e6dcc8;overflow:visible;margin:8px 6px 18px}',
      '.cp-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#E8C57A,#F2D191 40%,#C9A46A);width:0;transition:width .45s cubic-bezier(.2,.7,.2,1);box-shadow:0 0 12px rgba(242,209,145,.55)}',
      '.cp-ticks{position:absolute;inset:0;pointer-events:none}',
      '.cp-tick{position:absolute;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#fff;border:2px solid #c9b48a;box-sizing:border-box;transition:background .2s,border-color .2s,transform .2s}',
      '.cp-tick.on{background:#0d2137;border-color:#0d2137;transform:scale(1.08)}',
      '.cp-tick .lbl{position:absolute;top:18px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;color:#6b6254;white-space:nowrap}',
      '.cp-tick.on .lbl{color:#0d2137}',
      '.cp-unlocked{margin:2px 0 0;font-size:12px;color:#4a6358}'
    ].join('');
    (document.head||document.documentElement).appendChild(s);
  }

  function cartTotal(){
    var c = [];
    try {
      if (typeof cart !== 'undefined' && Array.isArray(cart)) c = cart;
      else c = JSON.parse(localStorage.getItem('biolabs_cart')||localStorage.getItem('biofirst_cart')||'[]');
    } catch(e){ c = []; }
    return c.reduce(function(a,i){ if(i&&i.gift) return a; return a + (parseFloat(i.price)||0) * (i.qty||1); }, 0);
  }

  function state(total){
    var unlocked = null, next = null, idx = -1;
    for (var i=0;i<TIERS.length;i++){
      if (total >= TIERS[i].at){ unlocked = TIERS[i]; idx = i; }
      else { next = TIERS[i]; break; }
    }
    var pct = Math.min(100, (total / 500) * 100);
    var msg;
    if (next){
      var need = Math.max(0, Math.ceil(next.at - total));
      msg = 'Add $' + need + ' more for ' + next.prize;
    } else {
      msg = '15% off this inquiry unlocked';
    }
    return { total: total, pct: pct, unlocked: unlocked, next: next, idx: idx, msg: msg };
  }

  function ensure(){
    var drawer = document.getElementById('cartDrawer');
    if (!drawer) return null;
    var el = document.getElementById('cartProgress');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'cartProgress';
    var header = drawer.querySelector('.cart-header');
    if (header && header.nextSibling) drawer.insertBefore(el, header.nextSibling);
    else drawer.insertBefore(el, drawer.firstChild);
    return el;
  }

  function paint(){
    syncGifts();
    css();
    var el = ensure();
    if (!el) return;
    var st = state(cartTotal());
    if (st.total <= 0){
      el.className = '';
      el.innerHTML = '';
      lastTier = -1;
      try { localStorage.removeItem('biolabs_volume');try{localStorage.removeItem('biofirst_volume');}catch(_e){}; } catch(e){}
      return;
    }
    el.className = 'on';
    var ticks = TIERS.map(function(t,i){
      var left = (t.at / 500) * 100;
      return '<span class="cp-tick'+(st.total>=t.at?' on':'')+'" style="left:'+left+'%"><span class="lbl">$'+t.at+'</span></span>';
    }).join('');
    var unlockedLine = st.unlocked ? '<p class="cp-unlocked">Unlocked: '+st.unlocked.prize+'</p>' : '';
    el.innerHTML =
      '<p class="cp-kicker">Inquiry rewards</p>'+
      '<p class="cp-msg">'+st.msg.replace(/(\$\d+)/g,'<em>$1</em>')+'</p>'+
      '<div class="cp-track"><div class="cp-fill" style="width:'+st.pct+'%"></div><div class="cp-ticks">'+ticks+'</div></div>'+
      unlockedLine;
    try {
      localStorage.setItem('biolabs_volume', JSON.stringify({
        total: Math.round(st.total*100)/100,
        prize: st.unlocked ? st.unlocked.prize : null,
        at: st.unlocked ? st.unlocked.at : 0
      }));
    } catch(e){}
    if (st.idx > lastTier && lastTier !== -1 && window.cartGoldBurst){
      window.cartGoldBurst('big');
    }
    lastTier = st.idx;
  }

  function wrapRender(){
    if (typeof renderCart === 'function' && !renderCart.__progress){
      var orig = renderCart;
      var wrapped = function(){
        var r = orig.apply(this, arguments);
        paint();
        return r;
      };
      wrapped.__progress = true;
      window.renderCart = wrapped;
    }
    paint();
  }
  var n = 0;
  function hook(){
    wrapRender();
    n++;
    if (n < 40) setTimeout(hook, 120);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();


/* paint cart badge on every page; legal pages have no drawer so cart goes to checkout */
(function(){
  function qty(){
    try {
      var c = JSON.parse(localStorage.getItem('biolabs_cart')||localStorage.getItem('biofirst_cart')||'[]');
      return (c||[]).reduce(function(a,i){ return a + (parseInt(i.qty,10)||0); }, 0);
    } catch(e){ return 0; }
  }
  function paint(){
    var el = document.getElementById('cartCount');
    if (el) el.textContent = String(qty());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
  window.addEventListener('storage', paint);
  if (typeof window.toggleCart !== 'function') {
    window.toggleCart = function(){ window.location.href = '/checkout.html'; };
  }
  if (typeof window.toggleMenu !== 'function') {
    window.toggleMenu = function(){
      var m = document.getElementById('navMenu');
      var o = document.getElementById('navOverlay');
      if (m) m.classList.toggle('open');
      if (o) o.classList.toggle('open');
    };
  }
})();
