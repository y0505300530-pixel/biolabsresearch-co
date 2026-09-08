/* INSIDER25 promo + countdown. Fixed end: 2026-09-14T23:59:59+03:00 (Asia/Jerusalem). */
(function(){
  var CODE = "INSIDER25";
  var END_ISO = "2026-09-14T23:59:59+03:00";
  var END_MS = Date.parse(END_ISO);
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
      for (i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute("data-end", END_ISO);
        nodes[i].textContent = text;
      }
      return;
    }
    text = format(left);
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("data-end", END_ISO);
      nodes[i].textContent = text;
    }
  }
  function saveCode(){
    try { localStorage.setItem("biolabs_coupon", CODE); } catch (e) {}
  }
  function wire(){

  function fillMarquee(){
    var track = document.querySelector(".promo-track");
    var bar = document.querySelector(".promo-bar");
    if (!track || !bar) return;
    var groups = track.querySelectorAll(".promo-group");
    if (!groups.length) return;
    // Keep first group as template; rebuild two equal halves that cover >= bar width
    var template = groups[0].cloneNode(true);
    var fragA = document.createDocumentFragment();
    var fragB = document.createDocumentFragment();
    var guard = 0;
    var minW = Math.max(bar.clientWidth || 0, window.innerWidth || 0, 1200);
    // clear
    track.innerHTML = "";
    var half = document.createElement("div");
    half.className = "promo-half";
    half.style.display = "flex";
    half.style.alignItems = "center";
    half.style.flex = "0 0 auto";
    var a = half.cloneNode(false);
    var b = half.cloneNode(false);
    do {
      a.appendChild(template.cloneNode(true));
      guard++;
    } while (a.scrollWidth < minW && guard < 24);
    // measure after attach
    track.appendChild(a);
    // force layout
    var need = Math.max(a.scrollWidth, minW);
    while (a.scrollWidth < need && guard < 48) {
      a.appendChild(template.cloneNode(true));
      guard++;
    }
    b.innerHTML = a.innerHTML;
    track.appendChild(b);
    // ensure animation targets -50% of full track (two equal halves)
    track.style.width = "max-content";
  }

    saveCode();
    try { fillMarquee(); } catch (e) {}
    try { window.addEventListener("resize", function(){ try { fillMarquee(); } catch (e2) {} }); } catch (e3) {}
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
