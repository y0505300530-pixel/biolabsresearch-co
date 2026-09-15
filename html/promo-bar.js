/* INSIDER25 promo + countdown. Real fixed end (Asia/Jerusalem). Hide when ended — never "--:--:--" / "Offer ended". */
(function(){
  var CODE = "INSIDER25";
  var END_ISO = "2026-09-22T23:59:59+03:00";
  var END_MS = Date.parse(END_ISO);
  var LOOP_SEC = 110;
  var _raf = 0;
  var _x = 0;
  var _halfW = 0;
  var _last = 0;
  var _track = null;
  var _half = null;
  var _resizeT = 0;
  var _tickTimer = 0;

  function pad(n){ n = Math.floor(Math.max(0, n)); return (n < 10 ? "0" : "") + n; }
  function leftMs(){ return END_MS - Date.now(); }
  function format(left){
    if (left <= 0) return "00:00:00";
    var totalSec = Math.floor(left / 1000);
    var d = Math.floor(totalSec / 86400);
    var h = Math.floor((totalSec % 86400) / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (d > 0) return d + "d " + pad(h) + ":" + pad(m) + ":" + pad(s);
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  function hideEndedPromo(){
    var el = document.getElementById("promoStack");
    if (el) {
      el.style.display = "none";
      el.classList.add("promo-ended");
      el.setAttribute("hidden", "");
    }
    var stacks = document.querySelectorAll(".promo-stack");
    for (var i = 0; i < stacks.length; i++) {
      stacks[i].style.display = "none";
      stacks[i].classList.add("promo-ended");
      stacks[i].setAttribute("hidden", "");
    }
    try { stopMarquee(); } catch (e) {}
    if (_tickTimer) { clearInterval(_tickTimer); _tickTimer = 0; }
  }
  function showPromo(){
    var el = document.getElementById("promoStack");
    if (el) {
      el.style.display = "";
      el.removeAttribute("hidden");
      el.classList.remove("promo-ended");
    }
    var stacks = document.querySelectorAll(".promo-stack");
    for (var i = 0; i < stacks.length; i++) {
      stacks[i].style.display = "";
      stacks[i].removeAttribute("hidden");
      stacks[i].classList.remove("promo-ended");
    }
  }
  function tick(){
    var left = leftMs();
    if (left <= 0) {
      hideEndedPromo();
      return;
    }
    var nodes = document.querySelectorAll(".cutoff-timer");
    var text = format(left);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("data-end", END_ISO);
      nodes[i].removeAttribute("data-window");
      if (nodes[i].textContent !== text) nodes[i].textContent = text;
    }
  }
  function saveCode(){
    try { localStorage.setItem("biolabs_coupon", CODE); } catch (e) {}
  }
  function stopMarquee(){
    if (_raf) { try { cancelAnimationFrame(_raf); } catch (e) {} _raf = 0; }
  }
  function measureHalf(){
    if (!_half) return 0;
    return Math.max(1, Math.round(_half.getBoundingClientRect().width));
  }
  function frame(now){
    if (!_track || !_half) return;
    if (!_last) _last = now;
    var dt = Math.min(0.05, (now - _last) / 1000);
    _last = now;
    var halfW = _halfW || measureHalf();
    _halfW = halfW;
    var speed = halfW / LOOP_SEC;
    _x -= speed * dt;
    if (_x <= -halfW) _x += halfW;
    if (_x > 0) _x -= halfW;
    _track.style.transform = "translate3d(" + _x.toFixed(2) + "px,0,0)";
    _raf = requestAnimationFrame(frame);
  }
  function startMarquee(){
    stopMarquee();
    _track = document.querySelector(".promo-track");
    _half = _track && _track.querySelector(".promo-half");
    if (!_track || !_half) return;
    _track.style.animation = "none";
    _track.style.willChange = "transform";
    _halfW = measureHalf();
    _last = 0;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      _track.style.transform = "translate3d(0,0,0)";
      return;
    }
    _raf = requestAnimationFrame(frame);
  }
  function normalizeSeg(seg){
    if (!seg || seg.getAttribute("data-norm")==="1") return;
    var timer = seg.querySelector(".cutoff-timer");
    var codeBtn = seg.querySelector(".promo-code");
    if (!timer || !codeBtn) return;
    codeBtn.setAttribute("data-code", CODE);
    codeBtn.textContent = CODE;
    var wrap = document.createElement("span");
    wrap.className = "promo-ends-wrap";
    wrap.appendChild(document.createTextNode(" ends in "));
    wrap.appendChild(timer);
    var label = document.createTextNode("25% off — code ");
    seg.innerHTML = "";
    seg.appendChild(label);
    seg.appendChild(codeBtn);
    seg.appendChild(wrap);
    seg.setAttribute("data-norm","1");
  }
  function normalizeAll(){
    var segs = document.querySelectorAll(".promo-seg");
    for (var i=0;i<segs.length;i++) normalizeSeg(segs[i]);
  }
  function fillMarquee(){
    if (leftMs() <= 0) { hideEndedPromo(); return; }
    var track = document.querySelector(".promo-track");
    var bar = document.querySelector(".promo-bar");
    if (!track || !bar) return;
    var groups = track.querySelectorAll(".promo-group");
    if (!groups.length) return;
    var template = groups[0].cloneNode(true);
    var segs = template.querySelectorAll(".promo-seg");
    for (var si = segs.length - 1; si >= 1; si--) segs[si].parentNode.removeChild(segs[si]);
    var seps2 = template.querySelectorAll(".promo-sep");
    for (var sk = seps2.length - 1; sk >= 0; sk--) seps2[sk].parentNode.removeChild(seps2[sk]);
    var codeBtns = template.querySelectorAll(".promo-code");
    for (var ci = 0; ci < codeBtns.length; ci++) {
      codeBtns[ci].setAttribute("data-code", CODE);
      codeBtns[ci].textContent = CODE;
    }
    template.style.marginRight = "10px";
    var minW = Math.max(bar.clientWidth || 0, window.innerWidth || 0, 1200);
    track.innerHTML = "";
    track.style.animation = "none";
    track.style.display = "flex";
    track.style.alignItems = "center";
    track.style.flexWrap = "nowrap";
    track.style.width = "max-content";
    track.style.transform = "translate3d(0,0,0)";
    track.style.paddingLeft = "0";
    var halfA = document.createElement("div");
    halfA.className = "promo-half";
    halfA.style.display = "flex";
    halfA.style.alignItems = "center";
    halfA.style.flexWrap = "nowrap";
    halfA.style.flexShrink = "0";
    halfA.style.margin = "0";
    var guard = 0;
    while (halfA.scrollWidth < minW * 1.6 && guard < 32) {
      var node = template.cloneNode(true);
      node.style.marginRight = "10px";
      halfA.appendChild(node);
      guard++;
      if (!halfA.scrollWidth) break;
    }
    if (!halfA.children.length) halfA.appendChild(template.cloneNode(true));
    var halfB = halfA.cloneNode(true);
    halfB.style.margin = "0";
    track.appendChild(halfA);
    track.appendChild(halfB);
    _track = track;
    _half = halfA;
    _halfW = 0;
    normalizeAll();
    tick();
    startMarquee();
  }
  function onResize(){
    clearTimeout(_resizeT);
    _resizeT = setTimeout(function(){ try { fillMarquee(); } catch (e) {} }, 180);
  }
  function wire(){
    if (leftMs() <= 0) { hideEndedPromo(); return; }
    showPromo();
    saveCode();
    try { fillMarquee(); } catch (e) {}
    try { normalizeAll(); } catch (eN) {}
    tick();
    _tickTimer = setInterval(tick, 1000);
    window.addEventListener("resize", onResize);
    document.addEventListener("click", function(e){
      var btn = e.target && e.target.closest && e.target.closest(".promo-code");
      if (!btn) return;
      e.preventDefault();
      saveCode();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CODE);
      } catch (err) {}
      var prev = btn.textContent;
      btn.textContent = "COPIED";
      setTimeout(function(){ btn.textContent = prev; }, 1200);
    });
    try { localStorage.removeItem("cutoff_end"); } catch (e2) {}
  }
  // Expose for inline early paint
  window.__blrPromoTick = tick;
  window.__blrPromoEnd = END_ISO;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
