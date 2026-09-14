/*! checkout-address.js — browser autofill + fast address suggestions (Photon) + optional Google Places */
(function () {
  'use strict';
  var KEY = (window.BLR_GOOGLE_PLACES_KEY || '').trim();
  var address1 = document.getElementById('address1');
  var address2 = document.getElementById('address2');
  var city = document.getElementById('city');
  var state = document.getElementById('state');
  var zip = document.getElementById('zip');
  var country = document.getElementById('country');
  var hint = document.getElementById('shipAutofillHint');
  if (!address1) return;

  function setCountry(code) {
    if (!country || !code) return;
    var c = String(code).toUpperCase();
    for (var i = 0; i < country.options.length; i++) {
      if (country.options[i].value === c) { country.value = c; return; }
    }
  }

  function fillFromComponents(parts) {
    if (parts.line1 != null && parts.line1 !== '') address1.value = parts.line1;
    if (parts.line2 != null && address2) address2.value = parts.line2;
    if (parts.city != null) city.value = parts.city;
    if (parts.state != null) state.value = parts.state;
    if (parts.zip != null) zip.value = parts.zip;
    if (parts.country) setCountry(parts.country);
    [address1, city, state, zip, country].forEach(function (el) {
      if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  /* --- Fast free suggestions via Photon (no key) while Google key optional --- */
  var wrap = address1.closest('.form-group') || address1.parentElement;
  if (wrap) wrap.classList.add('blr-place-wrap');
  var dd = document.createElement('div');
  dd.className = 'blr-place-dd';
  dd.id = 'blrPlaceDd';
  dd.setAttribute('role', 'listbox');
  if (wrap) wrap.appendChild(dd);

  var timer = null;
  var active = -1;
  var items = [];

  function closeDd() {
    dd.classList.remove('open');
    dd.innerHTML = '';
    active = -1;
    items = [];
  }

  function openDd(list) {
    items = list || [];
    active = -1;
    dd.innerHTML = '';
    if (!items.length) { closeDd(); return; }
    items.forEach(function (it, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'blr-place-opt';
      btn.setAttribute('role', 'option');
      btn.textContent = it.label;
      btn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        pick(it);
      });
      dd.appendChild(btn);
    });
    dd.classList.add('open');
  }

  function pick(it) {
    fillFromComponents(it.parts);
    closeDd();
  }

  function parsePhoton(feature) {
    var p = feature.properties || {};
    var street = [p.housenumber, p.street || p.name].filter(Boolean).join(' ').trim();
    return {
      label: p.name && p.street && p.name !== p.street
        ? (street || p.name) + ', ' + [p.city || p.county, p.state, p.countrycode].filter(Boolean).join(', ')
        : (p.label || [street, p.city, p.state, p.postcode, p.countrycode].filter(Boolean).join(', ')),
      parts: {
        line1: street || p.name || '',
        city: p.city || p.town || p.village || p.county || '',
        state: p.state || p.county || '',
        zip: p.postcode || '',
        country: (p.countrycode || '').toUpperCase()
      }
    };
  }

  function searchPhoton(q) {
    var url = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(q) + '&limit=6&lang=en';
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var feats = (data && data.features) || [];
        openDd(feats.map(parsePhoton).filter(function (x) { return x.parts.line1 || x.label; }));
      })
      .catch(function () { closeDd(); });
  }

  address1.addEventListener('input', function () {
    var q = address1.value.trim();
    if (timer) clearTimeout(timer);
    if (q.length < 3 || KEY) { closeDd(); return; } // if Google key present, Places owns UX
    timer = setTimeout(function () { searchPhoton(q); }, 160);
  });
  address1.addEventListener('keydown', function (e) {
    if (!dd.classList.contains('open')) return;
    var opts = dd.querySelectorAll('.blr-place-opt');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(active + 1, opts.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(active - 1, 0);
    } else if (e.key === 'Enter' && active >= 0 && items[active]) {
      e.preventDefault();
      pick(items[active]);
      return;
    } else if (e.key === 'Escape') {
      closeDd();
      return;
    } else return;
    opts.forEach(function (o, i) { o.setAttribute('aria-selected', i === active ? 'true' : 'false'); });
  });
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) closeDd();
  });

  /* --- Optional Google Places when key provided --- */
  function initGoogle() {
    if (!window.google || !google.maps || !google.maps.places) return;
    if (hint) hint.textContent = 'Start typing your street — Google address suggestions fill city, state, and postal code.';
    closeDd();
    var ac = new google.maps.places.Autocomplete(address1, {
      types: ['address'],
      fields: ['address_components', 'formatted_address', 'name']
    });
    ac.addListener('place_changed', function () {
      var place = ac.getPlace();
      if (!place || !place.address_components) return;
      var map = {};
      place.address_components.forEach(function (c) {
        c.types.forEach(function (t) { map[t] = c; });
      });
      var streetNum = map.street_number ? map.street_number.long_name : '';
      var route = map.route ? map.route.long_name : '';
      fillFromComponents({
        line1: [streetNum, route].filter(Boolean).join(' ').trim() || place.name || '',
        city: (map.locality && map.locality.long_name) || (map.postal_town && map.postal_town.long_name) || (map.sublocality_level_1 && map.sublocality_level_1.long_name) || '',
        state: map.administrative_area_level_1 ? map.administrative_area_level_1.short_name : '',
        zip: map.postal_code ? map.postal_code.long_name : '',
        country: map.country ? map.country.short_name : ''
      });
    });
  }

  if (KEY) {
    var s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(KEY) + '&libraries=places&callback=__blrPlacesReady';
    s.async = true;
    s.defer = true;
    window.__blrPlacesReady = initGoogle;
    document.head.appendChild(s);
  } else if (hint) {
    hint.textContent = 'Type your street for instant suggestions — city, state, and postal code fill in. Browser autofill also works.';
  }
})();
