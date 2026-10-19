import { STORE } from './store-config.js';
import { hit } from './hit.js';

// One place for the store address and for the anonymous counters of the buying path (same rules as hit.js: no cookie, no identifier).
document.querySelectorAll('[data-store=play]').forEach(a => { a.href = STORE.play; });
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
    quiz.querySelector('.ed-quiz-out').textContent = quiz.dataset[`r${result[0].toUpperCase()}${result.slice(1)}`];
    hit('quiz_done');
  });
}
