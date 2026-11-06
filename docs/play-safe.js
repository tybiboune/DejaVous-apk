// The pages that a link of the Google Play edition of the app opens: Le Fil, a gift, an invitation, "About" (the privacy page, the legal
// notice, the terms of use). That edition adds the marker ?e=play to every link it shares or opens. The game is sold through Google Play
// only, and these pages name no price and no other way to get it; with the marker a page also keeps its visitor on them:
//   - every element marked data-shop goes (none is left on the site: kept as a safety net);
//   - a link to another of these pages keeps the marker; a link to the home page leads to the neutral page of the app (appli.html);
//   - a link to install the app leads to the Google Play listing (store-config.js `play`), or goes while that address is empty;
//   - any other link of this site goes, and so does a link to a site that sells or hosts files (a payment page, a download);
//   - mailto: and the links that open the app stay (an Android intent keeps a fallback only to the listing).
// A page marked <html data-play-only> (appli.html) is always shown this way. Without the marker nothing changes.
// The site's worker (site/worker.js in the app repository) answers any other page asked with the marker with the neutral page.
import { STORE } from './store-config.js';

export const PLAY_PAGES = ['fil', 'cadeau', 'cadeau-en', 'privacy', 'privacy-en', 'appli', 'appli-en', 'mentions-legales', 'legal-en', 'cgv', 'cgv-en', 'invitation'];
const HOME = { index: 'appli', en: 'appli-en' };
const NO_SHOP_HOST = /(^|\.)(dejanous\.(love|com|fr)|github\.com|github\.io|githubusercontent\.com|stripe\.com)$/i;
const INSTALL = /^#telecharger$/;

export const isPlay = (search = globalThis.location?.search ?? '') => new URLSearchParams(search).get('e') === 'play';

// What a link of a page shown with the marker becomes: the same address, the address with the marker, the listing, or null (it goes).
export function playHref(href, { here = globalThis.location?.href ?? 'https://dejanous.love/', store = STORE.play } = {}) {
  const raw = String(href ?? '').trim();
  if (!raw || raw.startsWith('#')) return raw;
  let u; try { u = new URL(raw, here); } catch { return null; }
  if (u.protocol === 'mailto:' || u.protocol === 'dejavous:') return raw;
  if (u.protocol === 'intent:') return raw.replace(/S\.browser_fallback_url=([^;]*);/, (m, v) => {
    let to = null; try { to = playHref(decodeURIComponent(v), { here, store }); } catch {}
    return to && /^https:\/\//.test(to) ? `S.browser_fallback_url=${encodeURIComponent(to)};` : '';
  });
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (store && u.href === new URL(store).href) return raw;
  const site = u.origin === new URL(here).origin || /^(www\.)?dejanous\.love$/i.test(u.hostname);
  if (!site) return NO_SHOP_HOST.test(u.hostname) ? null : raw; // another site that sells nothing (Google, the CNIL…) stays
  const name = (u.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
  if (INSTALL.test(u.hash)) return store || null;
  const page = HOME[name] ?? name;
  if (!PLAY_PAGES.includes(page)) return null;
  const q = new URLSearchParams(u.search); q.set('e', 'play');
  return `${page}.html?${q}${HOME[name] ? '' : u.hash}`;
}

// Applies the rules above to the page (run again after a script changes its links). play: the caller already knows the link comes
// from the Play edition (Le Fil reads it in the link itself). -> true when the page is shown this way.
export function playSafe(doc = globalThis.document, { play = false, store = STORE.play, here } = {}) {
  if (!doc?.documentElement) return false;
  if (!play && !isPlay() && !doc.documentElement.hasAttribute('data-play-only')) return false;
  doc.documentElement.setAttribute('data-edition', 'play');
  for (const el of [...doc.querySelectorAll('[data-shop]')]) el.remove();
  for (const el of [...doc.querySelectorAll(store ? '[data-play-soon]' : '[data-play-store]')]) el.remove();
  for (const a of [...doc.querySelectorAll('a[href]')]) {
    const href = a.getAttribute('href'), to = playHref(href, { store, ...(here ? { here } : {}) });
    if (to === href) continue;
    if (to !== null) { a.setAttribute('href', to); continue; }
    if (a.classList.contains('ul-btn') || a.closest('nav')) a.remove(); // a button or a menu entry goes
    else a.replaceWith(...a.childNodes);                                 // a link inside a sentence leaves its words
  }
  return true;
}

if (globalThis.document) playSafe();
