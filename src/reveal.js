const TY = 24;

export function updateReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const H = window.innerHeight;
  const hi = H * 0.78, lo = H * 0.22;
  document.querySelectorAll('.reveal').forEach(el => {
    if (reduced) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; return; }
    const { top, bottom } = el.getBoundingClientRect();
    if (bottom < 0) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; return; }
    if (top > H)    { el.style.opacity = '0'; el.style.transform = `translateY(${TY}px)`; return; }
    const p = top <= lo ? 1 : top >= hi ? 0 : (hi - top) / (hi - lo);
    el.style.opacity   = p.toFixed(3);
    el.style.transform = `translateY(${(TY * (1 - p)).toFixed(1)}px)`;
  });
}

export function setupReveal() {
  let raf;
  const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(updateReveal); };
  window.addEventListener('scroll', onScroll, { passive: true });
  updateReveal();
  return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
}
