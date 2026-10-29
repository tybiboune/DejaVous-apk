// A payment started from the app (…&app=1): the page leads straight back into it. After payment the app fetches its own code with the
// session id; nothing to copy. A cancelled payment simply goes back too.
const q = new URLSearchParams(location.search), en = document.documentElement.lang === 'en';
if (q.get('app') === '1') {
  const sid = q.get('session_id') || '', paid = /^cs_(live|test)_[A-Za-z0-9]{20,200}$/.test(sid);
  const href = paid ? `dejavous://paid?session_id=${encodeURIComponent(sid)}` : 'dejavous://cancel';
  const box = document.createElement('section'); box.className = 'ul-why app-return';
  box.innerHTML = `<h2>${paid ? (en ? 'Back to the app' : 'Retour dans l’appli') : (en ? 'Payment cancelled' : 'Paiement annulé')}</h2>
    <p>${paid ? (en ? 'The game unlocks by itself as soon as you are back: no code to copy.' : 'Le jeu se débloque tout seul dès votre retour : aucun code à copier.') : (en ? 'Nothing was charged.' : 'Rien n’a été débité.')}</p>
    <a class="ul-btn" href="${href}" style="text-decoration:none">${en ? 'Open Déjà Nous' : 'Ouvrir Déjà Nous'}</a>`;
  document.querySelector('main')?.prepend(box);
  if (paid) setTimeout(() => { location.href = href; }, 1200);
}
