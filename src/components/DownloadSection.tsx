import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';

export function DownloadSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="pdf-guide"
      style={{
        background: '#1d1d1f',
        padding: 'clamp(64px, 10vw, 120px) clamp(16px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: 'clamp(36px, 6vw, 72px)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #2c2c2e 0%, #1c1c1e 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow accent */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '300px',
              height: '200px',
              background: 'radial-gradient(ellipse, rgba(0,102,204,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Icon */}
          <div
            style={{
              display: 'inline-flex',
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(0,102,204,0.15)',
              border: '1px solid rgba(0,102,204,0.25)',
              marginBottom: '24px',
            }}
          >
            <BookOpen size={28} strokeWidth={1.5} style={{ color: '#2997ff' }} />
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.05em',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            THE EXAM BIBLE
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: '500px',
              margin: '0 auto 12px',
              lineHeight: 1.6,
            }}
          >
            Complete study guide — First Principles · Memory Techniques · Exam Answers
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
              maxWidth: '400px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Built from 4 PYQs + Official Syllabus · 10 sections · Print to PDF · Score 70+/75
          </p>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '36px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { n: '10', label: 'Sections' },
              { n: '4', label: 'PYQs Analyzed' },
              { n: '75', label: 'Max Marks' },
              { n: '48h', label: 'Exam Prep' },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.04em' }}>
                  {n}
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="../exam_bible.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              padding: '14px 32px',
              borderRadius: '100px',
              background: '#0066cc',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              transition: 'background 0.2s, transform 0.15s',
              cursor: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#0077ed';
              el.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#0066cc';
              el.style.transform = 'scale(1)';
            }}
          >
            Open Study Guide
            <ExternalLink size={15} strokeWidth={1.5} />
          </a>

          {/* Byline */}
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.25)',
              marginTop: '20px',
            }}
          >
            Built by Aswath AS · SRM Institute · 2025
          </p>
        </motion.div>
      </div>
    </section>
  );
}
