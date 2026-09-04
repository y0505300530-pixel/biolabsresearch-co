/* Email in, coupon out. No exit-intent overlay. */
(function () {
  var CODE = "INSIDER25";
  var STORAGE_KEY = "bl_email_captured";
  function saveCode() {
    try { localStorage.setItem('biolabs_coupon', CODE); } catch (e) {}
  }
  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function send(email, name) {
    saveCode();
    var body = "INSIDER SIGNUP\nEmail: " + email + (name ? "\nName: " + name : "") + "\nCoupon: " + CODE + "\nPage: " + location.href;
    return fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Insider signup — " + email + " — " + CODE,
        body: body,
        orderData: { type: "insider-signup", email: email, firstName: name || "", coupon: CODE },
        paymentMethod: "inquiry"
      })
    }).catch(function () {});
  }
  function showSuccess(out, btn) {
    if (!out) return;
    out.hidden = false;
    out.innerHTML =
      '<span class="insider-code-chip">Code: <strong id="insiderCodeVal">' + CODE + "</strong></span>" +
      '<button type="button" class="insider-copy" id="insiderCopy">Copy code</button>' +
      "<span>Added to your inquiry.</span>";
    var copyBtn = document.getElementById("insiderCopy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        function done() {
          copyBtn.textContent = "Copied";
          setTimeout(function () { copyBtn.textContent = "Copy code"; }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(CODE).then(done).catch(function () { done(); });
        } else {
          done();
        }
      });
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = 'Code sent <span class="insider-go-arrow" aria-hidden="true">✓</span>';
    }
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
  }
  function wireClub() {
    var form = document.getElementById("insiderClub");
    if (!form || form._wired) return;
    form._wired = true;
    var input = document.getElementById("insiderEmail");
    var btn = document.getElementById("insiderGo");
    var out = document.getElementById("insiderOut");
    var busy = false;

    function markValidity() {
      if (!input) return true;
      var email = (input.value || "").trim();
      var ok = !email || validEmail(email);
      input.classList.toggle("is-invalid", !ok);
      return ok;
    }

    function go() {
      if (busy) return;
      var email = (input && input.value || "").trim();
      if (!validEmail(email)) {
        if (input) {
          input.classList.add("is-invalid");
          input.focus();
        }
        return;
      }
      input.classList.remove("is-invalid");
      busy = true;
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      Promise.resolve(send(email, "")).then(function () {
        showSuccess(out, btn);
      }).finally(function () {
        busy = false;
      });
    }

    if (btn) btn.addEventListener("click", go);
    if (input) {
      input.addEventListener("input", markValidity);
      input.addEventListener("blur", markValidity);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); go(); }
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wireClub);
  else wireClub();
})();
