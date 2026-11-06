// A gift page: a free evening offered from the app. Everything travels in the link's fragment (after #), which browsers never send to a server.
//   s  the evening offered, "together-15"        m  the giver's note        f  who gives it        d  the day it may be opened (YYYY-MM-DD)
// The app reads the same link (dejavous://cadeau#…): "Ouvrir dans l'appli" hands it over as it is.
// The install buttons (data-install) lead to the Google Play listing once it is published (store-config.js `play`), and go before that.
// A gift sent from the Google Play edition carries ?e=play: every link of the page then stays on the pages that edition may open (play-safe.js).
import { playSafe } from './play-safe.js?v=20261106';
import { STORE } from './store-config.js';
const DAY = /^\d{4}-\d{2}-\d{2}$/;
export function parseGift(hash) {
  const p = new URLSearchParams(String(hash).replace(/^#/, ''));
  const ev = /^(laugh|challenge|together)-(5|15|30)$/.exec(p.get('s') || ''), day = p.get('d') || '';
  if (!ev) return null;
  const clean = v => String(v || '').replace(/[<>]/g, '').trim();
  return { mood: ev[1], minutes: +ev[2], msg: clean(p.get('m')).slice(0, 200), from: clean(p.get('f')).slice(0, 30), day: DAY.test(day) ? day : null };
}
const today = () => { const d = new Date(), z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; };
// T: the page's texts { from, copied, onDay(date), sealedLine(date), evening(mood, minutes), moods: { laugh, challenge, together } }
export function openGift(T) {
  document.querySelectorAll('[data-lang]').forEach(a => { a.href += location.hash; });
  const g = parseGift(location.hash), $ = s => document.querySelector(s);
  if (!g) { $('#intro').hidden = true; $('#bad').hidden = false; return; }
  const app = 'dejavous://cadeau#' + location.hash.replace(/^#/, ''), sealed = !!g.day && today() < g.day;
  const on = g.day ? new Date(g.day + 'T12:00:00').toLocaleDateString(document.documentElement.lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' }) : '';
  document.querySelectorAll('.open-app').forEach(a => { a.href = app; });
  document.querySelectorAll('[data-install]').forEach(a => { if (STORE.play) a.href = STORE.play; else a.remove(); });
  $('#stage').hidden = false;
  if (g.from) $('#from').textContent = `${T.from} ${g.from}`;
  $('#msg').textContent = sealed ? T.onDay(on) : g.msg; // a gift for a day to come keeps its note until then
  const env = $('#env');
  env.addEventListener('click', () => {
    env.classList.add('open'); $('#intro').hidden = true;
    const next = sealed ? '#sealed' : '#evening';
    if (sealed) $('#sealed-line').textContent = T.sealedLine(on);
    else $('#ev-line').textContent = T.evening(T.moods[g.mood], g.minutes);
    setTimeout(() => { $(next).hidden = false; $(next).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900);
  }, { once: true });
  playSafe();
}
