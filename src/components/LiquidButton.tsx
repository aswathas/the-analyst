import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LiquidButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function GlassFilter() {
  return (
    <svg style={{ display: 'none' }}>
      <defs>
        <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="2" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="50" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

const glassBoxShadow = [
  '0 0 0 1px rgba(255,255,255,0.12)',
  'inset 0 1px 0 rgba(255,255,255,0.18)',
  'inset 0 -1px 0 rgba(255,255,255,0.06)',
  'inset 1px 0 0 rgba(255,255,255,0.08)',
  'inset -1px 0 0 rgba(255,255,255,0.08)',
  '0 4px 20px rgba(0,0,0,0.4)',
  '0 1px 4px rgba(0,0,0,0.3)',
].join(',');

const baseStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '13px 28px',
  borderRadius: '9999px',
  background: 'rgba(255,255,255,0.08)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '17px',
  fontWeight: 400,
  letterSpacing: '-0.022em',
  lineHeight: 1,
  border: 'none',
  cursor: 'none',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  boxShadow: glassBoxShadow,
  overflow: 'hidden',
};

export function LiquidButton({ children, href, onClick, style }: LiquidButtonProps) {
  const combined = { ...baseStyle, ...style };

  if (href) {
    return (
      <>
        <GlassFilter />
        <motion.a
          href={href}
          style={combined}
          whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.13)', transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
        >
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)',
            pointerEvents: 'none',
          }} />
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {children}
          </span>
        </motion.a>
      </>
    );
  }

  return (
    <>
      <GlassFilter />
      <motion.button
        onClick={onClick}
        style={combined}
        whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.13)', transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      >
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)',
          pointerEvents: 'none',
        }} />
        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {children}
        </span>
      </motion.button>
    </>
  );
}
