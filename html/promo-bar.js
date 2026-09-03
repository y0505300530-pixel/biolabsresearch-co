/* INSIDER25 promo + countdown. Inquiry-only: stores code, does not auto-discount. */
(function(){
  var CODE = "INSIDER25";
  var END = "2026-09-07T23:59:59+03:00";
  function pad(n){ n=Math.floor(n); return (n<10?"0":"")+n; }
  function tick(){
    var el = document.getElementById("promoTimer");
    if (!el) return;
    var left = new Date(el.getAttribute("data-end") || END).getTime() - Date.now();
    if (left <= 0) {
      el.textContent = "00:00:00";
      var copy = document.querySelector(".cutoff-copy span");
      if (copy) copy.textContent = "Offer ended. Code no longer applied to new inquiries.";
      return;
    }
    var h = left/36e5, m = (left%36e5)/6e4, s = (left%6e4)/1e3;
    el.textContent = pad(h)+":"+pad(m)+":"+pad(s);
  }
  function saveCode(){
    try { localStorage.setItem("biofirst_coupon", CODE); } catch (e) {}
  }
  function wire(){
    saveCode();
    var btn = document.getElementById("promoCode");
    if (btn && !btn._wired) {
      btn._wired = true;
      btn.addEventListener("click", function(){
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
    }
    var field = document.getElementById("couponCode") || document.querySelector("[name=coupon]");
    if (field && !field.value) field.value = CODE;
    tick();
    if (!window._promoTick) {
      window._promoTick = setInterval(tick, 1000);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
