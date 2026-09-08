/*! BioLabs .bl-video — play when visible; pause offscreen; respect reduced-motion */
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupOne(v) {
    if (!v || v.getAttribute("data-bl-io") === "1") return;
    v.setAttribute("data-bl-io", "1");
    try {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("muted", "");
      v.removeAttribute("controls");
    } catch (e) {}

    if (reduce) {
      v.removeAttribute("autoplay");
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e2) {}
      return;
    }

    if (!("IntersectionObserver" in window)) {
      if (v.play) v.play().catch(function () {});
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (v.play) v.play().catch(function () {});
          } else {
            try {
              v.pause();
            } catch (e3) {}
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px" }
    );
    io.observe(v.closest(".bl-video") || v);
  }

  function setupBlVideos(root) {
    var scope = root && root.querySelectorAll ? root : document;
    if (root && root.matches && root.matches("video") && root.closest(".bl-video")) {
      setupOne(root);
    }
    var videos = scope.querySelectorAll(".bl-video video");
    for (var i = 0; i < videos.length; i++) setupOne(videos[i]);
  }

  window.setupBlVideos = setupBlVideos;

  function boot() {
    setupBlVideos(document);
    if (!("MutationObserver" in window)) return;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var nodes = muts[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (!n || n.nodeType !== 1) continue;
          if (n.matches && n.matches(".bl-video video")) setupOne(n);
          else if (n.querySelectorAll) {
            var vs = n.querySelectorAll(".bl-video video");
            for (var k = 0; k < vs.length; k++) setupOne(vs[k]);
          }
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
