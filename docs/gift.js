// A gift page: everything travels in the link's fragment (after #), which browsers never send to a server.
//   c  the code of the full game (a paid gift)        m  the giver's note        f  who gives it
//   s  the evening offered, "together-15" (a gift without a code is a free evening)        d  the day it may be opened (YYYY-MM-DD)
// The app reads the same link (dejavous://cadeau#…): "Ouvrir dans l'appli" hands it over, the code is then applied without copying it.
const CODE = /^[A-Za-z0-9._~-]{8,400}$/, DAY = /^\d{4}-\d{2}-\d{2}$/;
export function parseGift(hash) {
  const p = new URLSearchParams(String(hash).replace(/^#/, ''));
  const code = p.get('c') || '', ev = /^(laugh|challenge|together)-(5|15|30)$/.exec(p.get('s') || ''), day = p.get('d') || '';
  if (code && !CODE.test(code)) return null;
  if (!code && !ev) return null;
  const clean = v => String(v || '').replace(/[<>]/g, '').trim();
  return { code: code || null, mood: ev ? ev[1] : 'together', minutes: ev ? +ev[2] : 15, msg: clean(p.get('m')).slice(0, 200), from: clean(p.get('f')).slice(0, 30), day: DAY.test(day) ? day : null };
}
export function giftLink(base, { code, msg = '', from = '' }) {
  const p = new URLSearchParams({ c: code }); if (msg.trim()) p.set('m', msg.trim().slice(0, 200)); if (from.trim()) p.set('f', from.trim().slice(0, 30));
  return `${base}#${p}`;
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
  $('#stage').hidden = false;
  if (g.from) $('#from').textContent = `${T.from} ${g.from}`;
  $('#msg').textContent = sealed ? T.onDay(on) : g.msg; // a gift for a day to come keeps its note until then
  $('#code').textContent = g.code ?? '';
  const env = $('#env');
  env.addEventListener('click', () => {
    env.classList.add('open'); $('#intro').hidden = true;
    const next = sealed ? '#sealed' : g.code ? '#reveal' : '#evening';
    if (sealed) $('#sealed-line').textContent = T.sealedLine(on);
    if (!g.code && !sealed) $('#ev-line').textContent = T.evening(T.moods[g.mood], g.minutes);
    setTimeout(() => { $(next).hidden = false; $(next).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900);
  }, { once: true });
  const b = $('#copy'); b.onclick = async () => { try { await navigator.clipboard.writeText(g.code); b.textContent = T.copied; } catch {} };
}
