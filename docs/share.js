// A share panel inside the page instead of the system share window: the message as the other person will read it, then one
// button per way of sending it (WhatsApp, SMS, Telegram, e-mail, copy). Nothing leaves the page until a button is touched.
const ICONS = {
  whatsapp: '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M8.8 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.1-.2.3 0 .5.3.6.8 1.2 1.4 1.7.6.5 1.2.8 1.6 1 .2.1.4 0 .5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .6-.3 1.3-.8 1.6-.5.3-1.4.5-2.6.1a9 9 0 0 1-4.9-4.4c-.6-1.1-.6-2.1-.3-2.6Z"/>',
  sms: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
  telegram: '<path d="M21 4 3 11l6 2.2L18 7l-7 7.6.3 5.4 3-3.6 4 2.6L21 4Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
};
const L = {
  fr: { title: 'Votre message', hint: 'Choisissez comment l’envoyer :', copy: 'Copier', copied: 'Copié ✓', mail: 'E-mail' },
  en: { title: 'Your message', hint: 'Choose how to send it:', copy: 'Copy', copied: 'Copied ✓', mail: 'E-mail' },
};
const icon = name => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// button: the one that opens the panel (placed right after it); message(): { text, subject } built when it opens (the code may come late)
export function sharePanel(button, message, lang = 'fr') {
  const t = L[lang] ?? L.fr, panel = document.createElement('div');
  panel.className = 'mc-share'; panel.hidden = true; panel.id = button.id + '-share';
  button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-controls', panel.id);
  (button.closest('.mc-actions') ?? button).after(panel);
  button.addEventListener('click', () => {
    const open = panel.hidden; panel.hidden = !open; button.setAttribute('aria-expanded', String(open));
    if (!open) return;
    const { text, subject } = message(), enc = encodeURIComponent, url = (text.match(/https:\/\/\S+/) ?? [''])[0];
    const ways = [
      ['whatsapp', 'WhatsApp', `https://wa.me/?text=${enc(text)}`],
      ['sms', 'SMS', `sms:?&body=${enc(text)}`],
      ['telegram', 'Telegram', `https://t.me/share/url?url=${enc(url)}&text=${enc(text.replace(url, '').trim())}`],
      ['mail', t.mail, `mailto:?subject=${enc(subject)}&body=${enc(text)}`],
    ];
    panel.innerHTML = `<span class="mc-share-title">${t.title}</span><p class="mc-bubble"></p><span class="mc-share-hint">${t.hint}</span><div class="mc-share-apps">`
      + ways.map(([k, label, href]) => `<a class="mc-app mc-${k}" href="${href}"${href.startsWith('https:') ? ' target="_blank" rel="noopener"' : ''}>${icon(k)}<span>${label}</span></a>`).join('')
      + `<button class="mc-app mc-copy" type="button">${icon('copy')}<span>${t.copy}</span></button></div>`;
    panel.querySelector('.mc-bubble').textContent = text;
    const copy = panel.querySelector('.mc-copy');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(text); } catch { const s = getSelection(), r = document.createRange(); r.selectNodeContents(panel.querySelector('.mc-bubble')); s.removeAllRanges(); s.addRange(r); return; }
      copy.querySelector('span').textContent = t.copied; setTimeout(() => { copy.querySelector('span').textContent = t.copy; }, 2500);
    });
    panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}
