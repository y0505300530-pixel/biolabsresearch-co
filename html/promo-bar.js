/* INSIDER25 promo + countdown. Fixed end: 2026-09-14T23:59:59+03:00 (Asia/Jerusalem).
   Marquee is rAF-driven (not CSS animation) so live timer updates don't hitch the loop. */
(function(){
  var CODE = "INSIDER25";
  var END_ISO = "2026-09-14T23:59:59+03:00";
  var END_MS = Date.parse(END_ISO);
  var LOOP_SEC = 93;
  var _raf = 0;
  var _x = 0;
  var _halfW = 0;
  var _last = 0;
  var _track = null;
  var _half = null;
  var _resizeT = 0;

  function pad(n){ n = Math.floor(Math.max(0, n)); return (n < 10 ? "0" : "") + n; }
  function format(left){
    var h = left / 36e5, m = (left % 36e5) / 6e4, s = (left % 6e4) / 1e3;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  function tick(){
    var left = END_MS - Date.now();
    var nodes = document.querySelectorAll(".cutoff-timer");
    var i, text;
    if (left <= 0) {
      text = "Offer ended";
    } else {
      text = format(left);
    }
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("data-end", END_ISO);
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
    /* wrap without jump — exact half width */
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
    // Rebuild: "25% OFF — CODE" + button + " · " + timer (same baseline, no floating)
    var wrap = document.createElement("span");
    wrap.className = "promo-ends-wrap";
    wrap.appendChild(document.createTextNode(" · "));
    wrap.appendChild(timer);
    // clear seg and rebuild cleanly
    var label = document.createTextNode("25% OFF — CODE ");
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
    var track = document.querySelector(".promo-track");
    var bar = document.querySelector(".promo-bar");
    if (!track || !bar) return;
    var groups = track.querySelectorAll(".promo-group");
    if (!groups.length) return;
    var template = groups[0].cloneNode(true);
    // SoT CODE: always INSIDER25 on ticker pills
    var codeBtns = template.querySelectorAll('.promo-code');
    for (var ci = 0; ci < codeBtns.length; ci++) {
      codeBtns[ci].setAttribute('data-code', CODE);
      codeBtns[ci].textContent = CODE;
    }
    var segs = template.querySelectorAll('.promo-seg');
    for (var si = 0; si < segs.length; si++) {
      /* keep structure; code button already forced */
    }
    var minW = Math.max(bar.clientWidth || 0, window.innerWidth || 0, 1200);
    track.innerHTML = "";
    track.style.animation = "none";
    track.style.display = "flex";
    track.style.alignItems = "center";
    track.style.flexWrap = "nowrap";
    track.style.width = "max-content";
    track.style.transform = "translate3d(0,0,0)";

    function makeHalf(){
      var half = document.createElement("div");
      half.className = "promo-half";
      half.style.display = "flex";
      half.style.alignItems = "center";
      half.style.flex = "0 0 auto";
      half.style.flexWrap = "nowrap";
      return half;
    }
    var a = makeHalf();
    var guard = 0;
    do {
      a.appendChild(template.cloneNode(true));
      guard++;
    } while (guard < 2);
    track.appendChild(a);
    while (a.scrollWidth < minW && guard < 40) {
      a.appendChild(template.cloneNode(true));
      guard++;
    }
    var b = makeHalf();
    b.innerHTML = a.innerHTML;
    track.appendChild(b);
    try { normalizeAll(); } catch (eN2) {}
    _x = 0;
    _halfW = 0;
    startMarquee();
  }

  function wire(){
    saveCode();
    try { fillMarquee(); } catch (e) {}
    try { normalizeAll(); } catch (eN) {}
    try {
      window.addEventListener("resize", function(){
        clearTimeout(_resizeT);
        _resizeT = setTimeout(function(){
          try { fillMarquee(); } catch (e2) {}
        }, 200);
      });
    } catch (e3) {}
    try {
      localStorage.removeItem("insider25_end");
      localStorage.removeItem("promo_end");
      localStorage.removeItem("cutoff_end");
      sessionStorage.removeItem("insider25_end");
    } catch (e) {}
    var btns = document.querySelectorAll(".promo-code");
    for (var i = 0; i < btns.length; i++) {
      (function(btn){
        if (btn._wired) return;
        btn._wired = true;
        btn.addEventListener("click", function(e){
          e.preventDefault();
          e.stopPropagation();
          saveCode();
          var t = btn.getAttribute("data-code") || CODE;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(t).then(function(){
              var old = btn.textContent;
              btn.textContent = "COPIED";
              setTimeout(function(){ btn.textContent = old; }, 1200);
            }).catch(function(){});
          }
        });
      })(btns[i]);
    }
    var field = document.getElementById("couponCode") || document.querySelector("[name=coupon]");
    if (field && !field.value) field.value = CODE;
    tick();
    if (!window._promoTick) window._promoTick = setInterval(tick, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
