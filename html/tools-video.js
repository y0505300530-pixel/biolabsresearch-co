/*! BioLabs tools / .bl-video — play only when visible; respect reduced-motion */
(function () {
  function setupBlVideos() {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var videos = document.querySelectorAll(".bl-video video");
    if (!videos.length) return;

    videos.forEach(function (v) {
      try {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "");
        v.setAttribute("muted", "");
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
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupBlVideos);
  } else {
    setupBlVideos();
  }
})();
