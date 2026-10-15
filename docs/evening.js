import { encodeEvening, SEALED } from './evening-code.js';
import { hit, variant } from './hit.js';

const APK = 'https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk';

// Demo answers live only in memory. The evening code and the promise stay in this browser (localStorage) so the app and a later visit can
// pick the evening up. An invitation carries a card id and, when the sender answered, one bit (their hidden answer) and an optional first name.
const en = document.documentElement.lang === 'en';
const C = en ? {
  steps: ['The bet', 'The reflex', 'Your finale', 'The verdict'],
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
  offerButton: 'Install Discovery · Android', offerBuy: 'Unlock everything for two · €34.90', replay: 'Play again', share: 'Prepare a surprise',
  surpriseTitle: 'A bet to send. A night to look forward to.', surpriseHelp: 'Pick a card. Your partner opens the link and can start the three-round demo. No install needed.',
  send: 'Share the invitation', copy: 'Copy the invitation', copied: 'Invitation copied.', fallback: 'Copy this invitation and send it yourself:',
  message: q => `I bet I know your answer: “${q}” Shall we find out together?`,
  status: 'Your answers never leave this page. Only your evening code and your promise stay in this browser.',
  sealedKicker: 'ROUND 4 · THE VERDICT · SEALED', sealedHelp: 'This one opens in the app. It waits for you there.', sealedCode: 'Your evening code', openSealed: 'Open round 4 in the app · free',
  betKicker: 'A BET FOR YOU', betHelp: n => `${n} already answered in secret. Which of you two, in your opinion?`, someone: 'Your partner', me: 'Me', you: 'You',
  betMatch: n => `Same answer! ${n} thought exactly the same.`, betMiss: (n, a) => `Missed: ${n} answered “${a}”.`, betNext: 'Keep playing together · 3 rounds', betApp: 'Continue in the app · free',
  myAnswer: 'Your answer, kept secret:', myName: 'Your first name (optional)', messageHidden: q => `I already answered in secret: “${q}” Your turn to guess.`,
  back4: (c, p) => `Your round 4 is still sealed: code ${c}.${p ? ` Your promise: “${p.replace(/\.$/, '')}”. Kept?` : ''}`, back4Go: 'Open it in the app',
  noteLabel: 'Your personal note (optional)', notePlaceholder: 'Tonight, I have a surprise for us…',
  shared: 'You received a bet. Ready to surprise them?', together: 'Play together', back: 'Back to the card',
} : {
  steps: ['Le pari', 'Le réflexe', 'Votre final', 'Le verdict'],
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
  offerButton: 'Installer Découverte · Android', offerBuy: 'Tout débloquer pour deux · 34,90 €', replay: 'Rejouer', share: 'Préparer une surprise',
  surpriseTitle: 'Un pari à envoyer. Une soirée à attendre.', surpriseHelp: 'Choisissez une carte. Votre partenaire ouvre le lien et peut commencer la démo en trois manches. Rien à installer.',
  send: 'Partager l’invitation', copy: 'Copier l’invitation', copied: 'Invitation copiée.', fallback: 'Copiez cette invitation pour l’envoyer vous-même :',
  message: q => `Je parie que je connais ta réponse : « ${q} » On vérifie ensemble ?`,
  status: 'Vos réponses ne quittent pas cette page. Seuls votre code soirée et votre promesse restent dans ce navigateur.',
  sealedKicker: 'MANCHE 4 · LE VERDICT · SCELLÉE', sealedHelp: 'Celle-ci s’ouvre dans l’appli. Elle vous y attend.', sealedCode: 'Votre code soirée', openSealed: 'Ouvrir la manche 4 dans l’appli · gratuit',
  betKicker: 'UN PARI POUR VOUS', betHelp: n => `${n} a déjà répondu en secret. Et selon vous, qui de vous deux ?`, someone: 'Votre partenaire', me: 'Moi', you: 'Toi',
  betMatch: n => `Même réponse ! ${n} pensait exactement pareil.`, betMiss: (n, a) => `Raté : ${n} avait répondu « ${a} ».`, betNext: 'Continuer à deux · 3 manches', betApp: 'Continuer dans l’appli · gratuit',
  myAnswer: 'Votre réponse, gardée secrète :', myName: 'Votre prénom (facultatif)', messageHidden: q => `J’ai déjà répondu en secret : « ${q} » À toi de deviner.`,
  back4: (c, p) => `Votre manche 4 est toujours scellée : code ${c}.${p ? ` Votre promesse : « ${p.replace(/\.$/, '')} ». Tenue ?` : ''}`, back4Go: 'L’ouvrir dans l’appli',
  noteLabel: 'Votre petit mot (facultatif)', notePlaceholder: 'Ce soir, j’ai une surprise pour nous…',
  shared: 'On vous a envoyé un pari. Prêt·e à surprendre l’autre ?', together: 'Jouer à deux', back: 'Revenir à la carte',
};
const stage = document.querySelector('#evening-stage');
const progress = document.querySelector('#evening-progress');
const shop = en ? 'unleashed-en.html' : 'unleashed.html';
const invitation = new URLSearchParams(location.search).get('invite');
let card = /^[0-2]$/.test(invitation || '') ? Number(invitation) : 0;
let round = 0, answers = [];
let started = false, surprise = false, personalNote = '';
let myAnswer = null, myName = '', matches = 0;
const params = new URLSearchParams(location.search);
const hiddenAnswer = /^[01]$/.test(params.get('a') || '') && /^[0-2]$/.test(invitation || '') ? Number(params.get('a')) : null;
const senderName = (params.get('n') || '').replace(/[<>]/g, '').trim().slice(0, 20);
const saved = () => { try { return JSON.parse(localStorage.getItem('dv-demo') || 'null'); } catch { return null; } };
const save = v => { try { localStorage.setItem('dv-demo', JSON.stringify({ ...saved(), ...v, ts: Date.now() })); } catch {} };

function syncJourneyLinks() {
  const finished = round === 3 && !surprise;
  document.querySelectorAll('[data-journey-cta]').forEach(a => {
    a.href = finished ? APK : '#essayer';
    const caption = a.querySelector('span');
    const label = a.querySelector('b');
    const text = finished ? (en ? 'Install Discovery ↗' : 'Installer Découverte ↗')
      : surprise ? (en ? 'My invitation ↗' : 'Mon invitation ↗')
      : started ? (en ? 'Continue the demo ↗' : 'Continuer la démo ↗')
      : (en ? 'Play here ↗' : 'Jouer ici ↗');
    if (label) label.textContent = text;
    else a.textContent = text;
    if (caption) caption.textContent = finished ? (en ? 'Discovery · Android' : 'Découverte · Android')
      : surprise ? (en ? 'A surprise for two' : 'Une surprise pour deux')
      : started ? (en ? `Your evening · ${round + 1}/3` : `Votre soirée · ${round + 1}/3`)
      : (en ? 'Three rounds. Nothing to install.' : 'Trois manches. Rien à installer.');
  });
}

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
function action(parent, text, fn, cls = 'evening-button') { const b = el('button', cls, text); b.type = 'button'; b.addEventListener('click', fn); parent.append(b); return b; }
function link(parent, text, href, cls = 'button button-primary') { const a = el('a', cls, text); a.href = href; parent.append(a); return a; }
function draw(title, help, label = C.steps[round]) {
  syncJourneyLinks();
  progress.hidden = false;
  stage.replaceChildren(el('p', 'evening-kicker', label), el('h2', '', title));
  if (help) stage.append(el('p', 'evening-help', help));
  progress.replaceChildren();
  C.steps.forEach((text, i) => { const step = el('li', (i < round ? 'done' : i === round ? 'current' : '') + (i === 3 ? ' sealed' : ''), `${i < round ? '✓' : i === 3 ? '🔒' : i + 1} · ${text}`); if (i === round) step.setAttribute('aria-current', 'step'); progress.append(step); });
  stage.classList.remove('dealt'); requestAnimationFrame(() => stage.classList.add('dealt'));
}
function focusStage() { stage.focus({ preventScroll: true }); }
function ask(player = 0, moved = false) {
  draw(round === 0 ? C.questions[card] : C.rapid, player === 0 ? (round === 0 ? C.first : C.rapidHelp) : C.second);
  const choices = el('div', 'evening-choices');
  (round === 0 ? C.players : C.choices).forEach((text, choice) => action(choices, text, () => {
    if (!started) hit('demo_start');
    started = true;
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
  if (match) matches++;
  draw(round === 0 ? (match ? C.match : C.different) : (match ? C.rapidMatch : C.rapidDifferent), round === 0 ? C.brainNote : C.rapidNote);
  const list = round === 0 ? C.players : C.choices;
  const result = el('div', 'evening-result');
  answers.forEach((answer, i) => result.append(el('span', '', `${C.players[i]} → ${list[answer]}`))); stage.append(result);
  action(stage, C.next, () => { answers = []; round++; round === 2 ? finale() : ask(0, true); focusStage(); });
}
function finale() {
  draw(C.final, C.finalHelp);
  const choices = el('div', 'evening-choices promises');
  C.promises.forEach((promise, i) => action(choices, promise, () => finish(promise, i))); stage.append(choices);
}
function sealedCard(index) {
  const [fr, enText, level] = SEALED[index], words = (en ? enText : fr).split(' ');
  const box = el('article', 'sealed-card'); box.setAttribute('aria-label', C.sealedKicker);
  const top = el('div', 'sealed-top'); top.append(el('span', '', C.steps[3]), el('span', 'sealed-level', '●'.repeat(level) + '○'.repeat(5 - level)));
  const q = el('p', 'sealed-q'); q.append(document.createTextNode(words.slice(0, 3).join(' ') + ' '));
  const hidden = el('span', 'sealed-blur', words.slice(3).join(' ')); hidden.setAttribute('aria-hidden', 'true'); q.append(hidden);
  box.append(top, q, el('span', 'sealed-wax', '✦'));
  return box;
}
function finish(promise, promiseIndex = 0) {
  round = 3;
  const sealed = Math.floor(Math.random() * SEALED.length), code = encodeEvening({ sealed, card, promise: promiseIndex, matches: Math.min(2, matches) });
  save({ code, promise, sealed });
  hit('demo_done'); hit('sealed_seen');
  draw(C.done, C.doneHelp, C.sealedKicker);
  stage.append(el('p', 'evening-help', C.commitment), el('strong', 'evening-promise', promise), sealedCard(sealed), el('p', 'evening-help', C.sealedHelp));
  const codeLine = el('p', 'evening-code'); codeLine.append(document.createTextNode(C.sealedCode + ' '), el('b', 'code', code)); stage.append(codeLine);
  link(stage, C.openSealed, APK);
  link(stage, C.offerBuy, `${shop}#acheter`, 'evening-buy').addEventListener('click', () => hit('buy_click'));
  const tools = el('div', 'evening-tools'); action(tools, C.replay, () => { round = 0; matches = 0; started = false; answers = []; ask(0, true); }, 'text-action'); action(tools, C.share, showSurprise, 'text-action'); stage.append(tools); focusStage();
}
function inviteUrl() { const u = new URL(en ? 'en.html' : 'index.html', location.href); u.search = `invite=${card}${myAnswer === null ? '' : `&a=${myAnswer}`}${myName.trim() ? `&n=${encodeURIComponent(myName.trim().slice(0, 20))}` : ''}`; u.hash = 'essayer'; return u.href; }
function inviteMessage() { return [personalNote.trim(), (myAnswer === null ? C.message : C.messageHidden)(C.questions[card])].filter(Boolean).join('\n\n'); }
function shareText() { return `${inviteMessage()}\n${inviteUrl()}`; }
function showSurprise() {
  surprise = true;
  draw(C.surpriseTitle, C.surpriseHelp, en ? 'PREPARE A SURPRISE' : 'PRÉPAREZ UNE SURPRISE');
  progress.hidden = true;
  const cards = el('div', 'evening-choices promises');
  C.questions.forEach((q, i) => { const b = action(cards, q, () => { card = i; showSurprise(); focusStage(); }); b.setAttribute('aria-pressed', String(i === card)); }); stage.append(cards);
  const mine = el('div', 'evening-choices invite-answer'); mine.append(el('p', 'invite-note-label', C.myAnswer));
  [C.me, C.you].forEach((label, v) => { const b = action(mine, label, () => { myAnswer = myAnswer === v ? null : v; showSurprise(); focusStage(); }); b.setAttribute('aria-pressed', String(myAnswer === v)); }); stage.append(mine);
  const nameLabel = el('label', 'invite-note-label', C.myName), name = el('input', 'invite-note'); name.maxLength = 20; name.value = myName; name.autocomplete = 'given-name';
  nameLabel.append(name); stage.append(nameLabel); name.addEventListener('input', () => { myName = name.value; });
  const noteLabel = el('label', 'invite-note-label', C.noteLabel);
  const note = el('textarea', 'invite-note'); note.rows = 2; note.maxLength = 160; note.placeholder = C.notePlaceholder; note.value = personalNote; note.autocomplete = 'off';
  noteLabel.append(note); stage.append(noteLabel);
  const preview = el('blockquote', 'invite-preview', inviteMessage()); stage.append(preview);
  note.addEventListener('input', () => { personalNote = note.value; preview.textContent = inviteMessage(); });
  const tools = el('div', 'evening-tools');
  const status = el('p', 'evening-note'); status.setAttribute('role', 'status');
  const fallback = el('textarea', 'invite-fallback'); fallback.readOnly = true; fallback.hidden = true; fallback.setAttribute('aria-label', C.fallback);
  async function copyInvite() {
    hit('invite_create');
    try { await navigator.clipboard.writeText(shareText()); status.textContent = C.copied; }
    catch { status.textContent = C.fallback; fallback.value = shareText(); fallback.hidden = false; fallback.focus(); fallback.select(); }
  }
  if (navigator.share) action(tools, C.send, async () => { hit('invite_create'); try { await navigator.share({ title: 'Déjà Vous', text: inviteMessage(), url: inviteUrl() }); } catch (e) { if (e.name !== 'AbortError') await copyInvite(); } });
  action(tools, C.copy, copyInvite);
  action(tools, C.together, () => { surprise = false; round = 0; started = false; answers = []; ask(0, true); }, 'text-action');
  stage.append(tools, status, fallback); focusStage();
}
function showBet() {
  const who = senderName || C.someone;
  round = 0; draw(C.questions[card], C.betHelp(who), C.betKicker); progress.hidden = true;
  const choices = el('div', 'evening-choices');
  [senderName || C.you, C.me].forEach((label, pick) => action(choices, label, () => {
    hit('invite_answer');
    // pick 0 = the sender, 1 = me; the sender's hidden answer: 0 = themselves, 1 = me
    const match = pick === hiddenAnswer, theirs = hiddenAnswer === 0 ? (senderName || C.someone) : C.me;
    draw(match ? C.betMatch(who) : C.betMiss(who, theirs), C.brainNote, C.betKicker); progress.hidden = true;
    action(stage, C.betNext, () => { round = 0; matches = 0; started = false; answers = []; ask(0, true); });
    link(stage, C.betApp, APK, 'evening-buy');
    focusStage();
  })); stage.append(choices);
}
document.querySelectorAll('[data-surprise]').forEach(b => b.addEventListener('click', () => { showSurprise(); document.querySelector('#essayer').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }));
document.querySelectorAll('[data-play-evening]').forEach(b => b.addEventListener('click', () => { surprise = false; round = 0; started = false; answers = []; ask(0, true); }));
document.querySelectorAll('[data-journey-cta]').forEach(a => a.addEventListener('click', () => { if (a.getAttribute('href') === '#essayer') focusStage(); }));
document.querySelectorAll('.language-switch a').forEach(a => {
  if (/^[0-2]$/.test(invitation || '')) { const u = new URL(a.href); u.searchParams.set('invite', invitation); a.href = u.href; }
});
// Keep the invitation when the existing language-link helper updates the hash.
addEventListener('hashchange', () => document.querySelectorAll('.language-switch a').forEach(a => { if (/^[0-2]$/.test(invitation || '')) { const u = new URL(a.href); u.searchParams.set('invite', invitation); a.href = u.href; } }));
if (stage) {
  hit('view');
  if (variant === 'b') { const h = document.querySelector('#hero-title'); if (h) h.innerHTML = en ? 'Bet on your couple.<br><em>Play to find out.</em>' : 'Pariez sur votre couple.<br><em>Jouez pour voir.</em>'; }
  if (hiddenAnswer !== null) { hit('invite_open'); showBet(); } else ask();
  document.querySelector('#evening-privacy').textContent = C.status;
  if (/^[2-9A-HJ-NP-Z]{4}$/.test(params.get('code') || '') && !saved()?.code) save({ code: params.get('code') }); // arriving from the QR code
  const banner = document.querySelector('#invitation-banner'), back = saved();
  if (/^[0-2]$/.test(invitation || '')) banner.textContent = C.shared;
  else if (back?.code) { banner.append(document.createTextNode(C.back4(back.code, back.promise) + ' ')); const a = el('a', '', C.back4Go); a.href = APK; banner.append(a); }
}
