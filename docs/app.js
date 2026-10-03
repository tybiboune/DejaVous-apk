const panel = document.querySelector('#demo-panel');
const demoTabs = [...document.querySelectorAll('[data-demo]')];
const marketTabs = [...document.querySelectorAll('[data-market]')];

function node(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}

function addButton(parent, label, action, className = '') {
  const button = node('button', className, label);
  button.type = 'button';
  button.addEventListener('click', action);
  parent.append(button);
  return button;
}

function resetPanel(kicker, title, description) {
  panel.replaceChildren(node('div', 'demo-kicker', kicker), node('h3', '', title));
  if (description) panel.append(node('p', '', description));
}

function showBrain() {
  const question = 'Qui nous perdrait en chemin et appellerait ça une aventure ?';
  let firstAnswer;
  function ask(player) {
    resetPanel(`Même cerveau · personne ${player}/2`, question,
      player === 1 ? 'Choisissez en secret, puis passez l’écran.' : 'À votre tour. La première réponse reste cachée.');
    const choices = node('div', 'demo-options');
    ['Personne 1', 'Personne 2'].forEach(choice => addButton(choices, choice, () => {
      if (player === 1) {
        firstAnswer = choice;
        resetPanel('Réponse gardée secrète', 'À l’autre de jouer.', 'La première réponse est cachée. Passez le téléphone.');
        addButton(panel, 'Je suis prêt·e', () => ask(2), 'demo-button');
      } else {
        resetPanel('Révélation', firstAnswer === choice ? 'Même cerveau !' : 'Pas la même histoire…');
        panel.append(node('div', 'demo-result', `Personne 1 : ${firstAnswer} · Personne 2 : ${choice}`));
        panel.append(node('p', 'demo-muted', 'Dans le jeu complet, les réponses communes font gagner des points.'));
        addButton(panel, 'Rejouer', showBrain, 'demo-button');
      }
    }));
    panel.append(choices);
  }
  ask(1);
}

function showRapid() {
  const pairs = [['Mer', 'Montagne'], ['Café', 'Thé'], ['Lever de soleil', 'Coucher de soleil']];
  const picks = [];
  function ask(index) {
    if (index === pairs.length) {
      resetPanel('Tir rapide · 3/3', 'Votre trio est prêt.', 'Dans le jeu, vous comparez vos réflexes à ceux de votre partenaire.');
      panel.append(node('div', 'demo-result', picks.join(' · ')));
      addButton(panel, 'Recommencer', showRapid, 'demo-button');
      return;
    }
    resetPanel(`Tir rapide · ${index + 1}/3`, 'Votre instinct dit quoi ?', 'Choisissez sans trop réfléchir.');
    const progress = node('div', 'demo-progress');
    pairs.forEach((_, i) => progress.append(node('i', i < index ? 'done' : '')));
    panel.append(progress);
    const choices = node('div', 'demo-options');
    pairs[index].forEach(choice => addButton(choices, choice, () => { picks.push(choice); ask(index + 1); }));
    panel.append(choices);
  }
  ask(0);
}

function showFusion() {
  let firstWord;
  function ask(player) {
    resetPanel(`Fusion · thème : week-end · ${player}/2`, 'Un mot chacun. Une idée commune.',
      player === 1 ? 'Écrivez un mot, puis passez l’écran.' : 'Votre partenaire a écrit son mot en secret. Écrivez le vôtre.');
    const form = node('form', 'demo-inputs');
    const label = node('label', '', `Mot de la personne ${player}`);
    const input = node('input');
    input.type = 'text'; input.required = true; input.maxLength = 30;
    input.autocomplete = 'off'; input.placeholder = 'Votre idée';
    label.append(input); form.append(label);
    const submit = node('button', 'demo-button', player === 1 ? 'Garder mon mot secret' : 'Révéler les deux mots');
    submit.type = 'submit'; form.append(submit);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const word = input.value.trim();
      if (!word) return;
      if (player === 1) {
        firstWord = word;
        resetPanel('Mot gardé secret', 'À l’autre de jouer.', 'Passez le téléphone.');
        addButton(panel, 'Je suis prêt·e', () => ask(2), 'demo-button');
      } else {
        const same = firstWord.localeCompare(word, 'fr', { sensitivity: 'base' }) === 0;
        resetPanel('Fusion · révélation', same ? 'Vous avez fusionné !' : 'Trouvez le mot-pont.');
        panel.append(node('div', 'demo-result', `${firstWord} + ${word}`));
        if (!same) panel.append(node('p', '', 'Écrivez chacun un mot entre ces deux idées. Révélez, rapprochez-vous, recommencez !'));
        addButton(panel, 'Essayer deux autres mots', showFusion, 'demo-button');
      }
    });
    panel.append(form);
  }
  ask(1);
}

const demos = { brain: showBrain, rapid: showRapid, fusion: showFusion };
demoTabs.forEach(tab => tab.addEventListener('click', () => {
  demoTabs.forEach(other => other.setAttribute('aria-selected', String(other === tab)));
  demos[tab.dataset.demo]();
}));
showBrain();

// Prices are listed local storefront or maker prices, checked 3 October 2026.
// Volumes keep the publisher's original unit; an activity is not a question.
const markets = {
  digital: [
    ['Paired', 'Gratuit + Premium 74,99 €/an affichés', '1 000+ activités', 'Nombre de jeux non publié ; questions, quiz, parcours', 'Plusieurs tarifs promotionnels en achat intégré.', 'https://apps.apple.com/fr/app/paired-appli-de-relation/id1469609343'],
    ['Agapé', 'Gratuit + dès 9,99 €/mois affichés', 'Non publié', '1 flux principal : question quotidienne à deux', 'Tarifs d’abonnement variables selon l’offre.', 'https://apps.apple.com/fr/app/agap%C3%A9-feel-close-when-apart/id1507907556'],
    ['Lovewick', 'Gratuit + 29,99 €/an affichés', '1 000+ questions', '1 flux de cartes en 6 catégories + idées de rendez-vous', 'Les 6 catégories ne sont pas 6 mécaniques.', 'https://apps.apple.com/fr/app/lovewick-relationship-tracker/id1516199115'],
    ['Gottman Card Decks', 'Gratuit', '1 000+ cartes, 22 decks', '1 flux de cartes : piocher, mélanger, favoris', 'Les 22 decks sont des thèmes, pas 22 jeux.', 'https://apps.apple.com/us/app/gottman-card-decks/id1292398843'],
    ['Togella', 'Gratuit + 22,99 €/an affichés', '2 000+ questions', '11 modes annoncés', 'Concurrent fort sur le volume et la variété.', 'https://apps.apple.com/fr/app/togella-couples-question-games/id6777234833'],
    ['Lovify', 'Gratuit + achats intégrés dès 3,99 €', '1 000+ questions, 50+ sujets', '1 flux principal : répondre / deviner à deux', 'Le contenu inclus gratuitement n’est pas détaillé.', 'https://apps.apple.com/fr/app/lovify-jeu-en-couple-quiz/id1645893544'],
    ['Connected', 'Gratuit + 12,99 $/mois affichés', '700+ questions', 'Nombre de jeux non publié ; check-in, bilans, coach', 'Plusieurs outils relationnels.', 'https://www.connectedcouples.app/']
  ],
  physical: [
    ["We're Not Really Strangers — Couples", '20 $', '150 cartes', '1 jeu progressif en 3 niveaux', 'Les niveaux ne sont pas 3 jeux distincts.', 'https://www.werenotreallystrangers.com/pages/couples-edition'],
    ['Love Lingual — Couples', '26,95 $', '150 questions', '1 format principal : piocher et discuter', 'Profondeur par catégories.', 'https://lovelingual.com/products/love-lingual-couples-edition'],
    ['{THE AND} — Couples', '29 $', '199 questions', '1 format principal : piocher et répondre', 'Version physique ; version numérique vendue séparément.', 'https://shop.theskindeep.com/products/the-and-couples-edition'],
    ['Where Should We Begin? — 2e éd.', '34,99 $', '200 cartes-histoires', 'Nombre de règles non publié ; dés, jetons, guides', '200 désigne les cartes-histoires, pas tout le contenu.', 'https://game.estherperel.com/products/where-should-we-begin-a-game-of-stories-2nd-edition'],
    ['BestSelf — Intimacy Deck', '27 $', '170 cartes', '1 format de questions en 7 catégories', 'Les catégories ne sont pas 7 mécaniques.', 'https://bestself.co/collections/relationships/products/intimacy-deck'],
    ['TableTopics — Couples', '25 $', '135 cartes', '1 format principal : piocher et discuter', 'Prix US ; disponibilité variable.', 'https://tabletopics.com/products/couples?currency=USD&variant=42509261799573'],
    ['The Adventure Challenge — Couples', '49,99 $', '50 aventures à gratter', '1 format principal : expérience surprise', 'Livre d’activités, pas un paquet de questions.', 'https://www.theadventurechallenge.com/products/couples-edition-book/']
  ]
};

const marketBody = document.querySelector('#market-rows');
function renderMarket(kind) {
  marketBody.replaceChildren();
  markets[kind].forEach(([name, price, volume, format, note, url]) => {
    const row = node('tr');
    const nameCell = node('td');
    const link = node('a', '', name);
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    nameCell.append(link); row.append(nameCell);
    [price, volume, format, note].forEach(value => row.append(node('td', '', value)));
    marketBody.append(row);
  });
  marketTabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.market === kind)));
}
marketTabs.forEach(tab => tab.addEventListener('click', () => renderMarket(tab.dataset.market)));
renderMarket('digital');
