// Audience measurement of the site, first party, no cookie (privacy.html, "Sur ce site"). Each event goes to this site's own server
// (POST /m, src/site/worker.js), which writes one anonymous row: the event, the page, the language, the headline variant, where the
// visit came from (the site that linked here, the utm_* of a campaign link), the kind of screen, the country (from the network, never
// the address), and a visit number drawn at random in this tab and forgotten when it closes (sessionStorage): it links the steps of one
// visit, never two visits, never a person. Off when the browser asks not to be tracked (Global Privacy Control, Do Not Track).
const EVENTS = new Set(['view', 'demo_start', 'demo_done', 'sealed_seen', 'invite_create', 'invite_open', 'invite_answer', 'play_click',
  'intent_play', 'intent_gift', 'intent_surprise', 'card_make', 'card_share', 'scroll', 'section', 'faq_open', 'leave', 'lang_switch', 'link_out']);
const quiet = () => navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1';
const rand = () => { try { return [...crypto.getRandomValues(new Uint8Array(9))].map(b => b.toString(36).padStart(2, '0')).join('').slice(0, 16); } catch { return Math.random().toString(36).slice(2, 18); } };
const store = (() => { try { return window.sessionStorage; } catch { return null; } })();
const get = k => { try { return store?.getItem(k) ?? null; } catch { return null; } };
const set = (k, v) => { try { store?.setItem(k, v); } catch {} };

// A/B test of the headline: a random letter kept in this browser (it never leaves it except as "a" or "b" in an event).
export const variant = (() => { try { let v = localStorage.getItem('dv-ab'); if (v !== 'a' && v !== 'b') { v = Math.random() < .5 ? 'a' : 'b'; localStorage.setItem('dv-ab', v); } return v; } catch { return 'a'; } })();

const page = (() => { const m = /^\/([A-Za-z0-9_-]*?)(?:\.html)?\/?$/.exec(location.pathname); return m ? m[1] || 'index' : 'other'; })();
// the visit: its number, the page it started on and where it came from, fixed on its first page
export const visit = (() => {
  let id = get('dv-visit'), from = null;
  try { from = JSON.parse(get('dv-from') ?? 'null'); } catch {}
  if (!id || !from) {
    id = rand();
    const q = new URLSearchParams(location.search), ref = (() => { try { const u = new URL(document.referrer); return u.host === location.host ? '' : u.host.replace(/^www\./, ''); } catch { return ''; } })();
    from = { r: ref || (q.get('e') === 'play' ? 'app' : 'direct'), s: q.get('utm_source') ?? '', m: q.get('utm_medium') ?? '', c: q.get('utm_campaign') ?? '', x: q.get('utm_content') ?? '', land: page };
    set('dv-visit', id); set('dv-from', JSON.stringify(from));
  }
  return { id, from };
})();
const device = () => { const w = Math.min(window.innerWidth || 0, screen?.width || 9999); return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'; };

const sent = new Set();
// hit(event): counted once per page (a demo started twice is one start); { once: false } for steps that repeat (a section, a question).
export function hit(event, { once = true, detail = '', n = 0 } = {}) {
  const key = event + ':' + detail;
  if (!EVENTS.has(event) || quiet() || (once && sent.has(key))) return;
  sent.add(key);
  const body = JSON.stringify({ e: event, d: String(detail).slice(0, 48), n: Math.max(0, Math.round(+n || 0)), p: page, l: document.documentElement.lang === 'en' ? 'en' : 'fr',
    v: variant, id: visit.id, f: visit.from, dev: device(), w: window.innerWidth || 0 });
  try { if (!navigator.sendBeacon?.('/m', new Blob([body], { type: 'text/plain' }))) fetch('/m', { method: 'POST', body, keepalive: true }).catch(() => {}); } catch {}
}

// The Google Play address with the source of the visit, so that Google Play Console can tell which source brought each install
// (its "acquisition" reports read the utm_* of the referrer parameter). `place` is the button that was used.
export function playLink(base, place = '') {
  const f = visit.from, u = new URL(base);
  const ref = new URLSearchParams({ utm_source: f.s || f.r || 'direct', utm_medium: f.m || 'site', utm_campaign: f.c || 'site', utm_content: [place, variant].filter(Boolean).join('-') });
  u.searchParams.set('referrer', ref.toString());
  return u.toString();
}
