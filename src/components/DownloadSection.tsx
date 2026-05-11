import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { BookOpen, FileSpreadsheet } from 'lucide-react';

export function DownloadSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="pdf-guide"
      style={{
        background: 'rgba(5,3,2,0.56)',
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
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 80px rgba(0,0,0,0.3)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top glass sheen */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent)',
            pointerEvents: 'none',
          }} />
          {/* Glow accent */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '400px',
              height: '240px',
              background: 'radial-gradient(ellipse, rgba(99,64,232,0.18) 0%, rgba(164,48,212,0.1) 50%, transparent 70%)',
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
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.04em' }}>
                  {n}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/DataScience_BeautifulGuide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                padding: '14px 36px', borderRadius: '100px',
                background: 'rgba(41,151,255,0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#ffffff', textDecoration: 'none',
                fontSize: '15px', fontWeight: 400, letterSpacing: '-0.022em',
                border: '1px solid rgba(41,151,255,0.5)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                transition: 'opacity 0.15s', cursor: 'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              <BookOpen size={14} strokeWidth={1.5} />
              Prep Guide
            </a>
            <a
              href="/DS_PYQ_MasterSheet.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                padding: '14px 36px', borderRadius: '100px',
                background: 'rgba(52,199,89,0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#34c759', textDecoration: 'none',
                fontSize: '15px', fontWeight: 400, letterSpacing: '-0.022em',
                border: '1px solid rgba(52,199,89,0.35)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                transition: 'opacity 0.15s', cursor: 'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              <FileSpreadsheet size={14} strokeWidth={1.5} />
              PYQ MasterSheet
            </a>
          </div>

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
