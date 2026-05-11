import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Skip on touch devices — no mouse cursor needed
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

    const animate = () => {
      ringPos.current.x += (mouseX - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouseY - ringPos.current.y) * 0.12;
      ring.style.left = ringPos.current.x + 'px';
      ring.style.top = ringPos.current.y + 'px';
      raf.current = requestAnimationFrame(animate);
    };

    const onEnter = () => { dot.classList.add('hovering'); ring.classList.add('hovering'); };
    const onLeave = () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); };

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
