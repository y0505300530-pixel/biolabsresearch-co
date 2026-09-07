/* Email in, coupon out. No exit-intent overlay. */
(function () {
  var CODE = "INSIDER25";
  var STORAGE_KEY = "bl_email_captured";
  function saveCode() {
    try { localStorage.setItem('biolabs_coupon', CODE); } catch (e) {}
  }
  function validEmail(email) {
    return email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  /* stage 3: token for browser events, contract_events.md §4 */
  function saveTrackToken(body) {
    try {
      var t = body && body.track_token;
      if (typeof t === 'string' && t) localStorage.setItem('biolabs_track', t);
    } catch (e) {}
  }
  function send(email, name) {
    return fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, firstName: name || "", coupon: CODE, page: location.href })
    }).then(function (r) {
      if (!r.ok) throw new Error("Could not subscribe");
      /* a missing or broken body is not an error: no token, same success state */
      return r.json().then(saveTrackToken, function () {});
    });
  }
  function showSuccess(out, btn) {
    saveCode();
    if (!out) return;
    out.hidden = false;
    out.innerHTML =
      '<span class="insider-code-chip">Code: <strong id="insiderCodeVal">' + CODE + "</strong></span>" +
      '<button type="button" class="insider-copy" id="insiderCopy">Copy code</button>' +
      "<span>Subscription saved.</span>";
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
      btn.innerHTML = 'Subscribed <span class="insider-go-arrow" aria-hidden="true">✓</span>';
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
      }).catch(function () {
        if (out) { out.hidden = false; out.textContent = "Could not subscribe. Please try again."; }
        if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
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
