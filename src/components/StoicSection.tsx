import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const QUOTES = [
  {
    text: 'The time will come when diligent research over long periods will bring to light things which now lie hidden. A single lifetime, even though entirely devoted to the sky, would not be enough for the investigation of so vast a subject… Many discoveries are reserved for ages still to come, when memory of us will have been effaced.',
    latin: null,
    author: 'Seneca',
    work: 'Naturales Quaestiones, VII',
    accent: '#c9a96e',
    small: true,
  },
  {
    text: 'While we are postponing, life speeds by.',
    latin: 'Dum differtur vita transcurrit.',
    author: 'Seneca',
    work: 'Epistulae Morales, I',
    accent: '#c9a96e',
    small: false,
  },
  {
    text: 'First say to yourself what you would be; and then do what you have to do.',
    latin: 'Primum dic tibi ipse quis sis.',
    author: 'Epictetus',
    work: 'Discourses, III.23',
    accent: '#8fb4d4',
    small: false,
  },
];

function StoicMedallion() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
      <div style={{
        position: 'absolute', inset: '-12px',
        borderRadius: '50%',
        border: '1px solid rgba(107,90,58,0.4)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: '-6px',
        borderRadius: '50%',
        border: '1px solid rgba(107,90,58,0.2)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        boxShadow: '0 0 60px 10px rgba(201,169,110,0.08)',
        pointerEvents: 'none',
      }} />
      <img
        src="/seneca.jpg"
        alt="Seneca the Younger — marble bust, Herculaneum"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '50%',
          display: 'block',
          filter: 'sepia(35%) brightness(0.82) contrast(1.1)',
          border: '2px solid rgba(107,90,58,0.5)',
        }}
      />
      <div style={{
        position: 'absolute', bottom: '-32px', left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        fontSize: '9px', fontWeight: 400,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        color: '#8a7450', fontFamily: 'Georgia, serif',
      }}>
        SENECA · c. 4 BC–65 AD
      </div>
    </div>
  );
}

function DrawLine({ delay = 0 }: { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, #6b5a3a, transparent)',
        transformOrigin: 'left center',
        margin: '18px 0',
      }}
    />
  );
}

export function StoicSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={ref}
      style={{
        background: '#1d1d1f',
        padding: 'clamp(64px, 10vw, 120px) clamp(16px, 6vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.08)' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)',
            gap: 'clamp(40px, 8vw, 100px)',
            alignItems: 'center',
          }}
          className="stoic-grid"
        >
          {/* LEFT: Medallion */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            style={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '44px' }}
          >
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%', height: '60%',
              background: 'radial-gradient(ellipse, rgba(201,169,110,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <StoicMedallion />
          </motion.div>

          {/* RIGHT: Quotes */}
          <div>
            {QUOTES.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.22, ease }}
                style={{ marginBottom: i < QUOTES.length - 1 ? '44px' : 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '1px', background: q.accent, opacity: 0.7 }} />
                  <span style={{
                    fontSize: '10px', fontWeight: 400, letterSpacing: '0.2em',
                    textTransform: 'uppercase', color: q.accent, opacity: 0.8,
                    fontFamily: 'Georgia, serif',
                  }}>
                    {q.author}
                  </span>
                </div>

                <blockquote style={{ margin: 0, padding: 0 }}>
                  <p style={{
                    fontSize: q.small ? 'clamp(14px, 1.9vw, 18px)' : 'clamp(18px, 2.8vw, 28px)',
                    fontWeight: 300,
                    color: '#d4c4a8',
                    lineHeight: q.small ? 1.7 : 1.35,
                    letterSpacing: q.small ? '0.005em' : '-0.01em',
                    margin: '0 0 10px',
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontStyle: 'italic',
                  }}>
                    &#8220;{q.text}&#8221;
                  </p>

                  {q.latin && (
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: 'rgba(201,169,110,0.45)',
                      letterSpacing: '0.06em',
                      margin: '0 0 8px',
                      fontFamily: 'Georgia, serif',
                      fontStyle: 'normal',
                    }}>
                      {q.latin}
                    </p>
                  )}

                  <cite style={{
                    fontSize: '10px',
                    fontWeight: 400,
                    color: 'rgba(138,116,80,0.6)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontStyle: 'normal',
                    fontFamily: 'Georgia, serif',
                    display: 'block',
                  }}>
                    — {q.work}
                  </cite>
                </blockquote>

                {i < QUOTES.length - 1 && <DrawLine delay={0.5 + i * 0.15} />}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.75, ease }}
              style={{
                marginTop: '36px',
                padding: '16px 20px',
                background: 'rgba(201,169,110,0.05)',
                border: '1px solid rgba(107,90,58,0.3)',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, transparent, #c9a96e, transparent)' }} />
              <p style={{
                fontSize: '12px',
                color: 'rgba(212,196,168,0.55)',
                lineHeight: 1.65,
                margin: 0,
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                letterSpacing: '0.01em',
              }}>
                Time is the only resource that cannot be reclaimed.
                You have <span style={{ color: '#c9a96e', fontStyle: 'normal' }}>one exam</span> — what you do with the hours before it
                is the only variable still in your control.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    </section>
  );
}
