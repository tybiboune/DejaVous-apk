// A gift page: the licence code and the note travel in the link's fragment (after #), which browsers never send to a server.
const CODE = /^[A-Za-z0-9._~-]{8,400}$/;
export function parseGift(hash) {
  const p = new URLSearchParams(String(hash).replace(/^#/, ''));
  const code = p.get('c') || '';
  if (!CODE.test(code)) return null;
  const clean = v => String(v || '').replace(/[<>]/g, '').trim();
  return { code, msg: clean(p.get('m')).slice(0, 200), from: clean(p.get('f')).slice(0, 30) };
}
export function giftLink(base, { code, msg = '', from = '' }) {
  const p = new URLSearchParams({ c: code }); if (msg.trim()) p.set('m', msg.trim().slice(0, 200)); if (from.trim()) p.set('f', from.trim().slice(0, 30));
  return `${base}#${p}`;
}
export function openGift({ from, copied }) {
  document.querySelectorAll('[data-lang]').forEach(a => { a.href += location.hash; });
  const g = parseGift(location.hash), $ = s => document.querySelector(s);
  if (!g) { $('#intro').hidden = true; $('#bad').hidden = false; return; }
  $('#stage').hidden = false;
  if (g.from) $('#from').textContent = `${from} ${g.from}`;
  $('#msg').textContent = g.msg;
  $('#code').textContent = g.code;
  const env = $('#env');
  env.addEventListener('click', () => { env.classList.add('open'); $('#intro').hidden = true; setTimeout(() => { $('#reveal').hidden = false; $('#reveal').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900); }, { once: true });
  const b = $('#copy'); b.onclick = async () => { try { await navigator.clipboard.writeText(g.code); b.textContent = copied; } catch {} };
}
