/*! cookie-consent.js — subtle banner; GA only after Accept */
(function () {
  'use strict';
  var KEY = 'blr_cookie_consent'; /* all | essential */
  var GA_ID = 'G-KCMPHP783M';
  var MAX_AGE = 31536000;

  function getConsent() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === 'all' || v === 'essential') return v;
    } catch (e) {}
    return '';
  }

  function setConsent(v) {
    try {
      localStorage.setItem(KEY, v);
      document.cookie =
        KEY + '=' + v + ';path=/;max-age=' + MAX_AGE + ';SameSite=Lax';
    } catch (e) {}
  }

  function loadGa() {
    if (window.__blrGaLoaded) return;
    window.__blrGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function grantAnalytics() {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    } catch (e) {}
    loadGa();
  }

  function denyAnalytics() {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    try {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    } catch (e) {}
  }

  /* Consent Mode default — before any tag */
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function hideBanner() {
    var el = document.getElementById('blr-consent');
    if (el) el.classList.remove('blr-c-open');
  }

  function showBanner() {
    var el = document.getElementById('blr-consent');
    if (el) el.classList.add('blr-c-open');
  }

  function onAccept() {
    setConsent('all');
    grantAnalytics();
    hideBanner();
  }

  function onEssential() {
    setConsent('essential');
    denyAnalytics();
    hideBanner();
  }

  function buildBanner() {
    if (document.getElementById('blr-consent')) return;
    var bar = document.createElement('div');
    bar.id = 'blr-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie preferences');
    bar.innerHTML =
      '<div class="blr-c-inner">' +
      '<p class="blr-c-text">We use cookies for site function and, with your OK, analytics. Research use only. ' +
      '<a href="/cookie-policy">Cookie Policy</a></p>' +
      '<div class="blr-c-actions">' +
      '<button type="button" class="blr-c-btn blr-c-accept" id="blrCAccept">Accept</button>' +
      '<button type="button" class="blr-c-btn blr-c-essential" id="blrCEssential">Essential only</button>' +
      '</div></div>';
    document.body.appendChild(bar);
    document.getElementById('blrCAccept').addEventListener('click', onAccept);
    document.getElementById('blrCEssential').addEventListener('click', onEssential);
  }

  function boot() {
    buildBanner();
    var c = getConsent();
    if (c === 'all') {
      grantAnalytics();
      hideBanner();
    } else if (c === 'essential') {
      denyAnalytics();
      hideBanner();
    } else {
      showBanner();
    }
    document.querySelectorAll('[data-open-cookie-settings]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    });
    window.blrOpenCookieSettings = showBanner;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
