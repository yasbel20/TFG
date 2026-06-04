import { useState, useRef, useEffect } from "react";

const COUNT_FROM = (t) => t <= 10 ? 0 : Math.floor(t * 0.85);

export function useStatsCountUp(targets) {
  const [counts, setCounts] = useState(targets.map(COUNT_FROM));
  const sectionRef = useRef(null);
  const max = Math.max(...targets);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let rafIds = [];
    const runAll = () => {
      rafIds.forEach(cancelAnimationFrame);
      rafIds = [];
      targets.forEach((target, i) => {
        const duration = Math.max(300, (target / max) * 900);
        const from = COUNT_FROM(target);
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCounts(prev => { const next = [...prev]; next[i] = Math.floor(from + ease * (target - from)); return next; });
          if (progress < 1) rafIds[i] = requestAnimationFrame(tick);
          else setCounts(prev => { const next = [...prev]; next[i] = target; return next; });
        };
        rafIds[i] = requestAnimationFrame(tick);
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        runAll();
      } else {
        rafIds.forEach(cancelAnimationFrame);
        setCounts(targets.map(COUNT_FROM));
      }
    }, { threshold: 0, rootMargin: '-25% 0px -25% 0px' });
    observer.observe(el);
    return () => { observer.disconnect(); rafIds.forEach(cancelAnimationFrame); };
  }, []);

  return [counts, sectionRef];
}
