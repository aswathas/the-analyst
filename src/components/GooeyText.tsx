import { useRef, useEffect } from 'react';

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}

export function GooeyText({ texts, morphTime = 1.2, cooldownTime = 0.4, style, textStyle }: GooeyTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let animId: number;

    const setMorph = (fraction: number) => {
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const f2 = 1 - fraction;
      text1Ref.current.style.filter = `blur(${Math.min(8 / f2 - 8, 100)}px)`;
      text1Ref.current.style.opacity = `${Math.pow(f2, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      if (!text1Ref.current || !text2Ref.current) return;
      text2Ref.current.style.filter = '';
      text2Ref.current.style.opacity = '100%';
      text1Ref.current.style.filter = '';
      text1Ref.current.style.opacity = '0%';
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;
      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div style={{ position: 'relative', ...style }}>
      <svg style={{ position: 'absolute', height: 0, width: 0 }} aria-hidden>
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix in="SourceGraphic" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        filter: 'url(#gooey-threshold)',
        width: '100%',
        height: '100%',
      }}>
        <span ref={text1Ref} style={{ position: 'absolute', display: 'inline-block', userSelect: 'none', ...textStyle }} />
        <span ref={text2Ref} style={{ position: 'absolute', display: 'inline-block', userSelect: 'none', ...textStyle }} />
      </div>
    </div>
  );
}
