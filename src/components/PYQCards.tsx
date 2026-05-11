import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { FileText, CheckCircle } from 'lucide-react';

const PAPERS = [
  {
    year: 'May 2025',
    file: 'DS_May25_PYQ.pdf',
    highlights: ['Heavy wrangling focus', 'merge + groupby combo', 'Seaborn heatmap Q27'],
    color: '#0066cc',
  },
  {
    year: 'July 2025',
    file: 'DS_July25_PYQ.pdf',
    highlights: ['dropna/fillna emphasis', 'value_counts pattern', 'Bar chart visualization'],
    color: '#7c3aed',
  },
  {
    year: 'December 2025',
    file: 'DS_Dec25_PYQ.pdf',
    highlights: ['pivot_table + concat', 'Matplotlib subplots', 'sklearn pipeline Q28'],
    color: '#0891b2',
  },
  {
    year: 'December 2023',
    file: '21CSS303T.pdf',
    highlights: ['Baseline question set', 'Part C both options', 'DataFrame CRUD heavy'],
    color: '#059669',
  },
];

export function PYQCards({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}
    >
      {PAPERS.map((paper, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: dark ? '#1c1c1e' : '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: paper.color,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <FileText size={18} strokeWidth={1.5} style={{ color: paper.color, marginTop: '1px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: dark ? '#ffffff' : '#1d1d1f' }}>{paper.year}</div>
              <div style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontFamily: "'JetBrains Mono', monospace" }}>
                {paper.file}
              </div>
            </div>
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontWeight: 600,
                color: '#10b981',
                background: dark ? 'rgba(48,209,88,0.15)' : '#d1fae5',
                padding: '2px 8px',
                borderRadius: '100px',
                flexShrink: 0,
                border: dark ? '1px solid rgba(48,209,88,0.3)' : 'none',
              }}
            >
              <CheckCircle size={10} strokeWidth={2} />
              Analyzed
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {paper.highlights.map((h, j) => (
              <div key={j} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: paper.color,
                    marginTop: '6px',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '12px', color: dark ? 'rgba(255,255,255,0.65)' : '#4b5563', lineHeight: 1.45 }}>{h}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
