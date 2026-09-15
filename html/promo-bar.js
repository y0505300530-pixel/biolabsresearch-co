/* INSIDER25 promo + countdown. Rolling 12h window — resets at 00:00:00 (never ends).
   Marquee is rAF-driven (not CSS animation) so live timer updates don't hitch the loop. */
(function(){
  var CODE = "INSIDER25";
  var WINDOW_MS = 12 * 60 * 60 * 1000;
  var LOOP_SEC = 93;
  var _raf = 0;
  var _x = 0;
  var _halfW = 0;
  var _last = 0;
  var _track = null;
  var _half = null;
  var _resizeT = 0;

  function pad(n){ n = Math.floor(Math.max(0, n)); return (n < 10 ? "0" : "") + n; }
  function windowLeft(){
    var now = Date.now();
    var left = WINDOW_MS - (now % WINDOW_MS);
    if (left <= 0 || left > WINDOW_MS) left = WINDOW_MS;
    return left;
  }
  function format(left){
    if (left <= 0) left = WINDOW_MS;
    var totalSec = Math.floor(left / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  function showPromo(){
    var el = document.getElementById("promoStack");
    if (el) {
      el.style.display = "";
      el.classList.remove("promo-ended");
    }
    var stacks = document.querySelectorAll(".promo-stack");
    for (var i = 0; i < stacks.length; i++) {
      stacks[i].style.display = "";
      stacks[i].classList.remove("promo-ended");
    }
  }
  function tick(){
    var left = windowLeft();
    var nodes = document.querySelectorAll(".cutoff-timer");
    var text = format(left);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].removeAttribute("data-end");
      nodes[i].setAttribute("data-window", "12h");
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
    var wrap = document.createElement("span");
    wrap.className = "promo-ends-wrap";
    wrap.appendChild(document.createTextNode(" · "));
    wrap.appendChild(timer);
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
    var codeBtns = template.querySelectorAll('.promo-code');
    for (var ci = 0; ci < codeBtns.length; ci++) {
      codeBtns[ci].setAttribute('data-code', CODE);
      codeBtns[ci].textContent = CODE;
    }
    var minW = Math.max(bar.clientWidth || 0, window.innerWidth || 0, 1200);
    track.innerHTML = "";
    track.style.animation = "none";
    track.style.display = "flex";
    track.style.alignItems = "center";
    track.style.flexWrap = "nowrap";
    track.style.width = "max-content";
    track.style.transform = "translate3d(0,0,0)";
    var halfA = document.createElement("div");
    halfA.className = "promo-half";
    halfA.style.display = "flex";
    halfA.style.alignItems = "center";
    halfA.style.flexWrap = "nowrap";
    halfA.style.flexShrink = "0";
    var guard = 0;
    while (halfA.scrollWidth < minW + 80 && guard < 40) {
      halfA.appendChild(template.cloneNode(true));
      guard++;
      if (!halfA.scrollWidth) break;
    }
    if (!halfA.children.length) halfA.appendChild(template.cloneNode(true));
    var halfB = halfA.cloneNode(true);
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
    _resizeT = setTimeout(function(){
      try { fillMarquee(); } catch (e) {}
    }, 180);
  }

  function wire(){
    showPromo();
    saveCode();
    try { fillMarquee(); } catch (e) {}
    try { normalizeAll(); } catch (eN) {}
    tick();
    setInterval(tick, 1000);
    window.addEventListener("resize", onResize);
    document.addEventListener("click", function(e){
      var btn = e.target && e.target.closest && e.target.closest(".promo-code");
      if (!btn) return;
      e.preventDefault();
      saveCode();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(CODE);
        }
      } catch (err) {}
      btn.classList.add("copied");
      var prev = btn.textContent;
      btn.textContent = "COPIED";
      setTimeout(function(){ btn.textContent = prev; btn.classList.remove("copied"); }, 1200);
    });
    try { localStorage.removeItem("cutoff_end"); } catch (e2) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
