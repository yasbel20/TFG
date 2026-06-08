export function updateReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const H = window.innerHeight;
  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    if (reduced) { el.classList.add('revealed'); return; }
    const { top, bottom } = el.getBoundingClientRect();
    if (bottom > 0 && top < H * 0.9) {
      el.classList.add('revealed');
    }
  });
}

export function setupReveal() {
  let raf;
  const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(updateReveal); };
  window.addEventListener('scroll', onScroll, { passive: true });
  updateReveal();
  return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
}
