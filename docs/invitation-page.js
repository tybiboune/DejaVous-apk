// The invitation of the partner's phone (www/js/invite.js in the app): https://dejanous.love/invitation#v=1&… When the app is installed,
// Android opens the link in it directly (an App Link) and this page never shows. Otherwise: one button to install the app, then, once it
// is installed, "Open the invitation" (this page stays open in the browser): the app then finds everything the link holds (the first
// names, the couple's stage, the pairing with the inviter's phone). The payload lives in the #fragment: the browser never sends it to this
// site's server, and this page sends it nowhere (no counter, no tracker on this page). The app comes from Google Play only: the install
// button leads to the listing once it is published (store-config.js `play`), the page says "soon" before that.
// A link of the Google Play edition carries ?e=play: every other link of the page stays on the pages that edition may open (play-safe.js).
import { playSafe } from './play-safe.js?v=20261106';
import { STORE } from './store-config.js';

const $ = id => document.getElementById(id);
const T = {
  fr: {
    title: n => `${n} t’invite à jouer`, titleAnon: 'Une invitation à jouer',
    lead: 'Déjà Nous, le jeu de société des couples. Chaque personne sur son téléphone, des questions, des paris, et vous saurez enfin qui connaît le mieux l’autre.',
    open: 'Ouvrir l’invitation', openHow: 'L’appli est installée ? Ce bouton l’ouvre, et tout est prêt : rien à taper.',
    install: 'Installer l’appli depuis Google Play',
    steps: ['Installez l’appli depuis Google Play. La Découverte est gratuite.', 'Revenez sur cette page et touchez <b>Ouvrir l’invitation</b> : l’appli s’ouvre avec tout ce que contient le lien.'],
    soon: 'L’appli arrive bientôt sur Google Play.',
    badT: 'Invitation incomplète', badP: 'Ce lien est arrivé abîmé (les messageries en coupent parfois un bout). Demandez à la personne qui vous l’a envoyé de vous le renvoyer.',
    privacy: 'Aucun serveur dans l’histoire : l’invitation tient tout entière dans ce lien, et cette page ne l’envoie nulle part.',
    privacyLink: 'Confidentialité', privacyHref: 'privacy.html', legalLink: 'Mentions légales', legalHref: 'mentions-legales.html', home: 'index.html'
  },
  en: {
    title: n => `${n} is inviting you to play`, titleAnon: 'An invitation to play',
    lead: 'Déjà Nous, game night for couples. Each of you on your own phone, questions, bets, and at last you’ll know who knows the other best.',
    open: 'Open the invitation', openHow: 'Is the app installed? This button opens it, and everything is ready: nothing to type.',
    install: 'Install the app from Google Play',
    steps: ['Install the app from Google Play. Discovery is free.', 'Come back to this page and tap <b>Open the invitation</b>: the app opens with everything the link holds.'],
    soon: 'The app is coming to Google Play soon.',
    badT: 'Incomplete invitation', badP: 'This link arrived damaged (messaging apps sometimes cut off a piece). Ask the person who sent it to send it again.',
    privacy: 'No server involved: the whole invitation fits inside this link, and this page sends it nowhere.',
    privacyLink: 'Privacy', privacyHref: 'privacy-en.html', legalLink: 'Legal notice', legalHref: 'legal-en.html', home: 'en.html'
  }
};
// The same reading as the app (invite.js parseInvite), for what this page shows: the language and the inviter's first name.
export function readInvite(hash) {
  let p; try { p = new URLSearchParams(String(hash || '').replace(/^#/, '')); } catch { return null; }
  if (p.get('v') !== '1') return null;
  const from = String(p.get('f') || '').replace(/[<>\n\r\t"`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 18);
  return { lang: p.get('l') === 'en' ? 'en' : 'fr', from };
}

export function showInvite() {
  const inv = readInvite(location.hash), L = T[inv?.lang ?? (navigator.language?.startsWith('fr') ? 'fr' : 'en')];
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
  const install = $('inv-install');
  if (STORE.play) { install.href = STORE.play; install.textContent = L.install; $('inv-steps').innerHTML = L.steps.map(s => `<li>${s}</li>`).join(''); }
  else { install.remove(); $('inv-steps').remove(); $('inv-soon').hidden = false; $('inv-soon').textContent = L.soon; }
  playSafe();
}
if (typeof document !== 'undefined' && document.getElementById?.('inv-go')) showInvite();
