/* Research Insider exit-intent. Code INSIDER25. Posts to /api/notify-order until CRM webhook exists. */
(function () {
  var STORAGE_KEY = "bl_email_captured";
  var CODE = "INSIDER25";
  if (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) return;
  if (location.pathname.indexOf("checkout") !== -1) return;

  var shown = false;
  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function show() {
    if (shown) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (sessionStorage.getItem(STORAGE_KEY + "_dismissed")) return;
    shown = true;
    var overlay = el('<div id="bl-vip-overlay" style="position:fixed;inset:0;z-index:10050;background:rgba(13,33,55,.55);display:flex;align-items:center;justify-content:center;padding:20px"></div>');
    var box = el(
      '<div style="position:relative;width:min(420px,100%);background:#F4EFE4;border-radius:18px;padding:28px 24px 22px;text-align:center;box-shadow:0 24px 60px rgba(13,33,55,.28);font-family:var(--font,system-ui,sans-serif)">' +
        '<button type="button" id="bl-vip-x" aria-label="Close" style="position:absolute;top:10px;right:12px;background:none;border:0;font-size:22px;cursor:pointer;color:#111;line-height:1">×</button>' +
        '<div style="font-weight:800;letter-spacing:.12em;font-size:12px;color:#0d2137;margin-bottom:10px">BIO LABS</div>' +
        '<h2 style="margin:0 0 6px;font-size:22px;line-height:1.2;color:#111">Wait! You almost left without this</h2>' +
        '<p style="margin:0 0 16px;font-size:14px;color:#4a6358">Get 25% off your first inquiry</p>' +
        '<input id="bl-vip-name" type="text" placeholder="First name" autocomplete="given-name" style="width:100%;box-sizing:border-box;margin:0 0 8px;padding:12px 14px;border:1.5px solid #111;border-radius:10px;background:#fff;font-size:15px">' +
        '<input id="bl-vip-email" type="email" placeholder="Email" autocomplete="email" style="width:100%;box-sizing:border-box;margin:0 0 12px;padding:12px 14px;border:1.5px solid #111;border-radius:10px;background:#fff;font-size:15px">' +
        '<button type="button" id="bl-vip-go" style="width:100%;padding:14px;border:0;border-radius:10px;background:#0d2137;color:#fff;font-weight:800;font-size:16px;cursor:pointer">Unlock my 25% off</button>' +
        '<button type="button" id="bl-vip-no" style="display:block;width:100%;margin-top:10px;background:none;border:0;color:#6b7280;font-size:13px;cursor:pointer;text-decoration:underline">No thanks, I will pay full price</button>' +
      '</div>'
    );
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    function close(permanent) {
      overlay.remove();
      try {
        sessionStorage.setItem(STORAGE_KEY + "_dismissed", "1");
        if (permanent) localStorage.setItem(STORAGE_KEY, "1");
      } catch (e) {}
    }
    document.getElementById("bl-vip-x").onclick = function () { close(false); };
    document.getElementById("bl-vip-no").onclick = function () { close(false); };
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(false); });
    document.getElementById("bl-vip-go").onclick = function () {
      var name = (document.getElementById("bl-vip-name").value || "").trim();
      var email = (document.getElementById("bl-vip-email").value || "").trim();
      if (!email || email.indexOf("@") < 1) {
        document.getElementById("bl-vip-email").focus();
        return;
      }
      try { localStorage.setItem("biofirst_coupon", CODE); } catch (e) {}
      var body = "INSIDER SIGNUP\nName: " + name + "\nEmail: " + email + "\nCoupon: " + CODE + "\nPage: " + location.href;
      fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Insider signup — " + email + " — " + CODE,
          body: body,
          orderData: { type: "insider-signup", firstName: name, email: email, coupon: CODE },
          paymentMethod: "inquiry"
        })
      }).catch(function () {});
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
      box.innerHTML =
        '<button type="button" id="bl-vip-x2" aria-label="Close" style="position:absolute;top:10px;right:12px;background:none;border:0;font-size:22px;cursor:pointer;color:#111">×</button>' +
        '<div style="font-weight:800;letter-spacing:.12em;font-size:12px;color:#0d2137;margin-bottom:10px">BIO LABS</div>' +
        '<h2 style="margin:0 0 8px;font-size:22px;color:#111">Your code</h2>' +
        '<div style="display:inline-block;background:#F2D191;color:#111;font-weight:800;font-size:20px;letter-spacing:.06em;padding:10px 18px;border-radius:10px;margin:8px 0 12px">' + CODE + '</div>' +
        '<p style="margin:0;font-size:13px;color:#4a6358">Added to your inquiry. Honored when the order is confirmed.</p>';
      document.getElementById("bl-vip-x2").onclick = function () { overlay.remove(); };
    };
  }
  document.addEventListener("mouseout", function (e) {
    if (e.clientY > 12) return;
    if (e.relatedTarget) return;
    show();
  });
  setTimeout(function () {
    if (window.matchMedia && window.matchMedia("(pointer:coarse)").matches) show();
  }, 25000);
})();
