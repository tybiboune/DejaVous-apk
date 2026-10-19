import { STORE } from './store-config.js';
import { hit } from './hit.js';

// One place for the store address and for the anonymous counters of the buying path (same rules as hit.js: no cookie, no identifier).
document.querySelectorAll('[data-store=play]').forEach(a => { a.href = STORE.play; });
document.querySelectorAll('[data-store=apk]').forEach(a => { a.href = STORE.apk; });
document.addEventListener('click', e => { const t = e.target.closest?.('[data-hit]'); if (t) hit(t.dataset.hit); });
const watch = (selector, event) => { const n = document.querySelector(selector); if (n && 'IntersectionObserver' in window) { const o = new IntersectionObserver(([x]) => { if (x.isIntersecting) { hit(event); o.disconnect(); } }, { threshold: .35 }); o.observe(n); } };
watch('#editions', 'edition_view');
watch('.ed-guar', 'guarantee_view');
