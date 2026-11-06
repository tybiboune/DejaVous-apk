import { hit } from './hit.js';

// What a visit does on a page, for the funnel (hit.js says what is sent and what is not):
// - view: the page is shown;
// - scroll: how far down it was read (25, 50, 75, 100 %, each once);
// - section: each section of the page (section[id]) seen for at least a second, once;
// - faq_open: each question of the FAQ opened (its number, from 1), once;
// - lang_switch: the other language chosen; link_out: a link to another site (its host);
// - leave: when the page is left or hidden for the first time, the seconds it was really looked at (visible, used in the last 30 s).
hit('view');

let deepest = 0;
const onScroll = () => {
  const doc = document.documentElement, max = doc.scrollHeight - window.innerHeight;
  const pct = max <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / max) * 100));
  for (const step of [25, 50, 75, 100]) if (pct >= step && deepest < step) { deepest = step; hit('scroll', { detail: String(step), n: step }); }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if ('IntersectionObserver' in window) {
  const timers = new Map();
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      const id = en.target.id;
      if (en.isIntersecting) timers.set(id, setTimeout(() => { hit('section', { detail: id }); io.unobserve(en.target); }, 1000));
      else clearTimeout(timers.get(id));
    }
  }, { threshold: 0.35 });
  document.querySelectorAll('section[id], [data-measure][id]').forEach(s => io.observe(s));
}

document.querySelectorAll('#faq details').forEach((d, i) => d.addEventListener('toggle', () => { if (d.open) hit('faq_open', { detail: String(i + 1) }); }));

document.addEventListener('click', e => {
  const a = e.target.closest?.('a[href]');
  if (!a) return;
  if (a.hasAttribute('lang') && a.closest('nav, header, footer')) return hit('lang_switch', { detail: a.getAttribute('lang') });
  try { const u = new URL(a.href, location.href); if (u.host !== location.host && /^https?:$/.test(u.protocol) && !a.matches('[data-store]')) hit('link_out', { detail: u.host }); } catch {}
});

// time really spent: visible, with some activity (scroll, touch, key) in the last 30 seconds
let active = 0, last = Date.now(), lastInput = Date.now(), left = false;
const tick = () => { const now = Date.now(); if (document.visibilityState === 'visible' && now - lastInput < 30000) active += now - last; last = now; };
['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(t => window.addEventListener(t, () => { tick(); lastInput = Date.now(); }, { passive: true }));
setInterval(tick, 5000);
const leave = () => { tick(); if (left) return; left = true; hit('leave', { detail: deepest ? String(deepest) : '0', n: Math.round(active / 1000) }); };
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') leave(); else { last = Date.now(); } });
window.addEventListener('pagehide', leave);
