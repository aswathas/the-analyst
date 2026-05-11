import { motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function StoicSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      style={{
        background: '#272729',
        padding: 'clamp(72px, 12vw, 140px) clamp(24px, 8vw, 120px)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            width: '32px',
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
            margin: '0 auto 40px',
          }} />

          <blockquote style={{ margin: 0, padding: 0 }}>
            <p style={{
              fontSize: 'clamp(20px, 3.5vw, 32px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              margin: '0 0 28px',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
            }}>
              "While we are postponing, life speeds by."
            </p>

            <cite style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontStyle: 'normal',
              fontFamily: 'Georgia, serif',
            }}>
              Seneca · Epistulae Morales, I
            </cite>
          </blockquote>

          <div style={{
            width: '32px',
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
            margin: '40px auto 0',
          }} />
        </motion.div>
      </div>
    </section>
  );
}
