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
    '.cart-addcard img,.cart-addmore .cart-addcard img{width:64px !important;height:64px !important;max-width:64px !important;max-height:64px !important;object-fit:contain !important;background:transparent !important;border-radius:0 !important}',
    '.cart-addcard-name{font-size:11px !important;font-weight:700 !important;line-height:1.2 !important;color:#1F1F1F !important;min-height:28px}',
    '.cart-addcard-price{font-size:16px !important;font-weight:800 !important;color:#2a9a7a !important}',
    '.cart-addcard-btn{background:#fff !important;color:#111 !important;border:1.5px solid #111 !important;border-radius:999px !important;padding:5px 16px !important;font-size:12px !important;font-weight:700 !important;cursor:pointer}',
    '.cart-addmore-row,.cart-addmore-all,.cart-addmore-btn,.cart-addmore-info{display:none !important}'
  ].join('');
  (document.head || document.documentElement).appendChild(s);
})();
function vialImg(item){
  var slug = (item && item.slug) ? String(item.slug) : '';
  if (!slug && item && item.name) {
    var n = String(item.name).toLowerCase().replace(/\s*\(.*\)\s*$/,'').trim();
    var map = {'bpc-157 / tb-500 blend':'bpc-157-tb-500-blend','bpc-157':'bpc-157','nad+':'nad-plus','aod-9604':'aod-9604','curcumin phytosome':'curcumin-phytosome','tesamorelin / ipamorelin':'tesamorelin-ipamorelin','glow 70':'glow-70','epithalon':'epithalon','ghk-cu':'ghk-cu','mots-c':'mots-c','kpv':'kpv','semax':'semax','kisspeptin-10':'kisspeptin-10','thymosin alpha-1':'thymosin-alpha-1','tb-500':'tb-500','retatrutide':'retatrutide'};
    slug = map[n] || n.replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }
  return '/media/vial-' + slug + '.webp?v=73';
}
var CART_SUGGEST = [
  {slug:'bpc-157', name:'BPC-157', price:110},
  {slug:'tb-500', name:'TB-500', price:120},
  {slug:'bpc-157-tb-500-blend', name:'BPC-157 / TB-500 Blend', price:185},
  {slug:'nad-plus', name:'NAD+', price:120},
  {slug:'ghk-cu', name:'GHK-Cu', price:105},
  {slug:'aod-9604', name:'AOD-9604', price:95},
  {slug:'glow-70', name:'GLOW 70', price:180},
  {slug:'epithalon', name:'Epithalon', price:125},
  {slug:'mots-c', name:'MOTS-c', price:140},
  {slug:'kpv', name:'KPV', price:95},
  {slug:'semax', name:'Semax', price:110},
  {slug:'kisspeptin-10', name:'Kisspeptin-10', price:130},
  {slug:'thymosin-alpha-1', name:'Thymosin Alpha-1', price:150},
  {slug:'tesamorelin-ipamorelin', name:'Tesamorelin / Ipamorelin', price:155},
  {slug:'curcumin-phytosome', name:'Curcumin Phytosome', price:140},
  {slug:'retatrutide', name:'Retatrutide', price:195}
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
      '<img src="/media/vial-' + p.slug + '.webp?v=73" alt="' + p.name + '" width="64" height="64">' +
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
    else c.push({name:name, price:price, qty:1, slug:slug, imageUrl:'/media/vial-'+slug+'.webp?v=73'});
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
    else cart.push({name:name, price:price, qty:1, slug:slug, imageUrl:'/media/vial-'+slug+'.webp?v=73'});
    if (typeof saveCart === 'function') saveCart();
    if (typeof renderCart === 'function') renderCart();
    if (typeof renderSummary === 'function') renderSummary();
  }
}
