// The buy forms of unleashed.html and the thank-you page. Prices are set in Stripe, never here: the page only asks the server for a payment link.
import { STORE } from './store-config.js?v=20261030';

// Cloudflare Turnstile (STORE.turnstile: the widget's public site key, empty = no captcha). One widget per form, invisible unless
// Cloudflare wants a click; each submission takes a fresh token (single use), then the widget is reset for the next try.
let turnstile;
const loadTurnstile = () => turnstile ??= new Promise((ok, ko) => {
  window.onTurnstileLoad = () => ok(window.turnstile);
  const s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit'; s.async = true; s.onerror = ko; document.head.append(s);
});
function guard(form, lang) {
  if (!STORE.turnstile) return { token: async () => undefined, reset() {} };
  const box = document.createElement('div'); box.className = 'ul-captcha'; form.querySelector('button[type=submit]').before(box);
  const widget = loadTurnstile().then(t => ({ t, id: t.render(box, { sitekey: STORE.turnstile, appearance: 'interaction-only', theme: 'auto', size: 'flexible', language: lang }) })).catch(() => null);
  return {
    async token() { // the token is usually ready before the click; otherwise wait for it (up to 30 s, the time of a click on the widget)
      const w = await widget; if (!w) return null;
      for (let i = 0; i < 120; i++) { const v = w.t.getResponse(w.id); if (v) return v; await new Promise(r => setTimeout(r, 250)); }
      return null;
    },
    async reset() { const w = await widget; try { w?.t.reset(w.id); } catch {} },
  };
}

// A button that sends e-mails waits before it can be used again, longer after each sending: 30 s, 1 min, 2 min, 4 min… up to 30 min.
// The count is kept in the browser (a reload does not reset it) and starts over after a quiet day. The server has its own limits too.
const WAITS = [30, 60, 120, 240, 480, 900, 1800], COOL_KEY = 'dv:mailCooldown', QUIET = 86400000;
function cooldown(btn, lang) {
  const label = btn.textContent, read = () => { try { return JSON.parse(localStorage.getItem(COOL_KEY)) || {}; } catch { return {}; } };
  const save = v => { try { localStorage.setItem(COOL_KEY, JSON.stringify(v)); } catch {} };
  let timer;
  const tick = () => {
    const left = Math.ceil(((read().until || 0) - Date.now()) / 1000);
    if (left <= 0) { clearInterval(timer); btn.disabled = false; btn.textContent = label; return; }
    btn.disabled = true; btn.textContent = (lang === 'en' ? 'Wait ' : 'Patientez ') + Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
  };
  const run = () => { clearInterval(timer); tick(); timer = setInterval(tick, 1000); };
  if ((read().until || 0) > Date.now()) run(); // a wait still running from before a reload
  return {
    start() {
      const c = read(), n = Date.now() - (c.last || 0) > QUIET ? 0 : (c.n || 0);
      save({ n: n + 1, last: Date.now(), until: Date.now() + WAITS[Math.min(n, WAITS.length - 1)] * 1000 }); run();
    },
    hold(seconds) { save({ ...read(), until: Date.now() + Math.min(seconds, 86400) * 1000 }); run(); }, // the server said "too many": wait as long as it says
  };
}

const post = async (path, body) => { const r = await fetch(STORE.api + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); let data = {}; try { data = await r.json(); } catch {} return { status: r.status, data }; };

export function initShop({ lang, errors, soon, redirect, lostOk }) {
  document.querySelector('#apk')?.setAttribute('href', STORE.apk); document.querySelector('#sums')?.setAttribute('href', STORE.sums);
  const open = !!STORE.api;
  const availability = document.querySelector('#shop-availability');
  if (availability) availability.textContent = open
    ? (lang === 'en' ? 'Checkout is open. Choose your offer below.' : 'Le paiement est ouvert. Choisissez votre offre ci-dessous.')
    : (lang === 'en' ? 'Planned prices. Checkout is not open yet: no payment or gift-code delivery is currently available. Try Discovery first.' : 'Prix prévus. Le paiement n’est pas encore ouvert : aucun achat ni envoi de code cadeau n’est disponible actuellement. Essayez Découverte d’abord.');
  for (const form of document.querySelectorAll('form.ul-path')) {
    const btn = form.querySelector('button'), msg = form.querySelector('.ul-msg');
    if (!open) { btn.disabled = true; msg.textContent = soon; continue; }
    const human = guard(form, lang);
    form.addEventListener('submit', async e => {
      e.preventDefault(); if (btn.disabled) return;
      const f = new FormData(form); btn.disabled = true; msg.textContent = '';
      try {
        const captcha = await human.token(); if (captcha === null) { msg.textContent = errors.captcha; btn.disabled = false; return; }
        const { status, data } = await post('/api/checkout', { product: form.dataset.product, email: String(f.get('email') || '').trim(), playOrder: f.get('order') || undefined, adult: f.get('adult') === 'on', lang, captcha });
        human.reset();
        if (status === 200 && /^https:\/\/checkout\.stripe\.com\//.test(data.url || '')) { msg.textContent = redirect; location.href = data.url; return; }
        msg.textContent = errors[data.error] || errors.other;
      } catch { msg.textContent = errors.other; }
      btn.disabled = false;
    });
  }
  const lost = document.querySelector('#lost');
  if (lost) {
    const btn = lost.querySelector('button'), msg = lost.querySelector('.ul-msg');
    if (!open) { btn.disabled = true; return; }
    const human = guard(lost, lang), cool = cooldown(btn, lang);
    lost.addEventListener('submit', async e => {
      e.preventDefault(); if (btn.disabled) return; btn.disabled = true;
      let sent = false, wait = 0;
      try {
        const captcha = await human.token();
        if (captcha === null) msg.textContent = errors.captcha;
        else { const { status, data } = await post('/api/resend', { email: lost.email.value.trim(), lang, captcha }); human.reset(); sent = status === 200; wait = status === 429 ? +data.retry || 3600 : 0; msg.textContent = status === 200 ? lostOk : status === 429 ? errors.rate : status === 403 ? errors.captcha : errors.email; }
      } catch { msg.textContent = errors.other; }
      if (wait) msg.textContent = lang === 'en' ? 'Too many attempts: try again when the countdown ends.' : 'Trop d’essais : réessayez à la fin du décompte.';
      if (sent) cool.start(); else if (wait) cool.hold(wait); else btn.disabled = false;
    });
  }
}

// The thank-you page: the code of the paid session, polled until the payment is confirmed (up to about 80 seconds).
export async function showCode({ copy, copied, bad }) {
  const sid = new URLSearchParams(location.search).get('session_id') || '';
  const other = document.querySelector('#lang-other'); if (other && sid) other.href += '?session_id=' + encodeURIComponent(sid); // the other language keeps the order reference
  const state = document.querySelector('#state');
  if (!/^cs_(live|test)_[A-Za-z0-9]{20,200}$/.test(sid) || !STORE.api) { state.textContent = bad; document.querySelector('#late').hidden = false; return; }
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`${STORE.api}/api/code?session_id=${encodeURIComponent(sid)}`);
      if (r.status === 200) {
        const { code } = await r.json();
        document.querySelector('#code').textContent = code; document.querySelector('#done').hidden = false; state.hidden = true;
        const b = document.querySelector('#copy'); b.onclick = async () => { try { await navigator.clipboard.writeText(code); b.textContent = copied; } catch { const s = getSelection(), rg = document.createRange(); rg.selectNodeContents(document.querySelector('#code')); s.removeAllRanges(); s.addRange(rg); } };
        return;
      }
      if (r.status !== 202) break;
    } catch {}
    await new Promise(res => setTimeout(res, 2000));
  }
  document.querySelector('#late').hidden = false;
}
