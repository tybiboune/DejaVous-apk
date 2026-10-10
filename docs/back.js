// "Back" links of the secondary pages: when the visitor came from the page the link points to, go back in the history instead of loading
// that page again, so it reappears at the spot it was left (a new load would start at the top).
(() => {
  const norm = u => { const p = new URL(u, location.href).pathname.replace(/\/index\.html$/, '/'); return p.endsWith('/') ? p : p; };
  let from = '';
  try { const r = document.referrer && new URL(document.referrer); if (r && r.origin === location.origin) from = norm(r.href); } catch {}
  if (!from || history.length < 2) return;
  document.querySelectorAll('.sub-nav a, a[data-back]').forEach(a => a.addEventListener('click', e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (norm(a.href) !== from) return;
    e.preventDefault(); history.back();
  }));
})();
