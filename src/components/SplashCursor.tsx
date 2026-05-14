import { useEffect, useRef } from 'react';

type SplashCursorProps = {
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  COLOR_UPDATE_SPEED?: number;
  SHADING?: boolean;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
  COLORS?: string[];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  hue: number;
  color: string;
};

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim();
  if (!(h.length === 3 || h.length === 6)) return { r: 255, g: 255, b: 255 };
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function SplashCursor({
  DENSITY_DISSIPATION = 1,
  VELOCITY_DISSIPATION = 2,
  SPLAT_RADIUS = 0.4,
  SPLAT_FORCE = 5500,
  RAINBOW_MODE = false,
  COLOR = '#f53636',
  COLORS,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, down: false, lastX: 0, lastY: 0 });
  const hueRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxParticles = 320;
    const fadeAlpha = Math.max(0.035, Math.min(0.18, 0.08 * (DENSITY_DISSIPATION || 1)));
    const velocityDamp = Math.max(0.82, Math.min(0.96, 0.92 - (VELOCITY_DISSIPATION - 1) * 0.02));
    const radiusScale = 10 + SPLAT_RADIUS * 52;
    const burstStrength = Math.max(0.2, Math.min(1.3, SPLAT_FORCE / 7000));

    const palette = (COLORS && COLORS.length ? COLORS : [COLOR]).map(hexToRgb);
    let paletteIndex = 0;

    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(x: number, y: number, vx: number, vy: number, amount: number) {
      for (let i = 0; i < amount; i += 1) {
        const speed = (0.6 + Math.random() * 1.5) * burstStrength;
        const angle = Math.random() * Math.PI * 2;
        const base = palette[paletteIndex % palette.length];
        paletteIndex += 1;

        particlesRef.current.push({
          x,
          y,
          vx: vx * 0.03 + Math.cos(angle) * speed,
          vy: vy * 0.03 + Math.sin(angle) * speed,
          r: Math.max(1.2, (Math.random() * 0.9 + 0.6) * radiusScale),
          life: 0.7 + Math.random() * 0.9,
          hue: hueRef.current,
          color: `rgb(${base.r},${base.g},${base.b})`,
        });
      }
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
      }
    }

    function onMove(e: PointerEvent) {
      const p = pointerRef.current;
      const x = e.clientX;
      const y = e.clientY;
      const vx = x - p.lastX;
      const vy = y - p.lastY;
      p.x = x;
      p.y = y;
      p.lastX = x;
      p.lastY = y;
      const amount = p.down ? 5 : 3;
      spawn(x, y, vx, vy, amount);
    }

    function onDown(e: PointerEvent) {
      const p = pointerRef.current;
      p.down = true;
      p.x = e.clientX;
      p.y = e.clientY;
      p.lastX = e.clientX;
      p.lastY = e.clientY;
      spawn(e.clientX, e.clientY, 0, 0, 20);
    }

    function onUp() {
      pointerRef.current.down = false;
    }

    function tick() {
      hueRef.current = (hueRef.current + 0.8) % 360;

      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i -= 1) {
        const p = list[i];
        p.vx *= velocityDamp;
        p.vy *= velocityDamp;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.016;
        p.r *= 0.992;

        if (p.life <= 0 || p.r < 0.35) {
          list.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, Math.min(1, p.life));
        const fill = RAINBOW_MODE
          ? `hsla(${(p.hue + i * 2) % 360}, 90%, 60%, ${alpha})`
          : p.color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);

        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = window.requestAnimationFrame(tick);
    }

    resize();
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [COLOR, COLORS, DENSITY_DISSIPATION, RAINBOW_MODE, SPLAT_FORCE, SPLAT_RADIUS, VELOCITY_DISSIPATION]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
      }}
    />
  );
}

