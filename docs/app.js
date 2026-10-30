const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
const en = lang === 'en';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const panel = document.querySelector('#demo-panel');
const demoPhone = document.querySelector('.demo-phone');
const demoTabs = [...document.querySelectorAll('[data-demo]')];
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
    word: 'Mot de la personne', idea: 'Votre idée', hideWord: 'Garder mon mot secret', revealWords: 'Révéler les deux mots', wordHidden: 'Mot gardé secret', passPhone: 'Passez le téléphone.', fusionWin: 'Vous avez fusionné !', fusionBridge: 'Même idée ?', fusionBridgeHelp: 'Dites-vous pourquoi vous avez choisi ces mots. Même idée ? C’est une fusion !', fusionAgain: 'Essayer deux autres mots'
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
    word: 'Player', idea: 'Your idea', hideWord: 'Keep my word secret', revealWords: 'Reveal both words', wordHidden: 'Word saved in secret', passPhone: 'Pass the phone.', fusionWin: 'You fused!', fusionBridge: 'Same idea?', fusionBridgeHelp: 'Tell each other why you chose these words. Same idea? That is a fusion!', fusionAgain: 'Try two new words'
  }
}[lang];

function node(tag, className = '', content) { const el = document.createElement(tag); if (className) el.className = className; if (content !== undefined) el.textContent = content; return el; }
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
// The inline script in <head> already applied the stored mood before the first paint: only what differs is written here,
// so loading this file never starts the theme transition again.
function applyPromoTheme({ persist = true } = {}) {
  const root = document.documentElement;
  if (root.dataset.theme !== promoTheme.theme) root.dataset.theme = promoTheme.theme;
  if (root.dataset.spicy !== promoTheme.spicy) root.dataset.spicy = promoTheme.spicy;
  if (document.body.classList.contains('heat-on') !== (promoTheme.spicy === 'on')) document.body.classList.toggle('heat-on', promoTheme.spicy === 'on');
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
  const themeColor = promoTheme.theme === 'light'
    ? (promoTheme.spicy === 'on' ? '#f8eff4' : '#f8efe9')
    : (promoTheme.spicy === 'on' ? '#150f1d' : '#191020');
  if (themeMeta && themeMeta.content !== themeColor) themeMeta.content = themeColor;
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
  drawCounter.textContent = en ? '18,000+ more in the full game.' : 'Plus de 18 000 autres dans le jeu complet.';
  if (drawn >= 3) {
    drawButton.hidden = true;
    drawDownload.hidden = false;
    drawCounter.textContent = en ? 'That was three. There are 18,000+ more reasons to keep going.' : 'Ça, c’était trois. Il reste plus de 18 000 raisons de continuer.';
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
const topbar = document.querySelector('.topbar');
// Scroll-driven bits (floating button, progress line under the header): measured once per frame, all reads before all writes.
function updateOnScroll() {
  const closingNear = floatingCta && closingSection ? closingSection.getBoundingClientRect().top < innerHeight * .9 : false;
  const progress = `${Math.round(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100)}%`;
  if (floatingCta) floatingCta.classList.toggle('is-visible', scrollY > 650 && !closingNear);
  // On the header only: changing a variable on <html> would restyle the whole page at every scroll step.
  topbar?.style.setProperty('--scroll-progress', progress);
}
let scrollFrame = 0;
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateOnScroll(); }); }, { passive: true });

const marqueeTrack = document.querySelector('#marquee-track');
let marqueeWidth = -1;
function buildMarquee() {
  const track = marqueeTrack; if (!track) return;
  marqueeWidth = innerWidth;
  const set = node('div', 'marquee-set'); track.replaceChildren(set);
  const addRun = () => copy.marquee.forEach(word => { set.append(node('span', '', word), node('i', '', '✳')); });
  addRun();
  // Same result as adding one run of words and measuring again until the set is wide enough, with far fewer measures:
  // the set grows by one run's width each time, so all the runs that surely fall short are added before measuring again.
  const runs = Math.ceil((innerWidth + 120) / set.getBoundingClientRect().width) - 1;
  for (let k = 1; k < runs && set.childElementCount < 100; k++) addRun();
  while (set.getBoundingClientRect().width < innerWidth + 120 && set.childElementCount < 100) addRun();
  track.replaceChildren(set, set.cloneNode(true)); track.lastElementChild.setAttribute('aria-hidden', 'true');
}
let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (innerWidth !== marqueeWidth) buildMarquee(); }, 180); });
// The marquee only runs while it is on screen (it starts again 200 px before it comes into view).
if (marqueeTrack && 'IntersectionObserver' in window) new IntersectionObserver(([entry]) => { marqueeTrack.style.animationPlayState = entry.isIntersecting ? '' : 'paused'; }, { rootMargin: '200px 0px' }).observe(marqueeTrack.parentElement);

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.story-card,.benefit-grid article,.heat-layout,.draw-layout,.door-layout,.price-band-inner').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}
// First layout work in one frame: build the marquee (it measures itself), then the scroll-driven bits.
requestAnimationFrame(() => { buildMarquee(); updateOnScroll(); });
