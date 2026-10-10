// Keeps the visitor's place on the home page when they leave it for a secondary page and come back.
//  - Back link, same page they came from: go back in the history (the browser puts the page back exactly where it was).
//  - Otherwise (they switched language on the secondary page, or arrived from elsewhere): the home page remembers which section was on
//    screen when it was left and, in either language, comes back to that section (both languages have the same sections in the same order).
(() => {
  const KEY = 'dv-home-pos', RESTORE = 'dv-home-restore';
  const get = k => { try { return sessionStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch {} };
  const sections = () => [...document.querySelectorAll('main > section')];

  if (document.querySelector('main#top')) { // a home page (French or English)
    const save = () => {
      const list = sections(), y = scrollY + 1;
      let i = 0; list.forEach((s, n) => { if (s.offsetTop <= y) i = n; });
      if (list[i]) set(KEY, JSON.stringify({ i, off: Math.max(0, Math.round(y - list[i].offsetTop)) }));
    };
    addEventListener('pagehide', save);
    if (get(RESTORE) === '1') { // the visitor comes back from a secondary page by a link, not by the browser's back button
      set(RESTORE, null);
      const pos = JSON.parse(get(KEY) || 'null');
      const go = () => { const s = sections()[pos?.i]; if (s) scrollTo({ top: s.offsetTop + (pos.off || 0), behavior: 'instant' }); };
      if (pos) { history.scrollRestoration = 'manual'; addEventListener('load', () => { go(); requestAnimationFrame(go); }); if (document.readyState === 'complete') go(); }
    }
    return;
  }

  // a secondary page: its back links
  const norm = u => new URL(u, location.href).pathname.replace(/\/index\.html$/, '/');
  let from = '';
  try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin) from = norm(r.href); } catch {}
  document.querySelectorAll('.sub-nav a, a[data-back]').forEach(a => a.addEventListener('click', e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const toHome = /\/(index\.html|en\.html)?$/.test(norm(a.href));
    if (from && history.length > 1 && norm(a.href) === from) { e.preventDefault(); history.back(); return; }
    if (toHome && get(KEY)) { set(RESTORE, '1'); a.href = a.href.split('#')[0]; } // the saved section replaces the link's own anchor
  }));
})();
