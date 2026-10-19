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
    word: 'Mot de la personne', idea: 'Votre idée', hideWord: 'Garder mon mot secret', revealWords: 'Révéler les deux mots', wordHidden: 'Mot gardé secret', passPhone: 'Passez le téléphone.', fusionWin: 'Vous avez fusionné !', fusionBridge: 'Même idée ?', fusionBridgeHelp: 'Dites-vous pourquoi vous avez choisi ces mots. Même idée ? C’est une fusion !', fusionAgain: 'Essayer deux autres mots',
    duelUs: 'DÉJÀ VOUS', duelSource: 'Source éditeur ↗', price: 'Prix / offre', oursPrice: 'Unleashed · 34,90 € une fois · 2 téléphones', content: 'Contenu annoncé', mechanics: 'Mécaniques annoncées', guided: 'Soirée guidée avec final', how: 'Comment ça se joue', age: 'Public', comfort: 'Niveau choisi en secret', spicy: 'Mode épicé visuel et contenu', phones: 'Jeu direct à deux téléphones', private: 'Sans compte ni publicité',
    oursContent: '11 000+ questions, thèmes et paires', oursMechanics: '6 jeux distincts + « Ce soir »', oursHow: 'Six jeux aux règles différentes, à 1 ou 2 téléphones, jusqu’à un final', oursAge: '18+ · adultes', oursGuided: '✓ 5 étapes et un final', oursComfort: '✓ Le choix le plus doux décide', oursSpicy: '✓ Palette et cartes adaptées', oursPhones: '✓ Bluetooth local', oursPrivate: '✓ Aucun compte, aucune pub', unknown: '? Non confirmé par la source', physicalNA: '—',
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
    word: 'Player', idea: 'Your idea', hideWord: 'Keep my word secret', revealWords: 'Reveal both words', wordHidden: 'Word saved in secret', passPhone: 'Pass the phone.', fusionWin: 'You fused!', fusionBridge: 'Same idea?', fusionBridgeHelp: 'Tell each other why you chose these words. Same idea? That is a fusion!', fusionAgain: 'Try two new words',
    duelUs: 'DÉJÀ VOUS', duelSource: 'Publisher source ↗', price: 'Price / offer', oursPrice: 'Unleashed · €34.90 once · 2 phones', content: 'Published content', mechanics: 'Published game formats', guided: 'Guided night with a finale', how: 'How it plays', age: 'Audience', comfort: 'Secret comfort choice', spicy: 'Spicy visuals and content', phones: 'Direct two-phone play', private: 'No account or ads',
    oursContent: '11,000+ questions, themes and pairs', oursMechanics: '6 distinct games + Tonight', oursHow: 'Six games with different rules, on 1 or 2 phones, up to a finale', oursAge: '18+ · adults', oursGuided: '✓ 5 stages and a finale', oursComfort: '✓ The softer choice wins', oursSpicy: '✓ Visuals and cards adapt', oursPhones: '✓ Local Bluetooth', oursPrivate: '✓ No account, no ads', unknown: '? Not confirmed by the source', physicalNA: '—',
    pairedGuided: 'Guided journeys; a different format', togellaSpicy: 'Spicy content; visual theme not specified', lovifyPhones: '✓ Two phones, remotely', physicalFormat: 'Physical cards / activities',
    prices: { freePremium: 'Free + Premium €74.99/year', agape: 'Free + from €9.99/month', lovewick: 'Free + €29.99/year', gottman: 'Free', togella: 'Free + €22.99/year', lovify: 'Free + in-app purchases from €3.99', connected: 'Free + $12.99/month' },
    volumes: { paired: '1,000+ activities', agape: 'Not published', lovewick: '1,000+ questions', gottman: '1,000+ cards', togella: '2,000+ questions', lovify: '1,000+ questions', connected: '700+ questions', wnr: '150 cards', lingual: '150 questions', and: '199 questions', perel: '200 story cards', bestself: '170 cards', tabletopics: '135 cards', adventure: '50 scratch-off adventures' },
    formats: { paired: 'Questions, quizzes and journeys; game count unpublished', agape: 'A daily question for two', lovewick: 'Cards in 6 categories + date ideas', gottman: '22 card decks; one draw-and-answer flow', togella: '11 advertised modes', lovify: 'Answer / guess together', connected: 'Check-ins, assessments and coach; game count unpublished', wnr: 'One progressive conversation game in 3 levels', lingual: 'Draw and discuss', and: 'Draw and answer', perel: 'Stories, die, tokens and guides', bestself: 'Questions in 7 categories', tabletopics: 'Draw and discuss', adventure: 'Surprise experiences to do together' }
  }
}[lang];

function node(tag, className = '', content) { const el = document.createElement(tag); if (className) el.className = className; if (content !== undefined) el.textContent = content; return el; }
function button(parent, label, action, className = '') { const el = node('button', className, label); el.type = 'button'; el.addEventListener('click', action); parent.append(el); return el; }
const promoStored = (() => { try { return { theme: localStorage.getItem('dv-promo-theme'), spicy: localStorage.getItem('dv-promo-spicy') }; } catch { return {}; } })();
const promoTheme = {
  theme: ['dark', 'light'].includes(promoStored.theme) ? promoStored.theme : 'dark',
  spicy: ['on', 'off'].includes(promoStored.spicy) ? promoStored.spicy : 'off'
};
const themeMessages = en ? {
  'off-dark': 'Soft + dark. The game’s default mood.',
  'off-light': 'Soft + light. Warm paper, same game.',
  'on-dark': 'Spicy + dark. Aubergine, wine and a little more tension.',
  'on-light': 'Spicy + light. Brighter, still unmistakably Spicy.'
} : {
  'off-dark': 'Doux + sombre. L’ambiance par défaut du jeu.',
  'off-light': 'Doux + clair. Papier chaud, même jeu.',
  'on-dark': 'Épicé + sombre. Aubergine, vin et un peu plus de tension.',
  'on-light': 'Épicé + clair. Plus lumineux, toujours franchement épicé.'
};
function applyPromoTheme({ persist = true } = {}) {
  document.documentElement.dataset.theme = promoTheme.theme;
  document.documentElement.dataset.spicy = promoTheme.spicy;
  document.body.classList.toggle('heat-on', promoTheme.spicy === 'on');
  document.querySelectorAll('[data-theme-mode]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.themeMode === promoTheme.theme)));
  document.querySelectorAll('[data-spicy-mode]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.spicyMode === promoTheme.spicy)));
  const key = `${promoTheme.spicy}-${promoTheme.theme}`;
  const caption = document.querySelector('#heat-caption');
  if (caption) caption.textContent = themeMessages[key];
  const chip = document.querySelector('#live-preview-chip');
  if (chip) chip.textContent = en
    ? `${promoTheme.spicy === 'on' ? 'SPICY' : 'SOFT'} · ${promoTheme.theme.toUpperCase()}`
    : `${promoTheme.spicy === 'on' ? 'ÉPICÉ' : 'DOUX'} · ${promoTheme.theme === 'dark' ? 'SOMBRE' : 'CLAIR'}`;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = promoTheme.theme === 'light'
    ? (promoTheme.spicy === 'on' ? '#f8eff4' : '#f8efe9')
    : (promoTheme.spicy === 'on' ? '#150f1d' : '#191020');
  if (persist) {
    try { localStorage.setItem('dv-promo-theme', promoTheme.theme); localStorage.setItem('dv-promo-spicy', promoTheme.spicy); } catch {}
  }
}
document.querySelectorAll('[data-spicy-mode]').forEach(btn => btn.addEventListener('click', () => {
  promoTheme.spicy = btn.dataset.spicyMode; applyPromoTheme();
}));
document.querySelectorAll('[data-theme-mode]').forEach(btn => btn.addEventListener('click', () => {
  promoTheme.theme = btn.dataset.themeMode; applyPromoTheme();
}));
applyPromoTheme({ persist: false });

const drawCards = en ? [
  ['SAME BRAIN', 'Who would get us lost and call it an adventure?', 'Answer separately. Reveal together.'],
  ['RAPID FIRE', 'Sea or mountains?', 'No debate. Go with your gut.'],
  ['SAME BRAIN', 'Who would adopt a stray animal without thinking twice?', 'Pick in secret.'],
  ['RAPID FIRE', 'Coffee or tea?', 'Three seconds. Choose.'],
  ['SAME BRAIN', 'Who would win a terrible-dancing contest?', 'There is only one honest answer.'],
  ['RAPID FIRE', 'Sunrise or sunset?', 'Don’t overthink it.']
] : [
  ['MÊME CERVEAU', 'Qui nous perdrait en chemin et appellerait ça une aventure ?', 'Répondez séparément. Révélez ensemble.'],
  ['TIR RAPIDE', 'Mer ou montagne ?', 'Pas de débat. À l’instinct.'],
  ['MÊME CERVEAU', 'Qui adopterait un animal errant sans réfléchir ?', 'Choisissez en secret.'],
  ['TIR RAPIDE', 'Café ou thé ?', 'Trois secondes. Choisissez.'],
  ['MÊME CERVEAU', 'Qui gagnerait un concours de mauvaise danse ?', 'Il n’y a qu’une réponse honnête.'],
  ['TIR RAPIDE', 'Lever ou coucher de soleil ?', 'Ne réfléchissez pas trop.']
];
let drawn = 0;
const drawButton = document.querySelector('#draw-card');
const drawFace = document.querySelector('#draw-card-face');
const drawCounter = document.querySelector('#draw-counter');
const drawDownload = document.querySelector('#draw-download');
if (drawButton && drawFace) drawButton.addEventListener('click', () => {
  drawn += 1;
  const card = drawCards[drawn % drawCards.length];
  const swap = () => {
    drawFace.querySelector('span').textContent = card[0];
    drawFace.querySelector('strong').textContent = card[1];
    drawFace.querySelector('small').textContent = card[2];
    drawFace.classList.remove('is-dealing');
    void drawFace.offsetWidth;
    drawFace.classList.add('is-dealing');
  };
  swap();
  drawCounter.textContent = en ? '11,000+ more in the full game.' : 'Plus de 11 000 autres dans le jeu complet.';
  if (drawn >= 3) {
    drawButton.hidden = true;
    drawDownload.hidden = false;
    drawCounter.textContent = en ? 'That was three. There are 11,000+ more reasons to keep going.' : 'Ça, c’était trois. Il reste plus de 11 000 raisons de continuer.';
  }
});

function doorFxEl(className, vars = {}) {
  const el = document.createElement('span');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  Object.entries(vars).forEach(([key, value]) => el.style.setProperty(key, value));
  return el;
}

function seedDoorAtmospheres() {
  if (reducedMotion) return;

  document.querySelectorAll('.choice-door-soft').forEach(door => {
    if (door.querySelector('.door-fx')) return;
    const fx = doorFxEl('door-fx');

    for (let i = 0; i < 16; i++) {
      fx.append(doorFxEl(`door-soft-mote${i % 3 === 1 ? ' alt' : ''}`, {
        left: `${15 + Math.random() * 70}%`,
        top: `${48 + Math.random() * 35}%`,
        '--dx': `${(Math.random() - .5) * 40}px`,
        '--rise': `${96 + Math.random() * 58}px`,
        '--dur': `${5.4 + Math.random() * 3.4}s`,
        '--delay': `${-Math.random() * 8}s`
      }));
    }
    door.prepend(fx);
  });

  document.querySelectorAll('.choice-door-hot').forEach(door => {
    if (door.querySelector('.door-fx')) return;
    const fx = doorFxEl('door-fx');

    for (let i = 0; i < 24; i++) {
      fx.append(doorFxEl(`door-ember${i % 4 === 0 ? ' tiny' : ''}`, {
        left: `${18 + Math.random() * 64}%`,
        top: `${63 + Math.random() * 18}%`,
        '--wobble-a': `${10 + Math.random() * 18}px`,
        '--wobble-b': `${-(10 + Math.random() * 18)}px`,
        '--drift-x': `${(Math.random() - 0.5) * 18}px`,
        '--rot': `${(Math.random() - 0.5) * 42}deg`,
        '--dur': `${0.95 + Math.random() * 0.75}s`,
        '--delay': `${-Math.random() * 2.4}s`
      }));
    }

    for (let i = 0; i < 7; i++) {
      fx.append(doorFxEl('door-smoke', {
        left: `${22 + Math.random() * 56}%`,
        top: `${48 + Math.random() * 21}%`,
        '--dx': `${(Math.random() - .5) * 46}px`,
        '--rise': `${78 + Math.random() * 92}px`,
        '--dur': `${2.7 + Math.random() * 1.4}s`,
        '--delay': `${-Math.random() * 4.1}s`
      }));
    }
    door.prepend(fx);
  });
}

function burstDoorAtmosphere(door, hot) {
  if (reducedMotion) return;
  const count = hot ? 22 : 12;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('i');
    particle.className = hot ? 'door-burst-hot' : 'door-burst-soft';
    particle.setAttribute('aria-hidden', 'true');
    particle.textContent = hot
      ? (i % 4 === 0 ? '✹' : (i % 2 ? '✦' : '•'))
      : (i % 2 ? '✧' : '·');
    particle.style.setProperty('--bx', `${(Math.random() - .5) * (hot ? 190 : 125)}px`);
    particle.style.setProperty('--by', `${-24 - Math.random() * (hot ? 155 : 92)}px`);
    door.append(particle);
    setTimeout(() => particle.remove(), 1150);
  }
}

seedDoorAtmospheres();

document.querySelectorAll('[data-door]').forEach(door => door.addEventListener('click', () => {
  const hot = door.dataset.door === 'hot';
  const stage = door.closest('.door-stage');
  stage.classList.toggle('picked-hot', hot);
  stage.classList.toggle('picked-soft', !hot);
  stage.querySelectorAll('[data-door]').forEach(other => other.setAttribute('aria-pressed', String(other === door)));
  const result = document.querySelector('#door-result');
  if (result) result.textContent = en
    ? (hot ? 'Burning. The next beat turns up the tension — because you chose it.' : 'Soft. You keep control of the pace without killing the surprise.')
    : (hot ? 'Brûlante. La suite monte d’un cran — parce que vous l’avez choisi.' : 'Douce. Vous gardez le contrôle du rythme sans tuer la surprise.');

  burstDoorAtmosphere(door, hot);

  if (!reducedMotion) {
    for (let i = 0; i < 8; i++) {
      const spark = node('i', 'door-spark', i % 2 ? '✦' : '·');
      spark.style.setProperty('--sx', `${(Math.random() - .5) * 160}px`);
      spark.style.setProperty('--sy', `${-20 - Math.random() * 125}px`);
      door.append(spark);
      setTimeout(() => spark.remove(), 900);
    }
  }
}));

if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  const heroArt = document.querySelector('.hero-art');
  heroArt?.addEventListener('pointermove', e => {
    const r = heroArt.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5);
    const y = ((e.clientY - r.top) / r.height - .5);
    heroArt.style.setProperty('--hero-shift-x', `${(x * 18).toFixed(1)}px`);
    heroArt.style.setProperty('--hero-shift-y', `${(y * 16).toFixed(1)}px`);
    heroArt.style.setProperty('--hero-back-x', `${(-x * 11).toFixed(1)}px`);
    heroArt.style.setProperty('--hero-back-y', `${(-y * 9).toFixed(1)}px`);
  });
  heroArt?.addEventListener('pointerleave', () => { heroArt.style.setProperty('--hero-shift-x', '0px'); heroArt.style.setProperty('--hero-shift-y', '0px'); heroArt.style.setProperty('--hero-back-x', '0px'); heroArt.style.setProperty('--hero-back-y', '0px'); });
}

const floatingCta = document.querySelector('#floating-cta');
const closingSection = document.querySelector('.closing');
const updateFloatingCta = () => {
  if (!floatingCta) return;
  const closingNear = closingSection ? closingSection.getBoundingClientRect().top < innerHeight * .9 : false;
  floatingCta.classList.toggle('is-visible', scrollY > 650 && !closingNear);
};
addEventListener('scroll', updateFloatingCta, { passive: true }); updateFloatingCta();

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
const facts = {
  fr: {
    paired: { guided: '✓ Parcours guidés (Premium), nombre non publié', spicy: 'Classé 18+ : thèmes intimes et suggestifs, sans mode dédié annoncé', phones: 'L’autre réponse se débloque après la vôtre ; appareils non précisés', private: 'Pas de pub citée · identifiants et données marketing déclarés', how: 'Questions, quiz et parcours ; 1 question gratuite par jour', age: '18+' },
    agape: { guided: 'Une question par jour, pas de soirée guidée', spicy: 'Questions « épicées » une fois le partenaire relié', phones: 'Chacun répond de son côté ; réponse révélée quand les deux ont répondu', private: 'Nom, e-mail et identifiant déclarés · pas de pub citée', how: 'Question quotidienne, chat, photos, souvenirs, série de jours', age: '16+ · anglais seulement' },
    lovewick: { guided: 'Pas de soirée guidée ; idées de rendez-vous en plus', spicy: 'Paquet « intimité » et idées intimes, détails non publiés', phones: '✓ Seul ou jumelé : questions et souvenirs synchronisés', private: 'Compte non précisé · pas de pub citée · suivi marketing déclaré', how: '6 paquets de questions, 750+ idées de rendez-vous, rappels, frise souvenirs', age: '16+' },
    gottman: { guided: 'Un flux de pioche, pas de parcours', spicy: 'Decks « Salsa » et questions sur la sexualité et les rendez-vous', phones: 'Non précisé', private: 'Gratuit, sans achat · e-mail déclaré · pas de pub citée', how: '22 decks à piocher, dont « Love Maps » et parentalité', age: '18+ · anglais (espagnol en v2.2)' },
    togella: { guided: 'Pas de soirée guidée ; compatibilité et idées de rendez-vous en plus', phones: 'Non précisé', private: 'Pub non précisée · données marketing déclarées · de 6,99 €/semaine à 44,99 € à vie', how: '11 modes : Qui est le plus susceptible, Tu préfères, Jamais je n’ai, 20 questions…', age: '13+ · anglais seulement' },
    lovify: { guided: 'Une roue des thèmes ; pas de final annoncé', spicy: 'Thème « intimité » et questions « audacieuses »', private: '✗ Contient de la publicité (classement App Store)', how: 'Un quiz : on répond sur soi, puis on devine l’autre ; 50+ thèmes', age: '18+' },
    connected: { guided: 'Check-ins, bilans et coach IA ; pas de soirée guidée', spicy: '« Intimacy check-ins » en Premium, contenu non détaillé', phones: '✓ Code partenaire : tout se synchronise entre vous', private: 'Compte requis (e-mail, Apple ou Google) · pub non citée', how: 'Question du jour, check-ins, quiz, planificateur de rendez-vous, journal', age: 'Non précisé' },
    wnr: { guided: '✓ Parcours en 3 niveaux : perception, connexion, réflexion', spicy: 'Non annoncé', how: '150 cartes, cartes joker, crayon et bloc-notes inclus', age: '2 joueurs (2–6 annoncés selon revendeur)' },
    lingual: { guided: 'Pas de parcours ; 5 catégories', spicy: 'Une catégorie « intimité » ; détails non publiés', how: 'Aucune règle fixée : on tire et on discute', age: 'Couples, à tout stade' },
    and: { guided: 'Pas de parcours : 12 cartes tirées, lues à tour de rôle', spicy: 'Non annoncé : émotionnel, désirs, peurs, langages de l’amour', how: 'Seule règle : l’honnêteté ; on peut passer', age: 'Non précisé' },
    perel: { guided: '✓ Version simple (cartes histoires) ou avancée (cartes-thèmes et jetons)', spicy: 'Non annoncé', how: 'Chacun pose une histoire face cachée ; le conteur choisit. Pas de gagnant', age: '18+ · 2 à 6 joueurs' },
    bestself: { guided: '✓ Enveloppe de cartes spéciales « Réfléchir et se relier » à la fin', spicy: 'Pas décrit comme explicite', how: 'Questions en 7 catégories, à tour de rôle', age: '2 joueurs' },
    tabletopics: { guided: 'Pas de parcours : on tire et on discute', spicy: 'Non explicite : romantique, souvent humoristique', how: 'Rendez-vous, dîner, soirée à la maison, thérapie', age: '21+ · actuellement en rupture de stock' },
    adventure: { guided: '✓ 50 aventures à gratter, de 0 à 50 $ ; chacune se réalise une fois grattée', spicy: 'Édition classique classée PG ; la version épicée « In Bed » est un autre livre', how: 'Grattez, faites l’aventure, notez-la et collez une photo', age: 'Couples, à tout stade' }
  },
  en: {
    paired: { guided: '✓ Guided journeys (Premium), count unpublished', spicy: 'Rated 18+: intimate and suggestive themes, no dedicated mode advertised', phones: 'The other’s answer unlocks after yours; devices not specified', private: 'No ads cited · identifiers and marketing data declared', how: 'Questions, quizzes and journeys; 1 free question a day', age: '18+' },
    agape: { guided: 'One question a day, no guided night', spicy: '“Spicy” questions once your partner is connected', phones: 'Each answers separately; answer revealed once both have replied', private: 'Name, e-mail and ID declared · no ads cited', how: 'Daily question, chat, photos, memories, streaks', age: '16+ · English only' },
    lovewick: { guided: 'No guided night; date ideas on top', spicy: 'An “intimacy” deck and intimate ideas, details unpublished', phones: '✓ Solo or paired: questions and memories sync', private: 'Account not specified · no ads cited · marketing tracking declared', how: '6 question decks, 750+ date ideas, reminders, memory timeline', age: '16+' },
    gottman: { guided: 'One draw-and-answer flow, no journey', spicy: '“Salsa” decks and sex and date questions', phones: 'Not specified', private: 'Free, no purchases · e-mail declared · no ads cited', how: '22 decks to draw from, incl. Love Maps and parenting', age: '18+ · English (Spanish in v2.2)' },
    togella: { guided: 'No guided night; compatibility quiz and date ideas on top', phones: 'Not specified', private: 'Ads not specified · marketing data declared · €6.99/week to €44.99 lifetime', how: '11 modes: Who’s More Likely, Would You Rather, Never Have I Ever, 20 Questions…', age: '13+ · English only' },
    lovify: { guided: 'A theme wheel; no finale advertised', spicy: '“Intimacy” theme and “bolder” questions', private: '✗ Contains advertising (App Store rating)', how: 'One quiz: answer about yourself, then guess your partner; 50+ themes', age: '18+' },
    connected: { guided: 'Check-ins, assessments and AI coach; no guided night', spicy: '“Intimacy check-ins” in Premium, content not detailed', phones: '✓ Partner code: everything syncs between you', private: 'Account required (e-mail, Apple or Google) · no ads cited', how: 'Daily question, check-ins, quizzes, date planner, journal', age: 'Not specified' },
    wnr: { guided: '✓ 3-level path: perception, connection, reflection', spicy: 'Not advertised', how: '150 cards, wildcards, pencil and notepad included', age: '2 players (2–6 per one retailer)' },
    lingual: { guided: 'No journey; 5 categories', spicy: 'An “intimacy” category; details unpublished', how: 'No fixed rules: draw and talk', age: 'Couples, any stage' },
    and: { guided: 'No journey: draw 12 cards, read them in turns', spicy: 'Not advertised: emotional, desires, fears, love languages', how: 'Only rule: honesty; you may pass', age: 'Not specified' },
    perel: { guided: '✓ Simple (story cards) or advanced (prompt cards and tokens) version', spicy: 'Not advertised', how: 'Each puts a story face down; the storyteller picks one. No winners', age: '18+ · 2 to 6 players' },
    bestself: { guided: '✓ Envelope of special “Reflect and Connect” cards at the end', spicy: 'Not described as explicit', how: 'Questions in 7 categories, in turns', age: '2 players' },
    tabletopics: { guided: 'No journey: draw and talk', spicy: 'Not explicit: romantic, often humorous', how: 'Date night, dinner, evening at home, therapy', age: '21+ · currently out of stock' },
    adventure: { guided: '✓ 50 scratch-off adventures, $0–$50; each is a must once scratched', spicy: 'The standard edition is rated PG; the spicy “In Bed” edition is a separate book', how: 'Scratch, do the adventure, log it and add a photo', age: 'Couples, any stage' }
  }
}[lang];
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
  const priceRow = duelRow(copy.price, copy.oursPrice, rival.price);
  priceRow.classList.add('price-row');
  body.append(
    priceRow,
    duelRow(copy.content, copy.oursContent, copy.volumes[rival.id]),
    duelRow(copy.mechanics, copy.oursMechanics, copy.formats[rival.id]),
    duelRow(copy.how, copy.oursHow, facts[rival.id].how),
    duelRow(copy.age, copy.oursAge, facts[rival.id].age),
    duelRow(copy.guided, copy.oursGuided, facts[rival.id].guided || rival.guided || (physical ? copy.physicalNA : copy.unknown), true),
    duelRow(copy.comfort, copy.oursComfort, physical ? copy.physicalNA : copy.unknown, true),
    duelRow(copy.spicy, copy.oursSpicy, facts[rival.id].spicy || rival.spicy || (physical ? copy.physicalNA : copy.unknown), true),
    duelRow(copy.phones, copy.oursPhones, facts[rival.id].phones || rival.phones || (physical ? copy.physicalNA : copy.unknown), true),
    duelRow(copy.private, copy.oursPrivate, facts[rival.id].private || (physical ? copy.physicalNA : copy.unknown), true)
  );
  body.querySelectorAll('tr').forEach(row => { row.children[1].dataset.label = copy.duelUs; row.children[2].dataset.label = rival.name; });
  table.append(body); duel.append(table);
  marketTabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.market === market)));
}
marketTabs.forEach(tab => tab.addEventListener('click', () => { market = tab.dataset.market; selected = markets[market][0].id; renderDuel(); }));
renderDuel();

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.story-card,.benefit-grid article,.advantage-board,.heat-layout,.draw-layout,.door-layout,.price-band-inner,.duel-panel').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}
const updateScroll = () => document.documentElement.style.setProperty('--scroll-progress', `${Math.round(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100)}%`);
addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
