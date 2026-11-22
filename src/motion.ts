import { drawGlobe } from './globe';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animateSurface(canvas: HTMLCanvasElement, toggle: HTMLButtonElement) {
  const context = canvas.getContext('2d');
  if (!context || !('IntersectionObserver' in window)) return;

  let elapsed = 0;
  let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
  const hero = canvas.closest('.hero');
  hero?.addEventListener('pointermove', event => {
    if (!(event instanceof PointerEvent) || event.pointerType !== 'mouse') return;
    const bounds = hero.getBoundingClientRect();
    pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
  });
  hero?.addEventListener('pointerleave', () => { pointerX = pointerY = 0; });
  let frame = 0;
  let lastPaint = 0;
  let visible = false;
  let paused = false;

  function paint() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * density);
    const pixelHeight = Math.round(height * density);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    context!.setTransform(density, 0, 0, density, 0, 0);
    drawGlobe(context!, width, height, elapsed, tiltX, tiltY);
  }

  function tick(time: number) {
    if (time - lastPaint >= 1000 / 24) {
      if (lastPaint) elapsed += Math.min(time - lastPaint, 100) / 1000;
      tiltX += (pointerX - tiltX) * .09;
      tiltY += (pointerY - tiltY) * .09;
      paint();
      lastPaint = time;
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    lastPaint = 0;
    canvas.hidden = toggle.hidden = prefersReducedMotion.matches;
    if (canvas.hidden || !visible || document.hidden) return;
    paint();
    if (!paused) frame = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-label', paused ? 'Play artwork animation' : 'Pause artwork animation');
    toggle.firstElementChild!.textContent = paused ? '▷' : 'Ⅱ';
    sync();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas.parentElement!);
  window.addEventListener('resize', sync);
  document.addEventListener('visibilitychange', sync);
  prefersReducedMotion.addEventListener('change', sync);
}

const canvas = document.querySelector<HTMLCanvasElement>('.surface canvas');
const toggle = document.querySelector<HTMLButtonElement>('.motion-toggle');
if (canvas && toggle) animateSurface(canvas, toggle);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    }
  });
  document.querySelectorAll('.skill, .project-grid, .stats, .contact').forEach(section => observer.observe(section));
}
