import { encodeEvening, SEALED } from './evening-code.js';
import { hit } from './hit.js';

const APK = 'https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk';

// Demo answers live only in memory. The evening code and the promise stay in this browser (localStorage) so the app and a later visit can
// pick the evening up. An invitation carries a card id and, when the sender answered, one bit (their hidden answer) and an optional first name.
const en = document.documentElement.lang === 'en';
const C = en ? {
  steps: ['The bet', 'The reflex', 'Your finale', 'The verdict'],
  questions: ['Who would get us lost and call it an adventure?', 'Who would win a terrible-dancing contest?', 'Who would adopt a stray animal without thinking twice?'],
  first: n => `${n}: choose in secret.`, second: (n, o) => `${n}: your turn. ${o}’s answer is hidden.`,
  namesKicker: 'BEFORE WE START', namesTitle: 'Who’s playing?', namesHelp: 'Your first names will be used in every round of this demo, and only for as long as you stay on this site.', name1: 'Your first name', name2: 'Their first name', namesGo: 'Let’s play', namesSkip: 'Skip', namesChange: 'Change first names',
  players: ['Player 1', 'Player 2'], pass: n => `Pass the phone to ${n}.`, hidden: 'Your choice stays hidden until you both answer.', ready: n => `I’m ${n}`, reveal: 'Reveal our answers',
  match: 'Same brain. Suspiciously good.', different: 'Two versions of the same story.',
  brainNote: 'Same Brain: answer separately, reveal together.', next: 'Next round →',
  rapid: 'A weekend together: sea or mountains?', rapidHelp: (n, o) => `${n}, pick by instinct. Then pass the phone to ${o}.`, choices: ['Sea', 'Mountains'],
  rapidMatch: 'Same destination. Pack your bags.', rapidDifferent: 'You have a weekend to negotiate.',
  rapidNote: 'Rapid Fire: two choices, two instincts. Nothing to calculate.',
  final: 'Your finale. Make it real.', finalHelp: 'Choose a little promise to keep tonight, together.',
  promises: ['One song. One terrible dance.', 'Ten minutes with the phones put away.', 'Plan your next date together.'],
  done: 'Three rounds. One evening already different.', doneHelp: 'No relationship score. Just three moments you made together.',
  commitment: 'Your promise for tonight:', offer: 'Want a whole night of this?', offerHelp: 'Install Discovery for free on Android: a selection of cards in every game, and one card from the full game every day. One purchase then unlocks the whole game on 2 phones: yours and your partner’s.',
  offerButton: 'Install Discovery · Android', offerBuy: 'Unlock everything for two · €34.90', guarantee: 'Refunded within 14 days, no questions asked · no account, no ads.', replay: 'Play again', messageMulti: 'I secretly answered 3 questions. Can you guess my answers?', guessScore: (n, t) => `${n}/${t} correct`, guessPerfect: w => `Perfect: you read ${w} like a book.`, guessMore: w => `${w} still has a few secrets. Now it’s your turn.`, guessChallenge: 'Challenge them back', keepCard: 'Keep our souvenir card', cardTitle: 'Your souvenir card', cardHelp: 'A keepsake of tonight. Share it and invite someone to beat your score.', cardShare: 'Share and invite', cardSave: 'Save the image', cardBack: 'Back', cardCopied: 'Link copied ✓', cardTitles: ['Two mysteries', 'Accomplices in the making', 'One mind'], cardScore: n => `${n}/2 shared answers`, cardPromise: 'Tonight’s promise', cardCode: 'Evening code', cardMsg: 'Our score on Déjà Vous. Think you can beat us?', share: 'Prepare a surprise',
  surpriseTitle: 'A bet to send. A night to look forward to.', surpriseHelp: 'Answer in secret (at least one question). Your partner opens the link and guesses. No install needed.',
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
  first: n => `${n} : choisissez en secret.`, second: (n, o) => `${n} : à vous. La réponse de ${o} est cachée.`,
  namesKicker: 'AVANT DE COMMENCER', namesTitle: 'Qui joue ?', namesHelp: 'Vos prénoms serviront à chaque manche de cette démo, et seulement le temps de votre visite sur ce site.', name1: 'Votre prénom', name2: 'Son prénom', namesGo: 'On joue', namesSkip: 'Passer', namesChange: 'Changer les prénoms',
  players: ['Personne 1', 'Personne 2'], pass: n => `Passez le téléphone à ${n}.`, hidden: 'Votre choix reste caché jusqu’à ce que vous ayez répondu tous les deux.', ready: n => `Je suis ${n}`, reveal: 'Révéler nos réponses',
  match: 'Même cerveau. C’est presque suspect.', different: 'Deux versions de la même histoire.',
  brainNote: 'Même cerveau : répondez séparément, révélez ensemble.', next: 'La manche suivante →',
  rapid: 'Un week-end à deux : mer ou montagne ?', rapidHelp: (n, o) => `${n}, choisissez à l’instinct. Puis passez le téléphone à ${o}.`, choices: ['Mer', 'Montagne'],
  rapidMatch: 'Même destination. Faites les valises.', rapidDifferent: 'Vous avez un week-end à négocier.',
  rapidNote: 'Tir rapide : deux choix, deux instincts. Rien à calculer.',
  final: 'Votre final. Pour de vrai.', finalHelp: 'Choisissez ensemble une petite promesse à tenir ce soir.',
  promises: ['Une chanson. Une danse catastrophique.', 'Dix minutes avec les téléphones rangés.', 'Imaginer votre prochain rendez-vous.'],
  done: 'Trois manches. Une soirée déjà différente.', doneHelp: 'Pas de note sur votre couple. Juste trois moments que vous avez créés à deux.',
  commitment: 'Votre promesse pour ce soir :', offer: 'On continue toute la soirée ?', offerHelp: 'Installez Découverte gratuitement sur Android : une sélection de cartes dans tous les jeux, et chaque jour une carte du jeu complet. Un achat unique débloque ensuite tout le jeu sur 2 téléphones : le vôtre et celui de l’autre.',
  offerButton: 'Installer Découverte · Android', offerBuy: 'Tout débloquer pour deux · 34,90 €', guarantee: 'Remboursé sous 14 jours, sans question · sans compte, sans pub.', replay: 'Rejouer', messageMulti: 'J’ai répondu en secret à 3 questions. Sauras-tu deviner mes réponses ?', guessScore: (n, t) => `${n}/${t} bonnes réponses`, guessPerfect: w => `Parfait : vous lisez ${w} comme un livre ouvert.`, guessMore: w => `${w} garde encore quelques secrets. À vous de défier à votre tour.`, guessChallenge: 'Le/la défier à mon tour', keepCard: 'Garder notre carte-souvenir', cardTitle: 'Votre carte-souvenir', cardHelp: 'Un souvenir de ce soir. Partagez-la et invitez quelqu’un à battre votre score.', cardShare: 'Partager et inviter', cardSave: 'Enregistrer l’image', cardBack: 'Retour', cardCopied: 'Lien copié ✓', cardTitles: ['Deux mystères', 'Complices en devenir', 'Même cerveau'], cardScore: n => `${n}/2 réponses communes`, cardPromise: 'La promesse de ce soir', cardCode: 'Code soirée', cardMsg: 'Notre score sur Déjà Vous. Vous pensez faire mieux ?', share: 'Préparer une surprise',
  surpriseTitle: 'Un pari à envoyer. Une soirée à attendre.', surpriseHelp: 'Répondez en secret (au moins une question). Votre partenaire ouvre le lien et devine. Rien à installer.',
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
let myAnswers = [null, null, null], myName = '', matches = 0;
// First names: asked once, kept only for this visit (sessionStorage: gone when the tab closes), used in every round of the demo.
const readNames = () => { try { const v = JSON.parse(sessionStorage.getItem('dv-names') || 'null'); return Array.isArray(v) && v.length === 2 ? v : null; } catch { return null; } };
let names = readNames();
const nm = i => names?.[i] || C.players[i];
const clean = v => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, 20);
const params = new URLSearchParams(location.search);
const qaParam = /^[01-]{3}$/.test(params.get('qa') || '') && params.get('qa') !== '---' ? params.get('qa') : null;
const hiddenAnswer = qaParam ? null : /^[01]$/.test(params.get('a') || '') && /^[0-2]$/.test(invitation || '') ? Number(params.get('a')) : null;
const senderName = (params.get('n') || '').replace(/[<>]/g, '').trim().slice(0, 20);
const receiverName = (params.get('p') || '').replace(/[<>]/g, '').trim().slice(0, 20);
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
function askNames() {
  progress.hidden = true; round = 0;
  stage.replaceChildren(el('p', 'evening-kicker', C.namesKicker), el('h2', '', C.namesTitle), el('p', 'evening-help', C.namesHelp));
  const form = el('form', 'names-form'), field = (label, value) => { const l = el('label', 'invite-note-label', label), i = el('input', 'invite-note'); i.maxLength = 20; i.value = value; i.autocomplete = 'off'; l.append(i); form.append(l); return i; };
  const a = field(C.name1, names?.[0] || ''), b = field(C.name2, names?.[1] || '');
  const go = el('button', 'button button-primary', C.namesGo); go.type = 'submit'; form.append(go);
  const skip = action(form, C.namesSkip, () => { names = null; skippedNames = true; try { sessionStorage.removeItem('dv-names'); } catch {} ask(0, true); }, 'text-action');
  form.addEventListener('submit', e => {
    e.preventDefault(); const x = clean(a.value), y = clean(b.value);
    names = x || y ? [x || C.players[0], y || C.players[1]] : null;
    try { names ? sessionStorage.setItem('dv-names', JSON.stringify(names)) : sessionStorage.removeItem('dv-names'); } catch {}
    ask(0, true);
  });
  stage.append(form); stage.classList.remove('dealt'); requestAnimationFrame(() => stage.classList.add('dealt')); a.focus({ preventScroll: true });
}
const begin = () => ask(0, true);
let skippedNames = false;
function ask(player = 0, moved = false) {
  draw(round === 0 ? C.questions[card] : C.rapid, player === 0 ? (round === 0 ? C.first(nm(0)) : C.rapidHelp(nm(0), nm(1))) : C.second(nm(1), nm(0)));
  const choices = el('div', 'evening-choices');
  (round === 0 ? [nm(0), nm(1)] : C.choices).forEach((text, choice) => action(choices, text, () => {
    if (!started) hit('demo_start');
    started = true;
    answers.push(choice);
    if (player === 0) {
      draw(C.pass(nm(1)), C.hidden);
      action(stage, C.ready(nm(1)), () => ask(1, true));
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
  const list = round === 0 ? [nm(0), nm(1)] : C.choices;
  const result = el('div', 'evening-result');
  answers.forEach((answer, i) => result.append(el('span', '', `${nm(i)} → ${list[answer]}`))); stage.append(result);
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
  stage.append(el('p', 'evening-note', C.guarantee));
  action(stage, C.keepCard, () => showCard(promise, code), 'button button-ghost');
  const tools = el('div', 'evening-tools'); action(tools, C.replay, () => { round = 0; matches = 0; started = false; answers = []; ask(0, true); }, 'text-action'); action(tools, C.namesChange, () => { round = 0; matches = 0; started = false; answers = []; askNames(); }, 'text-action'); action(tools, C.share, showSurprise, 'text-action'); stage.append(tools); focusStage();
}
function cardCanvas(promise, code) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#49315a'); bg.addColorStop(.55, '#872c4b'); bg.addColorStop(1, '#16101e'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * .8, H * .15, 10, W * .8, H * .15, 600); glow.addColorStop(0, '#ffd3bd55'); glow.addColorStop(1, '#ffd3bd00'); g.fillStyle = glow; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#ffd3bd88'; g.lineWidth = 3; g.strokeRect(48, 48, W - 96, H - 96);
  const serif = 'Georgia, "Times New Roman", serif', wrap = (text, x, y, max, lh) => { let line = ''; for (const w of text.split(' ')) { const t = line ? `${line} ${w}` : w; if (g.measureText(t).width > max && line) { g.fillText(line, x, y); y += lh; line = w; } else line = t; } g.fillText(line, x, y); return y + lh; };
  g.textAlign = 'center'; g.fillStyle = '#ffd3bd'; g.font = `900 30px ${serif}`; g.fillText('DÉJÀ VOUS', W / 2, 135);
  g.fillStyle = '#f9f0f1'; g.font = `italic 400 64px ${serif}`; g.fillText('✦', W / 2, 230);
  const m = Math.min(2, matches); g.font = `400 96px ${serif}`; let y = wrap(C.cardTitles[m], W / 2, 380, W - 220, 108);
  g.fillStyle = '#ffd3bd'; g.font = `700 40px ${serif}`; g.fillText(C.cardScore(m), W / 2, y + 30); y += 40;
  for (let i = 0; i < 2; i++) { g.fillStyle = i < m ? '#ffd3bd' : '#ffffff30'; g.beginPath(); g.arc(W / 2 - 40 + i * 80, y + 70, 22, 0, 7); g.fill(); }
  g.fillStyle = '#d8c2d0'; g.font = `700 26px ${serif}`; g.fillText(C.cardPromise.toUpperCase(), W / 2, y + 200);
  g.fillStyle = '#f9f0f1'; g.font = `italic 400 54px ${serif}`; wrap(`« ${promise.replace(/\.$/, '')} »`, W / 2, y + 280, W - 260, 68);
  g.fillStyle = '#d8c2d0'; g.font = `700 26px ${serif}`; g.fillText(`${C.cardCode.toUpperCase()} · ${code}`, W / 2, H - 190);
  g.fillStyle = '#ffd3bd'; g.font = `700 32px ${serif}`; g.fillText('tybiboune.github.io/DejaVous-apk', W / 2, H - 120);
  return c;
}
function showCard(promise, code) {
  hit('card_make');
  draw(C.cardTitle, C.cardHelp, C.steps[3]); progress.hidden = true;
  const canvas = cardCanvas(promise, code); canvas.className = 'souvenir-card'; canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', `${C.cardTitles[Math.min(2, matches)]} · ${promise}`); stage.append(canvas);
  const blob = () => new Promise(r => canvas.toBlob(r, 'image/png'));
  const share = action(stage, C.cardShare, async () => {
    hit('card_share'); const url = inviteUrl(), text = C.cardMsg;
    try {
      const file = new File([await blob()], 'deja-vous.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text, url });
      else if (navigator.share) await navigator.share({ text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); share.textContent = C.cardCopied; }
    } catch {}
  }, 'button button-primary');
  const tools = el('div', 'evening-tools');
  action(tools, C.cardSave, async () => { const a = el('a'); a.href = URL.createObjectURL(await blob()); a.download = 'deja-vous.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'text-action');
  action(tools, C.cardBack, () => finish(promise, C.promises.indexOf(promise)), 'text-action'); stage.append(tools); focusStage();
}
function inviteUrl() { const u = new URL(en ? 'en.html' : 'index.html', location.href), any = myAnswers.some(v => v !== null), q = [`invite=${any ? myAnswers.findIndex(v => v !== null) : card}`]; if (any) q.push(`qa=${myAnswers.map(v => v ?? '-').join('')}`); if (myName.trim()) q.push(`n=${encodeURIComponent(myName.trim().slice(0, 20))}`); if (names?.[1] && any) q.push(`p=${encodeURIComponent(names[1])}`); u.search = q.join('&'); u.hash = 'essayer'; return u.href; }
function inviteMessage() { const any = myAnswers.some(v => v !== null); return [personalNote.trim(), any ? C.messageMulti : C.message(C.questions[card])].filter(Boolean).join('\n\n'); }
function shareText() { return `${inviteMessage()}\n${inviteUrl()}`; }
function showSurprise() {
  surprise = true;
  draw(C.surpriseTitle, C.surpriseHelp, en ? 'PREPARE A SURPRISE' : 'PRÉPAREZ UNE SURPRISE');
  progress.hidden = true;
  C.questions.forEach((q, i) => {
    const mine = el('div', 'evening-choices invite-answer'); mine.append(el('p', 'invite-note-label', `${i + 1}. ${q}`));
    [names?.[0] || C.me, names?.[1] || C.you].forEach((label, v) => { const b = action(mine, label, () => { myAnswers[i] = myAnswers[i] === v ? null : v; showSurprise(); focusStage(); }); b.setAttribute('aria-pressed', String(myAnswers[i] === v)); }); stage.append(mine);
  });
  const nameLabel = el('label', 'invite-note-label', C.myName), name = el('input', 'invite-note'); name.maxLength = 20; name.value = myName || names?.[0] || ''; name.autocomplete = 'given-name';
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
  action(tools, C.together, () => { surprise = false; round = 0; started = false; answers = []; begin(); }, 'text-action');
  stage.append(tools, status, fallback); focusStage();
}
function showGuess() {
  const who = senderName || C.someone, todo = [...qaParam].map((v, i) => v === '-' ? null : { i, v: Number(v) }).filter(Boolean); let at = 0, score = 0;
  const step = () => {
    if (at >= todo.length) return done();
    const { i, v } = todo[at]; round = 0; draw(C.questions[i], `${at + 1}/${todo.length} · ${C.betHelp(who)}`, C.betKicker); progress.hidden = true;
    const choices = el('div', 'evening-choices');
    [senderName || C.you, receiverName || C.me].forEach((label, pick) => action(choices, label, () => { hit('invite_answer'); if (pick === v) score++; at++; step(); focusStage(); })); stage.append(choices);
  };
  const done = () => {
    draw(C.guessScore(score, todo.length), score === todo.length ? C.guessPerfect(who) : C.guessMore(who), C.betKicker); progress.hidden = true;
    action(stage, C.guessChallenge, () => { myAnswers = [null, null, null]; showSurprise(); focusStage(); });
    action(stage, C.betNext, () => { round = 0; matches = 0; started = false; answers = []; begin(); }, 'evening-button');
    link(stage, C.betApp, APK, 'evening-buy');
  };
  step();
}
function showBet() {
  const who = senderName || C.someone;
  round = 0; draw(C.questions[card], C.betHelp(who), C.betKicker); progress.hidden = true;
  const choices = el('div', 'evening-choices');
  [senderName || C.you, receiverName || C.me].forEach((label, pick) => action(choices, label, () => {
    hit('invite_answer');
    // pick 0 = the sender, 1 = me; the sender's hidden answer: 0 = themselves, 1 = me
    const match = pick === hiddenAnswer, theirs = hiddenAnswer === 0 ? (senderName || C.someone) : (receiverName || C.me);
    draw(match ? C.betMatch(who) : C.betMiss(who, theirs), C.brainNote, C.betKicker); progress.hidden = true;
    action(stage, C.betNext, () => { round = 0; matches = 0; started = false; answers = []; begin(); });
    link(stage, C.betApp, APK, 'evening-buy');
    focusStage();
  })); stage.append(choices);
}
document.querySelectorAll('[data-surprise]').forEach(b => b.addEventListener('click', () => { showSurprise(); document.querySelector('#essayer').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }));
document.querySelectorAll('[data-play-evening]').forEach(b => b.addEventListener('click', () => { surprise = false; round = 0; started = false; answers = []; begin(); }));
document.querySelectorAll('[data-journey-cta]').forEach(a => a.addEventListener('click', () => { if (a.getAttribute('href') === '#essayer') focusStage(); }));
document.querySelectorAll('.language-switch a').forEach(a => {
  if (/^[0-2]$/.test(invitation || '')) { const u = new URL(a.href); u.searchParams.set('invite', invitation); a.href = u.href; }
});
// Keep the invitation when the existing language-link helper updates the hash.
addEventListener('hashchange', () => document.querySelectorAll('.language-switch a').forEach(a => { if (/^[0-2]$/.test(invitation || '')) { const u = new URL(a.href); u.searchParams.set('invite', invitation); a.href = u.href; } }));
if (stage) {
  hit('view');
  if (qaParam) { hit('invite_open'); showGuess(); } else if (hiddenAnswer !== null) { hit('invite_open'); showBet(); } else ask();
  document.querySelector('#evening-privacy').textContent = C.status;
  if (/^[2-9A-HJ-NP-Z]{4}$/.test(params.get('code') || '') && !saved()?.code) save({ code: params.get('code') }); // arriving from the QR code
  const banner = document.querySelector('#invitation-banner'), back = saved();
  if (/^[0-2]$/.test(invitation || '')) banner.textContent = C.shared;
  else if (back?.code) { banner.append(document.createTextNode(C.back4(back.code, back.promise) + ' ')); const a = el('a', '', C.back4Go); a.href = APK; banner.append(a); }
}
