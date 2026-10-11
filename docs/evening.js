const APK = 'https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk';

// Demo answers live only in memory. Invitations contain a public card id, never an answer or a name.
const en = document.documentElement.lang === 'en';
const C = en ? {
  steps: ['The bet', 'The reflex', 'Your finale'],
  questions: ['Who would get us lost and call it an adventure?', 'Who would win a terrible-dancing contest?', 'Who would adopt a stray animal without thinking twice?'],
  first: 'Player 1: choose in secret.', second: 'Player 2: your turn. Their answer is hidden.',
  players: ['Player 1', 'Player 2'], pass: 'Pass the phone.', hidden: 'Your choice stays hidden until you both answer.', ready: 'My turn', reveal: 'Reveal our answers',
  match: 'Same brain. Suspiciously good.', different: 'Two versions of the same story.',
  brainNote: 'Same Brain: answer separately, reveal together.', next: 'Next round →',
  rapid: 'A weekend together: sea or mountains?', rapidHelp: 'Pick by instinct. Then pass the phone.', choices: ['Sea', 'Mountains'],
  rapidMatch: 'Same destination. Pack your bags.', rapidDifferent: 'You have a weekend to negotiate.',
  rapidNote: 'Rapid Fire: two choices, two instincts. Nothing to calculate.',
  final: 'Your finale. Make it real.', finalHelp: 'Choose a little promise to keep tonight, together.',
  promises: ['One song. One terrible dance.', 'Ten minutes with the phones put away.', 'Plan your next date together.'],
  done: 'Three rounds. One evening already different.', doneHelp: 'No relationship score. Just three moments you made together.',
  commitment: 'Your promise for tonight:', offer: 'Want a whole night of this?', offerHelp: 'Install Discovery for free on Android. One purchase then unlocks the whole game on 2 phones: yours and your partner’s.',
  offerButton: 'Download for free · Android', offerBuy: 'Unlock everything for two · €34.90', replay: 'Play again', share: 'Prepare a surprise',
  surpriseTitle: 'A bet to send. A night to look forward to.', surpriseHelp: 'Pick a card. Your partner opens the link and can start the three-round demo. No install needed.',
  send: 'Share the invitation', copy: 'Copy the invitation', copied: 'Invitation copied.', fallback: 'Copy this invitation and send it yourself:',
  message: q => `I bet I know your answer: “${q}” Shall we find out together?`,
  status: 'Demo only: answers stay on this page and disappear when it closes.',
  shared: 'You received a bet. Ready to surprise them?', together: 'Play together', back: 'Back to the card',
} : {
  steps: ['Le pari', 'Le réflexe', 'Votre final'],
  questions: ['Qui nous perdrait en chemin et appellerait ça une aventure ?', 'Qui gagnerait un concours de mauvaise danse ?', 'Qui adopterait un animal errant sans réfléchir ?'],
  first: 'Personne 1 : choisissez en secret.', second: 'Personne 2 : à vous. Sa réponse est cachée.',
  players: ['Personne 1', 'Personne 2'], pass: 'Passez le téléphone.', hidden: 'Votre choix reste caché jusqu’à ce que vous ayez répondu tous les deux.', ready: 'À mon tour', reveal: 'Révéler nos réponses',
  match: 'Même cerveau. C’est presque suspect.', different: 'Deux versions de la même histoire.',
  brainNote: 'Même cerveau : répondez séparément, révélez ensemble.', next: 'La manche suivante →',
  rapid: 'Un week-end à deux : mer ou montagne ?', rapidHelp: 'Choisissez à l’instinct. Puis passez le téléphone.', choices: ['Mer', 'Montagne'],
  rapidMatch: 'Même destination. Faites les valises.', rapidDifferent: 'Vous avez un week-end à négocier.',
  rapidNote: 'Tir rapide : deux choix, deux instincts. Rien à calculer.',
  final: 'Votre final. Pour de vrai.', finalHelp: 'Choisissez ensemble une petite promesse à tenir ce soir.',
  promises: ['Une chanson. Une danse catastrophique.', 'Dix minutes avec les téléphones rangés.', 'Imaginer votre prochain rendez-vous.'],
  done: 'Trois manches. Une soirée déjà différente.', doneHelp: 'Pas de note sur votre couple. Juste trois moments que vous avez créés à deux.',
  commitment: 'Votre promesse pour ce soir :', offer: 'On continue toute la soirée ?', offerHelp: 'Installez Découverte gratuitement sur Android. Un achat unique débloque ensuite tout le jeu sur 2 téléphones : le vôtre et celui de l’autre.',
  offerButton: 'Télécharger gratuitement · Android', offerBuy: 'Tout débloquer pour deux · 34,90 €', replay: 'Rejouer', share: 'Préparer une surprise',
  surpriseTitle: 'Un pari à envoyer. Une soirée à attendre.', surpriseHelp: 'Choisissez une carte. Votre partenaire ouvre le lien et peut commencer la démo en trois manches. Rien à installer.',
  send: 'Partager l’invitation', copy: 'Copier l’invitation', copied: 'Invitation copiée.', fallback: 'Copiez cette invitation pour l’envoyer vous-même :',
  message: q => `Je parie que je connais ta réponse : « ${q} » On vérifie ensemble ?`,
  status: 'Démo uniquement : vos réponses restent sur cette page et disparaissent quand elle se ferme.',
  shared: 'On vous a envoyé un pari. Prêt·e à surprendre l’autre ?', together: 'Jouer à deux', back: 'Revenir à la carte',
};
const stage = document.querySelector('#evening-stage');
const progress = document.querySelector('#evening-progress');
const shop = en ? 'unleashed-en.html' : 'unleashed.html';
const invitation = new URLSearchParams(location.search).get('invite');
let card = /^[0-2]$/.test(invitation || '') ? Number(invitation) : 0;
let round = 0, answers = [];

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
function action(parent, text, fn, cls = 'evening-button') { const b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', fn); parent.append(b); return b; }
function link(parent, text, href, cls = 'button button-primary') { const a = el('a', cls, text); a.href = href; parent.append(a); return a; }
function draw(title, help, label = C.steps[round]) {
  progress.hidden = false;
  stage.replaceChildren(el('p', 'evening-kicker', label), el('h2', '', title));
  if (help) stage.append(el('p', 'evening-help', help));
  progress.replaceChildren();
  C.steps.forEach((text, i) => { const step = el('li', i < round ? 'done' : i === round ? 'current' : '', `${i < round ? '✓' : i + 1} · ${text}`); if (i === round && round < 3) step.setAttribute('aria-current', 'step'); progress.append(step); });
  stage.classList.remove('dealt'); requestAnimationFrame(() => stage.classList.add('dealt'));
}
function focusStage() { stage.focus({ preventScroll: true }); }
function ask(player = 0, moved = false) {
  draw(round === 0 ? C.questions[card] : C.rapid, player === 0 ? (round === 0 ? C.first : C.rapidHelp) : C.second);
  const choices = el('div', 'evening-choices');
  (round === 0 ? C.players : C.choices).forEach((text, choice) => action(choices, text, () => {
    answers.push(choice);
    if (player === 0) {
      draw(C.pass, C.hidden);
      action(stage, C.ready, () => ask(1, true));
    } else {
      draw(C.reveal, en ? 'Both choices are locked in.' : 'Vos deux choix sont prêts.');
      action(stage, C.reveal, result);
    }
    focusStage();
  })); stage.append(choices);
  if (moved) focusStage();
}
function result() {
  const match = answers[0] === answers[1];
  draw(round === 0 ? (match ? C.match : C.different) : (match ? C.rapidMatch : C.rapidDifferent), round === 0 ? C.brainNote : C.rapidNote);
  const list = round === 0 ? C.players : C.choices;
  const result = el('div', 'evening-result');
  answers.forEach((answer, i) => result.append(el('span', '', `${C.players[i]} → ${list[answer]}`))); stage.append(result);
  action(stage, C.next, () => { answers = []; round++; round === 2 ? finale() : ask(0, true); focusStage(); });
}
function finale() {
  draw(C.final, C.finalHelp);
  const choices = el('div', 'evening-choices promises');
  C.promises.forEach(promise => action(choices, promise, () => finish(promise))); stage.append(choices);
}
function finish(promise) {
  round = 3; draw(C.done, C.doneHelp, en ? 'DEMO COMPLETE · YOUR NIGHT IS YOURS' : 'DÉMO TERMINÉE · LA SOIRÉE EST À VOUS');
  stage.append(el('p', 'evening-help', C.commitment), el('strong', 'evening-promise', promise), el('h3', '', C.offer), el('p', 'evening-help', C.offerHelp));
  link(stage, C.offerButton, APK);
  link(stage, C.offerBuy, `${shop}#acheter`, 'evening-buy');
  const tools = el('div', 'evening-tools'); action(tools, C.replay, () => { round = 0; answers = []; ask(0, true); }, 'text-action'); action(tools, C.share, showSurprise, 'text-action'); stage.append(tools); focusStage();
}
function inviteUrl() { const u = new URL(en ? 'en.html' : 'index.html', location.href); u.search = `invite=${card}`; u.hash = 'essayer'; return u.href; }
function shareText() { return `${C.message(C.questions[card])}\n${inviteUrl()}`; }
function showSurprise() {
  draw(C.surpriseTitle, C.surpriseHelp, en ? 'PREPARE A SURPRISE' : 'PRÉPAREZ UNE SURPRISE');
  progress.hidden = true;
  const cards = el('div', 'evening-choices promises');
  C.questions.forEach((q, i) => { const b = action(cards, q, () => { card = i; showSurprise(); focusStage(); }); b.setAttribute('aria-pressed', String(i === card)); }); stage.append(cards);
  const preview = el('blockquote', 'invite-preview', C.message(C.questions[card])); stage.append(preview);
  const tools = el('div', 'evening-tools');
  const status = el('p', 'evening-note'); status.setAttribute('role', 'status');
  const fallback = el('textarea', 'invite-fallback'); fallback.readOnly = true; fallback.hidden = true; fallback.setAttribute('aria-label', C.fallback);
  async function copyInvite() {
    try { await navigator.clipboard.writeText(shareText()); status.textContent = C.copied; }
    catch { status.textContent = C.fallback; fallback.value = shareText(); fallback.hidden = false; fallback.focus(); fallback.select(); }
  }
  if (navigator.share) action(tools, C.send, async () => { try { await navigator.share({ title: 'Déjà Vous', text: C.message(C.questions[card]), url: inviteUrl() }); } catch (e) { if (e.name !== 'AbortError') await copyInvite(); } });
  action(tools, C.copy, copyInvite);
  action(tools, C.together, () => { round = 0; answers = []; ask(0, true); }, 'text-action');
  stage.append(tools, status, fallback); focusStage();
}
document.querySelectorAll('[data-surprise]').forEach(b => b.addEventListener('click', () => { showSurprise(); document.querySelector('#essayer').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }));
document.querySelectorAll('[data-play-evening]').forEach(b => b.addEventListener('click', () => { round = 0; answers = []; ask(0, true); }));
document.querySelectorAll('.language-switch a').forEach(a => {
  if (/^[0-2]$/.test(invitation || '')) { const u = new URL(a.href); u.searchParams.set('invite', invitation); a.href = u.href; }
});
// Keep the invitation when the existing language-link helper updates the hash.
addEventListener('hashchange', () => document.querySelectorAll('.language-switch a').forEach(a => { if (/^[0-2]$/.test(invitation || '')) { const u = new URL(a.href); u.searchParams.set('invite', invitation); a.href = u.href; } }));
if (stage) {
  ask();
  document.querySelector('#evening-privacy').textContent = C.status;
  if (/^[0-2]$/.test(invitation || '')) document.querySelector('#invitation-banner').textContent = C.shared;
}
