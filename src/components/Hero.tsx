import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, BarChart2, BookOpen, FileSpreadsheet } from 'lucide-react';

const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

interface HeroProps {
  onViewAnalysis: () => void;
}

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(18,18,18,0.96)',
  backdropFilter: 'saturate(180%) blur(24px)',
  WebkitBackdropFilter: 'saturate(180%) blur(24px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '14px',
  padding: '6px',
  minWidth: '180px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
  zIndex: 100,
  overflow: 'hidden',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  padding: '10px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  color: 'rgba(255,255,255,0.85)',
  cursor: 'none',
  textDecoration: 'none',
  transition: 'background 0.15s',
  whiteSpace: 'nowrap',
};

export function Hero({ onViewAnalysis }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const videoYRaw = useTransform(scrollY, [0, 700], ['0%', '20%']);
  const heroOpacityRaw = useTransform(scrollY, [0, 450], [1, 0]);
  const heroYRaw = useTransform(scrollY, [0, 450], ['0%', '10%']);
  const videoY = prefersReducedMotion ? '0%' : videoYRaw;
  const heroOpacity = prefersReducedMotion ? 1 : heroOpacityRaw;
  const heroY = prefersReducedMotion ? '0%' : heroYRaw;

  const [openDropdown, setOpenDropdown] = useState<'analysis' | 'pdf' | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '640px',
        overflow: 'hidden',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Video */}
      <motion.video
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '-7.5%',
          left: 0,
          width: '100%',
          height: '115%',
          objectFit: 'cover',
          opacity: 0.75,
          zIndex: 0,
          y: isMobile ? '0%' : videoY,
        }}
      />

      {/* Cinematic gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.68) 78%, rgba(0,0,0,0.96) 100%)',
          zIndex: 2,
        }}
      />

      {/* Center-top pill nav */}
      <motion.nav
        ref={navRef}
        className="hero-nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderRadius: '0 0 20px 20px',
          padding: '11px clamp(12px, 4vw, 28px)',
          display: 'flex',
          gap: 'clamp(12px, 3vw, 24px)',
          alignItems: 'center',
          zIndex: 20,
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <a
          href="#subjects"
          style={{ color: 'rgba(225,224,204,0.7)', textDecoration: 'none', fontSize: '12px', fontWeight: 400, letterSpacing: '-0.01em', transition: 'color 0.2s', cursor: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#E1E0CC')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(225,224,204,0.7)')}
        >
          Subjects
        </a>

        {/* Analysis dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'analysis' ? null : 'analysis')}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: openDropdown === 'analysis' ? '#E1E0CC' : 'rgba(225,224,204,0.7)',
              background: 'none', border: 'none', padding: 0,
              fontSize: '12px', fontWeight: 400, letterSpacing: '-0.01em',
              cursor: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E1E0CC')}
            onMouseLeave={e => { if (openDropdown !== 'analysis') e.currentTarget.style.color = 'rgba(225,224,204,0.7)'; }}
          >
            Analysis
            <motion.span animate={{ rotate: openDropdown === 'analysis' ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
              <ChevronDown size={11} strokeWidth={2} />
            </motion.span>
          </button>
          <AnimatePresence>
            {openDropdown === 'analysis' && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={dropdownStyle}
              >
                <button
                  onClick={() => { onViewAnalysis(); setOpenDropdown(null); }}
                  style={{ ...dropdownItemStyle, width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <BarChart2 size={13} strokeWidth={1.5} style={{ color: '#2997ff', flexShrink: 0 }} />
                  Data Science
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PDF Guide dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenDropdown(openDropdown === 'pdf' ? null : 'pdf')}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: openDropdown === 'pdf' ? '#E1E0CC' : 'rgba(225,224,204,0.7)',
              background: 'none', border: 'none', padding: 0,
              fontSize: '12px', fontWeight: 400, letterSpacing: '-0.01em',
              cursor: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E1E0CC')}
            onMouseLeave={e => { if (openDropdown !== 'pdf') e.currentTarget.style.color = 'rgba(225,224,204,0.7)'; }}
          >
            PDF Guide
            <motion.span animate={{ rotate: openDropdown === 'pdf' ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex' }}>
              <ChevronDown size={11} strokeWidth={2} />
            </motion.span>
          </button>
          <AnimatePresence>
            {openDropdown === 'pdf' && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={dropdownStyle}
              >
                <button
                  onClick={() => { window.open('/DataScience_BeautifulGuide.pdf', '_blank'); setOpenDropdown(null); }}
                  style={{ ...dropdownItemStyle, width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <BookOpen size={13} strokeWidth={1.5} style={{ color: '#2997ff', flexShrink: 0 }} />
                  Prep Guide
                </button>
                <button
                  onClick={() => { window.open('/DS_PYQ_MasterSheet.pdf', '_blank'); setOpenDropdown(null); }}
                  style={{ ...dropdownItemStyle, width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <FileSpreadsheet size={13} strokeWidth={1.5} style={{ color: '#34c759', flexShrink: 0 }} />
                  PYQ MasterSheet
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <a
          href="#about"
          style={{ color: 'rgba(225,224,204,0.7)', textDecoration: 'none', fontSize: '12px', fontWeight: 400, letterSpacing: '-0.01em', transition: 'color 0.2s', cursor: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#E1E0CC')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(225,224,204,0.7)')}
        >
          About
        </a>
      </motion.nav>

      {/* Bottom content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: 'clamp(20px, 4vw, 52px)',
          paddingBottom: 'clamp(28px, 5vw, 64px)',
          opacity: heroOpacity,
          y: heroY,
        }}
      >
        <div className="hero-grid">

          {/* Left: title */}
          <div className="hero-col-title">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                color: 'rgba(225,224,204,0.4)',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Let our scars fall in love.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(52px, 11vw, 148px)',
                color: '#E1E0CC',
                fontWeight: 600,
                letterSpacing: '-0.07em',
                lineHeight: 0.87,
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
              }}
            >
              The Analyst
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                color: 'rgba(225,224,204,0.38)',
                fontSize: '13px',
                fontWeight: 400,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: '10px',
              }}
            >
              Aswath AS
            </motion.p>

          </div>

          {/* Right: tagline + CTAs */}
          <div className="hero-col-tagline" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingBottom: '8px',
          }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: 'rgba(225,224,204,0.55)',
                fontSize: 'clamp(14px, 4vw, 17px)',
                fontWeight: 400,
                lineHeight: 1.47,
                letterSpacing: '-0.022em',
                margin: 0,
              }}
            >
              I got bored studying.<br />
              So I decoded every exam pattern<br />
              across 6 subjects. You're welcome.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
            >
              <button
                onClick={onViewAnalysis}
                style={{
                  background: '#0066cc',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  cursor: 'none',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2997ff')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0066cc')}
              >
                View Analysis
              </button>
              <a
                href="#subjects"
                style={{
                  color: 'rgba(225,224,204,0.85)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  cursor: 'none',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#E1E0CC'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(225,224,204,0.85)'; }}
              >
                Explore Subjects
              </a>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
