const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
const en = lang === 'en';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const panel = document.querySelector('#demo-panel');
const demoPhone = document.querySelector('.demo-phone');
const demoTabs = [...document.querySelectorAll('[data-demo]')];
const marketTabs = [...document.querySelectorAll('[data-market]')];
function syncLanguageLinks() { document.querySelectorAll('.language-switch a').forEach(link => { link.href = `${link.getAttribute('href').split('#')[0]}${location.hash}`; }); }
addEventListener('hashchange', syncLanguageLinks); syncLanguageLinks();

const copy = {
  fr: {
    marquee: ['RIRE PLUS FORT', 'DEVINER DE TRAVERS', 'BLUFFER SANS VERGOGNE', 'OSER À DEUX', 'CHANGER LES RÈGLES', 'RECOMMENCER DEMAIN'],
    surprises: ['Qui nous perdrait en chemin et appellerait ça une aventure ?', 'Qui adopterait un animal errant sans réfléchir ?', 'Qui gagnerait un concours de mauvaise danse ?'], surpriseAgain: 'Encore une carte',
    heatSoft: 'Ça commence doucement. Pour la suite, on verra.', heatSpicy: 'Même jeu. Autre tension. Toujours vos règles.',
    heatSoftAlt: 'Accueil du jeu dans son thème doux', heatSpicyAlt: 'Accueil du jeu avec la palette aubergine et vin du mode épicé',
    brainQuestion: 'Qui nous perdrait en chemin et appellerait ça une aventure ?', brainKicker: 'Même cerveau · personne',
    brainFirst: 'Choisissez en secret, puis passez l’écran.', brainSecond: 'À votre tour. La première réponse reste cachée.',
    person: 'Personne', hidden: 'Réponse gardée secrète', otherTurn: 'À l’autre de jouer.', hiddenHelp: 'La première réponse est cachée. Passez le téléphone.', ready: 'Je suis prêt·e',
    reveal: 'Révélation', brainWin: 'Même cerveau !', brainLose: 'Pas la même histoire…', brainNote: 'Dans le jeu complet, les réponses communes font gagner des points.', again: 'Rejouer',
    rapidKicker: 'Tir rapide', rapidTitle: 'Votre instinct dit quoi ?', rapidHelp: 'Choisissez sans trop réfléchir.', rapidEnd: 'Votre trio est prêt.', rapidEndHelp: 'Dans le jeu, vous comparez vos réflexes à ceux de votre partenaire.', restart: 'Recommencer',
    fusionKicker: 'Fusion · thème : week-end', fusionTitle: 'Un mot chacun. Une idée commune.', fusionFirst: 'Écrivez un mot, puis passez l’écran.', fusionSecond: 'Votre partenaire a écrit son mot en secret. Écrivez le vôtre.',
    word: 'Mot de la personne', idea: 'Votre idée', hideWord: 'Garder mon mot secret', revealWords: 'Révéler les deux mots', wordHidden: 'Mot gardé secret', passPhone: 'Passez le téléphone.', fusionWin: 'Vous avez fusionné !', fusionBridge: 'Trouvez le mot-pont.', fusionBridgeHelp: 'Écrivez chacun un mot entre ces deux idées. Révélez, rapprochez-vous, recommencez !', fusionAgain: 'Essayer deux autres mots',
    duelUs: 'DÉJÀ VOUS', duelSource: 'Source éditeur ↗', content: 'Contenu annoncé', mechanics: 'Mécaniques annoncées', guided: 'Soirée guidée avec final', comfort: 'Niveau choisi en secret', spicy: 'Mode épicé visuel et contenu', phones: 'Jeu direct à deux téléphones', private: 'Sans compte ni publicité',
    oursContent: '6 065 questions, thèmes et paires', oursMechanics: '6 jeux distincts + « Ce soir »', oursGuided: '✓ 5 étapes et un final', oursComfort: '✓ Le choix le plus doux décide', oursSpicy: '✓ Palette et cartes adaptées', oursPhones: '✓ Bluetooth local', oursPrivate: '✓ Aucun compte, aucune pub', unknown: '? Non confirmé par la source', physicalNA: '— Sans objet pour un jeu physique',
    pairedGuided: 'Parcours guidés ; format différent', togellaSpicy: 'Contenu épicé ; thème visuel non précisé', lovifyPhones: '✓ Deux téléphones, à distance', physicalFormat: 'Cartes / activités physiques',
    prices: { freePremium: 'Gratuit + Premium 74,99 €/an', agape: 'Gratuit + dès 9,99 €/mois', lovewick: 'Gratuit + 29,99 €/an', gottman: 'Gratuit', togella: 'Gratuit + 22,99 €/an', lovify: 'Gratuit + achats dès 3,99 €', connected: 'Gratuit + 12,99 $/mois' },
    volumes: { paired: '1 000+ activités', agape: 'Non publié', lovewick: '1 000+ questions', gottman: '1 000+ cartes', togella: '2 000+ questions', lovify: '1 000+ questions', connected: '700+ questions', wnr: '150 cartes', lingual: '150 questions', and: '199 questions', perel: '200 cartes-histoires', bestself: '170 cartes', tabletopics: '135 cartes', adventure: '50 aventures à gratter' },
    formats: { paired: 'Questions, quiz et parcours ; nombre de jeux non publié', agape: 'Question quotidienne à deux', lovewick: 'Cartes en 6 catégories + idées de rendez-vous', gottman: '22 decks de cartes ; un flux de pioche', togella: '11 modes annoncés', lovify: 'Répondre / deviner à deux', connected: 'Check-ins, bilans et coach ; nombre de jeux non publié', wnr: 'Un parcours de conversation en 3 niveaux', lingual: 'Piocher et discuter', and: 'Piocher et répondre', perel: 'Histoires, dé, jetons et guides', bestself: 'Questions en 7 catégories', tabletopics: 'Piocher et discuter', adventure: 'Expériences surprises à réaliser' }
  },
  en: {
    marquee: ['LAUGH LOUDER', 'GUESS WRONG', 'BLUFF BRAVELY', 'DARE TOGETHER', 'CHANGE THE RULES', 'PLAY AGAIN TOMORROW'],
    surprises: ['Who would get us lost and call it an adventure?', 'Who would adopt a stray animal without thinking twice?', 'Who would win a terrible-dancing contest?'], surpriseAgain: 'One more card',
    heatSoft: 'Start soft. See where the night takes you.', heatSpicy: 'Same game. Different tension. Still your rules.',
    heatSoftAlt: 'Game home screen in its soft theme', heatSpicyAlt: 'Game home screen in the aubergine-and-wine Spicy theme',
    brainQuestion: 'Who would get us lost and call it an adventure?', brainKicker: 'Same Brain · player',
    brainFirst: 'Choose in secret, then pass the phone.', brainSecond: 'Your turn. The first answer stays hidden.',
    person: 'Player', hidden: 'Answer saved in secret', otherTurn: 'Your partner is up.', hiddenHelp: 'The first answer is hidden. Pass the phone.', ready: 'I’m ready',
    reveal: 'The reveal', brainWin: 'Same brain!', brainLose: 'Different stories…', brainNote: 'In the full game, matching answers earn points.', again: 'Play again',
    rapidKicker: 'Rapid Fire', rapidTitle: 'What does your gut say?', rapidHelp: 'Pick without overthinking.', rapidEnd: 'Your three picks are in.', rapidEndHelp: 'In the full game, compare your reflexes with your partner’s.', restart: 'Start again',
    fusionKicker: 'Fusion · theme: weekend', fusionTitle: 'One word each. One shared idea.', fusionFirst: 'Write one word, then pass the phone.', fusionSecond: 'Your partner wrote a secret word. Write yours.',
    word: 'Player', idea: 'Your idea', hideWord: 'Keep my word secret', revealWords: 'Reveal both words', wordHidden: 'Word saved in secret', passPhone: 'Pass the phone.', fusionWin: 'You fused!', fusionBridge: 'Find the bridge word.', fusionBridgeHelp: 'Each write a word between these ideas. Reveal, get closer, and try again!', fusionAgain: 'Try two new words',
    duelUs: 'DÉJÀ VOUS', duelSource: 'Publisher source ↗', content: 'Published content', mechanics: 'Published game formats', guided: 'Guided night with a finale', comfort: 'Secret comfort choice', spicy: 'Spicy visuals and content', phones: 'Direct two-phone play', private: 'No account or ads',
    oursContent: '6,065 questions, themes and pairs', oursMechanics: '6 distinct games + Tonight', oursGuided: '✓ 5 stages and a finale', oursComfort: '✓ The softer choice wins', oursSpicy: '✓ Visuals and cards adapt', oursPhones: '✓ Local Bluetooth', oursPrivate: '✓ No account, no ads', unknown: '? Not confirmed by the source', physicalNA: '— Not applicable to a physical game',
    pairedGuided: 'Guided journeys; a different format', togellaSpicy: 'Spicy content; visual theme not specified', lovifyPhones: '✓ Two phones, remotely', physicalFormat: 'Physical cards / activities',
    prices: { freePremium: 'Free + Premium €74.99/year', agape: 'Free + from €9.99/month', lovewick: 'Free + €29.99/year', gottman: 'Free', togella: 'Free + €22.99/year', lovify: 'Free + in-app purchases from €3.99', connected: 'Free + $12.99/month' },
    volumes: { paired: '1,000+ activities', agape: 'Not published', lovewick: '1,000+ questions', gottman: '1,000+ cards', togella: '2,000+ questions', lovify: '1,000+ questions', connected: '700+ questions', wnr: '150 cards', lingual: '150 questions', and: '199 questions', perel: '200 story cards', bestself: '170 cards', tabletopics: '135 cards', adventure: '50 scratch-off adventures' },
    formats: { paired: 'Questions, quizzes and journeys; game count unpublished', agape: 'A daily question for two', lovewick: 'Cards in 6 categories + date ideas', gottman: '22 card decks; one draw-and-answer flow', togella: '11 advertised modes', lovify: 'Answer / guess together', connected: 'Check-ins, assessments and coach; game count unpublished', wnr: 'One progressive conversation game in 3 levels', lingual: 'Draw and discuss', and: 'Draw and answer', perel: 'Stories, die, tokens and guides', bestself: 'Questions in 7 categories', tabletopics: 'Draw and discuss', adventure: 'Surprise experiences to do together' }
  }
}[lang];

function node(tag, className = '', content) { const el = document.createElement(tag); if (className) el.className = className; if (content !== undefined) el.textContent = content; return el; }
function button(parent, label, action, className = '') { const el = node('button', className, label); el.type = 'button'; el.addEventListener('click', action); parent.append(el); return el; }
function resetPanel(kicker, title, description) { panel.replaceChildren(node('div', 'demo-kicker', kicker), node('h3', '', title)); if (description) panel.append(node('p', '', description)); }

function burst() {
  if (reducedMotion) return;
  for (let i = 0; i < 12; i++) {
    const spark = node('span', 'demo-confetti', ['✦', '✧', '●'][i % 3]);
    spark.style.setProperty('--dx', `${Math.round(Math.random() * 260 - 130)}px`);
    spark.style.setProperty('--dy', `${Math.round(Math.random() * -180 - 30)}px`);
    demoPhone.append(spark); setTimeout(() => spark.remove(), 1100);
  }
}
function showBrain() {
  let first;
  function ask(player) {
    resetPanel(`${copy.brainKicker} ${player}/2`, copy.brainQuestion, player === 1 ? copy.brainFirst : copy.brainSecond);
    const choices = node('div', 'demo-options');
    [1, 2].forEach(choice => button(choices, `${copy.person} ${choice}`, () => {
      if (player === 1) { first = choice; resetPanel(copy.hidden, copy.otherTurn, copy.hiddenHelp); button(panel, copy.ready, () => ask(2), 'demo-button'); }
      else { const match = first === choice; resetPanel(copy.reveal, match ? copy.brainWin : copy.brainLose); panel.append(node('div', 'demo-result', `${copy.person} 1: ${first} · ${copy.person} 2: ${choice}`)); panel.append(node('p', 'demo-muted', copy.brainNote)); button(panel, copy.again, showBrain, 'demo-button'); if (match) burst(); }
    }));
    panel.append(choices);
  }
  ask(1);
}
function showRapid() {
  const pairs = en ? [['Sea', 'Mountains'], ['Coffee', 'Tea'], ['Sunrise', 'Sunset']] : [['Mer', 'Montagne'], ['Café', 'Thé'], ['Lever de soleil', 'Coucher de soleil']];
  const picks = [];
  function ask(index) {
    if (index === pairs.length) { resetPanel(`${copy.rapidKicker} · 3/3`, copy.rapidEnd, copy.rapidEndHelp); panel.append(node('div', 'demo-result', picks.join(' · '))); button(panel, copy.restart, showRapid, 'demo-button'); return; }
    resetPanel(`${copy.rapidKicker} · ${index + 1}/3`, copy.rapidTitle, copy.rapidHelp);
    const progress = node('div', 'demo-progress'); pairs.forEach((_, i) => progress.append(node('i', i < index ? 'done' : ''))); panel.append(progress);
    const choices = node('div', 'demo-options'); pairs[index].forEach(choice => button(choices, choice, () => { picks.push(choice); ask(index + 1); })); panel.append(choices);
  }
  ask(0);
}
function showFusion() {
  let first;
  function ask(player) {
    resetPanel(`${copy.fusionKicker} · ${player}/2`, copy.fusionTitle, player === 1 ? copy.fusionFirst : copy.fusionSecond);
    const form = node('form', 'demo-inputs'); const label = node('label', '', `${copy.word} ${player}`); const input = node('input');
    input.type = 'text'; input.required = true; input.maxLength = 30; input.autocomplete = 'off'; input.placeholder = copy.idea;
    label.append(input); form.append(label); const submit = node('button', 'demo-button', player === 1 ? copy.hideWord : copy.revealWords); submit.type = 'submit'; form.append(submit);
    form.addEventListener('submit', event => { event.preventDefault(); const word = input.value.trim(); if (!word) return;
      if (player === 1) { first = word; resetPanel(copy.wordHidden, copy.otherTurn, copy.passPhone); button(panel, copy.ready, () => ask(2), 'demo-button'); }
      else { const match = first.localeCompare(word, lang, { sensitivity: 'base' }) === 0; resetPanel(copy.reveal, match ? copy.fusionWin : copy.fusionBridge); panel.append(node('div', 'demo-result', `${first} + ${word}`)); if (!match) panel.append(node('p', '', copy.fusionBridgeHelp)); button(panel, copy.fusionAgain, showFusion, 'demo-button'); if (match) burst(); }
    }); panel.append(form);
  }
  ask(1);
}
const demos = { brain: showBrain, rapid: showRapid, fusion: showFusion };
demoTabs.forEach(tab => tab.addEventListener('click', () => { demoTabs.forEach(other => other.setAttribute('aria-selected', String(other === tab))); demos[tab.dataset.demo](); }));
showBrain();

const mystery = document.querySelector('#mystery-trigger');
mystery.setAttribute('aria-expanded', 'false'); mystery.setAttribute('aria-controls', 'mystery-reveal');
let surpriseIndex = -1;
mystery.addEventListener('click', () => {
  const reveal = document.querySelector('#mystery-reveal'); surpriseIndex = (surpriseIndex + 1) % copy.surprises.length;
  reveal.querySelector('strong').textContent = copy.surprises[surpriseIndex]; reveal.hidden = false; mystery.setAttribute('aria-expanded', 'true');
  mystery.querySelector('span:nth-child(2)').textContent = copy.surpriseAgain;
  if (!reducedMotion) { reveal.style.animation = 'none'; requestAnimationFrame(() => { reveal.style.animation = ''; }); }
});
document.querySelectorAll('[data-heat]').forEach(tab => tab.addEventListener('click', () => {
  const hot = tab.dataset.heat === 'spicy'; document.body.classList.toggle('heat-on', hot);
  document.querySelectorAll('[data-heat]').forEach(other => other.setAttribute('aria-pressed', String(other === tab)));
  const image = document.querySelector('#heat-image'); image.src = hot ? (en ? 'assets/en-spicy.jpg' : 'assets/spicy.jpg') : (en ? 'assets/en-home.jpg' : 'assets/home.jpg'); image.alt = hot ? copy.heatSpicyAlt : copy.heatSoftAlt;
  document.querySelector('#heat-caption').textContent = hot ? copy.heatSpicy : copy.heatSoft;
}));

function buildMarquee() {
  const track = document.querySelector('#marquee-track'); if (!track) return;
  const set = node('div', 'marquee-set'); track.replaceChildren(set);
  do { copy.marquee.forEach(word => { set.append(node('span', '', word), node('i', '', '✳')); }); } while (set.getBoundingClientRect().width < innerWidth + 120 && set.childElementCount < 100);
  track.replaceChildren(set, set.cloneNode(true)); track.lastElementChild.setAttribute('aria-hidden', 'true');
}
buildMarquee(); let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(buildMarquee, 180); });

const sources = {
  paired: 'https://apps.apple.com/fr/app/paired-appli-de-relation/id1469609343', agape: 'https://apps.apple.com/fr/app/agap%C3%A9-feel-close-when-apart/id1507907556',
  lovewick: 'https://apps.apple.com/fr/app/lovewick-relationship-tracker/id1516199115', gottman: 'https://apps.apple.com/us/app/gottman-card-decks/id1292398843',
  togella: 'https://apps.apple.com/fr/app/togella-couples-question-games/id6777234833', lovify: 'https://apps.apple.com/fr/app/lovify-jeu-en-couple-quiz/id1645893544', connected: 'https://www.connectedcouples.app/',
  wnr: 'https://www.werenotreallystrangers.com/pages/couples-edition', lingual: 'https://lovelingual.com/products/love-lingual-couples-edition', and: 'https://shop.theskindeep.com/products/the-and-couples-edition',
  perel: 'https://game.estherperel.com/products/where-should-we-begin-a-game-of-stories-2nd-edition', bestself: 'https://bestself.co/collections/relationships/products/intimacy-deck', tabletopics: 'https://tabletopics.com/products/couples?currency=USD&variant=42509261799573', adventure: 'https://www.theadventurechallenge.com/products/couples-edition-book/'
};
const markets = {
  digital: [
    { id: 'paired', name: 'Paired', price: copy.prices.freePremium, guided: copy.pairedGuided },
    { id: 'agape', name: 'Agapé', price: copy.prices.agape },
    { id: 'lovewick', name: 'Lovewick', price: copy.prices.lovewick },
    { id: 'gottman', name: 'Gottman Card Decks', price: copy.prices.gottman },
    { id: 'togella', name: 'Togella', price: copy.prices.togella, spicy: copy.togellaSpicy },
    { id: 'lovify', name: 'Lovify', price: copy.prices.lovify, phones: copy.lovifyPhones },
    { id: 'connected', name: 'Connected', price: copy.prices.connected }
  ],
  physical: [
    { id: 'wnr', name: "We're Not Really Strangers", price: '$20' },
    { id: 'lingual', name: 'Love Lingual', price: '$26.95' },
    { id: 'and', name: '{THE AND}', price: '$29' },
    { id: 'perel', name: 'Where Should We Begin?', price: '$34.99' },
    { id: 'bestself', name: 'BestSelf Intimacy Deck', price: '$27' },
    { id: 'tabletopics', name: 'TableTopics Couples', price: '$25' },
    { id: 'adventure', name: 'The Adventure Challenge', price: '$49.99' }
  ]
};
let market = 'digital'; let selected = 'paired';
const picker = document.querySelector('#rival-picker'); const duel = document.querySelector('#duel-panel');
function duelRow(label, ours, theirs, oursChecked = false) {
  const row = node('tr'); row.append(node('th', '', label));
  row.firstChild.scope = 'row'; row.append(node('td', oursChecked ? 'our-check' : '', ours)); row.append(node('td', theirs?.startsWith('✓') ? 'rival-check' : 'unknown', theirs || copy.unknown));
  return row;
}
function renderDuel() {
  const rival = markets[market].find(item => item.id === selected); const physical = market === 'physical';
  picker.replaceChildren(); markets[market].forEach(item => { const card = button(picker, '', () => { selected = item.id; renderDuel(); }, 'rival-card'); card.setAttribute('aria-pressed', String(item.id === selected)); card.append(node('strong', '', item.name), node('span', '', item.price), node('small', '', copy.volumes[item.id])); });
  duel.replaceChildren(); const heading = node('div', 'duel-heading'); heading.append(node('div', 'duel-versus', `${copy.duelUs}  ✳  ${rival.name}`));
  const source = node('a', '', copy.duelSource); source.href = sources[rival.id]; source.target = '_blank'; source.rel = 'noopener noreferrer'; heading.append(source); duel.append(heading);
  const table = node('table', 'duel-table'); const thead = node('thead'); const header = node('tr'); [en ? 'THE FACTS' : 'LES FAITS', copy.duelUs, rival.name].forEach(text => header.append(node('th', '', text))); thead.append(header); table.append(thead);
  const body = node('tbody');
  body.append(
    duelRow(copy.content, copy.oursContent, copy.volumes[rival.id]),
    duelRow(copy.mechanics, copy.oursMechanics, copy.formats[rival.id]),
    duelRow(copy.guided, copy.oursGuided, rival.guided || (physical ? copy.physicalNA : copy.unknown), true),
    duelRow(copy.comfort, copy.oursComfort, physical ? copy.physicalNA : copy.unknown, true),
    duelRow(copy.spicy, copy.oursSpicy, rival.spicy || (physical ? copy.physicalNA : copy.unknown), true),
    duelRow(copy.phones, copy.oursPhones, rival.phones || (physical ? copy.physicalNA : copy.unknown), true),
    duelRow(copy.private, copy.oursPrivate, physical ? copy.physicalNA : copy.unknown, true)
  );
  body.querySelectorAll('tr').forEach(row => { row.children[1].dataset.label = copy.duelUs; row.children[2].dataset.label = rival.name; });
  table.append(body); duel.append(table);
  marketTabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.market === market)));
}
marketTabs.forEach(tab => tab.addEventListener('click', () => { market = tab.dataset.market; selected = markets[market][0].id; renderDuel(); }));
renderDuel();

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.story-card,.benefit-grid article,.advantage-board,.heat-layout,.duel-panel').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}
const updateScroll = () => document.documentElement.style.setProperty('--scroll-progress', `${Math.round(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100)}%`);
addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
