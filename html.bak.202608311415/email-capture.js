// BioLabs Research — Email Capture Widget
// Lightweight, no external dependencies
(function() {
  var STORAGE_KEY = 'bl_email_captured';
  var API_ENDPOINT = '/api/notify-order'; // reuse existing endpoint for now
  
  // Don't show if already captured
  if (localStorage.getItem(STORAGE_KEY)) return;
  
  // Only show after 30 seconds on page
  setTimeout(function() {
    var overlay = document.createElement('div');
    overlay.id = 'bl-email-overlay';
    overlay.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;transform:translateY(100%);transition:transform .4s ease;background:#1F1F1F;color:#fff;padding:24px 48px;display:flex;align-items:center;justify-content:center;gap:20px;flex-wrap:wrap';
    
    overlay.innerHTML = '' +
      '<div style="flex:1;min-width:280px;max-width:480px">' +
        '<p style="font-family:Inter,sans-serif;font-size:16px;font-weight:600;margin:0 0 4px">Stay current on research-grade lots</p>' +
        '<p style="font-family:Inter,sans-serif;font-size:13px;color:rgba(255,255,255,.6);margin:0">Get lot availability updates and new compound alerts. No spam — research only.</p>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<input type="email" id="bl-email-input" placeholder="your@lab.edu" style="flex:1;min-width:200px;padding:12px 16px;border:none;border-radius:999px;font-family:Inter,sans-serif;font-size:14px;outline:none">' +
        '<button id="bl-email-submit" style="padding:12px 24px;background:#FBCF87;color:#1F1F1F;border:none;border-radius:999px;font-family:Inter,sans-serif;font-weight:600;font-size:14px;cursor:pointer">Subscribe</button>' +
        '<button id="bl-email-close" style="padding:12px 16px;background:transparent;color:rgba(255,255,255,.4);border:none;border-radius:999px;font-size:14px;cursor:pointer">No thanks</button>' +
      '</div>';
    
    document.body.appendChild(overlay);
    
    requestAnimationFrame(function() {
      overlay.style.transform = 'translateY(0)';
    });
    
    function close() {
      overlay.style.transform = 'translateY(100%)';
      setTimeout(function() { overlay.remove(); }, 400);
      // Set a session-only flag so it doesn't pop again this session
      sessionStorage.setItem(STORAGE_KEY + '_dismissed', '1');
    }
    
    document.getElementById('bl-email-close').addEventListener('click', close);
    
    document.getElementById('bl-email-submit').addEventListener('click', function() {
      var email = document.getElementById('bl-email-input').value.trim();
      if (!email || !email.includes('@')) {
        document.getElementById('bl-email-input').style.border = '2px solid #e74c3c';
        return;
      }
      // Store locally
      localStorage.setItem(STORAGE_KEY, email);
      
      // Send to backend (reuse contact API)
      try {
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'email_signup',
            email: email,
            source: window.location.pathname,
            message: 'Email signup from website footer widget'
          })
        }).catch(function() {}); // silent fail — don't block UX
      } catch(e) {}
      
      // Show success
      overlay.innerHTML = '<div style="text-align:center;padding:8px 48px"><p style="font-family:Inter,sans-serif;font-size:16px;font-weight:600;color:#FBCF87">✓ Subscribed</p><p style="font-family:Inter,sans-serif;font-size:13px;color:rgba(255,255,255,.6);margin-top:4px">We\'ll notify you of new lots and compounds. Research only.</p></div>';
      setTimeout(close, 3000);
    });
    
    // Enter key submits
    document.getElementById('bl-email-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') document.getElementById('bl-email-submit').click();
    });
  }, 30000);
})();
