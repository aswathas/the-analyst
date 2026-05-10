import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { BarChart2, BookOpen, ArrowRight, CheckCircle, Lock } from 'lucide-react';

interface Subject {
  code: string;
  name: string;
  status: 'complete' | 'coming';
  color: string;
  stats?: { papers: number; topics: number; marks: number; hitRate: string };
  findings?: string[];
  analysisHref?: string;
  pdfHref?: string;
}

const SUBJECTS: Subject[] = [
  {
    code: '21CSS303T',
    name: 'Data Science',
    status: 'complete',
    color: '#0066cc',
    stats: { papers: 4, topics: 15, marks: 75, hitRate: '100%' },
    findings: [
      'Q27 = Data Wrangling in ALL 3 recent papers',
      'Pandas + Matplotlib appear in every paper',
      'Safe combo: Wrangling + Viz + 1 ML = 65/75',
    ],
    analysisHref: '#overview',
    pdfHref: '../exam_bible.html',
  },
  {
    code: 'TBC',
    name: 'Cloud Computing using Blockchain',
    status: 'coming',
    color: '#7c3aed',
  },
  {
    code: 'TBC',
    name: 'Compiler Design',
    status: 'coming',
    color: '#0891b2',
  },
  {
    code: 'TBC',
    name: 'Advanced Cryptography',
    status: 'coming',
    color: '#dc2626',
  },
  {
    code: 'TBC',
    name: 'Software Engineering & Project Management',
    status: 'coming',
    color: '#059669',
  },
  {
    code: 'TBC',
    name: 'Hybrid Vehicles',
    status: 'coming',
    color: '#d97706',
  },
];

function SubjectCard({ subject, index, inView, onViewAnalysis }: { subject: Subject; index: number; inView: boolean; onViewAnalysis: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.58, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 28px rgba(0,0,0,0.09)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Color bar */}
      <div style={{ height: '3px', background: subject.color }} />

      <div style={{ padding: '22px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '10px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {subject.code}
            </div>
            <h3 style={{
              fontSize: '15.5px', fontWeight: 600, color: '#1d1d1f',
              margin: 0, letterSpacing: '-0.02em', lineHeight: 1.25,
            }}>
              {subject.name}
            </h3>
          </div>
          {subject.status === 'complete' ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '10px', fontWeight: 700, color: '#10b981',
              background: '#d1fae5', padding: '3px 10px', borderRadius: '100px',
              flexShrink: 0, border: '1px solid #a7f3d0',
            }}>
              <CheckCircle size={10} strokeWidth={2.5} />
              Complete
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '10px', fontWeight: 600, color: '#9ca3af',
              background: '#f3f4f6', padding: '3px 10px', borderRadius: '100px',
              flexShrink: 0,
            }}>
              <Lock size={9} strokeWidth={2} />
              Soon
            </div>
          )}
        </div>

        {subject.status === 'complete' && subject.stats ? (
          <>
            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px', background: '#f3f4f6', borderRadius: '10px',
              overflow: 'hidden', marginBottom: '14px',
            }}>
              {[
                { n: subject.stats.papers, l: 'Papers' },
                { n: subject.stats.topics, l: 'Topics' },
                { n: subject.stats.marks, l: 'Marks' },
                { n: subject.stats.hitRate, l: 'Q27' },
              ].map(({ n, l }) => (
                <div key={l} style={{ background: '#fff', padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: subject.color, letterSpacing: '-0.03em' }}>{n}</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500, marginTop: '1px' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Findings */}
            <div style={{ marginBottom: '16px' }}>
              {subject.findings!.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: subject.color, marginTop: '7px', flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.45 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onViewAnalysis}
                style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '5px', padding: '9px 12px',
                  borderRadius: '10px', background: subject.color, color: '#fff',
                  border: 'none', fontSize: '12px', fontWeight: 600,
                  transition: 'opacity 0.15s', cursor: 'none',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
              >
                <BarChart2 size={12} strokeWidth={1.5} />
                Analysis
                <ArrowRight size={11} strokeWidth={1.5} />
              </button>
              <a href={subject.pdfHref} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', gap: '5px', padding: '9px 12px',
                  borderRadius: '10px', background: '#f9fafb', color: '#374151',
                  textDecoration: 'none', fontSize: '12px', fontWeight: 600,
                  border: '1px solid #e5e7eb', transition: 'background 0.15s', cursor: 'none',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#f3f4f6')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#f9fafb')}
              >
                <BookOpen size={12} strokeWidth={1.5} />
                PDF Guide
              </a>
            </div>
          </>
        ) : (
          <div style={{
            padding: '20px', borderRadius: '10px',
            background: '#fafafa', border: '1px dashed #e5e7eb',
            textAlign: 'center',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: `${subject.color}14`, border: `1.5px solid ${subject.color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
            }}>
              <BarChart2 size={14} strokeWidth={1.5} style={{ color: subject.color }} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Analysis in progress</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>
              PYQs → Pattern → Guide
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface GridProps {
  onViewAnalysis: () => void;
}

export function SubjectGrid({ onViewAnalysis }: GridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="subjects" style={{
      background: '#f5f5f7',
      padding: 'clamp(56px, 8vw, 96px) clamp(16px, 5vw, 80px)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#0066cc', background: '#eff6ff',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '12px',
          }}>
            6 Subjects · SRM Institute
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#1d1d1f',
            letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 10px',
          }}>
            Every subject. Every pattern.
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            4 PYQs analyzed per subject. Topic heatmaps, exam strategy, and first-principles PDF guides.
          </p>
        </div>

        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {SUBJECTS.map((subject, i) => (
            <SubjectCard key={i} subject={subject} index={i} inView={inView} onViewAnalysis={onViewAnalysis} />
          ))}
        </div>
      </div>
    </section>
  );
}
