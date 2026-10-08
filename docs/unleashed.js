// The buy forms of unleashed.html and the thank-you page. Prices are set in Stripe, never here: the page only asks the server for a payment link.
import { STORE } from './store-config.js';

const post = async (path, body) => { const r = await fetch(STORE.api + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); let data = {}; try { data = await r.json(); } catch {} return { status: r.status, data }; };

export function initShop({ lang, errors, soon, redirect, lostOk }) {
  document.querySelector('#apk')?.setAttribute('href', STORE.apk); document.querySelector('#sums')?.setAttribute('href', STORE.sums);
  const open = !!STORE.api;
  for (const form of document.querySelectorAll('form.ul-path')) {
    const btn = form.querySelector('button'), msg = form.querySelector('.ul-msg');
    if (!open) { btn.disabled = true; msg.textContent = soon; continue; }
    form.addEventListener('submit', async e => {
      e.preventDefault(); if (btn.disabled) return;
      const f = new FormData(form); btn.disabled = true; msg.textContent = '';
      try {
        const { status, data } = await post('/api/checkout', { product: form.dataset.product, email: String(f.get('email') || '').trim(), playOrder: f.get('order') || undefined, adult: f.get('adult') === 'on', lang });
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
    lost.addEventListener('submit', async e => { e.preventDefault(); btn.disabled = true; try { const { status } = await post('/api/resend', { email: lost.email.value.trim(), lang }); msg.textContent = status === 200 ? lostOk : (status === 429 ? errors.rate : errors.email); } catch { msg.textContent = errors.other; } btn.disabled = false; });
  }
}

// The thank-you page: the code of the paid session, polled until the payment is confirmed (up to about 80 seconds).
export async function showCode({ copy, copied, bad }) {
  const sid = new URLSearchParams(location.search).get('session_id') || '';
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
