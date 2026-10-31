// "Le Fil" (The Thread): a thread link sent from the app (https://tybiboune.github.io/DejaVous-apk/fil#<payload>) lands here. The page
// shows who sent it and the question, then hands the link to the app (dejavous://fil/<payload>; an Android intent with a fallback to the
// download page when the app is missing). The payload lives in the #fragment: the browser never sends it to this site's server, and this
// page sends it nowhere either (no counter, no tracker on this page). The answers in it stay scrambled: only the app reveals them.
// Payload format: see www/js/fil.js in the app. The page never shows the card itself: the game's cards are not published on this site.
// The same address also carries a "Défi chrono" (a timed challenge of Du tac au tac, www/js/tac-duel.js): its payload starts with 'T-'.
// The page then says only who sent it and that ten cards wait in the app: no card, no answer, no score.

const $ = id => document.getElementById(id);
const T = {
  fr: {
    title: n => `${n} t’a tendu un fil`, titleAnon: 'On t’a tendu un fil', replyTitle: n => `${n} a répondu à ton fil`, replyAnon: 'Ton fil est revenu',
    lead: 'Une question du jour, à deux, chaque personne sur son téléphone : tu réponds, tu devines sa réponse, puis vous découvrez qui a deviné juste.',
    replyLead: 'Ouvre-le dans l’appli pour découvrir les réponses et qui a deviné juste.',
    kicker: 'La question du jour', hidden: n => `${n} a déjà répondu en secret. Sa réponse se dévoile dans l’appli, une fois la tienne verrouillée.`, someone: 'L’autre',
    playQ: 'La question t’attend dans l’appli.',
    open: 'Ouvrir dans Déjà Nous', copy: 'Copier le lien', copied: 'Lien copié ✓',
    install: 'Pas encore l’appli ? <a href="index.html#telecharger">Installe Déjà Nous</a> (Android, découverte gratuite), puis touche à nouveau ce bouton.',
    paste: 'Si le bouton n’ouvre rien : copie le lien, puis dans l’appli, Le Fil → « Tu as reçu un lien ? ».',
    badT: 'Fil emmêlé', badP: 'Ce lien est incomplet ou abîmé (les messageries le coupent parfois). Demande à la personne qui te l’a envoyé de le renvoyer.', badHome: 'Découvrir Déjà Nous',
    privacy: 'Rien ne passe par un serveur : ce lien porte le numéro de la question et les réponses (brouillées), et cette page ne les envoie nulle part.',
    foot: 'Le jeu de cartes des couples.', privacyLink: 'Confidentialité', privacyHref: 'privacy.html', cgvLink: 'CGV', cgvHref: 'cgv.html', legalLink: 'Mentions légales', legalHref: 'mentions-legales.html', home: 'index.html', badge: 'LE FIL',
    duelBadge: 'DÉFI CHRONO', duelTitle: n => `${n} te lance un défi chrono`, duelAnon: 'On te lance un défi chrono',
    duelReplyTitle: n => `${n} a relevé ton défi chrono`, duelReplyAnon: 'Ton défi chrono est revenu',
    duelLead: 'Des cartes vrai ou faux, à toute vitesse : d’abord tes réponses, puis tu devines les siennes. Le verdict s’affiche dans l’appli, pour vous deux.',
    duelReplyLead: 'Ouvre-le dans l’appli pour voir le verdict.'
  },
  en: {
    title: n => `${n} sent you a thread`, titleAnon: 'Someone sent you a thread', replyTitle: n => `${n} answered your thread`, replyAnon: 'Your thread came back',
    lead: 'One question of the day, for two, each on your own phone: you answer, you guess their answer, then you both find out who guessed right.',
    replyLead: 'Open it in the app to see the answers and who guessed right.',
    kicker: 'Today’s question', hidden: n => `${n} already answered in secret. Their answer shows in the app once you lock yours.`, someone: 'They',
    playQ: 'The question is waiting for you in the app.',
    open: 'Open in Déjà Nous', copy: 'Copy the link', copied: 'Link copied ✓',
    install: 'Don’t have the app yet? <a href="en.html#telecharger">Install Déjà Nous</a> (Android, free Discovery), then tap this button again.',
    paste: 'If the button opens nothing: copy the link, then in the app, The Thread → “Got a link?”.',
    badT: 'Tangled thread', badP: 'This link is incomplete or damaged (messaging apps sometimes cut it). Ask the person who sent it to send it again.', badHome: 'Discover Déjà Nous',
    privacy: 'Nothing goes through a server: this link carries the question number and the (scrambled) answers, and this page sends them nowhere.',
    foot: 'The card game for couples.', privacyLink: 'Privacy', privacyHref: 'privacy-en.html', cgvLink: 'Terms of sale', cgvHref: 'cgv-en.html', legalLink: 'Legal notice', legalHref: 'legal-en.html', home: 'en.html', badge: 'THE THREAD',
    duelBadge: 'TIMED CHALLENGE', duelTitle: n => `${n} sent you a timed challenge`, duelAnon: 'Someone sent you a timed challenge',
    duelReplyTitle: n => `${n} took on your timed challenge`, duelReplyAnon: 'Your timed challenge came back',
    duelLead: 'True-or-false cards at full speed: first your own answers, then you guess theirs. The verdict shows in the app, for both of you.',
    duelReplyLead: 'Open it in the app to see the verdict.'
  }
};

// The same strict reading as the app (fil.js decodeFil), without the answers: what the page shows comes from here only.
function read(hash) {
  const text = String(hash || '').replace(/^#/, '');
  if (!/^[A-Za-z0-9_-]{20,2000}$/.test(text)) return null;
  try {
    const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4));
    const p = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
    const e = typeof p?.e === 'string' && /^(direct|play):(\d{1,5})$/.exec(p.e);
    if (p?.v !== 1 || typeof p.id !== 'string' || !/^[A-Za-z0-9]{8}$/.test(p.id) || !Number.isInteger(p.c) || p.c < 0 || !e || p.c >= +e[2]) return null;
    if (p.l !== 'fr' && p.l !== 'en') return null;
    if (typeof p.n !== 'string' || [...p.n].length > 24 || typeof p.s !== 'string' || (p.r !== undefined && typeof p.r !== 'string')) return null;
    return { text, card: p.c, lang: p.l, name: p.n.trim(), reply: p.r !== undefined, edition: e[1] };
  } catch { return null; }
}

// A "Défi chrono" ('T-' + base64url bytes, see tac-duel.js): the same checks as the app on what the page uses (version, check byte,
// the sender's name); the cards and the answers that follow are never read here.
function readDuel(hash) {
  const text = String(hash || '').replace(/^#/, '');
  if (!/^T-[A-Za-z0-9_-]{16,1000}$/.test(text)) return null;
  try {
    const raw = text.slice(2), bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((raw.length + 3) % 4)), b = Uint8Array.from(bin, c => c.charCodeAt(0));
    let h = 2166136261; for (const x of b.subarray(0, b.length - 1)) h = Math.imul(h ^ x, 16777619); h >>>= 0;
    if (((h ^ (h >>> 8) ^ (h >>> 16) ^ (h >>> 24)) & 255) !== b[b.length - 1] || b[0] !== 1) return null;
    const flags = b[7], n = b[8], at = 9 + 2 * n, len = b[at];
    if (n < 5 || n > 20 || len > 96 || at + 1 + len > b.length - 1) return null;
    const name = new TextDecoder('utf-8', { fatal: true }).decode(b.subarray(at + 1, at + 1 + len));
    return { text, duel: true, lang: flags & 1 ? 'en' : 'fr', name: name.trim(), reply: !!(flags & 4) };
  } catch { return null; }
}

const link = readDuel(location.hash) ?? read(location.hash);
let lang = link?.lang ?? (navigator.language?.startsWith('fr') ? 'fr' : 'en');
const android = /Android/i.test(navigator.userAgent);
const APK_PAGE = l => `https://tybiboune.github.io/DejaVous-apk/${l === 'en' ? 'en.html' : 'index.html'}#telecharger`;
const appLink = l => android
  ? `intent://fil/${link.text}#Intent;scheme=dejavous;package=fr.dejavous.app;S.browser_fallback_url=${encodeURIComponent(APK_PAGE(l))};end`
  : `dejavous://fil/${link.text}`;

function paint() {
  const L = T[lang];
  document.documentElement.lang = lang;
  for (const a of document.querySelectorAll('[data-fil-lang]')) a.dataset.filLang === lang ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  $('fil-badge').textContent = link?.duel ? L.duelBadge : L.badge;
  $('fil-home').href = L.home; $('fil-privacy').textContent = L.privacy; $('fil-foot').textContent = L.foot;
  $('fil-privacy-link').textContent = L.privacyLink; $('fil-privacy-link').href = L.privacyHref;
  for (const [id, text, href] of [['fil-cgv-link', L.cgvLink, L.cgvHref], ['fil-legal-link', L.legalLink, L.legalHref]]) { const a = $(id); if (a) { a.textContent = text; a.href = href; } }
  if (!link) {
    $('fil-title').textContent = L.badT; $('fil-lead').textContent = '';
    $('fil-bad').hidden = false; $('fil-bad-t').hidden = true; $('fil-bad-p').textContent = L.badP;
    $('fil-bad-home').textContent = L.badHome; $('fil-bad-home').href = L.home;
    document.title = `${L.badT} — Déjà Nous`;
    return;
  }
  const who = link.name || L.someone;
  if (link.duel) { // a timed challenge: who sent it, nothing of its cards
    $('fil-title').textContent = link.reply ? (link.name ? L.duelReplyTitle(link.name) : L.duelReplyAnon) : (link.name ? L.duelTitle(link.name) : L.duelAnon);
    $('fil-lead').textContent = link.reply ? L.duelReplyLead : L.duelLead;
  } else $('fil-title').textContent = link.reply ? (link.name ? L.replyTitle(link.name) : L.replyAnon) : (link.name ? L.title(link.name) : L.titleAnon);
  if (!link.duel) $('fil-lead').textContent = link.reply ? L.replyLead : L.lead;
  document.title = `${$('fil-title').textContent} — Déjà Nous`;
  // the question stays in the app (the cards are not published on the site): the page only says one is waiting
  const card = null;
  if (!link.reply && !link.duel) {
    $('fil-card').hidden = false;
    $('fil-kicker').textContent = L.kicker;
    $('fil-q').textContent = card ? card[lang] : L.playQ;
    $('fil-hidden').textContent = L.hidden(who);
  }
  $('fil-go').hidden = false;
  $('fil-open').textContent = L.open; $('fil-open').href = appLink(lang);
  $('fil-copy').textContent = L.copy;
  $('fil-install').innerHTML = L.install;
  $('fil-paste').textContent = L.paste;
}

for (const a of document.querySelectorAll('[data-fil-lang]')) a.addEventListener('click', e => { e.preventDefault(); lang = a.dataset.filLang; paint(); });
$('fil-copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); $('fil-copy').textContent = T[lang].copied; } catch { prompt('', location.href); }
});
paint();
