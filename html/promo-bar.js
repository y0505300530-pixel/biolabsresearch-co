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
    saveCode();
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
