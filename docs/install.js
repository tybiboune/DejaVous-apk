import { hit } from './hit.js';
import { STORE } from './store-config.js';

// The install sheet: opens on every link to the APK. On a phone the download goes on and the sheet walks through Android's three screens,
// with the evening code to type at the end. On a computer it shows a QR code (made in the page, no outside service) to continue on the phone.
const en = document.documentElement.lang === 'en';
const T = en ? {
  title: 'Three taps and you’re in', steps: ['The download starts. Open <b>deja-vous.apk</b> (notification or Downloads folder).', 'Android asks to allow your browser: tap <b>Settings</b>, turn on <b>Allow from this source</b>, come back.', 'Tap <b>Install</b>, then <b>Open</b>.'],
  code: c => `Type your evening code <b class="code">${c}</b>: the sealed round 4 opens first.`, copy: 'Copy the code', copied: 'Copied',
  already: 'Already installed? Open it directly', trust: 'Signed APK · SHA-256 fingerprint published · no account · refunded within 14 days if you buy and change your mind',
  desk: 'You’re on a computer', deskHelp: 'Scan with your Android phone: the page opens there, ready to install.', anyway: 'Download the file anyway', send: 'Copy the link for my phone', close: 'Close'
} : {
  title: 'Trois gestes et c’est parti', steps: ['Le téléchargement démarre. Ouvrez <b>deja-vous.apk</b> (notification ou dossier Téléchargements).', 'Android demande d’autoriser votre navigateur : touchez <b>Paramètres</b>, activez <b>Autoriser cette source</b>, revenez.', 'Touchez <b>Installer</b>, puis <b>Ouvrir</b>.'],
  code: c => `Saisissez votre code soirée <b class="code">${c}</b> : la manche 4 scellée s’ouvre en premier.`, copy: 'Copier le code', copied: 'Copié',
  already: 'Déjà installée ? L’ouvrir directement', trust: 'APK signé · empreinte SHA-256 publiée · aucun compte · remboursé sous 14 jours si vous achetez et changez d’avis',
  desk: 'Vous êtes sur ordinateur', deskHelp: 'Scannez avec votre téléphone Android : la page s’y ouvre, prête à installer.', anyway: 'Télécharger le fichier quand même', send: 'Copier le lien pour mon téléphone', close: 'Fermer'
};
const evening = () => { try { return JSON.parse(localStorage.getItem('dv-demo') || 'null')?.code || new URLSearchParams(location.search).get('code') || ''; } catch { return ''; } };
const onPhone = () => /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || matchMedia('(pointer: coarse)').matches;
const phoneUrl = code => { const u = new URL(en ? 'en.html' : 'index.html', location.href); u.search = code ? `code=${code}` : ''; u.hash = 'telecharger'; return u.href; };
let qrLoad;
const loadQr = () => qrLoad ??= new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'vendor/qrcode.js'; s.onload = () => ok(window.qrcode); s.onerror = ko; document.head.append(s); });
async function qrSvg(text) {
  const make = await loadQr(), q = make(0, 'M'); q.addData(text); q.make();
  return q.createSvgTag({ cellSize: 5, margin: 2, scalable: true });
}

let dialog;
function sheet(desktop) {
  dialog?.remove();
  const code = /^[2-9A-HJ-NP-Z]{4}$/.test(evening()) ? evening() : '';
  dialog = document.createElement('dialog'); dialog.className = 'install-sheet'; dialog.setAttribute('aria-labelledby', 'install-title');
  dialog.innerHTML = desktop
    ? `<h2 id="install-title">${T.desk}</h2><p>${T.deskHelp}</p><div class="install-qr" aria-hidden="true"></div>${code ? `<p class="install-code">${T.code(code)}</p>` : ''}
       <div class="install-actions"><button type="button" class="button button-primary" data-copy-link>${T.send}</button><a class="text-action" href="${STORE.apk}" data-anyway>${T.anyway}</a></div><p class="install-trust">${T.trust}</p><button type="button" class="install-close" aria-label="${T.close}">×</button>`
    : `<h2 id="install-title">${T.title}</h2><ol class="install-steps">${T.steps.map(s => `<li>${s}</li>`).join('')}${code ? `<li>${T.code(code)} <button type="button" class="text-action" data-copy-code>${T.copy}</button></li>` : ''}</ol>
       ${code ? `<p><a class="text-action" href="dejavous://code/${code}">${T.already}</a></p>` : ''}<p class="install-trust">${T.trust}</p><button type="button" class="button button-primary install-ok">OK</button><button type="button" class="install-close" aria-label="${T.close}">×</button>`;
  document.body.append(dialog);
  dialog.querySelectorAll('.install-close, .install-ok').forEach(b => b.onclick = () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.querySelector('[data-copy-code]')?.addEventListener('click', e => navigator.clipboard?.writeText(code).then(() => { e.target.textContent = T.copied; }).catch(() => {}));
  dialog.querySelector('[data-copy-link]')?.addEventListener('click', e => navigator.clipboard?.writeText(phoneUrl(code)).then(() => { e.target.textContent = T.copied; }).catch(() => {}));
  dialog.querySelector('[data-anyway]')?.addEventListener('click', () => dialog.close());
  if (desktop) { hit('qr_show'); qrSvg(phoneUrl(code)).then(svg => { dialog.querySelector('.install-qr').innerHTML = svg; }).catch(() => {}); }
  if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
  hit('install_sheet');
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href$="deja-vous.apk"]');
  if (!a || a.hasAttribute('data-anyway')) return;
  hit('install_click');
  if (!onPhone()) { e.preventDefault(); sheet(true); return; }
  setTimeout(() => sheet(false), 300); // the download goes on; the sheet explains what Android is about to ask
});
// Arriving from the QR code: the evening code is in the address; it waits in this browser for the app.
try { const c = new URLSearchParams(location.search).get('code'); if (/^[2-9A-HJ-NP-Z]{4}$/.test(c || '')) { const d = JSON.parse(localStorage.getItem('dv-demo') || '{}'); localStorage.setItem('dv-demo', JSON.stringify({ ...d, code: c, ts: Date.now() })); hit('code_return'); } } catch {}
