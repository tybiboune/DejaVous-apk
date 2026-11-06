const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
function syncLanguageLinks() { document.querySelectorAll('.language-switch a').forEach(link => { link.href = `${link.getAttribute('href').split('#')[0]}${location.hash}`; }); }
addEventListener('hashchange', syncLanguageLinks); syncLanguageLinks();

// The look (dark or light) is set before the first paint by the inline script in <head> (key dv-promo-theme).
const copy = {
  fr: { marquee: ['RIRE PLUS FORT', 'DEVINER DE TRAVERS', 'BLUFFER SANS VERGOGNE', 'OSER À DEUX', 'CHANGER LES RÈGLES', 'RECOMMENCER DEMAIN'] },
  en: { marquee: ['LAUGH LOUDER', 'GUESS WRONG WITH CONFIDENCE', 'BLUFF SHAMELESSLY', 'DARE TOGETHER', 'CHANGE THE RULES', 'PLAY AGAIN TOMORROW'] }
}[lang];

function node(tag, className = '', content) { const el = document.createElement(tag); if (className) el.className = className; if (content !== undefined) el.textContent = content; return el; }

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
  document.querySelectorAll('.story-card,.benefit-grid article').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}
// First layout work in one frame: build the marquee (it measures itself), then the scroll-driven bits.
requestAnimationFrame(() => { buildMarquee(); updateOnScroll(); });
