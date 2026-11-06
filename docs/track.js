import { STORE } from './store-config.js?v=20261106';
import { hit, playLink } from './hit.js';
import './mesure.js';

// One place for the Google Play address and for the anonymous counters of the page (same rules as hit.js: no cookie, no identifier).
// Until the listing is published (STORE.play empty), every Google Play button says "coming soon" and leads nowhere, and what only makes
// sense once it is out (data-play-only) stays hidden; what says "soon" (data-play-soon) goes once it is out.
if (STORE.play) { document.querySelectorAll('[data-store=play]').forEach(a => { a.href = STORE.play; }); document.querySelectorAll('[data-play-soon]').forEach(n => n.remove()); }
else {
  const en = document.documentElement.lang === 'en';
  document.querySelectorAll('[data-store=play]').forEach(a => {
    const soon = document.createElement('span');
    soon.className = a.className + ' is-soon'; soon.setAttribute('aria-disabled', 'true');
    if (a.classList.contains('store-btn')) { soon.innerHTML = a.innerHTML; const s = soon.querySelector('small'); if (s) s.textContent = en ? 'Coming soon to' : 'Bientôt sur'; }
    else soon.textContent = en ? 'Coming soon to Google Play' : 'Bientôt sur Google Play';
    a.replaceWith(soon);
  });
  document.querySelectorAll('[data-play-only]').forEach(n => { n.hidden = true; });
}
// a Google Play button also says which button it was (detail) and carries the source of the visit to Google Play (playLink)
const placeOf = el => el.closest('#top, .hero, header') ? 'hero' : el.closest('#telecharger, .closing') ? 'closing' : el.closest('#faq') ? 'faq' : el.closest('[id]')?.id ?? 'page';
document.addEventListener('click', e => {
  const t = e.target.closest?.('[data-hit]');
  if (!t) return;
  const place = t.matches('[data-store=play]') ? placeOf(t) : '';
  if (place && STORE.play && t.href) t.href = playLink(STORE.play, place);
  hit(t.dataset.hit, { detail: place });
});
