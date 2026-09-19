/* INSIDER25 promo removed (Yehuda 2026-09-15). Keep file so cached <script src> does not 404. */
(function(){
  function kill(){
    var nodes = document.querySelectorAll("#promoStack, .promo-stack, .promo-bar");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.style.display = "none";
      el.setAttribute("hidden", "");
      el.classList.add("promo-ended");
      try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
    }
    try { document.documentElement.classList.remove("has-promo"); } catch (e2) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kill);
  else kill();
})();
