// The invitation of the partner's phone (www/js/invite.js in the app): https://dejanous.love/invitation#v=1&… When the app is installed,
// Android opens the link in it directly (an App Link) and this page never shows. Otherwise: one button to install the app, then, once it
// is installed, "Open the invitation" (this page stays open in the browser): the app then finds everything the link holds (the code of the
// full game, the first names, the couple's stage, the pairing with the inviter's phone). The payload lives in the #fragment: the browser
// never sends it to this site's server, and this page sends it nowhere (no counter, no tracker on this page).
// A link of the Google Play edition carries ?e=play: nothing of the shop, never the APK, never a code (play-safe.js).
import { isPlay, playSafe } from './play-safe.js?v=20261031';
import { STORE } from './store-config.js';

const $ = id => document.getElementById(id);
const T = {
  fr: {
    title: n => `${n} t’invite à jouer`, titleAnon: 'Une invitation à jouer',
    lead: 'Déjà Nous, le jeu de cartes des couples. Chaque personne sur son téléphone, des questions, des paris, et vous saurez enfin qui connaît le mieux l’autre.',
    open: 'Ouvrir l’invitation', openHow: 'L’appli est installée ? Ce bouton l’ouvre, et tout est prêt : rien à taper.',
    install: 'Installer l’appli (Android)', installPlay: 'Installer l’appli depuis Google Play',
    steps: ['Ouvrez le fichier téléchargé (notification ou dossier Téléchargements), puis touchez <b>Installer</b>. Si Android demande d’autoriser votre navigateur : touchez <b>Paramètres</b>, activez <b>Autoriser cette source</b>, puis revenez.', 'Revenez sur cette page et touchez <b>Ouvrir l’invitation</b> : l’appli s’ouvre avec tout ce que contient le lien.'],
    stepsPlay: ['Installez l’appli depuis Google Play.', 'Revenez sur cette page et touchez <b>Ouvrir l’invitation</b> : l’appli s’ouvre avec tout ce que contient le lien.'],
    soon: 'L’appli arrive bientôt sur Google Play.',
    codeT: 'Le lien ne s’ouvre pas dans l’appli ?', codeHow: 'Plan B : dans l’appli, Configuration, « Débloquer le jeu complet », puis collez ce code. Il vaut pour 2 téléphones, pas un de plus.', copy: 'Copier le code', copied: 'Copié ✓',
    badT: 'Invitation incomplète', badP: 'Ce lien est arrivé abîmé (les messageries en coupent parfois un bout). Demandez à la personne qui vous l’a envoyé de vous le renvoyer.',
    privacy: 'Aucun serveur dans l’histoire : l’invitation tient tout entière dans ce lien, et cette page ne l’envoie nulle part.',
    privacyLink: 'Confidentialité', privacyHref: 'privacy.html', legalLink: 'Mentions légales', legalHref: 'mentions-legales.html', home: 'index.html'
  },
  en: {
    title: n => `${n} is inviting you to play`, titleAnon: 'An invitation to play',
    lead: 'Déjà Nous, the card game for couples. Each of you on your own phone, questions, bets, and at last you’ll know who knows the other best.',
    open: 'Open the invitation', openHow: 'Is the app installed? This button opens it, and everything is ready: nothing to type.',
    install: 'Install the app (Android)', installPlay: 'Install the app from Google Play',
    steps: ['Open the downloaded file (notification or Downloads folder), then tap <b>Install</b>. If Android asks you to allow your browser: tap <b>Settings</b>, turn on <b>Allow from this source</b>, then come back.', 'Come back to this page and tap <b>Open the invitation</b>: the app opens with everything the link holds.'],
    stepsPlay: ['Install the app from Google Play.', 'Come back to this page and tap <b>Open the invitation</b>: the app opens with everything the link holds.'],
    soon: 'The app is coming to Google Play soon.',
    codeT: 'The link doesn’t open in the app?', codeHow: 'Plan B: in the app, Settings, “Unlock the full game”, then paste this code. It covers 2 phones, not one more.', copy: 'Copy the code', copied: 'Copied ✓',
    badT: 'Incomplete invitation', badP: 'This link arrived damaged (messaging apps sometimes cut off a piece). Ask the person who sent it to send it again.',
    privacy: 'No server involved: the whole invitation fits inside this link, and this page sends it nowhere.',
    privacyLink: 'Privacy', privacyHref: 'privacy-en.html', legalLink: 'Legal notice', legalHref: 'legal-en.html', home: 'en.html'
  }
};
const CODE = /^DV1\.[A-Za-z0-9_-]{60,160}$/;
// The same strict reading as the app (invite.js parseInvite), for what this page shows: the language, the inviter's first name, the code.
export function readInvite(hash) {
  let p; try { p = new URLSearchParams(String(hash || '').replace(/^#/, '')); } catch { return null; }
  if (p.get('v') !== '1') return null;
  const code = p.get('c') || '';
  if (code && !CODE.test(code)) return null;
  const from = String(p.get('f') || '').replace(/[<>\n\r\t"`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 18);
  return { lang: p.get('l') === 'en' ? 'en' : 'fr', from, code: code || null };
}

export function showInvite() {
  const inv = readInvite(location.hash), play = isPlay(), L = T[inv?.lang ?? (navigator.language?.startsWith('fr') ? 'fr' : 'en')];
  document.documentElement.lang = inv?.lang ?? document.documentElement.lang;
  $('inv-privacy').textContent = L.privacy;
  $('inv-privacy-link').textContent = L.privacyLink; $('inv-privacy-link').href = L.privacyHref;
  $('inv-legal-link').textContent = L.legalLink; $('inv-legal-link').href = L.legalHref;
  $('inv-home').href = L.home;
  if (!inv) { $('inv-bad').hidden = false; $('inv-bad-t').textContent = L.badT; $('inv-bad-p').textContent = L.badP; return playSafe(); }
  $('inv-title').textContent = inv.from ? L.title(inv.from) : L.titleAnon;
  $('inv-lead').textContent = L.lead;
  $('inv-go').hidden = false;
  const open = $('inv-open'); open.textContent = L.open; open.href = 'dejavous://invitation#' + location.hash.replace(/^#/, '');
  $('inv-open-how').textContent = L.openHow;
  const install = $('inv-install'), store = play ? STORE.play : STORE.apk;
  if (store) { install.href = store; install.textContent = play ? L.installPlay : L.install; $('inv-steps').innerHTML = (play ? L.stepsPlay : L.steps).map(s => `<li>${s}</li>`).join(''); }
  else { install.remove(); $('inv-steps').remove(); $('inv-soon').hidden = false; $('inv-soon').textContent = L.soon; }
  if (inv.code && !play) { // the code, clearly, for a phone where the link does not reach the app (direct edition only)
    $('inv-code').hidden = false; $('inv-code-t').textContent = L.codeT; $('inv-code-how').textContent = L.codeHow; $('inv-code-v').textContent = inv.code;
    const b = $('inv-copy'); b.textContent = L.copy; b.onclick = async () => { try { await navigator.clipboard.writeText(inv.code); b.textContent = L.copied; } catch {} };
  }
  playSafe();
}
if (typeof document !== 'undefined' && document.getElementById?.('inv-go')) showInvite();
