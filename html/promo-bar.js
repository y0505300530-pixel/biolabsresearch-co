/* INSIDER25 promo + countdown. Restart 6h on every page load (Yehuda). */
(function(){
  var CODE = "INSIDER25";
  var SIX_H = 6 * 60 * 60 * 1000;
  function pad(n){ n=Math.floor(n); return (n<10?"0":"")+n; }
  function endIso(){
    return new Date(Date.now() + SIX_H).toISOString();
  }
  function ensureEnds(){
    var end = endIso();
    var nodes = document.querySelectorAll(".cutoff-timer");
    for (var i=0;i<nodes.length;i++) nodes[i].setAttribute("data-end", end);
    return end;
  }
  function tick(){
    var END = ensureEnds.__fixed || (ensureEnds.__fixed = ensureEnds());
    var endMs = Date.parse(END);
    var text;
    if (!isFinite(endMs)) text = "00:00:00";
    else {
      var left = endMs - Date.now();
      if (left <= 0) {
        ensureEnds.__fixed = ensureEnds();
        endMs = Date.parse(ensureEnds.__fixed);
        left = endMs - Date.now();
      }
      var h = left/36e5, m = (left%36e5)/6e4, s = (left%6e4)/1e3;
      text = pad(h)+":"+pad(m)+":"+pad(s);
    }
    var nodes = document.querySelectorAll(".cutoff-timer");
    for (var i=0;i<nodes.length;i++) nodes[i].textContent = text;
  }
  function saveCode(){
    try { localStorage.setItem('biolabs_coupon', CODE); } catch (e) {}
  }
  function wire(){
    saveCode();
    ensureEnds.__fixed = ensureEnds();
    var btns = document.querySelectorAll(".promo-code");
    for (var i=0;i<btns.length;i++){
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
