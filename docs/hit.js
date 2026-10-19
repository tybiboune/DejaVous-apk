import { STORE } from './store-config.js';

// Anonymous event counter: an event name and the page variant, nothing else (no cookie, no identifier, no address kept by the server).
// Off when the visitor asks browsers not to be tracked (Global Privacy Control, Do Not Track) and while no server address is configured.
const EVENTS = new Set(['view', 'demo_start', 'demo_done', 'sealed_seen', 'install_click', 'install_sheet', 'qr_show', 'invite_create', 'invite_open', 'invite_answer', 'buy_click', 'code_return', 'edition_view', 'play_click', 'apk_click', 'intent_play', 'intent_gift', 'intent_surprise', 'guarantee_view', 'card_make', 'card_share']);
const quiet = () => navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1';
// A/B test of the headline: a random letter kept in this browser (it never leaves it except as "a" or "b" in a counted event).
export const variant = (() => { try { let v = localStorage.getItem('dv-ab'); if (v !== 'a' && v !== 'b') { v = Math.random() < .5 ? 'a' : 'b'; localStorage.setItem('dv-ab', v); } return v; } catch { return 'a'; } })();
const sent = new Set();
export function hit(event, { once = true } = {}) {
  if (!EVENTS.has(event) || !STORE.api || quiet() || (once && sent.has(event))) return;
  sent.add(event);
  const body = JSON.stringify({ e: event, v: variant, l: document.documentElement.lang === 'en' ? 'en' : 'fr' });
  try { if (!navigator.sendBeacon?.(`${STORE.api}/api/hit`, new Blob([body], { type: 'text/plain' }))) fetch(`${STORE.api}/api/hit`, { method: 'POST', body, keepalive: true, mode: 'no-cors' }).catch(() => {}); } catch {}
}
