/* INSIDER25 promo + countdown. Fresh 6h on EVERY page load (Yehuda). */
(function(){
  var CODE = "INSIDER25";
  var SIX_H = 6 * 60 * 60 * 1000;
  var END_MS = Date.now() + SIX_H; // reset every refresh — no localStorage
  function pad(n){ n = Math.floor(Math.max(0, n)); return (n < 10 ? "0" : "") + n; }
  function format(left){
    var h = left / 36e5, m = (left % 36e5) / 6e4, s = (left % 6e4) / 1e3;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  function tick(){
    var left = END_MS - Date.now();
    if (left <= 0) { END_MS = Date.now() + SIX_H; left = END_MS - Date.now(); }
    var text = format(left);
    var iso = new Date(END_MS).toISOString();
    var nodes = document.querySelectorAll(".cutoff-timer");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("data-end", iso);
      nodes[i].textContent = text;
    }
  }
  function saveCode(){
    try { localStorage.setItem("biolabs_coupon", CODE); } catch (e) {}
  }
  function wire(){
    saveCode();
    // clear any stale stored deadlines from older builds
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
