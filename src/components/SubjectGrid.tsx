import { motion } from 'framer-motion';
import { BarChart2, BookOpen, CheckCircle, Lock, FileSpreadsheet } from 'lucide-react';

interface Subject {
  code: string;
  name: string;
  status: 'complete' | 'coming';
  color: string;
  stats?: { papers: number; topics: number; marks: number; hitRate: string };
  findings?: string[];
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
  },
  { code: 'TBC', name: 'Cloud Computing using Blockchain', status: 'coming', color: '#7c3aed' },
  { code: 'TBC', name: 'Compiler Design', status: 'coming', color: '#0891b2' },
  { code: 'TBC', name: 'Advanced Cryptography', status: 'coming', color: '#dc2626' },
  { code: 'TBC', name: 'Software Engineering & Project Management', status: 'coming', color: '#059669' },
  { code: 'TBC', name: 'Hybrid Vehicles', status: 'coming', color: '#d97706' },
];

function openPDF() {
  window.open('/DataScience_BeautifulGuide.pdf', '_blank');
}

function SubjectCard({
  subject, index, onViewAnalysis,
}: {
  subject: Subject; index: number; onViewAnalysis: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Color bar */}
      <div style={{ height: '3px', background: subject.color }} />

      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '10px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: '#6e6e73', marginBottom: '5px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {subject.code}
            </div>
            <h3 style={{
              fontSize: '17px', fontWeight: 600, color: '#1d1d1f',
              margin: 0, letterSpacing: '-0.374px', lineHeight: 1.24,
            }}>
              {subject.name}
            </h3>
          </div>

          {subject.status === 'complete' ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 600, color: '#34c759',
              background: 'rgba(52,199,89,0.10)', padding: '4px 10px', borderRadius: '100px',
              flexShrink: 0, border: '1px solid rgba(52,199,89,0.2)',
            }}>
              <CheckCircle size={10} strokeWidth={2.5} />
              Complete
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 500, color: '#6e6e73',
              background: '#f5f5f7', padding: '4px 10px', borderRadius: '100px',
              flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)',
            }}>
              <Lock size={9} strokeWidth={2} />
              Soon
            </div>
          )}
        </div>

        {subject.status === 'complete' && subject.stats ? (
          <>
            {/* Stats grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px', background: 'rgba(0,0,0,0.06)', borderRadius: '12px',
              overflow: 'hidden', marginBottom: '18px',
            }}>
              {[
                { n: subject.stats.papers, l: 'Papers' },
                { n: subject.stats.topics, l: 'Topics' },
                { n: subject.stats.marks, l: 'Marks' },
                { n: subject.stats.hitRate, l: 'Q27' },
              ].map(({ n, l }) => (
                <div key={l} style={{ background: '#ffffff', padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '17px', fontWeight: 600, color: subject.color, letterSpacing: '-0.374px' }}>{n}</div>
                  <div style={{ fontSize: '10px', color: '#6e6e73', fontWeight: 400, marginTop: '2px' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Findings */}
            <div style={{ marginBottom: '20px' }}>
              {subject.findings!.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: subject.color, marginTop: '8px', flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '14px', color: '#6e6e73', lineHeight: 1.47, letterSpacing: '-0.224px' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={onViewAnalysis}
                  style={{
                    flex: 1, display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', gap: '6px',
                    padding: '11px 16px', borderRadius: '9999px',
                    background: '#0066cc', color: '#ffffff',
                    border: 'none', fontSize: '14px', fontWeight: 400,
                    letterSpacing: '-0.224px', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0077ed'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0066cc'; }}
                >
                  <BarChart2 size={13} strokeWidth={1.5} />
                  Analysis
                </button>
                <button
                  onClick={openPDF}
                  style={{
                    flex: 1, display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', gap: '6px',
                    padding: '10px 16px', borderRadius: '9999px',
                    background: 'transparent', color: '#0066cc',
                    border: '1px solid rgba(0,102,204,0.4)',
                    fontSize: '14px', fontWeight: 400,
                    letterSpacing: '-0.224px', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,102,204,0.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <BookOpen size={13} strokeWidth={1.5} />
                  PDF Guide
                </button>
              </div>
              <a
                href="/DS_PYQ_MasterSheet.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '10px 16px', borderRadius: '9999px',
                  background: 'rgba(0,102,204,0.06)', color: '#0066cc',
                  border: '1px solid rgba(0,102,204,0.2)',
                  fontSize: '13px', fontWeight: 400,
                  letterSpacing: '-0.224px', cursor: 'pointer',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,102,204,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,102,204,0.06)'; }}
              >
                <FileSpreadsheet size={13} strokeWidth={1.5} />
                PYQ MasterSheet
              </a>
            </div>
          </>
        ) : (
          <div style={{
            padding: '24px', borderRadius: '12px',
            background: '#f5f5f7',
            border: '1px dashed rgba(0,0,0,0.10)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: `${subject.color}14`, border: `1.5px solid ${subject.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <BarChart2 size={14} strokeWidth={1.5} style={{ color: subject.color }} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>Analysis in progress</div>
            <div style={{ fontSize: '12px', color: '#6e6e73', marginTop: '4px' }}>
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
  return (
    <section id="subjects" style={{
      background: '#f5f5f7',
      padding: 'clamp(56px, 8vw, 96px) clamp(16px, 5vw, 80px)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#6e6e73', marginBottom: '10px',
          }}>
            6 Subjects · SRM Institute
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: '#1d1d1f',
            letterSpacing: '-0.03em', lineHeight: 1.07, margin: '0 0 14px',
          }}>
            Every subject. Every pattern.
          </h2>
          <p style={{
            fontSize: '17px', fontWeight: 400, lineHeight: 1.47, color: '#6e6e73',
            margin: 0, letterSpacing: '-0.374px', maxWidth: '600px',
          }}>
            4 PYQs analyzed per subject. Topic heatmaps, exam strategy, and first-principles PDF guides.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {SUBJECTS.map((subject, i) => (
            <SubjectCard key={i} subject={subject} index={i} onViewAnalysis={onViewAnalysis} />
          ))}
        </div>
      </div>
    </section>
  );
}
