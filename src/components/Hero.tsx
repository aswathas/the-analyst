import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HeroWordsPullUp } from './HeroWordsPullUp';

const NAV_LINKS = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Analysis', href: '#overview' },
  { label: 'PDF Guide', href: '#pdf-guide' },
  { label: 'About', href: '#about' },
];

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '600px',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Video background */}
      <video
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {/* Noise overlay */}
      <div className="noise-overlay" style={{ zIndex: 1 }} />

      {/* Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 35%, rgba(0,0,0,0.7) 100%)',
          zIndex: 2,
        }}
      />

      {/* Center-top pill nav */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '0 0 1.25rem 1.25rem',
          padding: '10px 28px',
          display: 'flex',
          gap: '28px',
          alignItems: 'center',
          zIndex: 10,
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: 'rgba(225,224,204,0.7)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 450,
              letterSpacing: '-0.01em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#E1E0CC')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(225,224,204,0.7)')}
          >
            {link.label}
          </a>
        ))}
      </motion.nav>

      {/* Bottom content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'clamp(24px, 4vw, 52px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          zIndex: 10,
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: huge title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              color: 'rgba(225,224,204,0.45)',
              fontSize: '11.5px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}
          >
            Because reading the textbook is optional, apparently
          </motion.p>
          <h1
            style={{
              fontSize: 'clamp(56px, 14vw, 168px)',
              color: '#E1E0CC',
              fontWeight: 500,
              letterSpacing: '-0.07em',
              lineHeight: 0.87,
              margin: 0,
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
          >
            <HeroWordsPullUp text="The Analyst" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
            style={{
              color: 'rgba(225,224,204,0.45)',
              fontSize: 'clamp(13px, 2vw, 16px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              marginTop: '14px',
            }}
          >
            Aswath AS
          </motion.p>
        </div>

        {/* Right: tagline + CTA */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '14px',
            flexShrink: 0,
            maxWidth: '300px',
            paddingBottom: '4px',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              color: 'rgba(225,224,204,0.55)',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.55,
              textAlign: 'right',
              margin: 0,
            }}
          >
            I got bored studying.<br />
            So I decoded every exam pattern<br />
            across 6 subjects. You're welcome.
          </motion.p>

          <motion.a
            href="#subjects"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.09)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#E1E0CC',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              transition: 'background 0.2s, border-color 0.2s',
              cursor: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(255,255,255,0.16)';
              el.style.borderColor = 'rgba(255,255,255,0.32)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(255,255,255,0.09)';
              el.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            Explore Subjects
            <ChevronDown size={14} strokeWidth={1.5} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
