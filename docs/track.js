import { STORE } from './store-config.js?v=20261030b';
import { hit } from './hit.js';

// One place for the store address and for the anonymous counters of the buying path (same rules as hit.js: no cookie, no identifier).
// The Google Play edition is not on the store yet (STORE.play empty): its buttons say "soon" and lead nowhere, and what only makes
// sense with it (the edition quiz, the +9,90 € upgrade, its FAQ entries) is hidden. Setting STORE.play brings it all back.
if (STORE.play) document.querySelectorAll('[data-store=play]').forEach(a => { a.href = STORE.play; });
else {
  const en = document.documentElement.lang === 'en';
  document.querySelectorAll('[data-store=play]').forEach(a => {
    const soon = document.createElement('span');
    soon.className = a.className + ' is-soon'; soon.setAttribute('aria-disabled', 'true');
    if (a.classList.contains('store-btn')) soon.innerHTML = `<small>${en ? 'Coming soon to' : 'Bientôt sur'}</small><b>Google Play</b><span>${en ? 'A gentler edition' : 'Une édition plus douce'}</span>`;
    else soon.textContent = en ? 'Coming soon to Google Play' : 'Bientôt sur Google Play';
    a.replaceWith(soon);
  });
  document.querySelectorAll('[data-play-only]').forEach(n => { n.hidden = true; });
}
document.querySelectorAll('[data-store=apk]').forEach(a => { a.href = STORE.apk; });
document.addEventListener('click', e => { const t = e.target.closest?.('[data-hit]'); if (t) hit(t.dataset.hit); });
const watch = (selector, event) => { const n = document.querySelector(selector); if (n && 'IntersectionObserver' in window) { const o = new IntersectionObserver(([x]) => { if (x.isIntersecting) { hit(event); o.disconnect(); } }, { threshold: .35 }); o.observe(n); } };
watch('#editions', 'edition_view');
watch('.ed-guar', 'guarantee_view');

// Edition quiz: two answers, one recommended card (advice only; both cards stay visible).
const quiz = document.querySelector('#ed-quiz');
if (quiz) {
  const pick = {};
  quiz.addEventListener('click', e => {
    const b = e.target.closest('button[data-q]'); if (!b) return;
    pick[b.dataset.q] = b.dataset.v;
    quiz.querySelectorAll(`button[data-q="${b.dataset.q}"]`).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    if (!pick[1] || !pick[2]) return;
    const result = pick[1] === 'spicy' ? 'spicy' : pick[2];
    const target = result === 'play' ? 'play' : 'direct';
    document.querySelectorAll('.ed-card').forEach(c => { c.classList.toggle('ed-reco', c.dataset.ed === target); c.querySelector('.ed-badge')?.remove(); if (c.dataset.ed === target) { const s = document.createElement('span'); s.className = 'ed-badge'; s.textContent = quiz.dataset.reco; c.prepend(s); } });
    document.querySelector('.ed-grid')?.setAttribute('data-first', target);
    quiz.querySelector('.ed-quiz-out').textContent = quiz.dataset[`r${result[0].toUpperCase()}${result.slice(1)}`];
    hit('quiz_done');
  });
}
