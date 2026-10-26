(() => {
  'use strict';
  const id = document.querySelector('meta[name="ga4-measurement-id"]')?.content || '';
  const configured = /^G-[A-Z0-9]+$/.test(id);
  const key = 'agready.analytics-choice.v1';
  let choice = 'unset';
  try { choice = localStorage.getItem(key) || 'unset'; } catch { /* Privacy modes can block storage. */ }
  if (!['accepted', 'declined'].includes(choice)) choice = 'unset';
  let loaded = false;
  const banner = document.getElementById('analytics-banner');
  const dialog = document.getElementById('privacy-dialog');
  const accept = document.getElementById('analytics-accept');
  const feedback = document.getElementById('consent-feedback');
  const status = document.getElementById('analytics-status');
  function enable() {
    if (!configured || choice !== 'accepted') return;
    window['ga-disable-' + id] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: '' });
    window.gtag('event', 'page_view', { page_location: location.origin + location.pathname, page_referrer: '', page_title: document.title });
    const script = document.createElement('script');
    script.async = true;
    script.id = 'agready-google-tag';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }
  function describe() {
    status.textContent = !configured ? 'Google Analytics is not configured. No Google Analytics script is loaded.' : choice === 'accepted' ? 'You have allowed optional Google Analytics on this browser. This preference does not control Cloudflare measurement.' : 'Optional Google Analytics is off. It loads only if you choose to allow it. This preference does not control Cloudflare measurement.';
    accept.disabled = !configured;
    banner.hidden = !configured || choice !== 'unset';
  }
  function save(next) {
    choice = next;
    try { localStorage.setItem(key, next); } catch { /* Choice applies for this page if storage is unavailable. */ }
    if (next === 'accepted') enable();
    else if (configured) {
      window['ga-disable-' + id] = true;
      document.getElementById('agready-google-tag')?.remove();
      // Expire first-party GA cookies, including cookies set on a parent hostname.
      const hosts = location.hostname.split('.');
      const domains = ['', ...hosts.map((_, index) => hosts.slice(index).join('.'))];
      for (const item of document.cookie.split(';')) {
        const name = item.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of domains) document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      }
      // Reload on a future visit respects the declined choice. Previously sent data cannot be recalled here.
    }
    describe();
    feedback.textContent = next === 'accepted' ? 'Google Analytics allowed. You can withdraw this choice here; Cloudflare measurement is separate.' : 'Google Analytics declined. This does not disable Cloudflare measurement or delete information previously sent.';
  }
  document.getElementById('privacy-open').addEventListener('click', () => { describe(); dialog.showModal(); });
  accept.addEventListener('click', () => { if(configured) save('accepted'); });
  document.getElementById('analytics-decline').addEventListener('click', () => save('declined'));
  function chooseFromBanner(next) {
    const moveFocus = banner.contains(document.activeElement);
    save(next);
    if (moveFocus) document.getElementById('main').focus({preventScroll:true});
  }
  document.getElementById('banner-accept').addEventListener('click', () => { if (configured) chooseFromBanner('accepted'); });
  document.getElementById('banner-decline').addEventListener('click', () => chooseFromBanner('declined'));
  document.querySelectorAll('[data-cta]').forEach(link => link.addEventListener('click', () => {
    if (configured && choice === 'accepted' && window.gtag) window.gtag('event', 'navigation_click', { cta_name: link.dataset.cta, page_location: location.origin + location.pathname, page_referrer: '' });
  }));
  describe();
  enable();
})();
