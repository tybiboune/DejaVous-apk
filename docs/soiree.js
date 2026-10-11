(() => {
// "Votre soirée": a five-step evening that starts already begun (endowed progress), fills as the visitor plays with the page (goal gradient),
// ends on a finale that continues in the app (open loop), and is remembered on this browser only (no tracking, nothing sent anywhere).
const en = document.documentElement.lang === 'en';
const T = en ? {
  chip: 'Your evening', title: 'Your evening is under way', left: n => n === 1 ? 'One step left before the finale.' : `${n} steps left before the finale.`,
  steps: ['You arrived', 'Draw a card', 'Open a door', 'Play a round', 'Change the temperature'],
  done: 'Your evening is ready', doneText: 'The finale, the vouchers and the cards that follow are played in the app.', cta: 'Finish it in Déjà Vous ↗',
  back: n => `You started an evening here: ${n}/5. Pick up where you left off?`, go: 'Continue', close: 'Close', toast: 'Evening complete. The finale is in the app ↗'
} : {
  chip: 'Votre soirée', title: 'Votre soirée est lancée', left: n => n === 1 ? 'Plus qu’une étape avant le final.' : `Encore ${n} étapes avant le final.`,
  steps: ['Vous êtes arrivés', 'Piochez une carte', 'Ouvrez une porte', 'Jouez une manche', 'Changez la température'],
  done: 'Votre soirée est prête', doneText: 'Le final, les bons à gagner et les cartes suivantes se jouent dans l’appli.', cta: 'La finir dans Déjà Vous ↗',
  back: n => `Vous aviez commencé une soirée ici : ${n}/5. Reprendre où vous en étiez ?`, go: 'Reprendre', close: 'Fermer', toast: 'Soirée complète. Le final est dans l’appli ↗'
};
const APK = 'https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk';
const WHERE = ['#top', '#draw-title', '#door-title', '#demo-title', '#heat-title'];
const KEY = 'dv-soiree';
const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter(i => i >= 1 && i <= 4) : []; } catch { return []; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch {} };
const done = new Set(read());
const count = () => 1 + done.size;                  // the arrival is always given: the bar is never empty

const root = document.createElement('div'); root.className = 'soiree';
root.innerHTML = `<button type="button" class="soiree-chip" aria-expanded="false" aria-controls="soiree-panel"><span class="soiree-dots" aria-hidden="true">${'<i></i>'.repeat(5)}</span><span class="soiree-n"></span></button>
<div class="soiree-panel" id="soiree-panel" hidden><h3></h3><p></p><ol></ol><a class="button button-primary" href="${APK}" hidden></a></div>`;
document.body.append(root);
const chip = root.querySelector('.soiree-chip'), panel = root.querySelector('.soiree-panel'), dots = [...root.querySelectorAll('.soiree-dots i')];
function render(justDone) {
  const n = count(), all = n === 5;
  dots.forEach((d, i) => { const on = i === 0 || done.has(i); d.classList.toggle('on', on); if (justDone === i) { d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop'); } });
  root.classList.toggle('is-done', all);
  root.querySelector('.soiree-n').textContent = `${T.chip} ${n}/5`;
  panel.querySelector('h3').textContent = all ? T.done : T.title;
  panel.querySelector('p').textContent = all ? T.doneText : T.left(5 - n);
  panel.querySelector('ol').innerHTML = T.steps.map((s, i) => { const on = i === 0 || done.has(i); return `<li class="${on ? 'on' : ''}"><${on ? 'span' : `a href="${WHERE[i]}"`}><b>${on ? '✓' : i + 1}</b>${s}</${on ? 'span' : 'a'}></li>`; }).join('');
  const cta = panel.querySelector('.button'); cta.hidden = !all; cta.textContent = T.cta;
}
function complete(i) {
  if (i === 0 || done.has(i)) return;
  done.add(i); save(); render(i);
  if (count() === 5) { toast(); setTimeout(() => open(true), 400); }
}
function open(on) { panel.hidden = !on; chip.setAttribute('aria-expanded', String(on)); }
chip.addEventListener('click', () => open(panel.hidden));
panel.addEventListener('click', e => { if (e.target.closest('a')) open(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });
function toast() {
  const t = document.createElement('a'); t.className = 'soiree-back'; t.href = APK; t.textContent = T.toast; t.style.fontWeight = '800'; document.body.append(t); setTimeout(() => t.remove(), 6000);
}
const on = (sel, i, type = 'click') => document.addEventListener(type, e => { if (e.target.closest(sel)) complete(i); });
on('#draw-card', 1); on('[data-door]', 2); on('#demo-panel button, .demo-tabs button', 3); on('[data-spicy-mode], [data-theme-mode]', 4);
render();

// A started evening that was left open calls the visitor back once per visit (Zeigarnik / Ovsiankina), then stays quiet.
try {
  const seen = sessionStorage.getItem('dv-soiree-seen'); sessionStorage.setItem('dv-soiree-seen', '1');
  const n = count();
  if (!seen && n > 1 && n < 5) {
    const next = [1, 2, 3, 4].find(i => !done.has(i));
    const bar = document.createElement('div'); bar.className = 'soiree-back'; bar.setAttribute('role', 'status');
    bar.innerHTML = `<span>${T.back(n)}</span><a href="${WHERE[next]}">${T.go}</a><button type="button" aria-label="${T.close}">×</button>`;
    bar.querySelector('button').onclick = () => bar.remove(); bar.querySelector('a').onclick = () => bar.remove();
    document.body.append(bar); setTimeout(() => bar.remove(), 12000);
  }
} catch {}
})();
